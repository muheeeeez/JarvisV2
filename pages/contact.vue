<template>
  <!-- Wrap in <client-only> so SSR doesn't break Ionic components -->
  <client-only>
    <ion-page>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Contact Us</ion-title>
      </ion-toolbar>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title color="light">Get In Touch</ion-card-title>
          </ion-card-header>
          <ion-item>
            <ion-input
              label="First Name:"
              placeholder="Enter First Name"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              label="Last Name:"
              placeholder="Enter Last Name"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input
              label="Email:"
              placeholder="Enter Email Address"
              type="email"
              error-text="Invalid email"
            ></ion-input>
          </ion-item>
          <ion-list inset="true">
            <ion-item color="light">
              <ion-textarea
                label="Message"
                label-placement="floating"
                rows="5"
              ></ion-textarea>
            </ion-item>
          </ion-list>
          <ion-button>Send Message</ion-button>
        </ion-card>
      </ion-content>
    </ion-page>
  </client-only>
</template>

<script setup lang="ts"></script>

<style scoped></style>
