<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/Logo.png'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const mode = ref('login') // 'login' | 'register'
const form = reactive({ email: '', password: '', name: '' })
const googleReady = ref(false)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

function handleGoogleCredential(response) {
  auth.googleLogin(response.credential)
    .then(() => router.push(route.query.redirect || '/dashboard'))
    .catch(() => {})
}

function loadGoogleSignIn() {
  if (!googleClientId) return

  const initialize = () => {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
    })
    googleReady.value = true
  }

  if (window.google?.accounts?.id) {
    initialize()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = initialize
  document.head.appendChild(script)
}

function signInWithGoogle() {
  if (!googleClientId) {
    auth.error = 'Google sign-in is not configured.'
    return
  }
  if (!googleReady.value) return
  window.google.accounts.id.prompt()
}

onMounted(loadGoogleSignIn)

async function submit() {
  try {
    if (mode.value === 'login') {
      await auth.login(form.email, form.password)
    } else {
      await auth.register(form.email, form.password, form.name)
    }
    router.push(route.query.redirect || '/dashboard')
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
    <div class="auth-panel">
      <div class="auth-visual">
        <div class="brand-row">
          <div class="brand-mark">
            <img :src="logo" alt="MyPochi logo" />
          </div>
        </div>

        <div class="hero-copy">
          <span class="eyebrow">Financial clarity</span>
          <h2>Track every dollar with confidence.</h2>
          <p>
            Understand your spending, stay on budget, and keep your goals moving without the guesswork.
          </p>
        </div>

        <ul class="feature-list">
          <li>Live account overview</li>
          <li>Smart budget tracking</li>
          <li>Goal progress insights</li>
        </ul>

        <div class="mini-stats">
          <div>
            <strong>12.4k</strong>
            <span>Transactions</span>
          </div>
          <div>
            <strong>94%</strong>
            <span>On track</span>
          </div>
        </div>
      </div>

      <div class="auth-card">
        <div class="card-header">
          <div>
            <span class="eyebrow auth-eyebrow">{{ mode === 'login' ? 'Welcome back' : 'Get started' }}</span>
            <h1>{{ mode === 'login' ? 'Sign in' : 'Create account' }}</h1>
          </div>
        </div>

        <p class="sub">
          {{ mode === 'login' ? 'Access your dashboard and keep your finances in sync.' : 'Set up your account in less than a minute.' }}
        </p>

        <form @submit.prevent="submit" class="auth-form">
          <div v-if="mode === 'register'" class="field">
            <label for="name">Full name</label>
            <input id="name" v-model="form.name" placeholder="Full name" required />
          </div>

          <div class="field">
            <label for="email">Email address</label>
            <input id="email" v-model="form.email" type="email" placeholder="Email address" required />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" placeholder="At least 8 characters" required minlength="8" />
          </div>

          <p v-if="auth.error" class="field-error">{{ auth.error }}</p>

          <button type="submit" class="btn btn-primary auth-submit" :disabled="auth.loading">
            {{ auth.loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account' }}
          </button>
        </form>

        <div class="auth-divider"><span>or continue with</span></div>

        <button
          type="button"
          class="google-btn"
          :disabled="auth.loading || (!!googleClientId && !googleReady)"
          @click="signInWithGoogle"
        >
          <span class="google-mark" aria-hidden="true">G</span>
          {{ googleReady ? 'Continue with Google' : 'Google sign-in unavailable' }}
        </button>

        <p class="switch">
          {{ mode === 'login' ? "Don't have an account?" : 'Already have an account?' }}
          <button class="link-btn" type="button" @click="toggleMode">
            {{ mode === 'login' ? 'Create one' : 'Sign in' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-screen {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top left, rgba(124, 111, 238, 0.22), transparent 30%),
    linear-gradient(135deg, #f4f4fb 0%, #ececf7 45%, #f8f7fc 100%);
  padding: 16px;
}

.auth-panel {
  width: min(1100px, 100%);
  height: min(680px, 90vh);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(124, 111, 238, 0.08);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(26, 24, 61, 0.12);
  backdrop-filter: blur(8px);
}

.auth-visual {
  position: relative;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(124, 111, 238, 0.35), transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(45, 212, 191, 0.25), transparent 50%),
    linear-gradient(160deg, rgba(22, 20, 45, 0.98) 0%, rgba(32, 30, 62, 0.95) 50%, rgba(28, 26, 55, 0.98) 100%);
  background-size: cover;
  padding: 32px 28px;
  color: #f5f7ff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.auth-visual::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 80% 20%, rgba(124, 111, 238, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 10% 90%, rgba(45, 212, 191, 0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 50% 50%, rgba(124, 111, 238, 0.06) 0%, transparent 60%);
  pointer-events: none;
}

.auth-visual::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  pointer-events: none;
}

.auth-visual > * {
  position: relative;
  z-index: 1;
}

.brand-row {
  display: inline-flex;
  align-items: center;
  margin-bottom: 24px;
}

.brand-mark {
  max-width: 260px;
}

.brand-mark img {
  display: block;
  width: 100%;
  height: auto;
  filter: brightness(0) invert(1);
}

.hero-copy {
  max-width: 360px;
}

.eyebrow {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(147, 171, 255, 0.9);
}

.hero-copy h2 {
  margin-top: 10px;
  font-size: 1.85rem;
  line-height: 1.15;
  letter-spacing: -0.05em;
}

.hero-copy p {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(233, 237, 255, 0.8);
}

.feature-list {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 9px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(238, 240, 255, 0.9);
  font-size: 12px;
}

.feature-list li::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6fee, #2dd4bf);
  box-shadow: 0 0 0 3px rgba(124, 111, 238, 0.15);
  flex-shrink: 0;
}

.mini-stats {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.mini-stats div {
  min-width: 100px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mini-stats strong {
  font-size: 1.1rem;
  letter-spacing: -0.04em;
}

.mini-stats span {
  color: rgba(224, 228, 255, 0.72);
  font-size: 11px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.88);
  padding: 32px 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  max-height: 100%;
}

.card-header {
  margin-bottom: 4px;
}

.auth-eyebrow {
  color: var(--violet);
  font-size: 10px;
}

.auth-card h1 {
  margin-top: 8px;
  font-size: 1.9rem;
  letter-spacing: -0.05em;
  line-height: 1.2;
}

.sub {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-soft);
}

.auth-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-soft);
}

.field input {
  width: 100%;
  border: 1px solid rgba(122, 128, 164, 0.2);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 11px;
  padding: 11px 12px;
  font-size: 13px;
  color: var(--text);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.field input::placeholder {
  color: var(--text-faint);
}

.field input:focus {
  outline: none;
  border-color: rgba(124, 111, 238, 0.7);
  box-shadow: 0 0 0 3px rgba(124, 111, 238, 0.12);
}

.field-error {
  margin: -6px 0 0;
  font-size: 11px;
  color: #d14343;
  font-weight: 600;
}

.auth-submit {
  width: 100%;
  justify-content: center;
  padding: 12px 14px;
  margin-top: 4px;
  border-radius: 11px;
  font-size: 13px;
  box-shadow: 0 8px 20px rgba(92, 81, 216, 0.22);
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0 14px;
  color: var(--text-faint);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  height: 1px;
  flex: 1;
  background: rgba(122, 128, 164, 0.16);
}

.google-btn {
  width: 100%;
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid rgba(122, 128, 164, 0.2);
  border-radius: 11px;
  background: #fff;
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.google-btn:not(:disabled):hover {
  border-color: rgba(66, 133, 244, 0.55);
  box-shadow: 0 6px 16px rgba(66, 133, 244, 0.12);
  transform: translateY(-1px);
}

.google-btn:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.google-mark {
  color: #4285f4;
  font-family: Georgia, serif;
  font-size: 18px;
  font-weight: 700;
}

.switch {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--text-soft);
}

.link-btn {
  color: var(--violet);
  font-weight: 700;
  font-size: 12px;
  background: transparent;
  border: none;
  padding: 0;
}

.link-btn:hover {
  text-decoration: underline;
}

@media (max-width: 860px) {
  .auth-screen {
    padding: 12px;
  }

  .auth-panel {
    grid-template-columns: 1fr;
    height: auto;
    min-height: min(100vh, 100%);
  }

  .auth-visual {
    padding: 24px 20px;
    min-height: 280px;
  }

  .hero-copy {
    max-width: 100%;
  }

  .hero-copy h2 {
    font-size: 1.5rem;
  }

  .mini-stats {
    flex-wrap: wrap;
    gap: 10px;
  }

  .mini-stats div {
    flex: 1;
    min-width: 80px;
  }

  .auth-card {
    padding: 24px 20px;
  }

  .auth-card h1 {
    font-size: 1.6rem;
  }
}
</style>
