<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  watch:{
      '$route'(to){
        sessionStorage.setItem('currentRoute',to.path)//动态路由刷新时需保存当前页面的路径
      }
  },
}
</script>


<style lang='less'>
@import './assets/styles/iv_style.less';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body,#app{
  overflow: hidden;
  height: 100vh;
}
</style>

