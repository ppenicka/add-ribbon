<script setup lang="ts">
import { ref, watch, onUnmounted, type Ref } from "vue";
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
      <h1 class="title">Add Black Ribbon to Image</h1>

      <div class="screen-selector">
        <label class="label">Select Screen:</label>
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
        <input
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
        <button @click="handleDownload" class="download-button">
          Download
        </button>
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
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 1rem;
}

.upload-section {
  margin: 1rem 0;
}

.file-input {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
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
</style>
