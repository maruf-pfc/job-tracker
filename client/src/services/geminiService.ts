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

  // Prioritized list of real Gemini models — highest capability first
  const models = [
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-pro-exp",
    "gemini-1.5-pro-latest",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
  ];

  let lastError: Error | null = null;

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
        const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to generate Gemini AI insights across all Pro & Flash models.");
}
