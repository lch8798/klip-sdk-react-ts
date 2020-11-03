# Kakao Klip SDK

> Functions

-   Login with Kakao Klip (Get Address)
-   Fetch Cards By Contract Address

### 1. create d.ts for declare type

```
npx typescript .\node_modules\klip-sdk\dist\klipSDK.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

### 2. custom d.ts file

node_modules/klip-sdk/dist/klipSDK.d.ts

```
...codes

export {
  getCardList,
  getResult,
  prepare,
  request,
};

```

##### The last update is 2020-11-03.
