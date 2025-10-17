import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Sparkles, Search, MessageSquare, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogoutButton } from "@/components/LogoutButton";

const Index = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold gradient-sunset text-gradient">VibeLink</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/chat')}>
              <MessageSquare className="w-4 h-4 mr-2" />
              CollabBot
            </Button>
            <Button variant="gradient" onClick={() => navigate('/discover')}>
              <Search className="w-4 h-4 mr-2" />
              Discover Brands
            </Button>
            {isLoggedIn ? (
              <LogoutButton />
            ) : (
              <Button variant="outline" onClick={() => navigate('/auth?mode=login')}>
                <LogIn className="w-4 h-4 mr-2" />
                Log In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Collabot Section */}
      

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto text-center space-y-8 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Transform Your
            <span className="gradient-sunset text-gradient block mt-2">Creator Journey?</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of creators who are building meaningful partnerships with VibeLink.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button variant="gradient" size="xl" onClick={() => navigate('/discover')}>
              Start Discovering
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate('/chat')}>
              Chat with CollabBot
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold gradient-sunset text-gradient">VibeLink</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Empowering content creators with AI-driven collaboration opportunities
          </p>
          <p className="text-xs text-muted-foreground">
            © 2025 VibeLink. Built with Lovable.
          </p>
        </div>
      </footer>
    </div>;
};
export default Index;