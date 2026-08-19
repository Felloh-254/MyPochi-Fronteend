<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'
import Icon from './Icon.vue'
import logo from '../assets/Logo.png'

const route = useRoute()
const auth = useAuthStore()
const ui = useUiStore()

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
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
  <aside class="sidebar" :class="{ collapsed: ui.sidebarCollapsed }">
    <div class="brand">
      <img :src="logo" alt="MyPochi logo" class="brand-mark" />
      <button
        class="collapse-toggle"
        type="button"
        :aria-label="ui.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :title="ui.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="ui.sidebarCollapsed = !ui.sidebarCollapsed"
      >
        <Icon :name="ui.sidebarCollapsed ? 'chevronRight' : 'chevronLeft'" size="16" />
      </button>
    </div>

    <nav class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
        :title="ui.sidebarCollapsed ? item.label : undefined"
        @click="ui.mobileNavOpen = false"
      >
        <Icon :name="item.icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-foot">
      <div class="user-chip">
        <div class="avatar">{{ auth.initials }}</div>
        <div class="user-details">
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
  transition: width 0.2s ease, padding 0.2s ease;
}
.sidebar.collapsed {
  width: 76px;
  padding-left: 12px;
  padding-right: 12px;
}
.brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 4px 8px 28px 8px;
}
.brand-mark {
  width: 190px;
  max-width: 100%;
  height: auto;
  display: block;
  filter: brightness(0) invert(1);
  transition: width 0.2s ease;
}
.collapse-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #45456f;
  border-radius: 7px;
  background: transparent;
  color: #b9b9dc;
  cursor: pointer;
}
.collapse-toggle:hover {
  background: var(--ink-2);
  color: #fff;
}
.sidebar.collapsed .brand {
  flex-direction: column;
  padding-left: 0;
  padding-right: 0;
}
.sidebar.collapsed .brand-mark {
  width: 42px;
  overflow: hidden;
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
.sidebar.collapsed .nav-item {
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
}
.sidebar.collapsed .nav-item span,
.sidebar.collapsed .user-details {
  display: none;
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
.sidebar.collapsed .user-chip {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
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
  .sidebar.collapsed {
    width: 248px;
    padding-left: 16px;
    padding-right: 16px;
  }
  .sidebar.collapsed .brand {
    flex-direction: row;
    padding-left: 8px;
    padding-right: 8px;
  }
  .sidebar.collapsed .brand-mark {
    width: 190px;
  }
  .sidebar.collapsed .nav-item {
    justify-content: flex-start;
    padding-left: 12px;
    padding-right: 12px;
  }
  .sidebar.collapsed .nav-item span,
  .sidebar.collapsed .user-details {
    display: block;
  }
  .sidebar.collapsed .user-chip {
    justify-content: flex-start;
    padding-left: 8px;
    padding-right: 8px;
  }
  .collapse-toggle {
    display: none;
  }
  :global(.app-shell.nav-open) .sidebar {
    transform: translateX(0);
    box-shadow: 0 0 0 100vmax rgba(20, 20, 43, 0.4);
  }
}
</style>
