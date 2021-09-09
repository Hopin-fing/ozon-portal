module.exports = {
  apps: [
    {
      name: "ozon-portal",
      script: "yarn start",
      watch: true,
      instance_var: '1',
      env: {
        "PORT": 5000,
        "NODE_ENV": "development"
      }
    }
  ]
}