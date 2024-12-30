import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200 });
  }

  try {
    const body = await request.json();
    
    if (!body.email || !body.name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!process.env.NOTION_SECRET || !process.env.NOTION_DB) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const notion = new Client({ auth: process.env.NOTION_SECRET });

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DB,
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
        "Signup Date": {
          type: "date",
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, message: 'Successfully added to waitlist' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Notion API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}