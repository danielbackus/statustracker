Vue.component('register-form', {
  data: function() {
    return {
      invite: null,
      email: null,
      password: null,
      password2: null,
      warnings: [],
      errors: [],
      success: null
    };
  },
  template: `
  <div>
    <form @submit.prevent="register">
      <label for="email">Email Address</label>
      <input id="email" type="text" v-model="email" disabled="true"/>
      <label for="password">Enter password</label>
      <input id="password" type="password" v-model="password" />
      <label for="password">Enter password again</label>
      <input id="password2" type="password" v-model="password2" />
      <input id="invite" type="hidden" v-model="invite" />
      <button type="submit">
        <i class="fa fa-user-plus"></i> Register
      </button>
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
  </div>`,
  methods: {
    getUrlVars: function() {
      var vars = {};
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(
        m,
        key,
        value,
      ) {
        vars[key] = value;
      });
      return vars;
    },
    validatePassword: function(password) {
      var warn = [];
      var validators = [
        {
          valid: password.match(/[A-Z]/),
          message: 'Password should include at least one uppercase letter.',
        },
        {
          valid: password.match(/[a-z]/),
          message: 'Password should include at least one lowercase letter.',
        },
        {
          valid: password.match(/\d/),
          message: 'Password should include at least one digit',
        },
        {
          valid: password.match(/\W/),
          message: 'Password should include at least one special character',
        },
        {
          valid: password.length >= 8,
          message: 'Password should be at least eight characters.',
        },
      ];
      validators.forEach(function(rule) {
        if (!rule.valid) warn.push(rule.message);
      });
      return warn;
    },
    register: function() {
      var form = this;
      this.warnings = [];
      this.errors = [];
      if (!this.password) {
        this.warnings.push('Please enter a valid password.');
      } else if (this.password !== this.password2) {
        this.warnings.push('Passwords do not match.');
      }
      this.warnings = this.warnings.concat(
        this.validatePassword(this.password),
      );
      if (!this.warnings.length) {
        axios
          .post('/api/user', {
            invite: this.invite,
            password: this.password,
          })
          .then(function(response) {
            this.success = true;
            window.location.href = './admin.html';
          })
          .catch(function(error) {
            form.errors.push("An error occurred.");
          });
      }
    },
  },
  mounted: function() {
    var form = this;
    this.invite = this.getUrlVars().invite;
    if (!this.invite) window.location.href = './';
    else
      axios
        .get('/api/user/invite?invite=' + this.invite)
        .then(function(response) {
          form.email = response.data;
        })
        .catch(function(error) {
          window.location.href = './';
        });
  },
});
