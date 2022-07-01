import * as bcrypt from 'bcrypt';
import CryptoJS from 'crypto-js';
import configuration from '@/config/configuration';

export async function hashPassword(password: string) {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
}

export async function hashMatching(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function encryptPrivateKey(privateKey: string) {
  return CryptoJS.AES.encrypt(
    privateKey,
    configuration().blockchain.encryptSecretKey,
  ).toString();
}

export function decryptPrivateKey(privateKey: string) {
  return CryptoJS.AES.decrypt(
    privateKey,
    configuration().blockchain.encryptSecretKey,
  ).toString(CryptoJS.enc.Utf8);
}
