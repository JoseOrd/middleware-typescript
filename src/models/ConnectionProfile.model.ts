export interface ConnectionProfile {
    name: string;
    version: string;
    client: ClientConfig;
    organizations: {
        [orgId: string]: OrganizationConfig;
    };
    peers: {
        [peerId: string]: PeerConfig;
    };
    certificateAuthorities: {
        [caId: string]: CertificateAuthorityConfig;
    };
}

interface ClientConfig {
    organization: string;
    connection: {
        timeout: {
            peer: {
                endorser: string;
            }
        }
    }
}

interface OrganizationConfig {
    mspid: string;
    peers: string[];
    certificateAuthorities: string[];
}


interface PeerConfig {
    url: string;
    tlsCACerts: TlsCACerts;
    grpcOptions: {
        "ssl-target-name-override": string;
        "hostnameOverride": string;
    };
}

export interface CertificateAuthorityConfig {
    url: string;
    caName: string;
    tlsCACerts: TlsCACerts;
    httpOptions: {
        verify: boolean;
    }
}

interface TlsCACerts {
    pem: string[];
}