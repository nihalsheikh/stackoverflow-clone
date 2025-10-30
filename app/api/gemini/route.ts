import { NextResponse } from "next/server";

import config from "@/config/config";

export const POST = async (request: Request) => {
  const { question } = await request.json();

  try {
    // Use AI to generate answers
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.googleGeminiApiKey}`,
        },
        body: JSON.stringify({
          model: "gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a knowledgeable assistant for the platform CodeOverflow, a stackoverflow clone project, where the AI (you) provides quality and precise information for a question. Always start your answer with: "CodeOverflow AI Generated Answer with Google Gemini" on top of body in bold then the rest of the content. If you don't have knowledge about this ${question} please mention: "Ask the @otherDevs on CodeOverflow for better guidance" in your answer.`,
            },
            {
              role: "user",
              content: `Solve the ${question} by providing a short and precise answer. If possible include all the sources to look for (links) and provide code wherever necessary.`,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Gemini API Error:", error);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Failed to get AI response:", error);
    return NextResponse.json({ error: error.message });
  }
};
