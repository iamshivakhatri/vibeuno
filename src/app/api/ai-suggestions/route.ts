import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  const { place } = await request.json();

  if (!place) {
    return NextResponse.json({ error: "Place is required" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
You are a travel suggestion expert. Provide recommendations for travelers visiting "${place}".

Format the response as a JSON object adhering to the following structure:

{
  "activities": [
    {
      "name": "string", // Name of the activity or experience
      "description": "string" // Description of the activity
    },
    ...
  ],
  "food": [
    {
      "name": "string", // Name of the food or dining experience
      "description": "string" // Description of the food or dining experience
    },
    ...
  ]
}

Requirements:
- Include exactly 5 activities in the "activities" array.
- Include exactly 5 food and dining suggestions in the "food" array.
- Ensure all names and descriptions are concise yet descriptive.
- Tailor suggestions to the destination "${place}".
`;

    console.log("this is the prompt", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    console.log("this is the text", rawText);
    const sanitizedJsonString = rawText
      .replace(/^```.*\n/, "")
      .replace(/\n```$/, "");

    let suggestions;
    try {
      suggestions = JSON.parse(sanitizedJsonString);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      suggestions = { activities: [], food: [] };
    }

    // Ensure the response has the correct structure
    if (!suggestions.activities || !Array.isArray(suggestions.activities)) {
      suggestions.activities = [];
    }
    if (!suggestions.food || !Array.isArray(suggestions.food)) {
      suggestions.food = [];
    }

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return NextResponse.json({ activities: [], food: [] }, { status: 200 });
  }
}
