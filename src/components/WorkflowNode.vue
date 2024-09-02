<script setup>
import { Handle, useHandleConnections } from '@vue-flow/core'

import SendEmailIcon from './SendEmailIcon.vue'

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

const sourceConnections = useHandleConnections({
  type: 'target',
})

const targetConnections = useHandleConnections({
  type: 'source',
})
</script>

<template>
  <div class="">
    <div class="workflow-node">
      <SendEmailIcon />
      <div class="content">
        <h3 class="title">
          <!-- Send Email -->
          {{ node.data.order || "0" }}
        </h3>
        <p class="description">
          You chose
          <strong>Balance Reminder</strong>
          to send an email.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.vue-flow__node .workflow-node {
  background-color: black !important;
  cursor: grab !important;
  display: flex !important;
  justify-content: start !important;
  align-items: center !important;
  gap: 10px !important;
  width: fit-content !important;
  max-height: fit-content !important;
  border-radius: 10px !important;
  border: 1px solid #dee3ed !important;
  padding: 10px !important;
}

.vue-flow__node .workflow-node .content {
  max-height: fit-content !important;
}
.vue-flow__node .workflow-node .content .title {
  max-height: fit-content !important;
  /* color: #161819 !important; */
  color: white !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}

.vue-flow__node .workflow-node .content .description {
  margin-top: 8px;
  font-size: 14px !important;
  color: #8e96a8 !important;
  max-height: fit-content !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
.vue-flow__node .workflow-node .content .highlighted {
  font-size: 14px !important;
  color: #8e96a8 !important;
  font-weight: 600;
  max-height: fit-content !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
</style>
