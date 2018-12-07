Vue.component('admin-panel', {
  data: function () {
    return {
      errors: [],
      warnings: [],
      email: null,
      password: null,
      uploadWarnings: [],
      uploadErrors: [],
      uploadSuccess: null,
      invite: null,
    };
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
              <p><a href="./forgot.html">Forgot your password?</a></p>
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
          <p>You can use this form to upload XLSX data files containing the order statuses.</p>         
            <div class="warnings">              
              <ul>
                <li><i class="fa fa-exclamation-triangle"></i><strong> Please note!</strong></li>
                <li>There is currently a bug with reading machine-generated Excel files, so you will need to open the XLSX file in Excel and re-save it, before you can upload it here.</li>                
              </ul>
            </div>            
            <form id="uploadForm" @submit.prevent="upload">
                  <label for="uploadFile">Select Excel Data File</label>
                  <input type="file" id="uploadFile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                  <button type="submit"><i class="fa fa-upload"></i> Upload</button>
              </form>
              <div class="errors" v-if="uploadErrors.length">
                <ul>
                  <li v-for="error in uploadErrors"><i class="fa fa-exclamation-triangle"></i> {{ error }}</li>
                </ul>
              </div>      
            <div class="warnings" v-if="uploadWarnings.length">
              <ul>
                <li v-for="warning in uploadWarnings"><i class="fa fa-exclamation-triangle"></i> {{ warning }}</li>
              </ul>
            </div>
            <div class="success" v-if="uploadSuccess">
              <ul>  
                <li>Order status data loaded successfully.</li>      
              </ul>
            </div>            
          </div>                    
        </div>
      `,
  methods: {
    login: function () {
      var panel = this;
      this.errors = [];
      this.warnings = [];
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
          .then(function (response) {
            panel.$store.commit('login', response.data);
          })
          .catch(function (error) {
            panel.errors.push('An error occurred, please try again.');
            panel.$store.commit('logout');
          });
      }
    },
    upload: function () {
      var panel = this;
      this.uploadWarnings = [];
      this.uploadErrors = [];
      this.uploadSuccess = null;
      var uploadFile = document.getElementById('uploadFile');
      if (!uploadFile || !uploadFile.files || !uploadFile.files.length) {
        this.uploadErrors = ['Please select a XLSX file to load.'];
      } else {
        this.uploadWarnings.push(
          'Uploading and processing data file. Please be patient, this may take up to sixty seconds to process the data. This page will update to notify you when the process is complete.',
        );
        var data = new FormData();
        var file = uploadFile.files[0];
        data.append('file', file, file.name);
        axios
          .post('/api/order/upload', data, {
            headers: {
              Authorization: 'Bearer ' + this.$store.getters.bearer,
              'Content-Type': 'multipart/form-data; boundary=' + data._boundary,
            },
            timeout: 60000,
          })
          .then(function (response) {
            panel.uploadWarnings = [];
            panel.uploadErrors = [];
            panel.uploadSuccess = true;
          })
          .catch(function (error) {
            panel.uploadWarnings = [];
            uploadFile.value = null;
            data = null;
            file = null;
            if (error.toString().includes('401')) {
              panel.$store.commit('logout');
            } else if (error.toString().includes('502')) {
              panel.uploadErrors = ['An error occurred. Please try again.'];
            } else if (error.toString().includes('503')) {
              panel.uploadErrors = ['Data load is already ongoing.'];
            }
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  panel.uploadErrors = ['XLSX file failed to process. Please ensure it is in the correct format and try again.'];
                  break;
                case 503:
                  panel.uploadErrors = ['Data load is already ongoing.'];
                  break;
                default:
                  panel.uploadErrors = [error.response.message];
                  break;
              }
            } else if (error.request) {
              panel.uploadErrors = ['The server failed to respond.'];
            }
            if (panel.uploadErrors.length && !panel.uploadErrors[0])
              panel.uploadErrors = ['XLSX file failed to process. Please ensure it is in the correct format and try again.'];
          });
      }
    },
  },
});
