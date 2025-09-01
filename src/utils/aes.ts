import CryptoJS from 'crypto-js';

/**
 * AES加密处理（ECB模式）
 */
export function encryptECB(plaintText: string): string {
    const options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    };
    const key = CryptoJS.enc.Utf8.parse("11b53d480556fa80eca97c8d032bda8f"); // 秘钥
    const encryptedData = CryptoJS.AES.encrypt(plaintText, key, options);
    let encryptedBase64Str = encryptedData.toString();
    encryptedBase64Str = encryptedBase64Str.replace(/\//g, "_").replace(/\+/g, "-");
    return encryptedBase64Str;
}

/**
 * AES解密处理（ECB模式）
 */
export function decryptECB(encryptedBase64Str: string): string {
    const vals = encryptedBase64Str.replace(/\-/g, '+').replace(/_/g, '/');
    const options = {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    };
    const key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12"); // 秘钥
    const decryptedData = CryptoJS.AES.decrypt(vals, key, options);
    const decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData);
    return decryptedStr;
}