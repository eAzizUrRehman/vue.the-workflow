<script setup>
import { Handle, useHandleConnections } from '@vue-flow/core'

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  sourcePosition: {
    type: String,
  },
  targetPosition: {
    type: String,
  },
})

const emit = defineEmits(['on-node-click'])

const sourceConnections = useHandleConnections({
  type: 'target',
})

const targetConnections = useHandleConnections({
  type: 'source',
})

const onNodeClick = (node) => {
  emit('on-node-click', node)
}
</script>

<template>
  <div class="adding-node">
    <button
      type="button"
      class="button"
      :class="{
        'button_order-1': node.data.order === 1,
        'button_order-2': node.data.order === 2,
        'button_order-3': node.data.order === 3,
      }"
      @click="onNodeClick(props.node)"
    >
      Add New Point
    </button>
  </div>
</template>
