"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invokeRoute_1 = __importDefault(require("./invokeRoute"));
const dbOffChainRoute_1 = __importDefault(require("./dbOffChainRoute"));
const queryRoute_1 = __importDefault(require("./queryRoute"));
const userRoute_1 = __importDefault(require("./userRoute"));
const router = express_1.default.Router();
router.get('/ping', (_req, res) => {
    console.log('someone pinged here!!');
    res.send('pong');
});
router.use('/users', userRoute_1.default);
router.use('/db', dbOffChainRoute_1.default);
router.use(invokeRoute_1.default);
router.use(queryRoute_1.default);
router.use(dbOffChainRoute_1.default);
exports.default = router;
