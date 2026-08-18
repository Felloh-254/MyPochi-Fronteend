<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

function goToLogin() {
  auth.clearSession()
  router.replace({ name: 'login' })
}
</script>

<template>
  <div class="unauthorized-screen">
    <div class="unauthorized-card">
      <div class="badge">401</div>
      <h1>Unauthorized</h1>
      <p>{{ auth.error || 'Your session has expired or you do not have permission to view this page.' }}</p>
      <button class="btn btn-primary" @click="goToLogin">Sign in again</button>
    </div>
  </div>
</template>

<style scoped>
.unauthorized-screen {
  min-height: 100vh;
  background: linear-gradient(180deg, #f6f7ff 0%, #eef1ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.unauthorized-card {
  background: #fff;
  border: 1px solid var(--line, #e8e8f2);
  border-radius: 18px;
  max-width: 440px;
  width: 100%;
  text-align: center;
  padding: 40px 28px;
  box-shadow: 0 30px 70px rgba(24, 25, 56, 0.12);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(117, 84, 255, 0.1);
  color: var(--violet, #7554ff);
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

p {
  color: var(--text-soft, #5d5d7a);
  margin-bottom: 22px;
  line-height: 1.6;
}
</style>
