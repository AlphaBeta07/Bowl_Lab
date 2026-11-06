-- BOWL LAB Seed Data

INSERT INTO categories (id, name, description, sort_order, is_active) VALUES
('bases', 'Bases', 'The wholesome foundation of your custom bowl', 1, true),
('proteins', 'Proteins', 'Premium sashimi, lean meats, and organic plant proteins', 2, true),
('vegetables', 'Vegetables', 'Farm-fresh raw and pickled veggies for crunch & color', 3, true),
('toppings', 'Toppings', 'Crispy elements, roasted seeds, and umami garnishes', 4, true),
('sauces', 'Sauces', 'Chef-crafted dressings and drizzle reductions', 5, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO restaurant_settings (id, restaurant_name, tagline, logo_url, address, phone, opening_hours, delivery_enabled, pickup_enabled, tax_percentage, delivery_fee, minimum_order)
VALUES (
  'bowl-lab-main',
  'BOWL LAB',
  'Fresh Poke & Grain Bowls Built By You',
  '/images/branding/logo.svg',
  '12th Main, Indiranagar, Bengaluru, Karnataka 560038',
  '+91 98765 43210',
  '11:00 AM – 11:00 PM Daily',
  true,
  true,
  5.00,
  49.00,
  150.00
)
ON CONFLICT (id) DO UPDATE SET
  restaurant_name = EXCLUDED.restaurant_name,
  tagline = EXCLUDED.tagline,
  address = EXCLUDED.address;

INSERT INTO coupons (code, discount_type, discount_value, minimum_order, is_active) VALUES
('BOWLLAB50', 'fixed', 50.00, 300.00, true),
('FIRSTBOWL', 'percentage', 20.00, 200.00, true),
('FREESHIP', 'fixed', 49.00, 250.00, true)
ON CONFLICT (code) DO NOTHING;

