export var EasingMode;
(function (EasingMode) {
    EasingMode[EasingMode["NONE"] = 0] = "NONE";
    EasingMode[EasingMode["In"] = 1] = "In";
    EasingMode[EasingMode["Out"] = 2] = "Out";
    EasingMode[EasingMode["InOut"] = 3] = "InOut";
    EasingMode[EasingMode["Linear"] = 4] = "Linear";
})(EasingMode || (EasingMode = {}));
export const Ease = {
    /*
    * t: current time
    * b: beginning value
    * c: change in value
    * d: duration
    * Get effect on 'http://easings.net/zh-cn'
    */
    linear: (t, b, c, d) => {
        return c * t / d + b;
    },
    // Quad
    easeIn: (t, b, c, d) => {
        return c * (t /= d) * t + b;
    },
    easeOut: (t, b, c, d) => {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOut: (t, b, c, d) => {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
    // easeInOutCubic = (t, b, c, d) => {
    //   if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    //   return c / 2 * ((t -= 2) * t * t + 2) + b;
    // }
    // easeInOutQuint = (t, b, c, d) => {
    //   if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    //   return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    // }
    // easeInOutExpo = (t, b, c, d) => {
    //   if (t == 0) return b;
    //   if (t == d) return b + c;
    //   if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
    //   return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    // }
};
//# sourceMappingURL=ease.js.map