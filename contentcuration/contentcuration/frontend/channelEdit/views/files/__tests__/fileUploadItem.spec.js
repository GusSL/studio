import { mount } from '@vue/test-utils';
import FileUploadItem from '../FileUploadItem';
import store from '../../../store';
import Uploader from 'shared/views/files/Uploader';

const testFile = { id: 'test' };
function makeWrapper(props = {}, file = {}) {
  return mount(FileUploadItem, {
    store,
    attachToDocument: true,
    propsData: {
      file:
        file === null
          ? null
          : {
              ...testFile,
              ...file,
            },
      preset: {
        id: 'document',
        kind_id: 'document',
        display: true,
      },
      ...props,
    },
  });
}

describe('fileUploadItem', () => {
  describe('render', () => {
    it('should show a status error if the file has an error', () => {
      let wrapper = makeWrapper({}, { error: true });
      expect(wrapper.find('[data-test="status"]').exists()).toBe(true);
    });
    it('should show an upload button if file is null', () => {
      let wrapper = makeWrapper({ viewOnly: false }, null);
      expect(wrapper.find('[data-test="upload-link"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="radio"]').exists()).toBe(false);
    });
  });

  describe('props', () => {
    it('should show the remove icon only if allowFileRemove and !viewOnly is false', () => {
      let viewOnlyWrapper = makeWrapper();
      expect(viewOnlyWrapper.find('[data-test="remove"]').exists()).toBe(false);

      let noRemoveWrapper = makeWrapper({ viewOnly: false });
      expect(noRemoveWrapper.find('[data-test="remove"]').exists()).toBe(false);

      let allowRemoveWrapper = makeWrapper({ viewOnly: false, allowFileRemove: true });
      expect(allowRemoveWrapper.find('[data-test="remove"]').exists()).toBe(true);
    });
    it('viewOnly should set whether file can be uploaded', () => {
      let viewOnlyWrapper = makeWrapper({}, null);
      expect(viewOnlyWrapper.find('[data-test="upload-link"]').exists()).toBe(false);

      let editWrapper = makeWrapper({ viewOnly: false }, null);
      expect(editWrapper.find('[data-test="upload-link"]').exists()).toBe(true);
    });
  });
  describe('methods', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = makeWrapper();
    });
    it('Uploader emitted uploading event should get emitted with emitted file', () => {
      const file = {
        checksum: 'file-1',
      };
      wrapper.find(Uploader).vm.$emit('uploading', file);
      expect(wrapper.emitted('uploading')[0][0]).toBe(file);
    });
    it('selecting the item should emit a selected event', () => {
      wrapper.find('[data-test="list-item"]').trigger('click');
      expect(wrapper.emitted('selected')).toHaveLength(1);
    });
    it('clicking an editable item should open a file dialog instead of selecting', () => {
      wrapper.setProps({ viewOnly: false });
      wrapper.find('[data-test="list-item"]').trigger('click');
      expect(wrapper.emitted('selected')).toBeUndefined();
    });
    it('clicking remove icon should emit a remove event', () => {
      wrapper.setProps({ viewOnly: false, allowFileRemove: true });
      wrapper.find('[data-test="remove"]').trigger('click');
      expect(wrapper.emitted('remove')[0][0].id).toBe('test');
    });
  });
});
