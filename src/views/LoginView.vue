<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/logo.png'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const mode = ref('login') // 'login' | 'register'
const form = reactive({ email: '', password: '', name: '' })

async function submit() {
  try {
    if (mode.value === 'login') {
      await auth.login(form.email, form.password)
    } else {
      await auth.register(form.email, form.password, form.name)
    }
    router.push(route.query.redirect || '/')
  } catch (e) {
    // error message is already surfaced from auth.error
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  auth.$patch({ error: null })
}
</script>

<template>
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-brand">
        <img :src="logo" alt="Coffer logo" />
        <div>
          <div class="brand-name">MyPochi</div>
          <div class="brand-tag">Money, mapped</div>
        </div>
      </div>

      <h1>{{ mode === 'login' ? 'Welcome back' : 'Create your account' }}</h1>
      <p class="sub">
        {{ mode === 'login' ? 'Sign in to see where your money went.' : 'Takes about a minute — no card required.' }}
      </p>

      <form @submit.prevent="submit">
        <div v-if="mode === 'register'" class="field">
          <label>Name</label>
          <input v-model="form.name" placeholder="Jordan Lee" required />
        </div>
        <div class="field">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="you@example.com" required />
        </div>
        <div class="field">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="At least 8 characters" required minlength="8" />
        </div>

        <p v-if="auth.error" class="field-error">{{ auth.error }}</p>

        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center" :disabled="auth.loading">
          {{ auth.loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account' }}
        </button>
      </form>

      <p class="switch">
        {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
        <button class="link-btn" @click="toggleMode">{{ mode === 'login' ? 'Sign up' : 'Sign in' }}</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ink);
  padding: 20px;
}
.auth-card {
  background: var(--card);
  border-radius: 18px;
  padding: 40px;
  width: 380px;
  max-width: 100%;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
}
.auth-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}
.auth-brand img {
  width: 34px;
  height: 34px;
  border-radius: 9px;
}
.brand-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 15px;
}
.brand-tag {
  font-size: 11px;
  color: var(--text-soft);
}
h1 {
  font-size: 22px;
  margin-bottom: 6px;
}
.sub {
  font-size: 13px;
  color: var(--text-soft);
  margin-bottom: 24px;
}
.switch {
  margin-top: 18px;
  text-align: center;
  font-size: 13px;
  color: var(--text-soft);
}
</style>
