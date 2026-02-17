import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/veterinarias',
                    name: 'veterinarias',
                    component: () => import('@/modules/admin/PanelAdministrador.vue')
                },
                {
                    path: '/mi-veterinaria',
                    name: 'mi-veterinaria',
                    component: () => import('@/modules/veterinaria/views/DashboardVeterinaria.vue')
                },
                {
                    path: '/mascotas/:id',
                    name: 'editar-mascota',
                    component: () => import('@/modules/mascotas/views/Mascota.vue')
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach((to, from, next) => {
    // Verificar la existencia del token

    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        next({ name: 'login' }); // redirige al login
    } else if (to.name === 'login' && token) {
        next({ name: 'dashboard' });
    } else {
        next();
    }
});

export default router;
