// GraphicsInfo
import DefaultSymbols from './graphics/default-symbols';
import GraphicsInfo from './graphics/graphics-info';
export { DefaultSymbols };
export { GraphicsInfo };
export const Constraints = {
    SPEED: {
        MIN: 0,
        MAX: 1,
        MULTIPLIER: 8,
        DECIMAL: 3,
        DEFAULT_SPEED: 50
    },
    // max/min values ,#6382
    ALT: {
        MIN: 0,
        MAX: 800,
        STEP: 10
    },
    TILT: {
        MIN: 0,
        MAX: 90,
        STEP: 1
    },
    TIME: {
        MIN: 0
    },
    // calculated value rounded ,#6406
    CALCULATED_VALUE_ROUNDED: {
        ANGLE: 0,
        ELEV: 1,
        TIME: 1
    }
};
//# sourceMappingURL=constraints.js.map