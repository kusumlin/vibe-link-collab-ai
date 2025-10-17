import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, X, DollarSign, Users, TrendingUp, Sparkles } from "lucide-react";
import { useState } from "react";

interface BrandCardProps {
  brand: {
    id: string;
    name: string;
    category: string;
    description: string;
    budget: string;
    audience: string;
    matchScore: number;
    imageUrl?: string;
    isRecommended?: boolean;
  };
  onSwipe: (brandId: string, liked: boolean) => void;
}

export const BrandCard = ({ brand, onSwipe }: BrandCardProps) => {
  const [isExiting, setIsExiting] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const handleSwipe = (liked: boolean) => {
    setSwipeDirection(liked ? 'right' : 'left');
    setIsExiting(true);
    
    setTimeout(() => {
      onSwipe(brand.id, liked);
    }, 300);
  };

  return (
    <Card 
      className={`
        relative w-full max-w-md h-[600px] overflow-hidden rounded-3xl shadow-xl
        transition-all duration-300 animate-slideUp
        ${isExiting && swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''}
        ${isExiting && swipeDirection === 'left' ? '-translate-x-full opacity-0' : ''}
      `}
    >
      {/* Brand Image/Gradient Background */}
      <div className="absolute inset-0 gradient-sunset opacity-90" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 text-white">
        {/* Recommended Badge */}
        {brand.isRecommended && (
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 backdrop-blur-sm border border-white/30 shadow-lg animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span className="font-bold text-sm">Recommended for You</span>
          </div>
        )}
        
        {/* Match Score Badge */}
        <div className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">{brand.matchScore}% Match</span>
        </div>

        {/* Brand Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium">
              {brand.category}
            </div>
            <h3 className="text-4xl font-bold">{brand.name}</h3>
          </div>

          <p className="text-white/90 text-lg leading-relaxed">
            {brand.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-medium">{brand.budget}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">{brand.audience}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8">
          <Button
            variant="outline"
            size="icon"
            className="h-16 w-16 rounded-full border-2 border-white bg-white/10 backdrop-blur-sm hover:bg-white hover:text-destructive"
            onClick={() => handleSwipe(false)}
          >
            <X className="w-8 h-8" />
          </Button>
          
          <Button
            variant="gradient"
            size="lg"
            className="flex-1 h-16 text-lg font-semibold"
            onClick={() => handleSwipe(true)}
          >
            <Heart className="w-6 h-6 mr-2" />
            Interested!
          </Button>
        </div>
      </div>
    </Card>
  );
};