import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/assets/styles/reset.less'
import '@/assets/styles/main.less'


import 'iview/dist/styles/iview.css';
import '@/assets/js/iview'
Vue.config.productionTip = false
window.addEventListener("unload", () => {
  alert(666)
})

Vue.mixin({
  data(){
    return{
      userInfo:Object.freeze(JSON.parse(localStorage.getItem('userInfo'))),
    }
  },
  methods:{
    isNull(obj){
        return Object.prototype.toString.call(obj) === '[object Null]'
    }
  }
})


new Vue({
  router,
  data:{
    eventBus:new Vue()
  },
  render: h => h(App)
}).$mount('#app')
