module.exports = {
  apps: [
    {
      name: 'himachal-nomad-cluster',
      script: './server.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        ENABLE_CLUSTER: 'false'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000
      }
    }
  ]
};
