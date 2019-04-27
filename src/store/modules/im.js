import {dotData} from '@/utils'
import Vue from 'vue'
// im聊天状态
const IM_CHART_DIALOG = {
  state: {
    visible: false, // 显示隐藏
    rosterList: [], // 好友列表
    groupList: [],  // 群组列表
    groupMessageMap: {}, // 聊天信息集合
    groupMessageHistoryMap: {}, // 历史消息
    currentGroupId: '', // 当前活动
    extMap: {}, // 附加信息
    eNameMap: {}, // 用户名信息
    disabledGroupId: [],
    groupIdMap: {}, // 群消息
    readonlyGroupIdArr: [] // 只读的groupId
  },
  mutations: { // 修改状态
    SET_IM_CHART_DIALOG_VISIBLE(state, {visible}) { // 弹窗可见/隐藏
      state.visible = visible
    },
    SET_IM_CHART_ROSTERLIST(state, rosterList) {
      state.rosterList = rosterList
    },
    SET_IM_CHART_GROUPLIST(state, groupList) {
      state.groupList = groupList
    },
    PUSH_IM_CHART_DIALOG_GROUP_MESSAGE(state, {message, groupId}) { // 用户聊天信息
      let chart = state.groupMessageMap[groupId] || []
      chart.push(message)
      Vue.set(state.groupMessageMap, groupId, chart)
    },
    UN_SHIFT_IM_CHART_DIALOG_GROUP_MESSAGE(state, {message, groupId}) { // 用户聊天信息
      let chart = state.groupMessageMap[groupId] || []
      chart.unshift(message)
      Vue.set(state.groupMessageMap, groupId, chart)
    },
    REMOVE_IM_CHART_DIALOG_GROUP_MESSAGE(state, groupId) { // 移除一个群聊
      let chart = state.groupMessageMap
      delete chart[groupId]
      state.groupMessageMap = chart
    },
    SET_IM_CHART_DIALOG_GROUP_ID(state, groupId) { // 设置当前用户组
      state.currentGroupId = groupId
    },
    SET_IM_CHART_EXT_MAP(state, {groupId, ext}) { // 设置group 附加信息
      if (!state.extMap[groupId]) {
        Vue.set(state.extMap, groupId, ext)
      }
    },
    REMOVE_IM_CHART_EXT_MAP(state, groupId) { // 移除一个群聊追加消息
      let ext = state.extMap
      delete ext[groupId]
      state.extMap = ext
    },
    REMOVE_IM_CHART_GROUP_ID(state, groupId) {
      let groupIdMap = state.groupIdMap
      delete groupIdMap[groupId]
      state.groupIdMap = groupIdMap
    },
    // eName 和用户进行映射
    SET_IM_CHART_DIALOG_MEMBER_E_NAME(state, {eName, member}) {
      Vue.set(state.eNameMap, eName, member)
    },
    // 使当前用户组消息已读
    SET_IM_CHART_DIALOG_GROUP_ID_READ(state, groupId) {
      if (state.visible) {
        let chart = state.groupMessageMap[groupId] || []
        chart.forEach(v => {
          Vue.set(v, 'isRead', true)
        })
        Vue.set(state.groupMessageMap, groupId, chart)
      }
    },
    // 禁用的groupId
    PUSH_IM_CHART_DIALOG_DISABLE_GROUP_ID(state, groupId) {
      state.disabledGroupId.push(groupId)
    },
    // 群组信息
    SET_IM_CHART_DIALOG_GROUP_ID_INFO(state, {groupId, info}) {
      if (groupId) {
        Vue.set(state.groupIdMap, groupId, info)
      }
    },
    // 清除群消息
    CLEAR_IM_CHART_DIALOG_GROUP_ID_INFO(state) {
      state.groupIdMap = {}
    },
    // 历史记录拉取 第一次拉取为真
    SET_IM_GROUP_MESSAGE_HISTORY_FIRST(state, {groupId}) {
      let obj = state.groupMessageHistoryMap[groupId] || {}
      Vue.set(obj, 'first', true)
      Vue.set(state.groupMessageHistoryMap, groupId, obj)
    },
    // 历史记录拉取 已经没有数据了
    SET_IM_GROUP_MESSAGE_HISTORY_OVER(state, {groupId}) {
      let obj = state.groupMessageHistoryMap[groupId] || {}
      Vue.set(obj, 'over', true)
      Vue.set(state.groupMessageHistoryMap, groupId, obj)
    },
    // 只读的消息列表
    SET_IM_READ_ONLY_GROUP_ID(state, {groupId}) {
      state.readonlyGroupIdArr.push(groupId)
    }
  },
  actions: { // 调用方法（接收传进来的参数）
    // 展示弹窗
    SET_IM_CHART_DIALOG_VISIBLE({commit}, {visible}) { // 弹窗可见
      commit('SET_IM_CHART_DIALOG_VISIBLE', {visible})
    },
    // 好友列表
    SET_IM_CHART_ROSTERLIST({commit}, rosterList) {
      commit('SET_IM_CHART_ROSTERLIST', rosterList)
    },
    // 群组列表
    SET_IM_CHART_GROUPLIST({commit}, groupList) {
      commit('SET_IM_CHART_GROUPLIST', groupList)
    },
    // 添加消息
    PUSH_IM_CHART_DIALOG_GROUP_MESSAGE({commit}, message) { // 聊天信息组
      const groupId = dotData(message, 'groupId')
      const ext = dotData(message, 'ext')
      delete message.ext
      commit('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', {groupId, message})
      commit('SET_IM_CHART_EXT_MAP', {groupId, ext}) // 设置附加消息
    },
    UN_SHIFT_IM_CHART_DIALOG_GROUP_MESSAGE({commit}, message) { // 聊天信息组
      const groupId = dotData(message, 'groupId')
      const ext = dotData(message, 'ext')
      delete message.ext
      commit('UN_SHIFT_IM_CHART_DIALOG_GROUP_MESSAGE', {groupId, message})
      commit('SET_IM_CHART_EXT_MAP', {groupId, ext}) // 设置附加消息
    },
    REMOVE_IM_CHART_DIALOG_GROUP_ID({commit, getters}, groupId) {
      commit('REMOVE_IM_CHART_DIALOG_GROUP_MESSAGE', groupId) // 移除消息
      commit('REMOVE_IM_CHART_EXT_MAP', groupId) // 移除附加消息
      // 移除一个群
      commit('REMOVE_IM_CHART_GROUP_ID', groupId)
      commit('PUSH_IM_CHART_DIALOG_DISABLE_GROUP_ID', groupId)
      if (groupId === getters.GET_IM_CHART_DIALOG_GROUP_ID) {
        commit('SET_IM_CHART_DIALOG_GROUP_ID', '')
      }
    },
    // 添加追加信息
    SET_IM_CHART_EXT_MAP({commit}, {groupId, ext}) {
      commit('SET_IM_CHART_EXT_MAP', {groupId, ext})
    },
    // 设置当前groupId
    SET_IM_CHART_DIALOG_GROUP_ID({commit}, groupId) {
      commit('SET_IM_CHART_DIALOG_GROUP_ID', groupId)
      commit('SET_IM_CHART_DIALOG_GROUP_ID_READ', groupId)
    },
    // 添加禁用的groupId
    PUSH_IM_CHART_DIALOG_DISABLE_GROUP_ID({commit, getters}, groupId) {
      if (groupId) {
        commit('PUSH_IM_CHART_DIALOG_DISABLE_GROUP_ID', groupId)
        if (groupId === getters.GET_IM_CHART_DIALOG_GROUP_ID) {
          commit('SET_IM_CHART_DIALOG_GROUP_ID', '')
        }
      }
    },
    SET_IM_CHART_DIALOG_GROUP_ID_INFO({commit}, {groupId, info}) { // 设置群聊信息
      commit('SET_IM_CHART_DIALOG_GROUP_ID_INFO', {groupId, info})
      if (Array.isArray(info.members)) {
        info.members.forEach(v => {
          commit('SET_IM_CHART_DIALOG_MEMBER_E_NAME', {eName: v.userEasemobName, member: v})
        })
      }
    },
    CLEAR_IM_CHART_DIALOG_GROUP_ID_INFO({commit}) { // 清空群信息
      commit('CLEAR_IM_CHART_DIALOG_GROUP_ID_INFO')
    },
    SET_IM_GROUP_MESSAGE_HISTORY_FIRST({commit}, {groupId}) { // 第一次访问历史消息
      commit('SET_IM_GROUP_MESSAGE_HISTORY_FIRST', {groupId})
    },
    SET_IM_GROUP_MESSAGE_HISTORY_OVER({commit}, {groupId}) { // 已无历史消息
      commit('SET_IM_GROUP_MESSAGE_HISTORY_OVER', {groupId})
    },
    SET_IM_READ_ONLY_GROUP_ID({commit}, {groupId}) { // 只读消息
      commit('SET_IM_READ_ONLY_GROUP_ID', {groupId})
    }
  },
  getters: { // 弹窗展示
    GET_IM_CHART_DIALOG_VISIBLE: state => {
      return state.visible
    },
    GET_IM_CHART_ROSTERLIST: state => {
      return state.rosterList || []
    },
    GET_IM_CHART_GROUPLIST: state => {
      return state.groupList || []
    },
    GET_IM_CHART_DIALOG_GROUP_ID: state => { // 获取当前groupId
      return state.currentGroupId
    },
    GET_IM_CHART_EXT_MAP: (state) => (groupId) => { // 根据用户组获取
      if (state.extMap[groupId]) {
        return state.extMap[groupId]
      }
    },
    GET_IM_CHART_DIALOG_GROUP_MESSAGE: (state) => (groupId) => { // 获取消息组
      if (groupId) {
        return state.groupMessageMap[groupId] || []
      }
      return []
    },
    GET_IM_CHART_DIALOG_MEMBER_E_NAME: (state) => (eName) => { // 根据环信name 获取用户信息
      if (eName) {
        return state.eNameMap[eName] || {}
      }
      return state.eNameMap
    },
    // 获取未读消息条数
    GET_IM_CHART_DIALOG_UN_READ_LENGTH: (state, getters) => (groupId) => { // 根据环信name 获取用户信息
      if (Array.isArray(groupId)) {
        let temp = 0
        groupId.forEach(id => {
          temp += getters.GET_IM_CHART_DIALOG_GROUP_MESSAGE(groupId).filter(v => v.isRead === false).length
        })
        return temp
      } else {
        return getters.GET_IM_CHART_DIALOG_GROUP_MESSAGE(groupId).filter(v => v.isRead === false).length
      }
    },
    // 全部未读消息
    GET_IM_CHART_DIALOG_ALL_UN_READ_LENGTH: (state) => { // 根据环信name 获取用户信息
      let temp = 0
      for (let k in state.groupMessageMap) {
        if (Array.isArray(state.groupMessageMap[k])) {
          temp += state.groupMessageMap[k].filter(v => v.isRead === false).length
        }
      }
      return temp
    },
    // 获取最后一条消息
    GET_IM_CHART_DIALOG_LAST_MESSAGE: (state, getters) => (groupId) => {
      let temp = ''
      if (Array.isArray(groupId)) {
        groupId.forEach(id => {
          let charts = getters.GET_IM_CHART_DIALOG_GROUP_MESSAGE(id)
          let lastChart = ''
          if (charts.length) {
            lastChart = charts[charts.length - 1]
          }
          if (temp) {
            if (lastChart) {
              if (temp.timeStr < lastChart.timeStr) {
                temp = lastChart
              }
            }
          } else {
            if (lastChart) {
              temp = lastChart
            }
          }
        })
      } else {
        let charts = getters.GET_IM_CHART_DIALOG_GROUP_MESSAGE(groupId)
        if (charts.length) {
          temp = charts[charts.length - 1]
        }
      }
      if (temp) {
        switch (temp.fileType) {
          case 'audio':
            return '[语音]'
          case 'image':
            return '[图片]'
          default :
            return temp.sourceMsg
        }
      }
    },
    // 历史消息对象
    GET_IM_GROUP_MESSAGE_HISTORY: (state) => (groupId) => {
      return dotData(state.groupMessageHistoryMap, groupId) || {}
    },
    // 是只读消息
    IS_IM_READ_ONLY_GROUP_ID: (state) => (groupId) => {
      return state.readonlyGroupIdArr.indexOf(groupId) >= 0
    }
  }
}

export default IM_CHART_DIALOG
