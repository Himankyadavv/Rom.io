import { GoogleGenerativeAI } from "@google/generative-ai";
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// __dirname workaround for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from project root
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
console.log(process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY) || "not set";

export async function POST(req) {
  try {
    const { input } = await req.json();
    if (!input) {
      return new Response(JSON.stringify({ error: "Input is required" }), { status: 400 });
    }

    // Format the input into a prompt for Gemini
    const prompt = `Extract key details from the following input and return them in a structured JSON format with fields: title, description, and category. Input: ${input}`;

    // Define the model and generation configuration
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Parse the structured JSON from the response
    const structuredData = JSON.parse(text);

    return new Response(JSON.stringify({ data: structuredData }), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request" }), { status: 500 });
  }
}