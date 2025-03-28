const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
    try {
        const { database_id, name_property } = JSON.parse(event.body);
        const notion = new Client({ auth: process.env.NOTION_API_KEY });

        const response = await notion.databases.query({
            database_id: database_id,
            page_size: 1,
            sorts: [{
                timestamp: 'created_time',
                direction: 'descending'
            }]
        });

        const name = response.results[0]?.properties[name_property]?.title[0]?.plain_text || null;

        return {
            statusCode: 200,
            body: JSON.stringify({ name })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
