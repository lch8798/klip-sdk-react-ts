type Auth = {
    expiration_time: number;
    request_key: string;
    status: string;
}
export var __esModule: boolean;
export namespace daumtools {
    export { exports as util };
    export function userAgent(ua: any): {
        ua: any;
        browser: {
            name: string;
            version: {
                info: any;
                major: any;
                minor: any;
                patch: any;
            };
        };
        platform: string;
        os: {
            name: string;
            version: {
                info: any;
                major: any;
                minor: any;
                patch: any;
            };
        };
        app: {
            isApp: boolean;
            name: string;
            version: {
                info: any;
                major: any;
                minor: any;
                patch: any;
            };
        };
    };
    export function web2app(context: any): void;
    export { getCardList };
    export { getResult };
    export { prepare };
    export { request };
}
declare namespace __node_modules_klip_sdk_dist_klipSDK_ { }
declare function getCardList({ contract, eoa, cursor }: {
contract: string;
eoa: string;
cursor: '' | string;
}): Promise<any>;
declare function getResult(requestKey: any): Promise<any>;
declare namespace prepare {
function auth({ bappName, successLink, failLink }: {
    bappName: any;
    successLink?: any;
    failLink?: any;
}): Promise<Auth>;
function sendKLAY({ bappName, from, to, amount, successLink, failLink }: {
    bappName: any;
    from: any;
    to: any;
    amount: any;
    successLink: any;
    failLink: any;
}): Promise<any>;
function sendToken({ bappName, from, to, amount, contract, successLink, failLink }: {
    bappName: any;
    from: any;
    to: any;
    amount: any;
    contract: any;
    successLink: any;
    failLink: any;
}): Promise<any>;
function sendCard({ bappName, from, to, id, contract, successLink, failLink }: {
    bappName: any;
    from: any;
    to: any;
    id: any;
    contract: any;
    successLink: any;
    failLink: any;
}): Promise<any>;
function executeContract({ bappName, from, to, value, abi, params, successLink, failLink }: {
    bappName: any;
    from: any;
    to: any;
    value: any;
    abi: any;
    params: any;
    successLink: any;
    failLink: any;
}): Promise<any>;
}
declare function request(requestKey: any, onUnsupportedEnvironment: any): void;
export {
    getCardList,
    getResult,
    prepare,
    request,
};
