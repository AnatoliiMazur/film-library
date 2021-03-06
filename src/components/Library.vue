<template lang='pug'>
  .contant-wrapper
    section
      .container
        .task-list__header
          h1.ui-title-1 Library
          .buttons-list
            .button.button--round.button-default(
              @click="filter = 'active'"
            ) Active
            .button.button--round.button-default(
              @click="filter = 'completed'"
            ) Completed
            .button.button--round.button-default(
              @click="filter = 'all'"
            ) All

        .task-list
          transition-group( name="taskList" )
            .task-item(
              v-for="task in tasksFilter",
              :key="task.id",
              :class="{ 'completed': task.completed }"
            )
              .ui-card.ui-card--shadow
                .task-item__info
                  .task-item__main-info
                    span.ui-label(
                      :class=`[
                                { 'ui-label--primary': !task.completed },
                                { 'ui-label--light': task.completed }
                              ]`
                    ) {{ task.whatWatch }}
                    span Total Time: {{ task.time }}
                  span.button-close(
                    @click="deleteTask(task.id)"
                  )
                .task-item__content
                  .task-item__header
                    .ui-checkbox-wrapper
                      input.ui-checkbox(
                        type='checkbox',
                        v-model="task.completed",
                        @click="taskCompleted( task.id, task.completed )"
                      )
                    span.ui-title-3 {{ task.title }}
                  .task-item__body
                    p.ui-text-regular {{ task.description }}
                  .task-item__footer
                    .tag-list
                      .ui-tag__wrapper(
                        v-for="tag in task.tags"
                        :key="tag.title"
                      )
                        .ui-tag
                          span.tag-title {{ tag.title }}
                    // Buttons
                    .buttons-list
                      .button.button--round.button-default(
                        @click="taskEdit(task.id, task.title, task.description)"
                      ) Edit
                      .button.button--round(
                        @click="taskCompleted( task.id, task.completed )",
                        :class=`[
                                  { 'button-primary': !task.completed},
                                  { 'button-light': task.completed }
                                ]`
                      )
                        span( v-if='task.completed' ) Return
                        span( v-else ) Done
    // Edit popup
    .ui-messageBox__wrapper(
      v-if="editModal"
      @click='cancelTaskEdit'
      :class="{active: editModal}"
    )
      .ui-messageBox.fadeInDown(
        @click.stop=""
      )
        .ui-messageBox__header
          span.messageBox-title {{ titleEditing }}
          span.button-close(@click="cancelTaskEdit")
        .ui-messageBox__content
          p {{ titleEditing }}
          input(
            type="text"
            v-model='titleEditing',
            @keyup.esc="cancelTaskEdit"
          )
          p Description
          textarea(
            type="text"
            v-model='descrEditing',
            @keyup.esc="cancelTaskEdit"
          )
        .ui-messageBox__footer
          .button.button-light(@click="cancelTaskEdit") Cancel
          .button.button-primary(@click="finishTaskEdit") OK
</template>

<script>
export default {
  data () {
    return {
      filter: 'active',
      editModal: false,
      completed: false,

      taskId: null,
      titleEditing: '',
      descrEditing: ''
    }
  },

  methods: {
    taskCompleted (id, completed) {
      completed ? completed = false : completed = true

      this.$store.dispatch('taskCompleted', {
        id,
        completed
      })
        .then(() => {
          console.log(completed)
        })
    },

    taskEdit (id, title, description) {
      this.editModal = !this.editModal

      this.taskId = id
      this.titleEditing = title
      this.descrEditing = description
    },

    cancelTaskEdit () {
      this.editModal = !this.editModal

      this.taskId = null
      this.titleEditing = ''
      this.descrEditing = ''
    },

    finishTaskEdit () {
      this.$store.dispatch('editTask', {
        id: this.taskId,
        title: this.titleEditing,
        description: this.descrEditing
      })

      this.editModal = !this.editModal
    },

    deleteTask (id) {
      this.$store.dispatch('deleteTask', id)
        .then(() => {
          this.$store.dispatch('loadTasks')
          console.log('task deleted')
        })
    }
  },

  computed: {
    tasksFilter () {
      if (this.filter === 'active') {
        return this.$store.getters.tasksNotCompleted
      } else if (this.filter === 'completed') {
        return this.$store.getters.tasksCompleted
      } else if (this.filter === 'all') {
        return this.$store.getters.tasks
      } else {
        return this.filter === 'active'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
//
// Header buttons list
//
.task-list__header
  display flex
  justify-content space-between
  align-items center
  margin-bottom 30px
.ui-title-1
  margin-bottom 0
//
// Task item
//
.task-item
  margin-bottom 20px
  .ui-checkbox:checked:before
    border-color #909399
  &.completed
    .ui-title-2,
    .ui-text-regular,
    .ui-tag
      text-decoration line-through
      color #909399
  &:last-child
    margin-bottom 0
.ui-tag__wrapper
  margin-right 16px
// Info
.task-item__info
  display flex
  align-items center
  justify-content space-between
  margin-bottom 20px
  .button-close
    width 20px
    height @width
  .ui-label
    margin-right 8px
// Header
.task-item__header
  display flex
  align-items center
  margin-bottom 18px
  .ui-checkbox-wrapper
    margin-right 8px
  .ui-title-2
    margin-bottom 6px
// Body
.task-item__body
  margin-bottom 20px
// Footer
.tag-list
  margin-bottom 20px
.task-item__foter
  .buttons-list
    text-align right
// ALL buttons
.buttons-list
  .button
    margin-right 12px
    &:last-child
      margin-right 0
// POPUP
.ui-messageBox__wrapper
  &.active
    display flex
  .button-light
    margin-right 8px
</style>
