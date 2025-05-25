const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Events Analytics Engine',
        description: 'An unified events analytics engine for apps and websites'
    },
    host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/googleInfo.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);