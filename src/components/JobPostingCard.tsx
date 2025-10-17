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
      className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-primary/20 hover:border-primary/40 bg-gradient-to-br from-background to-primary/5"
      onClick={handleClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="text-lg font-bold text-foreground">{brandName}</h4>
            <p className="text-sm text-primary font-medium">{category}</p>
          </div>
          <ExternalLink className="w-5 h-5 text-primary flex-shrink-0" />
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
            <DollarSign className="w-3 h-3 text-primary" />
            <span className="font-semibold text-primary">{compensation}</span>
          </div>
          
          {targetAge && (
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
              <Target className="w-3 h-3" />
              <span>{targetAge}</span>
            </div>
          )}
          
          {targetGender && (
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-full">
              <Users className="w-3 h-3" />
              <span>{targetGender}</span>
            </div>
          )}
        </div>

        <Button 
          variant="gradient" 
          size="sm" 
          className="w-full"
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
