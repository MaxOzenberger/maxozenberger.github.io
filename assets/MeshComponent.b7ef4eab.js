import{a5 as r,a6 as a,nM as H,em as R,el as O,a7 as D,ec as C,mw as I,ek as j,bF as F,a as s,s as N,f1 as g,b5 as p}from"./index.3255d2a5.js";import{r as P}from"./imageUtils.da66a66b.js";var f;const b=new WeakMap;let U=0,h=f=class extends C{constructor(t){super(t),this.wrap="repeat"}get url(){return this._get("url")||null}set url(t){this._set("url",t),t&&this._set("data",null)}get data(){return this._get("data")||null}set data(t){this._set("data",t),t&&this._set("url",null)}writeData(t,e,o,n){if(t instanceof HTMLImageElement){const i={type:"image-element",src:I(t.src,n),crossOrigin:t.crossOrigin};e[o]=i}else if(t instanceof HTMLCanvasElement){const i=t.getContext("2d").getImageData(0,0,t.width,t.height),d={type:"canvas-element",imageData:this._encodeImageData(i)};e[o]=d}else if(t instanceof HTMLVideoElement){const i={type:"video-element",src:I(t.src,n),autoplay:t.autoplay,loop:t.loop,muted:t.muted,crossOrigin:t.crossOrigin,preload:t.preload};e[o]=i}else if(t instanceof ImageData){const i={type:"image-data",imageData:this._encodeImageData(t)};e[o]=i}}readData(t){switch(t.type){case"image-element":{const e=new Image;return e.src=t.src,e.crossOrigin=t.crossOrigin,e}case"canvas-element":{const e=this._decodeImageData(t.imageData),o=document.createElement("canvas");return o.width=e.width,o.height=e.height,o.getContext("2d").putImageData(e,0,0),o}case"image-data":return this._decodeImageData(t.imageData);case"video-element":{const e=document.createElement("video");return e.src=t.src,e.crossOrigin=t.crossOrigin,e.autoplay=t.autoplay,e.loop=t.loop,e.muted=t.muted,e.preload=t.preload,e}default:return}}get transparent(){const t=this.data,e=this.url;if(t instanceof HTMLCanvasElement)return this._imageDataContainsTransparent(t.getContext("2d").getImageData(0,0,t.width,t.height));if(t instanceof ImageData)return this._imageDataContainsTransparent(t);if(e){const o=e.substr(e.length-4,4).toLowerCase(),n=e.substr(0,15).toLocaleLowerCase();if(o===".png"||n==="data:image/png;")return!0}return!1}set transparent(t){this._overrideIfSome("transparent",t)}get contentHash(){const t=typeof this.wrap=="string"?this.wrap:typeof this.wrap=="object"?`${this.wrap.horizontal}/${this.wrap.vertical}`:"",e=(o="")=>`d:${o},t:${this.transparent},w:${t}`;return this.url!=null?e(this.url):this.data!=null?this.data instanceof HTMLImageElement||this.data instanceof HTMLVideoElement?e(this.data.src):(b.has(this.data)||b.set(this.data,++U),e(b.get(this.data))):e()}clone(){const t={url:this.url,data:this.data,wrap:this._cloneWrap()};return new f(t)}cloneWithDeduplication(t){const e=t.get(this);if(e)return e;const o=this.clone();return t.set(this,o),o}_cloneWrap(){return typeof this.wrap=="string"?this.wrap:{horizontal:this.wrap.horizontal,vertical:this.wrap.vertical}}_encodeImageData(t){let e="";for(let o=0;o<t.data.length;o++)e+=String.fromCharCode(t.data[o]);return{data:btoa(e),width:t.width,height:t.height}}_decodeImageData(t){const e=atob(t.data),o=new Uint8ClampedArray(e.length);for(let n=0;n<e.length;n++)o[n]=e.charCodeAt(n);return P(o,t.width,t.height)}_imageDataContainsTransparent(t){for(let e=3;e<t.data.length;e+=4)if(t.data[e]!==255)return!0;return!1}static from(t){return typeof t=="string"?new f({url:t}):t instanceof HTMLImageElement||t instanceof HTMLCanvasElement||t instanceof ImageData||t instanceof HTMLVideoElement?new f({data:t}):j(f,t)}};r([a({type:String,json:{write:H}})],h.prototype,"url",null),r([a({json:{write:{overridePolicy(){return{enabled:!this.url}}}}}),a()],h.prototype,"data",null),r([R("data")],h.prototype,"writeData",null),r([O("data")],h.prototype,"readData",null),r([a({type:Boolean,json:{write:{overridePolicy(){return{enabled:this._isOverridden("transparent")}}}}})],h.prototype,"transparent",null),r([a({json:{write:!0}})],h.prototype,"wrap",void 0),r([a({readOnly:!0})],h.prototype,"contentHash",null),h=f=r([D("esri.geometry.support.MeshTexture")],h);const x=h;var A;let c=A=class extends C{constructor(t){super(t),this.color=null,this.colorTexture=null,this.normalTexture=null,this.alphaMode="auto",this.alphaCutoff=.5,this.doubleSided=!0}clone(){return this.cloneWithDeduplication(null,new Map)}cloneWithDeduplication(t,e){const o=s(t)?t.get(this):null;if(o)return o;const n=new A(this.clonePropertiesWithDeduplication(e));return s(t)&&t.set(this,n),n}clonePropertiesWithDeduplication(t){return{color:s(this.color)?this.color.clone():null,colorTexture:s(this.colorTexture)?this.colorTexture.cloneWithDeduplication(t):null,normalTexture:s(this.normalTexture)?this.normalTexture.cloneWithDeduplication(t):null,alphaMode:this.alphaMode,alphaCutoff:this.alphaCutoff,doubleSided:this.doubleSided,colorTextureTransform:s(this.colorTextureTransform)?this.colorTextureTransform:null,normalTextureTransform:s(this.normalTextureTransform)?this.normalTextureTransform:null}}};r([a({type:F,json:{write:!0}})],c.prototype,"color",void 0),r([a({type:x,json:{write:!0}})],c.prototype,"colorTexture",void 0),r([a({type:x,json:{write:!0}})],c.prototype,"normalTexture",void 0),r([a({nonNullable:!0,json:{write:!0}})],c.prototype,"alphaMode",void 0),r([a({nonNullable:!0,json:{write:!0}})],c.prototype,"alphaCutoff",void 0),r([a({nonNullable:!0,json:{write:!0}})],c.prototype,"doubleSided",void 0),r([a()],c.prototype,"colorTextureTransform",void 0),r([a()],c.prototype,"normalTextureTransform",void 0),c=A=r([D("esri.geometry.support.MeshMaterial")],c);const _=c;var W;let u=W=class extends _{constructor(t){super(t),this.emissiveColor=null,this.emissiveTexture=null,this.occlusionTexture=null,this.metallic=1,this.roughness=1,this.metallicRoughnessTexture=null}clone(){return this.cloneWithDeduplication(null,new Map)}cloneWithDeduplication(t,e){const o=s(t)?t.get(this):null;if(o)return o;const n=new W(this.clonePropertiesWithDeduplication(e));return s(t)&&t.set(this,n),n}clonePropertiesWithDeduplication(t){return{...super.clonePropertiesWithDeduplication(t),emissiveColor:s(this.emissiveColor)?this.emissiveColor.clone():null,emissiveTexture:s(this.emissiveTexture)?this.emissiveTexture.cloneWithDeduplication(t):null,occlusionTexture:s(this.occlusionTexture)?this.occlusionTexture.cloneWithDeduplication(t):null,metallic:this.metallic,roughness:this.roughness,metallicRoughnessTexture:s(this.metallicRoughnessTexture)?this.metallicRoughnessTexture.cloneWithDeduplication(t):null,occlusionTextureTransform:s(this.occlusionTextureTransform)?this.occlusionTextureTransform:null,emissiveTextureTransform:s(this.emissiveTextureTransform)?this.emissiveTextureTransform:null,metallicRoughnessTextureTransform:s(this.metallicRoughnessTextureTransform)?this.metallicRoughnessTextureTransform:null}}};r([a({type:F,json:{write:!0}})],u.prototype,"emissiveColor",void 0),r([a({type:x,json:{write:!0}})],u.prototype,"emissiveTexture",void 0),r([a({type:x,json:{write:!0}})],u.prototype,"occlusionTexture",void 0),r([a({type:Number,nonNullable:!0,json:{write:!0},range:{min:0,max:1}})],u.prototype,"metallic",void 0),r([a({type:Number,nonNullable:!0,json:{write:!0},range:{min:0,max:1}})],u.prototype,"roughness",void 0),r([a({type:x,json:{write:!0}})],u.prototype,"metallicRoughnessTexture",void 0),r([a()],u.prototype,"occlusionTextureTransform",void 0),r([a()],u.prototype,"emissiveTextureTransform",void 0),r([a()],u.prototype,"metallicRoughnessTextureTransform",void 0),u=W=r([D("esri.geometry.support.MeshMaterialMetallicRoughness")],u);const V=u;var $;const S="esri.geometry.support.MeshVertexAttributes",y=N.getLogger(S);let l=$=class extends C{constructor(t){super(t),this.color=null,this.position=new Float64Array(0),this.uv=null,this.normal=null,this.tangent=null}castColor(t){return T(t,Uint8Array,[Uint8ClampedArray],{loggerTag:".color=",stride:4},y)}castPosition(t){return t&&t instanceof Float32Array&&y.warn(".position=","Setting position attribute from a Float32Array may cause precision problems. Consider storing data in a Float64Array or a regular number array"),T(t,Float64Array,[Float32Array],{loggerTag:".position=",stride:3},y)}castUv(t){return T(t,Float32Array,[Float64Array],{loggerTag:".uv=",stride:2},y)}castNormal(t){return T(t,Float32Array,[Float64Array],{loggerTag:".normal=",stride:3},y)}castTangent(t){return T(t,Float32Array,[Float64Array],{loggerTag:".tangent=",stride:4},y)}clone(){const t={position:p(this.position),uv:p(this.uv),normal:p(this.normal),tangent:p(this.tangent),color:p(this.color)};return new $(t)}clonePositional(){const t={position:p(this.position),normal:p(this.normal),tangent:p(this.tangent),uv:this.uv,color:this.color};return new $(t)}};function M(t,e,o,n){const{loggerTag:i,stride:d}=e;return t.length%d!=0?(n.error(i,`Invalid array length, expected a multiple of ${d}`),new o([])):t}function T(t,e,o,n,i){if(!t)return t;if(t instanceof e)return M(t,n,e,i);for(const d of o)if(t instanceof d)return M(new e(t),n,e,i);if(Array.isArray(t))return M(new e(t),n,e,i);{const d=o.map(E=>`'${E.name}'`);return i.error(`Failed to set property, expected one of ${d}, but got ${t.constructor.name}`),new e([])}}function v(t,e,o){e[o]=z(t)}function z(t){const e=new Array(t.length);for(let o=0;o<t.length;o++)e[o]=t[o];return e}r([a({json:{write:v}})],l.prototype,"color",void 0),r([g("color")],l.prototype,"castColor",null),r([a({nonNullable:!0,json:{write:v}})],l.prototype,"position",void 0),r([g("position")],l.prototype,"castPosition",null),r([a({json:{write:v}})],l.prototype,"uv",void 0),r([g("uv")],l.prototype,"castUv",null),r([a({json:{write:v}})],l.prototype,"normal",void 0),r([g("normal")],l.prototype,"castNormal",null),r([a({json:{write:v}})],l.prototype,"tangent",void 0),r([g("tangent")],l.prototype,"castTangent",null),l=$=r([D(S)],l);var w;const L="esri.geometry.support.MeshComponent",k=N.getLogger(L);let m=w=class extends C{static from(t){return j(w,t)}constructor(t){super(t),this.faces=null,this.material=null,this.shading="source",this.trustSourceNormals=!1}castFaces(t){return T(t,Uint32Array,[Uint16Array],{loggerTag:".faces=",stride:3},k)}castMaterial(t){return j(t&&typeof t=="object"&&("metallic"in t||"roughness"in t||"metallicRoughnessTexture"in t)?V:_,t)}clone(){return new w({faces:p(this.faces),shading:this.shading,material:p(this.material),trustSourceNormals:this.trustSourceNormals})}cloneWithDeduplication(t,e){const o={faces:p(this.faces),shading:this.shading,material:this.material?this.material.cloneWithDeduplication(t,e):null,trustSourceNormals:this.trustSourceNormals};return new w(o)}};r([a({json:{write:!0}})],m.prototype,"faces",void 0),r([g("faces")],m.prototype,"castFaces",null),r([a({type:_,json:{write:!0}})],m.prototype,"material",void 0),r([g("material")],m.prototype,"castMaterial",null),r([a({type:String,json:{write:!0}})],m.prototype,"shading",void 0),r([a({type:Boolean})],m.prototype,"trustSourceNormals",void 0),m=w=r([D(L)],m);const G=m;export{V as c,G as g,x as m,l as p};