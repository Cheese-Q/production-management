/*用户信息*/
import * as types from '../mutation-types'

  const state = {
    user_info: null,
    leftcontent:false
  };

  const getters = {
    getleftcontent : state => state.leftcontent,
    getUserInfo: state => state.user_info
  };

  const mutations = {
    [types.SET_TO_LEFTCONTENT](state,status) {
      state.leftcontent = status || !state.leftcontent
    },
    [types.GET_TO_USERDATA](state,data) {
        state.user_info = data
    }
  }
  const actions = {
    setLeftcontent({ commit }, status = ''){
      commit(types.SET_TO_LEFTCONTENT, status)
    },
   setUserInfo({ commit }, data=null) {
      commit(types.GET_TO_USERDATA, data)
    }
  };

export default {
  state,
  actions,
  getters,
  mutations
}
