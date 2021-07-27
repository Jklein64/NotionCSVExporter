import { RichText } from "@notionhq/client/build/src/api-types"

type Property =
    | TitleProperty
    | RichTextObjectProperty
    | NumberProperty
    | SelectProperty
    | MultiSelectProperty
    | DateProperty
    | FormulaProperty
    | RelationProperty
    | RollupProperty
    | PeopleProperty
    | FilesProperty
    | CheckboxProperty
    | UrlProperty
    | EmailProperty
    | PhoneNumberProperty
    | CreatedTimeProperty
    | CreatedByProperty
    | LastEditedTimeProperty
    | LastEditedByProperty

export default Property

type Color =
    | "default"
    | "gray"
    | "brown"
    | "red"
    | "orange"
    | "yellow"
    | "green"
    | "blue"
    | "purple"
    | "pink"

interface TitleProperty {
    type: "title"
    title: Array<RichText>
}

interface RichTextObjectProperty {
    type: "rich_text"
    rich_text: Array<RichText>
}

interface NumberProperty {
    type: "number"
    number: number
}

interface SelectProperty {
    type: "select"
    select: {
        id: string
        name: string
        color: Color
    }
}

interface MultiSelectProperty {
    type: "multi_select"
    multi_select: Array<{
        id: string
        name: string
        color: Color
    }>
}

interface DateProperty {
    type: "date"
    date: {
        start: string
        end?: string
    }
}

interface FormulaProperty {
    type: "formula"
    formula: {
        type: "string"
        string: string
    } | {
        type: "boolean",
        boolean: boolean
    } | DateProperty | NumberProperty
}

interface RelationProperty {
    type: "relation"
    relation: Array<{
        id: string
    }>
}

interface RollupProperty {
    type: "rollup"
    // TODO rollup is an Array<number|date|array>
    rollup: NumberProperty | DateProperty | {
        type: "array"
        array: Array<Property>
    }
}

interface PeopleProperty {
    type: "people"
    // TODO people is an Array<User>
    people: Array<any>
}

interface FilesProperty {
    type: "files"
    files: Array<{
        name: string
    }>
}

interface CheckboxProperty {
    type: "checkbox"
    checkbox: boolean
}

interface UrlProperty {
    type: "url"
    url: string
}

interface EmailProperty {
    type: "email"
    email: string
}

interface PhoneNumberProperty {
    type: "phone_number"
    phone_number: string
}

interface CreatedTimeProperty {
    type: "created_time"
    created_time: string
}

interface CreatedByProperty {
    type: "created_by"
    created_by: any // TODO this is a User
}

interface LastEditedTimeProperty {
    type: "last_edited_time"
    last_edited_time: string
}

interface LastEditedByProperty {
    type: "last_edited_by"
    last_edited_by: any // TODO this is a User
}