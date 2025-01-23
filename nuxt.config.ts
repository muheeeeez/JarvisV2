import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/ionic", "@vueuse/nuxt"],
  ssr: false,
  nitro: {
    output: {
      publicDir: ".output/public", // Set the public output directory
    },
  },
  css: ["~/assets/css/ionic-overrides.css"],
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: "node",
        types: ["@types/three"],
      },
    },
  },
  ionic: {
    integrations: {
      meta: true,
      router: true,
      icons: true,
    },
    css: {
      core: true,
      basic: true,
      utilities: false,
    },
    config: {
      mode: "md",
    },
  },
  build: {
    transpile: ["three"],
  },
  vite: {
    optimizeDeps: {
      include: ["three"],
    },
  },
});
