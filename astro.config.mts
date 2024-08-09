import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import node from "@astrojs/node";
import type { ViteUserConfig } from 'astro/config';

type ExtractPluginOption<T> = T extends (infer U)[] ? U : never;

function viteAlsPlugin(): ExtractPluginOption<NonNullable<ViteUserConfig['plugins']>> {
  const alsModuleId = 'virtual:astro/als';
  const useStoreModuleId = 'virtual:astro/use-store';
  const resolvedUseStoreModuleId = '\0' + useStoreModuleId;
  const resolvedAlsModuleId = '\0' + alsModuleId;

  return {
    name: 'vite-als-plugin',
    resolveId(id) {
      if (id === useStoreModuleId) {
        return resolvedUseStoreModuleId;
      }

      if (id === alsModuleId) {
        return resolvedAlsModuleId;
      }
    },
    load(id, opts) {
      if (id === resolvedAlsModuleId) {
        if (opts?.ssr) {
          return `
            import { AsyncLocalStorage } from "node:async_hooks";

            export const authAsyncStorage = new AsyncLocalStorage();
          `
        }
      }

      if (id === resolvedUseStoreModuleId) {
        if (opts?.ssr) {
          return `
            import { useSyncExternalStore } from 'react';
            import { authAsyncStorage } from 'virtual:astro/als';

            export function useStore(store) {
              const get = store.get.bind(store);

              return useSyncExternalStore(store.listen, get, () => {
                return authAsyncStorage.getStore();
              });
            }
          `
        }

        return `
          import { useSyncExternalStore } from 'react';

          export function useStore(store) {
            const get = store.get.bind(store);

            return useSyncExternalStore(store.listen, get, () => get());
          }
        `
      }
    }
  }
}

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: "server",
  vite: {
    plugins: [viteAlsPlugin()]
  },
  adapter: node({
    mode: "standalone"
  })
});
