import{dS as i,ee as n,a5 as a,a6 as s,eZ as l,a7 as o}from"./index.3255d2a5.js";import{f as h}from"./LayerView2D.faad288b.js";import{u as d}from"./LayerView.cc5af741.js";import"./Container.f0dd2697.js";import"./EffectView.ab0cb7da.js";import"./definitions.1d569ae6.js";import"./enums.3c1fa5b5.js";import"./Texture.d66dc1cb.js";let t=class extends h(d){constructor(e){super(e),this.layerViews=new i}set layerViews(e){this._set("layerViews",n(e,this._get("layerViews")))}get updatingProgress(){return this.layerViews.length===0?1:this.layerViews.reduce((e,r)=>e+r.updatingProgress,0)/this.layerViews.length}attach(){this._updateStageChildren(),this.addAttachHandles(this.layerViews.on("after-changes",()=>this._updateStageChildren()))}detach(){this.container.removeAllChildren()}update(e){}moveStart(){}viewChange(){}moveEnd(){}_updateStageChildren(){this.container.removeAllChildren(),this.layerViews.forEach((e,r)=>this.container.addChildAt(e.container,r))}};a([s({cast:l})],t.prototype,"layerViews",null),a([s({readOnly:!0})],t.prototype,"updatingProgress",null),t=a([o("esri.views.2d.layers.KnowledgeGraphLayerView2D")],t);const f=t;export{f as default};