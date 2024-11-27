import { DateTime } from 'luxon'

interface Env {
  SYNC_TOKEN: KVNamespace;
  SYNC_BUCKET: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const token = Math.random().toString(16).slice(2).substring(0, 5)

  // TODO: auto retry
  const kv = await context.env.SYNC_TOKEN.get(token);
  if (kv !== null) {
    return new Response(null, {
      status: 502,
    })
  }

  const obj = await context.env.SYNC_BUCKET.put(token, context.request.body)
  if (!obj) {
    return new Response(null, {
      status: 502,
    })
  }

  // memorize date created in KV
  await context.env.SYNC_TOKEN.put(token, `${DateTime.now().toSeconds()}`);

  return new Response(
    JSON.stringify({ token }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}
