<template>
  <div class="timeline-container">
    <div class="publication-container">
      <div
        v-for="publication in publications"
        :key="publication.id"
        class="publication-card"
      >
      <!-- {{ publication }} -->
        <div class="profile-publication">
          <router-link
            class="user-name"
            :to="{
              name: 'UserProfile',
              params: { userId: publication.userId },
            }"
          >
            <img
              class="user_profile-picture"
              :src="publication.User.imageUrl"
              alt="profil utilisateur "
            />
          </router-link>
          <router-link
            class="user-name"
            :to="{
              name: 'UserProfile',
              params: { userId: publication.userId },
            }"
          >
            <span
              >{{ publication.User.firstname }}
              {{ publication.User.lastname }}</span
            >
          </router-link>
          <button @click="editMenu = true">
            <img
              class="modif-icon"
              src="../assets/points.png"
              alt="bouton modification publication"
            />
          </button>
          <div v-show="editMenu" class="editMenu">
            <button
              @click="deletePublication(publication.id, publication.userId)"
              class="delete-btn"
            >
              Supprimer la publication
            </button>
            <button
              @click="displayModificationModal(publication), (editModal = true)"
              class="edit-btn"
            >
              Modifier la publication
            </button>
          </div>
        </div>
        <div class="publication-content">
          <p class="publication-text">{{ publication.content }}</p>
        </div>
        <img
          class="timeline-picture"
          :src="publication.imageUrl"
          alt="image de la publication"
        />
        <div class="interactions-count">
          <div class="likes-count">
            <img
              v-if="liked"
              class="liked"
              src="../assets/like.png"
              aria-labelly="button"
              alt="bouton de like"
            />
            <img
              @click="
                addLike(publication.id),
                  getLikes(publication.id),
                  (liked = true)
              "
              v-if="(likes.length = 0 || liked == false)"
              class="like"
              src="../assets/likew.png"
              aria-labelly="button"
              alt="bouton de like"
            />
          </div>
          <div class="comments-count">
            <span
              class="comments-btn"
              @click="
                getAllcomments(publication.id),
                  (commentsContainer = publication.id)
              "
              >Commentaires</span
            >
          </div>
        </div>
        <div
          v-if="commentsContainer == publication.id"
          class="comments-container"
        >
          <div
            class="comments-card"
            v-for="comment in comments"
            :key="comment.id"
          >
            <div class="user_pict-link">
              <router-link
                class="user-name"
                :to="{
                  name: 'UserProfile',
                  params: { userId: comment.User.id },
                }"
              >
                <img
                  class="user_profile-picture"
                  :src="comment.User.imageUrl"
                  alt="profil utilisateur "
                />
              </router-link>
            </div>
            <div class="comment">
              <router-link
                class="user-name"
                :to="{
                  name: 'UserProfile',
                  params: { userId: comment.User.id },
                }"
              >
                <span
                  >{{ comment.User.firstname }}
                  {{ comment.User.lastname }}</span
                >
              </router-link>
              <p v-if="modificationInput != comment.id" class="comment-content">
                {{ comment.content }}
              </p>
              <textarea
                v-if="modificationInput == comment.id"
                name="commentmofif"
                class="comment-content_modification"
                v-model="currentComment.content"
              ></textarea>
              <button
                v-show="modificationInput == comment.id"
                @click="updateComment(comment)"
              >
                Publier
              </button>
            </div>
            <div class="comment-action_box">
              <button @click="editCommentId = comment.id">
                <img
                  class="comment-modification_img"
                  src="../assets/points.png"
                  alt="menu modification commentaire"
                />
              </button>
              <div
                class="edit-comment_menu"
                v-show="editCommentId == comment.id"
              >
                <button
                  @click="
                    displayModificationComment(comment),
                      (modificationInput = comment.id),
                      (editCommentId = null)
                  "
                >
                  Modifier
                </button>
                <button @click="deleteComment(comment), (editCommentId = null)">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
          <div class="user_comment-container">
            <div class="user_pict-link">
              <img
                class="user_profile-picture"
                :src="userInfos.imageUrl"
                alt=""
              />
              <div class="sendbox-comment">
                <textarea
                  v-model="content"
                  type="text-content"
                  class="post-comment_container"
                  placeholder="Votre commentaire..."
                />
                <button @click="addComment(publication.id)" class="comment-btn">
                  <img
                    class="comment-send"
                    src="../assets/send.png"
                    alt="bouton d'envoi commentaire"
                    aria-label="button"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <teleport to="#modals">
      <div v-if="editModal" class="edit-modal">
        <div class="overlay"></div>
        <div class="userProfile">
          <div class="user_pict-link">
            <img
              class="user_profile-picture"
              :src="userInfos.imageUrl"
              alt="profil utilisateur "
            />
            <span>Modifier la publication</span>
          </div>
          <button @click="editModal = false" class="closemodalbtn">X</button>
          <form @submit.prevent="submitPublication" class="edit-form">
            <textarea
              class="text-content"
              v-model="currentPublication.content"
              type="text-area"
              placeholder="Que voulez vous dire?"
            />
            <div class="current-publication_picture" v-show="image == null">
              <img
                class="file-preview_image"
                :src="currentPublication.imageUrl"
                alt=""
              />
            </div>
            <div class="file-preview">
              <img
                class="file-preview_image"
                v-if="image"
                :src="image"
                alt=""
              />
            </div>
            <div class="action-container_btn">
              <button @click="onPickFile" class="upload-btn">
                Photo<img
                  class="upload-icon"
                  src="../assets/image-gallery.png"
                  alt="button upload image"
                />
              </button>
              <input
                class="file-upload_bnt"
                type="file"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              />
              <button
                @click="editPublication(currentPublication)"
                class="publish-btn"
              >
                Enregistrer<img
                  class="publish-icon"
                  src="../assets/send.png"
                  alt="bouton engistrer la publication"
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
  name: "Timeline",
  data() {
    return {
      editMenu: false,
      editModal: false,
      editCommentId: null,
      modificationInput: null,
      commentsContainer: null,
      liked: false,
      image: null,
      content: "",
      currentPublication: {},
      currentComment: {},
    };
  },
  components: {},
  mounted: function () {
    this.$store.dispatch("getPublications");
  },
  computed: {
    ...mapState({
      user: "user",
      userInfos: "userInfos",
      likes: "likes",
      publications: ["publications"],
      comments: ["comments"],
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
      console.log(this.files);
    },
    displayModificationModal(publication) {
      this.currentPublication = publication;
    },
    editPublication(currentPublication) {
      const formData = new FormData();
      const user = this.userInfos;
      formData.append("id", currentPublication.id);
      formData.append("userId", user.id);
      formData.append("content", currentPublication.content);
      formData.append("image", this.files);
      console.log(this.files);
      console.log(...formData);
      this.$store.dispatch("UpdatePublication", [
        formData,
        currentPublication.id,
      ]);
    },
    addLike(publicationId) {
      const user = this.userInfos;
      this.$store
        .dispatch("addLikes", {
          userId: user.id,
          publicationId: publicationId,
          like: 1,
        })
        //.then((response) => console.log(response));
    },
    getLikes(publicationId) {
      this.$store.dispatch("getLikesList", {
        publicationId: publicationId,
      });
    },
    addComment(id) {
      console.log(this.content);
      this.$store
        .dispatch("addComment", {
          id: id,
          userId: this.userInfos.id,
          content: this.content,
        })
        .then(
          function () {},
          function (error) {
            console.log(error);
          }
        );
    },
    getAllcomments(id) {
      this.$store.dispatch("getPublicationComments", {
        id: id,
      });
    },
    displayModificationComment(comment) {
      this.currentComment = comment;
      console.log(comment);
    },
    updateComment(comment) {
      this.$store.dispatch("updateComment", {
        id: comment.id,
        userId: comment.userId,
        publicationId: comment.publicationId,
        content: comment.content,
      });
      this.modificationInput = null;
    },
    deleteComment(comment) {
      const user = this.userInfos;
      console.log(comment);
      console.log(user);
      this.$store
        .dispatch("deleteComment", {
          userId: user.id,
          isAdmin: user.isAdmin,
          id: comment.id,
          commentUserId: comment.userId,
          publicationId: comment.publicationId,
        })
        .then(function (error) {
          console.log(error);
        });
    },
    deletePublication(id, userId) {
      const user = this.userInfos;
      this.$store
        .dispatch("deletePublication", {
          id: id,
          publicationUserId: userId,
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
.timeline-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
}
.publication-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.publication-text {
  padding: 1.5rem;
  margin: 0;
}
.publication-card {
  position: relative;
  width: 50%;
  background: white;
  margin: 1rem 0;
  border-radius: 6px;
}
.profile-publication {
  position: relative;
  display: flex;
  align-items: center;
}
.modif-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 1rem;
}
.editMenu {
  position: absolute;
  align-items: flex-end;
  top: 1.5rem;
  right: 5px;
  width: 30%;
  text-align: center;
  border: 1px soli #d3d3d3;
  box-shadow: 5px 5px 5px #d3d3d3;
}
button {
  appearance: none;
  border: none;
  background: white;
  cursor: pointer;
}
.action-container_btn {
  display: flex;
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
}
a {
  text-decoration: none;
}
.edit-modal {
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
.text-content {
  width: 95%;
  border: none;
  resize: vertical;
}
.current-publication_picture {
  width: 95%;
  height: auto;
}
.file-preview {
  width: 95%;
  height: auto;
}
.file-preview_image {
  width: 100%;
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
.timeline-picture {
  width: 100%;
}
.interactions-count {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 3rem;
  border-top: 1px solid #d3d3d3;
  border-bottom: 1px solid #d3d3d3;
}
.comments-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: white;
}
.comments-card {
  display: flex;
  align-items: center;
  margin: 10px 0;
}
.comment {
  display: flex;
  flex-direction: column;
  width: fit-content;
  height: fit-content;
  max-width: 70%;
  background: #d3d3d3;
  border-radius: 8px;
}
.comment-content_modification{
  resize:none;
  background: #D3d3d3;
  font-family: poppins, sans-serif;
  ;
}
.comment-modification_img {
  width: 1rem;
  height: 7px;
  margin: 8px;
  padding: 8px;
  border-radius: 100%;
  background: #d3d3d3;
}
.edit-comment_menu {
  width: fit-content;
  height: fit-content;
  box-shadow: 10px 10px 10px #d3d3d3;
}
.comment-content {
  padding: 0 10px;
  margin: 0;
}
.post-comment_container {
  width: 35vw;
  height: 3.5vh;
  font-family: poppins, sans-serif;
  padding: 8px;
  font-size: 1rem;
  border-radius: 8px;
  background: #d3d3d3;
  text-indent: 1rem;
}
.sendbox-border {
  align-self: center;
  height: 2px;
  width: 80%;
  background: #d3d3d3;
}
.user_comment-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  background: white;
  margin: 0;
  border-radius: 6px;
}
.sendbox-comment {
  display: flex;
}
.comment-btn {
  right: 10px;
}
.comment-send {
  width: 2rem;
  height: 2rem;
}
.like,
.liked {
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}
.comments-btn {
  cursor: pointer;
}
.count-number {
  margin: 0 5px;
}
@media screen and (max-width: 970px) {
  .timeline-container {
    width: 100vw;
  }
  .publication-card {
    width: 90vw;
    border-radius: 10px;
    margin-right: 5px;
  }
  .profile-publication {
    display: block;
  }
  .interactions-count {
    border-bottom: none;
    padding-bottom: 10px;
  }
  .post-comment_container {
    font-size: 0.8rem;
    width: 35vw;
    height: 10%;
  }
  .comment-send {
    margin-left: 15px ;
  }
}
</style>