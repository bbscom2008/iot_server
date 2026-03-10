export default {
  watch: {
    '$store.state.tenant.selectTenantId': {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.onSelectedTenantChange()
        }
      },
    }
  }
}
