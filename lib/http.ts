export function apiError(status: number, code: string, message: string) {
  return Response.json({ error: { code, message } }, { status });
}

export async function errorMessage(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body?.error?.message ?? 'Erreur inattendue.';
  } catch {
    return 'Erreur inattendue.';
  }
}
