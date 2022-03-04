<template>
  <div class="SP-layout">
    <div class="publicationbox-layout">
      <div class="user_publication-container">
        <div class="user_pict-link">
          <img
            class="user_profile-picture"
            :src="userInfos.imageUrl"
            alt="photo de profil utilisateur"
          />
          <div
            @click="publishModal = true"
            class="postlink-container"
            role="button"
          >
            Que voulez vous dire {{ userInfos.firstname }} ?
          </div>
        </div>
      </div>
    </div>
    <teleport to="#modals">
      <div v-if="publishModal" class="publication-modal">
        <div class="overlay"></div>
        <div class="userProfile">
          <div class="user_pict-link">
            <img
              class="user_profile-picture"
              :src="userInfos.imageUrl"
              alt="photo de profil utilisateur"
            />
            <div>{{ userInfos.firstname }} {{ userInfos.lastname }}</div>
          </div>
          <button @click="publishModal = false" class="closemodalbtn">X</button>
          <form
            @submit.prevent="submitPublication"
            class="send-publication_form"
          >
            <textarea
              v-model="content"
              class="text-content"
              type="text-area"
              placeholder="Que voulez vous dire?"
            />
            <div class="publication-preview">
              <img
                class="publication-preview_image"
                v-if="image"
                :src="image"
                alt="image avant publication"
              />
            </div>
            <div class="action-container_btn">
              <button @click="onPickFile" class="upload-btn">
                Choisir un fichier<img
                  class="upload-icon"
                  src="../assets/image-gallery.png"
                  alt="icon de chargement d'image"
                />
              </button>
              <input
                class="file-upload_bnt"
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              />
              <button @click="addPublication()" class="publish-btn">
                Publier<img
                  class="publish-icon"
                  src="../assets/send.png"
                  alt=""
                />
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SendPublication",
  data() {
    return {
      publishModal: false,
      content: "",
      image: null,
    };
  },
  computed: {
    ...mapState({
      userInfos: "userInfos",
      publications: "publications",
    }),
  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      this.files = event.target.files[0];
      const files = event.target.files;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = URL.createObjectURL(files[0]);
      console.log(this.image);
    },
    addPublication() {
      const formData = new FormData();
      formData.append("id", this.userInfos.id);
      formData.append("content", this.content);
      formData.append("image", this.files);
      this.$store.dispatch("addPublication", formData);
      console.log(...formData);
    },
  },
};
</script>

<style scoped>
.publicationbox-layout {
  width: 100vw;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.text-content {
  width: 95%;
  min-height: 5vh;
  border: none;
  resize: vertical;
  outline: unset;
  text-indent: 1rem;
  font-size: 1rem;
  font-family: poppins, sans-serif;
}
.send-publication_form {
  max-height: 40vh;
}
.publication-preview {
  width: 95%;
  height: 100%;
}
.publication-preview_image {
  width: 50vw;
  height: 30vh;
}
.action-container_btn {
  display: flex;
}
.upload-btn,
.publish-btn {
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  background: white;
  justify-content: center;
  width: 25vw;
  border-width: 1px;
  border-color: grey;
  border-style: solid;
  padding: 10px 0;
}
.publish-btn {
  right: 0;
}
.file-upload_bnt {
  display: none;
}
.upload-icon,
.publish-icon {
  width: 2.5vw;
}
.overlay {
  background: rgba(255, 255, 255, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.publication-modal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.overlay {
  background: rgba(255, 255, 255, 0.7);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.userProfile {
  z-index: 1;
  position: relative;
  width: 50vw;
  height: 50vh;
  align-items: center;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 12px 12px 2px 1px rgba(0, 0, 0, 0.1);
}
.signup-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.current-publication_picture {
  width: 95%;
  height: auto;
}
.file-preview {
  max-width: 100%;
  height: auto;
  max-height: 50vh;
}
.file-preview_image {
  width: 100%;
  max-height: 50vh;
}
.upload-btn,
.publish-btn {
  display: flex;
  align-items: center;
  background: white;
  justify-content: center;
  width: 25vw;
  border-width: 1px;
  border-color: grey;
  border-style: solid;
  padding: 10px 0;
}
.file-upload_bnt {
  display: none;
}
.upload-icon,
.publish-icon {
  width: 2.5vw;
}
.edit-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.closemodalbtn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  appearance: none;
  font-weight: bold;
  border: none;
  cursor: pointer;
}
@media screen and (max-width: 767px) {
  .SP-layout,
  .user_publication-container {
    width: 90vw;
  }
  .publication-modal,
  .user-signup {
    width: 100vw;
  }
}
</style>>



