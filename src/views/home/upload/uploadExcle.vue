<template>
    <div>
        <Upload-excel :on-success="handleSuccess" :before-upload="beforeUpload" ></Upload-excel>
      
        <i-table stripe :columns="tableHeader" :data="tableData" style="margin-top:20px;"></i-table>
    </div>
</template>

<script>
import UploadExcel from '@@/uploadExcle'
export default {
    data(){
        return{
            tableData:[],
            tableHeader:[]
        }
    },
    components:{
        UploadExcel
    },
    methods:{
        beforeUpload(file) {
            // const isLt1M = file.size / 1024 / 1024 < 1
            // if (isLt1M) {
                return true
            // }
            // this.$Message.warning({
            //     content: 'Please do not upload files larger than 1m in size.',
            // })
            // return false
        },
        handleSuccess({ results, header }) {
            this.tableData = Object.freeze(results)
            this.tableHeader = Object.freeze(header)
            console.log(results, header)
        },
    }  
}
</script>

<style lang="less" scoped>

</style>


