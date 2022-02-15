<template>
  <div>
    <Header />
    <div class="profile-pictures">
      <div class="user_profile">
        <div class="user_profile-pictures">
          <div class="user-bg_box">
            <img
              class="user-bg"
              :src="userProfile.bgUrl || '../assets/photoW.png'"
              alt=""
            />
            <div class="user-picture">
              <div class="user-picture_box">
                <img
                  class="user-img"
                  :src="userProfile.imageUrl || '../assets/photo.png'"
                  alt="photo profil utilisateur"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="profile-data">
          <span class="user-name">
            {{ userProfile.firstname }} {{ userProfile.lastname }}
          </span>
          <div class="user_profile-bio">
            <div class="user-bio">
              <span class="bio-text">{{ userProfile.bio }}</span>
            </div>
          </div>
          <button
            v-if="userInfos.isAdmin || userProfile.id == userInfos.id"
            @click="deleteAccount()"
            class="deleteBtn"
          >
            Supprimer le compte
          </button>
        </div>
        <div class="profile-timeline"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/HomeHeader.vue";

import { mapState } from "vuex";

export default {
  name: "UserProfile",
  data() {
    return {
      userId: this.$route.params.userId,
      profile: [],
    };
  },
  components: {
    Header,
  },
  mounted: function () {
    this.$store.dispatch("getUserProfile", {
      userProfile: this.$route.params.userId,
    });
  },
  computed: {
    ...mapState({
      userInfos: "userInfos",
      userProfile: "userProfile",
    }),
  },
  methods: {
    deleteAccount() {
      const user = this.userInfos;
      this.$store
        .dispatch("deleteAccount", {
          id: this.userProfile.id,
          userId: user.id,
          isAdmin: user.isAdmin,
        })
        .then(function () {
          this.$router.push("/Home");
          return;
        }),
        function (error) {
          console.log(error);
        };
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
  background: white;
  width: 60%;
  height: auto;
  background: #d3d3d3;
}
.user_profile-pictures {
  position: relative;
  display: flex;
  width: 60vw;
  height: 35vh;
}
.user-bg_box {
  position: relative;
  width: 60vw;
  height: 35vh;
  background: white;
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
  right: 2rem;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  border: solid 1px grey;
  width: 30%;
  cursor: pointer;
}
.user-bg_edit {
  border-radius: 100%;
  width: 2vw;
  margin-right: 3px;
}
.file-upload_bnt {
  display: none;
}
.user-bg {
  width: 60vw;
  height: 35vh;
  border-radius: 6px;
  background: white;
}
.user-picture {
  position: absolute;
  bottom: -30px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.user-picture_box {
  position: relative;
}
.user-img {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  border: 1px solid black;
  z-index: 1;
}
.user-img_edit {
  border-radius: 100%;
  width: 2vw;
}
.edit-picture_btn {
  position: absolute;
  z-index: 10;
  bottom: 10px;
  right: 1rem;
  border: solid 1px grey;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
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
@media screen and (max-width: 767px) {
  .profile-pictures {
    width: 100%;
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