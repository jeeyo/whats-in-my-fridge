# What's in my fridge?

A website that helps you keep track of what you have in your refrigerator and is it about to expire?

[Demo](https://whats-in-my-fridge.pages.dev/)

## Roadmap

- [ ] Web Notification to notify when an item is about to expire
- [x] Database sync across devices using Cloudflare R2 + KV
  - [x] Upload
  - [x] Download
- [ ] Error toast

## Technical details

The database is an SQLite database stored in your browser's [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) powered by [WASM SQLite](https://github.com/sqlite/sqlite-wasm)

## Running on Local

```bash
# developing UI with hot-reload,
# you'll have no Cloudflare Pages Functions (/upload, /download)
$ npm run dev

# developing Cloudflare Pages Functions with UI,
# need assets in /dist directory
$ npm run build
$ npm wrangler pages dev
```
