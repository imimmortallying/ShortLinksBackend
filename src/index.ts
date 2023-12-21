import { app } from "./app";
import { runDb } from "./repositories/db";

const SERVICE_PORT_DEFAULT = 5000;

const servicePort = process.env.SL_SERVICE__PORT || SERVICE_PORT_DEFAULT;


const startApp = async () => {
  await runDb();

  app.listen(servicePort, () => {
    console.log(`Example app listening on port ${servicePort}`)
  });
}

startApp();

export { app };
