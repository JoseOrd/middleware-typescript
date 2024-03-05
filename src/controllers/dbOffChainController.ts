import { IPFSHTTPClient, create } from 'ipfs-http-client';

export class DbOffChainController {
    
    private static ipfs: IPFSHTTPClient;

    private static getIpfsInstance(): IPFSHTTPClient {
        if (!DbOffChainController.ipfs) {
            DbOffChainController.ipfs = create({
                host: process.env.IPFS_HOST || '127.0.0.1',
                port: process.env.IPFS_PORT ? parseInt(process.env.IPFS_PORT) : 5001,
                protocol: process.env.IPFS_PROTOCOL || 'http'
            });
        }
        return DbOffChainController.ipfs;
    }

    static async add(req: any, res: any) {
        try {
            const { data } = req.body;

            const result = await DbOffChainController.getIpfsInstance().add(
                Buffer.from(
                    JSON.stringify(data)
                )
            );

            return res.status(200).json({ success: true, hash: result.cid.toString() });
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: error });
        }
    }

    static async get(req: any, res: any) {
        try {
            const { hash } = req.params;
            const chunks = [];

            // Itera sobre el generador para obtener los chunks de datos
            for await (const chunk of DbOffChainController.getIpfsInstance().cat(hash)) {
                chunks.push(chunk);
            }

            // Combina los chunks en un búfer
            const resultBuffer = Buffer.concat(chunks);

            // Convierte el búfer a una cadena
            const resultString = resultBuffer.toString('utf-8');

            // Analiza la cadena JSON para obtener un objeto json
            const resultObject = JSON.parse(resultString);

            return res.json({ success: true, result: resultObject });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, error: error });
        }
    }
    
}
