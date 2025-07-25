"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Badge } from "@/components/shadcn/badge";
import { Skeleton } from "@/components/shadcn/skeleton";
import { Button } from "@/components/shadcn/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  LogIn,
  Phone,
  Home,
  Briefcase,
} from "lucide-react";
import privateApi from "@/lib/axios";

// 1. Updated TypeScript types to match the new API response
interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountRole: string; // Renamed from role
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  phone: string;
  address: string;
  occupation: string;
  institution: string;
  year: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

export default function DashboardPage() {
  const { authStatus } = useAuth();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authStatus === "authenticated") {
      const fetchUserProfile = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          // 2. Using the new, specific API endpoint
          const response = await privateApi.get("/api/v0/auth/profile");
          const data: ApiResponse = response.data;

          if (data.success) {
            setUser(data.data.user);
          } else {
            throw new Error(data.message || "Failed to fetch profile.");
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred."
          );
        } finally {
          setIsLoadingData(false);
        }
      };

      fetchUserProfile();
    }
  }, [authStatus]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authStatus === "loading") {
    return <DashboardSkeleton />;
  }

  if (authStatus === "unauthenticated") {
    return <UnauthenticatedUI />;
  }

  if (isLoadingData) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-md p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl text-red-500">
              An Error Occurred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Welcome back, {user?.name}!
          </h1>
          <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
            Here is a summary of your profile and account details.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 3. Enhanced Profile Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your personal and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t">
              <InfoRow label="Name" value={user?.name} />
              <InfoRow label="Email" value={user?.email} />
              <InfoRow
                label="Phone"
                value={user?.phone}
                icon={<Phone className="h-4 w-4 text-gray-400" />}
              />
              <InfoRow
                label="Address"
                value={user?.address}
                icon={<Home className="h-4 w-4 text-gray-400" />}
              />
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Status
              </CardTitle>
              <CardDescription>Your current role and status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t">
              <InfoRow
                label="Role"
                value={<Badge variant="secondary">{user?.accountRole}</Badge>}
              />
              <InfoRow
                label="Status"
                value={
                  <Badge
                    variant={user?.isActive ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {user?.isActive ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {user?.isActive ? "Active" : "Inactive"}
                  </Badge>
                }
              />
              <InfoRow
                label="Verified"
                value={
                  <Badge
                    variant={user?.isVerified ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {user?.isVerified ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    {user?.isVerified ? "Yes" : "Not Verified"}
                  </Badge>
                }
              />
            </CardContent>
          </Card>

          {/* 4. New Professional Details Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional & Academic Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t">
              <InfoRow label="Occupation" value={user?.occupation} />
              <InfoRow label="Institution" value={user?.institution} />
              <InfoRow label="Year" value={user?.year} />
            </CardContent>
          </Card>

          {/* Timestamps Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2 border-t">
              <InfoRow
                label="Date Joined"
                value={user && formatDate(user.createdAt)}
                isDate
              />
              <InfoRow
                label="Last Updated"
                value={user && formatDate(user.updatedAt)}
                isDate
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper component for consistent row styling
const InfoRow = ({
  label,
  value,
  icon,
  isDate,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  isDate?: boolean;
}) => (
  <div className="flex justify-between items-start">
    <span className="font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
      {icon} {label}
    </span>
    <span
      className={`font-semibold text-right ${
        isDate ? "text-md" : "text-sm"
      } text-gray-800 dark:text-gray-200`}
    >
      {value}
    </span>
  </div>
);

// 5. Updated Skeleton to match the new layout
const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <Skeleton className="h-10 w-3/4 rounded-lg" />
        <Skeleton className="h-5 w-1/2 mt-2 rounded-lg" />
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-1/2 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-1/2 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3 rounded-md" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full rounded-md" />
            <Skeleton className="h-8 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const UnauthenticatedUI = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <Card className="w-full max-w-md p-6 text-center">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <LogIn className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="mt-4 text-2xl">Access Denied</CardTitle>
        <CardDescription className="mt-2">
          You must be signed in to view this page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/signin">
          <Button className="w-full">Go to Sign In</Button>
        </Link>
      </CardContent>
    </Card>
  </div>
);
