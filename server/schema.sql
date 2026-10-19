CREATE DATABASE IF NOT EXISTS contactdb;
USE contactdb;

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  address VARCHAR(255) NOT NULL,
  category ENUM('family', 'friend', 'work', 'other') NOT NULL DEFAULT 'other',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts (full_name, phone, email, address, category, is_favorite) VALUES
  ('Maria Santos', '0917 000 0001', 'maria.santos@example.com', '12 Rizal St, Tarlac City', 'family', TRUE),
  ('Juan Dela Cruz', '0917 000 0002', 'juan.delacruz@example.com', '45 MacArthur Hwy, Tarlac City', 'friend', FALSE),
  ('Ana Reyes', '0917 000 0003', 'ana.reyes@example.com', '8 Burgos Ave, Capas, Tarlac', 'work', FALSE);