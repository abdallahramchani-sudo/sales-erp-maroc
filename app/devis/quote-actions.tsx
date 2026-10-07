'use client';

import { useState } from 'react';

export function QuoteActions({
  id,
  status,
  hasOrder,
}: {
  id: string;
  status: string;
  hasOrder: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(hasOrder);

  async function confirmQuote() {
    if (!confirm('Confirmer ce devis et créer la commande client ?')) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/quotes/${id}/confirm`, {
        method: 'POST',
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message);
      }

      setDone(true);
      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'Impossible de confirmer le devis.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (done || status === 'ACCEPTED') {
    return (
      <span className="text-green-700 font-semibold">
        ✓ Commande créée
      </span>
    );
  }

  if (status === 'REJECTED' || status === 'EXPIRED') {
    return <span className="muted">—</span>;
  }

  return (
    <button
      className="btn btn-primary"
      disabled={loading}
      onClick={confirmQuote}
    >
      {loading ? 'Confirmation...' : 'Confirmer'}
    </button>
  );
}
