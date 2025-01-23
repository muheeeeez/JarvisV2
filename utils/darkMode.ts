import { ref, onMounted } from "vue";

const isDarkMode = ref(false);

export function useDarkMode() {
  const setColors = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.style.setProperty(
        "--background-color",
        "#222428"
      );
      document.documentElement.style.setProperty("--text-color", "#f4f5f8");
    } else {
      document.documentElement.style.setProperty(
        "--background-color",
        "#ffffff"
      );
      document.documentElement.style.setProperty("--text-color", "#000000");
    }
  };

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    // Save to localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode.value));
    if (isDarkMode.value) {
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
    }
  };

  onMounted(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      isDarkMode.value = JSON.parse(savedMode);
      if (isDarkMode.value) {
        document.documentElement.classList.add("dark-mode");
      }
    }
  });

  return { isDarkMode, toggleDarkMode };
}
