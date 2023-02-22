export var CreateToolType;
(function (CreateToolType) {
    CreateToolType["Point"] = "Point";
    CreateToolType["Polyline"] = "Polyline";
    CreateToolType["Polygon"] = "Polygon";
    CreateToolType["Rectangle"] = "Rectangle";
    CreateToolType["Circle"] = "Circle";
})(CreateToolType || (CreateToolType = {}));
export var SelectionType;
(function (SelectionType) {
    SelectionType["NewSelection"] = "NEW_SELECTION";
    SelectionType["AddToSelection"] = "ADD_TO_CURRENT_SELECTION";
    SelectionType["RemoveFromSelection"] = "REMOVE_FROM_CURRENT_SELECTION";
    SelectionType["SubsetSelection"] = "SUBSET_FROM_CURRENT_SELECTION";
    SelectionType["SwitchSelction"] = "SWITCH_CURRENT_SELECTION";
})(SelectionType || (SelectionType = {}));
export var QueryArrangeType;
(function (QueryArrangeType) {
    QueryArrangeType["Block"] = "BLOCK";
    QueryArrangeType["Inline"] = "INLINE";
    QueryArrangeType["Popper"] = "POPPER";
})(QueryArrangeType || (QueryArrangeType = {}));
export var SpatialFilterType;
(function (SpatialFilterType) {
    SpatialFilterType["CurrentMapExtent"] = "CurrentMapExtent";
    SpatialFilterType["InteractiveDrawMode"] = "InteractiveDrawMode";
    SpatialFilterType["None"] = "";
})(SpatialFilterType || (SpatialFilterType = {}));
export var SpatialRelation;
(function (SpatialRelation) {
    SpatialRelation["Intersect"] = "intersects";
    SpatialRelation["Contain"] = "contains";
    SpatialRelation["Cross"] = "crosses";
    SpatialRelation["EnvelopeIntersect"] = "envelope-intersects";
    SpatialRelation["IndexIntersect"] = "index-intersects";
    SpatialRelation["Overlap"] = "overlaps";
    SpatialRelation["Touch"] = "touches";
    SpatialRelation["Within"] = "within";
})(SpatialRelation || (SpatialRelation = {}));
export const mapJSAPISpatialRelToDsSpatialRel = {
    [SpatialRelation.Intersect]: 'esriSpatialRelIntersects',
    [SpatialRelation.Contain]: 'esriSpatialRelContains',
    [SpatialRelation.Cross]: 'esriSpatialRelCrosses',
    [SpatialRelation.EnvelopeIntersect]: 'esriSpatialRelEnvelopeIntersects',
    [SpatialRelation.IndexIntersect]: 'esriSpatialRelIndexIntersects',
    [SpatialRelation.Overlap]: 'esriSpatialRelOverlaps',
    [SpatialRelation.Touch]: 'esriSpatialRelTouches',
    [SpatialRelation.Within]: 'esriSpatialRelWithin'
};
export var UnitType;
(function (UnitType) {
    UnitType["Miles"] = "Miles";
    UnitType["Kilometers"] = "Kilometers";
    UnitType["Feet"] = "Feet";
    UnitType["Meters"] = "Meters";
    UnitType["NauticalMiles"] = "NauticalMiles";
})(UnitType || (UnitType = {}));
export const mapJSAPIUnitToDsUnit = {
    [UnitType.Miles]: 'esriSRUnit_StatuteMile',
    [UnitType.Kilometers]: 'esriSRUnit_Kilometer',
    [UnitType.Feet]: 'esriSRUnit_Foot',
    [UnitType.Meters]: 'esriSRUnit_Meter',
    [UnitType.NauticalMiles]: 'esriSRUnit_NauticalMile'
};
export var ListDirection;
(function (ListDirection) {
    ListDirection["Horizontal"] = "Horizontal";
    ListDirection["Vertical"] = "Vertical";
})(ListDirection || (ListDirection = {}));
export var PagingType;
(function (PagingType) {
    PagingType["MultiPage"] = "MultiPage";
    PagingType["LazyLoad"] = "LazyLoad";
})(PagingType || (PagingType = {}));
export var FieldsType;
(function (FieldsType) {
    FieldsType["PopupSetting"] = "PopupSetting";
    FieldsType["SelectAttributes"] = "SelectAttributes";
})(FieldsType || (FieldsType = {}));
export var SortDirection;
(function (SortDirection) {
    SortDirection["Asc"] = "Asc";
    SortDirection["Desc"] = "Desc";
})(SortDirection || (SortDirection = {}));
export var SymbolType;
(function (SymbolType) {
    SymbolType["DefaultSymbol"] = "DefaultSymbol";
    SymbolType["CustomSymbol"] = "CustomSymbol";
})(SymbolType || (SymbolType = {}));
//# sourceMappingURL=config.js.map