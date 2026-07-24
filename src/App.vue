<script setup>
import { useAuthStore } from './stores/auth'
import { useUiStore } from './stores/ui'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import AddTransactionModal from './components/AddTransactionModal.vue'

const auth = useAuthStore()
const ui = useUiStore()
</script>

<template>
  <div v-if="auth.isAuthenticated" class="app-shell" :class="{ 'nav-open': ui.mobileNavOpen }">
    <AppSidebar class="no-print" />
    <div class="main">
      <AppTopbar class="no-print" />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
  <router-view v-else />

  <AddTransactionModal v-if="auth.isAuthenticated && ui.txnModalOpen" />
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.content {
  padding: 4px 36px 48px;
}

@media (max-width: 760px) {
  .content {
    padding: 4px 18px 40px;
  }
}
</style>
