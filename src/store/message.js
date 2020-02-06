export default {
  state: {
    message: {
      show: false,
      // error & success (TODO: warning)
      context: 'success',
      title: ''
    }
  },

  mutations: {
    getMessage (state, {context, title}) {
      state.message.show = true
      state.message.context = context
      state.message.title = title
    },

    hiddenMessage (state) {
      state.message.show = false
    }
  },

  actions: {
    getMessage ({commit}, {context, title}) {
      commit('getMessage', {context, title})
      // Mutations cant be async
      setTimeout(() => {
        commit('hiddenMessage')
      }, 2000)
    }
  },

  getters: {
    message (state) {
      return state.message
    }
  }
}
