import Vue from 'vue'
import Router from 'vue-router'
import Overview from "@/components/Overview";


Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
                    {
                      path: '/',
                      name: 'Overview',
                      component: Overview
                    },
                    {
                      path: '/download',
                      name: 'Download',
                      component: () => import('@/components/Download.vue'),
                    },
  ]


})


export const routes = [


];

export default router
