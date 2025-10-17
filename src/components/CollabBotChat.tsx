import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import collabBotAvatar from "@/assets/collabbot-avatar.png";
import { JobPostingCard } from "./JobPostingCard";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  jobPostings?: Array<{
    brandName: string;
    category: string;
    description: string;
    compensation: string;
    targetAudience?: string;
    targetAge?: string;
    targetGender?: string;
    link?: string;
  }>;
}

export const CollabBotChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there! 👋 I'm CollabBot, your AI collaboration assistant. I'm here to help you find amazing brand partnerships, schedule meetings, and track your collaborations. What would you like to work on today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseJobPostings = (content: string) => {
    const jobPostings = [];
    const regex = /\[JOB_CARD\]([\s\S]*?)\[\/JOB_CARD\]/g;
    
    let match;
    while ((match = regex.exec(content)) !== null) {
      const cardContent = match[1];
      const brandMatch = cardContent.match(/Brand:\s*(.+)/);
      const categoryMatch = cardContent.match(/Category:\s*(.+)/);
      const compensationMatch = cardContent.match(/Compensation:\s*(.+)/);
      const descriptionMatch = cardContent.match(/Description:\s*(.+)/);
      const ageMatch = cardContent.match(/TargetAge:\s*(.+)/);
      const genderMatch = cardContent.match(/TargetGender:\s*(.+)/);
      const linkMatch = cardContent.match(/Link:\s*(.+)/);
      
      if (brandMatch && compensationMatch) {
        jobPostings.push({
          brandName: brandMatch[1].trim(),
          category: categoryMatch?.[1].trim() || '',
          description: descriptionMatch?.[1].trim() || '',
          compensation: compensationMatch[1].trim(),
          targetAge: ageMatch?.[1].trim(),
          targetGender: genderMatch?.[1].trim(),
          link: linkMatch?.[1].trim()
        });
      }
    }
    
    return jobPostings;
  };

  const cleanMessageContent = (content: string) => {
    // Remove JOB_CARD blocks from display
    return content.replace(/\[JOB_CARD\][\s\S]*?\[\/JOB_CARD\]/g, '').trim();
  };

  const streamChat = async (userMessages: Message[]) => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/collabbot-chat`;
    
    const response = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ 
        messages: userMessages.map(m => ({ role: m.role, content: m.content }))
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      }
      if (response.status === 402) {
        throw new Error("AI credits depleted. Please add credits to continue.");
      }
      throw new Error("Failed to get response from CollabBot");
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    const botMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "",
      timestamp: new Date(),
      jobPostings: []
    };
    setMessages(prev => [...prev, botMessage]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg.role === 'assistant') {
                lastMsg.content = assistantContent;
                lastMsg.jobPostings = parseJobPostings(assistantContent);
              }
              return updated;
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat([...messages, userMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
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
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-slideUp ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {message.role === 'assistant' && (
                <img 
                  src={collabBotAvatar} 
                  alt="CollabBot" 
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              )}
              
              <div className={`max-w-[80%] space-y-3 ${message.role === 'user' ? 'ml-auto' : ''}`}>
                {cleanMessageContent(message.content) && (
                  <div
                    className={`
                      px-4 py-3 rounded-2xl
                      ${message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-foreground'
                      }
                    `}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{cleanMessageContent(message.content)}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
                
                {message.role === 'assistant' && message.jobPostings && message.jobPostings.length > 0 && (
                  <div className="space-y-2">
                    {message.jobPostings.map((job, idx) => (
                      <JobPostingCard key={idx} {...job} />
                    ))}
                  </div>
                )}
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
            disabled={isLoading}
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