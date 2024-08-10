import { defineStore } from 'pinia'

export const UserStore = defineStore("user", {
  state: () => {
    return {
      id: 0,
      user_name: '',
      is_admin: false,
      full_name: '',
      phone_no: '',
      token: ''
    }
  },
  actions: {
    clearUserInfo() {
      this.id = 0;
      this.user_name = '';
      this.is_admin = false;
      this.full_name = '';
      this.phone_no = '';
      this.token = '';

      document.cookie = "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  },
  getters: {}
});