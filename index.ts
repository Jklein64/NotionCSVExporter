import { Client } from "@notionhq/client"
import { Block, PropertyValue } from "@notionhq/client/build/src/api-types"
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

    const serialized = new Map<string, any[]>()

    const pages = response.results
    for (const page of pages) {
        const blocks = await getAllChildren(page.id)

        serialized.has("Comments")
            ? serialized.get("Comments").push(blocks)
            : serialized.set("Comments", [blocks])
        for (const [property, value] of Object.entries(page.properties)) {
            serialized.has(property)
                ? serialized.get(property).push(serializeProperty(value))
                : serialized.set(property, [serializeProperty(value)])
        }
    }
    console.log(Object.fromEntries(serialized.entries()))

})()

async function getAllChildren(pageId: string) {
    const blocks = await notion.blocks.children.list({
        block_id: pageId // a page is a block, and a page's children is the first layer of its content
    })

    // TODO do I need something recursive here?
    return blocks.results
}

function serializeBlock(block: Block): string | number | boolean {
    switch (block.type) {
        case "bulleted_list_item":
            return block.bulleted_list_item.text.map(t => t.plain_text).join("")
                + "\n"
                + block.bulleted_list_item.children.map(c => `  ${serializeBlock(c)}`)
        case
    }
}

function serializeProperty(property: PropertyValue): string | number | boolean {
    switch (property.type) {
        case "checkbox":
            return property.checkbox
        case "created_by":
            return property.created_by.name
        case "created_time":
            return property.created_time
        case "date":
            // TODO figure out this case
            return property.date.start
        case "email":
            return property.email
        case "files":
            return property.files.join(", ")
        case "formula":
            switch (property.formula.type) {
                case "boolean":
                    return property.formula.boolean
                case "date":
                    // TODO figure out this case
                    return property.formula.date.date.start
                case "number":
                    return property.formula.number
                case "string":
                    return property.formula.string
            }
        case "last_edited_by":
            return property.last_edited_by.name
        case "last_edited_time":
            return property.last_edited_time
        case "multi_select":
            return property.multi_select.map(selectOption => selectOption.name).join(", ")
        case "number":
            return property.number
        case "people":
            return property.people.map(p => p.name).join(", ")
        case "phone_number":
            return property.phone_number
        case "rich_text":
            return property.rich_text.map(richText => richText.plain_text).join("")
        case "rollup":
            switch (property.rollup.type) {
                case "array":
                    return property.rollup.array.map(p => serializeProperty(p as any)).join(", ")
                case "date":
                    // TODO figure out this case
                    return property.rollup.date.date.start
                case "number":
                    return property.rollup.number
            }
        case "select":
            return property.select.name
        case "title":
            return property.title.map(richText => richText.plain_text).join(", ")
        case "url":
            return property.url
    }
}