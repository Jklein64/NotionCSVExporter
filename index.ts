import { Client } from "@notionhq/client"
import NotionExporter from "notion-exporter"
import dotenv from "dotenv"
import parse from "csv-parse"
import stringify from "csv-stringify"
import fs from "fs"


// set up .env variables
dotenv.config()

const notion = new Client({ auth: process.env.NOTION_KEY })
const DATABASE_ID = process.env.NOTION_DATABASE_ID

void (async function () {
    const notionExporter = new NotionExporter(process.env.NOTION_TOKEN)

    // get results of exporting as .csv
    const csvString = await notionExporter.getCsvString(DATABASE_ID)
    const csvArray = await parseCSV(csvString) as string[][]

    // get a list of all the pages in the same sorted order (I hope) as the .csv
    const { results: pages } = await notion.databases.query({
        database_id: DATABASE_ID,
        sorts: [{
            property: "Created",
            direction: "descending"
        }]
    })

    // add each page's markdown to the csv array under the header "Comments"
    csvArray[0].push("Comments")
    for (const page of pages) {
        const markdown = await notionExporter.getMdString(page.id)
        const name = markdown.substring(2).substring(0, markdown.indexOf("\n")).trim()
        const row = csvArray.find(row => row[0] === name)
        row.push(markdown.substring(markdown.indexOf("---") + 3 + 2))
    }

    csvArray.forEach(row => {
        // didn't push to it yet
        if (row.length < csvArray[0].length - 1)
            row.push("")
    })

    fs.writeFile("./out.csv", await stringifyCSV(csvArray), {}, () => {
        console.log("saved to out.csv!")
    })
})()

async function parseCSV(data: string) {
    return new Promise((resolve, reject) => {
        parse(data, {}, (error, output) => {
            if (error) reject(error.message)
            else resolve(output)
        })
    })
}

async function stringifyCSV(data: string[][]): Promise<string> {
    return new Promise((resolve, reject) => {
        stringify(data, (error, output) => {
            if (error) reject(error.message)
            else resolve(output)
        })
    })
}
