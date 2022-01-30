<template>
  <div class="container">
    <Header @showProfile="profile" :showProfile="showProfile" />
    <Profile
      @showProfile="profile"
      v-show="showProfile"
      :userId="userId"
      :token="token"
      :showProfile="showProfile"
    />

    <!--Insertion post et image-->

    

    <div v-show="!profileSwitcher">
      <div class="card " style="width: 100%; height: 250px" v-show="!showProfile">
        <div class="row" >
          <b-col cols="8" sm="8" md="10" lg="10">
            <b-form-textarea
              maxlength="2047"
              id="textarea"
              placeholder="Quoi de neuf ?"
              @input="lenghtCheck"
              rows="1"
              class="postText"
              style="width: 100%; height: 100px"
              v-model="postText"
            ></b-form-textarea>
            <p class="messageError font-weight-bold text-center mt-2">
              {{ postError }}
            </p>
          </b-col>

          <b-col cols="4" sm="3" md="2" lg="2" align="center">
            <div
              class="image-input"
              :style="{ 'background-image': `url(${imageData})` }"
              @click="getImage"
            >
              <span v-if="!imageData" class="image-area"><i class="fas fa-images fa-2x"></i>Insérer medias Image ou Gif</span>
              <input
                type="file"
                class="file-input"
                ref="file"
                @input="selectImage"
              />
            </div>
            <a
              @click="removeImage"
              v-show="displayRemoveImage"
              href="#"
              style="display: inline"
              ><i class="fas fa-recycle"></i></a
            >
          </b-col>

          <div >
            <b-button variant="btn btn-outline-success m-2" @click="createPost"
              >Envoyer</b-button
            >
            <b-button variant="btn btn-outline-warning m-2" @click="resetPost"
              >Annuler</b-button
            >
          </div>
        </div>
      </div>
    </div>

    <!--Affichage de l'en-tête d'un utilisateur-->

    <div class="card mb-4" v-show="profileSwitcher">
      <b-col align="center" offset-lg="2" lg="3">
        <div
          class="profile-picture mb-2"
          :style="{ 'background-image': `url(${avatar})` }"
          alt="User image"
        ></div>
      </b-col>
      <b-col align="center" lg="5">
        <h1>Profil de {{ userName }}</h1>
        <p>{{ userEmail }}</p>
        <div>
          <b-button
         
            size="sm"
            class="badge badge-primary"
            @click="
              profileSwitching(false);
              getPosts();
            "
            >forum</b-button
          >
        </div>
      </b-col>
    </div>

    <!--Affichage des posts d'un ou de plusieurs utilisateurs-->
    <b-row v-for="postData in posts" :key="postData.id" v-show="!showProfile">
      <b-col>
        <Post
          @users-posts="usersPosts"
          @post-by-profile="profileSwitching"
          :post="postData"
          :admin="admin"
          :userId="userId"
          :token="token"
        ></Post>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Post from "./Post.vue";
import Profile from "./Profile.vue";



export default {
  name: "PostsList",
  components: {
    Header,
    Post,
    Profile,
  },

  data() {
    return {
      userId: "",
      userName: "",
      userEmail: "",
      posts: [],
      users: [],
      postError: "",
      avatar: "",
      file: "",
      profileSwitcher: false,
      imageData: null,
      displayCommands: false,
      showProfile: false,
      like: [],
      token: "",
      admin: false,
      error: {},
      postText: "",
      testKey: "",
    };
  },
  computed: {
    headers() {
      return { headers: { Authorization: this.token, userId: this.userId } };
    },
    //data dynamique qui contrôle l'affichage de la croix de suppression de l'image
    displayRemoveImage() {
      if (this.imageData) {
        return true;
      } else {
        return false;
      }
    },
  },
  //Validation du state de l'utilisateur
  created() {
    this.getUser();
  },
  //construction du composant post
  mounted() {
    this.getPosts();
  },

  methods: {
    createPost() {
      if (!this.postText && !this.imageData) {
        this.postError = "Votre publication est vide";
        setTimeout(() => {
          this.postError = "";
        }, 3000);
        return;
      }
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("content", this.postText);
      formData.append("user_id", this.userId);
      this.$http
        .post("http://localhost:3000/api/posts", formData, this.headers)
        .then(() => {
          this.resetPost();
          this.getPosts();
        })
        .catch(() => {
          this.postError = "Un problème est survenu";
        });
    },
    getPosts() {
      //utilisée pour charger les posts et pour recharger le composant
      this.$http.get("http://localhost:3000/api/posts", this.headers).then((res) => {
        this.posts = res.data;
      });
    },
    
    getImage() {
      this.$refs.file.click();
    },
    selectImage() {
      //fonction qui récupère l'image du stockage du navigateur pour la préparer pour l'afficher et l'enregistrer
      const input = this.$refs.file;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imageData = event.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.file = this.$refs.file.files[0];
      }
    },
    removeImage() {
      this.file = "";
      this.imageData = null;
    },
    usersPosts(data) {
      //charger post par utilisateur
      this.posts = data;
    },
    profileSwitching(data) {
      this.profileSwitcher = data;
    },
    profile(data) {
      this.showProfile = data;
    },
    //lancé a created pour vérifier l'authenticité du user et si admin ou pas
    getUser() {
      const userLogin = JSON.parse(localStorage.getItem("userLogin"));
      if (userLogin) {
        this.token = userLogin.token;
        this.userId = userLogin.userId;
        this.$http
          .get(
            "http://localhost:3000/api/users/" + userLogin.userId,
            this.headers
          )
          .then((res) => {
            this.admin = res.data.admin;
          })
          .catch(() => {
            this.$router.push("/login");
          });
      } else {
        this.$router.push("/login");
      }
    },
    resetPost() {
      this.imageData = null;
      this.file = "";
      this.postText = "";
      this.$refs.file.value = "";
    },
  },
      watch: {
        //Surveille les posts dans le cas de rechargement
        posts() {
          if (this.posts !== "undefined" && this.posts.length > 0) {
            //evite erreur si aucun post publié
            this.avatar = this.posts[0].avatar;
            this.userName = this.posts[0].user;
            if (this.posts[0].email.startsWith("")) {
              this.userEmail = "";
            } else {
              this.userEmail = this.posts[0].email;
            }
          }
        },
        showProfile() {
          if (this.showProfile === true) {
            this.profileSwitcher = false;
          }
        },
      },
};
</script>



<style scoped>
.postText {
  resize: none;
  border: 1px solid black;
}
.postText:focus {
  outline: none !important;
  border: 1px solid black;
  box-shadow: 0 0 10px #3b2cc2;
}
.post {
  border-bottom: 0.15em solid black;
  padding-right: 0;
  padding-left: 0;
}
.post-header {
  background-color: #383636;
  font-size: 1em;
  border-radius: 80px 30px;
  text-align: center;
}
.send-button {
  background-color: #3b2cc2;
  color: white;
  border: solid 1px #140b99;
}
.send-button:hover {
  background: purple;
}
.reset-button {
  background-color: transparent;
  border: solid 1px #3b2cc2;
  color: #e42701;
}
.reset-button:hover {
  background: #ffe4e4;
}
.button-col {
  display: flex;
  width: 7em;
  flex-direction: column;
}
.messageError {
  color: #fd2d01;
}
.image-input {
  width: 5.5em;
  height: 5.5em;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
.image-area {
  max-width: 60px;
  background: #ffffff;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 1em;
  text-align: center;
 
  border-radius: 5px;
}
.img {
  max-width: 20px;
  border-radius: 8px;
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  padding: 5px 5px 2px 5px;
}

.file-input {
  display: none;
}
.profile-picture {
  width: 25em;
  height: 25em;
  cursor: pointer;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  /*border-radius: 50%;*/
}
.back-button {
  background-color: transparent;
  border: solid 1px #3b2cc2;
  color: #e42701;
}
.back-button:hover {
  background: #ffe4e4;
}
.fa-recycle {
  display: none;
  position: absolute;
  top: -0.4em;
  right: 1.5em;
  border-radius: 10em;
  padding: 2px 6px 3px;
  text-decoration: none;
  font: 700 21px/20px sans-serif;
  background: #555;
  border: 3px solid #fff;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.3);
}
.fa-recycle:hover {
  background: #e54e4e;
}
.fa-recycle:active {
  background: #e54e4e;
}
@media screen and (max-width: 767px) {
  .button-col {
    flex-direction: row-reverse;
    justify-content: space-evenly;
    width: auto;
  }
  .img {
    max-width: 400px;
    border-radius: 8px;
  }
}
@media screen and (max-width: 560px) {
  .profile-picture {
    width: 8em;
    height: 8em;
  }
  h1 {
    font-size: 2em;
  }
  .img {
    max-width: 400px;
    border-radius: 8px;
  }
}
</style>
