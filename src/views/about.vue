<template>
  <div>
    <router-link to="/about" class="about">{{ value }}</router-link>
    <router-link to="/news">news</router-link>
    <router-link to="/">home</router-link>
    <count v-if="false"></count>
  </div>
</template>

<script>
import $ from "jquery";
//import { test1 } from "@/js/plus";

const plus = async value => {
  const result = await import(/* webpackChunkName: 'plus' */ '@/js/plus.js')
  return result[value]()
}
//import count from '@/components/count.vue'
const count = () => import(/* webpackChunkName: 'count' */'@/components/count.vue')

//const jquery = import(/* webpackChunkName: 'jquery' */ 'jquery')
export default {
  data() {
    return {
      value: 'about',
    }
  },
  async created() {
    //import(/* webpackChunkName: 'plus' */ '@/js/plus').then(({test1}) => console.log(test1()))
    //console.log(await plus('test1'));
    /* setTimeout(async () => {
      console.log(test);
    }, 1000); */
    /* const { test1 } = await plus()
    console.log(test1()); */
  },
  async mounted() {
    //import(/* webpackChunkName: 'jquery' */ 'jquery').then(res => console.log(res.default('.about')))
    //console.log($('.news'));
    /* const $ = await jquery
    console.log($.default('.about')); */
  },
  components: {
    count
  }
}
</script>

<style lang="scss">
@import '@/scss/pages/about.scss';
</style>