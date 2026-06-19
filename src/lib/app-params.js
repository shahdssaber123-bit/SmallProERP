const isNode = typeof window === 'undefined';
const windowObj = isNode ? { localStorage: new Map() } : window;
const storage = windowObj.localStorage;
const toSnakeCase = (str) => String(str).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
export const createParamStore = (prefix = 'smallpro') => ({
  get(paramName, fallback = null) {
    try { return storage.getItem(`${prefix}_${toSnakeCase(paramName)}`) ?? fallback; } catch { return fallback; }
  },
  set(paramName, value) {
    try { storage.setItem(`${prefix}_${toSnakeCase(paramName)}`, String(value)); } catch {}
  },
  remove(paramName) {
    try { storage.removeItem(`${prefix}_${toSnakeCase(paramName)}`); } catch {}
  },
});
export default createParamStore();
