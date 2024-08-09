/// <reference types="astro/client" />

declare module 'virtual:astro/use-store' {
  import type { StoreValue } from "nanostores";

  function useStore<T extends Store, SV extends StoreValue<T>>(store: T): SV;
  export { useStore }
}

declare module 'virtual:astro/als' {
  import type { AsyncLocalStorage } from "async_hooks";

  const authAsyncStorage: AsyncLocalStorage<{ userId: string; username: string }>
  export { authAsyncStorage }
}
