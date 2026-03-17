import crypto from 'crypto';

/**
 * Generates a ZegoCloud Token v4 (Token04) for backend authentication.
 * 
 * @param appId - Your ZegoCloud AppID (integer).
 * @param userId - Unique ID of the user.
 * @param secret - Your ZegoCloud Server Secret (32-character string).
 * @param effectiveTimeInSeconds - Token validity period in seconds (e.g., 3600).
 * @param payload - Optional JSON string containing permissions (e.g., room_id, privileges).
 * @returns The generated token starting with '04'.
 */
export function generateZegoToken(
    appId: number,
    userId: string,
    secret: string,
    effectiveTimeInSeconds: number,
    payload: string = ''
): string {
    const createTime = Math.floor(Date.now() / 1000);
    const expireTime = createTime + effectiveTimeInSeconds;

    // Create the token information object
    const nonce = crypto.randomInt(Math.pow(2, 31) - 1);
    const tokenInfo = {
        app_id: appId,
        user_id: userId,
        nonce: nonce,
        ctime: createTime,
        expire: expireTime,
        payload: payload
    };

    const plainText = JSON.stringify(tokenInfo);
    const iv = crypto.randomBytes(16); // 16 bytes for AES-GCM

    // The secret must be 32 bytes for AES-256. 
    // Zego server secrets are typically 32-character strings.
    const key = Buffer.from(secret, 'utf8');

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag(); // 16 bytes auth tag for GCM

    // Pack the binary data according to Zego's specification:
    // [expire_time(8), iv_len(2), iv, tag_len(2), tag, cipher_len(2), ciphertext]

    const expireBuffer = Buffer.alloc(8);
    expireBuffer.writeBigInt64BE(BigInt(expireTime));

    const ivLenBuffer = Buffer.alloc(2);
    ivLenBuffer.writeUInt16BE(iv.length);

    const tagLenBuffer = Buffer.alloc(2);
    tagLenBuffer.writeUInt16BE(tag.length);

    const cipherLenBuffer = Buffer.alloc(2);
    cipherLenBuffer.writeUInt16BE(ciphertext.length);

    const binaryData = Buffer.concat([
        expireBuffer,
        ivLenBuffer, iv,
        tagLenBuffer, tag,
        cipherLenBuffer, ciphertext
    ]);

    // The final token is '04' followed by the base64 encoded binary data
    return '04' + binaryData.toString('base64');
}
