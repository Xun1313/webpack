<template>
  <div>
    <router-link to="/about" class="about">{{ value }}</router-link>
    <router-link to="/news">news</router-link>
    <router-link to="/">home</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 'about'
    }
  },
  created() {
    console.log('87878787');
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/pages/about.scss';
</style>