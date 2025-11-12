
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedWorkoutData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const workoutSchema = {
    type: Type.OBJECT,
    properties: {
        date: {
            type: Type.STRING,
            description: "The date of the workout in YYYY-MM-DD format. Infer from the context if possible, otherwise use today's date."
        },
        exercises: {
            type: Type.ARRAY,
            description: "A list of exercises performed in the workout.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: {
                        type: Type.STRING,
                        description: "The name of the exercise, e.g., 'Bench Press', 'Squat'."
                    },
                    sets: {
                        type: Type.ARRAY,
                        description: "An array of sets for this exercise.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                reps: {
                                    type: Type.INTEGER,
                                    description: "The number of repetitions performed."
                                },
                                weight: {
                                    type: Type.NUMBER,
                                    description: "The weight used for the set."
                                },
                                unit: {
                                    type: Type.STRING,
                                    description: "The unit of weight, either 'lbs' or 'kg'. Default to 'lbs' if not specified."
                                }
                            },
                            required: ["reps", "weight", "unit"]
                        }
                    }
                },
                required: ["name", "sets"]
            }
        }
    },
    required: ["date", "exercises"]
};

export async function parseWorkoutFromAudio(audioBase64: string, mimeType: string): Promise<ParsedWorkoutData> {
    const prompt = `
        Analyze the provided audio of a weightlifting workout session.
        Identify each exercise, and for each exercise, list all sets with their corresponding reps and weight.
        Structure the output as a JSON object according to the provided schema.
        Common gym terms: 'a plate' or 'plates' means 45 lbs. 'a quarter' is 25 lbs.
        If the weight unit isn't specified, assume it is 'lbs'.
        The audio is noisy and may contain grunts, background music, and chatter. Focus only on the speech related to the workout log.
    `;

    const audioPart = {
        inlineData: {
            data: audioBase64,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: prompt,
    };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [audioPart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: workoutSchema,
            },
        });
        
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);

        // Basic validation
        if (!parsedJson.exercises || !Array.isArray(parsedJson.exercises)) {
            throw new Error("Invalid JSON structure from AI: missing 'exercises' array.");
        }

        return parsedJson as ParsedWorkoutData;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to parse workout from audio.");
    }
}
