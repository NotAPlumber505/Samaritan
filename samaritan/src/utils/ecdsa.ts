import crypto, { KeyPairKey } from 'react-native-quick-crypto'

export function generateECDSAKeyPair() {
    try
    {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
        namedCurve: "prime256v1",
        publicKeyEncoding: {type: "spki", format: "pem"},
        privateKeyEncoding: {type: 'pkcs8', format: "pem"}
        });
        return [privateKey,publicKey]
    }
    catch (error) {
        console.log("Exception while creating keypair! Here's the exception:\n" + error)
    }
}

/**
 * 
 * @param ecdsaPrivateKey 
 * Note: Retrieve this from the secure-store
 * @param data 
 * @returns 
 */
export function signData(ecdsaPrivateKey: string, data: string) {
    try
    {
        const sign = crypto.createSign("SHA256");
        sign.update(data)
        return sign.sign(ecdsaPrivateKey, 'hex')
    }
    catch (error) {
        console.log("Exception while creating keypair! Here's the exception:\n" + error)
    }
}