import firebase from 'firebase/app'

import Tags from './tags-help'

export default {
  state: {
    tags: []
  },

  mutations: {
    loadTags (state, payload) {
      state.tags = payload
    },

    newTag (state, payload) {
      state.tags.push(payload)
    }
  },

  actions: {
    // Load All Tags
    async loadTags ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // done logic here
        const tag = await firebase.database().ref('tags').once('value')
        // Get value
        const tags = tag.val()
        // New arr
        const tagsArr = []
        // Get tags key (id)
        Object.keys(tags).forEach(key => {
          const t = tags[key]
          tagsArr.push(
            new Tags(
              t.title,
              t.use,
              t.user,
              key
            )
          )
        })
        // Send Mutation
        commit('loadTags', tagsArr)

        commit('setLoading', false)
      } catch (error) {
        // error logic here
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    // Add New Tag
    async newTag ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // done logic here
        const newTag = new Tags(
          payload.title,
          payload.use,
          getters.user.id
        )

        // Push new Tag
        const tag = await firebase.database().ref('tags').push(newTag)

        // Send mutation
        commit('newTag', {
          ...newTag,
          id: tag.key
        })

        commit('setLoading', false)
      } catch (error) {
        // error logic here
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    // Delete Tag
    async deleteTag ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // done logic here
        await firebase.database().ref('tags').child(id).remove()

        commit('setLoading', false)
      } catch (error) {
        // error logic here
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },

  getters: {
    tags (state, getters) {
      return state.tags.filter(tags => {
        return tags.user === getters.user.id
      })
    }
  }
}
