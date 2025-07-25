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

export default function SignUpPage() {
  // Get the new signup function and global state from the AuthContext
  const { signup, authStatus, error: authError, clearError } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    occupation: "",
    institution: "",
    year: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setPasswordError(null);
    if (authError) {
      clearError();
    }
  };

  // The handleSubmit function is now much simpler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError(null);
    if (authError) {
      clearError();
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // Create the payload, excluding confirmPassword and converting year
    const { confirmPassword, ...payload } = {
      ...formData,
      year: formData.year ? parseInt(formData.year, 10) : undefined,
    };

    try {
      // Call the centralized signup function from the context
      await signup(payload);
      
      // If signup (and the subsequent login) is successful, redirect
      router.push("/dashboard");

    } catch (err) {
      // The AuthContext now handles setting the error state.
      // We can just log the error here for debugging purposes.
      console.error("Sign-up failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create an Account
          </CardTitle>
          <CardDescription>
            Enter your details below to start your journey with us.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleInputChange} required />
              </div>
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="johndoe@example.com" value={formData.email} onChange={handleInputChange} required />
              </div>
              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="********" value={formData.password} onChange={handleInputChange} required />
              </div>
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" placeholder="********" value={formData.confirmPassword} onChange={handleInputChange} required />
                {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
              </div>
              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="01XXXXXXXXX" value={formData.phone} onChange={handleInputChange} required />
              </div>
               {/* Date of Birth Field */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
              </div>
               {/* Address Field */}
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St, Anytown" value={formData.address} onChange={handleInputChange} required />
              </div>
              {/* Occupation Field */}
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" placeholder="Student / Professional" value={formData.occupation} onChange={handleInputChange} required />
              </div>
              {/* Institution Field */}
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" placeholder="Your University or Company" value={formData.institution} onChange={handleInputChange} required />
              </div>
               {/* Year Field */}
              <div className="space-y-2">
                <Label htmlFor="year">Year / Level</Label>
                <Input id="year" type="number" placeholder="4" value={formData.year} onChange={handleInputChange} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-4 flex-col gap-4">
            {authError && <p className="text-sm text-red-500 text-center">{authError}</p>}
            <Button type="submit" className="w-full" disabled={authStatus === 'loading'}>
              {authStatus === 'loading' ? "Processing..." : "Sign Up"}
            </Button>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/signin" className="font-medium text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
