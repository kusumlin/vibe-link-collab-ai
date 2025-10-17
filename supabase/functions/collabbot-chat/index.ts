import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

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
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Get user ID from auth header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    
    // Verify token and get user
    let userId: string | null = null;
    let creatorProfile: any = null;
    
    if (token) {
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
        
        // Fetch creator profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("skills, age, gender, postal_code, content_style, user_type")
          .eq("id", userId)
          .single();
        
        if (!profileError && profile) {
          creatorProfile = profile;
          console.log("Loaded creator profile:", creatorProfile);
        }
      }
    }

    // Fetch available collaboration posts
    const { data: posts, error: postsError } = await supabase
      .from("collaboration_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (postsError) {
      console.error("Error fetching posts:", postsError);
    }

    // Format creator profile context
    const profileContext = creatorProfile 
      ? `\n\n## CREATOR PROFILE DATA (Use this to match opportunities automatically):\n
- Skills/Niche: ${creatorProfile.skills || "Not specified"}
- Age: ${creatorProfile.age || "Not specified"}
- Gender: ${creatorProfile.gender || "Not specified"}
- Location (Postal Code): ${creatorProfile.postal_code || "Not specified"}
- Content Style: ${creatorProfile.content_style || "Not specified"}

**IMPORTANT**: You have access to this creator's profile data. DO NOT ask them to provide their skills, demographics, or content style again. Use this data to automatically suggest relevant brand collaborations that match their profile.`
      : "\n\n## CREATOR PROFILE: Profile data not available. You may ask basic questions if needed.";

    // Format posts for AI context
    const postsContext = posts && posts.length > 0 
      ? `\n\n## AVAILABLE BRAND COLLABORATION OPPORTUNITIES:\n\n${posts.map((post, index) => {
          // Calculate match score if we have creator profile
          let matchInfo = "";
          if (creatorProfile) {
            const matchReasons = [];
            
            // Age matching
            const ageRanges: { [key: string]: [number, number] } = {
              "18-24": [18, 24],
              "25-34": [25, 34],
              "35-44": [35, 44],
              "45+": [45, 100],
            };
            const range = ageRanges[post.target_age_range];
            if (range && creatorProfile.age >= range[0] && creatorProfile.age <= range[1]) {
              matchReasons.push("Age matches target");
            }
            
            // Gender matching
            if (post.target_gender.toLowerCase() === "any" || 
                creatorProfile.gender?.toLowerCase() === post.target_gender.toLowerCase()) {
              matchReasons.push("Gender matches target");
            }
            
            // Skills/Category matching
            if (creatorProfile.skills && post.category) {
              const skills = creatorProfile.skills.toLowerCase();
              const category = post.category.toLowerCase();
              if (skills.includes(category) || category.includes(skills)) {
                matchReasons.push("Skills align with category");
              }
            }
            
            if (matchReasons.length > 0) {
              matchInfo = `\n   - 🎯 MATCH REASONS: ${matchReasons.join(", ")}`;
            }
          }
          
          return `${index + 1}. **${post.brand_name}** - ${post.category}
   - Description: ${post.description}
   - Compensation: ${post.compensation}
   - Target Audience: ${post.target_audience}
   - Target Age: ${post.target_age_range}
   - Target Gender: ${post.target_gender}
   - Campaign Brief: ${post.campaign_brief}${matchInfo}
   - Post ID: ${post.id}
   - View Link: https://3973aeea-a86d-4604-afb3-4a69ac05edd9.lovableproject.com/discover`;
         }).join('\n\n')}\n\n**COMMUNICATION STYLE & FORMATTING**: 
- Be CONCISE and direct - keep responses to 1-2 sentences
- DO NOT ask for profile information - you already have it
- When listing opportunities, use this EXACT format for each posting (this will be parsed into clickable cards):
  
  [JOB_CARD]
  Brand: [Brand Name]
  Category: [Category]
  Compensation: [Amount]
  Description: [Brief description]
  TargetAge: [Age Range]
  TargetGender: [Gender]
  Link: [URL]
  [/JOB_CARD]

- Do NOT show links in plain text - they will be rendered as clickable cards
- Example response: "Found 2 Levi's opportunities for you: [JOB_CARD]...[/JOB_CARD]"`
      : "\n\nCurrently, there are no active brand collaboration opportunities available. Check back soon!";

    const systemPrompt = `You are CollabBot, an AI manager for content creators on VibeLink. Your role is to help creators discover paid collaboration opportunities and manage their partnerships efficiently.${profileContext}${postsContext}

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

Personality: Friendly but CONCISE. Keep responses short - 2-3 sentences maximum. Just provide what they asked for with links. No lengthy explanations unless specifically requested. Don't ask for information you already have in their profile.`;

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
