<template>
  <div class="chat-panel">
    <ion-page>
      <ion-content>
        <div class="chat-container">
          <div class="agent-info">
            <div class="agent-avatar">
              <ion-img src="/assets/bruno.png"></ion-img>
            </div>
            <div class="agent-details">
              <div class="agent-name">Jarvis</div>
              <div class="agent-subtitle">Algonquin Support Agent</div>
            </div>
          </div>
          <ion-card v-if="isMessage">
            <div class="messages-area">
              <div class="message-row">
                <div class="avatar-small">
                  <ion-img src="/assets/bruno.png"></ion-img>
                </div>
                <div class="message-content">
                  <div class="message-text">
                    Hello {{ nameValue }}, how can I help you today?
                  </div>
                  <div class="message-timestamp">9:30 AM</div>
                </div>
              </div>
              <div class="message-row reverse">
                <div class="avatar-initials">{{ nameValue }}</div>
                <div class="message-content">
                  <div class="message-text">I need help with my account.</div>
                  <div class="message-timestamp">9:32 AM</div>
                </div>
              </div>
              <MessageForm />
            </div>
          </ion-card>
        </div>
      </ion-content>
    </ion-page>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineEmits } from "vue";
import { useRoute } from "vue-router";
import MessageForm from "@/components/MessageForm.vue";

const isMessage = ref(true);
const route = useRoute();
const nameValue = computed(() => route.query.value || "No value provided");
const emit = defineEmits(["close"]);
function closeChat() {
  emit("close");
}
</script>

<style scoped>
.chat-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  overflow: hidden;
}
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
  font-size: 22px;
}
.agent-subtitle {
  margin-top: 0.25rem;
  font-size: 14px;
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
