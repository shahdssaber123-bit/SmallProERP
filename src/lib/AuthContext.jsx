export function AuthProvider({ children }) { return children; }
export function useAuth() { return { user: null, loading: false }; }
