import fetch from 'node-fetch';
import { Language, DetectedLanguage, DetectionOutput, N2MTTranslatedOutput, NSMTTranslatedOutput, DetectionError } from './internal/language';
import { requestHeaders, PapagoData } from './internal/request';
import { UUID } from './internal/uuid';
import { stringify } from './internal/qs';

export class Papago {

    private readonly ver: string = 'v1.5.9_33e53be80f';
    private readonly hash_algorithm: string = 'md5';

    private readonly TRANSLATE_URL: string;

    private engineType: string;
    private locale: string;
    private dict: boolean;
    private dictDisplay: number;
    private honorific: boolean;
    private instant: boolean;
    private paging: boolean;

    private source: Language;
    private target: Language;
    private text: string;

    constructor({
        engineType = 'n2mt',
        extraHeaders: {
            locale = 'en',
            dict = true,
            dictDisplay = 30,
            honorific = false,
            instant = false,
            paging = false
        } = {},
        config: {
            source = 'auto',
            target,
            text
        }
    }: PapagoConfig) {
        this.TRANSLATE_URL = `https://papago.naver.com/apis/${engineType}/translate`;
        
        this.engineType = engineType;
        this.locale = locale;
        this.dict = dict;
        this.dictDisplay = dictDisplay;
        this.honorific = honorific;
        this.instant = instant;
        this.paging = paging;

        this.source = source;
        this.target = target;
        this.text = text;
    }
    
    public async translate(): Promise<N2MTTranslatedOutput | NSMTTranslatedOutput> {
        const uuid: string = UUID.randomUUID().toString();
        const timestamp: number = new Date().getTime();
        const { headers } = requestHeaders(uuid, this.TRANSLATE_URL, timestamp, this.ver, this.hash_algorithm);

        if ( this.source == 'auto' ) {
            const lang = await Papago.detect( this.text );
            if ( lang == null ) {
                throw new DetectionError('Cannot detect text');
            }
            this.source = lang;
        }

        const data: PapagoData = {
            deviceId: uuid,
            locale: this.locale,
            dict: this.dict,
            dictDisplay: this.dictDisplay,
            honorific: this.honorific,
            instant: this.instant,
            paging: this.paging,
            source: this.source,
            target: this.target,
            text: this.text,
            authroization: headers.authorization,
            timestamp: headers.timestamp
        };
        
        const res = await fetch(this.TRANSLATE_URL, {
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
            },
            method: 'POST',
            body: stringify(data as any)
        });

        switch ( this.engineType ) {
            default:
                case 'n2mt':
                    return await res.json() as N2MTTranslatedOutput;
                case 'nsmt':
                    return await res.json() as NSMTTranslatedOutput;
        }
    }

    public static async detect(query: string): Promise<DetectedLanguage | null> {
        const uuid: string = UUID.randomUUID().toString();
        const timestamp: number = new Date().getTime();
        const url: string = 'https://papago.naver.com/apis/langs/dect';
        const { headers } = requestHeaders(uuid, url, timestamp, 'v1.5.9_33e53be80f', 'md5');
        
        const res = await fetch(url, {
            headers: {
                ...headers,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
            },
            method: 'POST',
            body: stringify({ query })
        });

        const { langCode }: DetectionOutput = await res.json();

        if ( langCode == 'unk' ) return null;
        return langCode;
    }
}

export interface PapagoConfig {
    engineType ?: string,
    extraHeaders ?: {
        locale ?: string,
        dict ?: boolean,
        dictDisplay ?: number,
        honorific ?: boolean,
        instant ?: boolean,
        paging ?: boolean,
    },
    config: LanguageSet
}

interface LanguageSet {
    source ?: Language,
    target: Language,
    text: string
}
