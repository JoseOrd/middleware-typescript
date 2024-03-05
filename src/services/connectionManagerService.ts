import fs from 'fs';
import path from 'path';
import { Gateway, Wallet } from 'fabric-network';
import { CertificateAuthorityConfig, ConnectionProfile } from "../models/ConnectionProfile.model";

export class ConnectionManager {

    static async createGateway(wallet: Wallet, username: string, ccp: ConnectionProfile) {
        try {
            const gateway = new Gateway();

            await gateway.connect(ccp as any, {
                wallet,
                identity: username,
                discovery: { enabled: true, asLocalhost: true }
            });

            return gateway;
            
        } catch (error) {
            console.error(`Failed to connect to gateway: ${error}`);
            throw error;
        }
    }
    
    static getConnectionProfile(orgName: string): ConnectionProfile {
      try {
        let ccpPath = path.resolve(__dirname, '..', 'connections', `connection-${orgName.toLowerCase()}.json`);

        const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
        return JSON.parse(ccpJSON) as ConnectionProfile;
        
      } catch (error) {
            throw new Error('Connection Profile not found!');
      }
    }

    static getCaUrl(orgName: string, ccp: ConnectionProfile): string {
        let caURL = ccp.certificateAuthorities[`ca.${orgName.toLowerCase()}.example.com`].url;

        if (!caURL) {
            throw new Error('CA url not found!');
        }

        return caURL;
    }

    static getCaInfo(orgName: string, ccp: ConnectionProfile): CertificateAuthorityConfig {
        return ccp.certificateAuthorities[`ca.${orgName.toLowerCase()}.example.com`];
    }

    static getAffiliation(orgName: string): string {
        return `${orgName.toLowerCase()}.department1`;
    }
    
}