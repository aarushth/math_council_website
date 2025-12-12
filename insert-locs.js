import sqlite3 from 'better-sqlite3'
import fs from 'fs'

const db = sqlite3('dev.db')

// Create FTS5 table if it doesn't exist
db.exec(`
  CREATE VIRTUAL TABLE IF NOT EXISTS locations USING fts5(address);
`)

// Load your JSON array
const locations = JSON.parse(fs.readFileSync('locations.json', 'utf-8'))

// Prepare insert statement
const insert = db.prepare('INSERT INTO locations (address) VALUES (?)')

// Wrap in a transaction for speed
const insertMany = db.transaction((items) => {
    for (const addr of items) insert.run(addr)
})

insertMany(locations)

console.log(`Inserted ${locations.length} locations into the FTS5 table.`)
