import axios from 'axios'
import { authService } from './auth.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export interface User {
  id: string
  email: string
  name?: string
  created_at?: string
  updated_at?: string
}

class UserService {
  async getAllUsers(): Promise<User[]> {
    const token = authService.getAccessToken()
    if (!token) {
      console.log('No authentication token available for user list request')
      throw new Error('No authentication token')
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/users/list`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      console.log('Users API response:', response.data)
      
      // Handle wrapped response structure like login API
      const apiResponse = response.data
      const data = apiResponse.data || apiResponse
      
      console.log('Processed users data:', data)
      
      // Ensure we return an array
      if (Array.isArray(data)) {
        return data
      } else if (data && Array.isArray(data.users)) {
        return data.users
      } else {
        console.warn('Users API did not return an array:', data)
        return []
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        try {
          await authService.refreshToken()
          const newToken = authService.getAccessToken()
          const response = await axios.post(`${API_BASE_URL}/api/v1/users/list`, {}, {
            headers: {
              Authorization: `Bearer ${newToken}`
            }
          })
          
          // Handle wrapped response structure for retry as well
          const apiResponse = response.data
          const data = apiResponse.data || apiResponse
          
          if (Array.isArray(data)) {
            return data
          } else if (data && Array.isArray(data.users)) {
            return data.users
          } else {
            return []
          }
        } catch (refreshError) {
          throw new Error('Authentication failed')
        }
      }
      throw new Error(error.response?.data?.message || 'Failed to load users')
    }
  }

  async getUserById(userId: string): Promise<User> {
    const token = authService.getAccessToken()
    if (!token) {
      throw new Error('No authentication token')
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/info/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to load user')
    }
  }
}

export const userService = new UserService()