// who.ts

/* eslint-disable no-console */

// 🛑 PERBAIKAN: Impor askGemini dari file gemini.ts Anda
// Sesuaikan path import ini jika perlu (misalnya: "@/lib/gemini")
import { askGemini } from "./gemini";

/**
 * Interface untuk hasil akhir ICD-11.
 */
export interface ICDResult {
  code?: string;
  title?: string;
  definition?: string;
}

// ... (Bagian tokenCache, whoFetch, dan getWhoAccessToken tetap sama) ...
const tokenCache: {
  token: string | null;
  expiryTime: number; // Unix timestamp
} = { token: null, expiryTime: 0 };

// --- Fungsi Pembantu untuk Fetching ---
async function whoFetch(
  url: string,
  token: string | null,
  requireAuth: boolean = true
): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "API-Version": "v2",
    "Accept-Language": "en",
  };

  if (requireAuth && token) {
    headers.Authorization = `Bearer ${token}`;
  } else if (requireAuth && !token) {
    throw new Error("Authorization required but token is missing.");
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    const errorText = await response.clone().text();
    console.warn(
      `[WHO FETCH ERROR] Status: ${response.status}, URL: ${url}, Response: ${errorText}`
    );
    throw new Error(`WHO API request failed (${response.status})`);
  }

  return response;
}
// --- Akhir Fungsi Pembantu ---

/**
 * Ambil access token WHO ICD API. (Token caching diterapkan di sini)
 */
export async function getWhoAccessToken(): Promise<string> {
  // Cek cache
  if (tokenCache.token && Date.now() < tokenCache.expiryTime) {
    return tokenCache.token;
  }

  const clientId = process.env.WHO_API_CLIENT_ID ?? "";
  const clientSecret = process.env.WHO_API_CLIENT_SECRET ?? "";
  if (!clientId || !clientSecret) {
    throw new Error("Missing WHO API credentials (client_id / client_secret)");
  }

  const response = await fetch(
    "https://icdaccessmanagement.who.int/connect/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "icdapi_access",
      }),
    }
  );

  if (!response.ok) {
    console.error("WHO Auth response:", await response.text());
    throw new Error(`WHO Auth failed (${response.status})`);
  }

  const data = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  const token = data.access_token;
  const expiresIn = data.expires_in;

  if (!token || !expiresIn)
    throw new Error("WHO API did not return an access_token or expires_in");

  tokenCache.token = token;
  tokenCache.expiryTime = Date.now() + expiresIn * 1000 - 60000;

  return token;
}

// ------------------------------------
// ✅ FUNGSI GEMINI UNTUK DEFINISI (IMPLEMENTASI NYATA) 🛑
// ------------------------------------

/**
 * Ambil definisi medis yang ringkas dan akurat dari Gemini API berdasarkan judul ICD.
 * Menggunakan fungsi askGemini yang sudah ada.
 */
async function getDefinitionFromGemini(title: string): Promise<string> {
  // Prompt yang spesifik untuk mendapatkan definisi medis yang faktual
  const prompt = `Anda adalah ahli medis yang memberikan definisi berdasarkan standar ICD-11. Berikan definisi medis yang ringkas, jelas, dan akurat (termasuk penyebab umum atau deskripsi klinis) untuk kondisi: "${title}". Jawab HANYA dengan teks definisi, JANGAN berikan awalan atau judul seperti "Definisi medis:".`;

  try {
    console.log(`[GEMINI API] Requesting definition for: ${title}`); // 🛑 PANGGILAN NYATA KE FUNGSI askGemini DARI gemini.ts

    const definitionText = await askGemini(prompt, "gemini-2.5-flash");

    if (definitionText.includes("Error:") || definitionText.includes("Gagal")) {
      // Mencegah pesan error Gemini masuk sebagai definisi
      throw new Error(`Gemini Error: ${definitionText}`);
    }

    return definitionText;
  } catch (e) {
    console.error(
      `[GEMINI API FAIL] Gagal mendapatkan definisi untuk ${title}:`,
      e
    );
    return `Definisi medis untuk "${title}" tidak dapat dimuat karena kesalahan pada API.`;
  }
}

// ------------------------------------
// 🛑 FUNGSI SEARCHICD11 (Menggunakan getDefinitionFromGemini yang sudah di-fix) 🛑
// ------------------------------------

/**
 * Cari kode ICD-11, dapatkan judul dari WHO, dan definisinya dari Gemini.
 */
export async function searchICD11(
  query: string,
  token: string
): Promise<ICDResult | null> {
  // Langkah 1: Search WHO untuk ID dan Judul (Panggilan ini terbukti BERHASIL)
  const searchUrl = `https://id.who.int/icd/release/11/2024-01/mms/search?q=${encodeURIComponent(
    query
  )}`;

  try {
    const searchResponse = await whoFetch(searchUrl, token); // Default: requireAuth=true
    const rawJson: unknown = await searchResponse.json();

    const entities = (
      rawJson as {
        destinationEntities?: Array<{
          theCode?: string; // Kode ICD (misal: MD12)
          title?: string; // Judul (mengandung tag <em>)
        }>;
      }
    ).destinationEntities;

    if (!entities || entities.length === 0) {
      console.warn(`[WHO PARSE] No entities found for query: ${query}`);
      return null;
    }

    const first = entities[0];

    let titleFromSearch = first.title ?? "Unknown Condition"; // Hapus tag <em> dari judul untuk mendapatkan judul bersih
    titleFromSearch = titleFromSearch
      .replace(/<em class='found'>/g, "")
      .replace(/<\/em>/g, ""); // Langkah 2: Ambil Definisi menggunakan Gemini API

    const definitionFromGemini = await getDefinitionFromGemini(titleFromSearch);

    return {
      code: first.theCode,
      title: titleFromSearch,
      definition: definitionFromGemini,
    };
  } catch (e) {
    // Error saat search fetch
    console.error(`[WHO SEARCH FAIL] Search failed for query: ${query}`, e);
    return null;
  }
}
