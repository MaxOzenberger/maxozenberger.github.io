/**
  Licensing

  Copyright 2021 Esri

  Licensed under the Apache License, Version 2.0 (the "License"); You
  may not use this file except in compliance with the License. You may
  obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
  implied. See the License for the specific language governing
  permissions and limitations under the License.

  A copy of the license is available in the repository's
  LICENSE file.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ModelController } from './wro-model';
import { WroService } from './wro-service';
export class WroContext {
    constructor() {
        // lib = {
        //   esri: {
        //     esriRequest: esriRequest
        //   }
        // }
        this.modelController = new ModelController();
        // all overriden by widget.tsx
        this.getConfig = () => { };
        this.getId = () => null;
        this.getLabel = () => null;
        this.getPortal = () => { };
        this.getPortalUrl = () => null;
        this.getTheme = () => { };
        this.getUser = () => { };
        this.getView = () => { };
    }
    loadModel(serviceUrl, itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wroService = new WroService();
            const wroModel = yield wroService.loadModel(this, serviceUrl, itemId);
            return wroModel;
        });
    }
    // overriden by widget.tsx
    nls(id, values) {
        return id;
    }
}
//# sourceMappingURL=wro-context.js.map