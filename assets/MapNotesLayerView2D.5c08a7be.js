import{a as o,c$ as f,dS as w,J as p,K as n,eh as y,t as _,a5 as V,a7 as v}from"./index.3255d2a5.js";import{h as C}from"./Container.f0dd2697.js";import{r as H}from"./GroupContainer.9c96badb.js";import{f as b}from"./LayerView2D.faad288b.js";import{i as g}from"./GraphicContainer.b56922f6.js";import{a as m}from"./GraphicsView2D.9477d269.js";import{u as T}from"./LayerView.cc5af741.js";import"./EffectView.ab0cb7da.js";import"./definitions.1d569ae6.js";import"./enums.3c1fa5b5.js";import"./Texture.d66dc1cb.js";import"./WGLContainer.53e4a52c.js";import"./VertexArrayObject.ad007c8f.js";import"./VertexElementDescriptor.5da9dfe9.js";import"./vec4f32.c3d64d30.js";import"./color.18cd4954.js";import"./enums.9a5c29c3.js";import"./number.dcd3e86c.js";import"./ProgramTemplate.058b26d9.js";import"./MaterialKey.3d16bafa.js";import"./alignmentUtils.ba8835fe.js";import"./utils.e5643e7e.js";import"./StyleDefinition.dc47b5d4.js";import"./config.86ceb802.js";import"./GeometryUtils.ccd3b111.js";import"./earcut.a219bf29.js";import"./BaseGraphicContainer.5e2911c8.js";import"./FeatureContainer.3cd0def7.js";import"./AttributeStoreView.a805ba6a.js";import"./TiledDisplayObject.2607ae61.js";import"./visualVariablesUtils.313d5012.js";import"./visualVariablesUtils.fc657d78.js";import"./TileContainer.39dd4e2d.js";import"./vec3f32.4d8dc001.js";import"./cimAnalyzer.2e975d1d.js";import"./fontUtils.a84c0faf.js";import"./BidiEngine.f5b8c89f.js";import"./GeometryUtils.6fd53e6d.js";import"./Rect.e8e4d18d.js";import"./callExpressionWithFeature.565c4416.js";import"./floatRGBA.7b501bd7.js";import"./normalizeUtilsSync.95f750ca.js";import"./Matcher.19c09547.js";import"./tileUtils.dbdde791.js";import"./TurboLine.cfd1c2a2.js";import"./ExpandedCIM.31fce9f6.js";import"./schemaUtils.1fd0b466.js";import"./createSymbolSchema.0873edf1.js";import"./util.c874f147.js";import"./ComputedAttributeStorage.6996e7f3.js";import"./arcadeTimeUtils.7055c5d7.js";import"./centroid.193a93e9.js";const d="sublayers",l="layerView",I=Object.freeze({remove(){},pause(){},resume(){}});let c=class extends b(T){constructor(){super(...arguments),this._highlightIds=new Map,this.container=new H}async fetchPopupFeatures(i){return Array.from(this.graphicsViews(),t=>t.hitTest(i).filter(e=>!!e.popupTemplate)).flat()}*graphicsViews(){o(this._graphicsViewsFeatureCollectionMap)?yield*this._graphicsViewsFeatureCollectionMap.keys():o(this._graphicsViews)?yield*this._graphicsViews:yield*[]}async hitTest(i,t){return Array.from(this.graphicsViews(),e=>{const s=e.hitTest(i);if(o(this._graphicsViewsFeatureCollectionMap)){const a=this._graphicsViewsFeatureCollectionMap.get(e);for(const r of s)!r.popupTemplate&&a.popupTemplate&&(r.popupTemplate=a.popupTemplate),r.sourceLayer=r.layer=this.layer}return s}).flat().map(e=>({type:"graphic",graphic:e,layer:this.layer,mapPoint:i}))}highlight(i){let t;typeof i=="number"?t=[i]:i instanceof f?t=[i.uid]:Array.isArray(i)&&i.length>0?t=typeof i[0]=="number"?i:i.map(s=>s&&s.uid):w.isCollection(i)&&(t=i.map(s=>s&&s.uid).toArray());const e=t==null?void 0:t.filter(o);return e!=null&&e.length?(this._addHighlight(e),{remove:()=>{this._removeHighlight(e)}}):I}update(i){for(const t of this.graphicsViews())t.processUpdate(i)}attach(){const i=this.view,t=()=>this.requestUpdate(),e=this.layer.featureCollections;if(o(e)&&e.length){this._graphicsViewsFeatureCollectionMap=new Map;for(const s of e){const a=new g(this.view.featuresTilingScheme),r=new m({view:i,graphics:s.source,renderer:s.renderer,requestUpdateCallback:t,container:a});this._graphicsViewsFeatureCollectionMap.set(r,s),this.container.addChild(r.container),this.addHandles([p(()=>s.visible,h=>r.container.visible=h,n),p(()=>r.updating,()=>this.notifyChange("updating"),n)],l)}this._updateHighlight()}else o(this.layer.sublayers)&&this.addHandles(y(()=>this.layer.sublayers,"change",()=>this._createGraphicsViews(),{onListenerAdd:()=>this._createGraphicsViews(),onListenerRemove:()=>this._destroyGraphicsViews()}),d)}detach(){this._destroyGraphicsViews(),this.removeHandles(d)}moveStart(){}moveEnd(){}viewChange(){for(const i of this.graphicsViews())i.viewChange()}isUpdating(){for(const i of this.graphicsViews())if(i.updating)return!0;return!1}_destroyGraphicsViews(){this.container.removeAllChildren(),this.removeHandles(l);for(const i of this.graphicsViews())i.destroy();this._graphicsViews=null,this._graphicsViewsFeatureCollectionMap=null}_createGraphicsViews(){if(this._destroyGraphicsViews(),_(this.layer.sublayers))return;const i=[],t=this.view,e=()=>this.requestUpdate();for(const s of this.layer.sublayers){const a=new C,r=new g(this.view.featuresTilingScheme);r.fadeTransitionEnabled=!0;const h=new m({view:t,graphics:s.graphics,requestUpdateCallback:e,container:r});this.addHandles([s.on("graphic-update",h.graphicUpdateHandler),p(()=>s.visible,u=>h.container.visible=u,n),p(()=>h.updating,()=>this.notifyChange("updating"),n)],l),a.addChild(h.container),this.container.addChild(a),i.push(h)}this._graphicsViews=i,this._updateHighlight()}_addHighlight(i){for(const t of i)if(this._highlightIds.has(t)){const e=this._highlightIds.get(t);this._highlightIds.set(t,e+1)}else this._highlightIds.set(t,1);this._updateHighlight()}_removeHighlight(i){for(const t of i)if(this._highlightIds.has(t)){const e=this._highlightIds.get(t)-1;e===0?this._highlightIds.delete(t):this._highlightIds.set(t,e)}this._updateHighlight()}_updateHighlight(){const i=Array.from(this._highlightIds.keys());for(const t of this.graphicsViews())t.setHighlight(i)}};c=V([v("esri.views.2d.layers.MapNotesLayerView2D")],c);const Ti=c;export{Ti as default};