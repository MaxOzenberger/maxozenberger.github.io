import{am as Z,J as L,K as D,af as ee,a as b,C as te,s as N,g as re,h as se,r as H,i as x,t as _,Y as ie,aa as ae,m as oe,aI as ne,cv as le,cw as he,M as me,bf as ce,u as de,w as pe,as as ue,fc as fe,dS as ye,eh as z,e8 as _e,e9 as ve,fn as ge,W as we,cW as Re,es as Ee,a5 as T,a6 as P,a7 as Me,at as xe,fo as Te}from"./index.3255d2a5.js";import{j as be,u as B}from"./perspectiveUtils.d572d5f6.js";import"./Rasterizer.f4189955.js";import"./EffectView.ab0cb7da.js";import{r as Ce}from"./Container.f0dd2697.js";import"./BufferPool.2da87f69.js";import{T as Se}from"./color.18cd4954.js";import{c as Ve,w as $e}from"./WGLContainer.53e4a52c.js";import"./vec4f32.c3d64d30.js";import{P as Ae,G as Ge,L as qe,D as De,F as Q}from"./enums.3c1fa5b5.js";import{E as Pe}from"./Texture.d66dc1cb.js";import"./ProgramTemplate.058b26d9.js";import"./MaterialKey.3d16bafa.js";import"./utils.e5643e7e.js";import{E as k,f as Ie}from"./VertexArrayObject.ad007c8f.js";import"./number.dcd3e86c.js";import"./StyleDefinition.dc47b5d4.js";import"./enums.7f1ae3cd.js";import"./MagnifierPrograms.4bede4dd.js";import"./OrderIndependentTransparency.43c6e481.js";import"./floatRGBA.7b501bd7.js";import"./webgl-debug.bb689b12.js";import"./GraphicsView2D.9477d269.js";import"./AttributeStoreView.a805ba6a.js";import"./earcut.a219bf29.js";import{r as Ue}from"./vec3f32.4d8dc001.js";import{e as Oe}from"./mat3f64.9180efcb.js";import{f as We}from"./LayerView2D.faad288b.js";import{u as je}from"./LayerView.cc5af741.js";import"./normalizeUtilsSync.95f750ca.js";import"./_commonjsHelpers.4421ccc9.js";import"./cimAnalyzer.2e975d1d.js";import"./fontUtils.a84c0faf.js";import"./BidiEngine.f5b8c89f.js";import"./GeometryUtils.6fd53e6d.js";import"./enums.9a5c29c3.js";import"./alignmentUtils.ba8835fe.js";import"./definitions.1d569ae6.js";import"./Rect.e8e4d18d.js";import"./callExpressionWithFeature.565c4416.js";import"./rasterizingUtils.35b0a2ca.js";import"./VertexElementDescriptor.5da9dfe9.js";import"./config.86ceb802.js";import"./GeometryUtils.ccd3b111.js";import"./imageutils.2b310abc.js";import"./Matcher.19c09547.js";import"./visualVariablesUtils.313d5012.js";import"./visualVariablesUtils.fc657d78.js";import"./tileUtils.dbdde791.js";import"./TurboLine.cfd1c2a2.js";import"./ExpandedCIM.31fce9f6.js";import"./CircularArray.e19cffa8.js";import"./ComputedAttributeStorage.6996e7f3.js";import"./arcadeTimeUtils.7055c5d7.js";import"./centroid.193a93e9.js";import"./basicInterfaces.f8f3b23b.js";import"./schemaUtils.1fd0b466.js";import"./createSymbolSchema.0873edf1.js";import"./util.c874f147.js";import"./TiledDisplayObject.2607ae61.js";const v=Oe();class Le extends Ce{constructor(e){super(),this.elementView=e,this.isWrapAround=!1,this.perspectiveTransform=Z(),this._vertices=new Float32Array(20),this._handles=[],this._handles.push(L(()=>this.elementView.element.opacity,t=>this.opacity=t,D),L(()=>[this.elementView.coords],()=>{this.requestRender()},D),ee(()=>this.elementView.element.loaded,()=>{const t=this.elementView.element;this.ready(),t.type==="video"&&b(t.content)&&this._handles.push(te(t.content,"play",()=>this.requestRender()))},D)),e.element.load().catch(t=>{N.getLogger("esri.views.2d.layers.MediaLayerView2D").error(new re("element-load-error","Element cannot be displayed",{element:e,error:t}))})}destroy(){this._handles.forEach(e=>e.remove()),this.texture=se(this.texture)}get dvsMat3(){return this.parent.dvsMat3}beforeRender(e){const{context:t}=e,s=this.elementView.element.content;if(b(s)){const i=s instanceof HTMLImageElement,a=s instanceof HTMLVideoElement,n=i?s.naturalWidth:a?s.videoWidth:s.width,o=i?s.naturalHeight:a?s.videoHeight:s.height;this._updatePerspectiveTransform(n,o),this.texture?a&&!s.paused&&(this.texture.setData(s),this.requestRender(),(t.type===H.WEBGL2||x(n)&&x(o))&&this.texture.generateMipmap()):(this.texture=new Pe(t,{pixelFormat:Ae.RGBA,dataType:Ge.UNSIGNED_BYTE,samplingMode:qe.LINEAR,wrapMode:De.CLAMP_TO_EDGE,width:n,height:o,preMultiplyAlpha:!0},s),(t.type===H.WEBGL2||x(n)&&x(o))&&this.texture.generateMipmap(),a&&!s.paused&&this.requestRender())}super.beforeRender(e)}_createTransforms(){return null}updateDrawCoords(e,t){const s=this.elementView.coords;if(_(s))return;const[i,a,n,o]=s.rings[0],d=this._vertices,{x:l,y:h}=e,p=t!==0;p?d.set([a[0]-l,a[1]-h,i[0]-l,i[1]-h,n[0]-l,n[1]-h,o[0]-l,o[1]-h,o[0]-l,o[1]-h,a[0]+t-l,a[1]-h,a[0]+t-l,a[1]-h,i[0]+t-l,i[1]-h,n[0]+t-l,n[1]-h,o[0]+t-l,o[1]-h]):d.set([a[0]-l,a[1]-h,i[0]-l,i[1]-h,n[0]-l,n[1]-h,o[0]-l,o[1]-h]),this.isWrapAround=p}getVAO(e,t,s){if(_(this.elementView.coords))return null;const i=this._vertices;if(this._vao)this._geometryVbo.setData(i);else{this._geometryVbo=k.createVertex(e,Q.DYNAMIC_DRAW,i);const a=k.createVertex(e,Q.STATIC_DRAW,new Uint16Array([0,0,0,1,1,0,1,1,1,1,0,0,0,0,0,1,1,0,1,1]));this._vao=new Ie(e,s,t,{geometry:this._geometryVbo,tex:a})}return this._vao}_updatePerspectiveTransform(e,t){const s=this._vertices;be(v,[0,0,e,0,0,t,e,t],[s[0],s[1],s[4],s[5],s[2],s[3],s[6],s[7]]),ie(this.perspectiveTransform,v[6]/v[8]*e,v[7]/v[8]*t)}}class He extends Ve{constructor(){super(...arguments),this._localOrigin=ae(0,0),this._viewStateId=-1,this._dvsMat3=oe(),this.requiresDedicatedFBO=!1}get dvsMat3(){return this._dvsMat3}beforeRender(e){this._updateMatrices(e),this._updateOverlays(e,this.children);for(const t of this.children)t.beforeRender(e)}prepareRenderPasses(e){const t=e.registerRenderPass({name:"overlay",brushes:[$e.overlay],target:()=>this.children,drawPhase:Se.MAP});return[...super.prepareRenderPasses(e),t]}_updateMatrices(e){const{state:t}=e,{id:s,size:i,pixelRatio:a,resolution:n,rotation:o,viewpoint:d,displayMat3:l}=t;if(this._viewStateId===s)return;const h=Math.PI/180*o,p=a*i[0],f=a*i[1],{x:C,y:w}=d.targetGeometry,S=ne(C,t.spatialReference);this._localOrigin.x=S,this._localOrigin.y=w;const V=n*p,R=n*f,m=le(this._dvsMat3);he(m,m,l),me(m,m,ce(p/2,f/2)),de(m,m,Ue(p/V,-f/R,1)),pe(m,m,-h),this._viewStateId=s}_updateOverlays(e,t){const{state:s}=e,{rotation:i,spatialReference:a,worldScreenWidth:n,size:o,viewpoint:d}=s,l=this._localOrigin;let h=0;const p=ue(a);if(p&&a.isWrappable){const f=o[0],C=o[1],w=180/Math.PI*i,S=Math.abs(Math.cos(w)),V=Math.abs(Math.sin(w)),R=Math.round(f*S+C*V),[m,$]=p.valid,u=fe(a),{x:I,y:Y}=d.targetGeometry,J=[I,Y],A=[0,0];s.toScreen(A,J);const E=[0,0];let G;G=R>n?.5*n:.5*R;const U=Math.floor((I+.5*u)/u),K=m+U*u,X=$+U*u,q=[A[0]+G,0];s.toMap(E,q),E[0]>X&&(h=u),q[0]=A[0]-G,s.toMap(E,q),E[0]<K&&(h=-u);for(const M of t){const O=M.elementView.bounds;if(_(O))continue;const[W,,j]=O;W<m&&j>m?M.updateDrawCoords(l,u):j>$&&W<$?M.updateDrawCoords(l,-u):M.updateDrawCoords(l,h)}}else for(const f of t)f.updateDrawCoords(l,h)}}let y=class extends We(je){constructor(){super(...arguments),this._overlayContainer=null,this._fetchQueue=null,this._tileStrategy=null,this._elementReferences=new Map,this._debugGraphicsView=null,this.layer=null,this.elements=new ye}attach(){this.addAttachHandles([z(()=>this.layer.effectiveSource,"refresh",()=>{for(const r of this._tileStrategy.tiles)this._updateTile(r);this.requestUpdate()}),z(()=>this.layer.effectiveSource,"change",({element:r})=>this._elementUpdateHandler(r))]),this._overlayContainer=new He,this.container.addChild(this._overlayContainer),this._fetchQueue=new _e({tileInfoView:this.view.featuresTilingScheme,concurrency:10,process:(r,e)=>this._queryElements(r,e)}),this._tileStrategy=new ve({cachePolicy:"purge",resampling:!0,acquireTile:r=>this._acquireTile(r),releaseTile:r=>this._releaseTile(r),tileInfoView:this.view.featuresTilingScheme}),this.requestUpdate()}detach(){var r;this.elements.removeAll(),this._tileStrategy.destroy(),this._fetchQueue.destroy(),this._overlayContainer.removeAllChildren(),this.container.removeAllChildren(),this._elementReferences.clear(),(r=this._debugGraphicsView)==null||r.destroy()}supportsSpatialReference(r){return!0}moveStart(){this.requestUpdate()}viewChange(){this.requestUpdate()}moveEnd(){this.requestUpdate()}update(r){var e;this._tileStrategy.update(r),(e=this._debugGraphicsView)==null||e.update(r)}async hitTest(r,e){const t=[],s=r.normalize(),i=[s.x,s.y];for(const{projectedElement:{normalizedCoords:a,element:n}}of this._elementReferences.values())b(a)&&ge(a.rings,i)&&t.push({type:"media",element:n,layer:this.layer,mapPoint:r});return t.reverse()}canResume(){return this.layer.source!=null&&super.canResume()}async doRefresh(){this._fetchQueue.reset(),this._tileStrategy.tiles.forEach(r=>this._updateTile(r))}_acquireTile(r){const e=new ze(r.clone());return this._updateTile(e),e}_updateTile(r){this.updatingHandles.addPromise(this._fetchQueue.push(r.key).then(e=>{const[t,s]=r.setElements(e);this._referenceElements(r,t),this._dereferenceElements(r,s),this.requestUpdate()},e=>{we(e)||N.getLogger(this.declaredClass).error(e)}))}_releaseTile(r){this._fetchQueue.abort(r.key.id),r.elements&&this._dereferenceElements(r,r.elements),this.requestUpdate()}async _queryElements(r,e){const t=this.layer.effectiveSource;if(_(t))return[];this.view.featuresTilingScheme.getTileBounds(c,r,!0);const s=new Re({xmin:c[0],ymin:c[1],xmax:c[2],ymax:c[3],spatialReference:this.view.spatialReference});return t.queryElements(s,e)}_referenceElements(r,e){const t=this.layer.source;if(!_(t))for(const s of e)this._referenceElement(r,s)}_referenceElement(r,e){Ee(this._elementReferences,e.uid,()=>{const t=new B({element:e,spatialReference:this.view.spatialReference}),s=new Le(t);return this._overlayContainer.addChild(s),this.elements.add(e),{tiles:new Set,projectedElement:t,overlay:s,debugGraphic:null}}).tiles.add(r)}_dereferenceElements(r,e){for(const t of e)this._dereferenceElement(r,t)}_dereferenceElement(r,e){var s;const t=this._elementReferences.get(e.uid);t.tiles.delete(r),t.tiles.size||(this._overlayContainer.removeChild(t.overlay),t.overlay.destroy(),t.projectedElement.destroy(),this._elementReferences.delete(e.uid),this.elements.remove(e),(s=this._debugGraphicsView)==null||s.graphics.remove(t.debugGraphic))}_elementUpdateHandler(r){var s;let e=this._elementReferences.get(r.uid);if(e){const i=e.projectedElement.normalizedCoords;if(_(i))return this._overlayContainer.removeChild(e.overlay),e.overlay.destroy(),e.projectedElement.destroy(),this._elementReferences.delete(r.uid),this.elements.remove(r),void((s=this._debugGraphicsView)==null?void 0:s.graphics.remove(e.debugGraphic));const a=[],n=[];for(const o of this._tileStrategy.tiles){const d=F(this.view.featuresTilingScheme,o,i);e.tiles.has(o)?d||n.push(o):d&&a.push(o)}for(const o of a)this._referenceElement(o,r);for(const o of n)this._dereferenceElement(o,r);return e=this._elementReferences.get(r.uid),void((e==null?void 0:e.debugGraphic)&&(e.debugGraphic.geometry=e.projectedElement.normalizedCoords,this._debugGraphicsView.graphicUpdateHandler({graphic:e.debugGraphic,property:"geometry"})))}const t=new B({element:r,spatialReference:this.view.spatialReference}).normalizedCoords;if(b(t))for(const i of this._tileStrategy.tiles)F(this.view.featuresTilingScheme,i,t)&&this._referenceElement(i,r)}};T([P()],y.prototype,"_fetchQueue",void 0),T([P()],y.prototype,"layer",void 0),T([P({readOnly:!0})],y.prototype,"elements",void 0),y=T([Me("esri.views.2d.layers.MediaLayerView2D")],y);const c=xe(),g={xmin:0,ymin:0,xmax:0,ymax:0};function F(r,e,t){return r.getTileBounds(c,e.key,!0),g.xmin=c[0],g.ymin=c[1],g.xmax=c[2],g.ymax=c[3],Te(g,t)}class ze{constructor(e){this.key=e,this.elements=null,this.isReady=!1,this.visible=!0}setElements(e){const t=[],s=new Set(this.elements);this.elements=e;for(const i of e)s.has(i)?s.delete(i):t.push(i);return this.isReady=!0,[t,Array.from(s)]}destroy(){}}const Jt=y;export{Jt as default};