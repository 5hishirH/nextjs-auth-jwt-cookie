"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import privateApi from "@/lib/axios";

// --- NEW: Define types for login and signup data ---
interface LoginCredentials {
  email: string;
  password: string;
}

// Matches the request body for the new sign-up endpoint
interface SignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  occupation: string;
  institution: string;
  year?: number;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "error";

// --- NEW: Add the signup function to the context type ---
interface AuthContextType {
  authStatus: AuthStatus;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>; // New signup function
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    privateApi
      .get("/api/auth/verify", { signal: controller.signal })
      .then(() => {
        setAuthStatus("authenticated");
        setError(null);
      })
      .catch((err) => {
        if (err.name === "CanceledError") return;
        if (err.response?.status === 403 || err.response?.status === 401) {
          setAuthStatus("unauthenticated");
        } else {
          setAuthStatus("error");
          setError("Could not verify session. The server may be down.");
        }
      });
    return () => {
      controller.abort();
    };
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setAuthStatus("loading");
    setError(null);
    return new Promise((resolve, reject) => {
      privateApi
        .post("/api/v0/auth/login", credentials)
        .then(() => {
          setAuthStatus("authenticated");
          resolve();
        })
        .catch((err) => {
          let errorMessage: string;
          if (err.response?.status === 403) {
            errorMessage =
              err.response?.data?.message || "Invalid email or password.";
            setAuthStatus("unauthenticated");
          } else {
            errorMessage =
              "An unexpected server error occurred. Please try again later.";
            setAuthStatus("error");
          }
          setError(errorMessage);
          reject(new Error(errorMessage));
        });
    });
  };

  // --- NEW: Centralized Signup Function ---
  const signup = async (data: SignupData): Promise<void> => {
    setAuthStatus("loading");
    setError(null);

    return new Promise((resolve, reject) => {
      // Step 1: Attempt to register the new user
      privateApi
        .post("/api/v0/auth/register", data)
        .then(() => {
          // Step 2: If registration is successful, automatically log them in
          // This reuses the existing login logic.
          return login({ email: data.email, password: data.password });
        })
        .then(() => {
          // Step 3: If login is successful, resolve the main promise
          resolve();
        })
        .catch((err) => {
          // This will catch errors from either the register or login steps
          let errorMessage: string;
          if (err.response?.status === 409) {
            // Example: 409 Conflict for duplicate email
            errorMessage =
              err.response?.data?.message ||
              "An account with this email already exists.";
            setAuthStatus("unauthenticated");
          } else {
            errorMessage =
              err.response?.data?.message ||
              "An unexpected error occurred during sign-up.";
            setAuthStatus("error");
          }
          setError(errorMessage);
          reject(new Error(errorMessage));
        });
    });
  };

  const logout = () => {
    setAuthStatus("loading");
    setError(null);
    privateApi
      .post("/api/v0/auth/logout")
      .then(() => {
        setAuthStatus("unauthenticated");
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          setAuthStatus("unauthenticated");
        } else {
          setAuthStatus("authenticated");
          setError(
            err.response?.data?.message || "Logout failed. Please try again."
          );
        }
      });
  };

  const clearError = () => {
    setError(null);
    if (authStatus === "error") {
      setAuthStatus("unauthenticated");
    }
  };

  const value = { authStatus, error, login, signup, logout, clearError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
