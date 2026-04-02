module.exports = {
  apps: [{
    name: 'NuxtDirectusApp',
    script: 'npm',
    args: 'run dev',
    cwd: 'C:/Users/carlo/directus-starters/cms/nuxt',
    interpreter: 'none',
    env: {
      NODE_ENV: 'development',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      DIRECTUS_URL: 'https://directus-cms-production-913b.up.railway.app',
      DIRECTUS_SERVER_TOKEN: 'Bsc_XoEVW3INEEXV4DDEBZn9RmKTAIww',
      NUXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      NUXT_PUBLIC_ENABLE_VISUAL_EDITING: 'true'
    },
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
