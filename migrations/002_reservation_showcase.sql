ALTER TYPE notification_status ADD VALUE IF NOT EXISTS 'simulated';

CREATE TABLE IF NOT EXISTS branch (
 code VARCHAR(30) PRIMARY KEY,
 name VARCHAR(100) NOT NULL
);
INSERT INTO branch (code, name) VALUES
 ('utama', 'Cipendawa Utama'), ('cianjur2', 'Cipendawa Cianjur 2'), ('sukabumi', 'Cipendawa Sukabumi')
ON CONFLICT (code) DO NOTHING;

INSERT INTO service (id, name, category) VALUES
 ('c1e00000-0000-4000-8000-000000000001', 'Body Repair', 'body_repair'),
 ('c1e00000-0000-4000-8000-000000000002', 'Service', 'service'),
 ('c1e00000-0000-4000-8000-000000000003', 'Sparepart & Variasi', 'sparepart')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE reservation
 ADD COLUMN service_code VARCHAR(30),
 ADD COLUMN branch_code VARCHAR(30) REFERENCES branch(code),
 ADD COLUMN preferred_period VARCHAR(10),
 ADD COLUMN customer_email VARCHAR(254),
 ADD COLUMN idempotency_key UUID UNIQUE,
 ADD COLUMN request_hash CHAR(64);
ALTER TABLE reservation ADD CONSTRAINT reservation_service_code_check CHECK (service_code IN ('body_repair', 'service', 'sparepart'));
ALTER TABLE reservation ADD CONSTRAINT reservation_period_check CHECK (preferred_period IN ('pagi', 'siang', 'sore'));

