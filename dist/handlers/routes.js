"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRoutes = void 0;
const initRoutes = (app) => {
    app.get("/health", (req, res) => {
        res.send({ "message": "Cinema: Nothingbetterthanal" });
    });
};
exports.initRoutes = initRoutes;
