import type { userStore, secureStore } from "./userStore"
import * as SecureStore from 'expo-secure-store';
import Storage, { SQLiteStorageSetItemUpdateFunction } from 'expo-sqlite/kv-store';

export const setItem = async (key: userStore, data: string | SQLiteStorageSetItemUpdateFunction) => {
    return Storage.setItem(key, data)
}
export const setSecureItem = (key: secureStore, data: string, options?: SecureStore.SecureStoreOptions | undefined ) => {
    return SecureStore.setItem(key, data, options)
}

export const getItem = async (key: userStore) => {
    return Storage.getItem(key)
}
export const getSecureItem = (key: secureStore, options?: SecureStore.SecureStoreOptions | undefined ) => {
    return SecureStore.getItem(key, options)
}

