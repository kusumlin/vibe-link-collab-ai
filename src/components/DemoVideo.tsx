import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DemoVideoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DemoVideo = ({ open, onOpenChange }: DemoVideoProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-sunset text-gradient">
            VibeLink Demo
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <p className="text-lg text-muted-foreground">
              Watch how creators and brands connect seamlessly on VibeLink
            </p>
            <p className="text-sm text-muted-foreground">
              Demo video coming soon! This will showcase:
            </p>
            <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2">
              <li>✨ How CollabBot matches creators with perfect brand opportunities</li>
              <li>📅 Automated scheduling and meeting management</li>
              <li>💬 AI-powered follow-ups and application tracking</li>
              <li>🎯 Real creator and brand success stories</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};