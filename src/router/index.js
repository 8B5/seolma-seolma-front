import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue')
    },
    {
        path: '/coupons',
        name: 'Coupons',
        component: () => import('@/views/CouponPage.vue')
    },
    // 공통 에러 페이지
    {
        path: '/error',
        name: 'Error',
        component: () => import('@/views/ErrorPage.vue')
    },
    // 404는 맨 마지막에 위치
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        redirect: () => {
            return {
                name: 'Error',
                query: {
                    code: '404',
                    message: '요청하신 페이지를 찾을 수 없습니다.'
                },
                replace: true // 히스토리 대체
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 라우터 가드
router.beforeEach((to, from, next) => {
    // 에러 페이지가 아닌 경우에만 이전 페이지로 기록
    if (from.path !== '/error' && from.path !== to.path) {
        sessionStorage.setItem('previousPage', from.path)
    }

    next()
})

export default router