"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { APIKeySettings } from "@/components/settings/api-key-settings";
import { DataSettings } from "@/components/settings/data-settings";
import { ArrowLeft, User, Key, Database } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";

export default function SettingsPage() {
  const { profile, updateProfile } = useProfile();

  if (!profile) return null;
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <Tabs defaultValue="profile">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="profile" className="gap-1.5 text-xs">
              <User className="w-3.5 h-3.5" /> Profile
            </TabsTrigger>
            <TabsTrigger value="apikeys" className="gap-1.5 text-xs">
              <Key className="w-3.5 h-3.5" /> API Keys
            </TabsTrigger>
            <TabsTrigger value="data" className="gap-1.5 text-xs">
              <Database className="w-3.5 h-3.5" /> Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile & Goals</CardTitle>
                <CardDescription>
                  Update your profile to recalculate your daily macro targets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileSettings
                  profile={profile}
                  updateProfileAction={updateProfile}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apikeys">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI API Keys</CardTitle>
                <CardDescription>
                  Add your API keys to enable AI-powered food analysis from
                  photos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <APIKeySettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Management</CardTitle>
                <CardDescription>
                  Export, import, or reset your local data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataSettings />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
