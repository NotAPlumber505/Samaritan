import { postUser } from "./api"
import { generateECDSAKeyPair } from "./ecdsa"
import * as SecureStore from 'expo-secure-store';


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
    SecureStore.setItem("ecdsaPrivateKey",String(keyPair[0]))
    await postUser(
        {
            ecdsa_public_key: String(keyPair[1]),
            is_samaritan: is_samaritan
        }
    )
}