export type Language =
    | 'ko'
    | 'en'
    | 'ja'
    | 'zh-CN'
    | 'zh-TW'
    | 'hi'
    | 'es'
    | 'fr'
    | 'de'
    | 'pt'
    | 'vi'
    | 'id'
    | 'fa'
    | 'ar'
    | 'mm'
    | 'th'
    | 'ru'
    | 'it'
    | 'auto'

export type DetectedLanguage = Exclude<Language, 'auto'> & 'unk';

export interface DetectionOutput {
    langCode: DetectedLanguage
}

export interface NSMTTranslatedOutput {
    translatedText: string,
    wsd: null,
    money: null,
    srcLangType: string,
    tarLangType: string,
    engineType: 'NSMT',
    piviot: null,
    langDetection: {
        nbests: {
            lang: string,
            prob: number
        }[]
    }
}

export interface N2MTTranslatedOutput {
    srcLangType: string,
    tarLangType: string,
    translatedText: string,
    engineType: string,
    piviot: null,
    dict: Dictionary
    tarDict: Dictionary & {
        examples: {
            text: string,
            translatedText: string,
            source: string,
            matchType: string
        }[]
    },
    tlitSrc: Tlit,
    tlit: Tlit,
    delay: number,
    delaySmt: number,
    langDetection: {
        nbests: {
            lang: string,
            prob: number
        }[]
    }
}

export class DetectionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DetectionError';
    }
}

interface Tlit {
    message: {
        tlitResult: {
            token: string,
            phoneme: string
        }[]
    }
}

interface Dictionary {
    items: {
        entry: string,
        subEntry: null,
        matchType: string,
        hanjaEntry: null,
        phoneticSigns: {
            type: string,
            sign: string
        }[],
        pos: {
            type: string,
            meanings: {
                meaning: string,
                examples: {
                    text: string,
                    translatedText: string
                }[]
            }[]
        }[],
        source: string,
        url: string,
        mUrl: string
    }
}