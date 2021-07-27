# Notion Exporter

I love using [Notion](https://www.notion.so/) with all of my heart, but sometimes I find the way that their export system works mildly irritating. A Notion workspace is a collection of markdown-like "pages" made of "blocks" and SQL-like "databases" (which store pages, which can have embedded databases, etc). The default way to export a Notion database is by downloading the properties of all of the pages in the database as a .csv file, and then _separately_ downloading all of the pages as individual markdown files that share a filename with the "Name" column in the .csv file. But what if you want everything in one file?

That's what this does. It first exports the database as .csv, then goes through each of the names and requests the markdown files for each one, adding it to a column called "Comments" (go pull the code and change it if you want).

## Usage

1. Clone the repository or open in GitHub's integration with VSCode
1. Open a terminal, `cd` into the directory, and run `npm install`
1. Create a new file `.env` which matches the general schema of `.env.example`. More information on where to find the keys and whatnot can be found on the [Notion API website](https://developers.notion.com/docs) and the [notion-exporter repository](https://github.com/yannbolliger/notion-exporter).
1. Run `npm start` in a terminal and wait (it generally takes a decent bit since there are a lot of network requests; one big one for the list of all of the pages in the database and then one _for each page_ in the database, which I don't think is avoidable).
1. The final .csv file `out.csv` should be created in the current directory.
