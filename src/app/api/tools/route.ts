import { NextResponse } from "next/server";
import { query } from "@/config/db";

export async function GET() {
  try {
    // 1. Fetch all tools
    // The 'params' column is JSONB, so it returns as a usable array object automatically in node-postgres
    const text = `
      SELECT id, name, slug, description, long_description, category, version, params 
      FROM tools 
      ORDER BY category, name ASC
    `;

    const res = await query(text);

    return NextResponse.json({
      success: true,
      tools: res.rows,
    });
  } catch (error) {
    console.error("Fetch Tools Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      slug,
      description,
      long_description,
      category,
      version,
      params,
    } = body;

    const text = `
      INSERT INTO tools 
      (id, name, slug, description, long_description, category, version, params)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `;

    const values = [
      id,
      name,
      slug,
      description,
      long_description,
      category,
      version,
      JSON.stringify(params),
    ];

    const res = await query(text, values);

    return NextResponse.json({
      success: true,
      tool: res.rows[0],
    });
  } catch (error) {
    console.error("Create Tool Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
