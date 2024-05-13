import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Nothing Better Than AL !',
        version: '1.0.0',
        description: 'Restful API with Nodejs and Express for a cinema app called Nothing Better Than AL',
      },
    },
    apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsdoc(options);

export default specs
