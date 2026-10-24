import { bookingFields, isBookingReceipt } from "@/lib/api/booking";

const maxBodyBytes = 16 * 1024;
const unavailable = "Reservasi belum dapat disimpan. Silakan coba lagi.";

function failure(message: string, status: number) {
  return Response.json({ success: false, message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function readBounded(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) return "";
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        await reader.cancel();
        throw new RangeError("body limit");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export async function POST(request: Request) {
  const key = request.headers.get("Idempotency-Key") ?? "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(key)) {
    return failure("Kunci reservasi tidak valid. Muat ulang halaman lalu coba lagi.", 400);
  }
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return failure("Gunakan format JSON untuk reservasi.", 415);
  }
  if (Number(request.headers.get("content-length")) > maxBodyBytes) return failure("Isian terlalu besar.", 413);

  let body: string;
  try {
    body = await readBounded(request.body);
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return failure("Isian reservasi tidak valid.", 400);
  } catch (error) {
    return failure(error instanceof RangeError ? "Isian terlalu besar." : "Isian reservasi tidak valid.", error instanceof RangeError ? 413 : 400);
  }

  try {
    const base = new URL(process.env.BACKEND_API_URL || "http://127.0.0.1:8080/api");
    if (!["http:", "https:"].includes(base.protocol) || base.username || base.password || base.search || base.hash) {
      return failure(unavailable, 503);
    }
    const endpoint = new URL(`${base.pathname.replace(/\/$/, "")}/reservations`, base.origin);
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Idempotency-Key": key },
      body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    const result = JSON.parse(await readBounded(upstream.body));
    if ((upstream.status === 200 || upstream.status === 201) && result?.success === true && isBookingReceipt(result.data)) {
      const receipt = result.data;
      return Response.json({
        success: true,
        message: "Reservasi tersimpan.",
        data: {
          booking_code: receipt.booking_code,
          status: receipt.status,
          notification: { mode: receipt.notification.mode, status: receipt.notification.status, message: receipt.notification.message },
        },
      }, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
    }
    if (upstream.status >= 400 && upstream.status < 500) {
      const errors: Record<string, string> = {};
      for (const field of bookingFields) {
        const message = result?.errors?.[field];
        if (typeof message === "string" && message.length <= 500) errors[field] = message;
      }
      const message = upstream.status === 409
        ? "Isian berbeda dari percobaan sebelumnya. Periksa isian sebelum mencoba lagi."
        : "Reservasi belum disimpan. Periksa isian lalu coba lagi.";
      return Response.json({ success: false, message, errors }, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
    }
    return failure(unavailable, 503);
  } catch {
    return failure(unavailable, 503);
  }
}
