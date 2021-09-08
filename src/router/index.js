import Vue from 'vue';
import VueRouter from 'vue-router'

//import Home from '../views/home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  //mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      // component: home,
      // 靜態載入

      component: () => import(/* webpackChunkName: "home" */ '@/views/home.vue'),
      // 動態載入
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ '@/views/about.vue'),
    },
    {
      path: '/news',
      name: 'news',
      component: () => import(/* webpackChunkName: "news" */ '@/views/news.vue'),
    },
    {
      path: '/list',
      name: 'list',
      component: () => import(/* webpackChunkName: "list" */ '@/views/list.vue'),
    },
  ],
});