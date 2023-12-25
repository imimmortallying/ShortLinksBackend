import { configureMongo } from './_refact/configuration/configuration.mongo';
import logger from './_refact/core/core.logger.pino';
import app from './app';

logger.info('App is starting');

const SERVICE_PORT_DEFAULT = 5000;

const servicePort = process.env.SL_SERVICE__PORT || SERVICE_PORT_DEFAULT;

app.listen(servicePort, async () => {
    await configureMongo();

    logger.info('Example app listening on port %d', servicePort);
});

process.on('SIGINT', () => {
    logger.info('App is shutting down');

    process.exit(0);
});