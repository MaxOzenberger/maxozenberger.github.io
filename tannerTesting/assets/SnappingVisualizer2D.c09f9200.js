import{er as m,ju as M,jj as s,bp as o,jv as l,ae as p,e4 as n,c$ as d,fK as S,jp as y,jw as u,am as c,n as I}from"./index.3255d2a5.js";import{U as g,w as P}from"./enums.9a5c29c3.js";import{o as b}from"./settings.933c471e.js";import{r as x}from"./SnappingContext.023005d4.js";class F extends x{constructor(e){super(),this._graphicsLayer=e}visualizeIntersectionPoint(e,r){return this._visualizeSnappingIndicator(new p({x:e.intersectionPoint[0],y:e.intersectionPoint[1],spatialReference:r.spatialReference}),L)}visualizePoint(e,r){return this._visualizeSnappingIndicator(new p({x:e.point[0],y:e.point[1],spatialReference:r.spatialReference}),f)}visualizeLine(e,r){return this._visualizeSnappingIndicator(new n({paths:[[e.lineStart,e.lineEnd]],spatialReference:r.spatialReference}),v)}visualizeParallelSign(e,r){return this._visualizeSnappingIndicator(new n({paths:[[e.lineStart,e.lineEnd]],spatialReference:r.spatialReference}),z)}visualizeRightAngleQuad(e,r){return this._visualizeSnappingIndicator(new n({paths:[[e.previousVertex,e.centerVertex,e.nextVertex]],spatialReference:r.spatialReference}),k(e))}_visualizeSnappingIndicator(e,r){const t=new d({geometry:e,symbol:r});return this._graphicsLayer.add(t),S(()=>{this._graphicsLayer.remove(t)})}}const a=b.main.toArray(),C=[...b.main.toRgb(),100],L=new m({outline:new M({width:1.5,color:a}),size:15,color:[0,0,0,0]}),f=new m({outline:{width:.5,color:[0,0,0,1]},size:10,color:a}),v=new s({data:{type:"CIMSymbolReference",symbol:{type:"CIMLineSymbol",symbolLayers:[{type:"CIMSolidStroke",enable:!0,capStyle:g.Butt,joinStyle:P.Round,miterLimit:10,width:o(l.lineHintWidthTarget),color:a}]}}}),z=new s({data:{type:"CIMSymbolReference",symbol:{type:"CIMLineSymbol",symbolLayers:[{type:"CIMVectorMarker",enable:!0,anchorPoint:{x:0,y:-1,z:0},anchorPointUnits:"Relative",size:5,markerPlacement:{type:"CIMMarkerPlacementOnLine",placePerPart:!0,angleToLine:!0,relativeTo:"LineMiddle"},frame:{xmin:-5,ymin:-1.5,xmax:5,ymax:1.5},markerGraphics:[{type:"CIMMarkerGraphic",geometry:{rings:[[[7,0],[-7,0],[-7,1.5],[7,1.5]]]},symbol:{type:"CIMPolygonSymbol",symbolLayers:[{type:"CIMSolidFill",enable:!0,color:a}]}}],scaleSymbolsProportionally:!0,respectFrame:!0},{type:"CIMVectorMarker",enable:!0,anchorPoint:{x:0,y:1,z:0},anchorPointUnits:"Relative",size:5,markerPlacement:{type:"CIMMarkerPlacementOnLine",placePerPart:!0,angleToLine:!0,relativeTo:"LineMiddle"},frame:{xmin:-5,ymin:-1.5,xmax:5,ymax:1.5},markerGraphics:[{type:"CIMMarkerGraphic",geometry:{rings:[[[7,0],[-7,0],[-7,-1.5],[7,-1.5]]]},symbol:{type:"CIMPolygonSymbol",symbolLayers:[{type:"CIMSolidFill",enable:!0,color:a}]}}],scaleSymbolsProportionally:!0,respectFrame:!0}]}}}),h=i=>new s({data:{type:"CIMSymbolReference",symbol:{type:"CIMLineSymbol",symbolLayers:[{type:"CIMVectorMarker",enable:!0,anchorPoint:{x:.5,y:.5,z:0},anchorPointUnits:"Relative",size:o(l.rightAngleHintSize),rotation:i,markerPlacement:{type:"CIMMarkerPlacementOnVertices",placePerPart:!0,angleToLine:!0,placeOnEndPoints:!1},frame:{xmin:-5,ymin:-5,xmax:5,ymax:5},markerGraphics:[{type:"CIMMarkerGraphic",geometry:{paths:[[[5,-5],[-5,-5],[-5,5],[5,5],[5,-5]]]},symbol:{type:"CIMLineSymbol",symbolLayers:[{type:"CIMSolidStroke",enable:!0,capStyle:"Butt",joinStyle:"Round",miterLimit:10,width:o(l.rightAngleHintOutlineSize),color:a},{type:"CIMSolidFill",enable:!0,color:C}]}}],scaleSymbolsProportionally:!0,respectFrame:!0}]}}}),R=h(45),w=h(225),k=(()=>{const i=c(),e=c(),r=I();return t=>(y(i,t.centerVertex,t.previousVertex),y(e,t.nextVertex,t.previousVertex),u(r,i,e),r[2]<0?R:w)})();export{F as u};