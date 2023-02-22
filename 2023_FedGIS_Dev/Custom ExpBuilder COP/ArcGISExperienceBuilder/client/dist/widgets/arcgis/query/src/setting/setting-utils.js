import { DataSourceTypes } from 'jimu-core';
export const getOutputJsonOriginDs = (ds) => {
    if (!ds) {
        return null;
    }
    if (ds.type === DataSourceTypes.SceneLayer) {
        /**
         * If is scene layer data source, will use associated feature layer data source to generate output data source.
         */
        return ds.getAssociatedDataSource();
    }
    else {
        return ds;
    }
};
//# sourceMappingURL=setting-utils.js.map