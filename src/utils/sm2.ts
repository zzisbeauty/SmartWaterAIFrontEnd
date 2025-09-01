import { sm2 } from 'sm-crypto';

// 公钥
const PUBLIC_KEY = '048018360d8ff8ed9995f624afd3b437ee6aa281b05522b13a7e02c56e82a95f3fd370a220eee248452d52e54db21ed5d22fcdedb1b9f05882acb397266ac0ef26'
// const PRIVATE_KEY = '00c8631c338e53db5964c9569c82a30ef0c20a88bc88dc83ad2a5b2fa3d0411083'

// 可配置参数
// 1 - C1C3C2；	0 - C1C2C3；  默认为1
const cipherMode = 1

//加密
export function doSM2Encrypt(str) {
    let msg = str
    if (typeof str !== 'string') {
      msg = JSON.stringify(str)
    }
    // console.log(msg,'加密前')
    const publicKey = PUBLIC_KEY
    // 加密结果
    const encryptData = sm2.doEncrypt(msg, publicKey, cipherMode)
    //Base64编码 自行选择是否使用
    //let baseEncode = Base64.encode(encryptData)
    // 加密后的密文前需要添加04，后端才能正常解密 (不添加04，后端处理也可以)
    const encrypt = '04' + encryptData
    return encrypt
}

// // 解密
// export function doSM2DecryptStr(enStr) {
//     let msg = enStr
//     if (typeof enStr !== 'string') {
//       msg = JSON.stringify(enStr)
//     }
//     const privateKey = PRIVATE_KEY
//     const enval = enStr.substring(2)
//     // 解密结果
//     const doDecrypt = sm2.doDecrypt(enval , privateKey, cipherMode)
//     console.log("doDecrypt=>", doDecrypt)
//     // 解密后类型转换
//     return doDecrypt;
// }
