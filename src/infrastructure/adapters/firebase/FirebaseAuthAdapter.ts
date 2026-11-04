import { IAuthService, User } from '../../../domain/interfaces/IAuthService';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase only if the config is provided (prevents crash on Supabase mode)
let app;
let auth: any;
if (import.meta.env.VITE_BAAS_PROVIDER === 'firebase' && firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
}

const mapUser = (firebaseUser: FirebaseUser | null): User | null => {
  if (!firebaseUser) return null;
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || undefined,
    avatarUrl: firebaseUser.photoURL || undefined,
  };
};

// Mock user store when BaaS credentials are not yet configured
const MOCK_STORAGE_KEY = 'agrotech_mock_auth_user';
const mockListeners: Array<(user: User | null) => void> = [];

const notifyMockListeners = (user: User | null) => {
  mockListeners.forEach(listener => listener(user));
};

export class FirebaseAuthAdapter implements IAuthService {
  async getCurrentUser(): Promise<User | null> {
    if (auth) {
      return mapUser(auth.currentUser);
    }
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  }

  async signIn(email: string, password?: string): Promise<User> {
    if (auth) {
      if (!password) throw new Error('Senha obrigatória para Firebase Auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return mapUser(userCredential.user)!;
    }
    
    // In-memory demo fallback when Firebase is not configured yet
    const demoUser: User = {
      id: 'demo-user-1',
      email: email || 'demo@agrotech.com',
      name: email ? email.split('@')[0] : 'Produtor AgroTech',
      avatarUrl: undefined,
    };
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(demoUser));
    notifyMockListeners(demoUser);
    return demoUser;
  }

  async signOut(): Promise<void> {
    if (auth) {
      await firebaseSignOut(auth);
    }
    localStorage.removeItem(MOCK_STORAGE_KEY);
    notifyMockListeners(null);
  }

  async resetPassword(email: string): Promise<void> {
    if (auth) {
      await sendPasswordResetEmail(auth, email);
      return;
    }
    console.info(`[Demo Auth] Reset password requested for: ${email}`);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        callback(mapUser(user));
      });
      return unsubscribe;
    }

    mockListeners.push(callback);
    // Initial call
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    if (saved) {
      try {
        callback(JSON.parse(saved));
      } catch {
        callback(null);
      }
    } else {
      callback(null);
    }

    return () => {
      const index = mockListeners.indexOf(callback);
      if (index !== -1) mockListeners.splice(index, 1);
    };
  }
}

