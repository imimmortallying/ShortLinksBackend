import pino from 'pino';

const logger = pino({
    transport: {
        targets: [
            {
                target: 'pino-pretty',
                level: 'trace'
            }
        ]
    }
});

export default logger;