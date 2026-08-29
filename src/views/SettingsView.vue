<script setup>
import { useAuthStore } from '../stores/auth'
import { useBudgetsStore } from '../stores/budgets'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const budgetsStore = useBudgetsStore()
const router = useRouter()

function signOut() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="view">
    <div class="section-head">
      <div>
        <h2>Settings</h2>
        <p>Your account, at a glance.</p>
      </div>
    </div>

    <div class="card settings-card content-enter">
      <div class="settings-avatar">{{ auth.initials }}</div>
      <div>
        <div class="name">{{ auth.user?.name }}</div>
        <div class="email">{{ auth.user?.email }}</div>
      </div>
    </div>

    <div class="card content-enter content-enter--delay-1">
      <div class="settings-row"><span class="label">Currency</span><span>KES (Ksh)</span></div>
      <div class="settings-row">
        <span class="label">Member since</span>
        <span>{{ auth.user?.created_at ? new Date(auth.user.created_at).toLocaleDateString() : '—' }}</span>
      </div>
      <div class="settings-row"><span class="label">Connected budgets</span><span>{{ budgetsStore.items.length }}</span></div>
    </div>

    <button class="btn btn-ghost content-enter content-enter--delay-2" style="align-self: flex-start" @click="signOut">Sign out</button>
  </div>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 1180px;
}
.settings-card {
  display: flex;
  align-items: center;
  gap: 16px;
}
.settings-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--violet);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;
}
.name {
  font-weight: 600;
  font-size: 15px;
}
.email {
  color: var(--text-soft);
  font-size: 13px;
}
.settings-row {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13.5px;
}
.settings-row:last-child {
  border-bottom: none;
}
.settings-row .label {
  color: var(--text-soft);
}
</style>
