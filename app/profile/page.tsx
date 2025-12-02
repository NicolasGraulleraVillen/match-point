"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { Button } from "@/components/ui/button";
import { Heart, List, XCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarUpload } from "@/components/avatar-upload";
import { SportTabContent } from "@/components/sport-tab-content";

export default function ProfilePage() {
  const { currentUser, isLoggedIn, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("Fútbol");

  const refreshUser = () => {
    // Reload user data after profile update
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !currentUser) return null;

  const user = currentUser as User;

  const completionPercentage = user.profileCompletion || 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        {/* Cover Photo */}
        <div className="h-48 w-full bg-muted md:h-64 rounded-lg mb-6"></div>
        {/* Profile Header */}
        <div className="relative -mt-16 mb-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-end">
            <AvatarUpload user={user} currentAvatar={user.avatar} onUpdate={refreshUser} />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold md:text-3xl">
                {user.name} ({completionPercentage < 100 ? `-${100 - completionPercentage}%` : "100%"})
              </h1>
              <p className="text-muted-foreground">@{user.username}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>{user.university}</span>
                <span>•</span>
                <span>{user.age} años</span>
                <span>•</span>
                <span>{user.course}</span>
              </div>
            </div>
            <Link href="/settings">
              <Button variant="outline">Ajustes</Button>
            </Link>
          </div>
        </div>

        {/* Icons Row */}
        <div className="mb-6 flex justify-center gap-4 md:justify-start">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <List className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <XCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Info className="h-5 w-5" />
          </Button>
        </div>

        {/* Sports Tabs */}
        <div className="w-full overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="Fútbol" className="truncate">
                Fútbol
              </TabsTrigger>
              <TabsTrigger value="Baloncesto" className="truncate">
                Baloncesto
              </TabsTrigger>
              <TabsTrigger value="Tenis" className="truncate">
                Tenis
              </TabsTrigger>
              <TabsTrigger value="Pádel" className="truncate">
                Pádel
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Fútbol" className="mt-6">
              <SportTabContent sport="Fútbol" user={user} onUpdate={refreshUser} />
            </TabsContent>

            <TabsContent value="Baloncesto" className="mt-6">
              <SportTabContent sport="Baloncesto" user={user} onUpdate={refreshUser} />
            </TabsContent>

            <TabsContent value="Tenis" className="mt-6">
              <SportTabContent sport="Tenis" user={user} onUpdate={refreshUser} />
            </TabsContent>

            <TabsContent value="Pádel" className="mt-6">
              <SportTabContent sport="Pádel" user={user} onUpdate={refreshUser} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}
