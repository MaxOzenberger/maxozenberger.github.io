/**
 * Toggle items in an array
 */
export const toggleItemInArray = (item, items = []) => items.includes(item) ? items.filter(i => i !== item) : [...items, item];
/**
 * A factory to create a function of getting i18n message
 */
export function createGetI18nMessage(options) {
    const { intl, defaultMessages = {} } = options || {};
    const getI18nMessage = (id, options) => {
        const { messages, values } = options || {};
        return intl.formatMessage({ id, defaultMessage: (messages || defaultMessages)[id] }, values);
    };
    return getI18nMessage;
}
//# sourceMappingURL=utils.js.map