import { parseISO } from 'date-fns';

export default {
  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'nuxt-buefy-loader-example',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/styles/main.scss'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    [
      '~/modules/buefy-loader',
      {
        defaultDateParser: (date) => parseISO(date),
      },
    ],
    'nuxt-purgecss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [],

  styleResources: {
    scss: ['~assets/styles/variables.scss'],
  },

  /**
   * Purge CSS configuration
   */
  purgeCSS: {
    mode: 'webpack',
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extractCSS: process.env.NODE_ENV === 'production',
    extend(config, { isDev, isClient }) {
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map';
        config.resolve.symlinks = false;
      }
    },
    transpile: ['buefy'],
    babel: {
      sourceType: 'unambiguous',
    },
  },
};
