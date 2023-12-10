import { app } from "./app";
import { runDb } from "./repositories/db";

const port = process.env.PORT || 5000;


const startApp = async () => {
  await runDb();
  app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
}

startApp();

export { app };

