const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  // === NEW VALIDATION CHECKS ===
  if (!process.env.DATABASE_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server misconfigured - DATABASE_ID missing",
        solution: "Set DATABASE_ID in Netlify environment variables"
      })
    };
  }

  if (!process.env.NOTION_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server misconfigured - NOTION_API_KEY missing",
        solution: "Set NOTION_API_KEY in Netlify environment variables"
      })
    };
  }
  // === END VALIDATION ===

  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const today = new Date().toISOString().split('T')[0];

    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID, // Now using env var
      filter: {
        property: "Goal Date",
        date: { equals: today }
      }
    });

    const staffName = response.results[0]?.properties?.Staff?.select?.name 
      || "QT Pie";

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ name: staffName })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Notion API error",
        details: error.message,
        debug: {
          databaseId: process.env.DATABASE_ID ? "✅ Set" : "❌ Missing",
          apiKey: process.env.NOTION_API_KEY ? "✅ Set" : "❌ Missing"
        }
      })
    };
  }
};
