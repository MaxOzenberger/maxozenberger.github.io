"use strict";var WidgetInfoType,__assign=this&&this.__assign||function(){return(__assign=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e}).apply(this,arguments)},__awaiter=this&&this.__awaiter||function(e,s,l,u){return new(l=l||Promise)(function(n,t){function i(e){try{o(u.next(e))}catch(e){t(e)}}function r(e){try{o(u.throw(e))}catch(e){t(e)}}function o(e){var t;e.done?n(e.value):((t=e.value)instanceof l?t:new l(function(e){e(t)})).then(i,r)}o((u=u.apply(e,s||[])).next())})},__generator=this&&this.__generator||function(i,r){var o,s,l,u={label:0,sent:function(){if(1&l[0])throw l[1];return l[1]},trys:[],ops:[]},e={next:t(0),throw:t(1),return:t(2)};return"function"==typeof Symbol&&(e[Symbol.iterator]=function(){return this}),e;function t(n){return function(e){var t=[n,e];if(o)throw new TypeError("Generator is already executing.");for(;u;)try{if(o=1,s&&(l=2&t[0]?s.return:t[0]?s.throw||((l=s.return)&&l.call(s),0):s.next)&&!(l=l.call(s,t[1])).done)return l;switch(s=0,(t=l?[2&t[0],l.value]:t)[0]){case 0:case 1:l=t;break;case 4:return u.label++,{value:t[1],done:!1};case 5:u.label++,s=t[1],t=[0];continue;case 7:t=u.ops.pop(),u.trys.pop();continue;default:if(!(l=0<(l=u.trys).length&&l[l.length-1])&&(6===t[0]||2===t[0])){u=0;continue}if(3===t[0]&&(!l||t[1]>l[0]&&t[1]<l[3])){u.label=t[1];break}if(6===t[0]&&u.label<l[1]){u.label=l[1],l=t;break}if(l&&u.label<l[2]){u.label=l[2],u.ops.push(t);break}l[2]&&u.ops.pop(),u.trys.pop();continue}t=r.call(i,u)}catch(e){t=[6,e],s=0}finally{o=l=0}if(5&t[0])throw t[1];return{value:t[0]?t[1]:void 0,done:!0}}}},fs=(Object.defineProperty(exports,"__esModule",{value:!0}),exports.unZipToFolder=exports.isProtocolRelative=exports.removeProtocol=exports.importApp=exports.checkItemVersion=void 0,require("fs-extra")),semver=require("semver"),fetch=require("cross-fetch"),path=require("path"),utils_1=(require("../../../global"),require("./utils")),JSZip=(require("isomorphic-form-data"),global.fetch=fetch,require("jszip")),multer=require("@koa/multer"),importAppMulter=getImportAppMulter();function checkItemVersion(u,i){return __awaiter(this,void 0,void 0,function(){var l,t,n=this;return __generator(this,function(e){switch(e.label){case 0:l={error:{message:"",errorCode:null,success:!1,checkWidgetVersionResult:[],appVersion:null,errWidgetMsg:null}},e.label=1;case 1:return e.trys.push([1,3,,4]),[4,importAppMulter.single("appZip")(u,i).then(function(e){return __awaiter(n,void 0,void 0,function(){var t,n,i,r,o,s;return __generator(this,function(e){switch(e.label){case 0:return u.type="json",t=u.request.body||{},o=(null==(o=u.request.file)?void 0:o.path)||"",s=(null==(s=null==o?void 0:o.split("apps\\")[1])?void 0:s.split("\\importAppZip")[0])||(null==(s=null==o?void 0:o.split("apps/")[1])?void 0:s.split("/importAppZip")[0]),s="".concat(utils_1.tempFolderPath,"/").concat(s),n=path.join(s,"/resources/config/config.json"),[4,checkIsAppValid(o)];case 1:return e.sent()||!1?[4,(i=!1,exports.unZipToFolder)(o,s)]:(l.error.message="Invalid App",l.error.errorCode="001",fs.removeSync(s),[2,(0,utils_1.requestException)(l,u)]);case 2:return e.sent(),checkAppVersion(n,null==t?void 0:t.currentVersion)||(i=!0),0<(null==(r=checkWidgetVersion(n))?void 0:r.length)&&(i=!0),fs.removeSync(s),r={isHeightVersionApp:i},(0,utils_1.commonResponse)(u,r),[2]}})})}).catch(function(e){l.error.message=e,u.body=l})];case 2:return e.sent(),[3,4];case 3:return t=e.sent(),l.error.message=t,(0,utils_1.writeResponseLog)(t,!0),u.body=l,[3,4];case 4:return[2]}})})}function importApp(c,i){return __awaiter(this,void 0,void 0,function(){var a,t,n=this;return __generator(this,function(e){switch(e.label){case 0:a={error:{message:"",errorCode:null,success:!1,checkWidgetVersionResult:[],appVersion:null,errWidgetMsg:null}},e.label=1;case 1:return e.trys.push([1,3,,4]),[4,importAppMulter.single("appZip")(c,i).then(function(e){return __awaiter(n,void 0,void 0,function(){var t,n,i,r,o,s,l,u;return __generator(this,function(e){switch(e.label){case 0:return c.type="json",t=c.request.body||{},l=(null==(l=c.request.file)?void 0:l.path)||"",u=(null==(u=null==l?void 0:l.split("apps\\")[1])?void 0:u.split("\\importAppZip")[0])||(null==(u=null==l?void 0:l.split("apps/")[1])?void 0:u.split("/importAppZip")[0]),n="".concat(utils_1.appFolderPath,"/").concat(u),i=path.join(n,"/resources/config/config.json"),[4,checkIsAppValid(l)];case 1:return e.sent()||!1?[4,(0,exports.unZipToFolder)(l,n)]:(a.error.message="Invalid App",a.error.errorCode="001",fs.removeSync(n),[2,(0,utils_1.requestException)(a,c)]);case 2:return(e.sent(),r=getZipAppversion(i),checkIsSamePortal(i,t.portalUrl))?checkIsSameType(n,t.type)?[4,copyCustomWidget(i,n)]:(a.error.message="Web Experience"===t.type?"Failed to import app. This is an app template. Please switch to the Templates tab and try again.":"Failed to import template. This is an app. Please switch to the Apps tab and try again.",a.error.errorCode="Web Experience"===t.type?"004":"006",a.error.appVersion=r,fs.removeSync(n),[2,(0,utils_1.requestException)(a,c)]):(a.error.message="Failed to import the app. This app can only be imported by users of portal: ".concat(t.portalUrl," "),a.error.errorCode="003",a.error.appVersion=r,fs.removeSync(n),[2,(0,utils_1.requestException)(a,c)]);case 3:return e.sent(),fs.removeSync(path.join(n,"/importAppZip")),updateNewAppConfig(i,t.portalUrl),null!=t&&t.typeKeywords?((o=Array.isArray(t.typeKeywords)?t.typeKeywords:t.typeKeywords.split(",")).push("version: ".concat(r)),t.typeKeywords=o):delete t.typeKeywords,delete t.snippet,delete t.thumbnail,delete t.currentVersion,fs.ensureDirSync(utils_1.appFolderPath),o=Date.now(),t.id=u,t.created=o,t.modified=o,t.owner=t.username,t.thumbnail=getThumbnailUrl(n),delete(s=__assign(__assign({},utils_1.infoJson),t)).text,s=(0,utils_1.deepClone)(s),fs.ensureDirSync(n),s=JSON.stringify(s,null,2),fs.writeFileSync("".concat(n,"/info.json"),s),s={__not_publish:!0},s=JSON.stringify(s),fs.writeFileSync("".concat(n,"/config.json"),s),s={folder:"apps/".concat(u),id:u,success:!0},(0,utils_1.commonResponse)(c,s),[2]}})})}).catch(function(e){a.error.message=e,c.body=a})];case 2:return e.sent(),[3,4];case 3:return t=e.sent(),a.error.message=t,(0,utils_1.writeResponseLog)(t,!0),c.body=a,[3,4];case 4:return[2]}})})}function getThumbnailUrl(e){var e=path.join(e,"config.json");if(!fs.existsSync(e))return null;e=JSON.parse(fs.readFileSync(e,"utf8"));return(null==(e=null==e?void 0:e.attributes)?void 0:e.thumbnail)||null}function checkAppVersion(e,t){if(!fs.existsSync(e))return!1;e=getZipAppversion(e);return!(!e||!t)&&!semver.gt(e,t)}function getZipAppversion(e){if(!fs.existsSync(e))return null;e=JSON.parse(fs.readFileSync(e,"utf8"));return null==e?void 0:e.exbVersion}function updateNewAppConfig(e,t){if(!fs.existsSync(e))return null;var n=JSON.parse(fs.readFileSync(e,"utf8"))||{},n=(delete n.appProxies,delete n.historyLabels,JSON.stringify(n,null,2));fs.writeFileSync(e,n)}function checkIsSamePortal(e,t){if(!fs.existsSync(e))return null;var e=JSON.parse(fs.readFileSync(e,"utf8"))||{},e=(null==(e=null===e?void 0:e.attributes)?void 0:e.portalUrl)||"";if(!e)return!1;e=(0,exports.removeProtocol)(e);return(0,exports.removeProtocol)(t)==e}function checkIsSameType(e,t){var e=path.join(e,"config.json");if(!fs.existsSync(e))return!1;e=JSON.parse(fs.readFileSync(e,"utf8"))||{},e=(null==(e=null===e?void 0:e.attributes)?void 0:e.type)||"";return!e||(null==e?void 0:e.trim())===(null==t?void 0:t.trim())}!function(e){e.ExistedInfo="ExistedInfo",e.Info="Info"}(WidgetInfoType=WidgetInfoType||{}),exports.checkItemVersion=checkItemVersion,exports.importApp=importApp;var removeProtocol=function(e,t){void 0===t&&(t=!1);return(0,exports.isProtocolRelative)(e)?e.slice(2):(e=e.replace(/^\s*[a-z][a-z0-9-+.]*:(?![0-9])/i,""),t&&1<e.length&&"/"===e[0]&&"/"===e[1]?e.slice(2):e)},isProtocolRelative=(exports.removeProtocol=removeProtocol,function(e){return null!=e&&void 0!==e&&"/"===e[0]&&"/"===e[1]});function getImportAppMulter(){var e=multer.diskStorage({destination:function(e,t,n){try{Promise.resolve(!0).then(function(){fs.ensureDirSync(utils_1.appFolderPath);var e=fs.readdirSync(utils_1.appFolderPath),e=(0,utils_1.getFolderIndex)(e,0)+"",e="".concat(utils_1.appFolderPath,"/").concat(e),e=(fs.mkdirSync(e),"".concat(e,"/importAppZip"));fs.emptyDirSync(e),n(null,e)})}catch(e){console.log(e)}},filename:function(e,t,n){var t=t.originalname.split("."),i=t[t.length-1];n(null,"appZip."+(i=1==t.length?"zip":i))}});return multer({storage:e})}function checkIsAppValid(i){return __awaiter(this,void 0,void 0,function(){var t,n;return __generator(this,function(e){switch(e.label){case 0:return[4,verifyUploadedAppZip(i)];case 1:return t=e.sent()||[],n=!0,null!=t&&t.forEach(function(e){n=n&&e}),[2,n]}})})}function verifyUploadedAppZip(e){var t=[];return t.push(checkFileExistInZip(e,"config.json")),t.push(checkFolderExistInZip(e,"jimu-ui")),t.push(checkFolderExistInZip(e,"jimu-theme")),t.push(checkFolderExistInZip(e,"jimu-layouts")),t.push(checkFolderExistInZip(e,"jimu-core")),t.push(checkFolderExistInZip(e,"jimu-for-builder")),t.push(checkFolderExistInZip(e,"widgets")),t.push(checkFolderExistInZip(e,"config")),Promise.all(t)}function checkFileExistInZip(t,n){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){return[2,JSZip.loadAsync(fs.readFileSync(t)).then(function(e){e=e.file(new RegExp(n));return!!(e&&e.length&&0<e.length)})]})})}function checkFolderExistInZip(t,n){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){return[2,JSZip.loadAsync(fs.readFileSync(t)).then(function(e){e=e.folder(new RegExp(n));return!!(e&&e.length&&0<e.length)})]})})}exports.isProtocolRelative=isProtocolRelative;var unZipToFolder=function(t,i){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(e){return[2,(new JSZip).loadAsync(fs.readFileSync(t)).then(function(t){var n=[];return fs.ensureDirSync(i),Object.keys(t.files).forEach(function(e){-1<(null==e?void 0:e.indexOf("/resources"))?n.push(createFileOfResources(e,i,t)):-1<(null==e?void 0:e.indexOf("/config.json"))&&3===(null==e?void 0:e.split("/").length)?n.push(createFileOfResources(e,i,t,!0)):-1<(null==e?void 0:e.indexOf("/widgets"))?n.push(createWidgetsFile(e,i,t)):-1<(null==e?void 0:e.indexOf("/thumbnail/"))&&n.push(createThumbnailFile(e,i,t))}),Promise.all(n)})]})})};function createFileOfResources(e,t,n,i){i=(i=void 0===i?!1:i)?"config.json":"resources/".concat(null==e?void 0:e.split("/resources/")[1]);return createFile(e,path.join(t,i),n)}function createWidgetsFile(e,t,n){t=path.join(t,"importAppZip/widgets/".concat(null==e?void 0:e.split("/widgets/")[1]));return createFile(e,t,n)}function createThumbnailFile(e,t,n){t=path.join(t,"/thumbnail/".concat(null==e?void 0:e.split("/thumbnail/")[1]));return createFile(e,t,n)}function createFile(i,r,o){return __awaiter(this,void 0,void 0,function(){var t,n;return __generator(this,function(e){return t=o.file(i),n=normalizeZipPath(r),null==t||!0===t.dir?(fs.ensureDirSync(n),[2,Promise.resolve()]):[2,t.async("nodebuffer").then(function(e){return fs.writeFileSync(n,e)})]})})}function normalizeZipPath(e){return e=(e=path.normalize(e)).replace(/\\/g,"/")}function checkWidgetVersion(e){var i,t=path.join(utils_1.CLIENT_PATH,utils_1.DIST_FOLDER),r=[],o=JSON.parse(fs.readFileSync(e,"utf8")),s=getAllWidgetsInfo(t,WidgetInfoType.Info)||[],e=o.widgets||{};if(o.widgets)for(var n in e)!function(e){var t=null==(i=o.widgets)?void 0:i[e],e=null==(i=s.filter(function(e){return e.uri===t.uri}))?void 0:i[0],n=null==t?void 0:t.version;!e||0===(null==s?void 0:s.length)||(e=null==(i=null==e?void 0:e.manifest)?void 0:i.version,!semver.gt(n,e))||r.push({widgetLabel:null==t?void 0:t.lable,widgetVersionInZip:n})}(n);return r}function copyCustomWidget(n,l){return __awaiter(this,void 0,void 0,function(){var i,t,r,o,s;return __generator(this,function(e){switch(e.label){case 0:return i=path.join(utils_1.CLIENT_PATH,utils_1.DIST_FOLDER),t=JSON.parse(fs.readFileSync(n,"utf8")),t=(0,utils_1.getWidgetsUriFromAppConfig)(t),t=(null==t?void 0:t.customWidgetsUri)||[],r=getAllWidgetsInfo(i,WidgetInfoType.Info)||getAllWidgetsInfo(i,WidgetInfoType.ExistedInfo)||[],o=getAllWidgetsInfo(i,WidgetInfoType.ExistedInfo)||getAllWidgetsInfo(i,WidgetInfoType.Info)||[],s=getAllWidgetsInfo("".concat(l,"/importAppZip"),WidgetInfoType.Info)||[],[4,Promise.all(t.map(function(t){if(0<(null==(n=null==r?void 0:r.filter(function(e){return(null==e?void 0:e.uri)===t}))?void 0:n.length)||0<(null==(n=null==o?void 0:o.filter(function(e){return(null==e?void 0:e.uri)===t}))?void 0:n.length))return Promise.resolve();var e,n=null==(n=null==s?void 0:s.filter(function(e){return(null==e?void 0:e.uri)===t}))?void 0:n[0];return n&&((e=getCustomWidgetInfoIndex())||0===e?r.splice(e,0,n):r.push(n),e=JSON.stringify(r,null,2),fs.writeFileSync(path.join(i,utils_1.WIDGET_INFO_PATH),e),fs.existsSync(path.join(i,utils_1.WIDGET_EXISTED_INFO_PATH))&&(o.push(n),e=JSON.stringify(o,null,2),fs.writeFileSync(path.join(i,utils_1.WIDGET_EXISTED_INFO_PATH),e))),fs.existsSync(path.join(i,t))?void 0:fs.copy(path.join("".concat(l,"/importAppZip"),t),path.join(i,t))}))];case 1:return e.sent(),[2]}})})}function getCustomWidgetInfoIndex(){var e=path.join(utils_1.CLIENT_PATH,utils_1.DIST_FOLDER),n=getLastExistedWidgetUri(),e=getAllWidgetsInfo(e,WidgetInfoType.Info)||[],i=null;return e.forEach(function(e,t){e.uri===n&&(i=t+1)}),i}function getLastExistedWidgetUri(){var e=path.join(utils_1.CLIENT_PATH,utils_1.DIST_FOLDER);return fs.existsSync(path.join(e,utils_1.WIDGET_EXISTED_INFO_PATH))?null==(e=null==(e=getAllWidgetsInfo(e,WidgetInfoType.ExistedInfo))?void 0:e[(null==e?void 0:e.length)-1])?void 0:e.uri:null}function getAllWidgetsInfo(e,t){return(t=(t=void 0===t?WidgetInfoType.ExistedInfo:t)===WidgetInfoType.Info?fs.existsSync(path.join(e,utils_1.WIDGET_INFO_PATH))?path.join(e,utils_1.WIDGET_INFO_PATH):null:fs.existsSync(path.join(e,utils_1.WIDGET_EXISTED_INFO_PATH))?path.join(e,utils_1.WIDGET_EXISTED_INFO_PATH):null)?JSON.parse(fs.readFileSync(t,"utf8")):null}exports.unZipToFolder=unZipToFolder;