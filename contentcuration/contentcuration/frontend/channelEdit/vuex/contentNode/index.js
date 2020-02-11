import * as getters from './getters';
import * as mutations from './mutations';
import * as actions from './actions';
import { TABLE_NAMES, CHANGE_TYPES } from 'shared/data';

export default {
  namespaced: true,
  state: () => {
    let expandedNodes = {};
    if (window.sessionStorage) {
      expandedNodes = JSON.parse(window.sessionStorage.getItem('expandedNodes') || '{}');
    }
    return {
      contentNodesMap: {},
      treeNodesMap: {},
      expandedNodes,
    };
  },
  getters,
  mutations,
  actions,
  listeners: {
    [TABLE_NAMES.CONTENTNODE]: {
      [CHANGE_TYPES.CREATED]: 'ADD_CONTENTNODE',
      [CHANGE_TYPES.UPDATED]: 'UPDATE_CONTENTNODE',
      [CHANGE_TYPES.DELETED]: 'REMOVE_CONTENTNODE',
    },
    [TABLE_NAMES.TREE]: {
      [CHANGE_TYPES.CREATED]: 'ADD_TREENODE',
      [CHANGE_TYPES.UPDATED]: 'UPDATE_TREENODE',
      [CHANGE_TYPES.DELETED]: 'REMOVE_TREENODE',
    },
  },
};