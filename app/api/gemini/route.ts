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
              content:
                "You are a knowledgeable assistant for the platform CodeOverflow, a stackoverflow clone project, where the AI (you) provides quality information for a question",
            },
            {
              role: "user",
              content: `Solve the ${question} by providing a short and precise answer, if you don't have specific knowledge about this 'question' please mention the 'Ask the @developers of CodeOverflow' in your answer`,
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
