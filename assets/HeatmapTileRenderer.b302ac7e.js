import{r6 as a,a5 as m,a7 as l,cK as p}from"./index.3255d2a5.js";import{n as h}from"./BitmapTileContainer.576c494b.js";import{o as c}from"./BaseTileRenderer.083418c4.js";import"./Bitmap.a6f40812.js";import"./Container.f0dd2697.js";import"./EffectView.ab0cb7da.js";import"./definitions.1d569ae6.js";import"./enums.3c1fa5b5.js";import"./Texture.d66dc1cb.js";import"./TiledDisplayObject.2607ae61.js";import"./WGLContainer.53e4a52c.js";import"./VertexArrayObject.ad007c8f.js";import"./VertexElementDescriptor.5da9dfe9.js";import"./vec4f32.c3d64d30.js";import"./color.18cd4954.js";import"./enums.9a5c29c3.js";import"./number.dcd3e86c.js";import"./ProgramTemplate.058b26d9.js";import"./MaterialKey.3d16bafa.js";import"./alignmentUtils.ba8835fe.js";import"./utils.e5643e7e.js";import"./StyleDefinition.dc47b5d4.js";import"./config.86ceb802.js";import"./GeometryUtils.ccd3b111.js";import"./earcut.a219bf29.js";import"./TileContainer.39dd4e2d.js";class d{constructor(){this.gradient=null,this.height=512,this.intensities=null,this.width=512}render(i){a(i,512,this.intensities,this.gradient,this.minDensity,this.maxDensity)}}let o=class extends c{constructor(t){super(t),this._intensityInfo={minDensity:0,maxDensity:0},this.type="heatmap",this.featuresView={attributeView:{initialize:()=>{},requestUpdate:()=>{}},requestRender:()=>{}},this._container=new h(t.tileInfoView)}createTile(t){const i=this._container.createTile(t);return this.tileInfoView.getTileCoords(i.bitmap,t),i.bitmap.resolution=this.tileInfoView.getTileResolution(t),i}onConfigUpdate(){const t=this.layer.renderer;if(t.type==="heatmap"){const{minDensity:i,maxDensity:r,colorStops:n}=t;this._intensityInfo.minDensity=i,this._intensityInfo.maxDensity=r,this._gradient=p(n),this.tiles.forEach(s=>{const e=s.bitmap.source;e&&(e.minDensity=i,e.maxDensity=r,e.gradient=this._gradient,s.bitmap.invalidateTexture())})}}hitTest(){return Promise.resolve([])}install(t){t.addChild(this._container)}uninstall(t){this._container.removeAllChildren(),t.removeChild(this._container)}disposeTile(t){this._container.removeChild(t),t.destroy()}supportsRenderer(t){return t&&t.type==="heatmap"}onTileData(t){const i=this.tiles.get(t.tileKey);if(!i)return;const r=t.intensityInfo,{minDensity:n,maxDensity:s}=this._intensityInfo,e=i.bitmap.source||new d;e.intensities=r&&r.matrix||null,e.minDensity=n,e.maxDensity=s,e.gradient=this._gradient,i.bitmap.source=e,this._container.addChild(i),this._container.requestRender(),this.requestUpdate()}onTileError(t){console.error(t)}lockGPUUploads(){}unlockGPUUploads(){}fetchResource(t,i){return console.error(t),Promise.reject()}};o=m([l("esri.views.2d.layers.features.tileRenderers.HeatmapTileRenderer")],o);const H=o;export{H as default};