import{j3 as F,j4 as h,rd as g}from"./index.3255d2a5.js";import{B as A,G as d,J as l,v,V as m,ak as c,y as i}from"./arcadeUtils.6bec0d6d.js";import"./number.d4116036.js";import"./arcadeTimeUtils.7055c5d7.js";async function o(t,r,a,n,s,e){if(n.length===1){if(l(n[0]))return c(t,n[0],i(n[1],-1));if(m(n[0]))return c(t,n[0].toArray(),i(n[1],-1))}else if(n.length===2){if(l(n[0]))return c(t,n[0],i(n[1],-1));if(m(n[0]))return c(t,n[0].toArray(),i(n[1],-1));if(d(n[0])){const u=await n[0].load(),f=await y(g.create(n[1],u.getFieldsIndex()),e,s);return n[0].calculateStatistic(t,f,i(n[2],1e3),r.abortSignal)}}else if(n.length===3&&d(n[0])){const u=await n[0].load(),f=await y(g.create(n[1],u.getFieldsIndex()),e,s);return n[0].calculateStatistic(t,f,i(n[2],1e3),r.abortSignal)}return c(t,n,-1)}async function y(t,r,a){const n=t.getVariables();if(n.length>0){const s=[];for(let u=0;u<n.length;u++){const f={name:n[u]};s.push(await r.evaluateIdentifier(a,f))}const e={};for(let u=0;u<n.length;u++)e[n[u]]=s[u];return t.parameters=e,t}return t}function b(t){t.mode==="async"&&(t.functions.stdev=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("stdev",n,s,e,r,t))},t.functions.variance=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("variance",n,s,e,r,t))},t.functions.average=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("mean",n,s,e,r,t))},t.functions.mean=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("mean",n,s,e,r,t))},t.functions.sum=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("sum",n,s,e,r,t))},t.functions.min=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("min",n,s,e,r,t))},t.functions.max=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>o("max",n,s,e,r,t))},t.functions.count=function(r,a){return t.standardFunctionAsync(r,a,(n,s,e)=>{if(A(e,1,1,r,a),d(e[0]))return e[0].count(n.abortSignal);if(l(e[0])||v(e[0]))return e[0].length;if(m(e[0]))return e[0].length();throw new F(r,h.InvalidParameter,a)})})}export{b as registerFunctions};