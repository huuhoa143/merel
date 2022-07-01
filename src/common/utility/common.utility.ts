import axios from 'axios';

// Nano ID
import { customAlphabet } from 'nanoid';

const nanoidAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoidLength = 12;
const nanoid = customAlphabet(nanoidAlphabet, nanoidLength);

export async function getExternalGas(url: string) {
  const result = await axios.get(url, {
    validateStatus: function (status) {
      return status >= 200 && status < 500; // default
    },
  });
  return result.data;
}

export async function removeString(input: string, removedPart: string) {
  if (input) {
    return input.substring(removedPart.length);
  }
}

export function uniqueCode() {
  return nanoid();
}

export const flatten = (a) => {
  return Array.isArray(a) ? [].concat(...a.map(flatten)) : a;
};

export const uniq = (a) => [...new Set(a)];
