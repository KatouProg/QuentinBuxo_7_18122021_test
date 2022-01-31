<template>
  <div>
    <i
      class="fas fa-heart red"
      @click="likePost()"
      v-if="Object.values(this.postLikedByUser).includes(postId)"
    ></i>
    <i v-else @click="likePost()" class="far fa-heart"></i>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "LikeButton",
  props: {
    postId: Number,
    Likes: Number,
  },

  data() {
    return {
      posts: this.$parent.posts,
      alreadyLiked: this.$parent.alreadyLiked,
      postLikedByUser: [],
    };
  },
  computed: {
    ...mapState(["user"]),
  },

  mounted: async function () {
    this.getLikesByUser();
  },
  methods: {
    likePost: async function () {
      this.$store
        .dispatch("likePost", {
          userId: this.$store.state.user.userId,
          postId: this.postId,
        })
        .then(() => {
          this.getLikesByUser();
          this.getPosts();
        });
    },

    getLikesByUser: async function () {
      this.postLikedByUser = [];

      await fetch(
        `http://localhost:5000/api/likes/${this.$store.state.user.userId}`
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data.data.forEach((element) => {
            this.postLikedByUser.push(element.postId);
          });
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

<style scoped>
.fas {
  animation: slow-appearance 600ms ease-out;
  position: absolute;
  font-size: 150%;
  top: 18px;
  right: 288px;
  cursor: pointer;
}
.far {
  font-weight: lighter;
  position: absolute;
  font-size: 150%;
  top: 18px;
  right: 288px;
  cursor: pointer;
}
.red {
  color: #3bb78f;
}

@media screen and (max-width: 800px) {
  .fa-heart {
    left: 300px;
  }
}
@media screen and (max-width: 800px) {
  .fa-heart {
    left: 305px;
  }
}

@media screen and (max-width: 600px) {
  .fa-heart {
    left: 230px;
  }
}
@media screen and (max-width: 500px) {
  .fa-heart {
    left: 180px;
  }
}

@keyframes slow-appearance {
  0% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
