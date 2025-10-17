import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { Sparkles, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PublishPost() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to publish a post",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("collaboration_posts").insert({
        brand_user_id: user.id,
        brand_name: formData.get("brandName") as string,
        category: formData.get("category") as string,
        description: formData.get("postDescription") as string,
        compensation: formData.get("compensation") as string,
        target_audience: formData.get("targetAudience") as string,
        target_age_range: formData.get("age") as string,
        target_gender: formData.get("gender") as string,
        campaign_brief: formData.get("campaignBrief") as string,
        image_url: formData.get("imageUrl") as string || null,
      });

      if (error) throw error;

      toast({
        title: "Post Published!",
        description: "Your collaboration opportunity has been posted successfully.",
      });
      navigate("/brand-dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to publish post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-primary/5">
      <Card className="w-full max-w-2xl p-8 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-2xl font-bold gradient-sunset text-gradient">VibeLink</span>
          </div>
          <div className="w-16 h-16 rounded-2xl gradient-purple flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold">Publish Collaboration Post</h2>
          <p className="text-muted-foreground">
            Share your collaboration opportunity with creators
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input 
              id="brandName" 
              placeholder="Your brand or company name"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              placeholder="e.g., Fashion, Tech, Beauty, Lifestyle"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postDescription">Description</Label>
            <Textarea 
              id="postDescription" 
              placeholder="Describe your collaboration opportunity, what you're looking for, and what you offer"
              required 
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="compensation">Pay / Compensation</Label>
            <Input 
              id="compensation" 
              placeholder="e.g., $500-$1000, Product exchange, Commission-based"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input 
              id="targetAudience" 
              placeholder="e.g., 18-35 year olds, Female, Urban"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Target Age Range</Label>
            <Input 
              id="age" 
              placeholder="e.g., 18-35" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Target Gender</Label>
            <Input 
              id="gender" 
              placeholder="e.g., All, Female, Male, Non-binary" 
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaignBrief">Campaign Brief</Label>
            <Textarea 
              id="campaignBrief" 
              placeholder="Provide details about the campaign goals, deliverables, timeline, and requirements"
              required 
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Brand Image URL (Optional)</Label>
            <Input 
              id="imageUrl" 
              type="url"
              placeholder="https://example.com/brand-logo.jpg"
            />
          </div>

          <Button type="submit" variant="gradient" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Collaboration"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              ← Back
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
