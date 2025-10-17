import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Sparkles, User, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type UserType = "creator" | "brand" | null;
type AuthMode = "login" | "signup";

export default function Auth() {
  const [userType, setUserType] = useState<UserType>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (authMode === "signup") {
        // Collect all form data for metadata
        const metadata: any = {
          user_type: userType,
        };

        // Add creator-specific fields
        if (userType === "creator") {
          metadata.skills = formData.get("skills") as string;
          metadata.age = formData.get("age") as string;
          metadata.gender = formData.get("gender") as string;
          metadata.postalCode = formData.get("postalCode") as string;
          metadata.contentStyle = formData.get("contentStyle") as string;
        }

        // Add brand-specific fields
        if (userType === "brand") {
          metadata.brandDescription = formData.get("brandDescription") as string;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: metadata,
          },
        });

        if (error) throw error;

        toast({
          title: "Account Created!",
          description: `Welcome to VibeLink as a ${userType}!`,
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Login Successful!",
          description: `Welcome back!`,
        });
      }

      // Redirect based on user type
      if (userType === "creator") {
        navigate("/dashboard");
      } else if (userType === "brand") {
        navigate("/brand-dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center space-y-8 mb-12 animate-fadeIn">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              <span className="text-3xl font-bold gradient-sunset text-gradient">VibeLink</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Join VibeLink as a
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card
              className="p-8 space-y-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/10 animate-slideUp"
              onClick={() => setUserType("creator")}
            >
              <div className="w-16 h-16 rounded-2xl gradient-pink flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center">Creator</h2>
              <p className="text-muted-foreground text-center leading-relaxed">
                Connect with brands, manage collaborations, and let CollabBot handle the business side
              </p>
            </Card>

            <Card
              className="p-8 space-y-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/10 animate-slideUp"
              style={{ animationDelay: "100ms" }}
              onClick={() => setUserType("brand")}
            >
              <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center">Brand</h2>
              <p className="text-muted-foreground text-center leading-relaxed">
                Discover authentic creators, launch campaigns, and find perfect partnerships
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-primary/5">
      <Card className="w-full max-w-2xl p-8 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold gradient-sunset text-gradient">VibeLink</span>
          </div>
          <h2 className="text-3xl font-bold">
            {authMode === "login" ? "Welcome Back" : `${userType === "creator" ? "Creator" : "Brand"} Signup`}
          </h2>
          <p className="text-muted-foreground">
            {authMode === "login" 
              ? "Log in to continue your journey" 
              : "Tell us about yourself to get started"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required />
          </div>

          {authMode === "signup" && userType === "creator" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="skills">Skills / Niches</Label>
                <Input 
                  id="skills"
                  name="skills"
                  placeholder="e.g., Fashion, Tech Reviews, Lifestyle" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age"
                  name="age"
                  type="number"
                  placeholder="e.g., 25" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender"
                  name="gender"
                  placeholder="e.g., Female, Male, Non-binary" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input 
                  id="postalCode"
                  name="postalCode"
                  placeholder="e.g., 90210" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentStyle">Content Style / Primary Platforms</Label>
                <Textarea 
                  id="contentStyle"
                  name="contentStyle"
                  placeholder="e.g., Short-form video on TikTok and Instagram Reels, fun and energetic style"
                  required 
                  rows={3}
                />
              </div>
            </>
          )}

          {authMode === "signup" && userType === "brand" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="brandDescription">Brand Description</Label>
                <Textarea 
                  id="brandDescription"
                  name="brandDescription"
                  placeholder="Tell us about your brand, values, and what makes you unique"
                  required 
                  rows={3}
                />
              </div>
            </>
          )}

          <Button type="submit" variant="gradient" className="w-full" size="lg">
            {authMode === "login" ? "Log In" : "Create Account"}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
              className="text-sm text-primary hover:underline"
            >
              {authMode === "login" 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Log in"}
            </button>
            <div>
              <button
                type="button"
                onClick={() => setUserType(null)}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                ← Change account type
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}