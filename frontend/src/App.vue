<template>
  <div id="nav">
    <router-link to="/"><img
          id="img_home"
          src="./assets/img/icon4.png"
          alt="Logo du groupe Groupomania"
          title="Groupomania"
        /></router-link> |
    <router-link to="/home">Home</router-link> |
    <router-link to="/">Se connecter</router-link> |
    <router-link to="/profil">Profil</router-link>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang='scss'>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;800&display=swap');

* {
  font-family: 'Poppins', sans-serif;
  margin:0;
  padding: 0;
  box-sizing: border-box;
  margin-right: auto;
  margin-left: auto;
}

#app {
  max-width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  background-color: white;
  max-width: 100%;
  height:100%;
  width: 900px;
  background:white;
  border-radius:16px;
  padding:32px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #fc2c04;
    }
  }
}

body {
  background-image: linear-gradient(62deg, #ccb0ac 0%, #ffdcd7 100%);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding:2px;
}

img {
  max-width: 100%;
  border-radius: 8px;
}

#img_home {
  margin-right: 20px;
}

.card {
  max-width: 100%;
  width: 540px;
  background:white;
  border-radius: 16px;
  padding:32px;
  margin-top: 25%;
}

.card__title {
  text-align:center;
  font-weight: 800;
}

.card__subtitle {
  text-align: center;
  color:#666;
  font-weight: 500;
}

  .button {
    background: #2196F3;
    color:white;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    border: none;
    width: 100%;
    padding: 16px;
    transition: .4s background-color;
  }

  .card__action {
    color:#2196F3;
    text-decoration: underline;
  }

  .card__action:hover {
    cursor:pointer;
  }

  .button:hover {
    cursor:pointer;
    background: #1976D2;
  }

  .button--disabled {
    background:#cecece;
    color:#ececec
  }
  .button--disabled:hover {
    cursor:not-allowed;
    background:#cecece;
  }

</style>
