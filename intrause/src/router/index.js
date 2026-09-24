import { createRouter, createWebHistory } from 'vue-router'
import * as jose from 'jose'

import LoginView from '../views/LoginView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: LoginView
        },
        {
            path: '/welcome',
            name: 'welcome',
            component: WelcomeView,
            meta: { requiresAuth: true }
        },
        {
            path: '/home',
            component: HomeView,
            children: [
                {
                    path: '/home',
                    name: 'dashboard',
                    component: () => import('../views/DashboardView.vue'),
                    meta: { requiresAuth: true, requiresStudent: true }
                },
                {
                    path: '/marks',
                    name: 'marks',
                    component: () => import('../views/MarkView.vue'),
                    meta: { requiresAuth: true, requiresStudent: true }
                },
                {
                    path: '/payments',
                    name: 'payments',
                    component: () => import('../views/PaymentView.vue'),
                    meta: { requiresAuth: true, requiresStudent: true }
                },
                {
                    path: '/documents',
                    name: 'documents',
                    component: () => import('../views/DocumentView.vue'),
                    meta: { requiresAuth: true, requiresStudent: true }
                }
            ]
        }
    ]
})

router.beforeEach((to) => {
    // Si ya existe un token, redirigir al welcome
    if (to.name == 'login') {
        if (localStorage.getItem('use')) {
            router.push({ name: 'welcome' })
        }
    }
    // Comprobar la existencia y validez del token
    if (to.meta.requiresAuth) {
        if (to.meta.requiresStudent) {
            if (!localStorage.getItem('student')) {
                router.push({ name: 'welcome' })
            }
        }
        if (!localStorage.getItem('use')) {
            router.push({ name: 'login' })
        } else {
            validateToken()
        }
    }
})

// verificar la validez de un token
async function validateToken() {
    try {
        let token = JSON.parse(localStorage.getItem('use'))
        let secret = new TextEncoder().encode('mysecretkey')
        await jose.jwtVerify(token, secret)
    } catch (error) {
        localStorage.removeItem('use')
        router.push({ name: 'login' })
    }
}

export default router
