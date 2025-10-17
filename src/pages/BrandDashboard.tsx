import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, Briefcase, Plus, TrendingUp, Users, Eye } from "lucide-react";

export default function BrandDashboard() {
  const navigate = useNavigate();

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
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Active Posts</h3>
            <p className="text-3xl font-bold">0</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Applicants</h3>
            <p className="text-3xl font-bold">0</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Total Views</h3>
            <p className="text-3xl font-bold">0</p>
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
          
          <div className="text-center py-12 text-muted-foreground">
            <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-4">No collaboration posts yet</p>
            <p className="text-sm mb-6">Create your first post to start connecting with creators</p>
            <Button variant="gradient" onClick={() => navigate("/publish-post")}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Post
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
