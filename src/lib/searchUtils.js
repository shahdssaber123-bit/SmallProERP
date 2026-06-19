export const text = (value) => String(value ?? '').toLowerCase();

export function matchesTypedSearch(item, search, type, fieldMap = {}) {
  if (!search) return true;
  const q = text(search);
  const resolver = fieldMap[type];
  if (!resolver) return false;
  const raw = typeof resolver === 'function' ? resolver(item) : item?.[resolver];
  if (Array.isArray(raw)) return raw.some(v => text(v).includes(q));
  return text(raw).includes(q);
}

export const money = (value) => `$${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
export const dateOnly = (value) => value ? String(value).split('T')[0] : '—';
