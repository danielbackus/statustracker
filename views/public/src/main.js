addEventListener('DOMContentLoaded', init);

var vuexLocal = new VuexPersistence.VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

var store = new Vuex.Store({
  state: {
    id: null,
    bearer: null,
  },
  mutations: {
    login(state, user) {
      state.bearer = user.bearer;
      state.id = user.id;
    },
    logout(state) {
      state.bearer = null;
      state.id = null;
    },
  },
  getters: {
    bearer: function(state) {
      return state.bearer;
    },
    id: function(state) {
      return state.id;
    }
  },
  plugins: [vuexLocal.plugin],
});

function init() {
  var app = new Vue({
    el: '#app',
    store: store,
  });
}
