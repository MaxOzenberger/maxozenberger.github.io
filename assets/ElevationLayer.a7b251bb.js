import{t as _,j as c,a as d,g1 as f,g2 as w,g3 as V,g4 as D,g5 as T,g as S,aR as x,U as y,fg as $,_ as v,k as m,a5 as s,a6 as l,el as b,g6 as I,g7 as E,a7 as O,dV as L}from"./index.3255d2a5.js";import{s as N}from"./ArcGISCachedService.2a3b6bf8.js";import{h as A}from"./WorkerHandle.bbb1002a.js";import"./TilemapCache.0d26638b.js";class j{constructor(e,t,r,o){this._hasNoDataValues=null,this._minValue=null,this._maxValue=null,"pixelData"in e?(this.values=e.pixelData,this.width=e.width,this.height=e.height,this.noDataValue=e.noDataValue):(this.values=e,this.width=t,this.height=r,this.noDataValue=o)}get hasNoDataValues(){if(_(this._hasNoDataValues)){const e=this.noDataValue;this._hasNoDataValues=this.values.includes(e)}return this._hasNoDataValues}get minValue(){return this._ensureBounds(),c(this._minValue)}get maxValue(){return this._ensureBounds(),c(this._maxValue)}_ensureBounds(){if(d(this._minValue))return;const{noDataValue:e,values:t}=this;let r=1/0,o=-1/0,u=!0;for(const n of t)n===e?this._hasNoDataValues=!0:(r=n<r?n:r,o=n>o?n:o,u=!1);u?(this._minValue=0,this._maxValue=0):(this._minValue=r,this._maxValue=o>-3e38?o:0)}}class g extends A{constructor(e=null){super("LercWorker","_decode",{_decode:t=>[t.buffer]},e,{strategy:"dedicated"}),this.schedule=e,this.ref=0}decode(e,t,r){return e&&e.byteLength!==0?this.invoke({buffer:e,options:t},r):Promise.resolve(null)}release(){--this.ref<=0&&(h.forEach((e,t)=>{e===this&&h.delete(t)}),this.destroy())}}const h=new Map;function P(i=null){let e=h.get(c(i));return e||(d(i)?(e=new g(t=>i.immediate.schedule(t)),h.set(i,e)):(e=new g,h.set(null,e))),++e.ref,e}let a=class extends N(f(w(V(D(L))))){constructor(...i){super(...i),this.copyright=null,this.heightModelInfo=null,this.path=null,this.minScale=void 0,this.maxScale=void 0,this.opacity=1,this.operationalLayerType="ArcGISTiledElevationServiceLayer",this.sourceJSON=null,this.type="elevation",this.url=null,this.version=null,this._lercDecoder=P()}normalizeCtorArgs(i,e){return typeof i=="string"?{url:i,...e}:i}destroy(){this._lercDecoder=T(this._lercDecoder)}readVersion(i,e){let t=e.currentVersion;return t||(t=9.3),t}load(i){const e=d(i)?i.signal:null;return this.addResolvingPromise(this.loadFromPortal({supportedTypes:["Image Service"],supportsData:!1,validateItem:t=>{for(let r=0;r<t.typeKeywords.length;r++)if(t.typeKeywords[r].toLowerCase()==="elevation 3d layer")return!0;throw new S("portal:invalid-layer-item-type","Invalid layer item type '${type}', expected '${expectedType}' ",{type:"Image Service",expectedType:"Image Service Elevation 3D Layer"})}},i).catch(x).then(()=>this._fetchImageService(e))),Promise.resolve(this)}fetchTile(i,e,t,r){const o=d((r=r||{signal:null}).signal)?r.signal:r.signal=new AbortController().signal,u={responseType:"array-buffer",signal:o},n={noDataValue:r.noDataValue,returnFileInfo:!0};return this.load().then(()=>this._fetchTileAvailability(i,e,t,r)).then(()=>y(this.getTileUrl(i,e,t),u)).then(p=>this._lercDecoder.decode(p.data,n,o)).then(p=>new j(p))}getTileUrl(i,e,t){const r=!this.tilemapCache&&this.supportsBlankTile,o=$({...this.parsedUrl.query,blankTile:!r&&null});return`${this.parsedUrl.path}/tile/${i}/${e}/${t}${o?"?"+o:""}`}async queryElevation(i,e){const{ElevationQuery:t}=await v(()=>import("./ElevationQuery.d868fce7.js"),["assets/ElevationQuery.d868fce7.js","assets/index.3255d2a5.js","assets/index.e51050de.css"]);return m(e),new t().query(this,i,e)}async createElevationSampler(i,e){const{ElevationQuery:t}=await v(()=>import("./ElevationQuery.d868fce7.js"),["assets/ElevationQuery.d868fce7.js","assets/index.3255d2a5.js","assets/index.e51050de.css"]);return m(e),new t().createSampler(this,i,e)}_fetchTileAvailability(i,e,t,r){return this.tilemapCache?this.tilemapCache.fetchAvailability(i,e,t,r):Promise.resolve("unknown")}async _fetchImageService(i){var r;if(this.sourceJSON)return this.sourceJSON;const e={query:{f:"json",...this.parsedUrl.query},responseType:"json",signal:i},t=await y(this.parsedUrl.path,e);t.ssl&&(this.url=(r=this.url)==null?void 0:r.replace(/^http:/i,"https:")),this.sourceJSON=t.data,this.read(t.data,{origin:"service",url:this.parsedUrl})}get hasOverriddenFetchTile(){return!this.fetchTile.__isDefault__}};s([l({json:{read:{source:"copyrightText"}}})],a.prototype,"copyright",void 0),s([l({readOnly:!0,type:I})],a.prototype,"heightModelInfo",void 0),s([l({type:String,json:{origins:{"web-scene":{read:!0,write:!0}},read:!1}})],a.prototype,"path",void 0),s([l({type:["show","hide"]})],a.prototype,"listMode",void 0),s([l({json:{read:!1,write:!1,origins:{service:{read:!1,write:!1},"portal-item":{read:!1,write:!1},"web-document":{read:!1,write:!1}}},readOnly:!0})],a.prototype,"minScale",void 0),s([l({json:{read:!1,write:!1,origins:{service:{read:!1,write:!1},"portal-item":{read:!1,write:!1},"web-document":{read:!1,write:!1}}},readOnly:!0})],a.prototype,"maxScale",void 0),s([l({json:{read:!1,write:!1,origins:{"web-document":{read:!1,write:!1}}}})],a.prototype,"opacity",void 0),s([l({type:["ArcGISTiledElevationServiceLayer"]})],a.prototype,"operationalLayerType",void 0),s([l()],a.prototype,"sourceJSON",void 0),s([l({json:{read:!1},value:"elevation",readOnly:!0})],a.prototype,"type",void 0),s([l(E)],a.prototype,"url",void 0),s([l()],a.prototype,"version",void 0),s([b("version",["currentVersion"])],a.prototype,"readVersion",null),a=s([O("esri.layers.ElevationLayer")],a),a.prototype.fetchTile.__isDefault__=!0;const J=a;export{J as default};