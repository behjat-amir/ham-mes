const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const swaggerConfig = (app) => {
  try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`API Docs available at ${process.env.CORS_ORIGIN}/api-docs`);
  } catch (err) {
    console.error('Swagger config error:', err);
  }
};

module.exports = swaggerConfig; 