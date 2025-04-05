CREATE TABLE tips.tips (
  id SERIAL PRIMARY KEY,
  total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
  collected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

CREATE TABLE tips.payment_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  details TEXT
);

CREATE TABLE tips.payment_transactions (
  id SERIAL PRIMARY KEY,
  tip_id INTEGER NOT NULL REFERENCES tips.tips(id) ON DELETE CASCADE,
  payment_method_id INTEGER NOT NULL REFERENCES tips.payment_methods(id) ON DELETE SET NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  receipt_number VARCHAR(100)
);

INSERT INTO tips.payment_methods (name, details)
VALUES 
  ('Efectivo', NULL),
  ('BBVA 1234', NULL),
  ('Santander 1234', NULL);
