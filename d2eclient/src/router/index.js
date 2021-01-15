import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    base: process.env.BASE_URL,
    scrollBehavior: (to, from, savedPosition) => {
        if (to.hash) return { selector: to.hash }
        if (savedPosition) return savedPosition

        return { x: 0, y: 0 }
    },
    routes: [{
            path: '/',
            redirect: '/overview'
        },
        {
            path: '/overview',
            name: 'Overview',
            component: () =>
                import ('@/views/Overview'),
        },
    ]


})


export const routes = [


];

export default router