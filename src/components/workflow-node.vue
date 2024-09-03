<script setup>
import SendEmailIcon from './icons/send-email-icon.vue';

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="">
    <div class="workflow-node">
      <div
        :style="{
          border: '1px solid rgba(156, 113, 252, 0.5)',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }"
      >
        <SendEmailIcon />
      </div>
      <div class="content">
        <h3 class="title">Dead Simple!</h3>
        <p class="description">
          Shoot an
          <strong>e-mail</strong>
          right now to get consultation
        </p>
      </div>
    </div>
  </div>
</template>
