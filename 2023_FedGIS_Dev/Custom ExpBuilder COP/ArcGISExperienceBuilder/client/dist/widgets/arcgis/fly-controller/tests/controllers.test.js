var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initGlobal } from 'jimu-for-test';
// import utils from '../src/runtime/components/utils/utils';
// import ControllerFactory, {FlyMode} from '../src/runtime/components/controller-factory'
initGlobal();
describe('test api', () => {
    function fetchApiUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const apiUrl = 'https://js.arcgis.com/4.18/' + url;
            return yield fetch(apiUrl, { cache: 'no-cache', method: 'GET' });
        });
    }
    it('fetch Camera Api', () => __awaiter(void 0, void 0, void 0, function* () {
        const glCamera = yield fetchApiUrl('esri/views/3d/webgl-engine/lib/Camera.js');
        expect(glCamera.ok).toBe(true);
        expect(glCamera.status).toBe(200);
    }));
    it('fetch cameraUtils Api', () => __awaiter(void 0, void 0, void 0, function* () {
        const cameraUtils = yield fetchApiUrl('esri/views/3d/support/cameraUtils');
        expect(cameraUtils.ok).toBe(true);
        expect(cameraUtils.status).toBe(200);
    }));
});
// jest.mock('../src/runtime/components/utils/utils', () => {
//   return {
//     //externalRenderers:() => {}
//   }
// })
// describe('test controller', () => {
// it('rotate controller', () => {
//   const rotateController = ControllerFactory.make({
//     uuid: 'test-rotate-id',
//     mode: FlyMode.Rotate,
//     //debug?: boolean,
//     sceneView: {on:(()=>{})},
//     callbacks: null
//   });
//   expect(rotateController.GLCamera).toBeTruthy();
// });
// });
//# sourceMappingURL=controllers.test.js.map