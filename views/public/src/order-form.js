var dummyResults = [
  {
    orderNumber: null,
    storeNumber: null,
    eta: null,
    timestamp: null
  },
];

Vue.component('order-form', {
  data: function() {
    return {
      orderNumber: null,
      storeNumber: null,
      errors: [],
      warnings: [],
      hasResults: false,
      results: dummyResults,
    };
  },
  template: `
      <div>
        <form id="orderForm" @submit.prevent="processForm" method="get">        
          <div>
            <label for="orderNumber">Purchase Order Number</label>
            <input type="text" id="orderNumber" v-model="orderNumber" />
            <label for="storeNumber">Store Number</label>
            <input type="text" id="storeNumber" v-model="storeNumber" />
            <button type="submit"><i class="fa fa-search"></i> Find</button>
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
        <div v-if="!errors.length && !warnings.length && hasResults">
          <hr/>
          <div class="success">Order with {{results.length}} line item<span v-if="results.length>1">s</span> found.</div>
          <table>
            <thead>
              <tr>
                <th>Last Updated</th>
                <th>Order Number</th>
                <th>Store Number</th>              
                <th>ETA</th>            
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in results">
                <td>{{Date(result.created).toLocaleString('en-US')}}</td>
                <td>{{result.orderNumber}}</td>
                <td>{{result.storeNumber}}</td>             
                <td>{{result.eta}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
  methods: {
    orderChange: function() {
      this.hasResults = false;
    },
    processForm: function() {
      var form = this;
      this.errors = [];
      this.warnings = [];
      this.results = dummyResults;
      this.hasResults = false;
      if (!this.orderNumber) {
        this.errors.push('Please enter a valid order number.');
      } else if (!this.storeNumber) {
        this.errors.push('Please enter a valid store number.');
      }
      else {
        axios
          .get(
            '/api/order?orderNumber=' +
              this.orderNumber +
              '&storeNumber=' +
              this.storeNumber,
            {
              timeout: 5000,
            },
          )
          .then(function(response) {
            if (!response) {
              form.errors.push('Request timed out.');
            } else {
              form.hasResults = true;
              if (!response.data.length) form.warnings = ['No results found.'];
              form.results = response.data;
            }
          })
          .catch(function(error) {
            if (error.response) {
              switch (error.response.status) {
                case 400:
                  form.errors.push(
                    'Order number or store number is not formatted correctly.',
                  );
                  break;
                case 503:
                  form.errors.push(
                    'Data load is ongoing, data is temporarily unavailable.',
                  );
                  break;
                default:
                  form.errors.push('An error occurred, please try again.');
                  break;
              }
            } else if (error.request) {
              form.errors.push('An error occurred, please try again.');
            } else {
              form.errors.push('An error occurred, please try again.');
            }
          });
      }
    },
  },
});
