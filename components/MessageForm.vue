<template>
  <form class="message-form">
    <fieldset>
      <!-- A text box for the user to type their message -->
      <textarea
        class="text-box"
        rows="4"
        placeholder="Enter your message..."
      ></textarea>

      <!-- A send button with a success color and rounded shape -->
      <ion-button
        type="submit"
        class="send-button"
        color="success"
        shape="round"
      >
        <!-- Icon for the send button -->
        <ion-icon src="/assets/send-sharp.svg" slot="icon-only"></ion-icon>
      </ion-button>

      <!-- Another identical send button (may be redundant) -->
      <ion-button
        type="submit"
        class="send-button"
        color="success"
        shape="round"
      >
        <!-- Icon for the send button -->
        <ion-icon src="/assets/send-sharp.svg" slot="icon-only"></ion-icon>
      </ion-button>
    </fieldset>
  </form>
</template>

<style scoped>
/* Styling the icon inside the send button */
ion-icon {
  font-size: 20px;
  color: white;
}

/* Form styling for positioning and spacing */
.message-form {
  position: relative;
  margin: 1rem;
}

/* Fieldset styling to remove borders and padding */
.message-form fieldset {
  border: none;
  padding: 0;
}

/* Text box styling for appearance and usability */
.text-box {
  background: white;
  width: 100%;
  display: block;
  box-sizing: border-box;
  padding: 1rem;
  padding-right: 3rem; /* Space for the button */
  font-size: 0.875rem; /* Font size */
  border: 1px solid rgba(100, 116, 139, 0.6); /* Subtle border */
  border-radius: 0.75rem; /* Rounded corners */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Light shadow */
  resize: none; /* Prevent resizing */
}

/* Send button styling for positioning and appearance */
.send-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 100%; /* Circle shape */
  display: flex;
  align-items: center;
  justify-content: center; /* Center icon */
  color: #fff; /* White text */
  background: linear-gradient(to top, #0ea5e9, #10b981); /* Gradient background */
}
</style>
