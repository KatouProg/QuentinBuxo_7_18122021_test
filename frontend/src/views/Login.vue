<template>
  <div class="connexion-layout">
    <div class="rightlogintitle">
      <img src="../assets/logoheader.png" alt="groupomamia logo" />
      <span class="slogan" aria-label="label"
        ><i>"La communication est indispensable, jamais suffisante."</i><br><br>Communiquons plus !!!</span
      >
    </div>
    <div class="userlog">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        aria-label="email"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        aria-label="password"
      />
      <div class="form-row" v-if="status == 'error_login'">
        Adresse mail et/ou mot de passe invalide
      </div>
      <button @click="login()" class="logbtn">Connexion</button>
      <span>Pas encore inscrit ?</span>
      <button
        @click="signupModal = true"
        class="signup-front-btn"
        aria-label="button"
      >
        Créer un compte
      </button>
    </div>
    <teleport to="#modals">
      <div v-if="signupModal" class="Signup-modal">
        <div class="overlay"></div>
        <div class="user-signup">
          <div class="signup-title">
            <h1>S'inscrire</h1>
            <p>C'est facile et rapide !</p>
          </div>
          <button @click="signupModal = false" class="closemodalbtn">X</button>
          <div class="signup-form">
            <div class="names">
              <input
                v-model="firstname"
                class="fname"
                type="text"
                placeholder="Prénom"
              />
              <input
                v-model="lastname"
                class="lname"
                type="text"
                placeholder="Nom de famille"
              />
            </div>
            <input
              v-model="email"
              type="Email"
              placeholder="Email"
              aria-label="email"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Mot de passe"
              aria-label="password"
            />
            <div class="form-row" v-if="status == 'error_create'">
              Adresse mail ou mot de passe incorrect
            </div>
            <button @click="createAccount()" class="signup-btn">
              S'incrire
            </button>
          </div>
        </div>
      </div>
    </teleport>
    <footer>
      <span>© Groupomania 2021</span>
    </footer>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      signupModal: false,
      email: "",
      firstname: "",
      lastname: "",
      password: "",
    };
  },
  mounted: function () {
    if (this.$store.state.user.userId != -1) {
      this.$router.push("/Profile");
      return;
    }
  },
  computed: {
    ...mapState(["status"]),
  },
  methods: {
    login: function () {
      const self = this;
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then(
          function () {
            self.$router.push("/Profile");
          },
          function (error) {
            console.log(error);
          }
        );
    },
    createAccount: function () {
      const self = this;
      this.$store
        .dispatch("createAccount", {
          email: this.email,
          firstname: this.firstname,
          lastname: this.lastname,
          password: this.password,
        })
        .then(
          function () {
            self.login();
          },
          function (error) {
            console.log(error);
          }
        );
    },
  },
};
</script>

<style>
.connexion-layout {
  display: grid;
  align-content: center;
  justify-items: center;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  height: 100vh;
}
.rightlogintitle {
  grid-column-start: 1;
  display: flex;
  align-items: center;
  text-align: center;
  flex-direction: column;
  border-radius: 10px;
  width: 40vw;
  height: 50vh;
  margin: 5vh 0;
}
.slogan {
  font-size: 1.5rem;
  color: white;
  margin: 3rem 1.5rem 0 1.5rem;
}
img {
  margin-top: 1rem;
  width: 80%;
}
h1 {
  font-size: 2rem;
  color: #042a5f;
}
p {
  font-size: 1rem;
  color: #042a5f;
}
.userlog {
  grid-column-start: 2;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  width: 45vw;
  margin: 5vh 0;
  background: #d3d3d3;
}
input {
  width: 90%;
  height: 6vh;
  border-radius: 10px;
  margin-bottom: 2vh;
  border: 1px solid #d3d3d3;
  background: white;
  text-indent: 10px;
}
.logbtn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 6vh;
  font-size: 100%;
  margin: 3vh 0;
  background: #042a5f;
  border-style: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
}
.signup-btn,
.signup-front-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 6vh;
  font-size: 100%;
  margin: 3vh 0;
  background: #2c661f;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  text-align: center;
  border-style: none;
}
.closemodalbtn {
  position: absolute;
  top: 1rem;
  right: 0.5rem;
  border: none;
  background: white;
  color: #042a5f;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
}
a {
  text-decoration: none;
}
.Signup-modal {
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
.user-signup {
  z-index: 1;
  position: relative;
  width: 50vw;
  height: auto;
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
.signup-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.names {
  display: flex;
  justify-content: space-between;
  width: 90%;
}
.fname {
  width: 45%;
}
.lname {
  width: 50%;
}
footer {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100vw;
  height: 50px;
  color: #ededed;
  font-weight: bold;
  background: #042a5f;
}
.rl-color {
  color: white;
}
@media screen and (max-width: 767px) {
  .connexion-layout {
    display: flex;
    flex-direction: column;
  }
  .rightlogintitle,
  .userlog {
    width: 100vw;
    padding-top: 1.5rem;
  }
  .user-signup {
    width: 100vw;
  }
}
</style>
