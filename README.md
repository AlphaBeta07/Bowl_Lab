# BOWL LAB — Interactive Craft Poke & Fresh Bowl Ordering Website

**BOWL LAB** is a production-ready, full-stack restaurant ordering web application inspired by flat editorial food aesthetics and motion design. Customers can interactively lift the bowl lid, drag or tap fresh ingredients into the bowl, squeeze chef-crafted sauces with realistic animated drizzle streams, seal their bowl, and checkout with Cash on Delivery (COD) or Pay at Restaurant.

---

## 🥢 Core Features & Experience

1. **Interactive Bowl Builder (`/build`)**:
   - **One-Time Lid Opening**: The bowl starts sealed. Clicking "Lift Lid & Start Building" (or clicking the lid) plays a smooth GSAP timeline lifting the lid and moving it aside. The lid stays open permanently for the rest of the building session.
   - **Instant Ingredient Additions**: Every subsequent ingredient click directly adds the selected ingredient to the bowl with a unique entrance animation (fade-in, scale bounce, subtle landing rotation) without re-triggering the lid animation.
   - **Pointer & Touch Drag Repositioning**: Drag ingredients within the circular boundary of the wooden bowl using React pointer events.
   - **Artisan Sauce Drizzling**: Tap realistic squeeze bottles (Spicy Mayo, Classic Shoyu, Sesame Ginger, Sriracha) to animate the bottle tilting and pouring a zig-zag sauce stream onto the bowl.
   - **Seal The Bowl Experience**: Clicking "Seal My Bowl" animates the branded kraft lid back onto the bowl, sealing it fresh with completion options ("Add to Cart" or "Keep Customizing").
   - **Thermal Receipt Panel**: Real-time live pricing summary in INR (`₹`) formatted like an authentic restaurant order ticket.
   - **Undo & Reset Controls**: Floating action pill to undo actions or reset the bowl.

2. **Homepage (`/`)**:
   - Editorial minimalist design on warm cream (`#F7F4EB`).
   - Hero section with large overhead signature poke bowl, floating food elements, and smooth GSAP entrance.
   - Popular bowls showcase, step-by-step "How It Works" guide, fresh ingredient gallery, brand culinary story, testimonials, and contact section.

3. **Chef-Crafted Menu (`/menu`)**:
   - Pre-built signature bowls (Signature Salmon, Tokyo Crunch Tuna, Harvest Green Tofu, Red Fire Chicken, Zen Paneer, Golden Falafel).
   - Dietary badges (Vegan, High Protein, Omega-3 Rich) and allergen listings.
   - "Customize" button deep-links to `/build?bowl=[id]` preloading the bowl into the builder.

4. **Shopping Cart & Drawer (`/cart`)**:
   - Slide-over cart drawer and full cart page.
   - Retains each bowl's unique customization (base, ingredients, sauces).
   - Coupon promo codes (`BOWLLAB50`, `FIRSTBOWL`, `FREESHIP`).
   - Delivery vs Store Pickup toggle with live GST (5%) calculation.

5. **Checkout & Order Confirmation (`/checkout` & `/order/[id]`)**:
   - Customer contact info, delivery address, and instructions.
   - **Supported Payment Methods**:
     - Cash on Delivery (COD)
     - Pay at Restaurant Counter (pickup orders)
   - Server-side price recalculation via `/api/orders`.
   - Live kitchen order tracking with 4-stage stepper (Received → Prepping → Ready → Completed) and celebration confetti.

6. **Customer Account (`/account` & `/account/orders`)**:
   - Profile management, login / sign-up, order history with live status tickets.
   - Role switcher between Customer and Admin.

7. **Admin Dashboard (`/admin`)**:
   - Operations overview with total orders, collected revenue, active kitchen tickets.
   - **Live Kitchen Orders (`/admin/orders`)**: Advance order prep stages and mark COD/pickup payments as paid.
   - **Ingredient Manager (`/admin/ingredients`)**: Update prices, toggle in-stock/out-of-stock availability, edit dietary tags.
   - **Menu Manager (`/admin/menu`)**: Manage chef signature bowls and pricing.
   - **Restaurant Settings (`/admin/settings`)**: Configure brand name, address, tax rate, delivery fee, and opening hours.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom editorial design tokens
- **Animations**: GSAP (Timelines, Lid Physics, Sauce Squeeze) & Framer Motion (UI Transitions)
- **Database & Auth**: Supabase PostgreSQL with RLS & graceful local fallback store
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🗄️ Supabase Configuration

To connect a live Supabase PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Execute the migration script in `supabase/migrations/01_initial_schema.sql` inside the Supabase SQL Editor.
3. Execute the seed script in `supabase/seed.sql` to populate default categories, settings, and coupons.
4. Copy your project URL and keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
*(If no Supabase credentials are configured, the app runs automatically with a complete local mock store with full CRUD capabilities).*

