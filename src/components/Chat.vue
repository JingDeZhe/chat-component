<script setup lang="ts">
import 'overlayscrollbars/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue"
import { md } from './md'
const props = withDefaults(defineProps<{ content?: string, loading?: boolean }>(), { content: '', loading: false })

const htmlText = ref('')
const refContent = ref<HTMLElement>()

watch(() => props.content, (v) => {
  htmlText.value = md.render(v)
}, { immediate: true })

let unwatchLoading: Function
onMounted(() => {
  nextTick(() => {
    unwatchLoading = watch(() => props.loading, v => {
      if (!v) {
        md.done(refContent.value!)
      }
    }, { immediate: true })
  })
})

onUnmounted(() => unwatchLoading?.())
</script>

<template>
  <OverlayScrollbarsComponent element="div" :options="{ scrollbars: { autoHide: 'scroll' } }" defer class="md-wrapper">
    <div class="md-content" v-html="htmlText" ref="refContent"></div>
  </OverlayScrollbarsComponent>
</template>

<style lang="scss">
.md-wrapper {
  --at-apply: h-full;
}
</style>