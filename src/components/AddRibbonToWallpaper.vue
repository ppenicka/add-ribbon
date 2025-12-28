<script setup lang="ts">
import { ref, watch, onUnmounted, type Ref } from "vue";
import { Adsense } from "vue3-google-adsense";

import { processImage } from "../utils";
import { SCREENS } from "../constants";

const selectedScreen: Ref<number> = ref(0);
const previewUrl: Ref<string | null> = ref(null);
const originalFileName: Ref<string | null> = ref(null);
const uploadedImage: Ref<HTMLImageElement | null> = ref(null);
const imageFormat: Ref<string> = ref("png");

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  originalFileName.value = file.name;

  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      uploadedImage.value = img;
      processImage(img, selectedScreen.value, previewUrl, imageFormat);
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleDownload = () => {
  if (!previewUrl.value) return;

  const link = document.createElement("a");
  const screen = SCREENS[selectedScreen.value];
  const baseName = originalFileName.value?.split(".")[0];

  link.download = `${baseName}-${screen.suffix}-with-ribbon.${imageFormat.value}`;
  link.href = previewUrl.value;
  link.click();
};

const buyMeACoffee = () => {
  window.open("https://buymeacoffee.com/ppenicka", "_blank");
};

watch(selectedScreen, (newScreenIndex) => {
  if (uploadedImage.value) {
    processImage(uploadedImage.value, newScreenIndex, previewUrl, imageFormat);
  }
});

// Cleanup object URLs on unmount
onUnmounted(() => {
  if (previewUrl.value?.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<template>
  <div class="add-ribbon-container">
    <div class="container">
      <Adsense
        adStyle="display:block"
        format="auto"
        full-width-responsive="true"
        clientId="ca-pub-7400192407459006"
        slotId="7750911123"
      >
      </Adsense>
      <h1 class="title">Add Black Ribbon to a Wallpaper</h1>
      <p class="description">
        This tool adds a black ribbon to the top of your wallpaper, letting you
        visually hide the top panel notch on newer MacBooks. It helps remove
        distraction, calm your OCD, and make your workspace feel clean and
        focused.
      </p>

      <div class="screen-selector">
        <label class="label">Select Screen Size:</label>
        <select v-model.number="selectedScreen" class="select">
          <option
            v-for="(screen, index) in SCREENS"
            :key="index"
            :value="index"
          >
            {{ screen.name }} ({{ screen.size[0] }}x{{ screen.size[1] }})
          </option>
        </select>
      </div>

      <div class="upload-section">
        <label for="files" class="label">Select Wallpaper:</label>
        <input
          id="file-upload-button"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
          class="file-input"
        />
      </div>

      <div v-if="previewUrl" class="preview-section">
        <div class="preview-container">
          <img :src="previewUrl" alt="Preview" class="preview-image" />
        </div>
        <div class="button-container">
          <button @click="handleDownload" class="download-button">
            Download Wallpaper with Ribbon
          </button>
          <button class="download-button" @click="buyMeACoffee">
            Buy Me a Coffee
          </button>
        </div>
      </div>

      <div class="footer">
        <a
          href="https://ppenicka.me"
          target="_blank"
          rel="noopener noreferrer"
          class="footer-link"
        >
          ppenicka.me
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.add-ribbon-container {
  width: 100%;
  min-height: 100vh;
  overflow: auto;
}

.container {
  max-width: 42rem;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.title {
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.description {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.screen-selector {
  margin-bottom: 1rem;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
  outline: none;
}

.select:focus {
  outline: none;
}

.upload-section {
  margin: 1rem 0;
}

.file-input {
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
}

.preview-section {
  margin-top: 2rem;
}

.preview-container {
  margin: 1em 0;
  padding: 1rem 0;
  background-color: white;
  border-radius: 1rem;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.preview-image {
  max-width: 100%;
  height: auto;
  display: block;
}

.download-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-button:hover {
  background-color: #35a372;
}

.footer {
  margin-top: 3rem;
  padding-top: 1rem;
  text-align: center;
  border-top: 1px solid #e5e5e5;
}

.footer-link {
  color: #666;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #42b983;
}
</style>
