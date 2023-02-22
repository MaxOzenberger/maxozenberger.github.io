/**
 * The data source types that `jimu-arcgis` supports.
 * For additional data source types, please see `DataSourceTypes` from the `jimu-core` package.
 */
export var DataSourceTypes;
(function (DataSourceTypes) {
    DataSourceTypes["Map"] = "MAP";
    DataSourceTypes["WebMap"] = "WEB_MAP";
    DataSourceTypes["WebScene"] = "WEB_SCENE";
})(DataSourceTypes || (DataSourceTypes = {}));
/**
 * @ignore
 * JS API layer types.
 */
export var LayerTypes;
(function (LayerTypes) {
    LayerTypes["BaseDynamicLayer"] = "base-dynamic";
    LayerTypes["BaseElevationLayer"] = "base-elevation";
    LayerTypes["BaseTileLayer"] = "base-tile";
    LayerTypes["BuildingSceneLayer"] = "building-scene";
    LayerTypes["CSVLayer"] = "csv";
    LayerTypes["ElevationLayer"] = "elevation";
    LayerTypes["FeatureLayer"] = "feature";
    LayerTypes["GeoJSONLayer"] = "geojson";
    LayerTypes["GeoRSSLayer"] = "geo-rss";
    LayerTypes["GraphicsLayer"] = "graphics";
    LayerTypes["GroupLayer"] = "group";
    LayerTypes["ImageryLayer"] = "imagery";
    LayerTypes["IntegratedMeshLayer"] = "integrated-mesh";
    LayerTypes["KMLLayer"] = "kml";
    LayerTypes["MapImageLayer"] = "map-image";
    LayerTypes["MapNotesLayer"] = "map-notes";
    LayerTypes["PointCloudLayer"] = "point-cloud";
    LayerTypes["SceneLayer"] = "scene";
    LayerTypes["TileLayer"] = "tile";
    LayerTypes["UnknownLayer"] = "unknown";
    LayerTypes["UnsupportedLayer"] = "unsupported";
    LayerTypes["VectorTileLayer"] = "vector-tile";
    LayerTypes["WMSLayer"] = "wms";
    LayerTypes["WMTSLayer"] = "wmts";
    LayerTypes["WebTileLayer"] = "web-tile";
})(LayerTypes || (LayerTypes = {}));
/**
 * The data source types that `jimu-arcgis` supports.
 * For additional data source types, please see `DataSourceTypes` from the `jimu-core` package.
 * See {@link DataSourceTypes} for details.
 */
export { DataSourceTypes as ArcGISDataSourceTypes };
//# sourceMappingURL=arcgis-data-source-interface.js.map