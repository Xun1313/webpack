<template>
  <div>
    <router-link to="/" class="home">{{ value }}</router-link>
    <router-link to="/about">about</router-link>
    <router-link to="/news">news</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 'home',
      list: [1,2,3,4,5]
    }
  },
  created() {
    const result = this.list.filter(e => e > 3)

    const testPromise = Promise.resolve()

    class testClass {
      constructor() {

      }

      test() {
        console.log(123);
      }

    }

    const aaa = new testClass()
    aaa.test()
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/pages/home.scss';
</style>