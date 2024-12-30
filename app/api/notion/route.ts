import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Add your logic for processing the data (e.g., saving to the database).
    return NextResponse.json(
      { success: true, message: "Request processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/notion:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
