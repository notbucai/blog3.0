/*
 * @Author: bucai
 * @Date: 2021-06-08 09:32:15
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-08 18:06:24
 * @Description: 
 */

import { keywordsList, keywordsDeleteItem, keywordsChangeItemStatus, keywordGenerate } from "../../../api/common";

export default {
  namespaced: true,
  state: {
    tableData: {
      total: 0,
      list: []
    },
    tableLoading: false,
    tableReqData: {
      page_index: 1,
      page_size: 10,
      sort_createAt: 0,
      sort_updatedAt: 0,
      sort_status: 0,
      sort_count: 0
    },
    statusList: [{
      label: "坏的",
      value: -1
    }, {
      label: "正常的",
      value: 0
    }, {
      label: "好的",
      value: 1
    }]
  },
  mutations: {
    SET_TABLE_LIST (state, payload) {
      state.tableData = payload;
    },
    SET_TABLE_REQ_DATA (state, payload) {
      state.tableReqData = {
        ...state.tableReqData,
        ...payload
      };
    },
    SET_TABLE_CHANGE_ITEM (state, { id, data }) {
      const itemIndex = state.tableData.list.findIndex(item => {
        return item.id === id;
      });
      state.tableData.list.splice(itemIndex, data);
    },
    SET_LOADING (state, payload) {
      state.tableLoading = payload;
    }
  },
  actions: {
    async handleLoadTableData ({ state, commit }) {
      commit('SET_LOADING', true)
      const [, res] = await keywordsList(state.tableReqData);
      commit('SET_LOADING', false)
      commit('SET_TABLE_LIST', res);
    },
    async handleChangeTablePage ({ dispatch, commit }, payload) {
      commit('SET_TABLE_REQ_DATA', payload);
      await dispatch('handleLoadTableData')
    },

    async handleChangeItemStatus ({ dispatch, commit, state }, { id, status }) {
      await keywordsChangeItemStatus(id, status);
      const item = state.tableData.list.find(item => {
        return item.id === id;
      });
      commit('SET_TABLE_CHANGE_ITEM', {
        id,
        data: {
          ...item,
          status
        }
      })
    },

    async handleItemRemove ({ dispatch, commit }, id) {
      await keywordsDeleteItem(id);
    },

    async handleInitTask ({ dispatch, commit }) {
      await keywordGenerate();
    }
  }
}