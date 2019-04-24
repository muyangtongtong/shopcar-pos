<template>
  <div id="app" v-loading="loading.fullShow" element-loading-text="加载中...">
    <router-view></router-view>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['loading'])
  }
}

</script>

<style>
#app {
  height: 100%;
  width: 100%;
}
</style>
