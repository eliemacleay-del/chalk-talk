import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function extractTextFromFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PDFParse } = require("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  // For text-based files, just read as text
  return buffer.toString("utf-8");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const notes = (formData.get("notes") as string) || "";
  const file = formData.get("file") as File | null;

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

  const prompt = `You are a quiz generator for athletes studying their playbook.

Given the following notes, generate exactly 5 multiple-choice questions to test the reader's understanding.

Return ONLY valid JSON in this exact format, no other text:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0
  }
]

The "answer" field is the zero-based index of the correct option.
Make questions specific to the content provided. Vary difficulty.

NOTES:
${content}`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to generate quiz. Try again." },
        { status: 500 }
      );
    }

    const questions = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ questions });
  } catch (e) {
    console.error("Groq error:", e);
    return NextResponse.json(
      { error: "Failed to generate quiz. Try again." },
      { status: 500 }
    );
  }
}
