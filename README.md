# What's in my fridge?

A website that helps you keep track of what you have in your refrigerator and is it about to expire?

[Demo](https://whats-in-my-fridge.pages.dev/)

## Roadmap

- [ ] Web Notification to notify when an item is about to expire
- [ ] Database sync across devices using Cloudflare R2 + KV

## Technical details

The database is an SQLite database stored in your browser's [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) powered by [WASM SQLite](https://github.com/sqlite/sqlite-wasm)
