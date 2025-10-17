import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageSquare, TrendingUp, Calendar, Target, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogoutButton } from "@/components/LogoutButton";

interface CollaborationPost {
  id: string;
  brand_name: string;
  category: string;
  description: string;
  compensation: string;
  target_audience: string;
  target_age_range: string;
  target_gender: string;
  campaign_brief: string;
  image_url: string | null;
  matchScore?: number;
}

interface CreatorProfile {
  skills: string | null;
  age: number | null;
  gender: string | null;
  postal_code: string | null;
  content_style: string | null;
}

const calculateMatchScore = (
  profile: CreatorProfile,
  post: CollaborationPost
): number => {
  let score = 0;

  // Age matching (40 points)
  if (profile.age && post.target_age_range) {
    const ageRanges: { [key: string]: [number, number] } = {
      "18-24": [18, 24],
      "25-34": [25, 34],
      "35-44": [35, 44],
      "45+": [45, 100],
    };
    const range = ageRanges[post.target_age_range];
    if (range && profile.age >= range[0] && profile.age <= range[1]) {
      score += 40;
    }
  }

  // Gender matching (30 points)
  if (profile.gender && post.target_gender) {
    if (
      post.target_gender.toLowerCase() === "any" ||
      profile.gender.toLowerCase() === post.target_gender.toLowerCase()
    ) {
      score += 30;
    }
  }

  // Skills/Category matching (30 points)
  if (profile.skills && post.category) {
    const skills = profile.skills.toLowerCase();
    const category = post.category.toLowerCase();
    if (skills.includes(category) || category.includes(skills)) {
      score += 30;
    }
  }

  return score;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matchedPosts, setMatchedPosts] = useState<CollaborationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeApplications, setActiveApplications] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?mode=login", { replace: true });
        return;
      }
      setIsAuthenticated(true);
      fetchMatchedCollaborations();
      fetchActiveApplications();
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth?mode=login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchActiveApplications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", user.id);

      setActiveApplications(count || 0);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchMatchedCollaborations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      // Fetch creator profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("skills, age, gender, postal_code, content_style")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Fetch all collaboration posts
      const { data: posts, error: postsError } = await supabase
        .from("collaboration_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // Calculate match scores and sort
      const scoredPosts = posts
        .map((post) => ({
          ...post,
          matchScore: calculateMatchScore(profile, post),
        }))
        .filter((post) => post.matchScore > 0)
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, 6);

      setMatchedPosts(scoredPosts);
    } catch (error) {
      console.error("Error fetching matched collaborations:", error);
      toast({
        title: "Error",
        description: "Failed to load matched collaborations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold gradient-sunset text-gradient">VibeLink</span>
            </div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Active Collaborations</h3>
            <p className="text-3xl font-bold">{activeApplications}</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Matched Opportunities</h3>
            <p className="text-3xl font-bold">{matchedPosts.length}</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">CollabBot Assistant</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/chat")}
              className="w-full"
            >
              Open Chat
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Matched Collaborations for You</h2>
            <Button variant="outline" onClick={() => navigate("/discover")}>
              View All
            </Button>
          </div>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading matched collaborations...</p>
            </Card>
          ) : matchedPosts.length === 0 ? (
            <Card className="p-8 text-center space-y-4">
              <h3 className="text-xl font-semibold">No Matches Yet</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We'll find brand partnerships that match your profile. Check back soon or explore all opportunities.
              </p>
              <Button variant="gradient" onClick={() => navigate("/discover")}>
                Explore All Opportunities
              </Button>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.image_url && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.brand_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold">{post.brand_name}</h3>
                        <p className="text-sm text-muted-foreground">{post.category}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {post.matchScore}%
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {post.target_age_range}
                      </span>
                      <span className="text-xs bg-secondary px-2 py-1 rounded">
                        {post.target_gender}
                      </span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => navigate("/discover")}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
