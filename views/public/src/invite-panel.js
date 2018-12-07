Vue.component('invite-panel', {
  data: function() {
    return {
      errors: [],
      warnings: [],
      inviteErrors: [],
      inviteWarnings: [],
      email: null,
      password: null,
      invite: null,
      invite2: null,
      inviteSuccess: null,
    };
  },
  mounted: function(){
    if (!this.$store.getters.bearer) {
      window.location.href = './admin.html';
    }
  },
  template: `
        <div>
          <form id="loginForm" @submit.prevent="login" v-if="!$store.getters.bearer">        
            <div>
              <label for="email">Email</label>
              <input type="text" id="email" v-model="email" />
              <label for="password">Password</label>
              <input type="password" id="password" v-model="password" />
              <button type="submit"><i class="fa fa-login"></i> Login</button>
            </div>
          </form>
          <div class="errors" v-if="errors.length">
              <ul>
                <li v-for="error in errors"><i class="fa fa-exclamation-triangle"></i> {{ error }}</li>
              </ul>
            </div>      
          <div class="warnings" v-if="warnings.length">
            <ul>
              <li v-for="warning in warnings"><i class="fa fa-exclamation-triangle"></i> {{ warning }}</li>
            </ul>
          </div>                           
          <div id="upload" v-if="$store.getters.bearer">   
          <p>This form will enable you to invite a new administrator to create an account for the Status Tracker app.</p>
            <form id="inviteForm" @submit.prevent="sendInvite" v-if="!inviteSuccess">
              <label for="email">New Admin Email</label>
              <input type="text" v-model="invite" />
              <label for="email">Confirm New Admin Email</label>
              <input type="text" v-model="invite2" />
              <button type="submit"><i class="fa fa-envelope"></i> Invite</button>
            </form>
            <div class="warnings" v-if="inviteWarnings.length">              
              <ul v-for="warning in inviteWarnings">
                <li>{{warning}}</li>
              </ul>
            </div>
            <div class="errors" v-if="inviteErrors.length">              
              <ul v-for="error in inviteErrors">
                <li>{{error}}</li>
              </ul>
            </div>                        
            <div class="success" v-if="inviteSuccess">
              <ul>
                <li>Invite was successfully sent to {{inviteSuccess}}.</li>
              </ul>
            </div>
            
           
                   
          </div>                    
        </div>
      `,
  methods: {
    login: function() {
      var panel = this;
      this.errors = [];
      this.warnings = [];
      this.inviteSuccess = null;
      if (!this.email) {
        this.errors.push('Please enter a valid email address.');
      }
      if (!this.password) {
        this.errors.push('Please enter your password.');
      }
      if (this.email && this.password) {
        axios
          .post('/api/user/login', {
            email: this.email,
            password: this.password,
          })
          .then(function(response) {
            panel.$store.commit('login', response.data);
          })
          .catch(function(error) {
            console.log({ error });
            switch (error.response.status) {
              case 401:
                panel.errors.push('These credentials are invalid.');
                panel.$store.commit('logout');
                break;
              default:
                panel.errors.push(error.message);
                break;
            }
          });
      }
    },
    validEmail: function(email) {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
    },
    sendInvite: function() {
      var panel = this;
      this.inviteErrors = [];
      this.inviteWarnings = [];
      this.inviteSuccess = null;
      if (!this.validEmail(this.invite)) {
        this.inviteWarnings.push('Please enter a valid email address.');
      } else if (!this.invite2 || this.invite2 !== this.invite) {
        this.inviteWarnings.push('Please make sure both email fields match.');
      } else {        
        axios
          .post(
            '/api/user/invite',
            {
              email: this.invite,
              creator: this.$store.getters.id,
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.$store.getters.bearer,
              },
            },
          )
          .then(function(response) {
            console.log(response);
            panel.inviteSuccess = panel.invite;
            panel.invite = null;
            panel.invite2 = null;
          })
          .catch(function(error) {
            panel.inviteWarnings = [];
            if (error.toString().includes('401')) {
              panel.inviteErrors = ['Your credentials are no longer valid.'];
              panel.$store.commit('logout');
            }
            if (error.response) {
              switch (error.status) {
                case 401:
                  panel.inviteErrors = ['Your credentials are no longer valid.'];
                  panel.$store.commit('logout');
                  break;
                default:
                  panel.inviteErrors = ['Your request failed: please try again.'];
                  break;
              }
            } else if (error.request) {
              panel.inviteErrors = ['The server failed to respond.'];
            } else {
              panel.inviteErrors = ['An error occurred creating the request.'];
            }
          });
      }
    },
  },
});
