// import AWS from '@/config/aws';

// const KMS = new AWS.KMS();

// export default KMS;

// // Encrypt a plain text by the KMS key ID configured in the environment
// // Return the encrypted data in hexstring format
// export async function encrypt(
//   rawPrivateKey: string,
// ): Promise<AWS.KMS.Types.EncryptResponse> {
//   const KeyId = process.env.AWS_ENCRYPTION_KEY_ID;
//   const EncryptionAlgorithm = 'RSAES_OAEP_SHA_256';
//   const encryptedData = await KMS.encrypt({
//     KeyId,
//     EncryptionAlgorithm,
//     Plaintext: rawPrivateKey,
//   }).promise();

//   return encryptedData;
// }

// export async function decrypt(encryptedData: string) {
//   const KeyId = process.env.AWS_ENCRYPTION_KEY_ID;
//   const decryptedData = await KMS.decrypt({
//     EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
//     KeyId,
//     CiphertextBlob: Buffer.from(encryptedData, 'hex'),
//   }).promise();
//   return decryptedData.Plaintext.toString();
// }
