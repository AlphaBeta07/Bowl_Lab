# PROJECT: BOWL LAB — INTERACTIVE RESTAURANT ORDERING WEBSITE

## ROLE AND OBJECTIVE

Act as a world-class full-stack developer, React architect, UI/UX designer, motion designer, and restaurant e-commerce engineer.

Build a complete, production-ready, responsive restaurant ordering website inspired by the attached Instagram reel.

The reference reel demonstrates a creative "Build Your Own Bowl" website where users can:

- Lift a bowl lid.
- Drag ingredients into a bowl.
- Customize their food.
- Squeeze sauces.
- Arrange toppings.
- Close and seal their bowl.
- Place their order.

Reproduce the visual design language and interaction experience as closely as possible while creating an original restaurant brand and a fully functional ordering platform.

This is NOT a static landing page or a design-only prototype.

Build an actual restaurant ordering application with working frontend interactions, backend integration, database, cart, checkout, authentication, and admin management.

The primary experience must revolve around the interactive bowl builder.

---

# 1. STRICT TECHNOLOGY STACK

Use ONLY the following primary technologies.

### Frontend
- React.js
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Animation
- GSAP
- Framer Motion

### Backend and Database
- Supabase
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage
- Next.js Server Components
- Next.js Server Actions and API Routes

### Important technology restrictions

1. Use Next.js as the React application framework.
2. Use TypeScript throughout the project.
3. Use Tailwind CSS for styling.
4. Use GSAP for complex animation sequences and timelines.
5. Use Framer Motion for React component transitions and interface animations.
6. Use Supabase for database, authentication, storage, and persistent application data.
7. Do not introduce another frontend framework.
8. Do not use Firebase, MongoDB, Express, Flask, or a separate backend framework.
9. Do not use Three.js or WebGL for the bowl experience.
10. Do not use unnecessary animation libraries.
11. Do not replace GSAP or Framer Motion with CSS-only animations for the primary interactions.
12. Avoid unnecessary dependencies.

For drag-and-drop, implement a reliable pointer and touch interaction system using React Pointer Events and browser-native capabilities. A dedicated drag-and-drop dependency is not required.

Use React Context or a lightweight custom React state architecture for shared state. Do not introduce Redux or Zustand unless there is a demonstrated architectural necessity.

The application should remain simple, modular, and maintainable.

---

# 2. BRAND IDENTITY AND VISUAL DIRECTION

Create an original food brand.

Temporary brand name: BOWL LAB.

The final brand name, logo, restaurant details, and contact information must be configurable.

Design inspiration: the uploaded Instagram reel.

### Visual philosophy

- Minimalist editorial design.
- Warm cream backgrounds.
- Realistic flat food photography.
- Large circular bowl compositions.
- Colourful ingredient cutouts.
- Smooth motion.
- Playful typography.
- Clean layouts.
- Premium restaurant aesthetic.
- Plenty of whitespace.

Avoid:
- Generic restaurant templates.
- Excessive gradients.
- Glassmorphism.
- Unnecessary 3D models.
- Generic AI-generated dashboard aesthetics.
- Excessive cards and borders.
- Overly complicated navigation.

### Colour palette

Create reusable CSS variables.

--background: #F7F4EB;
--foreground: #292820;
--accent: #F15A35;
--secondary: #77746C;
--surface: #FFFDF7;
--border: #E9E3D8;
--green: #6E8B61;
--yellow: #F2DCA5;

Typography:
- Use an expressive display font for headlines.
- Use a clean sans-serif font for body text.
- Use appropriate font weights and spacing.

The final result should feel like a premium creative food brand.

---

# 3. APPLICATION STRUCTURE

Build the following pages.

1. Homepage — /
2. Menu — /menu
3. Interactive Bowl Builder — /build
4. Shopping Cart — /cart
5. Checkout — /checkout
6. Order Confirmation — /order/[id]
7. Customer Account — /account
8. Order History — /account/orders
9. Admin Dashboard — /admin
10. Admin Menu Management — /admin/menu
11. Admin Ingredient Management — /admin/ingredients
12. Admin Orders — /admin/orders
13. Admin Settings — /admin/settings

All pages must use consistent navigation, typography, colours, and responsive styling.

---

# 4. HOMEPAGE DESIGN

Create a visually impressive homepage.

### Navigation

Include:
- BOWL LAB logo.
- Home.
- Menu.
- Build Your Bowl.
- Our Story.
- Contact.
- Cart icon.
- Login/account.

Navigation should be clean and minimal.

### Hero section

Headline:

"Your bowl. Your rules."

Supporting text:

"Fresh ingredients. Bold flavours. Made exactly how you like it."

Buttons:
- Build Your Bowl.
- Explore Menu.

Visual:
- Large overhead food bowl.
- Ingredients arranged around the bowl.
- Floating food photography elements.
- Subtle motion and parallax.
- Smooth reveal animation.

### Other sections

1. Popular bowls.
2. How it works.
3. Fresh ingredients.
4. Build your own experience.
5. Restaurant story.
6. Customer testimonials.
7. Contact and location.
8. Footer.

Every button must have a working destination or action.

---

# 5. INTERACTIVE BOWL BUILDER

Route: /build

This is the heart of the application.

Reproduce the experience shown in the reference reel.

## 5.1 Desktop layout

Create a three-part layout.

LEFT:
- Ingredient categories.
- Ingredient images.
- Ingredient names.
- Prices.
- Selection controls.

CENTER:
- Large interactive bowl.
- Bowl lid.
- Ingredient composition.
- Sauce overlays.
- Ingredient animations.

RIGHT:
- Selected ingredients.
- Customization summary.
- Live pricing.
- Reset.
- Undo.
- Seal My Bowl button.

TOP:
- Logo.
- Navigation.
- Builder progress.
- Cart.

The bowl should be the main visual focus.

## 5.2 Mobile layout

Mobile is equally important.

- Display the bowl prominently.
- Use horizontally scrollable ingredient categories.
- Show ingredient selection in a bottom sheet or expandable panel.
- Use touch-friendly ingredient cards.
- Allow tap-to-add interactions.
- Support touch-based repositioning.
- Keep the order summary accessible.
- Use a sticky bottom CTA.
- Avoid horizontal overflow.

On mobile, do not simply shrink the desktop layout.

Create a dedicated mobile interaction experience.

---

# 6. BOWL ANIMATION SYSTEM

Use a layered 2D composition.

The bowl must not be one static flattened image.

Create these independent visual layers:

1. Bowl shadow.
2. Empty bowl base.
3. Bowl interior.
4. Ingredient layers.
5. Sauce overlays.
6. Bowl rim.
7. Lid.

Use transparent PNG or WebP assets wherever appropriate.

### Bowl opening animation

Initial screen:

Display a closed bowl with its lid.

Text:

"Your bowl is waiting."

Button/instruction:

"Lift the lid to begin."

When clicked:

- Animate the lid upward.
- Rotate the lid slightly.
- Move it to the side.
- Add subtle depth using scale and shadows.
- Reveal the empty bowl.
- Enable ingredient selection.

Use a GSAP timeline for the complete opening sequence.

The animation should be smooth and natural.

### Bowl composition

Use a fixed bowl container with an internal clipping region.

Ingredients must be rendered as independent React elements.

Each ingredient layer should have:
- Image URL.
- X coordinate.
- Y coordinate.
- Scale.
- Rotation.
- Z-index.
- Quantity.
- Unique ID.

Use normalized coordinates relative to the bowl so the composition remains responsive.

Example data structure:

{
  id: "ingredient-001",
  ingredientId: "avocado",
  imageUrl: "/images/ingredients/avocado.webp",
  x: 0.45,
  y: 0.35,
  scale: 0.8,
  rotation: -12,
  zIndex: 3,
  quantity: 1
}

The actual implementation must use TypeScript interfaces.

### Ingredient placement

When a user adds an ingredient:

- Calculate its position inside the bowl.
- Add it to the React composition state.
- Animate it into position.
- Apply a subtle rotation.
- Apply natural scale variation.
- Keep the image within the bowl clipping region.

Users must see the ingredient physically appear inside the bowl.

Do not merely append ingredient names to a summary.

---

# 7. INGREDIENT CUSTOMIZATION

Create ingredient categories.

### Bases

- White rice.
- Brown rice.
- Quinoa.
- Lettuce.
- Mixed greens.
- Noodles.

### Vegetables

- Cucumber.
- Avocado.
- Carrots.
- Red cabbage.
- Edamame.
- Corn.
- Cherry tomatoes.
- Bell peppers.
- Onions.

### Proteins

- Grilled chicken.
- Tofu.
- Paneer.
- Salmon.
- Chickpeas.
- Falafel.

### Toppings

- Sesame seeds.
- Peanuts.
- Crispy onions.
- Spring onions.
- Nori.
- Pumpkin seeds.

These are sample catalog entries. All ingredients must be editable through Supabase-backed admin functionality.

Every ingredient must have:
- ID.
- Name.
- Category.
- Description.
- Image URL.
- Price.
- Availability.
- Allergens.
- Dietary tags.
- Default quantity.

### Interaction requirements

Users can:
- Add ingredients.
- Remove ingredients.
- Increase quantities.
- Decrease quantities.
- Reposition ingredients.
- Reset their bowl.
- Undo the last action.
- Change categories.

Use Framer Motion for ingredient card interactions and appropriate GSAP animations for bowl composition sequences.

---

# 8. SAUCE SQUEEZING ANIMATION

This must reproduce the creative sauce interaction from the reel.

Available sample sauces:

- Spicy mayo.
- Teriyaki.
- Sesame dressing.
- Peanut sauce.
- Sriracha.
- Lemon herb.

Display realistic sauce bottles.

### Interaction

1. User selects a sauce.
2. Sauce bottle appears above the bowl.
3. User moves or taps the bottle over the bowl.
4. Bottle tilts.
5. Animated sauce flows from the nozzle.
6. Sauce appears over the ingredients.
7. Bottle returns to its original position.

Use:
- GSAP timelines.
- SVG paths.
- SVG masks.
- CSS clipping.
- React state.

Create a visually convincing sauce stream.

The sauce should look like a real dressing being poured over food.

Do not make this a generic particle effect.

Support:
- Multiple sauces.
- Sauce quantity.
- Sauce removal/reset.
- Sauce selection summary.

---

# 9. SEAL THE BOWL EXPERIENCE

After customization, display:

"Ready to seal your bowl?"

Button:

"Seal My Bowl"

On clicking:

1. Disable editing temporarily.
2. Animate the lid from its resting position.
3. Rotate and scale the lid naturally.
4. Place it over the bowl.
5. Animate the final closing motion.
6. Display the finished bowl.
7. Show a completion message.

Message:

"Your bowl. Your creation. Ready to enjoy."

Buttons:
- Add to Cart.
- Keep Customizing.

Use GSAP for the lid timeline and Framer Motion for the completion UI.

Users must be able to reopen the bowl and edit their creation.

---

# 10. LIVE PRICING SYSTEM

Use Indian Rupees (INR).

Sample demonstration prices:

BASES:
- White rice: ₹40.
- Brown rice: ₹50.
- Quinoa: ₹70.

VEGETABLES:
- Cucumber: ₹15.
- Avocado: ₹40.
- Carrots: ₹15.
- Edamame: ₹30.
- Corn: ₹20.

PROTEINS:
- Tofu: ₹50.
- Paneer: ₹60.
- Chicken: ₹90.
- Salmon: ₹130.

TOPPINGS:
- Sesame seeds: ₹10.
- Crispy onions: ₹15.
- Peanuts: ₹10.

SAUCES:
- Standard serving: ₹20.

All prices are initial examples and must be configurable.

Implement:
- Base price.
- Included ingredient allowance.
- Additional ingredient pricing.
- Protein pricing.
- Topping pricing.
- Sauce pricing.
- Quantity pricing.
- Taxes.
- Delivery fees.
- Discounts.

Display the price as ingredients are added or removed.

IMPORTANT:
The final price must always be recalculated and validated server-side using Supabase database prices.

Never trust prices submitted from the browser.

---

# 11. MENU PAGE

Route: /menu

Display predefined restaurant bowls.

Each item must have:
- Food photograph.
- Name.
- Description.
- Ingredients.
- Price.
- Dietary tags.
- Allergen information.
- Customize button.
- Add to Cart button.

Allow customers to customize predefined bowls using the same bowl builder.

All menu information must be loaded from Supabase.

---

# 12. CART SYSTEM

Route: /cart

Implement a functional cart.

Features:
- Add multiple bowls.
- Maintain individual customizations.
- Update quantity.
- Remove items.
- Edit existing bowls.
- Persistent cart.
- Subtotal.
- Taxes.
- Delivery charge.
- Discount.
- Final total.

Each bowl must retain its own configuration.

Use React Context or a custom React state management architecture.

Persist cart data in local storage for guest users and associate it with authenticated customers when they log in.

Validate all final pricing on the server.

---

# 13. CHECKOUT SYSTEM

Route: /checkout

Customer information:
- Full name.
- Email.
- Phone number.
- Delivery or pickup.
- Delivery address.
- Delivery instructions.

Payment:
- Razorpay integration for India.
- UPI.
- Cards.
- Net banking.
- Other supported payment methods.

Implementation:
1. Validate checkout information.
2. Recalculate prices on the server.
3. Create a pending order in Supabase.
4. Create the Razorpay payment order server-side.
5. Open payment checkout.
6. Verify payment signature server-side.
7. Update payment status.
8. Confirm the order.
9. Send order confirmation.

Implement secure webhooks and duplicate-event protection.

If payment credentials are unavailable, implement a clearly labelled test payment mode.

Never fake a successful real payment.

---

# 14. SUPABASE BACKEND

Supabase is the only primary backend and database platform.

Use:
- Supabase PostgreSQL.
- Supabase Auth.
- Supabase Storage.
- Supabase Row Level Security.
- Next.js server-side database access.

### Database tables

profiles:
- id
- full_name
- email
- phone
- role
- created_at

categories:
- id
- name
- description
- sort_order
- is_active

ingredients:
- id
- category_id
- name
- description
- image_url
- price
- allergens
- dietary_tags
- is_available
- created_at
- updated_at

bowls:
- id
- name
- description
- image_url
- base_price
- is_available

bowl_ingredients:
- id
- bowl_id
- ingredient_id
- default_quantity

orders:
- id
- user_id
- order_number
- customer_name
- email
- phone
- delivery_type
- delivery_address
- subtotal
- tax
- delivery_fee
- discount
- total
- payment_status
- order_status
- payment_reference
- created_at

order_items:
- id
- order_id
- bowl_name
- quantity
- unit_price
- customization_json

coupons:
- id
- code
- discount_type
- discount_value
- minimum_order
- expiry_date
- is_active

restaurant_settings:
- id
- restaurant_name
- logo_url
- address
- phone
- opening_hours
- delivery_enabled
- pickup_enabled
- tax_percentage
- minimum_order

Create SQL migrations, relationships, indexes, and constraints.

Use appropriate Row Level Security policies.

Never expose the Supabase service role key in frontend code.

---

# 15. AUTHENTICATION

Use Supabase Authentication.

Implement:
- Customer registration.
- Login.
- Logout.
- Password reset.
- Session persistence.
- Guest checkout.
- Customer account.
- Order history.

Protect customer information and order access.

Implement role-based admin authorization.

---

# 16. ADMIN DASHBOARD

Create a clean and professional admin dashboard.

Features:

DASHBOARD:
- Total orders.
- Total revenue.
- Pending orders.
- Completed orders.
- Recent activity.

MENU MANAGEMENT:
- Add menu items.
- Edit descriptions.
- Upload images.
- Change prices.
- Enable/disable menu items.

INGREDIENT MANAGEMENT:
- Create ingredients.
- Change ingredient prices.
- Upload transparent ingredient images.
- Set categories.
- Configure dietary tags.
- Configure allergens.
- Set ingredient availability.

ORDER MANAGEMENT:
- View orders.
- View custom bowl configurations.
- Update order statuses.
- View customer information.
- View payment status.

SETTINGS:
- Restaurant details.
- Logo.
- Tax percentage.
- Delivery fee.
- Opening hours.
- Pickup settings.
- Delivery settings.

Only authorized administrators can access these operations.

---

# 17. GSAP AND FRAMER MOTION RESPONSIBILITIES

Use both libraries with clear responsibilities.

### GSAP

Use GSAP for:
- Bowl lid opening.
- Bowl lid closing.
- Sauce squeezing.
- Sauce stream animation.
- Ingredient landing timelines.
- Complex sequential animations.
- Scroll-triggered hero sequences where appropriate.

### Framer Motion

Use Framer Motion for:
- Page transitions.
- Ingredient card interactions.
- Hover effects.
- Button feedback.
- Modal transitions.
- Bottom sheet animations.
- Cart transitions.
- Success messages.
- Component entrance and exit animations.

Avoid animating the same element with both GSAP and Framer Motion.

Use React refs and proper GSAP cleanup to avoid memory leaks.

Support prefers-reduced-motion.

---

# 18. FOOD IMAGE ASSETS

Food imagery is essential.

Use consistent top-down photographs and transparent cutouts.

Required assets:

BOWL:
- Empty bowl.
- Bowl interior.
- Bowl rim.
- Bowl shadow.
- Bowl lid.

BASES:
- Rice.
- Brown rice.
- Quinoa.
- Lettuce.
- Noodles.

VEGETABLES:
- Cucumber.
- Avocado.
- Carrots.
- Red cabbage.
- Edamame.
- Corn.
- Tomatoes.

PROTEINS:
- Chicken.
- Tofu.
- Paneer.
- Salmon.
- Chickpeas.
- Falafel.

TOPPINGS:
- Sesame seeds.
- Crispy onions.
- Spring onions.
- Peanuts.

SAUCES:
- Sauce bottles.
- Sauce stream.
- Sauce overlays.

Use original or properly licensed image assets.

Prefer generated transparent PNG/WebP ingredient cutouts where appropriate.

Do not use unrelated stock images.

All images must maintain consistent lighting, camera angle, scale, and perspective.

Directory structure:

public/
  images/
    branding/
    bowl/
    ingredients/
      bases/
      vegetables/
      proteins/
      toppings/
    sauces/
      bottles/
      overlays/
    menu/

If an asset is missing, provide a deliberate fallback.

Never leave broken images.

---

# 19. RESPONSIVENESS

Build dedicated responsive experiences.

Desktop:
- Three-column bowl builder.
- Large central bowl.
- Side ingredient panel.
- Order summary.

Tablet:
- Adapted two-column layout.
- Expandable ingredient selector.
- Accessible bowl controls.

Mobile:
- Bowl-first composition.
- Horizontal category selector.
- Touch-friendly ingredients.
- Bottom sheets.
- Sticky checkout CTA.
- Compact order summary.

Test:
- 360px.
- 375px.
- 390px.
- 430px.
- 768px.
- 1024px.
- 1440px.
- 1920px.

No horizontal scrolling or overlapping controls.

---

# 20. SECURITY AND PERFORMANCE

SECURITY:
- Server-side input validation.
- Supabase RLS.
- Secure session handling.
- Role-based access.
- Protected API routes.
- Rate limiting.
- Payment signature verification.
- Environment variable protection.
- Server-side price calculations.
- Secure webhook processing.

PERFORMANCE:
- Next.js image optimization.
- Lazy loading.
- Optimized ingredient images.
- Dynamic imports for heavy components.
- Animation cleanup.
- Efficient React rendering.
- Avoid unnecessary state updates.
- Avoid loading all food images initially.

The bowl builder should remain responsive even when many ingredients are selected.

---

# 21. TESTING

Test all major user journeys.

### Bowl builder tests

1. Open bowl.
2. Select base.
3. Add vegetables.
4. Add protein.
5. Add toppings.
6. Apply sauce.
7. Move ingredients.
8. Remove ingredients.
9. Reset bowl.
10. Undo actions.
11. Verify live pricing.
12. Seal bowl.
13. Reopen bowl.
14. Add to cart.

### Ordering tests

1. Add multiple bowls.
2. Edit customizations.
3. Update quantities.
4. Remove items.
5. Complete checkout.
6. Verify payment.
7. Save order.
8. Verify order confirmation.

### Security tests

- Unauthorized admin access.
- Unauthorized order access.
- Invalid payment signature.
- Tampered client-side price.
- Duplicate payment webhook.
- Invalid coupon.

Test mobile touch interactions separately.

---

# 22. PROJECT STRUCTURE

Use a modular structure:

src/
  app/
    page.tsx
    menu/
    build/
    cart/
    checkout/
    order/
    account/
    admin/
    api/

  components/
    layout/
    homepage/
    menu/
    bowl-builder/
      BowlCanvas.tsx
      BowlBase.tsx
      BowlLid.tsx
      IngredientPanel.tsx
      IngredientCard.tsx
      IngredientLayer.tsx
      SauceBottle.tsx
      SauceStream.tsx
      BowlSummary.tsx
      BuilderControls.tsx
    cart/
    checkout/
    admin/
    ui/

  lib/
    supabase/
    pricing/
    payments/
    validation/

  context/
    CartContext.tsx
    BowlBuilderContext.tsx

  hooks/
  types/
  config/
  styles/

supabase/
  migrations/
  seed.sql

public/
  images/

tests/

Keep all business logic separate from UI components.

---

# 23. DEVELOPMENT EXECUTION PLAN

Work in the following phases.

PHASE 1 — INITIAL SETUP
- Inspect existing workspace.
- Initialize Next.js.
- Configure TypeScript.
- Configure Tailwind CSS.
- Install GSAP and Framer Motion.
- Create project architecture.
- Establish design tokens.

PHASE 2 — VISUAL DEVELOPMENT
- Implement homepage.
- Implement navigation.
- Implement menu.
- Create bowl composition.
- Prepare food assets.
- Match the reference reel.

PHASE 3 — INTERACTIVE BUILDER
- Lid opening.
- Ingredient selection.
- Ingredient placement.
- Drag and drop.
- Touch interactions.
- Sauce squeezing.
- Ingredient removal.
- Bowl sealing.

PHASE 4 — APPLICATION STATE
- Implement React contexts.
- Implement bowl customization state.
- Implement undo/reset.
- Implement pricing engine.
- Implement cart persistence.

PHASE 5 — SUPABASE
- Configure environment variables.
- Create database schema.
- Run migrations.
- Configure authentication.
- Implement database operations.
- Implement storage.

PHASE 6 — ORDERING
- Implement cart.
- Implement checkout.
- Implement order creation.
- Integrate Razorpay.
- Implement payment verification.

PHASE 7 — ADMIN
- Implement dashboard.
- Implement ingredient management.
- Implement menu management.
- Implement order management.
- Implement settings.

PHASE 8 — TESTING
- Test all desktop interactions.
- Test all mobile interactions.
- Test pricing.
- Test checkout.
- Test database security.
- Fix runtime errors.
- Optimize performance.

PHASE 9 — DEPLOYMENT
- Prepare Vercel deployment.
- Configure Supabase production environment.
- Configure Razorpay.
- Configure domain.
- Test production ordering.

---

# 24. ENVIRONMENT CONFIGURATION

Create a .env.example file.

Include:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

NEXT_PUBLIC_APP_URL=

Do not commit .env files.

Document how to configure Supabase and Razorpay.

Do not invent API credentials.

---

# 25. FINAL ACCEPTANCE CRITERIA

The project must not be considered complete until:

[ ] Homepage visually follows the reference.
[ ] Bowl lid opens correctly.
[ ] Bowl lid closes correctly.
[ ] Ingredient images appear inside the bowl.
[ ] Desktop drag-and-drop works.
[ ] Mobile touch interactions work.
[ ] Ingredients can be repositioned.
[ ] Ingredients can be removed.
[ ] Sauce animation works.
[ ] Pricing updates correctly.
[ ] Undo and reset work.
[ ] Cart retains individual customizations.
[ ] Checkout validates information.
[ ] Supabase saves orders.
[ ] Payment verification works.
[ ] Admin can manage ingredients.
[ ] Admin can manage orders.
[ ] Responsive layouts work.
[ ] No broken assets.
[ ] No critical console errors.
[ ] Production build succeeds.

---

# 26. FINAL INSTRUCTIONS TO ANTIGRAVITY

First inspect the attached reference reel and existing project workspace.

Treat the reel as the primary visual and interaction specification.

Do not start with a generic template.

Do not generate the entire application inside one component.

Do not stop after generating a development plan.

Build the actual application phase by phase.

After implementing each major phase:
- Run the application.
- Inspect the interface.
- Test the interactions.
- Fix errors.
- Continue to the next phase.

Make sensible independent engineering decisions without repeatedly asking for approval.

Prioritize:
1. Visual fidelity to the reference reel.
2. Interactive bowl-building experience.
3. High-quality food photography.
4. Smooth GSAP animations.
5. Responsive mobile interactions.
6. Reliable Supabase integration.
7. Secure restaurant ordering.
8. Maintainable code.

The final product should feel like a premium, creative, interactive restaurant brand.

The user should feel that they are physically creating their own bowl, not simply filling out a restaurant order form.

Build a complete, working, deployable application.

## PAYMENT AND CHECKOUT — UPDATED REQUIREMENTS

Remove Razorpay and all payment gateway integrations completely.

The application must not include:
- Razorpay SDK.
- Razorpay API.
- Payment gateway integration.
- Payment gateway credentials.
- Payment webhooks.
- Online payment processing.

### Supported payment methods

1. Cash on Delivery (COD).
2. Pay at Restaurant (pickup orders only).

### Checkout workflow

1. Customer customizes their bowl.
2. Customer adds it to the cart.
3. Customer enters contact and delivery/pickup information.
4. Customer selects an available payment method.
5. Server validates the order and recalculates pricing.
6. Create the order in Supabase.
7. Display a successful order confirmation.
8. Provide an order number and order tracking information.

### Database changes

Add these fields to the orders table:

- payment_method
- payment_status
- order_status

Payment methods:
- cod
- pay_at_restaurant

Payment statuses:
- pending
- paid
- not_applicable

For COD, initialize payment status as pending.

For Pay at Restaurant, initialize payment status as pending.

Only authorized administrators can mark an order as paid.

### Admin dashboard

Allow administrators to:
- View payment methods.
- View payment status.
- Mark payments as paid.
- Update order status.
- View outstanding COD payments.

### Security

- Validate payment method server-side.
- Allow Pay at Restaurant only for pickup orders.
- Never trust client-submitted prices.
- Prevent duplicate order creation.
- Store all orders in Supabase.

### Environment variables

Remove all Razorpay-related environment variables from `.env.example`.

Keep Supabase configuration unchanged.

The application must have a fully functional ordering and checkout experience without any online payment gateway.

# Fix Bowl Builder: Open the Lid Only Once, Then Add Ingredients on Every Click

Analyze the existing Bowl Builder implementation and fix the lid and ingredient interaction.

## Current Problem
Currently, every time I click an ingredient, the bowl lid opens again. This is incorrect and makes the experience repetitive.

## Expected Behaviour

The lid should open **only once**, when the user starts building their bowl.

### 1. Initial State
- Display the bowl with its lid closed.
- Show a clear button such as **"Lift Lid & Start Building"**.
- Do not allow ingredients to be added before the initial opening animation completes.

### 2. First Click: Open the Lid
When the user clicks "Lift Lid & Start Building":
- Play the GSAP lid-opening animation exactly once.
- Animate the lid lifting and moving aside.
- Once the animation completes, permanently mark the bowl as opened for the current building session.
- Enable ingredient selection.

### 3. Subsequent Ingredient Clicks
After the lid has opened:
- Clicking any ingredient should immediately add that ingredient to the bowl.
- Do NOT trigger the lid-opening animation again.
- Do NOT close or reset the lid.
- Do NOT replay the opening animation.
- Animate only the newly selected ingredient appearing inside the bowl.
- Keep all previously added ingredients visible.

### 4. Ingredient Addition Animation
Every time an ingredient is selected:
- Add its image/layer to the bowl composition.
- Use a smooth GSAP animation such as fade-in, scale-up, and slight landing movement.
- Give each ingredient its own unique animation target.
- Preserve its position, rotation, scale, and z-index.
- Avoid reanimating ingredients already inside the bowl.

### 5. State Management

Implement a proper state-driven interaction using React.

Suggested state:

```tsx
const [isLidOpen, setIsLidOpen] = useState(false);
const [isLidAnimating, setIsLidAnimating] = useState(false);
const [ingredients, setIngredients] = useState([]);
```

Implement the lid-opening function:

```tsx
const openLid = () => {
  if (isLidOpen || isLidAnimating) return;

  setIsLidAnimating(true);

  // Run the GSAP lid-opening timeline.
  // Set isLidOpen to true only after animation completes.
};
```

Implement ingredient addition:

```tsx
const addIngredient = (ingredient) => {
  if (!isLidOpen || isLidAnimating) return;

  setIngredients((previous) => [
    ...previous,
    {
      ...ingredient,
      instanceId: crypto.randomUUID(),
    },
  ]);

  // Animate only the newly added ingredient.
};
```

Adapt this logic to the existing project architecture instead of blindly copying it.

## 6. Important Animation Rules
- GSAP controls the lid-opening animation.
- Framer Motion may handle ordinary UI transitions.
- Never let GSAP and Framer Motion animate the same element simultaneously.
- Do not recreate the bowl or reset the animation timeline when adding ingredients.
- Do not use ingredient clicks to trigger the lid-opening function.
- Use stable React keys and unique ingredient instance IDs.
- Clean up GSAP timelines and event listeners properly.

## 7. Lid Behaviour After Opening
- The lid remains in its open position throughout the entire bowl-building session.
- Adding, removing, or changing ingredient quantities must never reopen the lid.
- The lid should only close when the user explicitly clicks **"Seal My Bowl"**.
- Sealing should play the closing animation once and disable further ingredient additions until the user explicitly chooses to reopen or edit the bowl.

## 8. Testing Requirements

Test the following sequence:

1. Load the builder → lid is closed.
2. Click "Lift Lid & Start Building" → lid opens once.
3. Click rice → rice appears.
4. Click cucumber → cucumber appears without opening the lid.
5. Click chicken → chicken appears without opening the lid.
6. Click sauce → sauce appears without opening the lid.
7. Remove an ingredient → only that ingredient disappears.
8. Add another ingredient → it appears without replaying the lid animation.
9. Click "Seal My Bowl" → lid closes once.

Verify that the lid-opening animation plays exactly once per building session, regardless of how many ingredients are selected.

## Final Instructions
- Inspect the existing code before making changes.
- Identify the exact cause of the repeated lid animation.
- Fix the actual state management and animation lifecycle rather than applying a visual workaround.
- Preserve the current design, styling, ingredient assets, pricing, cart, and Supabase integration.
- Do not introduce unnecessary dependencies.
- Test the complete interaction on desktop and mobile.
- Do not rebuild the entire project; make a focused, production-quality fix.

**Acceptance criterion:** One lid-opening animation per bowl-building session. Every subsequent ingredient click adds an ingredient directly to the already-open bowl without replaying any lid animation.

# MASTER PROMPT: Recreate the Exact Bowl Builder UI & Animations From the Reference Video

## Objective

I have provided a reference video demonstrating a premium interactive "Build Your Own Bowl" website.

I want you to **recreate the visual design, layout, ingredient presentation, animations, transitions, and overall user experience as closely as possible to the reference video.**

Do not create your own interpretation or introduce a completely different design.

The video is the primary visual reference. Study it carefully and reproduce its design language and interactions in my existing project.

This is a real restaurant ordering website, not just a visual demo.

---

## 1. Reference Video Analysis

Before changing the code:

1. Inspect the entire uploaded reference video.
2. Extract screenshots/keyframes at important moments.
3. Study the following:
   - Initial landing page.
   - Typography and font weights.
   - Background and color palette.
   - Navigation and button styles.
   - Bowl dimensions and positioning.
   - Ingredient image sizes and positioning.
   - Ingredient selection interface.
   - Lid-opening animation.
   - Ingredient drag-and-drop interaction.
   - Sauce-pouring animation.
   - Lid-closing animation.
   - Final bowl presentation.
   - Cart and ordering interaction.
4. Identify the timing, easing, direction, scale, and movement of important animations.
5. Use the video as the source of truth for all visual decisions.

Do not simply use the same concept. Reproduce the actual visual experience.

## 2. Visual Design — Match the Reference

The website should have the same visual characteristics as the reference:

- Premium, modern food-brand aesthetic.
- Minimalist editorial layout.
- Flat food photography instead of 3D models.
- Large, high-quality ingredient photographs.
- Warm, clean background.
- Strong typography hierarchy.
- Generous whitespace.
- Carefully aligned elements.
- Smooth transitions.
- Minimal borders and unnecessary shadows.
- Professional button and navigation styling.

**Important:** Do not turn this into a generic restaurant template, dashboard, or 3D application.

### Food imagery

Use realistic, high-quality, top-down food photographs.

Create or source separate transparent-background ingredient images for:

- Rice and other bases.
- Vegetables.
- Proteins.
- Toppings.
- Sauces.
- Bowl and lid.

The images must look like real food photographs, not cartoon illustrations, emojis, icons, or generic colored circles.

Maintain consistent camera angle, lighting, image quality, and proportions.

## 3. Bowl Builder — Recreate the Reference Experience

The bowl should be the main visual focus.

Use layered flat images to create the bowl composition:

- Empty bowl.
- Bowl interior.
- Ingredient photographs.
- Bowl rim.
- Bowl shadow.
- Separate lid image.

The ingredients should appear to physically sit inside the bowl.

Use CSS clipping masks, carefully positioned transparent PNG/WebP assets, and layered composition.

Do not use Three.js, WebGL, or unnecessary 3D rendering.

### Initial state

- Display a closed bowl with its lid.
- Show the ingredient selection interface.
- Display a clear "Lift Lid & Start Building" interaction.
- The initial state should visually match the reference video.

### Lid opening animation

When the user starts building:

- Animate the lid lifting.
- Add natural rotation and movement.
- Move the lid to the same side and position as the reference.
- Use a smooth GSAP timeline.
- Keep the bowl visible in its original position.

The animation must feel natural and polished.

### CRITICAL: Open the lid only once

The lid must open only once when the user starts a new bowl.

After opening:

- Keep the lid in its open position.
- Ingredient clicks must never trigger the lid animation.
- Ingredient selection should immediately update the bowl.
- Adding multiple ingredients must not reset the bowl.
- Removing ingredients must not affect the lid.
- Changing quantities must not affect the lid.

Only the explicit "Seal My Bowl" action should close the lid.

## 4. Ingredient Selection and Drag-and-Drop

Reproduce the ingredient interaction shown in the reference video.

Users should be able to:

1. Browse ingredient categories.
2. Select ingredients.
3. Drag ingredients into the bowl.
4. Drop them into the bowl composition.
5. Add multiple ingredients.
6. Remove ingredients.
7. Change quantities where supported.

### Ingredient animation

When an ingredient is dragged into the bowl:

- Follow the pointer smoothly.
- Show a clear drag state.
- Detect when the ingredient enters the bowl.
- Animate it landing inside the bowl.
- Add a slight scale and rotation adjustment.
- Keep the ingredient within the bowl's visible interior.

When an ingredient is selected by clicking:

- Add it directly to the bowl.
- Play a short fade-in and scale animation.
- Do not replay the lid animation.

Use independent ingredient instances with unique IDs and stable React keys.

### Bowl composition

Every added ingredient should:

- Have its own position.
- Have its own scale.
- Have its own rotation.
- Have its own z-index.
- Remain visible after other ingredients are added.

Do not randomly reposition all existing ingredients whenever a new one is selected.

Use a consistent composition algorithm to distribute ingredients naturally while keeping them inside the bowl.

## 5. Sauce-Pouring Animation

Reproduce the sauce interaction from the reference video.

When the user selects or activates a sauce:

- Display the sauce bottle or sauce interaction.
- Animate the bottle tilting toward the bowl.
- Show a realistic sauce stream.
- Animate the stream flowing onto the ingredients.
- Stop the stream when the pouring interaction ends.
- Add a subtle sauce overlay to the bowl composition.

Use GSAP timelines and SVG/CSS animations.

The sauce should look like a real food interaction, not a simple colored line.

## 6. Seal My Bowl Animation

When the user clicks "Seal My Bowl":

- Stop ingredient interactions.
- Animate the lid returning to the bowl.
- Rotate and position it naturally.
- Play a smooth closing animation.
- Show the completed bowl.
- Display the final price and selected ingredients.
- Show "Add to Cart" and "Keep Customizing" actions.

The animation should match the reference video's final presentation.

## 7. Animation Technology

Use the existing stack:

- Next.js App Router
- React.js
- TypeScript
- Tailwind CSS
- GSAP
- Framer Motion
- Supabase

Animation responsibilities:

| Technology | Responsibility |
|---|---|
| GSAP | Lid opening, lid closing, sauce pouring, ingredient landing |
| Framer Motion | UI transitions, buttons, panels, modals, micro-interactions |
| CSS | Clipping, image layering, responsive layout, visual effects |
| React State | Bowl state, ingredient selection, quantities, interactions |

Do not let GSAP and Framer Motion control the same element simultaneously.

Use proper GSAP cleanup and prevent duplicate animation timelines.

## 8. State Management and Interaction Logic

Implement a reliable state machine:

- `closed`
- `opening`
- `open`
- `sealing`
- `sealed`

Expected transitions:

`closed → opening → open → sealing → sealed`

Rules:

- Opening is permitted only from `closed`.
- Ingredient additions are permitted only in `open`.
- Ingredient removal and quantity changes are permitted only in `open`.
- Sealing is permitted only from `open`.
- No ingredient event should call the lid-opening function.
- Repeated clicks must not create duplicate GSAP timelines.
- Resetting should only happen when the user intentionally starts a new bowl.

Keep the existing cart, price calculations, Supabase integration, and order functionality intact.

## 9. Responsive Design

The reference design must work on:

- Desktop.
- Laptop.
- Tablet.
- Mobile.

Desktop:
- Preserve the reference's spacious composition.
- Keep the bowl as the main visual focus.
- Use the same ingredient-selection layout as the video.

Mobile:
- Preserve the same visual identity.
- Adapt the ingredient panel to touch-friendly scrolling.
- Allow ingredients to be added by tapping.
- Support drag-and-drop where practical.
- Keep the bowl and primary CTA visible.
- Avoid horizontal overflow.

Do not simply shrink the desktop design.

## 10. Important Things NOT to Do

- Do not create a generic food ordering website.
- Do not use emoji as food images.
- Do not use cartoon ingredient illustrations.
- Do not introduce unnecessary 3D models.
- Do not use Three.js or WebGL.
- Do not change the visual design without comparing it against the reference.
- Do not replay the lid animation on every ingredient click.
- Do not reset the bowl when selecting another ingredient.
- Do not replace the reference interactions with basic dropdowns.
- Do not remove existing ordering, cart, authentication, or Supabase functionality.
- Do not add Razorpay or any online payment gateway.

Payment options remain:
- Cash on Delivery.
- Pay at Restaurant for pickup orders.

## 11. Implementation Workflow

Work in this order:

**Phase 1 — Reference analysis**
- Inspect the video.
- Extract important frames.
- Identify the layout and animation sequence.

**Phase 2 — Visual recreation**
- Rebuild the layout to match the reference.
- Fix typography, spacing, image proportions, colors, and alignment.
- Replace placeholder food assets with realistic images.

**Phase 3 — Animation implementation**
- Implement the lid animation.
- Implement ingredient selection and drag-and-drop.
- Implement sauce pouring.
- Implement sealing.

**Phase 4 — Integration**
- Connect ingredient selection to real ingredient data.
- Connect pricing to Supabase.
- Preserve cart and checkout functionality.

**Phase 5 — Testing**
- Test every interaction.
- Test repeated ingredient clicks.
- Test adding and removing multiple ingredients.
- Test lid opening and closing.
- Test drag-and-drop on desktop and mobile.
- Verify no animation conflicts or console errors.

## Final Acceptance Criteria

The finished website must look and behave as closely as possible to the uploaded reference video.

The most important requirements are:

1. Same visual design and layout.
2. Same flat food photography aesthetic.
3. Same bowl and lid presentation.
4. Same lid-opening movement.
5. Same ingredient selection and drag-and-drop experience.
6. Same sauce-pouring interaction.
7. Same lid-sealing experience.
8. Smooth, premium animations.
9. Fully functional real ordering system.
10. Responsive desktop and mobile experience.

**Do not stop after creating a visual prototype. Implement the complete experience in the existing project, test it, and fix any issues you find.**

# Fix Bowl Ingredient Distribution – Spread Ingredients Naturally Across the Entire Bowl

Analyze the current Bowl Builder implementation and fix how ingredients are positioned inside the bowl.

## Current Problem

Currently, ingredients appear in separate chunks or concentrated piles.

For example:
- Salmon forms one large cluster.
- Tuna forms another cluster.
- Avocado slices stay together.
- Cucumber pieces form a separate cluster.
- Tofu pieces form another cluster.

This makes the bowl look artificially divided instead of looking like a properly mixed and prepared food bowl.

## Expected Result

I want ingredients to be **spread naturally and evenly across the entire inner circular area of the bowl**, similar to a professionally prepared poke bowl.

Each ingredient should be distributed throughout the available bowl area rather than grouped in one fixed location.

### 1. Ingredient Distribution Algorithm

Implement a natural ingredient placement algorithm.

Requirements:
- Distribute ingredient pieces across the entire bowl interior.
- Avoid concentrating all pieces in one area.
- Avoid creating separate ingredient piles.
- Maintain natural spacing between individual pieces.
- Allow different ingredient types to appear next to each other.
- Create a visually balanced composition.
- Keep all ingredients inside the circular bowl boundary.

Use randomized but controlled positioning.

Consider a Poisson-disc sampling or minimum-distance placement algorithm to prevent excessive overlap while maintaining natural distribution.

### 2. Individual Ingredient Placement

Do not treat an ingredient selection as one large image or one fixed-position cluster.

Where assets allow, break the ingredient into individual visual pieces.

For example:
- Salmon: distribute individual salmon cubes.
- Tuna: distribute individual tuna cubes.
- Cucumber: distribute individual cucumber slices.
- Avocado: distribute individual avocado slices.
- Crispy tofu: distribute individual tofu cubes.
- Edamame: distribute individual beans.

Each piece should have its own:
- X/Y position.
- Rotation.
- Scale.
- Z-index.
- Unique ID.

### 3. Natural Bowl Composition

The final bowl should look like a real food bowl.

Use these visual rules:
- Mix different ingredients throughout the bowl.
- Avoid obvious circular rows or grids.
- Avoid large empty spaces.
- Avoid excessive overlapping.
- Preserve realistic ingredient proportions.
- Keep the composition visually balanced.
- Respect the bowl's circular clipping boundary.

The ingredients should look naturally scattered, not perfectly organized.

### 4. When Adding Ingredients

Every time the user selects an ingredient:

1. Add the new ingredient pieces to the existing bowl.
2. Distribute the new pieces across available positions.
3. Blend them visually with the ingredients already present.
4. Animate only the newly added pieces.
5. Keep all existing ingredients in their original positions.

**Important:** Do not rearrange the entire bowl every time a new ingredient is selected.

Use stable positions for existing ingredients to prevent visual jumping.

### 5. Animation

Use GSAP for the ingredient placement animation.

Each new piece should:
- Fade in.
- Scale from approximately 0.7 to 1.
- Move slightly into its final position.
- Have a subtle landing effect.
- Use slightly varied rotation.

Stagger the animation of individual pieces for a natural food-placement effect.

Do not animate the bowl lid when adding ingredients.

### 6. Technical Implementation

Inspect the existing ingredient rendering system.

If the current implementation uses one image per ingredient category, update it to support individual ingredient pieces or suitable pre-composed transparent assets.

Implement a reusable distribution function that:
- Uses the actual bowl interior dimensions.
- Respects the circular boundary.
- Maintains minimum spacing.
- Supports different ingredient piece sizes.
- Produces varied but balanced positions.
- Avoids placing pieces outside the bowl.

Use a deterministic seed or store generated positions so existing ingredients do not move during React re-renders.

### 7. Preserve Existing Functionality

Do not change:
- Overall UI design.
- Bowl size or positioning.
- Ingredient selection interface.
- Lid opening and closing behavior.
- Sauce-pouring animation.
- Ingredient pricing.
- Cart and checkout.
- Supabase integration.

Only improve the ingredient distribution and its rendering.

## Final Acceptance Criteria

When I add salmon, tuna, avocado, cucumber, edamame, and tofu:

- All ingredients should be spread across the bowl.
- Individual pieces should be visually distinguishable.
- No ingredient should appear as one concentrated chunk.
- Different ingredients should naturally mix together.
- The bowl should look realistic, attractive, and professionally prepared.

**Target appearance:** A naturally mixed, evenly distributed poke bowl—not separate piles of ingredients arranged in different sections.

Implement the actual code changes, run the application, and verify the result visually against the uploaded screenshot.