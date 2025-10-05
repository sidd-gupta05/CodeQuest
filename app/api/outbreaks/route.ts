// app/api/outbreaks/route.ts

// import { NextRequest, NextResponse } from "next/server";
// import * as cheerio from "cheerio";
// import { GoogleGenAI } from "@google/genai";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const pdf = require("pdf-parse");

// // Node.js runtime required for pdf-parse
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// // Google GenAI client
// const API_KEY = process.env.GOOGLE_GENAI_API_KEY || " ";
// const client = new GoogleGenAI({ apiKey: API_KEY });

// // ---------------------- Helper: Extract text from PDF ----------------------
// async function extractTextFromPdfBuffer(buffer: Buffer) {
//   const data = await pdf(buffer);
//   return data.text;
// }

// // ---------------------- 1️⃣ Scrape all PDF URLs ----------------------
// async function getAllPdfLinks() {
//   console.log("🌐 Fetching IDSP Weekly Outbreaks index page...");
//   const indexUrl = "https://idsp.mohfw.gov.in/index4.php?lang=1&level=0&linkid=406&lid=3689";
//   const res = await fetch(indexUrl);
//   if (!res.ok) throw new Error("Failed to fetch IDSP page");

//   const html = await res.text();
//   const $ = cheerio.load(html);
//   const pdfLinks: string[] = [];

//   $("a").each((_, el) => {
//     const href = $(el).attr("href");
//     if (href && href.includes("WriteReadData/l892s") && href.endsWith(".pdf")) {
//       const fullUrl = href.startsWith("http")
//         ? href
//         : `https://idsp.mohfw.gov.in/${href.replace(/^\/+/, "")}`;
//       pdfLinks.push(fullUrl);
//     }
//   });

//   console.log(`🔍 Found ${pdfLinks.length} outbreak PDFs.`);
//   return pdfLinks;
// }

// // ---------------------- 2️⃣ Calculate current week minus 10 ----------------------
// function getCurrentWeekMinus10() {
//   const now = new Date();
//   const start = new Date(now.getFullYear(), 0, 1);
//   const diff = now.getTime() - start.getTime();
//   const oneWeek = 1000 * 60 * 60 * 24 * 7;
//   const weekNumber = Math.ceil((diff + start.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
//   return weekNumber - 10; // 10-week buffer
// }

// // ---------------------- 3️⃣ Find PDF for current week/year ----------------------
// async function findPdfForWeek(pdfLinks: string[]) {
//   const currentYear = new Date().getFullYear();
//   const targetWeek = getCurrentWeekMinus10();

//   console.log(`Looking for week ${targetWeek} of ${currentYear}`);

//   function normalizePdfText(input: string) {
//     if (!input) return "";
//     // Remove zero-width and control characters, collapse whitespace
//     const cleaned = input
//       .replace(/[\u200B-\u200D\uFEFF]/g, "")
//       .replace(/[\u0000-\u001F\u007F]/g, " ")
//       .replace(/\s+/g, " ")
//       .toLowerCase();
//     return cleaned;
//   }

//   function buildWeekYearPatterns(week: number, year: number): RegExp[] {
//     const w = String(week);
//     const y = String(year);
//     const ord = "(?:st|nd|rd|th)?"; // ordinal may be missing after OCR
//     const wsp = "\\s*"; // flexible whitespace
//     return [
//       // "31st week 2025" (ordinal optional, flexible spaces)
//       new RegExp(`${w}${wsp}${ord}${wsp}week${wsp}${y}`, "i"),
//       // "week 31 2025"
//       new RegExp(`week${wsp}${w}${wsp}${y}`, "i"),
//       // "week no 31 2025" / "week no. 31 2025"
//       new RegExp(`week${wsp}no\.?${wsp}${w}${wsp}${y}`, "i"),
//       // "week number 31 2025"
//       new RegExp(`week${wsp}number${wsp}${w}${wsp}${y}`, "i"),
//       // Allow year first then week
//       new RegExp(`${y}${wsp}week${wsp}${w}${wsp}${ord}`, "i"),
//     ];
//   }

//   const patterns = buildWeekYearPatterns(targetWeek, currentYear);

//   for (let i = 0; i < pdfLinks.length; i += 50) {
//     const set = pdfLinks.slice(i, i + 50);
//     console.log(`🔹 Checking set ${i / 50 + 1} (${set.length} PDFs)`);

//     for (const url of set) {
//       try {
//         const res = await fetch(url);
//         if (!res.ok) continue;
//         const buffer = await res.arrayBuffer();
//         const data = await pdf(Buffer.from(buffer), { max: 1 }); // first page only
//         const text = normalizePdfText(data.text);

//         let matched = false;
//         for (const rx of patterns) {
//           if (rx.test(text)) {
//             console.log(`✅ Found PDF for target week using pattern: ${rx} -> ${url}`);
//             matched = true;
//             break;
//           }
//         }
//         if (matched) return url;
//       } catch (err: any) {
//         console.warn(`Failed to read PDF: ${url}`, err.message);
//       }
//     }
//   }

//   throw new Error(`404: No PDF found for week ${targetWeek} of ${currentYear}`);
// }

// // ---------------------- 4️⃣ Download full PDF text ----------------------
// async function parsePdfText(pdfUrl: string) {
//   console.log("📄 Downloading full PDF:", pdfUrl);
//   const res = await fetch(pdfUrl);
//   if (!res.ok) throw new Error("Failed to download PDF");

//   const buffer = Buffer.from(await res.arrayBuffer());
//   console.log("📝 Extracting text from PDF...");
//   const text = await extractTextFromPdfBuffer(buffer);
//   // console.log(`Parsed full PDF text length: ${text.length}`);
//   // console.log(`Preview (first 2000 chars):\n${text.slice(0, 2000)}`);
//   return text;
// }

// // ---------------------- 5️⃣ Analyze with Gemini AI ----------------------
// async function extractMaharashtraOutbreaks(text: string) {
//   console.log("🤖 Sending report text to Gemini AI...");

//   const prompt = `
// You are analyzing an official IDSP weekly outbreak report.
// Extract all outbreak entries as a JSON array with these fields:
// {
//   "State": string,
//   "District": string,
//   "Disease": number,
//   "Cases": number,
//   "Deaths": number,
//   "Week": string,
//   "Remarks": string
// }

// Filter only outbreaks from Maharashtra.
// no field should be missing, if any field is missing, predict it from the context.
// summarize the remarks field in 2-3 lines.
// Return only valid JSON.
// Text:
// ${text}
// `;

//   const response = await client.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   let output = response?.text?.trim() || "";
//   output = output.replace(/^```json/, "").replace(/```$/, "").trim();

//   console.log("Gemini raw output (first 500 chars):", output.slice(0, 500));

//   try {
//     const parsed = JSON.parse(output);
//     console.log(`✅ Parsed ${parsed.length} outbreak entries from Gemini`);
//     return parsed;
//   } catch (err) {
//     console.error("❌ Gemini output not valid JSON:", output);
//     throw err;
//   }
// }

// // ---------------------- 6️⃣ Generate AI-powered general lab suggestions ----------------------
// async function generateLabSuggestions(outbreaks: any[]) {
//   console.log("🤖 Generating general lab business suggestions via Gemini AI...");

//   const prompt = `
// You are a business consultant for diagnostic labs.
// You are given a list of outbreak entries in Maharashtra:
// ${JSON.stringify(outbreaks, null, 2)}

// Based on this data, provide **3-4 general actionable suggestions** for improving a lab business.
// Return only JSON in this format:
// {
//   "Suggestions": [
//     "string",
//     "string",
//     "string"
//   ]
// }
// Do not include district names or anything else. Focus on practical actions a lab can take.
// `;

//   const response = await client.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   let output = response?.text?.trim() || "";
//   output = output.replace(/^```json/, "").replace(/```$/, "").trim();

//   console.log("Gemini suggestions output (first 500 chars):", output.slice(0, 500));

//   try {
//     const parsed = JSON.parse(output);
//     return parsed;
//   } catch (err) {
//     console.error("❌ Gemini suggestions output not valid JSON:", output);
//     throw err;
//   }
// }

// // ---------------------- API Handler ----------------------
// export async function GET(req: NextRequest) {
//   try {
//     console.log("🚀 Starting outbreak data pipeline...");

//     const pdfLinks = await getAllPdfLinks();
//     const latestPdfUrl = await findPdfForWeek(pdfLinks);

//     const text = await parsePdfText(latestPdfUrl);
//     const outbreaks = await extractMaharashtraOutbreaks(text);

//     // Generate 3-4 general lab business suggestions
//     const suggestions = await generateLabSuggestions(outbreaks);

//     console.log("💡 Outbreak pipeline and AI suggestions completed");

//     return NextResponse.json({ outbreaks, suggestions });
//   } catch (err: any) {
//     console.error("❌ Error in outbreak pipeline:", err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }


//-------------------------------------------------------------------------------------//


// // app/api/outbreaks/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import * as cheerio from "cheerio";
// import { GoogleGenAI } from "@google/genai";
// import { createRequire } from "module";
// // import { PrismaClient } from "@prisma/client";
// import { createSupabaseServerClient } from '@/lib/supabase/server';

// const require = createRequire(import.meta.url);
// const pdf = require("pdf-parse");
// // const prisma = new PrismaClient();

// // Node.js runtime required for pdf-parse
// export const runtime = "nodejs";
// export const dynamic = "force-dynamic";

// // Google GenAI client
// const API_KEY = process.env.GOOGLE_GENAI_API_KEY || " ";
// const client = new GoogleGenAI({ apiKey: API_KEY });

// // ---------------------- Helper: Extract text from PDF ----------------------
// async function extractTextFromPdfBuffer(buffer: Buffer) {
//   const data = await pdf(buffer);
//   return data.text;
// }

// // ---------------------- Scrape PDF links ----------------------
// async function getAllPdfLinks() {
//   const indexUrl = "https://idsp.mohfw.gov.in/index4.php?lang=1&level=0&linkid=406&lid=3689";
//   const res = await fetch(indexUrl);
//   if (!res.ok) throw new Error("Failed to fetch IDSP page");

//   const html = await res.text();
//   const $ = cheerio.load(html);
//   const pdfLinks: string[] = [];

//   $("a").each((_, el) => {
//     const href = $(el).attr("href");
//     if (href && href.includes("WriteReadData/l892s") && href.endsWith(".pdf")) {
//       const fullUrl = href.startsWith("http") ? href : `https://idsp.mohfw.gov.in/${href.replace(/^\/+/, "")}`;
//       pdfLinks.push(fullUrl);
//     }
//   });

//   return pdfLinks;
// }

// // ---------------------- Calculate current week minus 10 ----------------------
// function getCurrentWeekMinus10() {
//   const now = new Date();
//   const start = new Date(now.getFullYear(), 0, 1);
//   const diff = now.getTime() - start.getTime();
//   const oneWeek = 1000 * 60 * 60 * 24 * 7;
//   const weekNumber = Math.ceil((diff + start.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
//   return weekNumber - 10;
// }

// // ---------------------- Find PDF for current week/year ----------------------
// async function findPdfForWeek(pdfLinks: string[]) {
//   const currentYear = new Date().getFullYear();
//   const targetWeek = getCurrentWeekMinus10();

//   function normalizePdfText(input: string) {
//     if (!input) return "";
//     return input.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").toLowerCase();
//   }

//   function buildWeekYearPatterns(week: number, year: number): RegExp[] {
//     const w = String(week);
//     const y = String(year);
//     const ord = "(?:st|nd|rd|th)?";
//     const wsp = "\\s*";
//     return [
//       new RegExp(`${w}${wsp}${ord}${wsp}week${wsp}${y}`, "i"),
//       new RegExp(`week${wsp}${w}${wsp}${y}`, "i"),
//       new RegExp(`week${wsp}no\\.?${wsp}${w}${wsp}${y}`, "i"),
//       new RegExp(`week${wsp}number${wsp}${w}${wsp}${y}`, "i"),
//       new RegExp(`${y}${wsp}week${wsp}${w}${wsp}${ord}`, "i"),
//     ];
//   }

//   const patterns = buildWeekYearPatterns(targetWeek, currentYear);

//   for (let i = 0; i < pdfLinks.length; i += 50) {
//     const set = pdfLinks.slice(i, i + 50);
//     for (const url of set) {
//       try {
//         const res = await fetch(url);
//         if (!res.ok) continue;
//         const buffer = await res.arrayBuffer();
//         const data = await pdf(Buffer.from(buffer), { max: 1 });
//         const text = normalizePdfText(data.text);

//         if (patterns.some(rx => rx.test(text))) return url;
//       } catch {
//         continue;
//       }
//     }
//   }

//   throw new Error("No PDF found for target week/year");
// }

// // ---------------------- Download full PDF text ----------------------
// async function parsePdfText(pdfUrl: string) {
//   const res = await fetch(pdfUrl);
//   if (!res.ok) throw new Error("Failed to download PDF");
//   const buffer = Buffer.from(await res.arrayBuffer());
//   return await extractTextFromPdfBuffer(buffer);
// }

// // ---------------------- Analyze with Gemini AI ----------------------
// async function extractMaharashtraOutbreaks(text: string) {
//   const prompt = `
// You are analyzing an official IDSP weekly outbreak report.
// Extract all outbreak entries as a JSON array with fields:
// { "State": string, "District": string, "Disease": number, "Cases": number, "Deaths": number, "Week": string, "Remarks": string }
// Filter only outbreaks from Maharashtra.
// No field should be missing; predict from context if missing.
// Summarize remarks in 2-3 lines. Return only valid JSON.
// Text:
// ${text}
// `;

//   const response = await client.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//   });

//   let output = response?.text?.trim() || "";
//   output = output.replace(/^```json/, "").replace(/```$/, "").trim();
//   return JSON.parse(output);
// }

// // ---------------------- API Handler ----------------------
// export async function POST(req: NextRequest) {
//   try {
//     const supabase = await createSupabaseServerClient();

//     const body = await req.json();
//     const { labId } = body;
//     if (!labId) return NextResponse.json({ error: "labId is required" }, { status: 400 });

//     const pdfLinks = await getAllPdfLinks();
//     const latestPdfUrl = await findPdfForWeek(pdfLinks);
//     const text = await parsePdfText(latestPdfUrl);
//     const outbreaks = await extractMaharashtraOutbreaks(text);

//     const currentWeek = getCurrentWeekMinus10();
//     const currentYear = new Date().getFullYear();

//     // ---------------------- Upsert into OutbreakReport ----------------------
//     const { data, error } = await supabase
//       .from("outbreak_reports")
//       .upsert(
//         {
//           labId,
//           pdfUrl: latestPdfUrl,
//           week: currentWeek,
//           year: currentYear,
//           rawOutput: JSON.stringify(outbreaks),
//           updatedAt: new Date().toISOString(),
//         },
//         { onConflict: "labId" } // <-- single string, not string[]
//       )
//       .select()
//       .maybeSingle(); // <-- use maybeSingle() instead of single() to avoid TS errors


//     if (error) throw error;

//     return NextResponse.json({ message: "Outbreak report saved", report: data });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }



// app/api/outbreaks/route.ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { GoogleGenAI } from "@google/genai";
import { createRequire } from "module";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Node.js runtime required for pdf-parse
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Google GenAI client
const API_KEY = process.env.GOOGLE_GENAI_API_KEY || " ";
const client = new GoogleGenAI({ apiKey: API_KEY });

// ---------------------- Helper: Extract text from PDF ----------------------
async function extractTextFromPdfBuffer(buffer: Buffer) {
  const data = await pdf(buffer);
  return data.text;
}

// ---------------------- Scrape PDF links ----------------------
async function getAllPdfLinks() {
  const indexUrl = "https://idsp.mohfw.gov.in/index4.php?lang=1&level=0&linkid=406&lid=3689";
  const res = await fetch(indexUrl);
  if (!res.ok) throw new Error("Failed to fetch IDSP page");

  const html = await res.text();
  const $ = cheerio.load(html);
  const pdfLinks: string[] = [];

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (href && href.includes("WriteReadData/l892s") && href.endsWith(".pdf")) {
      const fullUrl = href.startsWith("http") ? href : `https://idsp.mohfw.gov.in/${href.replace(/^\/+/, "")}`;
      pdfLinks.push(fullUrl);
    }
  });

  return pdfLinks;
}

// ---------------------- Calculate current week minus 10 ----------------------
function getCurrentWeekMinus10() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  const weekNumber = Math.ceil((diff + start.getDay() * 24 * 60 * 60 * 1000) / oneWeek);
  return weekNumber - 10;
}

// ---------------------- Find PDF for current week/year ----------------------
async function findPdfForWeek(pdfLinks: string[]) {
  const currentYear = new Date().getFullYear();
  const targetWeek = getCurrentWeekMinus10();

  function normalizePdfText(input: string) {
    if (!input) return "";
    return input.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/[\u0000-\u001F\u007F]/g, " ").replace(/\s+/g, " ").toLowerCase();
  }

  function buildWeekYearPatterns(week: number, year: number): RegExp[] {
    const w = String(week);
    const y = String(year);
    const ord = "(?:st|nd|rd|th)?";
    const wsp = "\\s*";
    return [
      new RegExp(`${w}${wsp}${ord}${wsp}week${wsp}${y}`, "i"),
      new RegExp(`week${wsp}${w}${wsp}${y}`, "i"),
      new RegExp(`week${wsp}no\\.?${wsp}${w}${wsp}${y}`, "i"),
      new RegExp(`week${wsp}number${wsp}${w}${wsp}${y}`, "i"),
      new RegExp(`${y}${wsp}week${wsp}${w}${wsp}${ord}`, "i"),
    ];
  }

  const patterns = buildWeekYearPatterns(targetWeek, currentYear);

  for (let i = 0; i < pdfLinks.length; i += 50) {
    const set = pdfLinks.slice(i, i + 50);
    for (const url of set) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const buffer = await res.arrayBuffer();
        const data = await pdf(Buffer.from(buffer), { max: 1 });
        const text = normalizePdfText(data.text);

        if (patterns.some(rx => rx.test(text))) return url;
      } catch {
        continue;
      }
    }
  }

  throw new Error("No PDF found for target week/year");
}

// ---------------------- Download full PDF text ----------------------
async function parsePdfText(pdfUrl: string) {
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error("Failed to download PDF");
  const buffer = Buffer.from(await res.arrayBuffer());
  return await extractTextFromPdfBuffer(buffer);
}

// ---------------------- Extract Maharashtra Outbreaks ----------------------
async function extractMaharashtraOutbreaks(text: string) {
  const prompt = `
You are analyzing an official IDSP weekly outbreak report.
Extract all outbreak entries as a JSON array with fields:
{ "State": string, "District": string, "Disease": number, "Cases": number, "Deaths": number, "Week": string, "Remarks": string }
Filter only outbreaks from Maharashtra.
No field should be missing; predict from context if missing.
Summarize remarks in 2-3 lines. Return only valid JSON.
Text:
${text}
`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let output = response?.text?.trim() || "";
  output = output.replace(/^```json/, "").replace(/```$/, "").trim();
  return JSON.parse(output);
}

// ---------------------- Generate AI-powered lab suggestions ----------------------
async function generateLabSuggestions(outbreaks: any[]) {
  const prompt = `
You are a business consultant for diagnostic labs.
You are given a list of outbreak entries in Maharashtra:
${JSON.stringify(outbreaks, null, 2)}

Based on this data, provide 3-4 general actionable suggestions for improving a lab business.
Return only JSON in this format:
{ "Suggestions": ["string","string","string"] }
Do not include district names or anything else. Focus on practical actions a lab can take.
`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let output = response?.text?.trim() || "";
  output = output.replace(/^```json/, "").replace(/```$/, "").trim();
  return JSON.parse(output);
}

// ---------------------- API Handler ----------------------
export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { labId } = await req.json();

    if (!labId) return NextResponse.json({ error: "labId is required" }, { status: 400 });

    // Fetch latest outbreak PDF and parse
    const pdfLinks = await getAllPdfLinks();
    const latestPdfUrl = await findPdfForWeek(pdfLinks);
    const text = await parsePdfText(latestPdfUrl);
    const outbreaks = await extractMaharashtraOutbreaks(text);

    // Generate suggestions
    const suggestions = await generateLabSuggestions(outbreaks);

    const currentWeek = getCurrentWeekMinus10();
    const currentYear = new Date().getFullYear();

    // ---------------------- Upsert into Supabase ----------------------
    const { data, error } = await supabase
      .from("outbreak_reports")
      .upsert(
        {
          labId,
          pdfUrl: latestPdfUrl,
          week: currentWeek,
          year: currentYear,
          rawOutput: JSON.stringify(outbreaks),
          suggestions: JSON.stringify(suggestions.Suggestions),
          updatedAt: new Date().toISOString(),
        },
        { onConflict: "labId" } // labId must be unique
      )
      .select()
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ message: "Outbreak report saved", report: data });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
