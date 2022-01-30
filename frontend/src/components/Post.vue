<template>
  <b-container>
    <div class="card-post">
      <div
        rows="2"
        class="
          d-flex
          flex-column
          mb-2
          mt-lg-3
          mb-lg-5
          border-2
          shadow
          px-lg-3
          pt-lg-4
          bg-white
          rounded
        "
      >
        <div class="container">
          <div class="row">
            <div
              class="profile-picture mr-4"
              @click="getUsersPosts"
              :style="{ 'background-image': `url(${post.avatar})` }"
              alt="User image"
            ></div>
            <div class="col-10">
              <p class="mb-4 font-weight-bolder" align="center">
                <span
                  class="user-name font-weight-bolder"
                  @click="getUsersPosts"
                  >publier par
                  {{ post.user }}
                </span>
                le {{ post.creationDate }}
              </p>
            </div>
            <div>
              <b-row v-show="ShowingModifyPost">
                <b-col cols="2" sm="2" md="2" lg="2" align="center">
                  <div
                    class="image-input"
                    v-b-tooltip.hover
                    title="Modifier l'image"
                    :style="{ 'background-image': `url(${imageData})` }"
                    @click="getImage"
                  >
                    <span v-if="!imageData" class="image-area">Insérer medias<br><i class="fas fa-images fa-2x"></i></span>
                    <input
                      class="file-input"
                      ref="fileInput"
                      type="file"
                      @input="selectImage"
                    />
                  </div>
                  <a
                    @click="removeImage"
                    v-show="displayRemoveImage"
                    v-b-tooltip.hover
                    href="#"
                    style="display: inline"
                    ><i class="fas fa-recycle"></i></a
                  >
                </b-col>
                <b-col cols="8" sm="8=9" md="8" lg="8" align="center">
                  <b-form-textarea
                    class="postText"
                    rows="3"
                    maxlength="500"
                    v-model="updateTextarea"
                  ></b-form-textarea>
                  <p align="center" class="messageError font-weight-bold mt-2">
                    {{ error }}
                  </p>
                </b-col>
                <b-col cols="12" sm="12" md="2" lg="2" align="center">
                  <div>
                    <b-button class="badge badge-pill badge-success" @click="modifyPost"
                      >Envoyer</b-button
                    >
                    <b-button class= "badge badge-pill badge-warning"  @click="resetModifyPost"
                      >Annuler</b-button
                    >
                  </div>
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
        <div>
          <b-col cols="12" lg="12">
            <div class="post-NavBar mb-3">
              <b-col cols="12" sm="10" md="12" lg="12" v-show="displayPostImage">
                <div class="row post-content pr-2 pl-2">{{ post.content }}</div>
              </b-col>
              <b-col
                cols="12"
                sm="10"
                md="10"
                lg="10"
                v-show="!displayPostImage"
              >
                <div class="row post-content pr-2 pl-2">{{ post.content }}</div>
              </b-col>
            </div>
          </b-col>
        </div>
      </div>
      <b-col
        sm="12"
        offset-md="1"
        md="10"
        offset-lg="2"
        lg="8"
        class="post mb-4"
      >
        <!-- Vue pour modification -->

        <!-- Vue affichage -->
        <b-row v-show="!ShowingModifyPost">
          <b-col
            align="center"
            cols="12"
            sm="12"
            md="12"
            lg="12"
            v-show="displayPostImage"
          >
            <div class="post-image">
              <img
                id="modifyImage"
                class="img-fluid img-thumbnail"
                :src="postImage"
                alt="Posted image"
              />
            </div>
          </b-col>

          <b-col cols="12" sm="2" md="2" lg="2">
            <div align="center">
              <button-group  v-show="ShowTheDropdown">
                <b-dropdown
                  class="dropdown"
                  size="sm"
                  text="Modifier votre publication"
                >
                  <b-dropdown-item
                    v-if="userId === post.userId"
                    @click="displaySwitch"
                    >Modifier</b-dropdown-item
                  >
                  <b-dropdown-item
                    v-if="admin || userId === post.userId"
                    @click="deletePost"
                    >Supprimer</b-dropdown-item
                  >
                </b-dropdown>
              </button-group>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </div>
  </b-container>
</template>           

<script>


export default {
  name: "Post",

  data() {
    return {
      imageData: this.post.image,
      ShowingModifyPost: false,
      ShowTheDropdown: false,
      updateTextarea: this.post.content,
      avatar: this.post.avatar,
      uri: "posts/" + this.post.id,
      file: "",
      error: "",
      headers: {
        headers: {
          Authorization: this.token,
          userId: this.userId,
        },
      },
    };
  },
  computed: {
    postImage() {
      //image du post
      return this.post.image;
    },
    body() {
      //content du post pour envoyer à l'api
      return {
        content: this.updateTextarea,
      };
    },
    displayPostImage() {
      //si image ou pas diférent affichage
      if (this.post.image) {
        return true;
      } else {
        return false;
      }
    },
    displayRemoveImage() {
      if (this.imageData) {
        return true;
      } else {
        return false;
      }
    },
  },
  props: {
    post: {
      type: Object,
    },
    userId: {
      type: String,
    },
    token: {
      type: String,
    },
    admin: {
      type: Boolean,
    },
  },
  created() {
    this.toggleDropdownButton();
  },

  methods: {
    getUsersPosts() {
      this.$http
        .get(
          "http://localhost:3000/api/posts/users/" + this.post.userId,this.headers)
        .then((res) => {
          this.$emit("users-posts", res.data);
          this.$emit("post-by-profile", true);
          console.log(res.data);
        });
    },
    getOnePost() {
      //rafraichir le post après annulation de modification
      this.Axios
        .get("http://localhost:3000/api/posts/" + this.post.id, this.headers)
        .then((res) => {
          this.updateTextarea = res.data.content;
        });
    },
      sendUpdatePost(data) {
        this.$http
          .put("http://localhost:3000/api/" + this.uri, data, this.headers)
          .then(() => {
            this.$parent.getPosts(); //rafraichir tous les posts
            this.$refs.fileInput.value = "";
            this.displaySwitch();
          })
          .catch(() => {
            this.error = "Un problème est survenu, veuillez réessayer";
          });
      },
            deletePost() {
              this.$http
                .delete('http://localhost:3000/api/' + this.uri, this.headers)
                .then(() => {
                  this.$parent.getPosts();
                })
                .catch(() => {
                  this.error = "Un problème est survenu, veuillez réessayer";
                });
            },
    selectImage() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          this.imageData = event.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.file = this.$refs.fileInput.files[0];
      }
    },
    getImage() {
      this.$refs.fileInput.click();
    },

    removeImage() {
      this.file = "delete";
      this.imageData = "";
    },
    //affiche le dropbutton si propre use ou admin sinon pas d'affichage
    toggleDropdownButton() {
      if (this.admin === true || this.userId === this.post.userId) {
        this.ShowTheDropdown = !this.ShowTheDropdown;
      }
    },

  
    displaySwitch() {
      //permet de passer de l'affichage du post à la modification
      (this.ShowingModifyPost = !this.ShowingModifyPost),
        (this.ShowTheDropdown = !this.ShowTheDropdown);
    },



    modifyPost() {
      if (
        (this.file === "delete" || this.file === "") &&
        this.body.content === ""
      ) {
        this.deletePost();
      } else if (this.file === "delete") {
        let formData = new FormData();
        formData.append("image", "delete");
        formData.append("content", this.body.content);
        this.sendUpdatePost(formData);
        console.log(...formData);
      } else {
        let formData = new FormData();
        formData.append("image", this.file);
        formData.append("content", this.body.content);
        this.sendUpdatePost(formData);

      }
    },

    resetModifyPost() {
      this.imageData = this.post.image;
      this.getOnePost();
      this.displaySwitch();
    },
  },
};
</script>

<style scoped>
.post {
  padding-right: 0;
  padding-left: 0;
}
.post-content {
  
  display: block;
  padding-bottom: 10px;
 word-break: break-all;
}
.post-header {
  line-height: 30px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  font-size: 1em;

  white-space: pre-wrap;
}
.profile-picture {
  width: 2em;
  height: 2em;
  margin-bottom: 4px;
  margin-top: 4px;
  cursor: pointer;
  vertical-align: middle;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 50%;
}
.user-name {
  cursor: pointer;
}
.postText {
  resize: none;
  border: 1px solid black;
}
.postText:focus {
  outline: none !important;
  border: 1px solid black;
  box-shadow: 0 0 10px #3b2cc2;
}
.send-button {
  background-color: #3b2cc2;
  color: white;
  border: solid 1px black;
}
.send-button:hover {
  background:pink;
}
.reset-button {
  background-color: transparent;
  border: solid 1px #3b2cc2;
  color: black;
}
.reset-button:hover {
  background: #ffe4e4;
}
.button-col {
  display: flex;
  flex-direction: row;
}
.messageError {
  color: #fd2d01;
}

.post-image {
  display: flex;
  max-width: 300px;
  max-height: 100px;
}

.img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  padding: 5px 5px 2px 5px;
}
.image-styling {
  max-height: 100%;
  object-fit: cover;
  max-width: 100%;
}
.image-input {
  display: block;
  width: 5.5em;
  height: 5.5em;
  cursor: pointer;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
.image-input:hover {
  opacity: 0.5;
}
.image-area {
  background: #353864;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  font-size: 1em;
  text-align: center;
  object-fit: cover;
}

.file-input {
  display: none;
}
.fa-recycle {
  display: none;
  position: absolute;
  top: -0.5em;
  right: 0.5em;
  
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
@media screen and (max-width: 1800px) {
  .post-image {
    max-width: 25em;
    max-height: 19em;
    object-fit: cover;
  }
  .button-col {
    flex-direction: column;
    justify-content: space-evenly;
    margin-top: 1em;
  }
}
@media screen and (max-width: 760px) {
  .post-header {
    font-size: 0.9em;
  }
  .post-content {
    text-align: center;
  }
  .post-image {
    object-fit: cover;
    margin-bottom: 1.5em;
  }
  .button-col {
    margin-top: 1em;
  }
}
@media screen and (max-width: 440px) {
  .post-image {
    flex-direction: column;
    text-align: left;
    height: 300px;
    width: 300px;
    min-width: 50%;
    max-width: 100%;
    object-fit: cover;
  }
  .post-content {
    font-size: 0.9em;
  }
  .post-header {
    font-size: 0.8em;
  }
}
</style>