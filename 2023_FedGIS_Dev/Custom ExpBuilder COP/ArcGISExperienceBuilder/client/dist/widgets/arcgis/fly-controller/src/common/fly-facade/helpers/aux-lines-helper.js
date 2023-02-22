import { loadArcGISJSAPIModules } from 'jimu-arcgis';
import * as utils from '../../utils/utils';
export default class AuxLinesHelper {
    constructor(options) {
        this.GraphicsLayer = null;
        this.Point = null;
        this.clearAll = () => {
            if (utils.isDefined(this.auxGraphicsLayer)) {
                this.auxGraphicsLayer.removeAll(); // clean layer
            }
            if (utils.isDefined(this.auxMovingObjLayer)) {
                this.auxMovingObjLayer.removeAll(); // clean layer
            }
        };
        this.deposeMoving = () => {
            this.auxMovingObjLayer.removeAll(); // clean layer
        };
        // aux point
        this.drawPoint = (mapPoint, color) => {
            const c = utils.isDefined(color) ? color : 'darkgreen';
            const point = new this.Graphic({
                geometry: mapPoint,
                symbol: {
                    type: 'point-3d',
                    symbolLayers: [{
                            type: 'icon',
                            size: 12,
                            resource: { primitive: 'circle' },
                            material: { color: c },
                            outline: { color: 'limegreen' }
                        }]
                }
            });
            this.auxMovingObjLayer.add(point);
            return point;
        };
        this.drawPointGL = (pointGL, color) => {
            const pointGeo = utils.renderCoordToGeoCoord(pointGL, 1, this.sceneView);
            const pt = new this.Point({
                x: pointGeo[0],
                y: pointGeo[1],
                z: pointGeo[2],
                // type: 'point',
                spatialReference: this.sceneView.spatialReference
            });
            if (pt.z < 100) {
                pt.z = 100;
            }
            const c = utils.isDefined(color) ? color : 'darkgreen';
            const point = new this.Graphic({
                geometry: pt,
                symbol: {
                    type: 'point-3d',
                    symbolLayers: [{
                            type: 'icon',
                            size: 12,
                            // resource: { primitive: "circle" },
                            // material: { color: c },
                            // outline: { color: "limegreen" }
                            resource: { primitive: 'circle' },
                            material: { color: c },
                            outline: { color: 'limegreen' }
                        }]
                }
            });
            this.auxMovingObjLayer.add(point);
            return point;
        };
        // aux line
        this.drawLine = (linesPoints, color) => {
            const c = utils.isDefined(color) ? color : 'lightblue';
            const line = new this.Graphic({
                geometry: {
                    type: 'polyline',
                    paths: linesPoints,
                    spatialReference: this.sceneView.spatialReference
                },
                symbol: { type: 'line-3d', symbolLayers: [{ type: 'line', material: { color: c }, size: 3 }] }
            });
            this.auxGraphicsLayer.add(line);
            return line;
        };
        this.drawLineXY = (linesPoints, color) => {
            const xypoints = [];
            for (let i = 0, len = linesPoints.length; i < len; i++) {
                const p = linesPoints[i];
                const x = p[0];
                const y = p[1];
                const z = p[2];
                if (z === 0) {
                    xypoints.push([x, y]);
                }
                else {
                    xypoints.push([x, y, z]);
                }
            }
            const c = utils.isDefined(color) ? color : 'lightblue';
            const line = new this.Graphic({
                geometry: {
                    type: 'polyline',
                    paths: xypoints,
                    spatialReference: this.sceneView.spatialReference
                },
                symbol: { type: 'line-3d', symbolLayers: [{ type: 'line', material: { color: c }, size: 3 }] }
            });
            this.auxGraphicsLayer.add(line);
            return line;
        };
        this.drawLineGL = (linesPoints, sceneView, color) => {
            const c = utils.isDefined(color) ? color : 'lightblue';
            const geoLines = [];
            for (let i = 0, len = linesPoints.length; i < len; i++) {
                const pGL = linesPoints[i];
                const p = utils.renderCoordToGeoCoord(pGL, 1, sceneView);
                geoLines.push(p);
            }
            const line = new this.Graphic({
                geometry: {
                    type: 'polyline',
                    paths: geoLines,
                    spatialReference: this.sceneView.spatialReference
                },
                symbol: { type: 'line-3d', symbolLayers: [{ type: 'line', material: { color: c }, size: 3 }] }
            });
            this.auxGraphicsLayer.add(line);
            return line;
        };
        loadArcGISJSAPIModules([
            'esri/layers/GraphicsLayer',
            'esri/geometry/Point',
            'esri/Graphic',
            'esri/views/3d/support/projectionUtils',
            'esri/geometry/support/webMercatorUtils'
        ]).then(modules => {
            [
                this.GraphicsLayer, this.Point, this.Graphic, this.projectionUtils, this.webMercatorUtils
            ] = modules;
            this.auxGraphicsLayer = new this.GraphicsLayer({ listMode: 'hide' });
            this.sceneView.map.add(this.auxGraphicsLayer);
            this.auxMovingObjLayer = new this.GraphicsLayer({ listMode: 'hide' });
            this.sceneView.map.add(this.auxMovingObjLayer);
        });
        this.sceneView = options.sceneView;
    }
}
//# sourceMappingURL=aux-lines-helper.js.map