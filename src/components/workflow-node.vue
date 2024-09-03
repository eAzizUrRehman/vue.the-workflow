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
  <div class="workflow-node">
    <div class="icon">
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
</template>
