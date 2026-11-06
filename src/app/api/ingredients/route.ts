import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/server';
import { store } from '@/lib/supabase/store';
import { Ingredient } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('ingredients')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        // Map database schema to frontend Ingredient interface
        const ingredients: Ingredient[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          category: row.category_id,
          description: row.description || '',
          imageUrl: row.image_url,
          price: Number(row.price),
          allergens: row.allergens || [],
          dietaryTags: row.dietary_tags || [],
          isAvailable: row.is_available ?? true,
          defaultQuantity: row.default_quantity || 1,
        }));
        return NextResponse.json({ ingredients, source: 'supabase' });
      }
    }
  } catch (err) {
    console.warn('Falling back to local store for ingredients:', err);
  }

  return NextResponse.json({ ingredients: store.getIngredients(), source: 'store' });
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, description, price, imageUrl, isAvailable, allergens, dietaryTags } = body;

    if (!id) {
      return NextResponse.json({ error: 'Ingredient ID is required' }, { status: 400 });
    }

    // 1. Update in Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (imageUrl !== undefined) updateData.image_url = imageUrl;
      if (isAvailable !== undefined) updateData.is_available = isAvailable;
      if (allergens !== undefined) updateData.allergens = allergens;
      if (dietaryTags !== undefined) updateData.dietary_tags = dietaryTags;

      const { error } = await supabase
        .from('ingredients')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Supabase ingredient update error:', error);
      }
    }

    // 2. Update local runtime/localStorage store
    const current = store.getIngredients();
    const updated = current.map((item) =>
      item.id === id
        ? {
            ...item,
            ...(name !== undefined ? { name } : {}),
            ...(description !== undefined ? { description } : {}),
            ...(price !== undefined ? { price: Number(price) } : {}),
            ...(imageUrl !== undefined ? { imageUrl } : {}),
            ...(isAvailable !== undefined ? { isAvailable } : {}),
            ...(allergens !== undefined ? { allergens } : {}),
            ...(dietaryTags !== undefined ? { dietaryTags } : {}),
          }
        : item
    );
    store.setIngredients(updated);

    const savedItem = updated.find((i) => i.id === id);
    return NextResponse.json({ success: true, ingredient: savedItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
