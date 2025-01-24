<template>
  <!-- <ion-app
    style="
      background-image: url('/assets/bg.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    "
  >
    <NuxtPage />
    <ion-router-outlet />
  </ion-app> -->
  <ion-app
    style="
      background-image: url('/assets/bg.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    "
  >
    <NuxtPage></NuxtPage>
  </ion-app>
</template>
<script>
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/**
 * Ionic Dark Palette
 * -----------------------------------------------------
 * For more information, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/vue/css/palettes/dark.always.css';
import "@ionic/vue/css/palettes/dark.class.css";
</script>
