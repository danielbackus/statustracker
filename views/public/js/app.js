var app = new Vue({
  el: '#app',
  data: {
    order: {
      orderNumber: null,
      storeNumber: null,
      customerName: null,
      status: null,
      orderDate: null,
      shipDate: null,
      shippingCarrier: null,
      estimatedDeliveryDate: null,
    },
  },
  methods: {
    getOrder: function(e) {},
  },
});
