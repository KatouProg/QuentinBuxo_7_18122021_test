<!--MAIN section with the "wall" and all the posts from different users-->
<template>
  <div class="main-page">
    <TheHeader userName="$user.username"></TheHeader>
    <section class="content">
      <div class="the-wall">
        <form action="">
          <input
            type="text"
            :placeholder="'What\'s up' + ' ' + user.username"
            class="write-post"
            v-model="newPost"
            id="post"
            aria-label="post"
          />

          <label class="custom-button">
            <p>Add an Image</p>
            <input
              type="file"
              id="post-picture"
              name="postPicture"
              accept="image/png, image/jpeg"
              aria-label="post"
            />
            <i class="far fa-image"></i>
          </label>

          <br />
          <input
            type="submit"
            @click="postPost"
            class="btn-submit"
            value="Submit"
          />
        </form>
        <p class="error-message">{{ errorMessage }}</p>

        <div>
          <br /><br />

          <ul>
            <li
              v-for="post in posts.slice().reverse()"
              :key="post.content"
              class="post"
            >
              <div>
                <div class="author">
                  <div class="author-info">
                    <img
                      v-if="post.User.image"
                      :src="post.User.image"
                      alt="profile picture"
                      class="profile-pic"
                    />
                    <h3>
                      By
                      <span class="user-signature">{{
                        post.User.username
                      }}</span>
                    </h3>
                  </div>
                  <p class="date">{{ moment(post.createdAt).fromNow() }}</p>
                </div>
                <img v-if="post.image" :src="post.image" alt="" />
                <p>{{ post.content }}</p>

                <div class="icones">
                  <div class="comment">
                    <Comment :postId="post.id"></Comment>
                    <span class="comment-number">{{ post.comments }}</span>
                  </div>
                  <Like-button :postId="post.id"></Like-button>
                  <span class="like-number">{{ post.likes }}</span>
                </div>
                <div
                  v-if="
                    this.$store.state.user.userId === post.User.id ||
                    this.$store.state.user.isAdmin
                  "
                  class="personal-icone"
                >
                  <router-link
                    :to="{ name: 'Modification', params: { postId: post.id } }"
                    class="link button-pencil"
                  >
                    Edit
                    <i class="fas fa-pencil-alt"></i>
                  </router-link>
                  <Delete-button :postId="post.id"></Delete-button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import { mapState } from "vuex";
import moment from "moment";
import DeleteButton from "../components/DeleteButton.vue";
import LikeButton from "../components/LikeButton.vue";
import Comment from "../components/Comment.vue";

// import Suggestion from '../components/Suggestion.vue'

export default {
  components: {
    TheHeader: TheHeader,
    DeleteButton: DeleteButton,
    LikeButton: LikeButton,
    Comment: Comment,
    
    //   "Suggestion": Suggestion
  },
  mounted: async function () {
    this.getPosts();
    if (
      this.$store.state.user.userId === -1 ||
      this.$store.state.user.userId == undefined
    ) {
      this.$router.push("/");
      return;
    }
  },

  data() {
    return {
      posts: [],
      newPost: "",
      postId: 0,
      moment: moment,
      postLiked: this.$store.state.postsLikedByUser,
      alreadyLiked: [],
      isHidden: true,
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    getPosts: async function () {
      await fetch("http://localhost:8080/api/messages")
        .then((responsehttp) => {
          return responsehttp.json();
        })
        .then((data) => {
          this.posts = data.posts;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postPost: async function (event) {
      event.preventDefault();
      const imageFile = document.querySelector("input[type=file]").files[0];
      if (this.newPost != "" || imageFile) {
        const formData = new FormData();

        formData.append("content", this.newPost);
        formData.append("userId", this.$store.state.user.userId);
        formData.append("username", this.$store.state.user.username);
        if (imageFile) {
          formData.append("image", imageFile);
        }

        await fetch("http://localhost:8080/api/messages", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + this.$store.state.user.token,
          },
        });
      } else {
        this.errorMessage = "A post cannot be empty";
        setTimeout(() => {
          this.errorMessage = "";
        }, 3000);
      }

      this.newPost = "";
      this.getPosts();
    },

    getComments() {
      this.$Comment.getComments();
    },
  },
};
</script>

