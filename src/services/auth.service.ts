import axios from 'axios'
import type { LoginCredentials, User } from '@/stores/auth.store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface AuthResponse {
  access_token: string
  refresh_token: string
  user: User
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'access_token'
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private readonly USER_KEY = 'user_data'

  async login(credentials: LoginCredentials, remember: boolean = false): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, credentials)
      const apiResponse = response.data
      const data = apiResponse.data // Extract the actual data from the wrapper
      
      console.log('Login API response:', apiResponse)
      console.log('Access token:', data.access_token)
      console.log('Refresh token:', data.refresh_token)
      console.log('User data:', data.user)
      
      this.storeTokens(data.access_token, data.refresh_token, remember)
      this.storeUser(data.user, remember)
      
      return data
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error))
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/google/login`)
      const { auth_url } = response.data
      
      window.location.href = auth_url
      
      return new Promise((resolve, reject) => {
        const checkForCallback = () => {
          const urlParams = new URLSearchParams(window.location.search)
          const code = urlParams.get('code')
          
          if (code) {
            this.handleGoogleCallback(code)
              .then(resolve)
              .catch(reject)
          } else {
            setTimeout(checkForCallback, 1000)
          }
        }
        
        checkForCallback()
      })
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error))
    }
  }

  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/auth/google/callback?code=${code}`)
      const apiResponse = response.data
      const data = apiResponse.data // Extract the actual data from the wrapper
      
      this.storeTokens(data.access_token, data.refresh_token)
      this.storeUser(data.user)
      
      return data
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error))
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getAccessToken()
      if (token) {
        await axios.post(`${API_BASE_URL}/api/v1/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearTokens()
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken
      })
      
      const apiResponse = response.data
      const data = apiResponse.data || apiResponse // Handle both wrapped and unwrapped responses
      const { access_token, refresh_token: newRefreshToken } = data
      this.storeTokens(access_token, newRefreshToken)
      
      return access_token
    } catch (error: any) {
      this.clearTokens()
      throw new Error(this.getErrorMessage(error))
    }
  }

  async verifyToken(): Promise<boolean> {
    const token = this.getAccessToken()
    if (!token) {
      console.log('No access token found for verification')
      return false
    }

    try {
      await axios.get(`${API_BASE_URL}/api/v1/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return true
    } catch (error) {
      console.log('Token verification failed:', error)
      return false
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  getUserFromToken(): User | null {
    const userData = localStorage.getItem(this.USER_KEY) || sessionStorage.getItem(this.USER_KEY)
    return userData ? JSON.parse(userData) : null
  }

  private storeTokens(accessToken: string, refreshToken: string, remember: boolean = false): void {
    const storage = remember ? localStorage : sessionStorage
    
    storage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    
    const otherStorage = remember ? sessionStorage : localStorage
    otherStorage.removeItem(this.ACCESS_TOKEN_KEY)
    otherStorage.removeItem(this.REFRESH_TOKEN_KEY)
  }

  private storeUser(user: User, remember: boolean = false): void {
    const storage = remember ? localStorage : sessionStorage
    storage.setItem(this.USER_KEY, JSON.stringify(user))
    
    const otherStorage = remember ? sessionStorage : localStorage
    otherStorage.removeItem(this.USER_KEY)
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(this.USER_KEY)
  }

  private getErrorMessage(error: any): string {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return 'Invalid email or password'
        case 404:
          return 'Account not found'
        case 429:
          return 'Too many attempts. Please try again later'
        case 500:
          return 'Something went wrong. Please try again'
        default:
          return error.response.data?.message || 'An error occurred'
      }
    } else if (error.request) {
      return 'Connection error. Please check your internet'
    } else {
      return error.message || 'An error occurred'
    }
  }
}

export const authService = new AuthService()