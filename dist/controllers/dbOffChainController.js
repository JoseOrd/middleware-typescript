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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbOffChainController = void 0;
const ipfs_http_client_1 = require("ipfs-http-client");
class DbOffChainController {
    static getIpfsInstance() {
        if (!DbOffChainController.ipfs) {
            DbOffChainController.ipfs = (0, ipfs_http_client_1.create)({
                host: process.env.IPFS_HOST || '127.0.0.1',
                port: process.env.IPFS_PORT ? parseInt(process.env.IPFS_PORT) : 5001,
                protocol: process.env.IPFS_PROTOCOL || 'http'
            });
        }
        return DbOffChainController.ipfs;
    }
    static add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = req.body;
                const result = yield DbOffChainController.getIpfsInstance().add(Buffer.from(JSON.stringify(data)));
                return res.status(200).json({ success: true, hash: result.cid.toString() });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, error: error });
            }
        });
    }
    static get(req, res) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { hash } = req.params;
                const chunks = [];
                try {
                    // Itera sobre el generador para obtener los chunks de datos
                    for (var _d = true, _e = __asyncValues(DbOffChainController.getIpfsInstance().cat(hash)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const chunk = _c;
                        chunks.push(chunk);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                // Combina los chunks en un búfer
                const resultBuffer = Buffer.concat(chunks);
                // Convierte el búfer a una cadena
                const resultString = resultBuffer.toString('utf-8');
                // Analiza la cadena JSON para obtener un objeto json
                const resultObject = JSON.parse(resultString);
                return res.json({ success: true, result: resultObject });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, error: error });
            }
        });
    }
}
exports.DbOffChainController = DbOffChainController;
