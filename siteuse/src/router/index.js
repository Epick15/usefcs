import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView,
            children: [
                {
                    path: '/',
                    name: 'index',
                    component: () => import('../views/IndexView.vue')
                },
                {
                    path: '/nosotros',
                    name: 'nosotros',
                    component: () => import('../views/NosotrosView.vue')
                },
                {
                    path: '/admision',
                    name: 'admision',
                    component: () => import('../views/AdmisionView.vue')
                },
                {
                    path: '/obstetricia-de-alto-riesgo',
                    name: 'aro',
                    component: () => import('../views/ProgramaAro.vue')
                },
                {
                    path: '/ecografia-obstetrica',
                    name: 'eco',
                    component: () => import('../views/ProgramaEco.vue')
                },
                {
                    path: '/salud-reproductiva',
                    name: 'cacu',
                    component: () => import('../views/ProgramaCacu.vue')
                }
            ]
        }
    ]
})

export default router
