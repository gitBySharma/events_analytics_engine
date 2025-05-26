const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Events Analytics Engine',
        description: 'An unified events analytics engine for apps and websites'
    },
    host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/googleInfo.js', './routes/APIkeyManagement.js'];


swaggerAutogen(outputFile, routes, doc);