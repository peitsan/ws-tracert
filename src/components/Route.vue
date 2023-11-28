<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ render: Object }>()

const TraceRT = ref([1,2])
</script>

<template>
      <div>{{TraceRT}}</div>
  <!-- <div class="read-the-docs" v-if="(item,index) in TraceRT">
    <div>{{item}}</div>
  </div> -->
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
