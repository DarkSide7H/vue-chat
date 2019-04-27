import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import im from './modules/im'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    im
  },
  getters
})

export default store
