Vue.component('reset-form', {
  data: function() {
    return {
      reset: null,
      id: null,
      email: null,
      password: null,
      password2: null,
      warnings: [],
      errors: [],
      success: null,
    };
  },
  template: `
  <div>
    <form @submit.prevent="changePassword" v-if="!success">
      <label for="email">Email</label>
      <input id="email" type="text" disabled="true" v-model="email" />
      <label for="password">New password</label>
      <input id="password" type="password" v-model="password" />
      <label for="password2">Re-enter new password</label>
      <input id="password2" type="password" v-model="password2" />
      <button type="submit">Submit</button>
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
    <div class="success" v-if="success">
        <ul>
            <li>
                The password for {{success}} has been reset.
            </li>
        </ul>
    </div>
  </div>`,
  methods: {
    changePassword: function() {
      var form = this;
      form.warnings = [];
      form.errors = [];
      success = null;
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
          .post('/api/user/reset', {
            id: this.userId,
            reset: this.reset,
            password: this.password,
          })
          .then(function(response) { 
            console.log({response});           
            form.success = form.email;
          })
          .catch(function(error) { 
            console.log({error});           
            form.errors.push('An error occurred, please try again.');
          });
      }
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
  },
  mounted: function() {
    var form = this;
    this.reset = this.getUrlVars().reset;
    if (!this.reset) window.location.href = './';
    else
      axios
        .get('/api/user/reset?reset=' + this.reset)
        .then(function(response) {
          form.email = response.data.email;
          form.id = response.data.id;
        })
        .catch(function(error) {
          window.location.href = './';
        });
  },
});
