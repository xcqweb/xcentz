<template>
  <div class="home">
    
    <div style="width:300px;height:300px;background:#f00;text-align:center;line-height:300px;color:#fff;font-size:36px;" v-if="auth.m1">
      M1
    </div>
    <div style="width:300px;height:300px;background:#ff0;text-align:center;line-height:300px;color:#fff;font-size:36px;" v-if="auth.m2">
      M2
    </div>
    <div style="width:300px;height:300px;background:#00f;text-align:center;line-height:300px;color:#fff;font-size:36px;" v-if="auth.m3">
      M3
    </div>
    <i-upload
        multiple
        :headers='headers'
        type="drag"
        action="/api/xcentz/v1/upload/uploadExcle">
        <div style="padding: 20px 0">
            <i-icon type="ios-cloud-upload" size="52" style="color: #3399ff"></i-icon>
            <p>点击或拖曳上传excle</p>
        </div>
    </i-upload>
    <i-button type="primary" @click="download">下载</i-button>

    <!-- socket.io -->
    <div></div>

  </div>
</template>

<script>

import AES from 'crypto-js/aes' 
import Utf8 from 'crypto-js/enc-utf8'
import {checkAuth,getCode,downloadExcle} from '@/assets/api'
export default {
  name: 'home',
  data(){
     return{
      headers:{
        Authorization: `Bearer__${localStorage.getItem('token')}`
      },
      auth:{},
      
    }
  },
 
  
  created(){
    checkAuth({userId:123}).then( (res) => {
      console.log(res.data.data)
      var bytes  = AES.decrypt(res.data.data, 'secret key 123');
      var originalText = bytes.toString(Utf8);

      console.log(JSON.parse(originalText)); // 'my message'
      this.auth = JSON.parse(originalText)
    })
  },
  methods:{
    

    download(){
      downloadExcle().then( (res) => {
        console.log(res)
        let file = res.data
        var downloadElement = document.createElement('a');
        var href = window.URL.createObjectURL(file);
        downloadElement.href = href;
        downloadElement.download = 'report_01.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href); 
      })
    }
  }
}
</script>
