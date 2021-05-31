import { authorize } from './authorization';
import { Language } from './language';

export function requestHeaders(
    uuid: string,
    url: string,
    timestamp: number,
    key: string,
    algorithm: string
): Record<'headers', PapagoHeaders> {
    const auth: string = authorize({
        target: {
            uuid,
            url,
            timestamp
        },
        key,
        algorithm
    });
    const authorization = `PPG ${uuid}:${auth}`;
    const headers: PapagoHeaders = {
        authorization,
        timestamp: timestamp.toString()
    };
    return { headers };
}

export interface PapagoHeaders {
    authorization: string,
    timestamp: string
}

export interface PapagoData extends PickRename<PapagoHeaders, 'authorization', 'authroization'> {
    deviceId: string,
    locale: string,
    dict: boolean,
    dictDisplay: number,
    honorific: boolean,
    instant: boolean,
    paging: boolean,
    source: string,
    target: string,
    text: string
}

export type PickRename<T, K extends keyof T, R extends PropertyKey> = Omit<T, K> & { [P in R]: T[K] }