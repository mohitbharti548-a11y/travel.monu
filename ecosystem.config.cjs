module.exports = {
  apps: [
    {
      name: 'himachal-nomad-cluster',
      script: './server.js',
      instances: 'max', // Multi-core CPU utilization
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
        ENABLE_CLUSTER: 'true'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5000
      }
    }
  ]
};
