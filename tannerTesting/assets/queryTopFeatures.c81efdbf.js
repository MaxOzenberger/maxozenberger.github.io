import{p4 as p,a as l,c4 as m,eo as F,o$ as f,U as E,cZ as x,av as O}from"./index.3255d2a5.js";const c="Layer does not support extent calculation.";function g(r,e){var u,y;const o=r.geometry,t=r.toJSON(),n=t;if(l(o)&&(n.geometry=JSON.stringify(o),n.geometryType=O(o),n.inSR=o.spatialReference.wkid||JSON.stringify(o.spatialReference)),(u=t.topFilter)!=null&&u.groupByFields&&(n.topFilter.groupByFields=t.topFilter.groupByFields.join(",")),(y=t.topFilter)!=null&&y.orderByFields&&(n.topFilter.orderByFields=t.topFilter.orderByFields.join(",")),t.topFilter&&(n.topFilter=JSON.stringify(n.topFilter)),t.objectIds&&(n.objectIds=t.objectIds.join(",")),t.orderByFields&&(n.orderByFields=t.orderByFields.join(",")),t.outFields&&!((e==null?void 0:e.returnCountOnly)||(e==null?void 0:e.returnExtentOnly)||(e==null?void 0:e.returnIdsOnly))?t.outFields.includes("*")?n.outFields="*":n.outFields=t.outFields.join(","):delete n.outFields,t.outSR?n.outSR=t.outSR.wkid||JSON.stringify(t.outSR):o&&t.returnGeometry&&(n.outSR=n.inSR),t.returnGeometry&&delete t.returnGeometry,t.timeExtent){const a=t.timeExtent,{start:i,end:s}=a;i==null&&s==null||(n.time=i===s?i:`${i!=null?i:"null"},${s!=null?s:"null"}`),delete t.timeExtent}return n}async function S(r,e,o,t){const n=await d(r,e,"json",t);return p(e,o,n.data),n}async function w(r,e,o){return l(e.timeExtent)&&e.timeExtent.isEmpty?{data:{objectIds:[]}}:d(r,e,"json",o,{returnIdsOnly:!0})}async function B(r,e,o){return l(e.timeExtent)&&e.timeExtent.isEmpty?{data:{count:0,extent:null}}:d(r,e,"json",o,{returnExtentOnly:!0,returnCountOnly:!0}).then(t=>{const n=t.data;if(n.hasOwnProperty("extent"))return t;if(n.features)throw new Error(c);if(n.hasOwnProperty("count"))throw new Error(c);return t})}function R(r,e,o){return l(e.timeExtent)&&e.timeExtent.isEmpty?Promise.resolve({data:{count:0}}):d(r,e,"json",o,{returnIdsOnly:!0,returnCountOnly:!0})}function d(r,e,o,t={},n={}){const u=typeof r=="string"?m(r):r,y=e.geometry?[e.geometry]:[];return t.responseType=o==="pbf"?"array-buffer":"json",F(y,null,t).then(a=>{const i=a&&a[0];l(i)&&((e=e.clone()).geometry=i);const s=f({...u.query,f:o,...n,...g(e,n)});return E(x(u.path,"queryTopFeatures"),{...t,query:{...s,...t.query}})})}export{R as a,S as d,w as m,B as p};