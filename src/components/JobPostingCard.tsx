import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, DollarSign, Target, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JobPostingCardProps {
  brandName: string;
  category: string;
  description: string;
  compensation: string;
  targetAudience?: string;
  targetAge?: string;
  targetGender?: string;
  link?: string;
}

export const JobPostingCard = ({
  brandName,
  category,
  description,
  compensation,
  targetAudience,
  targetAge,
  targetGender,
  link
}: JobPostingCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    } else {
      navigate('/discover');
    }
  };

  return (
    <Card 
      className="p-4 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
      onClick={handleClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-white">{brandName}</h4>
            <p className="text-sm text-purple-100 font-medium">{category}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-white flex-shrink-0" />
        </div>

        {description && (
          <p className="text-sm text-purple-50 line-clamp-2">{description}</p>
        )}

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
            <DollarSign className="w-3 h-3 text-white" />
            <span className="font-semibold text-white">{compensation}</span>
          </div>
          
          {targetAge && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-white">
              <Target className="w-3 h-3" />
              <span>{targetAge}</span>
            </div>
          )}
          
          {targetGender && (
            <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full text-white">
              <Users className="w-3 h-3" />
              <span>{targetGender}</span>
            </div>
          )}
        </div>

        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full bg-white text-purple-600 hover:bg-purple-50"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};
