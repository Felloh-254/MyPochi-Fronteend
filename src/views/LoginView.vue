<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/Logo.png'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const mode = ref('login')
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
    window.google.accounts.id.initialize({ client_id: googleClientId, callback: handleGoogleCredential })
    googleReady.value = true
  }
  if (window.google?.accounts?.id) return initialize()
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
  if (googleReady.value) window.google.accounts.id.prompt()
}

onMounted(loadGoogleSignIn)

async function submit() {
  try {
    if (mode.value === 'login') await auth.login(form.email, form.password)
    else await auth.register(form.email, form.password, form.name)
    router.push(route.query.redirect || '/dashboard')
  } catch {
    // The auth store exposes its error state to the form.
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  auth.$patch({ error: null })
}
</script>

<template>
  <div class="auth-screen">
    <div class="ambient ambient-one" aria-hidden="true"></div>
    <div class="ambient ambient-two" aria-hidden="true"></div>

    <main class="auth-layout">
      <section class="brand-panel" aria-label="MyPochi introduction">
        <div class="brand-panel-top">
          <img :src="logo" alt="MyPochi" class="brand-logo" />
          <span class="brand-kicker">Personal finance,<br />made clear</span>
        </div>

        <div class="brand-copy">
          <p class="brand-overline">A clearer money routine</p>
          <h2>Know where your money is going.</h2>
          <p>Bring accounts, spending, budgets, and goals into one quiet, useful view.</p>
        </div>

        <div class="balance-preview" aria-hidden="true">
          <div class="preview-topline"><span>Your financial picture</span><i></i></div>
          <div class="preview-line preview-line-primary"></div>
          <div class="preview-line preview-line-secondary"></div>
          <div class="preview-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div>
        </div>

        <p class="brand-footer"><span></span> Simple tools for everyday decisions.</p>
      </section>

      <section class="auth-content" aria-labelledby="auth-title">
        <img :src="logo" alt="MyPochi" class="mobile-logo" />

        <div class="auth-heading">
          <p class="auth-kicker">{{ mode === 'login' ? 'Welcome back' : 'Create your account' }}</p>
          <h1 id="auth-title">{{ mode === 'login' ? 'Sign in to MyPochi' : 'Start with a clearer view' }}</h1>
          <p>{{ mode === 'login' ? 'Pick up where you left off.' : 'Set up your account in just a few details.' }}</p>
        </div>

        <form @submit.prevent="submit" class="auth-form">
          <div v-if="mode === 'register'" class="field">
            <label for="name">Full name</label>
            <input id="name" v-model="form.name" autocomplete="name" placeholder="Enter your full name" required />
          </div>
          <div class="field">
            <label for="email">Email address</label>
            <input id="email" v-model="form.email" type="email" autocomplete="email" placeholder="you@example.com" required />
          </div>
          <div class="field">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" autocomplete="current-password" placeholder="At least 8 characters" required minlength="8" />
          </div>

          <p v-if="auth.error" class="field-error" aria-live="polite">{{ auth.error }}</p>

          <button type="submit" class="btn btn-primary auth-submit" :disabled="auth.loading">
            {{ auth.loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account' }}
            <span aria-hidden="true">→</span>
          </button>
        </form>

        <div class="auth-divider"><span>or</span></div>

        <button type="button" class="google-btn" :disabled="auth.loading || (!!googleClientId && !googleReady)" @click="signInWithGoogle">
          <span class="google-mark" aria-hidden="true">G</span>
          {{ googleReady ? 'Continue with Google' : 'Google sign-in unavailable' }}
        </button>

        <p class="switch">
          {{ mode === 'login' ? 'New to MyPochi?' : 'Already have an account?' }}
          <button class="link-btn" type="button" @click="toggleMode">
            {{ mode === 'login' ? 'Create an account' : 'Sign in instead' }}
          </button>
        </p>
      </section>
    </main>
  </div>
</template>

<style>
.auth-screen { min-height: 100vh; display: grid; place-items: center; position: relative; overflow: hidden; padding: 28px; background: #f5f5fa; }
.ambient { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(2px); }
.ambient-one { width: 480px; height: 480px; top: -250px; left: -130px; background: rgba(124, 111, 238, 0.16); }
.ambient-two { width: 380px; height: 380px; right: -170px; bottom: -190px; background: rgba(45, 212, 191, 0.12); }
.auth-layout { position: relative; z-index: 1; width: min(1000px, 100%); min-height: 570px; display: grid; grid-template-columns: 0.92fr 1.08fr; overflow: hidden; border: 1px solid rgba(124, 111, 238, 0.12); border-radius: 24px; background: #fff; box-shadow: 0 26px 70px rgba(29, 28, 66, 0.12), 0 2px 8px rgba(29, 28, 66, 0.04); }
.brand-panel { position: relative; display: flex; flex-direction: column; padding: 36px; overflow: hidden; color: #fff; background: radial-gradient(circle at 15% 15%, rgba(124, 111, 238, 0.58), transparent 33%), radial-gradient(circle at 92% 88%, rgba(45, 212, 191, 0.2), transparent 28%), linear-gradient(155deg, #25234d 0%, #191735 100%); }
.brand-panel::after { content: ''; position: absolute; width: 290px; height: 290px; right: -150px; bottom: -135px; border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 50%; box-shadow: 0 0 0 34px rgba(255, 255, 255, 0.04), 0 0 0 68px rgba(255, 255, 255, 0.02); }
.brand-panel-top, .brand-copy, .balance-preview, .brand-footer { position: relative; z-index: 1; }
.brand-panel-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand-logo { width: 132px; height: auto; filter: brightness(0) invert(1); }
.brand-kicker { max-width: 116px; font-size: 10px; line-height: 1.35; text-align: right; color: rgba(232, 235, 255, 0.65); }
.brand-copy { max-width: 310px; margin-top: 76px; }
.brand-overline, .auth-kicker { margin: 0; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.brand-overline { color: #a9a2ff; }
.brand-copy h2 { margin: 13px 0 0; font-size: clamp(2rem, 3.1vw, 2.5rem); line-height: 1.03; letter-spacing: -0.06em; }
.brand-copy > p:last-child { margin: 16px 0 0; color: rgba(234, 236, 255, 0.78); font-size: 13px; line-height: 1.6; }
.balance-preview { width: 100%; max-width: 310px; margin-top: 34px; padding: 15px 16px 14px; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(8px); }
.preview-topline { display: flex; align-items: center; justify-content: space-between; color: rgba(238, 240, 255, 0.72); font-size: 10px; }
.preview-topline i { display: block; width: 7px; height: 7px; border-radius: 50%; background: var(--teal); box-shadow: 0 0 0 4px rgba(45, 212, 191, 0.12); }
.preview-line { height: 8px; margin-top: 13px; border-radius: 20px; background: rgba(255, 255, 255, 0.14); }
.preview-line-primary { width: 66%; background: linear-gradient(90deg, #d3ceff, #9c91fa); }
.preview-line-secondary { width: 42%; height: 5px; margin-top: 8px; }
.preview-grid { display: grid; grid-template-columns: repeat(6, 1fr); align-items: end; gap: 4px; height: 34px; margin-top: 14px; }
.preview-grid span { display: block; border-radius: 4px 4px 1px 1px; background: rgba(45, 212, 191, 0.68); }
.preview-grid span:nth-child(1) { height: 35%; }.preview-grid span:nth-child(2) { height: 54%; }.preview-grid span:nth-child(3) { height: 43%; }.preview-grid span:nth-child(4) { height: 73%; }.preview-grid span:nth-child(5) { height: 60%; }.preview-grid span:nth-child(6) { height: 92%; }
.brand-footer { display: inline-flex; align-items: center; gap: 8px; margin-top: auto; color: rgba(232, 235, 255, 0.64); font-size: 11px; }
.brand-footer span { width: 7px; height: 7px; border-radius: 50%; background: var(--mint); }
.auth-content { align-self: center; width: min(100%, 480px); padding: 42px 58px; margin: 0 auto; }
.mobile-logo { display: none; }
.auth-heading h1 { margin: 9px 0 0; color: var(--ink); font-size: clamp(1.9rem, 3vw, 2.25rem); line-height: 1.1; letter-spacing: -0.055em; }
.auth-kicker { color: var(--violet); }
.auth-heading > p:last-child { margin: 11px 0 0; color: var(--text-soft); font-size: 13px; line-height: 1.5; }
.auth-form { display: flex; flex-direction: column; gap: 15px; margin-top: 28px; }
.field { display: flex; flex-direction: column; gap: 7px; }
.field label { color: var(--text-soft); font-size: 11px; font-weight: 700; letter-spacing: 0.02em; }
.field input { width: 100%; min-height: 45px; padding: 11px 13px; border: 1px solid var(--line); border-radius: 10px; background: #fff; color: var(--text); font-size: 13px; transition: border-color 0.18s ease, box-shadow 0.18s ease; }
.field input::placeholder { color: var(--text-faint); }
.field input:focus { outline: none; border-color: rgba(124, 111, 238, 0.8); box-shadow: 0 0 0 3px rgba(124, 111, 238, 0.13); }
.field-error { margin: -3px 0 0; color: #ce3e50; font-size: 11px; font-weight: 600; }
.auth-submit { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 46px; margin-top: 4px; border-radius: 10px; box-shadow: 0 8px 18px rgba(91, 79, 209, 0.2); }
.auth-submit span { font-size: 17px; line-height: 0; transition: transform 0.18s ease; }
.auth-submit:not(:disabled):hover span { transform: translateX(3px); }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 21px 0 15px; color: var(--text-faint); font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.google-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; width: 100%; min-height: 45px; border: 1px solid var(--line); border-radius: 10px; background: #fff; color: var(--text); font-size: 13px; font-weight: 700; transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease; }
.google-btn:not(:disabled):hover { border-color: rgba(66, 133, 244, 0.55); box-shadow: 0 5px 14px rgba(66, 133, 244, 0.1); transform: translateY(-1px); }
.google-btn:disabled { cursor: not-allowed; opacity: 0.58; }
.google-mark { color: #4285f4; font-family: Georgia, serif; font-size: 18px; font-weight: 700; }
.switch { margin: 19px 0 0; color: var(--text-soft); font-size: 12px; text-align: center; }
.link-btn { padding: 0; border: 0; background: transparent; color: var(--violet-deep); font: inherit; font-weight: 700; }
.link-btn:hover { text-decoration: underline; }
@media (max-width: 780px) { .auth-screen { padding: 18px; }.auth-layout { display: block; min-height: 0; max-width: 480px; }.brand-panel { display: none; }.auth-content { width: 100%; padding: 36px 32px 32px; }.mobile-logo { display: block; width: 132px; height: auto; margin-bottom: 36px; } }
@media (max-width: 440px) { .auth-screen { padding: 12px; }.auth-content { padding: 28px 22px 24px; }.mobile-logo { margin-bottom: 28px; }.auth-heading h1 { font-size: 1.85rem; } }
</style>
