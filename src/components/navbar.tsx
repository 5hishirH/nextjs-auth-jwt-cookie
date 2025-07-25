"use client";

import { Button } from "@/components/shadcn/button";
import { Separator } from "@/components/shadcn/separator";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { authStatus, logout } = useAuth();

  return (
    <nav>
      <div className="px-8 py-4 flex items-center justify-between">
        <section className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              <Link href="/">JWT</Link>
            </h1>
          </div>
          <div>
            <div>
              <Link href="/dashboard">Private</Link>
            </div>
          </div>
        </section>

        <section className="flex items-center gap-4">
          {authStatus === "unauthenticated" ? (
            <>
              <div>
                <Link href="/signup">Sign Up</Link>
              </div>
              <div>
                <Link href="/signin">Sign In</Link>
              </div>
            </>
          ) : (
            authStatus === "authenticated" && (
              <>
                <div>
                  <Button variant="destructive" onClick={logout}>
                    Logout
                  </Button>
                </div>
              </>
            )
          )}
        </section>
      </div>
      <Separator />
    </nav>
  );
};

export default Navbar;
