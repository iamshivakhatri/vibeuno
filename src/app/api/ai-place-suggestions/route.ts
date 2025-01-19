import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(request: Request) {
  const { origin, destination } = await request.json();

  if (!origin || !destination) {
    return NextResponse.json(
      { error: 'Origin and destination are required' }, 
      { status: 400 }
    );
  }

  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a knowledgeable travel expert. I need suggestions for interesting places to visit between ${origin.name} and ${destination.name}.

    Provide exactly 3 interesting places that are roughly along the route between these locations. For each place:
    1. Name of the location
    2. A brief, engaging description (30-50 words) highlighting why travelers should stop there
    3. Approximate latitude and longitude

    Format your response as a JSON array with this exact structure:
    [
      {
        "name": "Place Name, city, state, country",
        "description": "Description text",
        "lat": latitude_number,
        "lng": longitude_number
      }
    ]

    Ensure the coordinates are reasonably positioned between the origin and destination.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const suggestions = JSON.parse(text);
    console.log("this is the suggestions", suggestions);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error generating place suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate place suggestions' }, 
      { status: 500 }
    );
  }
}

