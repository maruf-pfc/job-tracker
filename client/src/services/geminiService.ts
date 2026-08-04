export type AiInsightResult = {
  assessment: string;
  dos: string[];
  donts: string[];
};

export function getStoredGeminiApiKey(): string {
  return (
    localStorage.getItem("gemini_api_key") ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ""
  );
}

export async function generateDashboardAiInsights(
  stats: {
    totalApplications: number;
    responseRate: number;
    totalInterviews: number;
    totalOffers: number;
  },
  apiKey?: string
): Promise<AiInsightResult> {
  const activeKey = apiKey || getStoredGeminiApiKey();

  if (!activeKey) {
    throw new Error("No Gemini API key provided in localStorage or environment variables.");
  }

  const prompt = `
You are an expert AI Career Coach for software developers.
Analyze the following job application stats for a Full Stack Developer:
- Total Applications: ${stats.totalApplications}
- Response Rate: ${stats.responseRate}%
- Interviews Scheduled: ${stats.totalInterviews}
- Offers Received: ${stats.totalOffers}

Provide a JSON object response matching this exact structure without markdown formatting or backticks:
{
  "assessment": "2-3 sentences assessing application velocity and response rate with actionable advice.",
  "dos": ["3 specific actionable recommendations (DOs) for the candidate"],
  "donts": ["3 critical practices to avoid (DON'Ts)"]
}
`;

  // Real Google AI Studio API models
  const models = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];


  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch {
      // Continue to next model or fallback
    }
  }

  // Smart fallback insights if API key is unconfigured, rate-limited, or network fails
  return {
    assessment: `Based on your current portfolio stats (${stats.totalApplications} total applications, ${stats.totalInterviews} interviews, and ${stats.totalOffers} offers), you have a ${stats.responseRate}% response rate. Keep building momentum by targeting active hiring pipelines!`,
    dos: [
      "Tailor your resume and cover letter for high-priority applications",
      "Follow up with recruiters within 3-5 business days after applying",
      "Practice mock technical interviews focusing on system design and core fundamentals",
    ],
    donts: [
      "Don't apply blindly to batch postings without customized keywords",
      "Don't leave application tracking statuses outdated on your board",
      "Don't forget to send a thank-you note within 24 hours of an interview",
    ],
  };
}
