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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionManager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const fabric_network_1 = require("fabric-network");
class ConnectionManager {
    static createGateway(wallet, username, ccp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gateway = new fabric_network_1.Gateway();
                yield gateway.connect(ccp, {
                    wallet,
                    identity: username,
                    discovery: { enabled: true, asLocalhost: true }
                });
                return gateway;
            }
            catch (error) {
                console.error(`Failed to connect to gateway: ${error}`);
                throw error;
            }
        });
    }
    static getConnectionProfile(orgName) {
        try {
            let ccpPath = path_1.default.resolve(__dirname, '..', 'connections', `connection-${orgName.toLowerCase()}.json`);
            const ccpJSON = fs_1.default.readFileSync(ccpPath, 'utf8');
            return JSON.parse(ccpJSON);
        }
        catch (error) {
            throw new Error('Connection Profile not found!');
        }
    }
    static getCaUrl(orgName, ccp) {
        let caURL = ccp.certificateAuthorities[`ca.${orgName.toLowerCase()}.example.com`].url;
        if (!caURL) {
            throw new Error('CA url not found!');
        }
        return caURL;
    }
    static getCaInfo(orgName, ccp) {
        return ccp.certificateAuthorities[`ca.${orgName.toLowerCase()}.example.com`];
    }
    static getAffiliation(orgName) {
        return `${orgName.toLowerCase()}.department1`;
    }
}
exports.ConnectionManager = ConnectionManager;
