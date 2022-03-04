<template>
  <div>
    <Header />
    <div class="profile-pictures">
      <div class="user_profile">
        <div class="user_profile-pictures">
          <div class="user-bg_box">
            <img
              class="user-bg"
              v-if="userInfos.bgUrl || userOverlay"
              :src="userInfos.bgUrl || userOverlay"
              alt="overlay profil utlisateur"
            />
            <img
              class="user-bg"
              src="../assets/photo.png"
              alt="overlay profil utlisateur"
            />
            <input
              aria-label="button"
              class="file-upload_bnt"
              type="file"
              ref="overlay"
              accept="image/*"
              @change="onOverlayPicked"
            />
            <button @click="onPickOverlay" class="edit-bg_btn">
              <img
                class="user-bg_edit"
                src="../assets/photo.png"
                alt="overlay profil utilisateur"
              />Changer la photo de couverture
            </button>
          </div>
          <div class="user-picture">
            <div class="user-picture_box">
              <img
                class="user-img"
                :src="userInfos.imageUrl || userAvatar"
                alt="image profil utilisateur"
              />
              <img
                class="user-default"
                src="../assets/photo.png"
                alt="image profil utilisateur"
              />
              <button @click="onPickAvatar" class="edit-picture_btn">
                <img
                  class="user-bg_edit"
                  src="../assets/photo.png"
                  alt="overlay profil utilisateur"
                />Changer la photo de profil
              </button>
            </div>
            <input
              class="file-upload_bnt"
              aria-label="button"
              type="file"
              ref="avatar"
              accept="image/*"
              @change="onAvatarPicked"
            />
          </div>
        </div>
      </div>
      <div class="profile-data">
        <div class="action-btn_pictures">
          <button
            v-if="userOverlay != null"
            class="validate-profil_Btn"
            @click="editUserOverlay()"
          >
            Publier Overlay
          </button>
          <button
            v-if="userAvatar != null"
            class="validate-profil_Btn"
            @click="editUserAvatar()"
          >
            Publier
          </button>
        </div>
        <span class="user-name">
          {{ userInfos.firstname }} {{ userInfos.lastname }}
        </span>
        <div class="user_profile-bio">
          <div class="user-bio">
            <span v-if="modificationBio != true" class="bio-text">{{
              userInfos.bio
            }}</span>
            <textarea
              class="bio-text"
              v-model="currentProfileUser.bio"
              v-if="modificationBio"
            ></textarea>
            <button
              class="edit-bio_btn"
              @click="
                displayCurrentProfileUser(userInfos), (modificationBio = true)
              "
              v-if="modificationBio == false"
            >
              Modifier ma bio
            </button>
            <button
              class="edit-bio_btn"
              @click="editProfileUser(currentProfileUser)"
              v-if="modificationBio == true"
            >
              Publier
            </button>
          </div>
        </div>
        <button
          v-if="userInfos.id == userInfos.id || userId == userInfos.isAdmin"
          @click="deleteAccount()"
          class="deleteBtn"
        >
          Supprimer le compte
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/HomeHeader.vue";

import { mapState } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      userAvatar: null,
      userOverlay: null,
      modificationBio: false,
      currentProfileUser: {},
    };
  },
  components: {
    Header,
  },
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
      this.$router.push("/");
      return;
    }
    this.$store.dispatch("getUserInfos");
  },
  computed: {
    ...mapState({
      user: "user",
      userInfos: "userInfos",
      token: "token",
    }),
  },
  methods: {
    onPickAvatar() {
      this.$refs.avatar.click();
    },
    onAvatarPicked(event) {
      this.files = event.target.files[0];
      const files = event.target.files;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.userAvatar = URL.createObjectURL(files[0]);
    },
    editUserAvatar() {
      let formData = new FormData();
      formData.append("image", this.files);
      formData.append("toto", "tata");
      console.log(formData, this.files, formData.get("image"));
      this.$store.dispatch("editUser", formData);
    },
    onPickOverlay() {
      this.$refs.overlay.click();
    },
    onOverlayPicked(event) {
      this.files = event.target.files[0];
      const files = event.target.files;
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.userOverlay = URL.createObjectURL(files[0]);
    },
    editUserOverlay() {
      const formData = new FormData();
      formData.append("overlay", this.files);
      this.$store.dispatch("editUserOverlay", formData);
    },
    displayCurrentProfileUser(userInfos) {
      this.currentProfileUser = userInfos;
      console.log(userInfos);
    },
    editProfileUser(currentProfileUser) {
      this.$store.dispatch("editUserBio", {
        bio: currentProfileUser.bio,
      });
    },
    deleteAccount() {
    const user = this.userInfos;
    this.$store
      .dispatch("deleteAccount", {
        id: user.id,
        userId: user.id,
        isAdmin: user.isAdmin,
      })
      .then(function (error) {
        console.log(error);
      });
    },
  },
};
</script>

<style scoped>
.profile-pictures {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  text-align: center;
}
.user_profile {
  position: relative;
  border-radius: 10px;
  width: 60%;
  height: 100%;
}
.user_profile-pictures {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60vw;
  height: 35vh;
}
.user-bg_box {
  position: relative;
  width: 60vw;
  height: 100%;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
.file-overlay_preview {
  position: absolute;
  top: 0;
  width: 60vw;
  height: 35vh;
}
.file-overlay_picture {
  width: 60vw;
  height: 35vh;
}
.edit-bg_btn {
  position: absolute;
  z-index: 10;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  border: solid 1px grey;
  width: auto;
  cursor: pointer;
}
.user-bg_edit {
  border-radius: 100%;
  width: 2vw;
  margin-right: 3px;
  margin-bottom: 2px;
}
.file-upload_bnt {
  display: none;
}
.user-picture {
  position: absolute;
  bottom: -30px;
  width: 50vw;
  z-index: 99999;
}
.user-picture_box {
  position: relative;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-img {
  position: absolute;
  bottom: 0;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid black;
  z-index: 2;
}
.user-default {
  position: absolute;
  bottom: 0;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid black;
  z-index: 1;
}
.user-bg {
  width: 60vw;
  height: 35vh;
  border-radius: 6px;
  background: white;
}
.user-img_edit {
  border-radius: 100%;
  width: 2vw;
}
.edit-picture_btn {
  position: absolute;
  z-index: 10;
  bottom: 3rem;
  left: -2.5rem;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  border: solid 1px grey;
  width: auto;
  cursor: pointer;
}
.profile-data {
  position: relative;
  flex-direction: column;
  text-align: center;
  width: 60vw;
  height: 45vh;
  background: white;
  margin-top: 3rem;
  border-radius: 6px;
}
.user-name {
  display: block;
  color: #042a5f;
  font-size: 2.5rem;
  font-weight: bold;
}
.user_profile-bio {
  width: 100%;
  display: flex;
  justify-content: center;
}
.user-bio {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bio-text {
  width: 35vw;
  min-height: 15vh;
  resize: none;
  font-size: 1.5rem;
  text-align: center;
  color: #042a5f;
}
.edit-bio_btn {
  margin-top: 1rem;
  font-size: 1.3rem;
  background: transparent;
  border: 2px solid #042a5f;
  border-radius: 8px;
  color: #042a5f;
  cursor: pointer;
}
.file-preview_image {
  border-radius: 100%;
  width: 170px;
  height: 170px;
}
.file-preview {
  position: relative;
}
.edit-avatar_btn {
  position: absolute;
  bottom: 0.5rem;
  left: 40%;
  width: 2rem;
  height: 2rem;
  border-radius: 100%;
  border: 2px solid white;
  background: whitesmoke;
  color: black;
}
.edit-avatar_btn:hover,
.validate-profil_Btn:hover,
.edit-bio_btn:hover {
  background: #042a5f;
  color: white;
}
.deleteBtn {
  margin-top: 1.5rem;
  border: 2px solid red;
  background: transparent;
  color: red;
  font-size: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}
.deleteBtn:hover {
  background: red;
  color: white;
}
.action-btn_pictures {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.validate-profil_Btn {
  margin-top: 12px;
  background: transparent;
  border-radius: 8px;
  border: 2px solid #042a5f;
  color: #042a5f;
}
@media screen and (max-width: 1160px) {
  
  .edit-picture_btn {
    background: white;
    color: #042a5f;
    position: initial;
    z-index: 10;
    display: flex;
    margin-top: 20px;
    align-items: center;
    background: white;
    border-radius: 8px;
    border: solid 1px grey;
    width: 15vh;
    cursor: pointer;
}

  .edit-bg_btn {
    background: white;
    color: #042a5f;
    position: absolute;
    margin-bottom: 250px;
    z-index: 10;
    display: flex;
    align-items: center;
    background: white;
    border-radius: 8px;
    border: solid 1px grey;
    width: 15vh;
    cursor: pointer;
  }

  .profile-data {
    width: 100%;
  }
  .profile-pictures {
    width: 100%;
  }
  .user_profile {
    width: 100%;
  }
  .user_profile-pictures {
    width: 100vw;
  }
  .user-bg_box {
    width: 100%;
  }
  .user-bg {
    width: 100%;
  }
  .file-overlay_preview {
    width: 100%;
  }
}
</style>