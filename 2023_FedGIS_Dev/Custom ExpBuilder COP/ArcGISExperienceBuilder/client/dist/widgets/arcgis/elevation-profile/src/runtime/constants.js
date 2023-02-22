import defaultMessages from './translations/default';
const elevationIcon = require('./assets/icons/elevation-icon.svg');
const selectIcon = require('jimu-icons/svg/outlined/gis/select-line.svg');
const drawIcon = require('jimu-icons/svg/outlined/editor/edit.svg');
const arrowNavBack = require('jimu-icons/svg/outlined/directional/arrow-left.svg');
const doneIcon = require('jimu-icons/svg/outlined/application/check.svg');
const clearIcon = require('jimu-icons/svg/outlined/editor/trash.svg');
const chartIcon = require('jimu-icons/svg/outlined/brand/widget-chart.svg');
const flipIcon = require('jimu-icons/svg/outlined/directional/exchange.svg');
const settingsIcon = require('jimu-icons/svg/outlined/application/setting.svg');
const iconExpandCollapse = require('jimu-icons/svg/outlined/directional/down.svg');
export const getRuntimeIcon = () => ({
    epIcon: {
        elevationIcon,
        selectIcon,
        drawIcon,
        arrowNavBack,
        doneIcon,
        clearIcon,
        chartIcon,
        flipIcon,
        settingsIcon,
        iconExpandCollapse
    }
});
export const defaultElevationLayer = 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer';
export const unitOptions = [
    {
        value: 'meters',
        abbreviation: 'metersAbbreviation'
    },
    {
        value: 'feet',
        abbreviation: 'feetAbbreviation'
    },
    {
        value: 'kilometers',
        abbreviation: 'kilometersAbbreviation'
    },
    {
        value: 'miles',
        abbreviation: 'milesAbbreviation'
    },
    {
        value: 'yards',
        abbreviation: 'yardsAbbreviation'
    }
];
export const epStatistics = [
    {
        value: 'maxDistance', label: defaultMessages.maxDistance
    },
    {
        value: 'minElevation', label: defaultMessages.minElevation
    },
    {
        value: 'maxElevation', label: defaultMessages.maxElevation
    },
    {
        value: 'avgElevation', label: defaultMessages.avgElevation
    },
    {
        value: 'elevationGain', label: defaultMessages.elevationGain
    },
    {
        value: 'elevationLoss', label: defaultMessages.elevationLoss
    },
    {
        value: 'maxPositiveSlope', label: defaultMessages.maxPositiveSlope
    },
    {
        value: 'maxNegativeSlope', label: defaultMessages.maxNegativeSlope
    },
    {
        value: 'avgPositiveSlope', label: defaultMessages.avgPositiveSlope
    },
    {
        value: 'avgNegativeSlope', label: defaultMessages.avgNegativeSlope
    }
];
//# sourceMappingURL=constants.js.map