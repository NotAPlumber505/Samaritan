import { postUser } from "./api"
import { generateECDSAKeyPair } from "./ecdsa"
import { setItem, setSecureItem } from "./store"


export const createUser = async (is_samaritan: boolean) => {
    const keyPair = generateECDSAKeyPair()
    if(!keyPair) {
        throw new Error("Key pair came back null when generating user!")
    }
    if(!keyPair[0]) {
        throw new Error("Private key came back null!");
    }
    if(!keyPair[1]) {
        throw new Error("Public key came back null!");
    }
    setSecureItem("ecdsaPrivateKey",String(keyPair[0]))
    const response = await postUser(
        {
            ecdsa_public_key: String(keyPair[1]),
            is_samaritan: is_samaritan
        }
    )
    setItem("is_samaritan ",String(is_samaritan))
    setItem("user_id",String(response.user_id))

    
}