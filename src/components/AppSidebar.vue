<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import Icon from './Icon.vue'
import logo from '../assets/logo.png'

const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard' },
  { to: '/accounts', label: 'Accounts', icon: 'wallet' },
  { to: '/budgets', label: 'Budgets', icon: 'budgets' },
  { to: '/recurring', label: 'Recurring', icon: 'repeat' },
  { to: '/goals', label: 'Goals', icon: 'target' },
  { to: '/transactions', label: 'Transactions', icon: 'transactions' },
  { to: '/insights', label: 'Insights', icon: 'trending' },
  { to: '/reports', label: 'Reports', icon: 'fileText' },
  { to: '/import', label: 'Import', icon: 'upload' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <img :src="logo" alt="MyPochi logo" class="brand-mark" />
      <div class="brand-text">
        <span class="brand-name">MyPochi</span>
        <span class="brand-tag">Money, mapped</span>
      </div>
    </div>

    <nav class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
        @click="ui.mobileNavOpen = false"
      >
        <Icon :name="item.icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-foot">
      <div class="user-chip">
        <div class="avatar">{{ auth.initials }}</div>
        <div>
          <div class="user-name">{{ auth.user?.name }}</div>
          <div class="user-email">{{ auth.user?.email }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 248px;
  flex-shrink: 0;
  background: var(--ink);
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 28px 8px;
}
.brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: block;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.brand-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 17px;
}
.brand-tag {
  font-size: 11px;
  color: #a6a6d0;
  letter-spacing: 0.02em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 8px;
  overflow-y: auto;
  min-height: 0;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  background: transparent;
  border: none;
  color: #b9b9dc;
  padding: 10px 12px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;
}
.nav-item:hover {
  background: var(--ink-2);
  color: #fff;
}
.nav-item.active {
  background: var(--violet);
  color: #fff;
}

.sidebar-foot {
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px dashed #34345e;
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 10px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--mint);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}
.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}
.user-email {
  font-size: 11.5px;
  color: #9494be;
}

@media (max-width: 760px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 40;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }
  :global(.app-shell.nav-open) .sidebar {
    transform: translateX(0);
    box-shadow: 0 0 0 100vmax rgba(20, 20, 43, 0.4);
  }
}
</style>
