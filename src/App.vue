<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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

const handleUnauthorized = (event) => {
  const message = event.detail?.message || 'Your session has expired. Please sign in again.'
  auth.handleUnauthorized(message)

  if (router.currentRoute.value.name !== 'unauthorized') {
    router.replace({ name: 'unauthorized' })
  }
}

function retryRouteData() {
  window.location.reload()
}

onMounted(() => {
  window.addEventListener('auth:unauthorized', handleUnauthorized)
})

onBeforeUnmount(() => {
  window.removeEventListener('auth:unauthorized', handleUnauthorized)
})
</script>

<template>
  <div v-if="auth.isAuthenticated" class="app-shell" :class="{ 'nav-open': ui.mobileNavOpen }">
    <AppSidebar class="no-print" />
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
</style>
