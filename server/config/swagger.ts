import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TutorG API Documentation',
            version: '1.0.0',
            description: 'API documentation for the TutorG E-Learning Platform backend.',
            contact: {
                name: 'Joyel Varghese',
                url: 'https://github.com/JoyelV/tutorG',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object', nullable: true },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                        errors: { type: 'array', items: { type: 'string' } },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.ts', './controllers/*.ts'], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
