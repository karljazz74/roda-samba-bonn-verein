module.exports = {
  apps: [{
    name: 'nuxt-dev',
    script: './start-dev.js',
    watch: false,
    autorestart: true,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      NODE_TLS_REJECT_UNAUTHORIZED: '0'
    }
  }]
}
