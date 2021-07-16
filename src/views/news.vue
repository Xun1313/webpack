<template>
  <div>
    <router-link to="/news" class="news">{{ value }}</router-link>
    <router-link to="/about">about</router-link>
    <router-link to="/">home</router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 'news'
    }
  },
  created() {
    console.log('news');
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/pages/news.scss';
</style>