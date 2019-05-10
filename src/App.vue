<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  watch:{
      '$route'(to){
        sessionStorage.setItem('currentRoute',to.path)
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
}
</style>

