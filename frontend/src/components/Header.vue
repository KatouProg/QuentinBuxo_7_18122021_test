<template>
  <b-container class="mb-4">
    <div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <img class="logo mr-5"
         src="../assets/img/icon-header.png"
         height="60"
        alt="logo"/>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
          <b-nav-item v-show="!showProfile" @click="profile"><i class="fas fa-user-cog"></i>Profil</b-nav-item>
         <b-nav-item v-show="showProfile" @click="profile">PostForm</b-nav-item>
        <b-nav-item @click="Exit"><i class="fas fa-sign-out-alt"></i>exite</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</div>
  </b-container>
</template>
 
<script>
export default {
  name: "Header",
  props: {
    showProfile: {
      type: Boolean,
    },
  },
  methods: {
    profile() {
      let emitshowProfile = !this.showProfile;
      this.$parent.getPosts();
      this.$emit("showProfile", emitshowProfile);
    },
    /*disables() {
      this.$emit("showProfile", false);
    },*/
     Exit () {
      localStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>

.nav-item {
  text-align: end;
}
@media screen and (max-width: 420px) {
  .logo {
    width: 50%;
    height: 50%;
  }
  .header-box {
    width: 150px;
  }
}

.navbar {
  background-color: #2e0bac;
}
.navbar .navbar-nav .nav-link {
  color: #fff;
}
.navbar .navbar-nav .nav-link:hover {
  color: #fbc531;
}
.navbar .navbar-nav .active > .nav-link {
  color: #fbc531;
}
</style>