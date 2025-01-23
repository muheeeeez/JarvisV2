<template>
  <ion-page>
    
    <ion-content v-if="isLoader">
      <div class="loader-section">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 30 24"
          class="loader-dots"
        >
          <circle cx="6" cy="12" r="1.5" class="dot"></circle>
          <circle cx="12" cy="12" r="1.5" class="dot"></circle>
          <circle cx="18" cy="12" r="1.5" class="dot"></circle>
        </svg>
      </div>
    </ion-content>
    <ion-content v-else>
      <ion-content v-if="isChat">
        <ClientOnly>
          <Speech @toggle-false="handleToggle" />
        </ClientOnly>
      </ion-content>
      <ion-content v-else>
        <Text />
      </ion-content>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
const isMessage = ref(false);
const isLoader = ref(true);
const isChat = ref(true);
const router = useIonRouter();
// const goHome = () => router.push("/chat");
const goBack = () => router.back();
function handleToggle() {
  isChat.value = false;
}
onMounted(async () => {
  setTimeout(() => {
    isLoader.value = false;
  }, 3000);
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 520px;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}
.agent-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #ccc;
}
.agent-avatar {
  width: 3rem;
  height: 3rem;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid rgba(108, 117, 125, 0.3);
}
.agent-details {
  display: flex;
  flex-direction: column;
}
.agent-name {
  font-weight: 600;
}
.agent-subtitle {
  margin-top: 0.25rem;
  color: #000;
}
.loader-section {
  text-align: center;
  padding: 2rem 0;
}
.loader-dots {
  width: 3rem;
  height: 3rem;
  fill: none;
  margin: 0 auto;
}

.dot {
  fill: #10b981;
  animation: pulse 0.6s infinite alternate;
}
.dot:nth-of-type(2) {
  animation-delay: 0.2s;
}
.dot:nth-of-type(3) {
  animation-delay: 0.4s;
}
@keyframes pulse {
  to {
    transform: scale(1.5);
    opacity: 0.5;
  }
}
.messages-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
  max-height: 400px;
  overflow-y: auto;
}
.message-row {
  display: flex;
  align-items: flex-end;
  gap: 0.75rem;
}
.message-row.reverse {
  flex-direction: row-reverse;
}
.avatar-small,
.avatar-initials {
  width: 3rem;
  height: 3rem;
  border: 2px solid rgba(108, 117, 125, 0.3);
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-initials {
  background: linear-gradient(to top, #0ea5e9, #10b981);
  color: #fff;
  font-weight: bold;
  text-transform: uppercase;
}
.message-content {
  width: 60%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(248, 249, 250, 0.8);
  border: 1px solid rgba(108, 117, 125, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  box-sizing: border-box;
}
.message-text {
  color: #000;
  font-size: 1rem;
  line-height: 1.4;
}
.message-timestamp {
  font-size: 0.75rem;
  color: rgba(108, 117, 125, 0.7);
  text-align: right;
}
</style>
