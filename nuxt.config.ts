// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-04",

  runtimeConfig: {
    gqlEndpoint: process.env.GQL_ENDPOINT,
  }
})