<script setup>
import { useRoute } from 'vue-router'
import { useUiStore } from '../stores/ui'
import { useNotificationsStore } from '../stores/notifications'
import Icon from './Icon.vue'
import NotificationsPanel from './NotificationsPanel.vue'

const route = useRoute()
const ui = useUiStore()
const notifications = useNotificationsStore()

const todayLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
})
</script>

<template>
  <header class="topbar">
    <button class="menu-toggle" @click="ui.mobileNavOpen = !ui.mobileNavOpen" aria-label="Toggle menu">
      <Icon name="menu" size="18" />
    </button>
    <div class="topbar-title">
      <h1>{{ route.meta.title }}</h1>
      <p>{{ todayLabel }}</p>
    </div>
    <div class="topbar-actions">
      <div class="search">
        <Icon name="search" size="15" />
        <input v-model="ui.searchQuery" placeholder="Search transactions" />
      </div>
      <button class="bell-btn" @click="ui.notificationsPanelOpen = !ui.notificationsPanelOpen" aria-label="Notifications">
        <Icon name="bell" size="17" />
        <span v-if="notifications.count" class="bell-badge">{{ notifications.count }}</span>
      </button>
      <button class="btn btn-primary" @click="ui.openTxnModal()">+ Add transaction</button>
    </div>
    <NotificationsPanel v-if="ui.notificationsPanelOpen" />
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 22px 36px;
  background: var(--canvas);
  position: sticky;
  top: 0;
  z-index: 5;
}
.bell-btn {
  position: relative;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 9px;
  padding: 9px;
  color: var(--text-soft);
  display: flex;
}
.bell-btn:hover {
  color: var(--text);
}
.bell-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--rose);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  min-width: 16px;
  height: 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}
.menu-toggle {
  display: none;
  background: none;
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 8px;
}
.topbar-title h1 {
  font-size: 21px;
}
.topbar-title p {
  font-size: 12.5px;
  color: var(--text-soft);
  margin-top: 2px;
}
.topbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
}
.search {
  position: relative;
  color: var(--text-faint);
}
.search svg {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
}
.search input {
  width: 220px;
  padding: 9px 12px 9px 33px;
  border-radius: 9px;
  border: 1px solid var(--line);
  background: #fff;
  font-size: 13px;
  color: var(--text);
}
.search input::placeholder {
  color: var(--text-faint);
}

@media (max-width: 760px) {
  .menu-toggle {
    display: inline-flex;
  }
  .topbar {
    padding: 18px;
    flex-wrap: wrap;
  }
  .search input {
    width: 150px;
  }
  .topbar-title p {
    display: none;
  }
}
</style>
