<template>
  <div>
    <div class="comment-div">
      <i class="far fa-comment-dots comment-icone" @click="getComments"></i>

      <div v-if="commentFromPost.length >= 1" class="comment-section">
        <h4>Comments</h4>
        <ul>
          <li
            v-for="comment in commentFromPost.slice().reverse()"
            :key="comment.content"
            class="comment"
          >
            <img
              v-if="comment.User.image"
              :src="comment.User.image"
              alt="profile picture"
              class="profile-pic"
            />
            <p>
              <span class="signature"> {{ comment.User.username }}:</span>
            </p>
            <p class="italique">{{ comment.content }}</p>
            <p class="createdAt">{{ moment(comment.createdAt).fromNow() }}</p>
            <i
              v-if="
                this.$store.state.user.userId == comment.User.id ||
                this.$store.state.user.isAdmin
              "
              class="far fa-times-circle"
              @click="deleteComment(comment.id)"
            ></i>
          </li>
        </ul>
      </div>
    </div>
    <form action="" class="type-comment">
      <input
        type="text"
        v-model="this.newComment"
        placeholder="Type your comment..."
        class="comment-input"
        aria-label="Comment"
        id="comment-input"
      />
      <input
        type="submit"
        @click="postComment"
        class="comment-button"
        value="Submit"
      />
      <p class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "Comment",
  props: {
    postId: Number,
  },
  data() {
    return {
      newComment: "",
      commentFromPost: [],
      moment: moment,
      errorMessage: "",
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    postComment: function (event) {
      //method to post a comment with the store
      event.preventDefault();
      if (this.newComment) {
        this.$store
          .dispatch("postComment", {
            content: this.newComment,
            userId: this.$store.state.user.userId,
            postId: this.postId,
          })
          .then(() => {
            this.newComment = "";
            this.getComments();
            this.getPosts();
          });
      } else {
        this.errorMessage = "A comment cannot be empty";
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      }
    },
    getComments: async function () {
      //method to get a comment with fetch
      await fetch(`http://localhost:8080/api/messages/${this.postId}/comment`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.commentFromPost = data.comments;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteComment: async function (commentId) {
      let data = {
        commentId: commentId,
        postId: this.postId,
      };
      return fetch(
        `http://localhost:8080/api/messages/${this.postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + this.$store.state.user.token,
          },
          body: JSON.stringify(data),
        }
      )
        .then((responsehttp) => {
          return responsehttp.json();
        })
        .then(() => {
          this.getPosts();
          this.getComments();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPosts() {
      this.$parent.getPosts();
    },
  },
};
</script>

<style lang="scss" scoped>
$color-primary: #3bb78f;
$color-secondary: #3bb78f;
.comment-section {
  width: 700px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 1rem;
  padding-top: 0.3rem;
  border: 1px solid rgba(128, 128, 128, 0.281);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05), 2px 2px 5px rgba(0, 0, 0, 0.1);
  animation: slow-display 300ms ease-out;
  @media screen and (max-width: 800px) {
    width: 500px;
  }
  @media screen and (max-width: 600px) {
    width: 400px;
  }
  @media screen and (max-width: 500px) {
    width: 290px;
  }

  h4 {
    padding-top: 0;
    margin-top: 0;
  }
}
.comment-icone {
  position: absolute;
  top: 18px;
  left: 300px;
  font-size: 150%;
  cursor: pointer;
}

.comment {
  width: 650px;
  height: fit-content;
  display: flex;
  margin: 0rem 0 0.6rem -2rem;
  border-radius: 20px;
  @media screen and (max-width: 800px) {
    width: 480px;
  }
  @media screen and (max-width: 600px) {
    width: 380px;
  }
  @media screen and (max-width: 500px) {
    width: 280px;
  }

  .fa-times-circle {
    font-size: 140%;
    float: right;
    padding-top: 1.2rem;
    padding-right: 1rem;
    color: red;
    cursor: pointer;
  }
  .signature {
    color: $color-primary;
  }
  .createdAt {
    font-size: 70%;
    padding: 0.6rem 1.5rem;
  }

  .italique {
    font-style: italic;
    font-weight: lighter;
    padding: 0.2rem 0.7rem;
    color: black;
    font-size: 90%;
  }
  .profile-pic {
    width: 50px;
    height: 50px;
    object-fit: cover;
    padding: 0 0.2rem 0 0;
    border-radius: 60px;
  }
  .type-comment {
    padding-top: 2rem;

    .comment-button {
      background: $color-primary;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      height: 1.8rem;
      cursor: pointer;
    }
    .comment-input {
      width: 300px;
      height: 1.5rem;
    }
    .error-message {
      color: red;
    }
  }

  @keyframes slow-display {
    0% {
      transform: translateY(60px);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
@media screen and (max-width: 800px) {
  .comment-icone {
    left: 185px;
  }
}

@media screen and (max-width: 600px) {
  #comment-input {
    width: fit-content;
  }
  .comment-icone {
    left: 135px;
  }
}
@media screen and (max-width: 500px) {
  .comment-icone {
    left: 115px;
  }
}
</style>
