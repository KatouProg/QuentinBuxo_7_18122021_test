<!--section where we can see all the other user profiles-->

<template>  
  <div class="team">
    <TheHeader userName="$user.username"></TheHeader>
    <h1>The Team</h1>

    <input
      type="text"
      v-model="search"
      class="search-bar"
      placeholder="Search by Username..."
      aria-label="searchbar"
    />
    <ul>
      <li v-for="user in filteredList" :key="user.username" class="user">
        <router-link :to="{ name: 'ProfileUser', params: { userId: user.id } }">
          <img v-if="user.image" :src="user.image" alt="" />
          <img
            v-else
            src="../assets/img/anonymous.png"
            alt=""
            class="profil-picture"
          />
          <h3 class="username">{{ user.username }}</h3>
          <p>{{ user.role }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import TheHeader from "../components/TheHeader.vue";
import { mapState } from "vuex";

export default {
  components: {
    TheHeader: TheHeader,
  },
  data() {
    return {
      users: [],
      search: "",
    };
  },

  computed: {
    ...mapState(["user"]),
    filteredList() {
      return this.users.filter((user) => {
        return user.username.toLowerCase().includes(this.search.toLowerCase());
      });
    },
  },
  mounted: async function () {
    this.getUsers();
    if (
      this.$store.state.user.userId === -1 ||
      this.$store.state.user.userId == undefined
    ) {
      this.$router.push("/");
      return;
    }
  },
  methods: {
    getUsers: async function () {
      return fetch("http://localhost:8080/api/me")
        .then((responsehttp) => {
          return responsehttp.json();
        })
        .then((data) => {
          this.users = data.users;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.team {
  a {
    text-decoration: none;
    color: black;
  }
  width: 100%;
  .search-bar {
    width: 400px;
    height: 2rem;
    border-radius: 10px;
    font-size: 110%;
  }
  h1 {
    padding-top: 7rem;
  }
  ul {
    padding-top: 3rem;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    @media screen and (max-width: 1600px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media screen and (max-width: 1200px) {
      grid-template-columns: 1fr 1fr;
    }
    @media screen and (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
  li {
    animation: arriving-from-left 500ms ease-out;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    list-style: none;
    display: flex;
    width: 250px;
    height: 260px;
    flex-direction: column;
    align-items: center;
    padding: 3rem;
    background-color: white;
    border-radius: 20px;
    margin: 1rem;

    .username {
      color: #29a17b;
      padding: 0 0 1rem 0;
    }
  }
  img {
    width: 160px;
    height: 160px;
    object-fit: cover;
  }
}

@keyframes arriving-from-left {
  0% {
    transform: translateX(-1000px);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@media screen and (max-width: 800px) {
  h1 {
    margin-top: 7rem;
  }
  ul {
    grid-template-columns: 1fr;
  }
}
</style>
