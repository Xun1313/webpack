<template>
  <div>
    <router-link to="/news" class="news">{{ value }}</router-link>
    <router-link to="/about">about</router-link>
    <router-link to="/">home</router-link>
    <router-link to="/list">list</router-link>
    <count></count>
  </div>
</template>

<script>
//import $ from "jquery";
//import { test2 } from "@/js/plus";
//import count from '@/components/count.vue'
const count = () => import(/* webpackChunkName: 'count' */'@/components/count.vue')
export default {
  data() {
    return {
      value: 'news',
      mock: {}
    }
  },
  created() {
    //import(/* webpackChunkName: 'plus' */ /* webpackPreload: true  */'@/js/plus').then(({test2}) => console.log(test2()))
    //console.log(test2());
  },
  mounted() {
    //console.log($('.news'));
  },
  components: {
    count
  }
}
</script>

<style lang="scss">
@import '@/scss/pages/news.scss';
</style>