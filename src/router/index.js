import Vue from 'vue';
import VueRouter from 'vue-router'

import Home from '../views/home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      //component: home,
      component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // lazyload，到這頁才載入元件
      component: () => import(/* webpackChunkName: "about" */ '@/views/about.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import(/* webpackChunkName: "news" */ '@/views/news.vue'),
    },
  ],
});