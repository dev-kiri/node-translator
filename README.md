# node-translator
Papago Translator for node

![alt text](https://papago.naver.com/static/img/papago_og.png)
## Example Usage
### import
```ts
import { Papago } from './';
```
### n2mt translate (default)
```ts
new Papago({
    config: {
        source: 'auto',
        target: 'en',
        text: '안녕'
    }
}).translate().then(res => console.log(res));

>>> {
    srcLangType: 'ko',
    tarLangType: 'en',
    translatedText: 'Hi.',
    engineType: 'PRETRANS',
    pivot: null,
    dict: { items: [ [Object] ] },
    tarDict: {
      items: [ [Object], [Object], [Object], [Object] ],
      examples: [ [Object], [Object], [Object], [Object], [Object] ]
    },
    tlitSrc: { message: { tlitResult: [Array] } },
    delay: 400,
    delaySmt: 400,
    langDetection: { nbests: [ [Object] ] }
}
```
### nsmt translate (optional)
```ts
new Papago({
    config: {
        source: 'auto',
        target: 'en',
        text: '안녕'
    },
    engineType: 'nsmt'
}).translate().then(res => console.log(res));

>>> {
    translatedText: 'Hi.',
    wsd: null,
    money: null,
    srcLangType: 'ko',
    tarLangType: 'en',
    engineType: 'NSMT',
    pivot: null,
    dict: { items: [ [Object] ] },
    tarDict: {
      items: [ [Object], [Object], [Object], [Object] ],
      examples: [ [Object], [Object], [Object], [Object], [Object] ]
    },
    tlitSrc: { message: { tlitResult: [Array] } },
    langDetection: { nbests: [ [Object] ] }
}
```
### Language Detection
```ts
Papago.detect('Hallo').then(res => console.log(res));

>>> de
```
