<template>
  <v-app>
    <v-app-bar elevation="1" color="primary">
      <v-app-bar-title>
        <v-icon class="mr-2">mdi-account-group</v-icon>
        stPlaner - Users
      </v-app-bar-title>
      
      <template v-slot:append>
        <div class="d-flex align-center">
          <v-chip class="mr-4" color="primary" variant="text">
            <v-icon start>mdi-account</v-icon>
            {{ authStore.user?.email }}
          </v-chip>
          
          <v-btn
            @click="handleLogout"
            variant="text"
            color="white"
            :loading="authStore.isLoading"
          >
            <v-icon start>mdi-logout</v-icon>
            Logout
          </v-btn>
        </div>
      </template>
    </v-app-bar>
    
    <v-main>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title class="d-flex justify-space-between align-center">
                <span>All Users</span>
                <v-chip color="primary" variant="text">
                  {{ users.length }} users
                </v-chip>
              </v-card-title>
              
              <v-card-text>
                <v-data-table
                  :headers="headers"
                  :items="users"
                  :loading="isLoading"
                  class="elevation-1"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      size="small"
                      variant="text"
                      color="primary"
                      @click="viewUser(item)"
                    >
                      <v-icon>mdi-eye</v-icon>
                    </v-btn>
                  </template>
                  
                  <template v-slot:loading>
                    <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { userService, type User } from '@/services/user.service'

const router = useRouter()
const authStore = useAuthStore()

const users = ref<User[]>([])
const isLoading = ref(false)

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const loadUsers = async () => {
  isLoading.value = true
  try {
    const result = await userService.getAllUsers()
    users.value = Array.isArray(result) ? result : []
    console.log('Users loaded:', users.value)
  } catch (error) {
    console.error('Error loading users:', error)
    users.value = [] // Ensure it's always an array
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const viewUser = (user: any) => {
  console.log('View user:', user)
}

onMounted(() => {
  loadUsers()
})
</script>