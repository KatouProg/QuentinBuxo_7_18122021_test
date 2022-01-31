<template>
  <div>
    <i @click="deletePost" class="fas fa-trash-alt"></i>
  </div>
</template>
<script>
export default {
  name: "DeleteButton",
  props: {
    postId: Number,
  },
  methods: {
    deletePost: async function () {
      let ok = confirm("Are you sure you want to delete this post?");

      if (ok) {
        return fetch(`http://localhost:8080/api/messages/${this.postId}`, {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + this.$store.state.user.token,
          },
        })
          .then((responsehttp) => {
            return responsehttp.json();
          })
          .then(() => {
            this.getPosts();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    getPosts() {
      this.$parent.getPosts();
    },
  },
};
</script>

<style lang="scss" scoped>
i {
  cursor: pointer;
  color: red;
  float: right;
  padding: 1rem;
}
</style>
