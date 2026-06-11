CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- enums
CREATE TYPE reservation_status AS ENUM (
  'pending', 'confirmed', 'in_progress', 'done', 'rejected', 'cancelled'
);
CREATE TYPE notification_channel AS ENUM ('whatsapp', 'email');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');

-- admin
CREATE TABLE admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- service
CREATE TABLE service (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price_estimate DECIMAL(12,2),
  duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- shop_config (satu row, config global bengkel)
CREATE TABLE shop_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  open_days INT[] NOT NULL DEFAULT '{1,2,3,4,5,6}',
  open_time TIME NOT NULL DEFAULT '08:00',
  close_time TIME NOT NULL DEFAULT '17:00',
  max_bookings_per_day INT NOT NULL DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- shop_closures (tanggal tutup manual + libur nasional)
CREATE TABLE shop_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  is_national_holiday BOOLEAN DEFAULT FALSE,
  is_overridden BOOLEAN DEFAULT FALSE,
  is_closed BOOLEAN DEFAULT TRUE,
  note TEXT
);

-- reservation
CREATE TABLE reservation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(50) NOT NULL UNIQUE,
  service_id UUID NOT NULL REFERENCES service(id),
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_vehicle VARCHAR(255),
  notes TEXT,
  reschedule_willing BOOLEAN DEFAULT FALSE,
  reschedule_date_from DATE,
  reschedule_date_to DATE,
  reschedule_time_from TIME,
  reschedule_time_to TIME,
  status reservation_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- reservation_log
CREATE TABLE reservation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservation(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES admin(id),
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  note TEXT,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- notification
CREATE TABLE notification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservation(id) ON DELETE CASCADE,
  channel notification_channel NOT NULL,
  status notification_status DEFAULT 'pending',
  payload TEXT,
  sent_at TIMESTAMP
);

-- settings
CREATE TABLE settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- seed: default shop config
INSERT INTO shop_config (open_days, open_time, close_time, max_bookings_per_day)
VALUES ('{1,2,3,4,5,6}', '08:00', '17:00', 10);

-- seed: default settings
INSERT INTO settings (key, value) VALUES ('wa_number', '628xxxxxxxxxx');

-- seed: admin
INSERT INTO admin (id, username, password_hash, email)
VALUES (
  gen_random_uuid(),
  'admin',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin@cipendawa.com'
);