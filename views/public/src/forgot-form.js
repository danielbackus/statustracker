Vue.component('forgot-form', {
  data: function() {
    return {
      email: null,
      warnings: [],
      errors: [],
      success: null,
    };
  },
  template: `
  <div>
    <form @submit.prevent="forgot" v-if="!success">
        <label for="email">Email</label>
        <input id="email" type="text" v-model="email" />
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
                A password reset request has been sent to {{success}}.
            </li>
        </ul>
    </div>
  </div>
  `,
  methods: {
    validEmail: function(email) {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
    },
    forgot: function() {
      var form = this;
      form.warnings = [];
      form.errors = [];
      success = null;
      if (!form.validEmail(form.email))
        form.warnings.push('Please enter a valid email address.');
      else {
        axios
          .post('/api/user/forgot', {
            email: form.email,
          })
          .then(function(response) {
            form.success = form.email;
          })
          .catch(function(error) {
            if (error.response) {
              switch (error.status) {
                case 401:
                  form.errors.push('Your credentials are no longer valid.');
                  form.$store.commit('logout');
                  break;
                default:
                  form.errors.push("An error occurred.");
                  break;
              }
            } else if (error.request) {
              form.errors.push('The server failed to respond.');
            } else {
              form.errors.push('An error occurred creating the request.');
            }
          });
      }
    },
  },
});
