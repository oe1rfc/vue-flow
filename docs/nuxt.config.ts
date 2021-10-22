import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
  meta: {
    title: 'Vue Flow',
    description: 'Vue Flow Documentation',
  },
  target: 'client',
  ssr: false,
  buildModules: ['nuxt-windicss'],
})