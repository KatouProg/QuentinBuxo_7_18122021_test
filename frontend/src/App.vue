<template>
  <div class="layout">
  <router-view/>
  </div>
</template>



<style lang="css">
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
body, #app{
  font-family: Poppins, sans-serif;
  margin: 0;
  padding: 0;
  width: 100vw;
  box-sizing: border-box;
  background-image: url('./assets/bg.jpg');
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-color: #042a5f;
  background-blend-mode: lighten;
}
</style>
