interface Env {
  SYNC_TOKEN: KVNamespace;
  SYNC_BUCKET: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const token = Array.isArray(context.params.token) ? context.params.token[0] : context.params.token

  const kv = await context.env.SYNC_TOKEN.get(token);
  if (kv !== null) {
    return new Response(null, {
      status: 404,
    })
  }

  const obj = await context.env.SYNC_BUCKET.get(token)
  if (!obj) {
    return new Response(null, {
      status: 502,
    })
  }

  const blob = await obj.blob()
  return new Response(blob)
}
