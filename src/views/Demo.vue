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
    <Upload
        multiple
        :headers='headers'
        type="drag"
        action="/api/xcentz/v1/upload/uploadExcle">
        <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>Click or drag files here to upload</p>
        </div>
    </Upload>
    <button @click="download">下载</button>

    <div>
      <Upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" ></Upload-excel>
      <Table :columns="tableHeader" :data="tableData"></Table>
    </div>
  </div>
</template>

<script>
import UploadExcel from '@@/uploadExcle'
import AES from 'crypto-js/aes' 
import Utf8 from 'crypto-js/enc-utf8'
import {checkAuth,getCode,downloadExcle} from '@/assets/api'
export default {
  name: 'home',
  data(){
     return{
      headers:{
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      auth:{},
      tableData:[],
      tableHeader:[]

    }
  },
  components:{
    UploadExcel
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
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$Message.warning({
        content: 'Please do not upload files larger than 1m in size.',
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      console.log(results, header)
    },

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
