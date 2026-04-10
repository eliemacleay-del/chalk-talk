import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { getFootballPrompt } from "@/lib/football-prompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const result = await pdfParse(buffer);
    return result.text;
  }

  return buffer.toString("utf-8");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const notes = (formData.get("notes") as string) || "";
  const file = formData.get("file") as File | null;
  const difficulty = (formData.get("difficulty") as string) || "medium";

  let content = notes;

  if (file && file.size > 0) {
    try {
      const fileText = await extractTextFromFile(file);
      content = content ? `${content}\n\n${fileText}` : fileText;
    } catch (e) {
      console.error("File extraction error:", e);
      return NextResponse.json(
        { error: "Could not read that file. Try pasting the text instead." },
        { status: 400 }
      );
    }
  }

  if (!content || content.trim().length < 10) {
    return NextResponse.json(
      { error: "Please provide at least a few sentences of notes." },
      { status: 400 }
    );
  }

  const systemPrompt = getFootballPrompt(
    difficulty as "easy" | "medium" | "hard"
  );

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `NOTES:\n${content}` },
      ],
      temperature: 0.5,
      top_p: 0.9,
    });

    const text = completion.choices[0]?.message?.content || "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to generate quiz. Try again." },
        { status: 500 }
      );
    }

    const questions = JSON.parse(jsonMatch[0]).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (q: any) => {
        // Sanitize diagram data
        if (q.diagram && (!q.diagram.players || !Array.isArray(q.diagram.players) || q.diagram.players.length === 0)) {
          q.diagram = null;
        }
        if (q.diagram) {
          // Clamp all coordinates to 0-100
          q.diagram.players = q.diagram.players.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (p: any) => ({
              ...p,
              x: Math.max(0, Math.min(100, p.x ?? 50)),
              y: Math.max(0, Math.min(100, p.y ?? 50)),
            })
          );
        }
        return q;
      }
    );
    return NextResponse.json({ questions });
  } catch (e) {
    console.error("Groq error:", e);
    return NextResponse.json(
      { error: "Failed to generate quiz. Try again." },
      { status: 500 }
    );
  }
}
