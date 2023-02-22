export const FORMAT_ITEM = ['pdf', 'png32', 'png8', 'jpg', 'gif', 'eps', 'svg', 'svgz'];
export const LAYOUT_ITEM = ['map-only', 'a3-landscape', 'a3-portrait', 'a4-landscape', 'a4-portrait', 'letter-ansi-a-landscape', 'letter-ansi-a-portrait', 'tabloid-ansi-b-landscape', 'tabloid-ansi-b-portrait'];
export const SCALEBAR_UNIT = ['Miles', 'Kilometers', 'Meters', 'Feet'];
export const DEFAULT_MAP_WIDTH = 800;
export const DEFAULT_MAP_HEIGHT = 1100;
export const DEFAULT_DPI = 96;
export const WKID_LINK = 'https://developers.arcgis.com/rest/services-reference/enterprise/using-spatial-references.htm';
export const CIMMarkerNorthArrow = 'CIMMarkerNorthArrow';
export var PrintExtentType;
(function (PrintExtentType) {
    PrintExtentType["CurrentMapExtent"] = "CURRENT MAP EXTENT";
    PrintExtentType["CurrentMapScale"] = "CURRENT MAP SCALE";
    PrintExtentType["SetMapScale"] = "SET MAP SCALE";
})(PrintExtentType || (PrintExtentType = {}));
export var MapFrameUnit;
(function (MapFrameUnit) {
    MapFrameUnit["Point"] = "POINT";
    MapFrameUnit["Inch"] = "INCH";
    MapFrameUnit["Centimeter"] = "CENTIMETER";
    MapFrameUnit["Millimeter"] = "MILLIMETER";
})(MapFrameUnit || (MapFrameUnit = {}));
export const DEFAULT_COMMON_SETTING = {
    scalePreserved: false,
    outScale: 36978595.474472,
    layoutOptions: {
        titleText: 'ArcGIS Web Map'
    },
    exportOptions: {
        dpi: DEFAULT_DPI
    },
    printExtentType: PrintExtentType.CurrentMapExtent,
    attributionVisible: false,
    forceFeatureAttributes: true,
    wkid: 102100,
    wkidLabel: 'WGS_1984_Web_Mercator_Auxiliary_Sphere',
    enableTitle: true,
    legendEnabled: true,
    enableMapPrintExtents: true,
    enableOutputSpatialReference: true,
    enableQuality: true,
    enableFeatureAttribution: true,
    enableMapSize: true,
    overrideCommonSetting: false,
    enableAuthor: true,
    enableCopyright: true,
    enableLegend: true,
    enableScalebarUnit: true,
    enableCustomTextElements: true
};
export var ModeType;
(function (ModeType) {
    ModeType["Classic"] = "CLASSIC";
    ModeType["Compact"] = "COMPACT";
})(ModeType || (ModeType = {}));
export var PrintServiceType;
(function (PrintServiceType) {
    PrintServiceType["OrganizationService"] = "ORGANIZATION SERVICE";
    PrintServiceType["Customize"] = "CUSTOMIZE";
})(PrintServiceType || (PrintServiceType = {}));
export var PrintTemplateType;
(function (PrintTemplateType) {
    PrintTemplateType["OrganizationTemplate"] = "ORGANIZATION TEMPLATE";
    PrintTemplateType["Customize"] = "CUSTOMIZE";
})(PrintTemplateType || (PrintTemplateType = {}));
export var PrintResultState;
(function (PrintResultState) {
    PrintResultState["Loading"] = "LOADING";
    PrintResultState["Success"] = "SUCCESS";
    PrintResultState["Error"] = "ERROR";
})(PrintResultState || (PrintResultState = {}));
//# sourceMappingURL=config.js.map