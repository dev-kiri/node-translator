import crypto from 'crypto';

export function authorize({ target: { uuid, url, timestamp }, key, algorithm }: AuthorizationTarget): string {
    return crypto.createHmac(algorithm, key)
        .update(`${uuid}\n${url}\n${timestamp}`)
        .digest('base64');
}

interface AuthorizationTarget {
    target: {
        uuid: string,
        url: string,
        timestamp: number
    },
    key: string,
    algorithm: string
}