"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryController = void 0;
const queryService_1 = require("../services/queryService");
class QueryController {
    static queryChaincode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { channelName, chaincodeName } = req.params;
                const { orgName, username } = req;
                const { fcn, args } = req.body;
                console.log('Querying chaincode:', { channelName, chaincodeName, fcn, args, orgName, username });
                if (!chaincodeName || !channelName || !fcn || !args) {
                    return res.status(400).json({ message: 'channelName, chaincodeName, fcn and args are required' });
                }
                const response = yield queryService_1.QueryService.queryChaincode(channelName, chaincodeName, fcn, args, orgName, username);
                return res.status(200).json({ result: response });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.QueryController = QueryController;
