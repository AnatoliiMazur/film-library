export default class Tags {
  constructor (
    title,
    use,
    user = null,
    id = null
  ) {
    this.title = title
    this.use = use
    this.user = user
    this.id = id
  }
}
