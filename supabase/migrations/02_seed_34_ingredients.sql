-- 02_seed_34_ingredients.sql
-- Seed the complete, authoritative BOWL LAB 34 ingredients catalog:
-- 10 Bases, 10 Proteins, 14 Veggies

INSERT INTO categories (id, name, description, sort_order, is_active)
VALUES
  ('bases', 'Bases', 'The wholesome foundation of your custom bowl', 1, true),
  ('proteins', 'Proteins', 'Premium sashimi, lean meats, and organic plant proteins', 2, true),
  ('vegetables', 'Vegetables', 'Farm-fresh raw and pickled veggies for crunch & color', 3, true),
  ('toppings', 'Toppings', 'Crispy elements, roasted seeds, and umami garnishes', 4, true),
  ('sauces', 'Sauces', 'Chef-crafted dressings and drizzle reductions', 5, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

INSERT INTO ingredients (id, category_id, name, description, image_url, price, allergens, dietary_tags, is_available, default_quantity)
VALUES
  -- 1. BASES (10)
  ('sushi-rice', 'bases', 'Sushi Rice', 'Fluffy seasoned short-grain Japanese sushi rice', '/images/ingredients/bases/sushi-rice.svg', 40.00, '{}', '{"Vegan","Gluten-Free"}', true, 1),
  ('white-rice', 'bases', 'Steamed White Rice', 'Aromatic, perfectly steamed long-grain white rice', '/images/ingredients/bases/white-rice.svg', 35.00, '{}', '{"Vegan","Gluten-Free"}', true, 1),
  ('brown-rice', 'bases', 'Brown Rice', 'Nutty whole grain brown rice rich in fiber', '/images/ingredients/bases/brown-rice.svg', 50.00, '{}', '{"Vegan","High-Fiber"}', true, 1),
  ('quinoa', 'bases', 'Quinoa', 'Protein-packed fluffy organic tricolor quinoa', '/images/ingredients/bases/quinoa.svg', 70.00, '{}', '{"Vegan","Gluten-Free","Superfood"}', true, 1),
  ('jasmine-rice', 'bases', 'Jasmine Rice', 'Delicately fragrant Thai long-grain jasmine rice', '/images/ingredients/bases/jasmine-rice.svg', 45.00, '{}', '{"Vegan","Gluten-Free"}', true, 1),
  ('cauliflower-rice', 'bases', 'Cauliflower Rice', 'Fresh riced cauliflower pearls with fresh herbs', '/images/ingredients/bases/cauliflower-rice.svg', 65.00, '{}', '{"Vegan","Keto","Low-Carb"}', true, 1),
  ('mixed-greens', 'bases', 'Mixed Greens', 'Crunchy romaine, tender baby spinach & peppery arugula', '/images/ingredients/bases/mixed-greens.svg', 40.00, '{}', '{"Vegan","Keto","Low-Calorie"}', true, 1),
  ('iceberg-lettuce', 'bases', 'Iceberg Lettuce', 'Crisp, refreshing shredded iceberg lettuce leaves', '/images/ingredients/bases/iceberg-lettuce.svg', 35.00, '{}', '{"Vegan","Hydrating"}', true, 1),
  ('soba-noodles', 'bases', 'Soba Noodles', 'Chilled Japanese buckwheat noodles tossed lightly in sesame', '/images/ingredients/bases/soba-noodles.svg', 60.00, '{"Wheat"}', '{"Vegetarian"}', true, 1),
  ('whole-wheat-noodles', 'bases', 'Whole Wheat Noodles', 'Hearty whole wheat ramen ribbons with satisfying bite', '/images/ingredients/bases/whole-wheat-noodles.svg', 55.00, '{"Wheat"}', '{"Vegetarian","High-Fiber"}', true, 1),

  -- 2. PROTEINS (10)
  ('salmon', 'proteins', 'Fresh Salmon', 'Sashimi-grade Norwegian salmon cubes', '/images/ingredients/proteins/salmon.svg', 130.00, '{"Fish"}', '{"High-Protein","Omega-3","Keto"}', true, 1),
  ('ahi-tuna', 'proteins', 'Ahi Tuna', 'Ruby red line-caught sashimi tuna chunks', '/images/ingredients/proteins/ahi-tuna.svg', 130.00, '{"Fish"}', '{"High-Protein","Lean"}', true, 1),
  ('grilled-chicken', 'proteins', 'Grilled Chicken', 'Tender chicken breast seared with garlic herb rub', '/images/ingredients/proteins/grilled-chicken.svg', 90.00, '{}', '{"High-Protein","Halal"}', true, 1),
  ('crispy-tofu', 'proteins', 'Crispy Tofu', 'Golden seared organic non-GMO tofu bites', '/images/ingredients/proteins/crispy-tofu.svg', 50.00, '{"Soy"}', '{"Vegan","Gluten-Free"}', true, 1),
  ('paneer', 'proteins', 'Herbed Paneer', 'Soft cottage cheese cubes tossed in fresh herbs', '/images/ingredients/proteins/paneer.svg', 60.00, '{"Dairy"}', '{"Vegetarian","High-Protein"}', true, 1),
  ('falafel', 'proteins', 'Golden Falafel', 'Crispy spiced chickpea patties with fresh cilantro', '/images/ingredients/proteins/falafel.svg', 55.00, '{}', '{"Vegan","Gluten-Free"}', true, 1),
  ('teriyaki-chicken', 'proteins', 'Teriyaki Chicken', 'Juicy chicken strips with sweet savory soy glaze & sesame', '/images/ingredients/proteins/teriyaki-chicken.svg', 95.00, '{"Soy"}', '{"High-Protein","Halal"}', true, 1),
  ('spicy-shrimp', 'proteins', 'Spicy Shrimp', 'Succulent seared tiger shrimp tossed in chili garlic spices', '/images/ingredients/proteins/spicy-shrimp.svg', 120.00, '{"Shellfish"}', '{"High-Protein","Keto"}', true, 1),
  ('boiled-egg', 'proteins', 'Boiled Egg', 'Farm-fresh soft-boiled egg halves with golden yolk', '/images/ingredients/proteins/boiled-egg.svg', 30.00, '{"Egg"}', '{"Vegetarian","High-Protein"}', true, 1),
  ('chickpeas', 'proteins', 'Chickpeas', 'Roasted golden garbanzo beans seasoned with cumin & paprika', '/images/ingredients/proteins/chickpeas.svg', 45.00, '{}', '{"Vegan","High-Fiber","Gluten-Free"}', true, 1),

  -- 3. VEGETABLES (14)
  ('cucumber', 'vegetables', 'Cucumber', 'Hydrating crisp Japanese cucumber rounds', '/images/ingredients/vegetables/cucumber.svg', 15.00, '{}', '{"Vegan","Hydrating"}', true, 1),
  ('avocado', 'vegetables', 'Avocado', 'Creamy ripe Hass avocado fan slices', '/images/ingredients/vegetables/avocado.svg', 40.00, '{}', '{"Vegan","Healthy-Fats"}', true, 1),
  ('carrots', 'vegetables', 'Carrots', 'Crisp sweet julienne carrot matchsticks', '/images/ingredients/vegetables/carrots.svg', 15.00, '{}', '{"Vegan","Crunchy"}', true, 1),
  ('red-cabbage', 'vegetables', 'Red Cabbage', 'Crunchy shredded purple cabbage slaw', '/images/ingredients/vegetables/red-cabbage.svg', 15.00, '{}', '{"Vegan","Antioxidants"}', true, 1),
  ('edamame', 'vegetables', 'Edamame', 'Steamed young soybeans lightly sea salted', '/images/ingredients/vegetables/edamame.svg', 30.00, '{"Soy"}', '{"Vegan","Plant-Protein"}', true, 1),
  ('sweet-corn', 'vegetables', 'Sweet Corn', 'Charred sweet corn kernels with smoky note', '/images/ingredients/vegetables/corn.svg', 20.00, '{}', '{"Vegan"}', true, 1),
  ('cherry-tomatoes', 'vegetables', 'Cherry Tomatoes', 'Sweet burst cherry tomato halves', '/images/ingredients/vegetables/cherry-tomatoes.svg', 25.00, '{}', '{"Vegan","Juicy"}', true, 1),
  ('bell-peppers', 'vegetables', 'Bell Peppers', 'Crisp sweet red and yellow bell pepper strips', '/images/ingredients/vegetables/bell-peppers.svg', 20.00, '{}', '{"Vegan","Vitamin-C"}', true, 1),
  ('spring-onions', 'vegetables', 'Spring Onions', 'Freshly chopped scallion rings with mild onion punch', '/images/ingredients/vegetables/spring-onions.svg', 15.00, '{}', '{"Vegan","Aromatic"}', true, 1),
  ('broccoli', 'vegetables', 'Broccoli', 'Blanched tender emerald-green broccoli florets', '/images/ingredients/vegetables/broccoli.svg', 25.00, '{}', '{"Vegan","Superfood"}', true, 1),
  ('radish', 'vegetables', 'Radish', 'Thinly sliced crisp red radishes with peppery zest', '/images/ingredients/vegetables/radish.svg', 15.00, '{}', '{"Vegan","Crunchy"}', true, 1),
  ('pickled-onions', 'vegetables', 'Pickled Onions', 'Tangy citrus-marinated pink onion rings', '/images/ingredients/vegetables/pickled-onions.svg', 15.00, '{}', '{"Vegan","Tangy"}', true, 1),
  ('lettuce', 'vegetables', 'Lettuce', 'Crisp hand-torn romaine and butterhead lettuce leaves', '/images/ingredients/vegetables/lettuce.svg', 15.00, '{}', '{"Vegan","Fresh"}', true, 1),
  ('jalapenos', 'vegetables', 'Jalapeños', 'Fiery fresh sliced green jalapeño pepper rings', '/images/ingredients/vegetables/jalapenos.svg', 20.00, '{}', '{"Vegan","Spicy"}', true, 1)
ON CONFLICT (id) DO UPDATE SET
  category_id = EXCLUDED.category_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  price = EXCLUDED.price,
  allergens = EXCLUDED.allergens,
  dietary_tags = EXCLUDED.dietary_tags,
  is_available = EXCLUDED.is_available,
  updated_at = NOW();

