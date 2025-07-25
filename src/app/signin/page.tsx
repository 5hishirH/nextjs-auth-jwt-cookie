"use client";

import React, { useState } from "react";
import { Button } from "@/components/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  // Get global state and functions from the AuthContext
  const { login, authStatus, error: authError, clearError } = useAuth();
  const router = useRouter();

  // State for form inputs remains local to this component
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear any existing errors when the user starts typing
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authError) {
      clearError();
    }

    try {
      // Call the login function from the context
      await login({
        email: formData.email,
        password: formData.password,
      });

      // If login is successful, redirect to the dashboard
      router.push("/dashboard");
    } catch (err) {
      // The AuthContext's login function will set the global error state.
      // We can log the error here for debugging if needed.
      console.error("Sign-in failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Sign In to Your Account
          </CardTitle>
          <CardDescription>
            Enter your credentials below to access your dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="mt-4 flex-col gap-4">
            {/* Display the global error from the context */}
            {authError && (
              <p className="text-sm text-red-500 text-center">{authError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={authStatus === "loading"}
            >
              {authStatus === "loading" ? "Signing In..." : "Sign In"}
            </Button>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-blue-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
