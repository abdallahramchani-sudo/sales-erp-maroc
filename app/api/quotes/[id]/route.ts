import { db } from '@/lib/db';

const allowed = ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();

  if (!allowed.includes(body.status)) {
    return new Response('Statut invalide', { status: 400 });
  }

  const quote = await db.quote.update({
    where: { id },
    data: { status: body.status },
  });

  return Response.json(quote);
}
