import { Client } from "@notionhq/client"
import dotenv from "dotenv"

// set up .env variables
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const DATABASE_ID = process.env.NOTION_DATABASE_ID

void (async function () {
    const response = await notion.databases.query({
        database_id: DATABASE_ID,
        sorts: [{
            property: "Created",
            direction: "descending"
        }]
    })

    const pages = response.results

    const first = pages[0]

    console.log(first)
})()
