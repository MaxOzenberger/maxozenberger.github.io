import{d3 as _,d4 as T,d5 as g,cW as A,d6 as I,t as m,aS as V,cr as G,cj as w,b1 as S,d7 as E,a5 as u,a6 as h,d8 as b,a7 as L,a8 as q,c4 as M,f as Q,d9 as Z,da as k,db as d,_ as c,a as y,g as j}from"./index.3255d2a5.js";import{n as z,s as B}from"./executeForIds.41c40739.js";async function J(r,t,e){const o=_(r);return T(o,g.from(t),{...e}).then(s=>({count:s.data.count,extent:A.fromJSON(s.data.extent)}))}function N(r,t){return t}function D(r,t,e,o){switch(e){case 0:return p(r,t+o,0);case 1:return r.originPosition==="lowerLeft"?p(r,t+o,1):X(r,t+o,1)}}function P(r,t,e,o){return e===2?p(r,t,2):D(r,t,e,o)}function U(r,t,e,o){return e===2?p(r,t,3):D(r,t,e,o)}function $(r,t,e,o){return e===3?p(r,t,3):P(r,t,e,o)}function p({translate:r,scale:t},e,o){return r[o]+e*t[o]}function X({translate:r,scale:t},e,o){return r[o]-e*t[o]}class Y{constructor(t){this._options=t,this.geometryTypes=["esriGeometryPoint","esriGeometryMultipoint","esriGeometryPolyline","esriGeometryPolygon"],this._previousCoordinate=[0,0],this._transform=null,this._applyTransform=N,this._lengths=[],this._currentLengthIndex=0,this._toAddInCurrentPath=0,this._vertexDimension=0,this._coordinateBuffer=null,this._coordinateBufferPtr=0,this._attributesConstructor=class{}}createFeatureResult(){return{fields:[],features:[]}}finishFeatureResult(t){if(this._options.applyTransform&&(t.transform=null),this._attributesConstructor=class{},this._coordinateBuffer=null,this._lengths.length=0,!t.hasZ)return;const e=I(t.geometryType,this._options.sourceSpatialReference,t.spatialReference);if(!m(e))for(const o of t.features)e(o.geometry)}createSpatialReference(){return{}}addField(t,e){const o=t.fields;V(o),o.push(e);const s=o.map(i=>i.name);this._attributesConstructor=function(){for(const i of s)this[i]=null}}addFeature(t,e){t.features.push(e)}prepareFeatures(t){switch(this._transform=t.transform,this._options.applyTransform&&t.transform&&(this._applyTransform=this._deriveApplyTransform(t)),this._vertexDimension=2,t.hasZ&&this._vertexDimension++,t.hasM&&this._vertexDimension++,t.geometryType){case"esriGeometryPoint":this.addCoordinate=(e,o,s)=>this.addCoordinatePoint(e,o,s),this.createGeometry=e=>this.createPointGeometry(e);break;case"esriGeometryPolygon":this.addCoordinate=(e,o,s)=>this._addCoordinatePolygon(e,o,s),this.createGeometry=e=>this._createPolygonGeometry(e);break;case"esriGeometryPolyline":this.addCoordinate=(e,o,s)=>this._addCoordinatePolyline(e,o,s),this.createGeometry=e=>this._createPolylineGeometry(e);break;case"esriGeometryMultipoint":this.addCoordinate=(e,o,s)=>this._addCoordinateMultipoint(e,o,s),this.createGeometry=e=>this._createMultipointGeometry(e)}}createFeature(){return this._lengths.length=0,this._currentLengthIndex=0,this._previousCoordinate[0]=0,this._previousCoordinate[1]=0,this._coordinateBuffer=null,this._coordinateBufferPtr=0,{attributes:new this._attributesConstructor}}allocateCoordinates(){}addLength(t,e,o){this._lengths.length===0&&(this._toAddInCurrentPath=e),this._lengths.push(e)}addQueryGeometry(t,e){const{queryGeometry:o,queryGeometryType:s}=e,i=G(o.clone(),o,!1,!1,this._transform),n=w(i,s,!1,!1);t.queryGeometryType=s,t.queryGeometry={...n}}createPointGeometry(t){const e={x:0,y:0,spatialReference:t.spatialReference};return t.hasZ&&(e.z=0),t.hasM&&(e.m=0),e}addCoordinatePoint(t,e,o){const s=S(this._transform,"transform");switch(e=this._applyTransform(s,e,o,0),o){case 0:t.x=e;break;case 1:t.y=e;break;case 2:"z"in t?t.z=e:t.m=e;break;case 3:t.m=e}}_transformPathLikeValue(t,e){let o=0;e<=1&&(o=this._previousCoordinate[e],this._previousCoordinate[e]+=t);const s=S(this._transform,"transform");return this._applyTransform(s,t,e,o)}_addCoordinatePolyline(t,e,o){this._dehydratedAddPointsCoordinate(t.paths,e,o)}_addCoordinatePolygon(t,e,o){this._dehydratedAddPointsCoordinate(t.rings,e,o)}_addCoordinateMultipoint(t,e,o){o===0&&t.points.push([]);const s=this._transformPathLikeValue(e,o);t.points[t.points.length-1].push(s)}_createPolygonGeometry(t){return{rings:[[]],spatialReference:t.spatialReference,hasZ:!!t.hasZ,hasM:!!t.hasM}}_createPolylineGeometry(t){return{paths:[[]],spatialReference:t.spatialReference,hasZ:!!t.hasZ,hasM:!!t.hasM}}_createMultipointGeometry(t){return{points:[],spatialReference:t.spatialReference,hasZ:!!t.hasZ,hasM:!!t.hasM}}_dehydratedAddPointsCoordinate(t,e,o){o===0&&this._toAddInCurrentPath--==0&&(t.push([]),this._toAddInCurrentPath=this._lengths[++this._currentLengthIndex]-1,this._previousCoordinate[0]=0,this._previousCoordinate[1]=0);const s=this._transformPathLikeValue(e,o),i=t[t.length-1];o===0&&(this._coordinateBufferPtr=0,this._coordinateBuffer=new Array(this._vertexDimension),i.push(this._coordinateBuffer)),this._coordinateBuffer[this._coordinateBufferPtr++]=s}_deriveApplyTransform(t){const{hasZ:e,hasM:o}=t;return e&&o?$:e?P:o?U:D}}async function K(r,t,e){const o=_(r),s={...e},i=g.from(t),n=!i.quantizationParameters,{data:l}=await E(o,i,new Y({sourceSpatialReference:i.sourceSpatialReference,applyTransform:n}),s);return l}let a=class extends q{constructor(r){super(r),this.dynamicDataSource=null,this.fieldsIndex=null,this.gdbVersion=null,this.infoFor3D=null,this.pbfSupported=!1,this.queryAttachmentsSupported=!1,this.sourceSpatialReference=null,this.url=null}get parsedUrl(){return M(this.url)}async execute(r,t){const e=await this.executeJSON(r,t);return this.featureSetFromJSON(r,e,t)}async executeJSON(r,t){var l;const e=this._normalizeQuery(r),o=((l=r.outStatistics)==null?void 0:l[0])!=null,s=Q("featurelayer-pbf-statistics"),i=!o||s;let n;if(this.pbfSupported&&i)try{n=await K(this.url,e,t)}catch(f){if(f.name!=="query:parsing-pbf")throw f;this.pbfSupported=!1}return this.pbfSupported&&i||(n=await Z(this.url,e,t)),this._normalizeFields(n.fields),n}async featureSetFromJSON(r,t,e){if(!this._queryIs3DObjectFormat(r)||m(this.infoFor3D)||!t.assetMaps||!t.features||!t.features.length)return k.fromJSON(t);const{meshFeatureSetFromJSON:o}=await d(c(()=>import("./meshFeatureSet.6c6e6563.js"),["assets/meshFeatureSet.6c6e6563.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/axisAngleDegrees.fa497b47.js","assets/quat.eb7bbc3a.js","assets/mat3f64.9180efcb.js","assets/quatf64.1dc83f1c.js","assets/MeshComponent.b7ef4eab.js","assets/imageUtils.da66a66b.js","assets/georeference.9a5b57a8.js","assets/mat4f64.9070f685.js","assets/spatialReferenceEllipsoidUtils.7f3e3256.js","assets/BufferView.32a50625.js","assets/vec33.e7ec8171.js","assets/projection.a57c6cde.js","assets/triangulationUtils.2ec0b7a6.js","assets/earcut.a219bf29.js","assets/deduplicate.97d7ef01.js","assets/Indices.27b9c798.js"]),e);return o(r,this.infoFor3D,t)}executeForCount(r,t){return z(this.url,this._normalizeQuery(r),t)}executeForExtent(r,t){return J(this.url,this._normalizeQuery(r),t)}executeForIds(r,t){return B(this.url,this._normalizeQuery(r),t)}async executeRelationshipQuery(r,t){const[{default:e},{executeRelationshipQuery:o}]=await d(Promise.all([c(()=>import("./index.3255d2a5.js").then(function(s){return s.ro}),["assets/index.3255d2a5.js","assets/index.e51050de.css"]),c(()=>import("./executeRelationshipQuery.bbba3d8b.js"),["assets/executeRelationshipQuery.bbba3d8b.js","assets/index.3255d2a5.js","assets/index.e51050de.css"])]),t);return r=e.from(r),(this.gdbVersion||this.dynamicDataSource)&&((r=r.clone()).gdbVersion=r.gdbVersion||this.gdbVersion,r.dynamicDataSource=r.dynamicDataSource||this.dynamicDataSource),o(this.url,r,t)}async executeRelationshipQueryForCount(r,t){const[{default:e},{executeRelationshipQueryForCount:o}]=await d(Promise.all([c(()=>import("./index.3255d2a5.js").then(function(s){return s.ro}),["assets/index.3255d2a5.js","assets/index.e51050de.css"]),c(()=>import("./executeRelationshipQuery.bbba3d8b.js"),["assets/executeRelationshipQuery.bbba3d8b.js","assets/index.3255d2a5.js","assets/index.e51050de.css"])]),t);return r=e.from(r),(this.gdbVersion||this.dynamicDataSource)&&((r=r.clone()).gdbVersion=r.gdbVersion||this.gdbVersion,r.dynamicDataSource=r.dynamicDataSource||this.dynamicDataSource),o(this.url,r,t)}async executeAttachmentQuery(r,t){const{executeAttachmentQuery:e,fetchAttachments:o,processAttachmentQueryResult:s}=await d(c(()=>import("./queryAttachments.15ff65c6.js"),["assets/queryAttachments.15ff65c6.js","assets/index.3255d2a5.js","assets/index.e51050de.css"]),t),i=_(this.url);return s(i,await(this.queryAttachmentsSupported?e(i,r,t):o(i,r,t)))}async executeTopFeaturesQuery(r,t){const{executeTopFeaturesQuery:e}=await d(c(()=>import("./executeTopFeaturesQuery.1bbdc0e3.js"),["assets/executeTopFeaturesQuery.1bbdc0e3.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/queryTopFeatures.c81efdbf.js"]),t);return e(this.parsedUrl,r,this.sourceSpatialReference,t)}async executeForTopIds(r,t){const{executeForTopIds:e}=await d(c(()=>import("./executeForTopIds.08c3eee5.js"),["assets/executeForTopIds.08c3eee5.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/queryTopFeatures.c81efdbf.js"]),t);return e(this.parsedUrl,r,t)}async executeForTopExtents(r,t){const{executeForTopExtents:e}=await d(c(()=>import("./executeForTopExtents.6621bd15.js"),["assets/executeForTopExtents.6621bd15.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/queryTopFeatures.c81efdbf.js"]),t);return e(this.parsedUrl,r,t)}async executeForTopCount(r,t){const{executeForTopCount:e}=await d(c(()=>import("./executeForTopCount.2f81024b.js"),["assets/executeForTopCount.2f81024b.js","assets/index.3255d2a5.js","assets/index.e51050de.css","assets/queryTopFeatures.c81efdbf.js"]),t);return e(this.parsedUrl,r,t)}_normalizeQuery(r){let t=g.from(r);if(t.sourceSpatialReference=t.sourceSpatialReference||this.sourceSpatialReference,(this.gdbVersion||this.dynamicDataSource)&&(t=t===r?t.clone():t,t.gdbVersion=r.gdbVersion||this.gdbVersion,t.dynamicDataSource=r.dynamicDataSource?b.from(r.dynamicDataSource):this.dynamicDataSource),y(this.infoFor3D)&&this._queryIs3DObjectFormat(r)){t=t===r?t.clone():t,t.formatOf3DObjects=null;for(const e of this.infoFor3D.queryFormats){if(e==="3D_glb"){t.formatOf3DObjects=e;break}e!=="3D_gltf"||t.formatOf3DObjects||(t.formatOf3DObjects=e)}if(!t.formatOf3DObjects)throw new j("query:unsupported-3d-query-formats","Could not find any supported 3D object query format. Only supported formats are 3D_glb and 3D_gltf");if(m(t.outFields)||!t.outFields.includes("*")){t=t===r?t.clone():t,m(t.outFields)&&(t.outFields=[]);const{originX:e,originY:o,originZ:s,translationX:i,translationY:n,translationZ:l,scaleX:f,scaleY:x,scaleZ:F,rotationX:C,rotationY:R,rotationZ:O,rotationDeg:v}=this.infoFor3D.transformFieldRoles;t.outFields.push(e,o,s,i,n,l,f,x,F,C,R,O,v)}}return t}_normalizeFields(r){if(y(this.fieldsIndex)&&y(r))for(const t of r){const e=this.fieldsIndex.get(t.name);e&&Object.assign(t,e.toJSON())}}_queryIs3DObjectFormat(r){return y(this.infoFor3D)&&r.returnGeometry===!0&&r.multipatchOption!=="xyFootprint"&&!r.outStatistics}};u([h({type:b})],a.prototype,"dynamicDataSource",void 0),u([h()],a.prototype,"fieldsIndex",void 0),u([h()],a.prototype,"gdbVersion",void 0),u([h()],a.prototype,"infoFor3D",void 0),u([h({readOnly:!0})],a.prototype,"parsedUrl",null),u([h()],a.prototype,"pbfSupported",void 0),u([h()],a.prototype,"queryAttachmentsSupported",void 0),u([h()],a.prototype,"sourceSpatialReference",void 0),u([h({type:String})],a.prototype,"url",void 0),a=u([L("esri.tasks.QueryTask")],a);const tt=a;export{tt as x};