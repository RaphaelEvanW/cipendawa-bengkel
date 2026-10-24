# Reservation Showcase Backend Implementation Plan

**Goal:** Save real reservations in local PostgreSQL and return an explicitly simulated WhatsApp message.

**Architecture:** Extend the existing Go/Gin/GORM reservation module and PostgreSQL schema. Next.js forwards submissions through its server route, keeping the backend URL server-side. Persist the reservation and simulated notification in one transaction; retry using the same idempotency key returns the original receipt.

**Tech stack:** Existing Go, Gin, GORM, PostgreSQL, Next.js and React. No paid provider, admin panel, live WhatsApp transport, queue infrastructure, or automatic branch transfer.

**Spec:** User decisions in this chat, PRODUCT.md and docs/reservation-frontend.md. All branches accept all three services. A branch is the customer's visit destination. Complex work transfer is manual.

## Contract

`POST /api/reservations`, JSON, header `Idempotency-Key` containing a UUID.

Request fields: `service_code` (body_repair/service/sparepart), `branch_code` (utama/cianjur2/sukabumi), `reservation_date` (YYYY-MM-DD), `preferred_period` (pagi/siang/sore), `customer_name`, `customer_phone`, optional `customer_email`, `customer_vehicle`, `notes`.

Successful response: `{success:true,message:string,data:{booking_code:string,status:"pending",notification:{mode:"mock",status:"simulated",message:string}}}`. New submission uses 201; identical retry uses 200. Validation uses 422 with `{success:false,message:string,errors:Record<string,string>}`; key conflict uses 409; storage failure uses a generic 503. Malformed/oversized bodies are rejected. Never return raw database errors.

Normalize phone to 62 format. Validate name 2–100 characters, vehicle ≤120, notes ≤1000, email ≤254 and valid if supplied. Validate service and branch against canonical codes. Use Asia/Jakarta, reject past dates, Sundays, and periods already ended today. Periods are preferences, not capacity promises. Require server validation even after frontend validation.

## Tasks

- [x] Extend reservation schema with branch, service code, period, email, idempotency key and normalized-request hash; seed canonical service UUIDs and three branches without deleting legacy data.
- [x] Write meaningful failing Go tests for validation, idempotency replay/conflict, storage failure and HTTP request handling. Implement transactional reservation plus simulated notification storage. No outbound notification requests.
- [x] Configure DB TLS/pooling, explicit CORS origins, local-only showcase defaults, mock notification mode, and register only active public routes. Existing admin/status code remains inactive.
- [x] Add a Next.js POST proxy and connect the existing review screen to actual submission. Preserve pending/retry state, stable idempotency key, recoverable errors, and explicit distinction between saved reservation and simulated WhatsApp.
- [x] Verify PostgreSQL persistence, rollback and concurrent idempotency using an isolated test database/schema. Run Go tests, frontend build and targeted lint. Review changes independently.
- [x] Update env examples and setup/API documentation, including migration order and zero-cost local scope.

## Review Focus

- Server validation must use Jakarta dates even when the machine timezone differs.
- Invalid inputs never write a reservation or notification.
- A retry must not create another reservation or simulated message.
- A database or notification-record failure must not show success in the UI.
- Existing unrelated records and the user's branch remain intact; no public lookup by phone and no live WhatsApp delivery.
