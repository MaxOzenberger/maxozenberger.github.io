var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ControllerMode } from './base-fly-controller';
import RotatingFlyController from './rotating-fly-controller';
import CurveFlyController from './curve-fly-controller';
import LineFlyController from './line-fly-controller';
export default class ControllerFactory {
    static make(initParams) {
        return __awaiter(this, void 0, void 0, function* () {
            let controller;
            const type = initParams.type;
            switch (type) {
                case ControllerMode.Rotate: {
                    controller = yield new RotatingFlyController().setup(initParams);
                    break;
                }
                case ControllerMode.RealPath: {
                    controller = yield new LineFlyController().setup(initParams);
                    break;
                }
                case ControllerMode.Smoothed: {
                    controller = yield new CurveFlyController().setup(initParams);
                    break;
                }
                default: {
                    console.error('ControllerFactory error type:', type);
                }
            }
            return controller;
        });
    }
}
//# sourceMappingURL=controller-factory.js.map