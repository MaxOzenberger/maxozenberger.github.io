import{a as l,f as h}from"./index.3255d2a5.js";import{h as m}from"./PooledRBush.1ba01569.js";import{k as u}from"./georeference.9a5b57a8.js";import"./mat3f64.9180efcb.js";import"./mat4f64.9070f685.js";import"./spatialReferenceEllipsoidUtils.7f3e3256.js";import"./quat.eb7bbc3a.js";import"./quatf64.1dc83f1c.js";import"./axisAngleDegrees.fa497b47.js";import"./BufferView.32a50625.js";import"./vec33.e7ec8171.js";import"./projection.a57c6cde.js";class v{async createIndex(t,r){const e=new Array;if(!t.vertexAttributes||!t.vertexAttributes.position)return new m;const a=this._createMeshData(t),n=l(r)?await r.invoke("createIndexThread",a,{transferList:e}):this.createIndexThread(a).result;return this._createPooledRBush().fromJSON(n)}createIndexThread(t){const r=new Float64Array(t.position),e=this._createPooledRBush();return t.components?this._createIndexComponentsThread(e,r,t.components.map(a=>new Uint32Array(a))):this._createIndexAllThread(e,r)}_createIndexAllThread(t,r){const e=new Array(r.length/9);let a=0;for(let n=0;n<r.length;n+=9)e[a++]=p(r,n+0,n+3,n+6);return t.load(e),{result:t.toJSON()}}_createIndexComponentsThread(t,r,e){let a=0;for(const s of e)a+=s.length/3;const n=new Array(a);let c=0;for(const s of e)for(let i=0;i<s.length;i+=3)n[c++]=p(r,3*s[i+0],3*s[i+1],3*s[i+2]);return t.load(n),{result:t.toJSON()}}_createMeshData(t){const r=(t.transform?u({position:t.vertexAttributes.position,normal:null,tangent:null},t.transform,t.spatialReference).position:t.vertexAttributes.position).buffer;return!t.components||t.components.some(e=>!e.faces)?{position:r}:{position:r,components:t.components.map(e=>e.faces)}}_createPooledRBush(){return new m(9,h("esri-csp-restrictions")?t=>t:[".minX",".minY",".maxX",".maxY"])}}function p(o,t,r,e){return{minX:Math.min(o[t+0],o[r+0],o[e+0]),maxX:Math.max(o[t+0],o[r+0],o[e+0]),minY:Math.min(o[t+1],o[r+1],o[e+1]),maxY:Math.max(o[t+1],o[r+1],o[e+1]),p0:[o[t+0],o[t+1],o[t+2]],p1:[o[r+0],o[r+1],o[r+2]],p2:[o[e+0],o[e+1],o[e+2]]}}export{v as default};