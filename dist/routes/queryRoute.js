"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queryController_1 = require("../controllers/queryController");
const router = express_1.default.Router();
router.get('/channels/:channelName/chaincodes/:chaincodeName', queryController_1.QueryController.queryChaincode);
exports.default = router;
