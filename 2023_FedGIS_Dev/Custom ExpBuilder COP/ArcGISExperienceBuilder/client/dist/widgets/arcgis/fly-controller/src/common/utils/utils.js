import externalRenderers from 'esri/views/3d/externalRenderers';
import { lodash } from 'jimu-core';
import { FlyItemMode } from '../../config';
import nls from '../../runtime/translations/default';
import { Constraints } from '../constraints';
// coord
export function geoCoordToRenderCoord(inCood, num, sceneView) {
    const transNum = isDefined(num) ? num : 1;
    const renderCoordinates = [];
    externalRenderers.toRenderCoordinates(sceneView, inCood, 0, null, // null: means follow this.scene.sp
    renderCoordinates, 0, transNum);
    return renderCoordinates;
}
export function renderCoordToGeoCoord(varCood, num, sceneView) {
    const transNum = isDefined(num) ? num : 1;
    const outGeographicCoordinates = [];
    externalRenderers.fromRenderCoordinates(sceneView, varCood, 0, outGeographicCoordinates, 0, null, transNum);
    return outGeographicCoordinates;
}
// //ll - xy
// this._tmpZ = 200;
// export function lngLatToXY(tmpLon, tmpLat, elevZ) {
//   let tp = webMercatorUtils.lngLatToXY(tmpLon, tmpLat);
//   let z = elevZ ? elevZ : this._tmpZ;
//   return [tp[0], tp[1], z];
// }
// export function xyToLngLat(x, y) {
//   let p2 = webMercatorUtils.xyToLngLat(x, y);
//   //halfLon = Math.abs(p1[0] - p2[0]) / 8;
//   return p2;
// }
// math
export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
export function radToDeg(radians) {
    return radians * 180 / Math.PI;
}
export function distance(from, to) {
    const x = to[0] - from[0];
    const y = to[1] - from[1];
    const z = to[2] - from[2];
    const len = x * x + y * y + z * z;
    return Math.sqrt(len);
}
export function sign(num) {
    return (num < 0) ? -1 : (num > 0) ? 1 : 0;
}
// x in range<a1,a2> mappingto range<b1,b2>
export function mapLinear(x, a1, a2, b1, b2) {
    return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
}
// interpolation
export function lerp(from, to, factor) {
    // let inter = { x: 0, y: 0, z: 0 };
    const inter = [];
    inter[0] = ((to[0] - from[0]) * factor) + from[0];
    inter[1] = ((to[1] - from[1]) * factor) + from[1];
    inter[2] = ((to[2] - from[2]) * factor) + from[2];
    return inter;
}
export function getRotatedAngle(p1, p2, p3, vec3, vec3d, sceneView, esriMathUtils) {
    const prePos = p1;
    const basePos = p2 !== null && p2 !== void 0 ? p2 : null;
    const nextPos = p3 !== null && p3 !== void 0 ? p3 : null;
    if (basePos === null || nextPos === null) {
        return 0;
    }
    const lastVec = vec3d.create();
    vec3.subtract(lastVec, basePos, prePos);
    const nextVec = vec3d.create();
    vec3.subtract(nextVec, nextPos, basePos);
    const auxUpVec = vec3d.create();
    sceneView.renderCoordsHelper.worldUpAtPosition(basePos, auxUpVec); // up-aux-line
    const angle = radToDeg(esriMathUtils.angle(lastVec, nextVec, auxUpVec));
    return angle; // * Constraints.SPEED.MULTIPLIER;//Math.abs(Math.round(angle)) * Constraints.SPEED.MULTIPLIER;
}
// geo
export function isPolylineEquals(polyline1, polyline2) {
    if (!polyline1.extent.equals(polyline2.extent)) {
        return false;
    }
    if (polyline1.paths.length !== polyline2.paths.length) {
        return false;
    }
    if (polyline1.paths[0].length !== polyline2.paths[0].length) {
        return false;
    }
    return lodash.isDeepEqual(polyline1, polyline2);
}
// elev info
export function queryGeometryElevInfo(geometry, sceneView) {
    return sceneView.groundView.elevationSampler.queryElevation(geometry);
}
export function getHitPointOnTheGround(hitTestResult) {
    let lastHit = null;
    if (hitTestResult.results.length > 0) {
        lastHit = hitTestResult.results[hitTestResult.results.length - 1];
    }
    if (isDefined(hitTestResult.ground.mapPoint)) {
        if (isDefined(lastHit)) {
            if (hitTestResult.ground.distance > lastHit.distance) {
                // an object under the ground could be more far away, check first the distance before set the ground as last point
                lastHit = hitTestResult.ground;
            }
        }
        else {
            lastHit = hitTestResult.ground;
        }
    }
    // this.aux_drawPoint(lastHit.mapPoint);
    return lastHit;
}
export function getDistanceFrom2LngLat(lng1, lat1, lng2, lat2) {
    const radLng1 = degToRad(lng1);
    const radLat1 = degToRad(lat1);
    const radLng2 = degToRad(lng2);
    const radLat2 = degToRad(lat2);
    const a = radLat1 - radLat2;
    const b = radLng1 - radLng2;
    const km = 2 * Math.asin(Math.sqrt(Math.sin(a / 2) * Math.sin(a / 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) * Math.sin(b / 2))) * 6378.137;
    return km;
}
// widget
export function getEnabledItemNum(itemsList) {
    let count = 0;
    for (let i = 0, len = itemsList.length; i < len; i++) {
        const item = itemsList[i];
        if (isDefined(item) && item.isInUse !== false) {
            count++;
        }
    }
    return count;
}
export function getFlyStyleTitle(flyStyle, props) {
    if (flyStyle === FlyItemMode.Rotate) {
        return props.intl.formatMessage({ id: 'flyStyleRotate', defaultMessage: nls.flyStyleRotate });
    }
    else if (flyStyle === FlyItemMode.Path) {
        return props.intl.formatMessage({ id: 'flyStylePath', defaultMessage: nls.flyStylePath });
    }
    else if (flyStyle === FlyItemMode.Route) {
        return props.intl.formatMessage({ id: 'flyStyleRoute', defaultMessage: nls.flyStyleRoute });
    }
    else {
        return null;
    }
}
// speed
// num: [0-1] ==> speed: [1/8 - 8]
export function speedMapping(num, decimal) {
    const min = Constraints.SPEED.MIN;
    const max = Constraints.SPEED.MAX;
    const fac = Constraints.SPEED.MULTIPLIER;
    let speed;
    const half = (max - min) / 2;
    if (num < half) {
        speed = 1 / ((half - num) / (half) * fac);
        // if (0 === speed) {
        //   speed = 1 / fac;//0
        // }
    }
    else {
        speed = (num - half) / (max - half) * fac;
        if (speed === 0) {
            speed = 1; //= = half
        }
    }
    return parseFloat(speed.toFixed(isDefined(decimal) ? decimal : Constraints.SPEED.DECIMAL));
}
// live view setting
export function getInitLiveviewSetting() {
    return {
        speed: 0.5,
        // heading: 0,
        tilt: 0,
        altitude: 0 // [0 - 500]
    };
}
export function clampTilt(tilt) {
    if (tilt <= 0) {
        return 0.1;
    }
    else if (tilt >= 90) {
        return 89.9;
    }
    else {
        return tilt;
    }
}
export function showLiveviewSetting(num, unit) {
    return angleNumFix(Number(num)).toString() + ' ' + unit; // for #6627, in React.state the `num: number` maybe turn to a string
}
// calculated value rounded ,#6406
export function angleNumFix(angle) {
    const _angle = (angle === null || angle === void 0 ? void 0 : angle.toFixed) ? parseFloat(angle.toFixed(Constraints.CALCULATED_VALUE_ROUNDED.ANGLE)) : NaN;
    return resetEmptyInputTo0(_angle);
}
export function altNumFix(alt) {
    const _alt = (alt === null || alt === void 0 ? void 0 : alt.toFixed) ? parseFloat(alt.toFixed(Constraints.CALCULATED_VALUE_ROUNDED.ELEV)) : NaN;
    return resetEmptyInputTo0(_alt);
}
export function timeNumFix(time) {
    const _time = (time === null || time === void 0 ? void 0 : time.toFixed) ? parseFloat(time.toFixed(Constraints.CALCULATED_VALUE_ROUNDED.TIME)) : NaN;
    return resetEmptyInputTo0(_time);
}
// empty input value for calculated value ,#6556
export function resetEmptyInputTo0(inputVal) {
    return ((inputVal === null) || isNaN(inputVal)) ? 0 : inputVal;
}
// Route & Record
export function getRouteConfigByIdx(routes, ids) {
    const routeConfig = routes === null || routes === void 0 ? void 0 : routes.find(route => (route.idx === ids.routeUuid));
    return routeConfig;
}
export function getRecordConfigByIds(routes, ids) {
    var _a;
    const routeConfig = getRouteConfigByIdx(routes, ids);
    const recordConfig = (_a = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.records) === null || _a === void 0 ? void 0 : _a.find(record => (record.idx === ids.recordUuid));
    return recordConfig;
}
export function findRecordConfigByOrder(routes, ids, order) {
    const routeConfig = getRouteConfigByIdx(routes, ids);
    const recordConfig = routeConfig === null || routeConfig === void 0 ? void 0 : routeConfig.records[order];
    return recordConfig;
}
// RouteConfig & RecordConfig auto naming rules ,#5084
export function getIncreasedNameByConfig(collection, namingTmpl) {
    const namingRule = namingTmpl + ' '; // prefix + ' '
    let max = 0;
    collection.forEach((r) => {
        let suffixNum;
        const resArr = r.displayName.split(namingRule);
        if (isDefined(resArr) && resArr.length === 2 && resArr[0] === '') {
            suffixNum = resArr[1];
            if (/^\d+$/.test(suffixNum)) {
                suffixNum = parseInt(suffixNum);
                max = Math.max(suffixNum, max);
            }
        }
    });
    return `${namingRule}${max + 1}`;
}
// group
// 'fly__' + id;
// JimuMapView.dataSourceId;//like: "dataSource_5"
// JimuMapView.id;//like: "widget_67editor-dataSource_5"
export function genJimuMapIdForFly(mapWidgetId) {
    // return this.MAP_ID_PREFIX + mapWidgetId;
    return 'fly__' + mapWidgetId;
}
export function removeJimuMapIdForFly(id) {
    if (id === null || id === void 0 ? void 0 : id.startsWith('fly__' /* this.MAP_ID_PREFIX */)) {
        return id.replace('fly__' /* this.MAP_ID_PREFIX */, '');
    }
    else {
        return id;
    }
}
// for tslint
export function isDefined(value) {
    if (typeof value !== 'undefined' && !(value === null)) {
        return true;
    }
    else {
        return false;
    }
}
// switchMap
export function getMapSwitchingInfo(widgetId, autoControlWidgetId, mapId) {
    return {
        isTriggeredByFly: (autoControlWidgetId === widgetId),
        isTriggeredByMapSelf: (autoControlWidgetId === mapId)
    };
}
//# sourceMappingURL=utils.js.map