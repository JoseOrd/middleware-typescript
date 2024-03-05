"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dbOffChainController_1 = require("../controllers/dbOffChainController");
const router = express_1.default.Router();
router.get('/:hash', dbOffChainController_1.DbOffChainController.get);
router.post('/', dbOffChainController_1.DbOffChainController.add);
exports.default = router;
