import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import LoginView from '@/views/LoginView.vue'
import UserListView from '@/views/UserListView.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/users'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/users')
  } else {
    next()
  }
})

export default router