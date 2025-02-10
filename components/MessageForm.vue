<template>
  <form class="message-form">
    <fieldset>
      <textarea
        class="text-box"
        rows="4"
        placeholder="Enter your message..."
      ></textarea>
      <ion-button
        type="submit"
        class="send-button"
        color="success"
        shape="round"
      >
        <ion-icon src="/assets/send-sharp.svg" slot="icon-only"></ion-icon>
      </ion-button>
      <ion-button
        type="submit"
        class="send-button"
        color="success"
        shape="round"
      >
        <ion-icon src="/assets/send-sharp.svg" slot="icon-only"></ion-icon>
      </ion-button>
    </fieldset>
  </form>
</template>

<style scoped>

ion-icon {
  font-size: 20px;
  color: white;
}
.message-form {
  position: relative;
  margin: 1rem;
}
.message-form fieldset {
  border: none;
  padding: 0;
}
.text-box {
  background: white;
  width: 100%;
  display: block;
  box-sizing: border-box;
  padding: 1rem;
  padding-right: 3rem;
  font-size: 0.875rem; 
  border: 1px solid rgba(100, 116, 139, 0.6); 
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); 
  resize: none; 
}
.send-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%; 
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: linear-gradient(to top, #0ea5e9, #10b981);
}
</style>
