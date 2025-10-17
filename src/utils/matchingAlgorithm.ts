interface CreatorProfile {
  skills: string | null;
  age: number | null;
  gender: string | null;
  postal_code: string | null;
  content_style: string | null;
}

interface CollaborationPost {
  id: string;
  brand_name: string;
  category: string;
  description: string;
  compensation: string;
  target_audience: string;
  target_age_range: string;
  target_gender: string;
  campaign_brief: string;
  image_url: string | null;
}

interface MatchResult extends CollaborationPost {
  matchScore: number;
  matchReasons: string[];
}

/**
 * Enhanced intelligent matching algorithm that automatically analyzes
 * creator profiles against brand collaborations
 */
export const calculateMatchScore = (
  profile: CreatorProfile,
  post: CollaborationPost
): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // 1. Age Demographic Matching (25 points)
  if (profile.age && post.target_age_range) {
    const ageRanges: { [key: string]: [number, number] } = {
      "18-24": [18, 24],
      "25-34": [25, 34],
      "35-44": [35, 44],
      "45+": [45, 100],
    };
    const range = ageRanges[post.target_age_range];
    if (range && profile.age >= range[0] && profile.age <= range[1]) {
      score += 25;
      reasons.push(`Age matches target (${post.target_age_range})`);
    }
  }

  // 2. Gender Demographic Matching (20 points)
  if (profile.gender && post.target_gender) {
    if (
      post.target_gender.toLowerCase() === "any" ||
      profile.gender.toLowerCase() === post.target_gender.toLowerCase()
    ) {
      score += 20;
      reasons.push("Gender alignment");
    }
  }

  // 3. Content Niche/Skills Matching (30 points)
  if (profile.skills && post.category) {
    const skills = profile.skills.toLowerCase();
    const category = post.category.toLowerCase();
    const description = post.description.toLowerCase();
    
    // Exact category match
    if (skills.includes(category) || category.includes(skills)) {
      score += 30;
      reasons.push(`Content niche matches (${post.category})`);
    }
    // Partial description match
    else if (description.includes(skills) || skills.split(/[,\s]+/).some(skill => 
      skill.length > 3 && description.includes(skill)
    )) {
      score += 15;
      reasons.push("Content relevance detected");
    }
  }

  // 4. Content Style Matching (15 points)
  if (profile.content_style && post.campaign_brief) {
    const contentStyle = profile.content_style.toLowerCase();
    const brief = post.campaign_brief.toLowerCase();
    
    // Check for style keywords
    const styleKeywords = contentStyle.split(/[,\s]+/).filter(k => k.length > 3);
    const matchingKeywords = styleKeywords.filter(keyword => 
      brief.includes(keyword)
    );
    
    if (matchingKeywords.length > 0) {
      score += 15;
      reasons.push("Content style alignment");
    }
  }

  // 5. Geographic Relevance (10 points) - Basic proximity check
  if (profile.postal_code && post.target_audience) {
    const audience = post.target_audience.toLowerCase();
    const postalPrefix = profile.postal_code.substring(0, 3);
    
    // Check if location-specific targeting exists
    if (audience.includes("local") || audience.includes("regional")) {
      score += 10;
      reasons.push("Geographic match");
    }
  }

  return { score, reasons };
};

/**
 * Get top matched collaborations for a creator
 */
export const getMatchedCollaborations = (
  profile: CreatorProfile,
  posts: CollaborationPost[],
  minScore: number = 30,
  limit: number = 6
): MatchResult[] => {
  return posts
    .map((post) => {
      const { score, reasons } = calculateMatchScore(profile, post);
      return {
        ...post,
        matchScore: score,
        matchReasons: reasons,
      };
    })
    .filter((post) => post.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

/**
 * Get top matched creators for a brand's collaboration post
 */
export const getMatchedCreators = (
  post: CollaborationPost,
  creators: Array<{ id: string; profile: CreatorProfile; email: string }>,
  minScore: number = 30,
  limit: number = 10
): Array<{ id: string; email: string; matchScore: number; matchReasons: string[]; profile: CreatorProfile }> => {
  return creators
    .map((creator) => {
      const { score, reasons } = calculateMatchScore(creator.profile, post);
      return {
        ...creator,
        matchScore: score,
        matchReasons: reasons,
      };
    })
    .filter((creator) => creator.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};
