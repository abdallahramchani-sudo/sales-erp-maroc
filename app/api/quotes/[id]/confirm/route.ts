import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { apiError } from '@/lib/http';

class DomainError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

const CONFIRMABLE = ['DRAFT', 'SENT', 'ACCEPTED'];

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const result = await db.$transaction(async (tx) => {
      // Verrou de ligne : une 2e confirmation attend la fin de la 1re.
      await tx.$queryRaw`SELECT id FROM "Quote" WHERE id = ${id} FOR UPDATE`;

      const existing = await tx.order.findUnique({ where: { quoteId: id } });
      if (existing) return { order: existing, created: false };

      const quote = await tx.quote.findUnique({
        where: { id },
        include: { items: true },
      });
      if (!quote) {
        throw new DomainError(404, 'QUOTE_NOT_FOUND', 'Devis introuvable.');
      }
      if (!CONFIRMABLE.includes(quote.status)) {
        throw new DomainError(
          409,
          'QUOTE_NOT_CONFIRMABLE',
          'Ce devis ne peut pas être confirmé.',
        );
      }
      if (quote.validUntil && quote.validUntil < new Date()) {
        throw new DomainError(409, 'QUOTE_EXPIRED', 'Ce devis est expiré.');
      }
      if (quote.items.length === 0) {
        throw new DomainError(422, 'QUOTE_EMPTY', 'Ce devis ne contient aucune ligne.');
      }

      const order = await tx.order.create({
        data: {
          // Provisoire : remplacé par une vraie séquence en phase 1.
          number: `CMD-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
          customerId: quote.customerId,
          salesId: quote.salesId,
          quoteId: quote.id,
          status: 'CONFIRMED',
          subtotal: quote.subtotal,
          tax: quote.tax,
          total: quote.total,
          notes: quote.notes,
          items: {
            create: quote.items.map((i) => ({
              productId: i.productId,
              description: i.description,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              taxRate: i.taxRate,
              total: i.total,
            })),
          },
        },
      });

      await tx.quote.update({ where: { id }, data: { status: 'ACCEPTED' } });
      return { order, created: true };
    });

    return Response.json(result.order, { status: result.created ? 201 : 200 });
  } catch (e) {
    if (e instanceof DomainError) return apiError(e.status, e.code, e.message);

    // Filet de sécurité : la contrainte unique a joué, on renvoie la commande existante.
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      const existing = await db.order.findUnique({ where: { quoteId: id } });
      if (existing) return Response.json(existing);
    }
    console.error('quote confirm failed', e);
    return apiError(500, 'INTERNAL_ERROR', 'Erreur interne lors de la confirmation.');
  }
}
