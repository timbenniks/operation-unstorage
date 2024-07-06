export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: "2024-07-04",
  future: {
    compatibilityVersion: 4,
  },
  runtimeConfig: {
    gqlEndpoint: process.env.GQL_ENDPOINT,
  }
})