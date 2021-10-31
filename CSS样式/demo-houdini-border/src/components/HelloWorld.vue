<script setup>
import { ref, computed } from 'vue'

const width = ref(200)
const height = ref(300)
const style = computed(() => {
  return {
    width: width.value + 'px',
    height: height.value + 'px',
  }
})

const handleChangeSize = () => {
  width.value = Math.random() * 200 + 100
  height.value = Math.random() * 200 + 200
}
</script>

<template>
  <div class="box">
    <div class="child" :style="style"></div>
  </div>
  <button @click="handleChangeSize">改变大小</button>
</template>

<style scoped>
.box {
  display: inline-block;
  background-image: paint(lg-border);
  padding: 4px;
  border-radius: 8px;
}

.child {
  background-color: rgba(200, 240, 255, 0.3);
  border-radius: 4px;
}
</style>
