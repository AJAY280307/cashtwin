import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  healthStatus: 'Healthy' | 'Watch' | 'At Risk' | 'Critical';
  resilienceScore: number;
  avatarLetter: string;
  accountNumber: string;
  mobileNumber?: string;
  dob?: string;
  monthlyIncomeRange?: string;
  employmentType?: string;
  primaryGoal?: string;
  joinedDate?: string;
}

export const DEFAULT_RAHUL_VERMA: UserProfile = {
  id: 'CUST-003',
  name: 'Rahul Verma',
  email: 'rahul.verma@cashtwin.bank',
  healthStatus: 'Watch',
  resilienceScore: 64,
  avatarLetter: 'R',
  accountNumber: '•••• 6204',
  mobileNumber: '+91 98765 43210',
  dob: '1992-07-15',
  monthlyIncomeRange: '₹40,000 - ₹75,000',
  employmentType: 'Salaried / Logistics',
  primaryGoal: 'Build Emergency Fund',
  joinedDate: 'Oct 2024',
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  activeAccountModal: 'profile' | 'security' | null;
  openSignIn: () => void;
  openSignUp: () => void;
  closeAuthModal: () => void;
  openProfileModal: () => void;
  openSecurityModal: () => void;
  closeAccountModal: () => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginAsDemo: () => void;
  signup: (userData: {
    fullName: string;
    email: string;
    mobile: string;
    dob: string;
    password: string;
    monthlyIncomeRange: string;
    employmentType: string;
    primaryGoal: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cashtwin_auth_state_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isAuthenticated);
      }
    } catch {
      // ignore
    }
    // Default to false so user initially sees the new Sign In and Create Account buttons
    return false;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.user) return parsed.user;
      }
    } catch {
      // ignore
    }
    return DEFAULT_RAHUL_VERMA;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [activeAccountModal, setActiveAccountModal] = useState<'profile' | 'security' | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          isAuthenticated,
          user: user || DEFAULT_RAHUL_VERMA,
        })
      );
    } catch (e) {
      console.warn('Failed to persist auth state', e);
    }
  }, [isAuthenticated, user]);

  const openSignIn = useCallback(() => {
    setAuthModalMode('signin');
    setIsAuthModalOpen(true);
  }, []);

  const openSignUp = useCallback(() => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const openProfileModal = useCallback(() => {
    setActiveAccountModal('profile');
  }, []);

  const openSecurityModal = useCallback(() => {
    setActiveAccountModal('security');
  }, []);

  const closeAccountModal = useCallback(() => {
    setActiveAccountModal(null);
  }, []);

  const login = async (email: string, _password: string, _rememberMe = true) => {
    // Artificial latency for authentic banking security check
    await new Promise((res) => setTimeout(res, 600));

    // If email contains "rahul" or matches, use Rahul Verma, otherwise custom profile
    const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = nameFromEmail
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') || 'Rahul Verma';

    const isRahul = email.toLowerCase().includes('rahul') || email === 'demo@cashtwin.com';

    const loggedUser: UserProfile = isRahul
      ? DEFAULT_RAHUL_VERMA
      : {
          id: 'CUST-NEW',
          name: formattedName,
          email,
          healthStatus: 'Watch',
          resilienceScore: 68,
          avatarLetter: formattedName.charAt(0).toUpperCase() || 'U',
          accountNumber: '•••• ' + Math.floor(1000 + Math.random() * 9000),
          mobileNumber: '+91 98765 00000',
          dob: '1995-01-01',
          monthlyIncomeRange: '₹50,000 - ₹1,00,000',
          employmentType: 'Corporate / Tech',
          primaryGoal: 'Financial Stability',
          joinedDate: 'Today',
        };

    setUser(loggedUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const loginAsDemo = useCallback(() => {
    setUser(DEFAULT_RAHUL_VERMA);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  }, []);

  const signup = async (userData: {
    fullName: string;
    email: string;
    mobile: string;
    dob: string;
    password: string;
    monthlyIncomeRange: string;
    employmentType: string;
    primaryGoal: string;
  }) => {
    const newUser: UserProfile = {
      id: 'CUST-' + Math.floor(100 + Math.random() * 900),
      name: userData.fullName.trim() || 'Rahul Verma',
      email: userData.email.trim(),
      healthStatus: 'Watch',
      resilienceScore: 72,
      avatarLetter: (userData.fullName.trim().charAt(0) || 'R').toUpperCase(),
      accountNumber: '•••• ' + Math.floor(1000 + Math.random() * 9000),
      mobileNumber: userData.mobile,
      dob: userData.dob,
      monthlyIncomeRange: userData.monthlyIncomeRange,
      employmentType: userData.employmentType,
      primaryGoal: userData.primaryGoal,
      joinedDate: 'Today',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
  };

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setActiveAccountModal(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isAuthModalOpen,
        authModalMode,
        activeAccountModal,
        openSignIn,
        openSignUp,
        closeAuthModal,
        openProfileModal,
        openSecurityModal,
        closeAccountModal,
        login,
        loginAsDemo,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
