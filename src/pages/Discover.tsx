import { useState } from "react";
import { BrandCard } from "@/components/BrandCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock brand data
const mockBrands = [
  {
    id: '1',
    name: 'EcoGlow Beauty',
    category: 'Sustainable Beauty',
    description: 'Natural skincare brand looking for authentic voices to share our mission of clean, eco-friendly beauty.',
    budget: '$2K-$5K',
    audience: '18-35F',
    matchScore: 94,
  },
  {
    id: '2',
    name: 'FitLife Nutrition',
    category: 'Health & Wellness',
    description: 'Premium supplement brand seeking fitness creators for long-term partnership and product development.',
    budget: '$3K-$8K',
    audience: '25-45',
    matchScore: 88,
  },
  {
    id: '3',
    name: 'Urban Threads',
    category: 'Fashion',
    description: 'Streetwear brand collaborating with creators who embody LA style and urban culture.',
    budget: '$1.5K-$4K',
    audience: '18-30',
    matchScore: 91,
  },
];

const Discover = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState(mockBrands);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (brandId: string, liked: boolean) => {
    if (liked) {
      toast.success("Match! CollabBot will reach out to schedule a meeting.", {
        description: "Check your dashboard for updates.",
      });
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
          <div className="mb-8 flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20 animate-fadeIn">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm">
              <span className="font-semibold">CollabBot AI</span> has found {brands.length} brands that match your profile and values
            </p>
          </div>

          {/* Card Stack */}
          <div className="flex justify-center items-center min-h-[650px]">
            {currentIndex < brands.length ? (
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