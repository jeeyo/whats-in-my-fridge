import { sqlite3Worker1Promiser } from '@sqlite.org/sqlite-wasm';
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'

import type Item from '@/types/item'

const DB_FILENAME = 'whats-in-my-fridge.sqlite3'

export const getDatabaseFileHandle = async () => {
  const rootDirectory = await navigator.storage.getDirectory()
  const fileHandle = await rootDirectory.getFileHandle(DB_FILENAME, { create: true })
  return fileHandle
}

const sqlite3 = new Promise((resolve) => {
  const _promiser = sqlite3Worker1Promiser({
    onready: () => resolve(_promiser),
  })
})

export const fetchItems = async (setItems: (items: Item[]) => void) => {
  const items: Item[] = []
  const sql = await sqlite3

  // open database
  const { dbId } = (sql as any)('open', {
    filename: `file:${DB_FILENAME}?vfs=opfs`,
  })

  // create table if not exists
  await (sql as any)('exec', {
    dbId,
    sql: `CREATE TABLE IF NOT EXISTS items(
      id TEXT PRIMARY KEY,
      title TEXT,
      category TEXT,
      expiry_date INTEGER
    )`
  })

  // fetch all items
  await (sql as any)('exec', {
    dbId,
    sql: 'SELECT * FROM items ORDER BY expiry_date ASC',
    callback: (result: any) => {
      if (!result.row) return
      items.push({ id: result.row[0], title: result.row[1], category: result.row[2], expiry_date: result.row[3] })
    },
  })

  setItems(items);

  // close database
  await (sql as any)('close', { dbId })
}

export const insertItem = async ({ text, category, days }: { text: string; category: string; days: number }) => {
  const sql = await sqlite3

  // open database
  const { dbId } = (sql as any)('open', {
    filename: `file:${DB_FILENAME}?vfs=opfs`,
  })

  // insert an item
  await (sql as any)('exec', {
    dbId,
    sql: 'INSERT INTO items(id, title, category, expiry_date) VALUES (?, ?, ?, ?)',
    bind: [uuidv4(), text, category, DateTime.now().plus({ 'days': days }).toSeconds()],
  })

  // close database
  await (sql as any)('close', { dbId })
}

export const deleteItem = async ({ id }: { id: string }) => {
  const sql = await sqlite3

  // open database
  const { dbId } = (sql as any)('open', {
    filename: `file:${DB_FILENAME}?vfs=opfs`,
  })

  // delete the item
  await (sql as any)('exec', {
    dbId,
    sql: 'DELETE FROM items WHERE id = ?',
    bind: [id],
  })

  // close database
  await (sql as any)('close', { dbId })
}

export const purgeDatabase = async () => {
  const dir = await navigator.storage.getDirectory()
  await dir.removeEntry(DB_FILENAME)
}
