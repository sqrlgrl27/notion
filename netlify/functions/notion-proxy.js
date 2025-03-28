const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  try {
    // 1. Initialize Notion client
    const notion = new Client({ 
      auth: process.env.NOTION_API_KEY 
    });

    // 2. Get today's date (MMMM DD, YYYY)
    const today = new Date().toISOString().split('T')[0];

    // 3. Query Notion for today's entry
    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: {
        property: "Date", 
        date: { equals: today }
      }
    });

    // 4. Extract dropdown value (single-select)
    const staffName = response.results[0]?.properties?.Staff?.select?.name 
      || "No staff scheduled today";

    // 5. Return success
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow frontend calls
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        name: staffName,
        debug: { // For testing (optional)
          today: today,
          totalResults: response.results.length
        }
      })
    };

  } catch (error) {
    // 6. Detailed error response
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: "Failed to fetch staff data",
        details: error.message,
        suggestion: "Check if: 1) Database is shared with integration, 2) Date column exists, 3) Staff is a single-select property"
      })
    };
  }
};
