import { GoogleGenAI, HarmCategory, HarmBlockThreshold, Part, Modality } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import mime from 'mime';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

const MODEL_NAME = "gemini-2.0-flash-exp-image-generation"; // Use the experimental model
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable.');
}

// Configuration for the generation - adjust safety settings if needed
const generationConfig = {
  temperature: 0.8, // Example temperature, adjust as needed
  topK: 32,
  topP: 1,
  maxOutputTokens: 4096, // Adjust if necessary, though response is mainly image
};

// Safety settings - Set all to BLOCK_NONE to minimize filtering
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Initialize with the correct class name and options object
const genAI = new GoogleGenAI({ apiKey: API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, aspectRatio } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // --- Construct the prompt ---
    // Basic approach: Combine inputs into the text prompt.
    // The effectiveness depends on how the experimental model interprets these hints.
    let fullPrompt = `Create an image of ${prompt}`;
    if (style && style !== 'Default') { // Assuming 'Default' means no specific style hint
      fullPrompt += `, ${style.toLowerCase()} style`;
    }
    if (aspectRatio && aspectRatio !== 'Default') { // Assuming 'Default' means no specific ratio hint
        fullPrompt += `, ${aspectRatio} aspect ratio`;
    }
    // Add more details if needed, e.g., negative prompts, quality hints
    // fullPrompt += ", photorealistic, high quality"; // Example quality hint

    console.log("Sending prompt to Gemini:", fullPrompt); // Log the prompt being sent

    const parts = [
      { text: fullPrompt },
    ];

    // Use genAI.models.generateContent and pass model name here
    const result = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts }],
      config: {
          // Explicitly request both TEXT and IMAGE modalities
          responseModalities: [Modality.TEXT, Modality.IMAGE],
          // Keep other config options if needed, e.g., temperature, safetySettings (though might be ignored)
          // temperature: 0.8,
          // safetySettings, // Commented out as per previous observation
      }
    });

    // Access response directly from result
    const response = result;

    // --- Process the response ---
    if (!response) {
        console.error("Gemini API returned no response.");
        throw new Error("No response from generation model.");
    }

    // Check for safety blocks or empty candidates
    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts) {
        console.error("Gemini API response blocked or invalid:", JSON.stringify(response));
        const blockReason = response.promptFeedback?.blockReason;
        const safetyRatings = response.promptFeedback?.safetyRatings;
        throw new Error(`Image generation failed. ${blockReason ? `Reason: ${blockReason}` : 'No valid candidate returned.'}${safetyRatings ? ` Ratings: ${JSON.stringify(safetyRatings)}` : ''}`);
    }

    // Find the image part
    const imagePart = response.candidates[0].content.parts.find(
      (part: Part) => part.inlineData && typeof part.inlineData.mimeType === 'string' && part.inlineData.mimeType.startsWith('image/')
    );

    if (imagePart && imagePart.inlineData) {
        const base64Data = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        console.log(`Received image data (${mimeType})`);
        return NextResponse.json({ imageData: base64Data, mimeType: mimeType });
    } else {
        // Handle cases where text is returned instead of an image (e.g., safety refusal)
        const textPart = response.candidates[0].content.parts.find((part: Part) => part.text);
        const errorText = textPart?.text || "Model did not return image data.";
        console.error("Gemini API did not return image data. Text response:", errorText);
        throw new Error(`Image generation failed: ${errorText}`);
    }

  } catch (error: any) {
    console.error('Error generating image:', error);
    return NextResponse.json(
        { error: error.message || 'Failed to generate image' },
        { status: 500 }
    );
  }
} 