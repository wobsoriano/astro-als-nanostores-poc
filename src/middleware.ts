import type { MiddlewareHandler } from "astro";
import { authAsyncStorage } from 'virtual:astro/als';

export const onRequest: MiddlewareHandler = (_context, next) => {
  const auth = {
    userId: 'user_abcd1234',
    username: 'tonystank'
  }

  return authAsyncStorage.run(auth, async () => {
    const res = await next();
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    });
  })
}
