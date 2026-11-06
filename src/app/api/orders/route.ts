import { NextRequest, NextResponse } from 'next/server';
import { validateAndRecalculateOrder } from '@/lib/pricing/calculator';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/server';
import { store } from '@/lib/supabase/store';
import { Order, PaymentMethod, DeliveryType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      email,
      phone,
      deliveryType,
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      couponCode,
      items,
    } = body;

    // 1. Validation
    if (!customerName || !email || !phone) {
      return NextResponse.json(
        { error: 'Customer contact information is required' },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order cart is empty' }, { status: 400 });
    }

    if (deliveryType === 'delivery' && !deliveryAddress) {
      return NextResponse.json(
        { error: 'Delivery address is mandatory for delivery orders' },
        { status: 400 }
      );
    }

    // Security rule: Pay at Restaurant is only allowed for pickup orders
    if (deliveryType === 'delivery' && paymentMethod === 'pay_at_restaurant') {
      return NextResponse.json(
        { error: 'Pay at Restaurant is only available for pickup orders' },
        { status: 400 }
      );
    }

    // 2. Authoritative Server-side Price Recalculation (Never trust client prices)
    const validation = validateAndRecalculateOrder(items, deliveryType, couponCode);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error || 'Invalid items' }, { status: 400 });
    }

    const totals = validation.totals;
    const orderNumber = `BL-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      email,
      phone,
      deliveryType: deliveryType as DeliveryType,
      deliveryAddress: deliveryType === 'pickup' ? 'Store Pickup — BOWL LAB Indiranagar' : deliveryAddress,
      deliveryInstructions,
      paymentMethod: paymentMethod as PaymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'received',
      subtotal: totals.subtotal,
      tax: totals.tax,
      deliveryFee: totals.deliveryFee,
      discount: totals.discount,
      total: totals.total,
      items,
      createdAt: new Date().toISOString(),
    };

    // 3. Persist in Supabase or runtime store
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error: dbError } = await supabase.from('orders').insert({
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          email: newOrder.email,
          phone: newOrder.phone,
          delivery_type: newOrder.deliveryType,
          delivery_address: newOrder.deliveryAddress,
          delivery_instructions: newOrder.deliveryInstructions,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          delivery_fee: newOrder.deliveryFee,
          discount: newOrder.discount,
          total: newOrder.total,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus,
        });

        if (dbError) {
          console.error('Supabase order insert error, fallback to store:', dbError);
          store.addOrder(newOrder);
        }
      } catch (err) {
        console.error('Supabase exception, falling back to store:', err);
        store.addOrder(newOrder);
      }
    } else {
      store.addOrder(newOrder);
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error processing order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const orders = store.getOrders();
  return NextResponse.json({ orders });
}

