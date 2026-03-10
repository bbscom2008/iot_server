import EncryptUtils from './EncryptUtils'



// res 解密

const resEncryptData = `U/MgHh7lI0OshyXT3f+RNGMNURg3gGBz+jZLhhZPmbzv5rQTHpTacnHzpWGb6tzHxfKLJQUa0xVr4lOq0gF3Srk5xNsttapr5bwYwsU2ah9nckX5NGKwAZHmX/GpPQJuyxPOPtVcDUk3eLpojYz3e5ySsVaU5rFE6GZZtu3A+THj+3eK62RMMradg/0xsuScf6pldXqIVnIQLH/4oiV5BnhSbsJK5Ih4DNJ+LU/U570bi3tVsSrBM6vQrjmjGP6rqc4wzzpaN9DfmPhlhZBlHjYi2F4b8rlB+tMXpjkJSAzMYxklTDYr6OuLTs7PdW/PtGQGmCMo73pElHPv5F/rgg==`


const password64 = EncryptUtils.rsaDecrypt(resEncryptData)
console.log(password64);

const testKey = EncryptUtils.base64Decode(password64)
console.log(testKey);


// 测试用例
// 完整加密解密测试
// const testKey = 'BVL0m3ck1ZCr7hsv'; // 16字符的密钥
// const originalData = 'abc123';

// // 加密
// const encrypted = EncryptUtils.sm4Encrypt(originalData, testKey);
// console.log('加密结果(Base64):', encrypted);

// // 解密
const encrypted = `nkjMMuMviQIVyMq1+OAJkXJba1+DF5qQn1+F4HGmHprT0Tm1HXzRXH0NqFd4pitAugtU5YQU9fUB7eFjmBhbuXvxWLVvVLo3qhDyWhNyrWmQ+BfnTsac0wVpBrbrFFuxq2xioB5M2xqP2YLqRWAQTg4uN0OyOiA0eoMlU4rvh6h/CjNBFcSPPaiEfWV2d/WS`;
const decrypted = EncryptUtils.sm4Decrypt(encrypted, testKey);
console.log('解密结果:', decrypted);

// // 验证
// console.log('解密是否成功:', decrypted === originalData);


