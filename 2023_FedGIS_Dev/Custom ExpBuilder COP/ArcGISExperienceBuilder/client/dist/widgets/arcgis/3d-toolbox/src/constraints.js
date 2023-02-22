// tools
export var ToolsID;
(function (ToolsID) {
    ToolsID["Daylight"] = "daylight";
    ToolsID["Weather"] = "weather";
    ToolsID["ShadowCast"] = "shadowcast";
    ToolsID["LineOfSight"] = "lineofsight";
})(ToolsID || (ToolsID = {}));
// configs
// 1.Daylight
// https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Daylight.html#dateOrSeason
export var DateOrSeason;
(function (DateOrSeason) {
    DateOrSeason["Date"] = "date";
    DateOrSeason["Season"] = "season";
})(DateOrSeason || (DateOrSeason = {}));
export var Season;
(function (Season) {
    Season["SyncedWithMap"] = "syncedWithMap";
    Season["Spring"] = "spring";
    Season["Summer"] = "summer";
    Season["Fall"] = "fall";
    Season["Winter"] = "winter";
})(Season || (Season = {}));
// 2.Weather
export var WeatherType;
(function (WeatherType) {
    WeatherType["Sunny"] = "sunny";
    WeatherType["Cloudy"] = "cloudy";
    WeatherType["Rainy"] = "rainy";
    WeatherType["Snowy"] = "snowy";
    WeatherType["Foggy"] = "foggy";
})(WeatherType || (WeatherType = {}));
// 3.Shadow cast
export var ShadowCastVisType;
(function (ShadowCastVisType) {
    ShadowCastVisType["Threshold"] = "threshold";
    ShadowCastVisType["Duration"] = "duration";
    ShadowCastVisType["Discrete"] = "discrete";
})(ShadowCastVisType || (ShadowCastVisType = {}));
// Arrangements
export var ArrangementStyle;
(function (ArrangementStyle) {
    ArrangementStyle["List"] = "list";
    ArrangementStyle["Icon"] = "icon";
})(ArrangementStyle || (ArrangementStyle = {}));
export var ArrangementDirection;
(function (ArrangementDirection) {
    ArrangementDirection["Horizontal"] = "horizontal";
    ArrangementDirection["Vertical"] = "vertical";
})(ArrangementDirection || (ArrangementDirection = {}));
//# sourceMappingURL=constraints.js.map