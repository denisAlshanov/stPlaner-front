import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'

export interface User {
  id: string
  email: string
  name?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => {
    return user.value !== null && authService.getAccessToken() !== null
  })

  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials, credentials.remember || false)
      user.value = response.user
      console.log('Login successful, user stored:', user.value)
      return response
    } catch (err: any) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loginWithGoogle = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.loginWithGoogle()
      user.value = response.user
      return response
    } catch (err: any) {
      error.value = err.message || 'Google login failed'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      user.value = null
      authService.clearTokens()
    }
  }

  const checkAuth = async () => {
    try {
      const token = authService.getAccessToken()
      if (!token) {
        console.log('No token found, user not authenticated')
        user.value = null
        return false
      }

      console.log('Token found, verifying...')
      const isValid = await authService.verifyToken()
      if (!isValid) {
        console.log('Token verification failed, logging out')
        await logout()
        return false
      }
      
      console.log('Token verified successfully')
      if (!user.value) {
        const userData = authService.getUserFromToken()
        if (userData) {
          user.value = userData
          console.log('User data loaded from token:', userData)
        }
      }
      
      return true
    } catch (err) {
      console.error('Auth check error:', err)
      user.value = null
      authService.clearTokens()
      return false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    checkAuth,
    clearError
  }
})