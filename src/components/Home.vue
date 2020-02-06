<template lang='pug'>
  .contant-wrapper
    section
      .container
        h1.ui-title-1 Home
        form( @submit.prevent="onSubmit" )
          .form-item( :class="{ errorInput: $v.taskTitle.$error }" )
            input(
              type='text',
              placeholder='What we will watch?',
              v-model='taskTitle',
              @chage="$v.taskTitle.$touch()",
              :class="{ error: $v.taskTitle.$error }"
            )
            .error-box: .error( v-if="!$v.taskTitle.required" ) Title is required.
          textarea(
            v-model='taskDescription'
          )
          .option-list
            input.what-watch--radio(
              type="radio"
              id="radioFilm"
              value="Film"
              v-model="whatWatch"
            )
            label(
              for="radioFilm"
            ) Film
            input.what-watch--radio(
              type="radio"
              id="radioSerial"
              value="Serial"
              v-model="whatWatch"
            )
            label(
              for="radioSerial"
            ) Serial
          // Total Time
          .total-time
            // Film
            .total-time__film(
              v-if="whatWatch === 'Film'"
            )
              span.time-title Hours
              input.time-input(
                type="number"
                v-model='filmHours'
              )
              span.time-title Minutes
              input.time-input(
                type="number"
                v-model='filmMinutes'
              )
              p {{ filmTime }}
            // Serial
            .total-time__serial(
              v-if="whatWatch === 'Serial'"
            )
              span.time-title How many seasons?
              input.time-input(
                type="number"
                v-model='serialSeasons'
              )
              span.time-title How many series?
              input.time-input(
                type="number"
                v-model='serialSeries'
              )
              span.time-title How long is one series (minutes)?
              input.time-input(
                type="number"
                v-model='serialSeriesMinutes'
              )
              p {{ serialTime }}

          // Tag List
          // Add New Tag

          .tag-list.tag-list--add
            .ui-tag__wrapper(
              @click="tagMenuShow = !tagMenuShow"
            )
              .ui-tag
                span.tag-title Add New
                span.button-close(
                  :class="{ active: !tagMenuShow }"
                )

          // Show Input
          transition(name="fade")
            .tag-list.tag-list--menu(
              v-if="tagMenuShow"
            )

              input.tag-add--input(
                type="text"
                placeholder="New tag"
                v-model="tagTitle"
                @keyup.enter="newTag"
              )
              .button.button-default(
                @click="newTag"
              ) Add New Tag

          // All Tags
          .tag-list
            transition-group(
              enter-active-class="animated fadeInRight",
              leave-active-class="animated fadeOutDown"
            )
              .ui-tag__wrapper(
                v-for='tag in tags',
                :key="tag.id"
              )
                .ui-tag(
                  @click="addTagUsed(tag)",
                  :class="{ used: tag.use }"
                )
                  span.tag-title {{ tag.title }}
                  span.button-close(
                    @click="deleteTag(tag.id)"
                  )

            .button-list
              button.button.button--round.button-primary(
                type='submit',
                :disabled="submitStatus === 'PENDING'"
              ) Send
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  data () {
    return {
      submitStatus: null,
      taskTitle: '',
      taskDescription: '',
      whatWatch: 'Film',

      // Total Time
      // Film
      filmHours: 1,
      filmMinutes: 30,
      // Serial
      serialSeasons: 1,
      serialSeries: 11,
      serialSeriesMinutes: 40,

      // Tags
      tagTitle: '',
      tagMenuShow: false,
      tagsUsed: []
    }
  },

  validations: {
    taskTitle: {
      required
    }
  },

  methods: {
    deleteTag (id) {
      this.$store.dispatch('deleteTag', id)
        .then(() => {
          this.$store.dispatch('loadTags')
          console.log('tag was deleted with id - ', id)
        })
    },

    newTag () {
      if (this.tagTitle === '') {
        return
      }
      let tag = {
        title: this.tagTitle,
        use: false
      }
      this.$store.dispatch('newTag', tag)
      this.tagTitle = ''
    },

    onSubmit () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.submitStatus = 'ERROR'
      } else {
        let time
        if (this.whatWatch === 'Film') {
          time = this.filmTime
        } else {
          time = this.serialTime
        }
        let task = {
          title: this.taskTitle,
          description: this.taskDescription,
          whatWatch: this.whatWatch,
          time,
          tags: this.tagsUsed,
          completed: false,
          editing: false
        }

        this.$store.dispatch('newTask', task)

        // Reset
        // Reset $v (validate)
        this.$v.$reset()

        this.taskTitle = ''
        this.taskDescription = ''
        this.tagsUsed = []
        for (let i = 0; i < this.tags.length; i++) {
          this.tags[i].use = false
        }
      }
    },

    addTagUsed (tag) {
      tag.use = !tag.use
      if (tag.use) {
        this.tagsUsed.push({
          title: tag.title
        })
      } else {
        this.tagsUsed.splice(tag.title, 1)
      }
    },

    getHoursAndMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      return `${hours} Hours ${min} Minutes`
    }
  },

  computed: {
    tags () {
      return this.$store.getters.tags
    },

    filmTime () {
      let min = (this.filmHours * 60) + (this.filmMinutes * 1)
      return this.getHoursAndMinutes(min)
    },

    serialTime () {
      let min = this.serialSeasons * this.serialSeries * this.serialSeriesMinutes
      return this.getHoursAndMinutes(min)
    }
  }
}
</script>

<style lang="stylus">
// Options
.option-list
  display flex
  align-items center
  margin-bottom 20px
  .what-watch--radio
    margin-right 12px
  input
    margin-bottom 0
  label
    margin-right 20px
    margin-bottom 0
    &:last-child
      margin-right 0

// Total time
.total-time
  margin-bottom 20px

.time-title
  display block
  margin-bottom 6px

.time-input
  max-width 80px
  margin-right 10px

// Tags
.tag-list
  margin-bottom 20px

.ui-tag__wrapper
  margin-right 18px
  margin-bottom 10px
  &:last-child
    margin-right 0

.ui-tag
  .button-close
    &.active
      transform: rotate(45deg)
  &.used
    background-color: #444ce0
    color #fff
    .button-close
      &:before,
      &:after
        background-color: #fff

// Tag Menu Show
.tag-list--menu
  display flex
  justify-content space-between
  align-items center
// New Tag Input
.tag-add--input
  margin-bottom 0
  margin-right 10px
  height 42px

// Total Time
.total-time
  p
    margin-bottom 6px
  span
    margin-right 16px
  .task-input
    max-width 80px
    margin-bottom 28px
    margin-right 10px

.button-list
  display flex
  justify-content flex-end

</style>
