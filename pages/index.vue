<template>
  <div>
    <ion-menu content-id="main-content" menu-id="menu" side="end">
      <ion-header>
        <ion-toolbar>
          <ion-title>Settings</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item
          ><ion-toggle
            justify="space-between"
            :checked="isDarkMode"
            @ionChange="toggleDarkMode"
            >Dark Mode</ion-toggle
          >
        </ion-item>
        <ion-item
          ><ion-button fill="clear" router-link="/contact"
            >Contact Us</ion-button
          ></ion-item
        >
        <ion-item><ion-button fill="clear">Privay Policy</ion-button></ion-item>
      </ion-content>
    </ion-menu>
    <ion-page id="main-content">
      <ion-toolbar>
        <ion-buttons slot="end" @click="openMenu">
          <ion-icon
            src="/assets/settings-outline.svg"
            slot="icon-only"
          ></ion-icon>
        </ion-buttons>
      </ion-toolbar>

      <ion-card class="container">
        <img src="/assets/bruno.png" class="rounded-image" />
        <h1 class="title">Jarvis Student Support</h1>
        <form @submit.prevent="handleSubmit">
          <fieldset class="form-fieldset">
            <ion-input
              label="Your Name"
              label-placement="floating"
              fill="outline"
              
              error-text="Enter a name to proceed"
              required
              v-model="enteredName"
            ></ion-input>
            <ion-note class="note">
              Please provide a name so Jarvis knows who he's talkin to.
            </ion-note>
            <ion-button type="submit" class="submit-button">
              Start a New Chat
            </ion-button>
            <!-- <ion-button type="submit" class="continue-button">
              Continue Previous Chat
            </ion-button> -->
          </fieldset>
        </form>
      </ion-card>
    </ion-page>
  </div>
</template>
<script setup lang="ts">
import { useDarkMode } from "@/utils/darkMode.js";
const enteredName = ref("");
// const router = useIonRouter();
import { useRouter } from "vue-router";

const { isDarkMode, toggleDarkMode } = useDarkMode();
const router = useRouter();
const handleSubmit = () => {
  router.push({ path: "/chat", query: { value: enteredName.value } });
};
const goBack = () => router.back();
const openMenu = async () => {
  await menuController.open("menu");
};
console.log(enteredName.value);
</script>
<style scoped>
/* ion-input {
  --color: #fff;
  --placeholder-color: #000;
} */
ion-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 4rem;
  margin: auto 15px;
}
.rounded-image {
  border-radius: 90%;
}
.title {
  text-align: center;
  font-weight: bold;
  font-size: 1.3rem;
  margin: 0;
  /* color: black; */
}
.form-fieldset {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  border: none;
  padding: 0;
}
.note {
  /* color: #64748b; */
  font-style: italic;
  margin: 0;
}
.submit-button,
.continue-button {
  margin: 0 auto;
  font-size: 12px;
  width: 100%;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}
.submit-button {
  border: none;
}
.submit-button:hover {
  opacity: 0.9;
}
.continue-button:hover {
  opacity: 0.9;
}
ion-note{
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
