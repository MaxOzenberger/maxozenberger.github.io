import { CategoryType } from '../../../../config';
import { getCategoryType } from '../../../../utils/common/serial';
import { convertGroupData } from './common';
const convertRecordsToInlineData = (records, query, intl) => {
    let items = [];
    const categoryType = getCategoryType(query);
    if (categoryType === CategoryType.ByGroup) {
        items = convertGroupData(records, query, intl);
    }
    else if (categoryType === CategoryType.ByField) {
        items = records === null || records === void 0 ? void 0 : records.map(record => record.getData());
    }
    return items;
};
export default convertRecordsToInlineData;
//# sourceMappingURL=serial.js.map