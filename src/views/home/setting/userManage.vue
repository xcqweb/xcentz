<template>
    <div class="userManage">
        <div class="top_operate">
            <Input search enter-button="查询" size="large" style="width:300px;margin-right:30px;" placeholder="用户名 邮箱号 姓名..." />
            <Button size="large" icon="ios-add" type="primary" @click="addUserStatus=true">新增用户</Button> 
        </div>
         
         <Table :columns="columns" :data="userData" stripe border :loading='isLoading' size='large'></Table>
        <!-- 添加用户 -->
         <Modal
            v-model="addUserStatus"
            title="添加用户"
            @on-ok="addUser"
            @on-cancel="addUserStatus=false">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </Modal>
    </div>
</template>

<script>
import {getUserList} from '@api'
import Operate from './components/operate'
import Vue from 'vue'
Vue.component('Operate',Operate)
export default {
    data(){
        
        return{
            addUserStatus:false,
            isLoading:false,
            columns:Object.freeze([
                    {
                        title: '序号',
                        type:'index',
                        align:'center'
                    },
                    {
                        title: '邮箱号',
                        key: 'Email',
                        align:'center'
                    },
                    {
                        title: '手机号',
                        key: 'Phone',
                        align:'center'
                    },
                    {
                        title: '中文名',
                        key: 'Cname',
                        align:'center'
                    },
                    {
                        title: '英文名',
                        key: 'UserName',
                        align:'center'
                    },
                    {
                        title: '角色',
                        key: 'RoleId',
                        align:'center'
                    },
                    {
                        title: '最近登录时间',
                        key: 'LoatLoginTime',
                        align:'center'
                    },
                    {
                        title: '账号创建时间',
                        key: 'CreateTime',
                        align:'center'
                    },
                    {
                        title: '操作',
                        align:'center',
                        render(h){
                            return h('Operate')
                        }
                    }
                ]),
            userData:[]
        }
    },
    activated(){
        this.getUserList()
    },
    methods:{
        addUser(){

        },
        getUserList(){
            this.isLoading = true
            getUserList().then( (res) => {
                if(res.status===200){
                    this.isLoading = false
                    console.log(res)
                    this.userData = res.data.userLists
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.userManage{
    .top_operate{
        display: flex;
        margin-bottom: 20px;
    }
}
    
</style>


