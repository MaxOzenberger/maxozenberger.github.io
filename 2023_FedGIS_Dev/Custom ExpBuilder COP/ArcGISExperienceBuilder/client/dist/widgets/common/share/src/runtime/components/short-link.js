var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { urlUtils } from 'jimu-core';
//export default class ShortLink {
//}
export function fetchShortLink(href) {
    return __awaiter(this, void 0, void 0, function* () {
        const DEBUG = false;
        const BITLY_URL = 'https://arcg.is/prod/shorten';
        const promise = new Promise((resolve, reject) => {
            let uri = href; // location.href;
            uri = encodeURIComponent(uri); // encode long url
            uri = urlUtils.updateQueryStringParameter(BITLY_URL, 'longUrl', uri); // DO NOT encode BITLY_URL+param
            uri = urlUtils.updateQueryStringParameter(uri, 'f', 'json');
            fetch(uri).then((response) => __awaiter(this, void 0, void 0, function* () { return yield response.json(); }))
                .then(json => {
                const shrotLink = json.data.url;
                if (DEBUG) {
                    console.log('A:long_url==>' + json.data.long_url);
                    console.log('B:s_url==>' + shrotLink);
                }
                resolve(shrotLink);
            })
                .catch(error => {
                console.log('Share: short-link, Fetch Error: ', error);
                reject(href);
            });
        });
        return promise;
    });
}
//# sourceMappingURL=short-link.js.map