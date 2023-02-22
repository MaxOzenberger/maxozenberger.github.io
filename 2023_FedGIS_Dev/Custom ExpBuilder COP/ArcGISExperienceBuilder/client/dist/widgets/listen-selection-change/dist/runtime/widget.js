System.register(["jimu-core","jimu-ui"], function(__WEBPACK_DYNAMIC_EXPORT__, __system_context__) {
	var __WEBPACK_EXTERNAL_MODULE_jimu_core__ = {};
	var __WEBPACK_EXTERNAL_MODULE_jimu_ui__ = {};
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_core__, "__esModule", { value: true });
	Object.defineProperty(__WEBPACK_EXTERNAL_MODULE_jimu_ui__, "__esModule", { value: true });
	return {
		setters: [
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_core__[key] = module[key];
				});
			},
			function(module) {
				Object.keys(module).forEach(function(key) {
					__WEBPACK_EXTERNAL_MODULE_jimu_ui__[key] = module[key];
				});
			}
		],
		execute: function() {
			__WEBPACK_DYNAMIC_EXPORT__(
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "jimu-core":
/*!****************************!*\
  !*** external "jimu-core" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_core__;

/***/ }),

/***/ "jimu-ui":
/*!**************************!*\
  !*** external "jimu-ui" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jimu_ui__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./jimu-core/lib/set-public-path.ts ***!
  \******************************************/
/**
 * Webpack will replace __webpack_public_path__ with __webpack_require__.p to set the public path dynamically.
 * The reason why we can't set the publicPath in webpack config is: we change the publicPath when download.
 * */
// eslint-disable-next-line
// @ts-ignore
__webpack_require__.p = window.jimuConfig.baseUrl;

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************************************!*\
  !*** ./your-extensions/widgets/listen-selection-change/src/runtime/widget.tsx ***!
  \********************************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Widget)
/* harmony export */ });
/* harmony import */ var jimu_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jimu-core */ "jimu-core");
/* harmony import */ var jimu_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! jimu-ui */ "jimu-ui");
/** @jsx jsx */
/**
  Licensing

  Copyright 2022 Esri

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


/**
 * This widget shows how to listen to the selection change of a data source.
 */
function Widget(props) {
    const isDsConfigured = () => {
        if (props.useDataSources && props.useDataSources.length === 1) {
            return true;
        }
        return false;
    };
    const dataRender = (ds, info) => {
        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'record-list' }, ds && ds.getStatus() === jimu_core__WEBPACK_IMPORTED_MODULE_0__.DataSourceStatus.Loaded
            ? ds.getRecords().map((r, i) => {
                if (r.getFieldValue("datetimesubmitted") == ds.getRecords().sort((a, b) => (a.getFieldValue("datetimesubmitted") > b.getFieldValue("datetimesubmitted") ? -1 : 1))[0].getFieldValue("datetimesubmitted")) {
                    let unixDate = r.getFieldValue("datetimesubmitted");
                    let formatDate = String(new Date(unixDate));
                    let priorityValue = r.getFieldValue("PriorityLevel");
                    console.log(formatDate);
                    if (priorityValue == "Critical" || priorityValue == "High") {
                        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'highAlert' },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", { className: 'whiteText' }, "Newest SALUTE Report"),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", null),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", { className: 'whiteText' },
                                "WARNING: A ",
                                r.getFieldValue("PriorityLevel"),
                                " priority SALUTE Report has been submitted recently,"),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", null),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { type: 'tertiary', key: i, onClick: () => ds.selectRecordById(r.getId()), className: "whiteText largeFont" },
                                "Submitted on ",
                                formatDate,
                                ", please click here to review immediately."));
                    }
                    else {
                        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'mediumAlert' },
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", null, "Newest SALUTE Report"),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", null),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h3", null,
                                "Alert: A ",
                                r.getFieldValue("PriorityLevel"),
                                " priority SALUTE Report has been submitted"),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", null),
                            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_ui__WEBPACK_IMPORTED_MODULE_1__.Button, { type: 'tertiary', key: i, onClick: () => ds.selectRecordById(r.getId()), className: "largeFont" },
                                "Submitted on ",
                                formatDate,
                                ", please click here to review."));
                    }
                }
            })
            : null);
    };
    if (!isDsConfigured()) {
        return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("h2", null,
            "New SALUTE Reports will highlight here.",
            (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("br", null),
            "Please configure the data source.");
    }
    return (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", { className: 'widget-listen-selection-change', css: style },
        (0,jimu_core__WEBPACK_IMPORTED_MODULE_0__.jsx)(jimu_core__WEBPACK_IMPORTED_MODULE_0__.DataSourceComponent, { useDataSource: props.useDataSources[0], query: { where: '1=1' }, widgetId: props.id }, dataRender));
}
const style = jimu_core__WEBPACK_IMPORTED_MODULE_0__.css `
  width: 100%;
  height: 100%;
  max-height: 800px;
  overflow: auto;
  .blue-border {
    border: 1px solid var(--primary-500);
  }
  .record-list {
    width: 100%;
    height: 100%;
    overflow: auto;
    text-align: center;
  }
  .highAlert {
    background-image: linear-gradient(to bottom right, red, orange); 
    padding: 5px;
    height: 100%
  }
  .mediumAlert {
    background-image: linear-gradient(to bottom right, yellow, lightgreen); 
    padding: 5px;
    height: 100%
  }
  .whiteText {
    color: white;
  }
  .largeFont {
    font-size: large;
  }
  .largeFont:hover {
    border: 3px solid black
  }
`;

})();

/******/ 	return __webpack_exports__;
/******/ })()

			);
		}
	};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2lkZ2V0cy9saXN0ZW4tc2VsZWN0aW9uLWNoYW5nZS9kaXN0L3J1bnRpbWUvd2lkZ2V0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7OztBQ0FBOzs7S0FHSztBQUNMLDJCQUEyQjtBQUMzQixhQUFhO0FBQ2IscUJBQXVCLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPOzs7Ozs7Ozs7Ozs7Ozs7O0FDTm5ELGVBQWU7QUFDZjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBa0JFO0FBQ21LO0FBQ3JJO0FBRWhDOztHQUVHO0FBQ1ksU0FBUyxNQUFNLENBQUUsS0FBeUI7SUFDdkQsTUFBTSxjQUFjLEdBQUcsR0FBRyxFQUFFO1FBQzFCLElBQUksS0FBSyxDQUFDLGNBQWMsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDN0QsT0FBTyxJQUFJO1NBQ1o7UUFDRCxPQUFPLEtBQUs7SUFDZCxDQUFDO0lBQ0QsTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFjLEVBQUUsSUFBc0IsRUFBRSxFQUFFO1FBQzVELE9BQU8sd0RBQUssU0FBUyxFQUFDLGFBQWEsSUFFN0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyw4REFBdUI7WUFDOUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQzdCLElBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFDO29CQUN0TSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7b0JBQ3BELElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO29CQUNyRCxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUN4QixJQUFHLGFBQWEsSUFBSSxVQUFVLElBQUksYUFBYSxJQUFJLE1BQU0sRUFBQzt3QkFDeEQsT0FBTyx3REFBSyxTQUFTLEVBQUMsV0FBVzs0QkFBQyx1REFBSSxTQUFTLEVBQUMsV0FBVywyQkFBMEI7NEJBQ25GLDBEQUFNOzRCQUNOLHVEQUFJLFNBQVMsRUFBQyxXQUFXOztnQ0FBYSxDQUFDLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQzt1RkFBMEQ7NEJBQ2hJLDBEQUFNOzRCQUNOLCtDQUFDLDJDQUFNLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFDLHFCQUFxQjs7Z0NBQzlGLFVBQVU7NkVBQ2pCLENBQ0w7cUJBQ1A7eUJBRUQ7d0JBQ0UsT0FBTyx3REFBSyxTQUFTLEVBQUMsYUFBYTs0QkFBQyxrRkFBNkI7NEJBQy9ELDBEQUFNOzRCQUNOOztnQ0FBYyxDQUFDLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQzs2RUFBZ0Q7NEJBQzlGLDBEQUFNOzRCQUNOLCtDQUFDLDJDQUFNLElBQUMsSUFBSSxFQUFDLFVBQVUsRUFBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFDLFdBQVc7O2dDQUNwRixVQUFVO2lFQUNqQixDQUNMO3FCQUNQO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDO1lBQ0YsQ0FBQyxDQUFDLElBQUksQ0FFTjtJQUNWLENBQUM7SUFFRCxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUU7UUFDckIsT0FBTzs7WUFFTCwwREFBTTtnREFFSDtLQUNOO0lBQ0QsT0FBTyx3REFBSyxTQUFTLEVBQUMsZ0NBQWdDLEVBQUMsR0FBRyxFQUFFLEtBQUs7UUFDL0QsK0NBQUMsMERBQW1CLElBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBNkIsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFDaEksVUFBVSxDQUNTLENBQ2xCO0FBQ1IsQ0FBQztBQUVELE1BQU0sS0FBSyxHQUFHLDBDQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQ2hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXhiLWNsaWVudC9leHRlcm5hbCBzeXN0ZW0gXCJqaW11LWNvcmVcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L2V4dGVybmFsIHN5c3RlbSBcImppbXUtdWlcIiIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2V4Yi1jbGllbnQvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9leGItY2xpZW50L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9leGItY2xpZW50Ly4vamltdS1jb3JlL2xpYi9zZXQtcHVibGljLXBhdGgudHMiLCJ3ZWJwYWNrOi8vZXhiLWNsaWVudC8uL3lvdXItZXh0ZW5zaW9ucy93aWRnZXRzL2xpc3Rlbi1zZWxlY3Rpb24tY2hhbmdlL3NyYy9ydW50aW1lL3dpZGdldC50c3giXSwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2ppbXVfY29yZV9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qaW11X3VpX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiOyIsIi8qKlxyXG4gKiBXZWJwYWNrIHdpbGwgcmVwbGFjZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB3aXRoIF9fd2VicGFja19yZXF1aXJlX18ucCB0byBzZXQgdGhlIHB1YmxpYyBwYXRoIGR5bmFtaWNhbGx5LlxyXG4gKiBUaGUgcmVhc29uIHdoeSB3ZSBjYW4ndCBzZXQgdGhlIHB1YmxpY1BhdGggaW4gd2VicGFjayBjb25maWcgaXM6IHdlIGNoYW5nZSB0aGUgcHVibGljUGF0aCB3aGVuIGRvd25sb2FkLlxyXG4gKiAqL1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcclxuLy8gQHRzLWlnbm9yZVxyXG5fX3dlYnBhY2tfcHVibGljX3BhdGhfXyA9IHdpbmRvdy5qaW11Q29uZmlnLmJhc2VVcmxcclxuIiwiLyoqIEBqc3gganN4ICovXHJcbi8qKlxyXG4gIExpY2Vuc2luZ1xyXG5cclxuICBDb3B5cmlnaHQgMjAyMiBFc3JpXHJcblxyXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IFlvdVxyXG4gIG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5XHJcbiAgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuICBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvclxyXG4gIGltcGxpZWQuIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZ1xyXG4gIHBlcm1pc3Npb25zIGFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuXHJcbiAgQSBjb3B5IG9mIHRoZSBsaWNlbnNlIGlzIGF2YWlsYWJsZSBpbiB0aGUgcmVwb3NpdG9yeSdzXHJcbiAgTElDRU5TRSBmaWxlLlxyXG4qL1xyXG5pbXBvcnQgeyBSZWFjdCwganN4LCBjc3MsIElNRGF0YVNvdXJjZUluZm8sIERhdGFTb3VyY2UsIERhdGFTb3VyY2VTdGF0dXMsIEZlYXR1cmVMYXllclF1ZXJ5UGFyYW1zLCBBbGxXaWRnZXRQcm9wcywgRGF0YVNvdXJjZUNvbXBvbmVudCwgY2xhc3NOYW1lcyB9IGZyb20gJ2ppbXUtY29yZSdcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSAnamltdS11aSdcclxuXHJcbi8qKlxyXG4gKiBUaGlzIHdpZGdldCBzaG93cyBob3cgdG8gbGlzdGVuIHRvIHRoZSBzZWxlY3Rpb24gY2hhbmdlIG9mIGEgZGF0YSBzb3VyY2UuXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBXaWRnZXQgKHByb3BzOiBBbGxXaWRnZXRQcm9wczx7fT4pIHtcclxuICBjb25zdCBpc0RzQ29uZmlndXJlZCA9ICgpID0+IHtcclxuICAgIGlmIChwcm9wcy51c2VEYXRhU291cmNlcyAmJiBwcm9wcy51c2VEYXRhU291cmNlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgcmV0dXJuIHRydWVcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxuICBjb25zdCBkYXRhUmVuZGVyID0gKGRzOiBEYXRhU291cmNlLCBpbmZvOiBJTURhdGFTb3VyY2VJbmZvKSA9PiB7XHJcbiAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J3JlY29yZC1saXN0Jz5cclxuICAgICAgICB7XHJcbiAgICAgICAgICBkcyAmJiBkcy5nZXRTdGF0dXMoKSA9PT0gRGF0YVNvdXJjZVN0YXR1cy5Mb2FkZWRcclxuICAgICAgICAgICAgPyBkcy5nZXRSZWNvcmRzKCkubWFwKChyLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgaWYoci5nZXRGaWVsZFZhbHVlKFwiZGF0ZXRpbWVzdWJtaXR0ZWRcIikgPT0gZHMuZ2V0UmVjb3JkcygpLnNvcnQoKGEsIGIpID0+IChhLmdldEZpZWxkVmFsdWUoXCJkYXRldGltZXN1Ym1pdHRlZFwiKSA+IGIuZ2V0RmllbGRWYWx1ZShcImRhdGV0aW1lc3VibWl0dGVkXCIpID8gLTEgOiAxKSlbMF0uZ2V0RmllbGRWYWx1ZShcImRhdGV0aW1lc3VibWl0dGVkXCIpKXtcclxuICAgICAgICAgICAgICAgIGxldCB1bml4RGF0ZSA9IHIuZ2V0RmllbGRWYWx1ZShcImRhdGV0aW1lc3VibWl0dGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGZvcm1hdERhdGUgPSBTdHJpbmcobmV3IERhdGUodW5peERhdGUpKTtcclxuICAgICAgICAgICAgICAgIGxldCBwcmlvcml0eVZhbHVlID0gci5nZXRGaWVsZFZhbHVlKFwiUHJpb3JpdHlMZXZlbFwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGZvcm1hdERhdGUpO1xyXG4gICAgICAgICAgICAgICAgaWYocHJpb3JpdHlWYWx1ZSA9PSBcIkNyaXRpY2FsXCIgfHwgcHJpb3JpdHlWYWx1ZSA9PSBcIkhpZ2hcIil7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0naGlnaEFsZXJ0Jz48aDIgY2xhc3NOYW1lPSd3aGl0ZVRleHQnPk5ld2VzdCBTQUxVVEUgUmVwb3J0PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPSd3aGl0ZVRleHQnPldBUk5JTkc6IEEge3IuZ2V0RmllbGRWYWx1ZShcIlByaW9yaXR5TGV2ZWxcIil9IHByaW9yaXR5IFNBTFVURSBSZXBvcnQgaGFzIGJlZW4gc3VibWl0dGVkIHJlY2VudGx5LDwvaDM+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdHlwZT0ndGVydGlhcnknIGtleT17aX0gb25DbGljaz17KCkgPT4gZHMuc2VsZWN0UmVjb3JkQnlJZChyLmdldElkKCkpfSBjbGFzc05hbWU9XCJ3aGl0ZVRleHQgbGFyZ2VGb250XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICBTdWJtaXR0ZWQgb24ge2Zvcm1hdERhdGV9LCBwbGVhc2UgY2xpY2sgaGVyZSB0byByZXZpZXcgaW1tZWRpYXRlbHkuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICByZXR1cm4gPGRpdiBjbGFzc05hbWU9J21lZGl1bUFsZXJ0Jz48aDI+TmV3ZXN0IFNBTFVURSBSZXBvcnQ8L2gyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz5BbGVydDogQSB7ci5nZXRGaWVsZFZhbHVlKFwiUHJpb3JpdHlMZXZlbFwiKX0gcHJpb3JpdHkgU0FMVVRFIFJlcG9ydCBoYXMgYmVlbiBzdWJtaXR0ZWQ8L2gzPiBcclxuICAgICAgICAgICAgICAgICAgICA8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHR5cGU9J3RlcnRpYXJ5JyBrZXk9e2l9IG9uQ2xpY2s9eygpID0+IGRzLnNlbGVjdFJlY29yZEJ5SWQoci5nZXRJZCgpKX0gY2xhc3NOYW1lPVwibGFyZ2VGb250XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICBTdWJtaXR0ZWQgb24ge2Zvcm1hdERhdGV9LCBwbGVhc2UgY2xpY2sgaGVyZSB0byByZXZpZXcuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICA8L2Rpdj5cclxuICB9XHJcblxyXG4gIGlmICghaXNEc0NvbmZpZ3VyZWQoKSkge1xyXG4gICAgcmV0dXJuIDxoMj5cclxuICAgICAgTmV3IFNBTFVURSBSZXBvcnRzIHdpbGwgaGlnaGxpZ2h0IGhlcmUuXHJcbiAgICAgIDxiciAvPlxyXG4gICAgICBQbGVhc2UgY29uZmlndXJlIHRoZSBkYXRhIHNvdXJjZS5cclxuICAgIDwvaDI+XHJcbiAgfVxyXG4gIHJldHVybiA8ZGl2IGNsYXNzTmFtZT0nd2lkZ2V0LWxpc3Rlbi1zZWxlY3Rpb24tY2hhbmdlJyBjc3M9e3N0eWxlfT5cclxuICAgIDxEYXRhU291cmNlQ29tcG9uZW50IHVzZURhdGFTb3VyY2U9e3Byb3BzLnVzZURhdGFTb3VyY2VzWzBdfSBxdWVyeT17eyB3aGVyZTogJzE9MScgfSBhcyBGZWF0dXJlTGF5ZXJRdWVyeVBhcmFtc30gd2lkZ2V0SWQ9e3Byb3BzLmlkfT5cclxuICAgICAge2RhdGFSZW5kZXJ9XHJcbiAgICA8L0RhdGFTb3VyY2VDb21wb25lbnQ+XHJcbiAgPC9kaXY+XHJcbn1cclxuXHJcbmNvbnN0IHN0eWxlID0gY3NzYFxyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBtYXgtaGVpZ2h0OiA4MDBweDtcclxuICBvdmVyZmxvdzogYXV0bztcclxuICAuYmx1ZS1ib3JkZXIge1xyXG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tcHJpbWFyeS01MDApO1xyXG4gIH1cclxuICAucmVjb3JkLWxpc3Qge1xyXG4gICAgd2lkdGg6IDEwMCU7XHJcbiAgICBoZWlnaHQ6IDEwMCU7XHJcbiAgICBvdmVyZmxvdzogYXV0bztcclxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICB9XHJcbiAgLmhpZ2hBbGVydCB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tIHJpZ2h0LCByZWQsIG9yYW5nZSk7IFxyXG4gICAgcGFkZGluZzogNXB4O1xyXG4gICAgaGVpZ2h0OiAxMDAlXHJcbiAgfVxyXG4gIC5tZWRpdW1BbGVydCB7XHJcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tIHJpZ2h0LCB5ZWxsb3csIGxpZ2h0Z3JlZW4pOyBcclxuICAgIHBhZGRpbmc6IDVweDtcclxuICAgIGhlaWdodDogMTAwJVxyXG4gIH1cclxuICAud2hpdGVUZXh0IHtcclxuICAgIGNvbG9yOiB3aGl0ZTtcclxuICB9XHJcbiAgLmxhcmdlRm9udCB7XHJcbiAgICBmb250LXNpemU6IGxhcmdlO1xyXG4gIH1cclxuICAubGFyZ2VGb250OmhvdmVyIHtcclxuICAgIGJvcmRlcjogM3B4IHNvbGlkIGJsYWNrXHJcbiAgfVxyXG5gXHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==