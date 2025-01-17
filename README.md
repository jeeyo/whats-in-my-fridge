# What's in my fridge?

A website that helps you keep track of what you have in your refrigerator and is it about to expire?
Your data will store locally in your browser, but you will be able to share it.

[Demo](https://whats-in-my-fridge.pages.dev/)

## Roadmap

- [ ] Web Notification to notify when an item is about to expire
- [x] Database sync across devices using Cloudflare R2 + KV
  - [x] Upload
  - [x] Download
- [ ] Error toast
- [ ] Loading indicator
- [ ] FileSystemWritableFileStream isn't supported on Safari

## Technical details

The database is an SQLite database stored in the browser's [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) powered by [WASM SQLite](https://github.com/sqlite/sqlite-wasm)

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

## Making it yours

Make sure to update `[[kv_namespaces]].id` and `[[r2_buckets]].bucket_name` in wrangler.toml to your Cloudflare KV namespace ID and Cloudflare R2 bucket name respectively.
