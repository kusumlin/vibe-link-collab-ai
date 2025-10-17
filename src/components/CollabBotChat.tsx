import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import collabBotAvatar from "@/assets/collabbot-avatar.png";

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export const CollabBotChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: "Hey there! 👋 I'm CollabBot, your AI collaboration assistant. I'm here to help you find amazing brand partnerships, schedule meetings, and negotiate fair deals. What would you like to work on today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: "I'm analyzing your request and finding the best opportunities for you! ✨ This is a demo version - connect to Lovable Cloud to enable full AI features.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-2xl h-[600px] flex flex-col rounded-3xl overflow-hidden border-2 border-primary/20 shadow-xl">
      {/* Header */}
      <div className="gradient-sunset p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={collabBotAvatar} 
              alt="CollabBot" 
              className="w-16 h-16 rounded-full animate-float border-4 border-white/30"
            />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              CollabBot
              <Sparkles className="w-5 h-5" />
            </h3>
            <p className="text-white/80 text-sm">Your AI Collaboration Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-slideUp ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.role === 'bot' && (
                <img 
                  src={collabBotAvatar} 
                  alt="CollabBot" 
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              )}
              
              <div
                className={`
                  max-w-[80%] px-4 py-3 rounded-2xl
                  ${message.role === 'user' 
                    ? 'bg-primary text-primary-foreground ml-auto' 
                    : 'bg-muted text-foreground'
                  }
                `}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask CollabBot anything..."
            className="flex-1 h-12 rounded-full border-2 border-primary/20 focus-visible:ring-primary"
          />
          <Button
            onClick={handleSend}
            variant="gradient"
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          CollabBot uses AI to help you manage collaborations
        </p>
      </div>
    </Card>
  );
};