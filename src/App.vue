<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useUiStore } from './stores/ui'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import AddTransactionModal from './components/AddTransactionModal.vue'
import ErrorAlert from './components/ErrorAlert.vue'
import './styles/animations.css'

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const route = useRoute()


const handleUnauthorized = (event) => {
  const message = event.detail?.message || 'Your session has expired. Please sign in again.'
  auth.handleUnauthorized(message)

  if (router.currentRoute.value.name !== 'unauthorized') {
    router.replace({ name: 'unauthorized' })
  }
}

function handleSuccess(event) {
  ui.showToast(event.detail?.message || "Activity completed successfully")
}

function retryRouteData() {
  window.location.reload()
}

onMounted(() => {
  window.addEventListener('auth:unauthorized', handleUnauthorized)
  window.addEventListener("app:success", handleSuccess)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth:unauthorized', handleUnauthorized)
  window.removeEventListener("app:success", handleSuccess)
})
</script>

<template>
  <div v-if="auth.isAuthenticated" class="app-shell" :class="{ 'nav-open': ui.mobileNavOpen }">
    <AppSidebar />
    <div class="main">
      <AppTopbar class="no-print" />
      <ErrorAlert
        v-if="ui.routeDataError"
        class="route-error no-print"
        :message="ui.routeDataError.message"
        type="error"
        :action="{ label: 'Retry', handler: retryRouteData }"
        @dismiss="ui.clearRouteDataError()"
      />
      <main class="content">
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.fullPath" />
        </router-view>
      </main>
    </div>
  </div>
  <router-view v-else v-slot="{ Component, route }">
    <component :is="Component" :key="route.fullPath" />
  </router-view>

  <AddTransactionModal v-if="auth.isAuthenticated && ui.txnModalOpen" />
  <Transition name="app-toast">
    <div v-if="auth.isAuthenticated && ui.toastMessage" class="app-toast" role="status" aria-live="polite">
      <span class="toast-check" aria-hidden="true">✓</span>
      {{ ui.toastMessage }}
    </div>
  </Transition>
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
  min-width: 0;
  overflow-x: hidden;
}

@media (max-width: 760px) {
  .content {
    padding: 4px 18px 40px;
  }
}
.app-toast {
  position: fixed;
  z-index: 2000;
  right: 24px;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: calc(100vw - 32px);
  padding: 12px 16px;
  border: 1px solid rgba(45, 212, 191, 0.35);
  border-radius: 12px;
  background: #102b2a;
  color: #f0fdfa;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.2);
  font-size: 13px;
  font-weight: 600;
}
.toast-check { color: #5eead4; font-size: 16px; }
.app-toast-enter-active, .app-toast-leave-active { transition: opacity 220ms ease, transform 220ms ease; }
.app-toast-enter-from, .app-toast-leave-to { opacity: 0; transform: translateY(10px); }
@media (max-width: 640px) {.app-toast { right: 16px; bottom: 16px; left: 16px; max-width: none; } }
</style>
