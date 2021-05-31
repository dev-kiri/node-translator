export type Json<T extends any> = Record<string, T>;

export function stringify(data: Json<string | number | boolean>) {
    const res: string[] = [];

    for (const [k, v] of Object.entries(data)) {
        res.push(`${k}=${encodeURIComponent(v)}`);
    }

    return res.join('&');
}