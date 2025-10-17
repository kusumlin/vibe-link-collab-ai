import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Sparkles, MessageSquare, TrendingUp, Calendar } from "lucide-react";

export default function Dashboard() {
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
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Active Collaborations</h3>
            <p className="text-3xl font-bold">0</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">Upcoming Meetings</h3>
            <p className="text-3xl font-bold">0</p>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl gradient-sunset flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold">New Messages</h3>
            <p className="text-3xl font-bold">0</p>
          </Card>
        </div>

        <Card className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Get Started with CollabBot</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Let our AI assistant help you find the perfect brand partnerships and manage your collaborations.
          </p>
          <Button variant="gradient" size="lg" onClick={() => navigate("/chat")}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat with CollabBot
          </Button>
        </Card>
      </div>
    </div>
  );
}
