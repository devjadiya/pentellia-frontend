import { NextResponse } from "next/server";
import { query } from "@/config/db";

export async function POST(req: Request) {
  try {
    const tools = await req.json(); // Array of tools

    if (!Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const values: any[] = [];
    const placeholders = tools.map((tool, index) => {
      const base = index * 8;
      values.push(
        tool.id,
        tool.name,
        tool.slug,
        tool.description,
        tool.long_description,
        tool.category,
        tool.version,
        JSON.stringify(tool.params)
      );
      return `($${base + 1},$${base + 2},$${base + 3},$${base + 4},$${
        base + 5
      },$${base + 6},$${base + 7},$${base + 8})`;
    });

    const text = `
      INSERT INTO tools 
      (id, name, slug, description, long_description, category, version, params)
      VALUES ${placeholders.join(",")}
      RETURNING id
    `;

    const res = await query(text, values);

    return NextResponse.json({
      success: true,
      inserted: res.rowCount,
    });
  } catch (error) {
    console.error("Bulk Insert Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
