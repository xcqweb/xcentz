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
            title="添加用户">
            <div slot="footer">
                <Button type="text" size="large" @click="addUserStatus = false">取消</Button>
                <Button type="primary" size="large" @click="addUserHandler">确定</Button>
            </div>

            <i-form ref="form_adduser" :model="addUser" :label-width="80" :rules="ruleInline" style="width:360px;">
                <FormItem prop="user" style="height:40px;" label='用户名'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.user" placeholder="请输入用户名">
                        <!-- <p slot="prepend"></p> -->
                    </Input>
                </FormItem>
                <FormItem prop="password" style="margin:30px 0 30px 0;" label='密码'>
                    <Input type="password" size="large" style="width:100%;" v-model="addUser.password" placeholder="请输入密码">
                    </Input>
                </FormItem>

                <FormItem prop="confirmPsw" style="margin:30px 0 30px 0;" label='确认密码'>
                    <Input type="password" size="large" style="width:100%;" v-model="addUser.confirmPsw" placeholder="请再次输入密码">
                    </Input>
                </FormItem>

                <FormItem prop="phone" style="margin:30px 0 30px 0;" label='电话'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.phone" placeholder="请输入电话">
                    </Input>
                </FormItem>

                <FormItem prop="cname" style="margin:30px 0 30px 0;" label='中文名'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.cname" placeholder="请输入中文名">
                    </Input>
                </FormItem>

                <FormItem prop="email" style="margin:30px 0 30px 0;" label='邮箱'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.email" placeholder="请输入邮箱">
                    </Input>
                </FormItem>

               
            </i-form>
        </Modal>

        <!-- 分配角色 -->
         <Modal
            v-model="assignRoleStatus"
            title="分配角色"
            @on-ok="assignRole"
            @on-cancel="assignRoleStatus=false">
            <i-Select v-model="selectRole" filterable>
                <i-Option v-for="item in roleList" :value="item.RoleId" :key="item.RoleName">{{ item.Directions }}</i-Option>
            </i-Select>
        </Modal>
    </div>
</template>

<script>
import {checkUser,checkEmailCode,getUserList,assignRole,addUser,roleList} from '@api'
import Operate from './components/operate'
import Vue from 'vue'
Vue.component('Operate',Operate)
export default {
    data(){
        const validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱!'));
            } else {
                if(!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)){
                    callback(new Error('邮箱格式不正确!'));
                }
                checkUser({username:value}).then( (res) => {
                    console.log(res.data.user)
                    let user = res.data.user
                    if(user.length>0){
                        callback(new Error('邮箱已注册!'));
                    }else{
                        callback()
                    }
                })
            }
        };

         const validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号!'));
            } else {
                if(!/^1(3|4|5|7|8)\d{9}$/.test(value)){
                    callback(new Error('手机号格式不正确!'));
                }
                callback();
            }
        };

        const validateUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名或邮箱!'));
            } else {
                checkUser({username:value}).then( (res) => {
                    console.log(res.data.user)
                    let user = res.data.user
                    if(user.length>0){
                        callback(new Error('用户名或邮箱已注册!'));
                    }else{
                        callback()
                    }
                },error =>{
                    callback(new Error('校验失败!'));
                })
            }
        };

        const validatePassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码!'));
            } else {
                if(value.length<6){
                   callback(new Error('密码长度不少于6位数!'));
               }
               if(value!== this.addUser.password){
                   callback(new Error('两次输入密码不一致!'));
               }
               callback()
            }
        };
        let _this = this
        return{
            currentRow:'',
            selectRole:'',
            addUserStatus:false,
            assignRoleStatus:false,
            isLoading:false,
            roleAssign:{
                roleName:'',
            },
            addUser:{
                user: '',
                password: '',
                confirmPsw:'',
                phone:'',
                cname:'',
                email:'',
            },
            ruleInline: Object.freeze({
                user: [
                    { required: true,validator:validateUser, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    // { type: 'string', min: 6, message: '密码长度不少于6位数', trigger: 'blur' }
                ],
                confirmPsw: [
                    { required: true,validator:validatePassword, trigger: 'blur' },
                ],
                canme: [
                    { required: true, message: '请输中文名',trigger: 'blur' },
                ],
                email: [
                    { required: true,validator:validateEmail, trigger: 'blur' },
                ],
                phone: [
                    { required: true,validator:validatePhone, trigger: 'blur' },
                ],
            }),
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
                        key: 'Directions',
                        align:'center',
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
                        render(h,{row}){
                            return h('Operate',{
                                on:{
                                    operate:_this.operate
                                },
                                props:{
                                    row:row
                                }
                            })
                        }
                    }
                ]),
            userData:[],
            roleList:[]
        }
    },
    activated(){
        this.getRoleHandler()
        this.getUserList()
    },
    methods:{
        //获取角色列表
        getRoleHandler(){
            roleList().then( (res) =>{
                console.log(res)
                this.roleList = res.data.roleList
            })
        },
        //操作
        operate(index,row){
            switch(index){
                case '1'://重置密码
                break;

                case '2'://角色分配
                this.assignRoleStatus = true
                this.currentRow = Object.freeze(row)

                break;

                case '3'://删除用户
                break;

                case '4': //权限分配
                break;
            }
        },
        //分配角色
        assignRole(){
            console.log(this.selectRole)
            assignRole({roleId:this.selectRole,userId:this.currentRow.UserId}).then( (res) => {
                this.currentRow.RoleId = this.selectRole
                this.selectRole = ''

            })
        },
        //添加用户
        addUserHandler(){
            this.$refs['form_adduser'].validate((valid) => {
                if (valid) {
                    let params = {
                        username:this.addUser.user,
                        password:this.addUser.password,
                        email:this.addUser.email,
                        phone:this.addUser.phone,
                        cname:this.addUser.cname,
                    }
                    addUser(params).then( (res) => {
                        this.addUserStatus = false
                        this.getUserList()
                    })
                }
            })
        },
        //获取用户列表
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


