'use client';

import { useState } from 'react';

const statuses = [
  ['DRAFT', 'Brouillon'],
  ['SENT', 'Envoyé'],
  ['REJECTED', 'Refusé'],
  ['EXPIRED', 'Expiré'],
] as const;

export function StatusSelect({
  id,
  initialStatus,
}: {
  id: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  if (status === 'ACCEPTED') {
    return (
      <span className="badge">
        Accepté
      </span>
    );
  }

  async function changeStatus(value: string) {
    setStatus(value);
    setSaving(true);

    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: value }),
      });

      if (!res.ok) throw new Error();

      window.location.reload();
    } catch {
      setStatus(initialStatus);
      alert('Impossible de modifier le statut.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(e) => changeStatus(e.target.value)}
      className="border rounded-lg px-2 py-1 text-sm bg-white"
    >
      {statuses.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
