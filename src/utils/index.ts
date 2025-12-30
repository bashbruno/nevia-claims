export const time = Object.freeze({
  millisecond: 1,
  get second() {
    return this.millisecond * 1000
  },
  get minute() {
    return this.second * 60
  },
  get hour() {
    return this.minute * 60
  },
  get day() {
    return this.hour * 24
  },
})
