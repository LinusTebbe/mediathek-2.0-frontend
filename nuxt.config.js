require('dotenv').config();

export default {
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/auth',
        '@nuxtjs/axios',
        '@nuxtjs/dotenv'
    ],
    env: {
        PASSPORT_PASSWORD_GRANT_ID: process.env.PASSPORT_PASSWORD_GRANT_ID,
        PASSPORT_PASSWORD_GRANT_SECRET: process.env.PASSPORT_PASSWORD_GRANT_SECRET
    },
    axios: {
        baseURL: process.env.LARAVEL_ENDPOINT
    },
    auth: {
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/'
        },
        strategies: {
            local: false,
            password_grant: {
                _scheme: 'local',
                endpoints: {
                    login: {
                        url: '/oauth/token',
                        method: 'post',
                        propertyName: 'access_token'
                    },
                    logout: false,
                    user: {
                        url: '/api/user',
                        method: 'get',
                    }
                }
            }
        }
    },
    router: {
        middleware: ['auth']
    },
    css: [
        '@/assets/css/colors.css',
        '@/assets/css/text-sizes.css',
        '@/assets/css/main.scss',
        '@fortawesome/fontawesome-svg-core/styles.css',
    ],
    pwa: {
        workbox: {
            offline: true,
            offlineStrategy: 'CacheFirst',
            runtimeCaching: [{
                urlPattern: 'https://mediathek.s3.eu-central-1.wasabisys.com/show-thumbnails/.*',
                handler: 'staleWhileRevalidate',
                method: 'GET',
            }],
            workboxExtensions: '@/plugins/lookForVideoInCache.js',
        }
    },
    plugins: [
        '~/plugins/fontawesome.js',
        '~/plugins/vue-async-computed.js',
        { src: '~/plugins/localStorage.js', ssr: false }
    ],
    buildModules: [
        '@nuxtjs/dotenv',
        '@nuxtjs/moment'
    ],
    moment: {
        defaultLocale: 'de',
        locales: ['de']
    }, build: {
        extend(config, ctx) {
            if (ctx.isDev) {
                config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
            }
        }
    }
};
