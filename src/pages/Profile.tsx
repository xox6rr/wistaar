import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, Loader2 } from "lucide-react";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile>({ display_name: null, avatar_url: null, bio: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, bio")
        .eq("user_id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setDisplayName(data.display_name ?? "");
        setAvatarUrl(data.avatar_url ?? "");
        setBio(data.bio ?? "");
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName || null,
        avatar_url: avatarUrl || null,
        bio: bio || null,
      })
      .eq("user_id", user.id);

    setIsSaving(false);

    if (error) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } else {
      setProfile({ display_name: displayName || null, avatar_url: avatarUrl || null, bio: bio || null });
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    }
  };

  const initials = (displayName || user?.email || "U").slice(0, 2).toUpperCase();
  const hasChanges =
    displayName !== (profile.display_name ?? "") ||
    avatarUrl !== (profile.avatar_url ?? "") ||
    bio !== (profile.bio ?? "");

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container-main pt-24 pb-16">
        <div className="max-w-xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-serif mb-1">Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your account details</p>
          </div>

          {/* Avatar preview */}
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-accent text-accent-foreground text-lg font-serif">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{displayName || "No name set"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Avatar URL
                </Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Joined {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                </p>
                <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
