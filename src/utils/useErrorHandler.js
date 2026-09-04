import { ref } from 'vue'

export function useErrorHandler() {
  const errors = ref([])

  function addError(message, type = 'error', action = null, dismissTimeout = 8000) {
    const id = Date.now()
    const error = { id, message, type, action }
    errors.value.push(error)

    if (dismissTimeout > 0) {
      setTimeout(() => dismissError(id), dismissTimeout)
    }

    return id
  }

  function dismissError(id) {
    const index = errors.value.findIndex((e) => e.id === id)
    if (index !== -1) {
      errors.value.splice(index, 1)
    }
  }

  function dismissAll() {
    errors.value = []
  }

  return {
    errors,
    addError,
    dismissError,
    dismissAll,
  }
}
