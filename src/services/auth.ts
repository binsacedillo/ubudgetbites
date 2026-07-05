import type { User } from '../types';

const KEY_USERS = 'ub_users';
const KEY_SESSION = 'ub_user_session';

// Initialize default users if empty
function initializeUsers() {
  if (!localStorage.getItem(KEY_USERS)) {
    const defaultUsers: User[] = [
      {
        id: 'u1',
        name: 'Juan Dela Cruz',
        email: 'juan@ust.edu.ph',
        campus: 'ust',
        favorites: { meals: ['angkong-siomai-pork'], stalls: ['ang-kong'] },
        contributionsCount: 5,
        role: 'student'
      },
      {
        id: 'u2',
        name: 'Maria Santos',
        email: 'maria@feu.edu.ph',
        campus: 'feu',
        favorites: { meals: ['ate-ricas-bacon'], stalls: ['ate-ricas'] },
        contributionsCount: 3,
        role: 'student'
      }
    ];
    localStorage.setItem(KEY_USERS, JSON.stringify(defaultUsers));
  }
}

initializeUsers();

export const authService = {
  getCurrentUser(): User | null {
    const session = localStorage.getItem(KEY_SESSION);
    return session ? JSON.parse(session) : null;
  },

  register(name: string, email: string, campus: string): User {
    const users = JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
    
    // Check if user already exists
    const existing = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      // Just log them in if they already exist, for ease of demo
      localStorage.setItem(KEY_SESSION, JSON.stringify(existing));
      return existing;
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      campus,
      favorites: { meals: [], stalls: [] },
      contributionsCount: 0,
      role: 'student'
    };

    users.push(newUser);
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    localStorage.setItem(KEY_SESSION, JSON.stringify(newUser));
    return newUser;
  },

  login(email: string): User | null {
    const users = JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
    const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      localStorage.setItem(KEY_SESSION, JSON.stringify(user));
      return user;
    }
    
    // If not found, let's auto-register them for smooth demo flow
    const mockName = email.split('@')[0].split('.').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' ');
    // Detect campus from email domain if possible
    let campus = 'ust';
    if (email.includes('feu')) campus = 'feu';
    else if (email.includes('ue')) campus = 'ue';
    else if (email.includes('nu')) campus = 'nu';
    else if (email.includes('ceu')) campus = 'ceu';
    else if (email.includes('beda')) campus = 'sanbeda';

    return this.register(mockName || 'Student Pitcher', email, campus);
  },

  logout(): void {
    localStorage.removeItem(KEY_SESSION);
  },

  toggleFavorite(userId: string, targetId: string, type: 'meal' | 'stall'): { meals: string[], stalls: string[] } {
    const users = JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
    const uIdx = users.findIndex((u: User) => u.id === userId);
    
    if (uIdx === -1) return { meals: [], stalls: [] };
    
    const user = users[uIdx];
    if (!user.favorites) {
      user.favorites = { meals: [], stalls: [] };
    }

    const listKey = type === 'meal' ? 'meals' : 'stalls';
    const list = user.favorites[listKey] || [];
    
    const itemIdx = list.indexOf(targetId);
    if (itemIdx === -1) {
      list.push(targetId);
    } else {
      list.splice(itemIdx, 1);
    }
    
    user.favorites[listKey] = list;
    users[uIdx] = user;
    
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
    
    // If current user is logged in, sync session
    const session = this.getCurrentUser();
    if (session && session.id === userId) {
      session.favorites = user.favorites;
      localStorage.setItem(KEY_SESSION, JSON.stringify(session));
    }
    
    return user.favorites;
  }
};
