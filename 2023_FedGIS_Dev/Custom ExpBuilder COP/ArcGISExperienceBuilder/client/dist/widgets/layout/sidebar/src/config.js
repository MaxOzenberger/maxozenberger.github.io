import { Immutable } from 'jimu-core';
import { NormalLineType } from 'jimu-ui';
export var CollapseSides;
(function (CollapseSides) {
    CollapseSides["First"] = "FIRST";
    CollapseSides["Second"] = "SECOND";
})(CollapseSides || (CollapseSides = {}));
export var SidebarControllerPositions;
(function (SidebarControllerPositions) {
    SidebarControllerPositions["Start"] = "START";
    SidebarControllerPositions["Center"] = "CENTER";
    SidebarControllerPositions["End"] = "END";
})(SidebarControllerPositions || (SidebarControllerPositions = {}));
export var SidebarType;
(function (SidebarType) {
    SidebarType["Horizontal"] = "HORIZONTAL";
    SidebarType["Vertical"] = "VERTICAL";
})(SidebarType || (SidebarType = {}));
export var ICON_TYPE;
(function (ICON_TYPE) {
    ICON_TYPE["Left"] = "LEFT";
    ICON_TYPE["Right"] = "RIGHT";
    ICON_TYPE["Up"] = "UP";
    ICON_TYPE["Down"] = "DOWN";
})(ICON_TYPE || (ICON_TYPE = {}));
export const defaultConfig = Immutable({
    direction: SidebarType.Horizontal,
    collapseSide: CollapseSides.First,
    overlay: false,
    size: '300px',
    divider: {
        visible: true,
        lineStyle: {
            type: NormalLineType.SOLID,
            color: 'var(--light-500)',
            width: '1px'
        }
    },
    resizable: false,
    toggleBtn: {
        visible: true,
        icon: ICON_TYPE.Left,
        iconSource: 0,
        offsetX: 15,
        offsetY: 0,
        position: SidebarControllerPositions.Center,
        iconSize: 14,
        width: 15,
        height: 60,
        border: {
            type: NormalLineType.SOLID,
            color: 'var(--light-500)',
            width: '1px'
        },
        color: {
            normal: {
                icon: {
                    useTheme: false,
                    color: 'var(--black)'
                },
                bg: {
                    useTheme: true,
                    color: 'var(--light)'
                }
            },
            hover: {
                bg: {
                    useTheme: true,
                    color: 'var(--light)'
                }
            }
        },
        expandStyle: {
            style: {
                borderRadius: '0 92px 92px 0'
            }
        },
        collapseStyle: {
            style: {
                borderRadius: '0 92px 92px 0'
            }
        }
    },
    defaultState: 1
});
//# sourceMappingURL=config.js.map