"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { CreateUserInput } from "@/models/user.model";

// 1. Define the Raw DB Response Type (snake_case)
interface DBUserResponse {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  company?: string;
  size?: string;
  role?: string;
  country?: string;
  timezone?: string;
  verified_domain?: string;
  created_at?: string;
}

interface AuthContextType {
  user: CreateUserInput | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  refreshUser: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

// 2. The Parser Function: Transforms DB snake_case -> App camelCase
const parseUser = (raw: DBUserResponse): CreateUserInput => {
  return {
    uid: raw.uid,
    email: raw.email,
    firstName: raw.firstName || "",
    lastName: raw.lastName || "",
    avatar: raw.avatar || "",
    company: raw.company || "",
    size: raw.size || "",
    role: raw.role || "",
    country: raw.country || "",
    timezone: raw.timezone || "",
    verifiedDomain: raw.verified_domain || "",
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CreateUserInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch("/api/users");

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          // 3. Apply the parser here
          const cleanUser = parseUser(data.user);
          setUser(cleanUser);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user session:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    isLoading,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
