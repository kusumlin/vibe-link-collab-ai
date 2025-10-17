import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Mail, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CreatorMatch {
  id: string;
  email: string;
  matchScore: number;
  matchReasons: string[];
  profile: {
    skills: string | null;
    age: number | null;
    gender: string | null;
    content_style: string | null;
  };
}

interface SuggestedCreatorsProps {
  creators: CreatorMatch[];
  brandName: string;
}

export const SuggestedCreators = ({ creators, brandName }: SuggestedCreatorsProps) => {
  if (creators.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-xl font-semibold mb-2">No Suggested Creators Yet</h3>
        <p className="text-muted-foreground">
          CollabBot will suggest creators as more creators join and match your campaign requirements.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {creators.map((creator) => (
        <Card key={creator.id} className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{creator.email}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-amber-600">
                    {creator.matchScore}% Match
                  </span>
                </div>
              </div>

              {creator.profile.skills && (
                <div>
                  <span className="text-sm text-muted-foreground">Content Focus: </span>
                  <span className="text-sm font-medium">{creator.profile.skills}</span>
                </div>
              )}

              {creator.profile.content_style && (
                <div>
                  <span className="text-sm text-muted-foreground">Style: </span>
                  <span className="text-sm font-medium">{creator.profile.content_style}</span>
                </div>
              )}

              {creator.profile.age && (
                <div>
                  <span className="text-sm text-muted-foreground">Age: </span>
                  <span className="text-sm font-medium">{creator.profile.age}</span>
                </div>
              )}

              {creator.matchReasons.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {creator.matchReasons.map((reason, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button size="sm" variant="default">
                <Mail className="w-3 h-3 mr-1" />
                Contact
              </Button>
              <Button size="sm" variant="outline">
                <ExternalLink className="w-3 h-3 mr-1" />
                View Profile
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
