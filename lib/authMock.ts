export interface UserSession {
  email: string;
  role: 'admin';
  loggedAt: string;
}

const SESSION_KEY = 'wolters_admin_session';

export const authMock = {
  signIn: (email: string, password: string): Promise<UserSession> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        if (email === 'admin@wolters.com' && password === '1234') {
          const session: UserSession = {
            email,
            role: 'admin',
            loggedAt: new Date().toISOString()
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          resolve(session);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 500);
    });
  },

  signOut: () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '#/login';
  },

  getSession: (): UserSession | null => {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(SESSION_KEY);
  }
};