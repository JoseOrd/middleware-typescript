import FabricCAServices from "fabric-ca-client";
import { Identity, Wallet, Wallets } from "fabric-network";
import { ConnectionManager } from "./connectionManagerService";
import { ConnectionProfile } from "../models/ConnectionProfile.model";
 
export class WalletManager {

    private couchDB: string = process.env.COUCHDB || '';
    private dbName: string = process.env.DB_NAME || '';
    private adminEnrollmentID: string = process.env.ADMIN_ENROLLMENT_ID || '';
    private adminEnrollmentSecret: string = process.env.ADMIN_ENROLLMENT_SECRET || '';

    constructor(
        public username: string,
        public orgName: string
    ) {}

    async getWallet() {
        const walletPath = this.getWalletPath();
        return await Wallets.newCouchDBWallet(this.couchDB, walletPath);
    }

    async createWallet() {
        try {
            const ccp = ConnectionManager.getConnectionProfile(this.orgName);
            const caURL = ConnectionManager.getCaUrl(this.orgName, ccp);
            const ca = new FabricCAServices(caURL);

            const wallet = await this.getWallet();
            
            const userIdentity = await wallet.get(this.username);
            if (userIdentity) {
                throw new Error(`An identity for the user ${this.username} already exists`);
            }

            const adminIdentity = await this.getAdminIdentity(ccp, wallet);
            const adminUser = await this.getAdminUser(wallet, adminIdentity);

            const enrollmentSecret = await ca.register({
                affiliation: ConnectionManager.getAffiliation(this.orgName),
                enrollmentID: this.username,
                role: 'client'
            }, adminUser);

            const enrollment = await ca.enroll({
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

            await wallet.put(this.username, x509Identity);

            return {
                success: true,
                message: `${this.username} enrolled Successfully`
            };
                
        } catch (error) {
            console.error(`Failed to createWallet: ${error}`);
            throw error;
        }
    }

    private async getAdminIdentity(ccp: ConnectionProfile, wallet: Wallet): Promise<Identity> {
        try {
            const adminIdentity = await wallet.get('admin');
            if (adminIdentity) {
                return adminIdentity;
            }

            return await this.enrollAdmin(ccp, wallet);
        } catch (error) {
            console.error(`Failed to get admin identity: ${error}`);
            throw error;
        }
    }

    private async getAdminUser(wallet: Wallet, adminIdentity: Identity){
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        return await provider.getUserContext(adminIdentity, 'admin');
    }

    private async enrollAdmin(ccp: ConnectionProfile, wallet: Wallet): Promise<Identity> {
        try {
            const caInfo = ConnectionManager.getCaInfo(this.orgName, ccp);
            const caTLSCACerts = caInfo.tlsCACerts.pem;

            const ca = new FabricCAServices(caInfo.url, {
                trustedRoots: caTLSCACerts,
                verify: caInfo.httpOptions.verify
            }, caInfo.caName);

            const enrollment = await ca.enroll({
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

            await wallet.put('admin', x509Identity);
            
            const adminIdentity = await wallet.get('admin');
            if (!adminIdentity) {
                throw new Error('Failed to import admin identity into the wallet');
            }

            return adminIdentity;
            
        } catch (error) {
            console.error(`Failed to enroll admin user "admin": ${error}`);
            throw error;
        }
    }

    private getWalletPath(): string {
        return `${this.dbName}-${this.orgName.toLocaleLowerCase()}`
    }
}