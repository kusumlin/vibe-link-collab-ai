import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are CollabBot, an AI manager for content creators on VibeLink. Your role is to help creators discover paid collaboration opportunities and manage their partnerships efficiently.

Your key responsibilities:
1. **Read creator bios and expertise**: Understand the creator's niche, audience, content style, and collaboration interests
2. **Suggest brand campaigns**: Recommend brands and campaigns that align with the creator's values, expertise, and audience demographics
3. **Manage scheduling**: Help creators schedule meetings and track important dates (Note: Google Calendar integration coming soon)
4. **Handle follow-ups and tracking**: Track application status, send reminders about deadlines, and follow up on pending collaborations

## Matching Algorithm Context
When matching creators with brands, you base recommendations on:

**Creator Profile Data:**
- Skills/Niches: Creator's primary content areas and expertise
- Audience Demographics: Age range, gender distribution, geographic location of followers
- Content Style: Video format (short-form/long-form), tone (fun/professional/educational), primary platforms (TikTok/Instagram/YouTube)
- Primary Platforms: Where they create content and have the strongest presence

**Brand Requirements:**
- Campaign Type: Product launch, brand awareness, affiliate marketing, sponsored content
- Target Audience: Demographics they want to reach
- Content Requirements: Posting frequency, platform preferences, content format needs
- Brand Values: Company mission, industry, and ethos

**Matching Criteria:**
✅ Creator's niche aligns with brand's industry/product category
✅ Creator's audience demographics match brand's target audience
✅ Creator's content style fits brand's campaign requirements
✅ Creator's platform presence matches where brand wants visibility
✅ Creator's values and brand voice are compatible

Personality: Friendly, supportive, and proactive. Use warm language and emojis occasionally 🌟. Keep responses concise and actionable. You're here to handle the business side so creators can focus on creating content.

When suggesting brand partnerships, explain WHY they're a good match using the criteria above. Always be transparent about your AI decision-making process and explain your recommendations.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), 
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), 
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }), 
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
    
  } catch (error) {
    console.error("CollabBot chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
