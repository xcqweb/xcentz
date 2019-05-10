<template>
  <div class="errPage-container">
    <Button type='primary' style="float:left;" @click="back">
      <Icon type="md-arrow-back" /> 返回
    </Button>
    <div>
      <div :span="12">
        <h1 class="text-jumbo">
          出错啦!
        </h1>
        <h1 style="margin:10px 0;">你没有权限去该页面</h1>
        <h6>如有不满请联系你领导</h6>
        <ul class="list-unstyled">
          <li style="margin:10px 0;">或者你可以去:</li>
          <li class="link-type">
            <Button type='primary'>
              回首页
            </Button>
          </li>
          
          <Button style="margin:20px 0;"><a href="javascript:;" @click.prevent="dialogVisible=true">点我看图</a></Button>
        </ul>
      </div>
      <div :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </div>
    </div>
    <Modal v-model="dialogVisible" width='1000' footer-hide>
      <img :src="ewizardClap" class="pan-img">
    </Modal>
  </div>
</template>

<script>
import errGif from '@/assets/images/401.gif'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
        this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
  .errPage-container {
    width: 800px;
    max-width: 100%;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
      text-align: center;
      border: none !important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      margin: 20px 0;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
