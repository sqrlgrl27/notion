const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  try {
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const today = new Date().toISOString().split('T')[0]; // Format: "2023-12-25"

    const response = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: {
        property: "Date", // Change this to your date column name
        date: { equals: today }
      }
    });

    const staffName = response.results[0]?.properties?.Staff?.select?.name || "There seems to be no staff scheduled for today.";
    
    return {
      statusCode: 200,
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ name: staffName })
    };

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};
