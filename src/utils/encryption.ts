import CryptoJS from 'crypto-js';

export const encryptMessage = (message: string, algorithm: string): string => {
  switch (algorithm) {
    case 'SHA-256':
      return CryptoJS.SHA256(message).toString();
    case 'Keccak-256':
      return CryptoJS.SHA3(message).toString();
    case 'RIPEMD-160':
      return CryptoJS.RIPEMD160(message).toString();
    case 'AES':
      const key = CryptoJS.lib.WordArray.random(32);
      return CryptoJS.AES.encrypt(message, key).toString();
    default:
      // For demonstration purposes, use a simple hash for unsupported algorithms
      return CryptoJS.SHA256(message).toString();
  }
};