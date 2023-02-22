/** @jsx jsx */
import { jsx, React } from 'jimu-core';
import { Radio, Label } from 'jimu-ui';
import { SymbolSelector, JimuSymbolType } from 'jimu-ui/advanced/map';
import { SettingSection, SettingRow } from 'jimu-ui/advanced/setting-components';
import { DrawMode } from '../../config';
export const DrawModesSelector = React.memo((props) => {
    const [_currentSymbolsStates, setCurrentSymbolsStates] = React.useState(() => {
        return {
            currentSymbol1: false,
            currentSymbol2: false,
            currentSymbol3: false
        };
    });
    const handlePointSymbolChanged = (symbol) => {
        setCurrentSymbolsStates(Object.assign(Object.assign({}, _currentSymbolsStates), { currentSymbol1: symbol }));
    };
    const handlePolylineSymbolChanged = (symbol) => {
        setCurrentSymbolsStates(Object.assign(Object.assign({}, _currentSymbolsStates), { currentSymbol2: symbol }));
    };
    const handlePolygonSymbolChanged = (symbol) => {
        setCurrentSymbolsStates(Object.assign(Object.assign({}, _currentSymbolsStates), { currentSymbol3: symbol }));
    };
    const drawModesTips = 'drawModes';
    const continuousModeTips = 'continuousMode';
    const udpateModeTips = 'udpateMode';
    return (jsx(React.Fragment, null,
        jsx(SettingSection, { title: drawModesTips },
            jsx(SettingRow, null,
                jsx(Label, { style: { cursor: 'pointer' }, title: continuousModeTips },
                    jsx(Radio, { style: { cursor: 'pointer' }, className: 'm-0 mr-2', title: continuousModeTips, onChange: () => props.onDrawModesChange(DrawMode.Continuous), checked: props.mode === DrawMode.Continuous }),
                    continuousModeTips)),
            jsx(SettingRow, null,
                jsx(Label, { style: { cursor: 'pointer' }, title: udpateModeTips },
                    jsx(Radio, { style: { cursor: 'pointer' }, className: 'm-0 mr-2', title: udpateModeTips, onChange: () => props.onDrawModesChange(DrawMode.Update), checked: props.mode === DrawMode.Update }),
                    udpateModeTips))),
        jsx(SettingSection, null,
            jsx(SettingRow, null,
                jsx("div", null,
                    jsx(SymbolSelector, { jimuSymbolType: JimuSymbolType.Point, symbol: _currentSymbolsStates.currentSymbol1, onPointSymbolChanged: handlePointSymbolChanged })),
                jsx("div", null,
                    jsx(SymbolSelector, { jimuSymbolType: JimuSymbolType.Polyline, symbol: _currentSymbolsStates.currentSymbol2, onPolylineSymbolChanged: handlePolylineSymbolChanged })),
                jsx("div", null,
                    jsx(SymbolSelector, { jimuSymbolType: JimuSymbolType.Polygon, symbol: _currentSymbolsStates.currentSymbol3, onPolygonSymbolChanged: handlePolygonSymbolChanged }))))));
});
//# sourceMappingURL=wip-draw-modes-selector.js.map