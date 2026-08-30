/** Cipher used for message encryption */
export const Cipher = "AES-GCM";

const NonceLen = 12;
const MsgEncoder = new TextEncoder();
const MsgDecoder = new TextDecoder();
const hasTransfer = "transfer" in ArrayBuffer.prototype;

declare global {
  export interface Uint8ArrayConstructor {
    fromBase64: (s: string) => Uint8Array<ArrayBuffer>;
  }
  export interface Uint8Array {
    toBase64: (
      o?: Partial<{ alphabet: string; omitPadding: boolean }>,
    ) => string;
  }
  export interface ArrayBuffer {
    transfer: (l: number) => ArrayBuffer;
  }
}

/** Generate unique nonce for AES encryption */
function genNonce() {
  const date = Date.now(),
    iv = new Uint32Array(3);
  iv[0] = date;
  iv[1] = date / 2 ** 32;
  crypto.getRandomValues(new Uint8Array(iv.buffer.slice(6)));
  return iv;
}

/** Encrypt buffer and return in Stoat encryption format */
export async function encrypt(key: CryptoKey, data: BufferSource) {
  const iv = genNonce(),
    buf = await crypto.subtle.encrypt({ name: Cipher, iv }, key, data);

  const nBuf = new Uint8Array(
    hasTransfer
      ? iv.buffer.transfer(NonceLen + buf.byteLength)
      : ((NonceLen + buf.byteLength) as never),
  );
  if (!hasTransfer) nBuf.set(new Uint8Array(iv.buffer));
  nBuf.set(new Uint8Array(buf), NonceLen);
  return nBuf;
}

/** Encrypt text string and return base64 */
export const encryptStr = async (key: CryptoKey, str: string) =>
  new Uint8Array(await encrypt(key, MsgEncoder.encode(str))).toBase64({
    omitPadding: true,
  });

/** Decrypt buffer from Stoat encryption format */
export const decrypt = (key: CryptoKey, data: ArrayBuffer) =>
  crypto.subtle.decrypt(
    { name: Cipher, iv: data.slice(0, NonceLen) },
    key,
    data.slice(NonceLen),
  );

/** Decrypt text string from base64 */
export async function decryptStr(key?: CryptoKey, base64?: string) {
  if (!key || !base64) return base64;
  try {
    return MsgDecoder.decode(
      await decrypt(key, Uint8Array.fromBase64(base64).buffer),
    );
  } catch (e) {
    console.error(e);
    return "`[ Decryption Error ]`";
  }
}

//TODO Annoyingly, these are not exported from the ULID library. Should submit a PR to them
const B32_CHARACTERS = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
function crockfordDecode(input: string) {
  input = input.toUpperCase().split("").reverse().join("");
  const output = [];
  let bitsRead = 0,
    buffer = 0;
  for (const c of input) {
    const byte = B32_CHARACTERS.indexOf(c);
    if (byte === -1)
      throw new Error(`Invalid base 32 character found in string: ${c}`);
    buffer |= byte << bitsRead;
    bitsRead += 5;
    while (bitsRead >= 8) {
      output.unshift(buffer & 0xff);
      buffer >>>= 8;
      bitsRead -= 8;
    }
  }
  if (bitsRead >= 5 || buffer > 0) output.unshift(buffer & 0xff);
  return new Uint8Array(output);
}

/** Generate CryptoKey */
export async function genKey(
  channelId: string,
  pwd: string,
): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    "raw",
    MsgEncoder.encode(pwd),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: crockfordDecode(channelId),
      iterations: 600000, //TODO Is this a good value?
      hash: "SHA-256",
    },
    base,
    { name: Cipher, length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}
