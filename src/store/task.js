import firebase from 'firebase/app'

import Task from './task-help'

export default {
  state: {
    tasks: []
  },

  mutations: {
    loadTasks (state, payload) {
      state.tasks = payload
    },

    newTask (state, payload) {
      state.tasks.push(payload)
    },

    editTask (state, {id, title, description}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.title = title
      task.description = description
    },

    taskCompleted (state, {id, completed}) {
      const task = state.tasks.find(t => {
        return t.id === id
      })
      task.completed = completed
    }
  },

  actions: {
    // Load all Tasks
    async loadTasks ({commit}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const task = await firebase.database().ref('tasks').once('value')
        // Get value
        const tasks = task.val()
        // New array
        const tasksArr = []
        // Get task key (id)
        Object.keys(tasks).forEach(key => {
          const t = tasks[key]
          tasksArr.push(
            new Task(
              t.title,
              t.description,
              t.whatWatch,
              t.time,
              t.tags,
              t.completed,
              t.editing,
              t.user,
              key
            )
          )
        })
        // Send mutation
        commit('loadTasks', tasksArr)

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    // Create new Task
    async newTask ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Use helped class
        const newTask = new Task(
          payload.title,
          payload.description,
          payload.whatWatch,
          payload.time,
          payload.tags,
          payload.completed,
          payload.editing,
          getters.user.id
        )

        // Push new task
        const task = await firebase.database().ref('tasks').push(newTask)

        // Send mutation
        commit('newTask', {
          ...newTask,
          id: task.key
        })
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    // Edit Task
    async editTask ({commit}, {id, title, description}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('tasks').child(id).update({
          title,
          description
        })
        commit('editTask', {id, title, description})

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    // Change completed
    async taskCompleted ({commit}, {id, completed}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // done logic here
        await firebase.database().ref('tasks').child(id).update({completed})
        commit('taskCompleted', {id, completed})

        commit('setLoading', false)
      } catch (error) {
        // error logic here
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    // Delete Task
    async deleteTask ({commit}, id) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.database().ref('tasks').child(id).remove()

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },

  getters: {
    tasks (state, getters) {
      return state.tasks.filter(task => {
        return task.user === getters.user.id
      })
    },

    tasksCompleted (state, getters) {
      return getters.tasks.filter(task => {
        return task.completed
      })
    },

    tasksNotCompleted (state, getters) {
      return getters.tasks.filter(task => {
        return task.completed === false
      })
    }
  }
}
