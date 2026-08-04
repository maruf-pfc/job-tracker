export type AiInsightResult = {
  assessment: string;
  dos: string[];
  donts: string[];
};

export async function generateDashboardAiInsights(
  stats: {
    totalApplications: number;
    responseRate: number;
    totalInterviews: number;
    totalOffers: number;
  },
  apiKey: string
): Promise<AiInsightResult> {
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

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean any markdown codeblocks if returned
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Failed to generate Gemini AI insights:", error);
    throw error;
  }
}
