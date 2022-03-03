import { createStore } from 'vuex'
const axios = require('axios');


let instance = axios.create({
  baseURL: 'http://localhost:3000/api/',
});

let user = localStorage.getItem('user');
if (!user) {
 user = {
    userId: -1,
    token: '',
  }; 
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}


const store = createStore({
  state: {
    status: '',
    user: user,
    userInfos: {},
    userProfile:{},
    publications: [],
    comments:[],
    likes:[]
  },
  mutations: {
    SET_STATUS: function (state, status) {
      state.status = status;
    },
    LOG_USER: function (state, user) {
      instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
      console.log(user)
    },
    USER_INFOS: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    USER_PROFILE: function (state, userProfile) {
      state.userProfile = userProfile;
    },
    SET_USER: function (state, newInfos) {
      state.userInfos = newInfos;
    },
    LOG_OUT: function (state) {
      localStorage.removeItem('user');
      state.user = null;
    },
    PUBLICATIONS_LIST: function (state, publications) {
      state.publications = publications;
    },
    ADD_PUBLICATION: function (state, newPublication) {
      state.publications.unshift(newPublication); // unshift => ajoute un ou plusieurs éléments au début d'un tableau et renvoie la nouvelle longueur du tableau.
    },
    UPDATE_PUBLICATION: function (state, modifiedPublication) {
      const publicationIndex = state.publications.findIndex(
        p => p.id === modifiedPublication.id)
      state.publications[publicationIndex] = modifiedPublication
      state.publications = [...state.publications]
    },
    DELETE_PUBLICATION: function (state, publication) {
      if (state.userInfos.id === publication.userId || state.userInfos.isAdmin == true){
      const index = state.publications.findIndex(p => p.id 
        === publication.id );
      if (index !== -1) {
        state.publications.splice(index, 1);
      }
    }
    },
    COMMENTS_LIST: function (state, comments) {
      state.comments = comments;
    },
    ADD_COMMENT: function (state, newComment) {
      state.comments.push(newComment);
    },
    UPDATE_COMMENT: function (state, modifiedComment) {
      const commentIndex = state.comments.findIndex(
        p => p.id === modifiedComment.id)
      state.comments[commentIndex] = modifiedComment
    },
    DELETE_COMMENT: function (state, comment) {
      if (state.userInfos.id === comment.userId || state.userInfos.isAdmin == true){
      const index = state.comments.findIndex(c => c.id === comment.id);
      if (index !== -1) {
        state.comments.splice(index, 1);
      }
    }
    },
    ADD_LIKES: function(state, newlike) {
      console.log(newlike);
      state.likes.push(newlike);
    },
    GET_LIKES: function(state, likeList){
    state.likes = likeList;
    console.log(likeList)
    }
  },
  actions: {
    login: ({ commit }, userInfos) => {
      commit('SET_STATUS', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('users/login', userInfos)
          .then(function (response) {
            commit('SET_STATUS', '');
            if(response.data.token){
            localStorage.setItem('token', response.data.token);
            commit('LOG_USER', response.data);
            resolve(response);
          }
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_login');
            reject(error);
          });
      });
    },
    createAccount: ({ commit }, userInfos) => {
      return new Promise((resolve, reject) => {
        commit;
        instance.post('users/signup', userInfos)
          .then(function (response) {
            commit('SET_STATUS', 'created');
            resolve(response);
          })
          .catch(function (error) {
            commit('SET_STATUS', 'error_create');
            reject(error);
          });
      });
    },
    getUserInfos: ({ commit, state }) => {
      instance.get(`users/${state.user.userId}`)
        .then(function (response) {
          commit('USER_INFOS', response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getUserProfile: ({ commit },userProfile) => {
      instance.get(`users/${userProfile.userProfile}`)
        .then(function (response) {
          commit('USER_PROFILE', response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    editUser: ({ state, commit }, file) => {
      console.log(file);
      instance.put(`users/${state.user.userId}`, file,
      {'Content-Type' : 'application/form-data'})
        .then(response => {
          console.log(response.data)
          commit('SET_USER', file)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        });
    },
    editUserBio: ({ state, commit },bio) => {
      instance.put(`users/${state.user.userId}`, bio,
      {'Content-Type' : 'application/form-data'})
        .then(response => {
          console.log(response.data)
          commit('SET_USER', bio)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        });
    },
    editUserOverlay: ({ state, commit }, file) => {
      instance.put(`users/${state.user.userId}/overlay`, file,
      {'Content-Type' : 'application/form-data'})
        .then(response => {
          console.log(response.data)
          commit('SET_USER', file)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        });
      },
    deleteAccount({ commit }, account) {
      instance.delete(`users/${account.id}`)
        .then((response) => {
          console.log(response, account)
          commit('LOG_OUT', account)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        })
    },
    getPublications: ({ commit }) => {
       instance.get('publications/all')
        .then(function (response) {
          commit('PUBLICATIONS_LIST', response.data);
        })
        .catch(function (response) {
          console.log(response);
        });
    },
    addPublication({ commit }, file) {
      instance.post('publications/add', file,
      {'Content-Type' : 'application/form-data'})
        .then(function (response) {
          console.log(response.data)
          commit('ADD_PUBLICATION', response.data);
          window.location.reload(); //reload the page 
        })
        .catch(error => {
          console.log({ error: error });
          //console.log("==== publication impossible - store 229 ====");
        })
    },

    UpdatePublication({ commit }, data) {
      instance.put(`publications/${data[1]}`, data[0],
      {'Content-Type' : 'application/form-data'})
        .then(response => {
          console.log(response)
          commit('UPDATE_PUBLICATION', data[0])
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        })
    },
    deletePublication({ commit }, publication) {
      instance.delete(`publications/${publication.id}`, { data : publication})
        .then((response) => {
          console.log(response)
          commit('DELETE_PUBLICATION', publication);
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        })
    },
    getPublicationComments({ commit }, publication) {
      instance.get(`publications/${publication.id}/comments`)
        .then(function (response) {
          console.log(response)
          commit('COMMENTS_LIST', response.data)
        }).catch(error => {
          console.log({ error: error })
        })
    },
    addComment({ commit }, comment) {
      console.log(comment);
      instance.post(`publications/${comment.id}/comments`, comment)
        .then(function (response) {
          console.log(response)
          commit('ADD_COMMENT', response.data)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        })
    },
    updateComment({ commit }, comment) {
      instance.put(`publications/${comment.publicationId}/comments/${comment.id}`, comment)
        .then(response => {
          console.log(response)
          commit('UPDATE_COMMENT', comment)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        })
    },
    deleteComment({ commit }, comment) {
      instance.delete(`publications/${comment.publicationId}/comments/${comment.id}`, { data : comment})
        .then((response) => {
          console.log(response)
          commit('DELETE_COMMENT', comment)
          window.location.reload();
        })
        .catch(error => {
          console.log({ error: error })
        })
    },
    addLikes({ commit }, like) {
      instance.post(`publications/${like.publicationId}/like`, like,
      {'Content-Type' : 'application/form-data'})
      .then((response) => {
        console.log(like)
        commit('ADD_LIKES', response.data)
      })
      .catch(error => {
        console.log({ error: error}, "cannot add like !" )
      })
    },
    getLikesList({commit}, likes){
      instance.get(`publications/${likes.publicationId}/likes`)
      .then((response)=>{
      console.log(response)
      commit('GET_LIKES', likes)
      })
    }
  }
})
export default store;