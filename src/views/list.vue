<template>
  <div>
    <router-link to="/list" class="list">{{ value }}</router-link>
    <router-link to="/about">about</router-link>
    <router-link to="/news">news</router-link>
    <router-link to="/">home</router-link>
  </div>
</template>

<script>
//import $ from "jquery";
//import { test2 } from "@/js/plus";
export default {
  data() {
    return {
      value: 'list',
      mock: {}
    }
  },
  created() {
    //console.log(test2());
  },
  mounted() {
    //console.log($('.news'));
  }
}
</script>