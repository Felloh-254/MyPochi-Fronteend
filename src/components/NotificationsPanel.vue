<script setup>
import { useNotificationsStore } from '../stores/notifications'
import { useUiStore } from '../stores/ui'
import Icon from './Icon.vue'

const notifications = useNotificationsStore()
const ui = useUiStore()
</script>

<template>
  <div class="panel-overlay" @click="ui.notificationsPanelOpen = false">
    <div class="panel" @click.stop>
      <div class="panel-head">
        <h3>Notifications</h3>
        <span class="eyebrow">{{ notifications.count }} active</span>
      </div>
      <div class="panel-list">
        <div v-for="a in notifications.alerts" :key="a.id" class="alert-row" :class="a.severity">
          <span class="alert-icon"><Icon :name="a.icon" size="14" /></span>
          <span class="alert-text">{{ a.text }}</span>
        </div>
        <p v-if="!notifications.alerts.length" class="empty">You're all caught up.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-overlay {
  position: fixed;
  inset: 0;
  z-index: 45;
}
.panel {
  position: absolute;
  top: 70px;
  right: 36px;
  width: 320px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 14px;
  border: 1px solid var(--line);
  box-shadow: 0 20px 50px rgba(20, 20, 43, 0.18);
  padding: 16px;
}
.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.panel-head h3 {
  font-size: 14.5px;
}
.panel-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 340px;
  overflow-y: auto;
}
.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 9px;
  font-size: 12.5px;
  background: var(--canvas);
}
.alert-icon {
  flex-shrink: 0;
  margin-top: 1px;
}
.alert-row.danger {
  background: var(--rose-soft);
  color: var(--rose);
}
.alert-row.warning {
  background: #fff3d9;
  color: #8a6420;
}
.alert-row.info {
  background: #eef0ff;
  color: var(--violet-deep);
}
</style>
