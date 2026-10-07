import { db } from '@/lib/db';

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const quote = await db.quote.findUnique({
    where: { id },
    include: { items: true, order: true },
  });

  if (!quote) {
    return new Response('Devis introuvable', { status: 404 });
  }

  if (quote.order) {
    return Response.json(quote.order);
  }

  if (quote.status === 'REJECTED' || quote.status === 'EXPIRED') {
    return new Response('Ce devis ne peut pas être confirmé', { status: 400 });
  }

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number: `CMD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
        customerId: quote.customerId,
        salesId: quote.salesId,
        quoteId: quote.id,
        status: 'CONFIRMED',
        subtotal: quote.subtotal,
        tax: quote.tax,
        total: quote.total,
        items: {
          create: quote.items.map((item) => ({
            productId: item.productId,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            total: item.total,
          })),
        },
      },
    });

    await tx.quote.update({
      where: { id: quote.id },
      data: { status: 'ACCEPTED' },
    });

    return created;
  });

  return Response.json(order, { status: 201 });
}
