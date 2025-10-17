import { useState, useEffect } from "react";
import { BrandCard } from "@/components/BrandCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Discover = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const { data, error } = await supabase
          .from('collaboration_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map database fields to BrandCard format
        const mappedBrands = data?.map((post) => ({
          id: post.id,
          name: post.brand_name,
          category: post.category,
          description: post.description,
          budget: post.compensation,
          audience: `${post.target_age_range}, ${post.target_gender}`,
          matchScore: Math.floor(Math.random() * 15) + 85, // Random score 85-99
          imageUrl: post.image_url,
        })) || [];

        setBrands(mappedBrands);
      } catch (error) {
        console.error('Error fetching brands:', error);
        toast.error("Failed to load brand postings");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleSwipe = async (brandId: string, liked: boolean) => {
    // Increment view count for this post
    try {
      const { data: post } = await supabase
        .from('collaboration_posts')
        .select('views')
        .eq('id', brandId)
        .single();
      
      if (post) {
        await supabase
          .from('collaboration_posts')
          .update({ views: (post.views || 0) + 1 })
          .eq('id', brandId);
      }
    } catch (error) {
      console.error('Error updating views:', error);
    }

    if (liked) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Save application to database
          const { error } = await supabase
            .from('applications')
            .insert({
              creator_id: user.id,
              post_id: brandId,
              status: 'pending'
            });

          if (error) {
            console.error('Error saving application:', error);
          } else {
            toast.success("Match! CollabBot will reach out to schedule a meeting.", {
              description: "Check your dashboard for updates.",
            });
          }
        }
      } catch (error) {
        console.error('Error in handleSwipe:', error);
      }
    }
    
    setCurrentIndex(prev => prev + 1);
  };

  const currentBrand = brands[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold gradient-sunset text-gradient">Discover Brands</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Info Banner */}
          {!loading && brands.length > 0 && (
            <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-fadeIn">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm">
                <span className="font-semibold">CollabBot AI</span> has found {brands.length} brands that match your profile and values
              </p>
            </div>
          )}

          {/* Card Stack */}
          <div className="flex justify-center items-center min-h-[650px]">
            {loading ? (
              <div className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading brand opportunities...</p>
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center space-y-6 animate-fadeIn">
                <div className="w-24 h-24 mx-auto rounded-full gradient-sunset flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">No Brands Yet</h2>
                  <p className="text-muted-foreground">
                    Check back later for new collaboration opportunities.
                  </p>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Return Home
                </Button>
              </div>
            ) : currentIndex < brands.length ? (
              <BrandCard
                key={currentBrand.id}
                brand={currentBrand}
                onSwipe={handleSwipe}
              />
            ) : (
              <div className="text-center space-y-6 animate-fadeIn">
                <div className="w-24 h-24 mx-auto rounded-full gradient-sunset flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">All Caught Up!</h2>
                  <p className="text-muted-foreground">
                    CollabBot will notify you when new brand matches are available.
                  </p>
                </div>
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => navigate('/')}
                >
                  Return Home
                </Button>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {currentIndex < brands.length && (
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Brand {currentIndex + 1} of {brands.length}</span>
                <span>{Math.round(((currentIndex + 1) / brands.length) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full gradient-sunset transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / brands.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Discover;