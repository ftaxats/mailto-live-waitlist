import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

// Type for the expected request body
interface RequestBody {
  email: string;
  name: string;
}

// Validate environment variables
const validateEnvVariables = () => {
  if (!process.env.NOTION_SECRET) {
    throw new Error("NOTION_SECRET is not defined");
  }
  if (!process.env.NOTION_DB) {
    throw new Error("NOTION_DB is not defined");
  }
  return {
    notionSecret: process.env.NOTION_SECRET,
    notionDb: process.env.NOTION_DB,
  };
};

// Validate request body
const validateRequestBody = (body: any): body is RequestBody => {
  if (!body) return false;
  if (typeof body.email !== "string" || !body.email) return false;
  if (typeof body.name !== "string" || !body.name) return false;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.email)) return false;
  
  return true;
};

// Initialize Notion client
const getNotionClient = (secret: string) => {
  try {
    return new Client({ auth: secret });
  } catch (error) {
    console.error("Failed to initialize Notion client:", error);
    throw new Error("Failed to initialize Notion client");
  }
};

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate environment variables
    const { notionSecret, notionDb } = validateEnvVariables();

    // Validate request body
    if (!validateRequestBody(body)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request body. Please provide valid email and name." 
        },
        { status: 400 }
      );
    }

    // Initialize Notion client
    const notion = getNotionClient(notionSecret);

    // Create page in Notion
    const response = await notion.pages.create({
      parent: {
        database_id: notionDb,
      },
      properties: {
        Email: {
          type: "email",
          email: body.email,
        },
        Name: {
          type: "title",
          title: [
            {
              type: "text",
              text: {
                content: body.name,
              },
            },
          ],
        },
        "Created At": {
          type: "date",
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    // Verify response
    if (!response) {
      throw new Error("Failed to add entry to Notion");
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully added to Notion",
        id: response.id 
      }, 
      { status: 201 }
    );

  } catch (error) {
    // Log the error for debugging
    console.error("Notion API Error:", error);

    // Determine if it's a known error type
    if (error instanceof Error) {
      if (error.message.includes("NOTION_")) {
        return NextResponse.json(
          { success: false, error: "Configuration error" },
          { status: 500 }
        );
      }
      
      if (error.message.includes("Could not find")) {
        return NextResponse.json(
          { success: false, error: "Database not found or access denied" },
          { status: 404 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: "An unexpected error occurred" 
      },
      { status: 500 }
    );
  }
}