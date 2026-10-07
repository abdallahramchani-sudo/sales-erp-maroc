import { db } from '@/lib/db';
import { StatusSelect } from './status-select';
import { QuoteActions } from './quote-actions';

export default async function Devis() {
  const quotes = await db.quote.findMany({
    include: {
      customer: true,
      order: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="p-4 md:p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Devis</h1>
          <p className="muted mt-1">
            Pipeline commercial.
          </p>
        </div>

        <a className="btn btn-primary" href="/devis/nouveau">
          + Nouveau
        </a>
      </div>

      <div className="card mt-5 table-wrap">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left muted border-b">
              <th className="py-3">Numéro</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {quotes.map((q) => (
              <tr className="border-b last:border-0" key={q.id}>
                <td className="py-3 font-semibold">
                  {q.number}
                </td>

                <td>
                  {q.customer.companyName}
                </td>

                <td>
                  <StatusSelect
                    id={q.id}
                    initialStatus={q.status}
                  />
                </td>

                <td>
                  {Number(q.total).toLocaleString('fr-MA')} MAD
                </td>

                <td>
                  <QuoteActions
                    id={q.id}
                    status={q.status}
                    hasOrder={Boolean(q.order)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
