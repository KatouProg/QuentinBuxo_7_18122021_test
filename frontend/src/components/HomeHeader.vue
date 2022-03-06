<template>
  <div class="layout">
    <header>
      <div class="user-side_profile">
        <div class="user-profile_container">
          <router-link class="user-name" to="/Profile">{{
            userInfos.firstname
          }}</router-link>
          <img
            class="user_profile-pict"
            :src="userInfos.imageUrl"
            alt=" photo de profil utilisateur"
          />
        </div>
      </div>
      <div class="logo-router">
        <router-link to="/Home"
          ><img
            class="logo"
            alt="Groupomania logo"
            src="../assets/logoheader.png"
            aria-label="button"
        /></router-link>
        <router-link to="/Home"
          ><img
            class="mobil-logo"
            alt="Groupomania logo"
            src="../assets/mobile_logo.png"
            aria-label="button"
        /></router-link>
      </div>
      <div class="user-logout_profile">
        <button class="logout-Btn" @click="logout()">
          <img
            class="sign-out_icon"
            src="../assets/log-out.png"
            alt="bouton déconnexion"
          />
        </button>
      </div>
    </header>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Header",
  components: {},
  mounted: function () {
    this.$store.dispatch("getUserInfos");
  },
  computed: {
    ...mapState({
      user: "user",
      userInfos: "userInfos",
    }),
  },
  methods: {
    logout: function () {
      this.$store.commit("LOG_OUT");
      this.$router.push("/");
    },
  },
};
</script>


<style>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  width: 100vw;
  background: #042a5f;
}
a {
  text-decoration: none;
}
.logo {
  padding: 1rem;
  background: #042a5f;
}
.mobil-logo {
  display: none;
}
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80%;
}
.search-input {
  position: relative;
  width: 100%;
  height: 35px;
  border-radius: 1rem;
  background: white;
  text-indent: 1.5rem;
}
input {
  outline: none;
  border: none;
}
.searchlogo {
  position: absolute;
  left: 10px;
  width: auto;
  height: 0.8rem;
}
.user_side {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
}
.user_side-logonotif {
  width: 1.5rem;
  height: auto;
}
.notif-count {
  text-align: center;
  position: absolute;
  top: 4px;
  right: -4px;
  width: 1rem;
  height: 1rem;
  color: white;
  background: #f92d02;
  border: 1px solid white;
  border-radius: 50%;
}
.notiflogoborder {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-left: 1.5rem;
}
.user-logout_profile {
  display: flex;
  align-items: center;
}
.user-side_profile {
  padding-left: 1.5rem;
}
.user-profile_container {
  border-radius: 25px;
  background: white;
  border: 1px solid white;
  margin-left: 1.5rem;
  display: flex;
  align-items: center;
}
.user-name {
  color: #042a5f;
  font-size: 1.2rem;
  margin: 0 0 0 10px;
}
.sign-out_icon {
  width: 3vw;
  margin-right: 1.5rem;
}
.logout-Btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
}
.user_profile-pict {
  background: white;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid white;
  margin: 0;
}
.user_publication-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  background: white;
  margin: 1rem;
  border-radius: 6px;
}
.user_pict-link {
  display: flex;
  align-items: center;
}
.user_profile-picture {
  width: 3rem;
  height: 3rem;
  border: 1px solid black;
  margin: 1rem;
  border-radius: 50%;
  background: white;
}
.postlink-container {
  display: flex;
  align-items: center;
  width: 73%;
  height: 40px;
  padding-left: 1rem;
  margin-left: 4px;
  border-radius: 1rem;
  background: #d3d3d3;
}
@media screen and (max-width: 767px) {

  header {
    height: auto;
  }

  .mobil-logo {
    display: block;
    width: 12vw;
    padding-bottom: 15px;
  }
  .logo {
    display: none;
  }
  .sign-out_icon {
    width: 11vw;
    margin: 0 15px 0 0
  }
 
  .user_pict-link {
    font-size: 0.8em;
    padding-right: 7px;
  }
  .user-profile_container {
  width: auto;
  height: 4vh;
  margin: 0 0 0 15px;
}
  .user_profile-pict {
  display: none;
}
  .user-name {  
  padding-right: 7px;
  } 
  .user-side_profile {
  padding: 0 0 0 0;
}
 
}
</style>