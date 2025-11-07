// gemini.ts

import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

/**
 * Inisialisasi SDK Gemini (gunakan 1 instance global)
 */
const genAI = new GoogleGenAI({
    // Pastikan variabel lingkungan sudah di-set
    apiKey: process.env.GEMINI_API_KEY ?? "",
});

/**
 * Ekstrak teks langsung menggunakan `response.text`.
 * Ini adalah properti standar di SDK versi terbaru.
 */
function extractText(result: GenerateContentResponse): string {
    // Properti 'text' adalah cara standar dan paling bersih
    const textOutput = result.text;
    
    if (typeof textOutput === "string" && textOutput.trim().length > 0) {
        return textOutput.trim();
    }
    
    // Fallback jika tidak ada teks yang dihasilkan
    return "Output Gemini tidak menghasilkan teks yang valid.";
}

/**
 * Kirim prompt ke Gemini model
 */
export async function askGemini(
    prompt: string,
    model: string = "gemini-2.5-flash"
): Promise<string> {
    // Tambahkan validasi kunci API di sini untuk early exit
    if (!process.env.GEMINI_API_KEY) {
        return "Error: Kunci API Gemini hilang.";
    }
    
    try {
        const response = await genAI.models.generateContent({
            model,
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });

        // Cek kandidat respons untuk mendeteksi pemblokiran
        if (!response.candidates || response.candidates.length === 0) {
             // Opsional: Cek `promptFeedback` untuk reason pemblokiran
            return "Error: Respons Gemini kosong atau diblokir (Safety Filter).";
        }

        return extractText(response);
    } catch (error) {
        console.error("Gemini API error:", error);
        return "Error: Gagal memproses permintaan ke Gemini API.";
    }
}

export default genAI;