// route.ts — revisi multilingual & structured, tanpa WHO
import { askGemini } from "@/lib/gemini";

interface ChatRequest {
  message: string;
}

interface SimpleFinalResponse {
  ai_analysis: string;
}

// Simple in-memory cache (tidak untuk produksi)
const chatCache = new Map<string, string>();

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
  try {
    const { message } = (await req.json()) as ChatRequest;

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Cek cache sederhana
    const cached = chatCache.get(message);
    if (cached) {
      const cachedParsed = JSON.parse(cached) as { ai_analysis: string };
      const simpleResponse: SimpleFinalResponse = {
        ai_analysis: cachedParsed.ai_analysis,
      };

      return new Response(
        `data: ${JSON.stringify({ type: "final", data: simpleResponse })}\n\n`,
        { headers: { "Content-Type": "text/event-stream" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Kirim partial awal (indikasi analisis dimulai)
          controller.enqueue(
            `data: ${JSON.stringify({
              type: "partial",
              data: "🔍 Menganalisis pertanyaan kamu...",
            })}\n\n`
          );

          // Prompt multilingual & structured
          const prompt = `
You are a helpful virtual health assistant.
The user may describe symptoms in ANY language.

Your goals:
1. Detect the language of the user's message.
2. Respond entirely in the SAME language as the user's input.
3. Provide a detailed, structured explanation using markdown formatting with these sections:
   - 🧠 **Analisis Awal / Initial Analysis**
   - 💡 **Kemungkinan Penyebab / Possible Causes**
   - 🩺 **Rekomendasi Langkah Aksi (Bukan Saran Medis) / Recommended Next Steps (Not Medical Advice)**
4. Make the tone empathetic, calm, and medically informative.
5. Do NOT output ICD codes, technical identifiers, or exact diagnoses.
6. Keep it readable and concise but complete.

User message:
${message}
`.trim();

          const rawText = await askGemini(prompt);

          // Jika Gemini mengembalikan error string, forward sebagai error
          if (typeof rawText === "string" && rawText.startsWith("Error:")) {
            controller.enqueue(
              `data: ${JSON.stringify({
                type: "error",
                data: `Gemini error: ${rawText}`,
              })}\n\n`
            );
            controller.close();
            return;
          }

          // Kirim partial tambahan (efek dramatik dikit biar terasa “berpikir”)
          controller.enqueue(
            `data: ${JSON.stringify({
              type: "partial",
              data: "✅ Analisis selesai. Menyusun jawaban...",
            })}\n\n`
          );

          const finalObj: SimpleFinalResponse = {
            ai_analysis:
              typeof rawText === "string" ? rawText : String(rawText),
          };

          // Simpan ke cache full response minimal
          chatCache.set(message, JSON.stringify(finalObj));

          // Kirim final (SSE)
          controller.enqueue(
            `data: ${JSON.stringify({ type: "final", data: finalObj })}\n\n`
          );
        } catch (err) {
          console.error("Error in chat route:", err);
          controller.enqueue(
            `data: ${JSON.stringify({
              type: "error",
              data: "Terjadi kesalahan saat memproses permintaan.",
            })}\n\n`
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat route error (initial):", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
