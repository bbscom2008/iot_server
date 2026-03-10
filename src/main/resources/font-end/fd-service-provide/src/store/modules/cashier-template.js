

/**
 *  收银台模板  
 */

const state = {
  templates: []
}

const mutations = {
  ADD_TEMPLATE: (state, value) => {
    state.templates.push(value)
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
