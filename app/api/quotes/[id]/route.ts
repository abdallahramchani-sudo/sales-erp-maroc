import { db } from '@/lib/db';
import { apiError } from '@/lib/http';

// ACCEPTED n'est jamais manuel : il résulte uniquement de /confirm.
const TRANSITIONS: Record<string, string[]> = {
  DRAFT: ['SENT', 'REJECTED'],
  SENT: ['REJECTED', 'EXPIRED'],
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const target = body?.status;

  const quote = await db.quote.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!quote) {
    return apiError(404, 'QUOTE_NOT_FOUND', 'Devis introuvable.');
  }

  if (!TRANSITIONS[quote.status]?.includes(target)) {
    return apiError(
      409,
      'INVALID_TRANSITION',
      'Ce changement de statut n’est pas autorisé.',
    );
  }

  const res = await db.quote.updateMany({
    where: { id, status: quote.status },
    data: { status: target },
  });
  if (res.count === 0) {
    return apiError(409, 'QUOTE_CHANGED', 'Le devis a été modifié entre-temps.');
  }

  return Response.json({ id, status: target });
}
