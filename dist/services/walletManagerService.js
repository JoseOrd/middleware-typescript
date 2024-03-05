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
exports.WalletManager = void 0;
const fabric_ca_client_1 = __importDefault(require("fabric-ca-client"));
const fabric_network_1 = require("fabric-network");
const connectionManagerService_1 = require("./connectionManagerService");
class WalletManager {
    constructor(username, orgName) {
        this.username = username;
        this.orgName = orgName;
        this.couchDB = process.env.COUCHDB || '';
        this.dbName = process.env.DB_NAME || '';
        this.adminEnrollmentID = process.env.ADMIN_ENROLLMENT_ID || '';
        this.adminEnrollmentSecret = process.env.ADMIN_ENROLLMENT_SECRET || '';
    }
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            const walletPath = this.getWalletPath();
            return yield fabric_network_1.Wallets.newCouchDBWallet(this.couchDB, walletPath);
        });
    }
    createWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ccp = connectionManagerService_1.ConnectionManager.getConnectionProfile(this.orgName);
                const caURL = connectionManagerService_1.ConnectionManager.getCaUrl(this.orgName, ccp);
                const ca = new fabric_ca_client_1.default(caURL);
                const wallet = yield this.getWallet();
                const userIdentity = yield wallet.get(this.username);
                if (userIdentity) {
                    throw new Error(`An identity for the user ${this.username} already exists`);
                }
                const adminIdentity = yield this.getAdminIdentity(ccp, wallet);
                const adminUser = yield this.getAdminUser(wallet, adminIdentity);
                const enrollmentSecret = yield ca.register({
                    affiliation: connectionManagerService_1.ConnectionManager.getAffiliation(this.orgName),
                    enrollmentID: this.username,
                    role: 'client'
                }, adminUser);
                const enrollment = yield ca.enroll({
                    enrollmentID: this.username,
                    enrollmentSecret: enrollmentSecret
                });
                const x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes(),
                    },
                    mspId: ccp.organizations[this.orgName].mspid,
                    type: 'X.509',
                };
                yield wallet.put(this.username, x509Identity);
                return {
                    success: true,
                    message: `${this.username} enrolled Successfully`
                };
            }
            catch (error) {
                console.error(`Failed to createWallet: ${error}`);
                throw error;
            }
        });
    }
    getAdminIdentity(ccp, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminIdentity = yield wallet.get('admin');
                if (adminIdentity) {
                    return adminIdentity;
                }
                return yield this.enrollAdmin(ccp, wallet);
            }
            catch (error) {
                console.error(`Failed to get admin identity: ${error}`);
                throw error;
            }
        });
    }
    getAdminUser(wallet, adminIdentity) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
            return yield provider.getUserContext(adminIdentity, 'admin');
        });
    }
    enrollAdmin(ccp, wallet) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const caInfo = connectionManagerService_1.ConnectionManager.getCaInfo(this.orgName, ccp);
                const caTLSCACerts = caInfo.tlsCACerts.pem;
                const ca = new fabric_ca_client_1.default(caInfo.url, {
                    trustedRoots: caTLSCACerts,
                    verify: caInfo.httpOptions.verify
                }, caInfo.caName);
                const enrollment = yield ca.enroll({
                    enrollmentID: this.adminEnrollmentID,
                    enrollmentSecret: this.adminEnrollmentSecret
                });
                const x509Identity = {
                    credentials: {
                        certificate: enrollment.certificate,
                        privateKey: enrollment.key.toBytes()
                    },
                    mspId: ccp.organizations[this.orgName].mspid,
                    type: 'X.509'
                };
                yield wallet.put('admin', x509Identity);
                const adminIdentity = yield wallet.get('admin');
                if (!adminIdentity) {
                    throw new Error('Failed to import admin identity into the wallet');
                }
                return adminIdentity;
            }
            catch (error) {
                console.error(`Failed to enroll admin user "admin": ${error}`);
                throw error;
            }
        });
    }
    getWalletPath() {
        return `${this.dbName}-${this.orgName.toLocaleLowerCase()}`;
    }
}
exports.WalletManager = WalletManager;
