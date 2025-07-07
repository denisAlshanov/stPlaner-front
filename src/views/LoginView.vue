<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <div class="text-center mb-6">
          <h1 class="text-h3 font-weight-bold text-primary">stPlaner</h1>
          <p class="text-subtitle-1 mt-2">Welcome back! Please sign in to your account</p>
        </div>
        
        <v-card elevation="4" class="pa-8">
          <v-card-title class="text-h5 text-center mb-4">
            Welcome Back!
          </v-card-title>
          
          <v-form @submit.prevent="handleLogin" ref="loginForm">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              required
              :error-messages="emailError"
              @blur="validateEmail"
              class="mb-4"
            />
            
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              required
              :error-messages="passwordError"
              @blur="validatePassword"
              class="mb-4"
            />
            
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              class="mb-4"
            />
            
            <v-alert
              v-if="authStore.error"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="authStore.clearError"
            >
              {{ authStore.error }}
            </v-alert>
            
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="authStore.isLoading"
              :disabled="!isFormValid"
              class="mb-4"
            >
              Sign In
            </v-btn>
            
            <div class="d-flex align-center my-4">
              <v-divider></v-divider>
              <span class="mx-4 text-body-2 text-medium-emphasis">OR</span>
              <v-divider></v-divider>
            </div>
            
            <v-btn
              @click="handleGoogleLogin"
              variant="outlined"
              size="large"
              block
              :loading="authStore.isLoading"
              class="mb-4"
            >
              <template #prepend>
                <v-icon>mdi-google</v-icon>
              </template>
              Sign in with Google
            </v-btn>
          </v-form>
          
          <div class="text-center mt-4">
            <a href="#" class="text-decoration-none">Forgot Password?</a>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { validateEmail as isValidEmail, validatePassword as isValidPassword } from '@/utils/validators'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const emailError = ref('')
const passwordError = ref('')

const loginForm = ref()

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => isValidEmail(v) || 'Please enter a valid email'
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => isValidPassword(v) || 'Password must be at least 6 characters'
]

const isFormValid = computed(() => {
  return email.value && 
         password.value && 
         isValidEmail(email.value) && 
         isValidPassword(password.value) &&
         !emailError.value &&
         !passwordError.value
})

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required'
  } else if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email'
  } else {
    emailError.value = ''
  }
}

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Password is required'
  } else if (!isValidPassword(password.value)) {
    passwordError.value = 'Password must be at least 6 characters'
  } else {
    passwordError.value = ''
  }
}

const handleLogin = async () => {
  if (!isFormValid.value) return

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
      remember: rememberMe.value
    })
    
    console.log('Login completed, redirecting to users page')
    router.push('/users')
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleGoogleLogin = async () => {
  try {
    await authStore.loginWithGoogle()
    router.push('/users')
  } catch (error) {
    console.error('Google login error:', error)
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/users')
  }
})
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
</style>