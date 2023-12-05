"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("./app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
const port = 3000;
app_1.app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
