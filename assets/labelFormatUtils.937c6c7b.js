import{s as g,r8 as m,_ as h,r9 as w,t as v,g as d,ra as b,i4 as x,ky as _,rb as E,rc as F}from"./index.3255d2a5.js";const p=g.getLogger("esri.layers.support.labelFormatUtils"),y={type:"simple",evaluate:()=>null},V={getAttribute:(a,n)=>a.field(n)};async function $(a,n,e){if(!a||!a.symbol||!n)return y;const u=a.where,i=m(a),o=u?await h(()=>import("./index.3255d2a5.js").then(function(r){return r.rt}),["assets/index.3255d2a5.js","assets/index.e51050de.css"]):null;let l;if(i.type==="arcade"){const r=await w(i.expression,e,n);if(v(r))return y;l={type:"arcade",evaluate(s){try{const t=r.evaluate({$feature:"attributes"in s?r.repurposeFeature(s):s});if(t!=null)return t.toString()}catch{p.error(new d("arcade-expression-error","Encountered an error when evaluating label expression for feature",{feature:s,expression:i}))}return null},needsHydrationToEvaluate:()=>E(i.expression)==null}}else l={type:"simple",evaluate:r=>i.expression.replace(/{[^}]*}/g,s=>{const t=s.slice(1,-1),c=n.get(t);if(!c)return s;let f=null;return"attributes"in r?r&&r.attributes&&(f=r.attributes[c.name]):f=r.field(c.name),f==null?"":L(f,c)})};if(u){let r;try{r=o.WhereClause.create(u,n)}catch(t){return p.error(new d("bad-where-clause","Encountered an error when evaluating where clause, ignoring",{where:u,error:t})),y}const s=l.evaluate;l.evaluate=t=>{const c="attributes"in t?void 0:V;try{if(r.testFeature(t,c))return s(t)}catch(f){p.error(new d("bad-where-clause","Encountered an error when evaluating where clause for feature",{where:u,feature:t,error:f}))}return null}}return l}function L(a,n){if(a==null)return"";const e=n.domain;if(e){if(e.type==="codedValue"||e.type==="coded-value"){const i=a;for(const o of e.codedValues)if(o.code===i)return o.name}else if(e.type==="range"){const i=+a,o="range"in e?e.range[0]:e.minValue,l="range"in e?e.range[1]:e.maxValue;if(o<=i&&i<=l)return e.name}}let u=a;return n.type==="date"||n.type==="esriFieldTypeDate"?u=b(u,F("short-date")):x(n)&&(u=_(+u)),u||""}export{$ as createLabelFunction,L as formatField};