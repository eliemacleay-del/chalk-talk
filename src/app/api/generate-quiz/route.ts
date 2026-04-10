import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { getFootballPrompt } from "@/lib/football-prompt";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const notes = (formData.get("notes") as string) || "";
  const difficulty = (formData.get("difficulty") as string) || "medium";

  if (!notes || notes.trim().length < 10) {
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
        { role: "user", content: `NOTES:\n${notes}` },
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
        if (q.diagram && (!q.diagram.players || !Array.isArray(q.diagram.players) || q.diagram.players.length === 0)) {
          q.diagram = null;
        }
        if (q.diagram) {
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
