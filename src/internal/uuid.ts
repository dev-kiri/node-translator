import crypto from 'crypto';

export class UUID {

    private buffer: string[];
    private rnds: Uint8Array;

    private constructor (buffer: string[], rnds: Uint8Array) {
        this.buffer = buffer;
        this.rnds = rnds;
    }

    static randomUUID() {
        const pool = new Uint8Array(256);
        let ptr = pool.length;

        if ( ptr > pool.length + 16 ) {
            crypto.randomFillSync(pool);
            ptr = 0;
        }

        const rnds = pool.slice(ptr, (ptr += 16));

        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;

        const buffer = [];
    
        for (let i = 0; i < 256; i++) {
            buffer.push((i + 0x100).toString(16).slice(1));
        }

        return new UUID(buffer, rnds);
    }

    /**
     * 
     * @override
     */
    toString() {
        let uuid: string = '';

        for (let i = 0; i < 16; i++) {
            if (i == 4 || i == 6 || i == 8 || i == 10) {
                uuid += '-';
            }
            uuid += this.buffer[this.rnds[i]];
        }

        return uuid;
    }
}
