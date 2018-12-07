Vue.component('nav-bar', {
  data: function() {
    return {
      userLinks: [
        {
          href: '/',
          icon: 'fa fa-search',
          name: 'Order Status',
        },
        {
          href: '/admin.html',
          icon: 'fa fa-sign-in',
          name: 'Admin Portal',
        },
      ],
      adminLinks: [
        {
          href: '/',
          icon: 'fa fa-search',
          name: 'Order Status',
        },
        {
          href: '/admin.html',
          icon: 'fa fa-upload',
          name: 'Upload Spreadsheet',
        },
        {
          href: '/invite.html',
          icon: 'fa fa-user-plus',
          name: 'Invite New Admin',
        },
      ],
    };
  },
  template: `
    <div>
      <ul v-if="!$store.getters.bearer">
      <li v-for="link of userLinks"  class="link">
      <a :href="link.href">
        <i :class="link.icon" v-if="link.icon"></i>
          {{link.name}}
      </a>
  </li>
      </ul>
      <ul v-if="$store.getters.bearer">
        <li v-for="link of adminLinks" class="link">
            <a :href="link.href">
            <i :class="link.icon" v-if="link.icon"></i>
                {{link.name}}
            </a>
        </li>
        <li  class="link"><a href="#" v-on:click="$store.commit('logout')">
          <i class="fa fa-sign-out"></i> Logout
        </a></li>
      </ul>
    </div>
  `,
});
