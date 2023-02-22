import * as React from 'react';
import { shallow } from 'enzyme';
import AddPopper from '../src/runtime/components/add-popper';
import { mockTheme } from 'jimu-for-test';
describe('Add conversion popper component', function () {
    const mockSelectedFormat = [{
            name: 'dd',
            label: 'DD',
            currentPattern: 'X, Y',
            defaultPattern: 'Y°N, X°E',
            enabled: true,
            isCustom: true
        }];
    const wrapper = shallow(React.createElement(AddPopper, { supportedFormats: mockSelectedFormat, theme: mockTheme }));
    it('Should have specified label', function () {
        expect(wrapper.state('coordinateLabel')).toEqual('DD');
    });
    it('Should have specified current pattern', function () {
        expect(wrapper.state('currentPattern')).toEqual('X, Y');
    });
    it('Reset current pattern', function () {
        wrapper.find('.reset-button').simulate('click');
        expect(wrapper.state('currentPattern')).toEqual('Y°N, X°E');
    });
    it('Format section visible for coordinate types other than address', function () {
        expect(wrapper.find('.hidden').length).toEqual(0);
    });
    it('Hide format section for address', function () {
        const mockAddressFormat = [{
                name: 'address',
                label: 'Address',
                currentPattern: '',
                defaultPattern: '',
                enabled: true,
                isCustom: true
            }];
        const wrapper1 = shallow(React.createElement(AddPopper, { supportedFormats: mockAddressFormat, theme: mockTheme }));
        expect(wrapper1.find('.hidden').length).toEqual(1);
    });
});
//# sourceMappingURL=add-popper.test.js.map