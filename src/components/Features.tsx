import { Card } from "@/components/ui/card";
import { Sparkles, Calendar, Shield } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Matching",
    description: "CollabBot analyzes your content, audience, and values to find perfect brand matches.",
    gradient: "gradient-pink",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Let CollabBot handle all your meeting scheduling and calendar coordination automatically.",
    gradient: "gradient-purple",
  },
  {
    icon: Shield,
    title: "Ethical AI Dashboard",
    description: "Full transparency into how AI makes decisions and why brands are suggested.",
    gradient: "gradient-sunset",
  },
];

export const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to
            <span className="gradient-sunset text-gradient block mt-2">Succeed as a Creator</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            VibeLink combines cutting-edge AI with creator-first design to make collaborations effortless.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 space-y-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary/10 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.gradient} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};