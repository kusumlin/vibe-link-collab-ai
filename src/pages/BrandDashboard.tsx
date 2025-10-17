import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Briefcase, Plus, TrendingUp, Users, Eye } from "lucide-react";
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
  created_at: string;
  applicant_count?: number;
  views?: number;
}

export default function BrandDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CollaborationPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("Brand Dashboard: No session, redirecting to login");
          navigate("/auth?mode=login", { replace: true });
          return;
        }
        
        console.log("Brand Dashboard: Session valid, loading data");
        setIsAuthenticated(true);
        fetchPosts();
      } catch (error) {
        console.error("Brand Dashboard: Auth check error", error);
        navigate("/auth?mode=login", { replace: true });
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Brand Dashboard: Auth state changed -", event);
      
      if (!session) {
        console.log("Brand Dashboard: Session lost, redirecting to login");
        navigate("/auth?mode=login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return;
      }

      const { data, error } = await supabase
        .from("collaboration_posts")
        .select("*")
        .eq("brand_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch applicant counts for each post
      if (data) {
        const postsWithCounts = await Promise.all(
          data.map(async (post) => {
            const { count } = await supabase
              .from("applications")
              .select("*", { count: "exact", head: true })
              .eq("post_id", post.id);
            
            return {
              ...post,
              applicant_count: count || 0,
            };
          })
        );

        setPosts(postsWithCounts);
        
        // Calculate total applicants
        const total = postsWithCounts.reduce((sum, post) => sum + (post.applicant_count || 0), 0);
        setTotalApplicants(total);
        
        // Calculate total views
        const views = postsWithCounts.reduce((sum, post) => sum + (post.views || 0), 0);
        setTotalViews(views);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="gradient" onClick={() => navigate("/publish-post")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <LogoutButton />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Active Posts</h3>
            <p className="text-3xl font-bold">{posts.length}</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Applicants</h3>
            <p className="text-3xl font-bold">{totalApplicants}</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Total Views</h3>
            <p className="text-3xl font-bold">{totalViews}</p>
          </Card>
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Collaboration Posts</h2>
            <Button variant="outline" onClick={() => navigate("/publish-post")}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-4">No collaboration posts yet</p>
              <p className="text-sm mb-6">Create your first post to start connecting with creators</p>
              <Button variant="gradient" onClick={() => navigate("/publish-post")}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{post.brand_name}</h3>
                      <p className="text-sm text-muted-foreground">{post.category}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">{post.description}</p>
                  <div className="flex gap-4 text-sm items-center">
                    <span className="text-primary font-semibold">{post.compensation}</span>
                    <span className="text-muted-foreground">{post.target_audience}</span>
                    <span className="ml-auto flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {post.applicant_count || 0} Applicant{post.applicant_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
