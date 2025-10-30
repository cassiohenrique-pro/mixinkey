import { GoogleGenAI, Type } from '@google/genai';
import { Track, Suggestion } from '../types';

if (!process.env.API_KEY) {
    // This will be handled by Vercel's environment variables.
    // In local dev, you would use a .env file.
    console.warn("API_KEY is not set. The app will not work without it.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeFile = async (filename: string): Promise<Omit<Track, 'id'>> => {
    const prompt = `
        Act as an expert DJ music analysis tool like Mixed In Key. From the filename "${filename}", infer the artist and title.
        Then, provide the most likely musical key in Camelot notation (e.g., 8A, 10B), the BPM, and an energy level from 1 to 10.
        
        If you cannot infer artist/title, use the filename as the title and "Unknown Artist" as the artist.
        Return the response as a single JSON object with keys "artist", "title", "key", "bpm", and "energy". The bpm and energy should be numbers.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        artist: { type: Type.STRING },
                        title: { type: Type.STRING },
                        key: { type: Type.STRING },
                        bpm: { type: Type.NUMBER },
                        energy: { type: Type.NUMBER }
                    },
                    required: ["artist", "title", "key", "bpm", "energy"]
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (result && typeof result.bpm === 'number' && typeof result.energy === 'number' && typeof result.key === 'string') {
            return result;
        }
        throw new Error("Received invalid data structure from the model.");
    } catch (e) {
        console.error("Error analyzing track:", e);
        throw new Error("Could not parse the analysis from the model's response.");
    }
};


export const getSuggestions = async (currentTrack: Track, library: Track[]): Promise<Suggestion[]> => {
    const libraryString = library.map(t => `- "${t.title}" by ${t.artist} (Key: ${t.key}, BPM: ${t.bpm}, Energy: ${t.energy})`).join('\n');
    
    const prompt = `
        You are a world-class DJ specializing in harmonic mixing using the Camelot wheel.
        I am building a DJ set. The current track playing is:
        - "${currentTrack.title}" by ${currentTrack.artist} (Key: ${currentTrack.key}, BPM: ${currentTrack.bpm}, Energy: ${currentTrack.energy})

        From the following list of available tracks, recommend the top 3 best tracks to mix in next.
        Prioritize harmonic compatibility (mixing in key). Good transitions are:
        1. The exact same key (e.g., 8A -> 8A).
        2. Up or down one number (e.g., 8A -> 7A or 8A -> 9A).
        3. Switching between A and B at the same number (e.g., 8A -> 8B).
        
        Also, consider BPM compatibility (a difference of +/- 5% is good) and energy flow (moving up or down by 1-2 levels is ideal, avoid large jumps unless it's for a big impact).

        Available Tracks:
        ${libraryString}

        Provide your answer as a JSON array of objects, where each object has "title", "artist", and a brief "reason" for the suggestion.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            artist: { type: Type.STRING },
                            reason: { type: Type.STRING }
                        },
                        required: ["title", "artist", "reason"]
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        if (Array.isArray(result)) {
            return result.slice(0, 3);
        }
        throw new Error("Received non-array data from the model.");
    } catch (e) {
        console.error("Error getting suggestions:", e);
        throw new Error("Could not parse suggestions from the model's response.");
    }
};
