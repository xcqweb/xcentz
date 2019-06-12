<template>
    <div class="userManage">
        <div class="top_operate">
            <i-input search enter-button v-model="searchKey" size="large" @on-search='search' @on-enter='search' style="width:300px;margin-right:30px;" placeholder="用户名 邮箱号 姓名..." />
            <i-button size="large" icon="ios-add" type="primary" @click="addUserStatus=true">新增用户</i-button> 
        </div>
         
         <i-table :columns="columns" :data="userData" stripe border :loading='isLoading' size='large'></i-table>
         <i-page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin:20px 0;' />
        <!-- 添加用户 -->
         <i-modal
            v-model="addUserStatus"
            :styles="{top: '50px',marginBottom:'60px'}"
            title="添加用户">
            <div slot="footer">
                <i-button type="text" size="large" @click="addUserStatus = false">取消</i-button>
                <i-button type="primary" size="large" @click="addUserHandler" :loading='loading'>确定</i-button>
            </div>

            <i-form ref="form_adduser" :model="addUser" :label-width="100" :rules="ruleInline" style="display:flex;flex-direction:column;margin-right:30px;">
                <i-form-item prop="user" style="height:40px;" label='用户名'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.user" placeholder="请输入用户名">
                    </i-input>
                </i-form-item>
                <i-form-item prop="password" style="margin:6px 0 16px 0;" label='密码'>
                    <i-input type="password" size="large" style="width:100%;" v-model="addUser.password" placeholder="请输入密码">
                    </i-input>
                </i-form-item>

                <i-form-item prop="confirmPsw" style="margin:16px 0;" label='确认密码'>
                    <i-input type="password" size="large" style="width:100%;" v-model="addUser.confirmPsw" placeholder="请再次输入密码">
                    </i-input>
                </i-form-item>

                <i-form-item prop="phone" style="margin:16px 0;" label='电话'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.phone" placeholder="请输入电话">
                    </i-input>
                </i-form-item>

                <i-form-item prop="role" style="margin:16px 0;" label='角色'>
                    <i-select v-model="addUser.role" filterable>
                        <i-option v-for="item in roleList" :value="item.RoleId" :key="item.RoleName">{{ item.Directions }}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item prop="cname" style="margin:16px 0;" label='中文名'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.cname" placeholder="请输入中文名">
                    </i-input>
                </i-form-item>

                <i-form-item prop="email" style="margin:16px 0;" label='邮箱'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.email" placeholder="请输入邮箱">
                    </i-input>
                </i-form-item>

            </i-form>
        </i-modal>

        <!-- 分配角色 -->
         <i-modal
            v-model="assignRoleStatus"
            :title="assignRoleTitle">
            <div slot="footer">
                <i-button @click="assignRoleStatus = false">取消</i-button>
                <i-button type='primary' @click="assignRole" :loading='loading'>确定</i-button>
            </div>
            <i-select v-model="selectRole" filterable>
                <i-option v-for="item in roleList" :value="item.RoleId" :key="item.RoleName">{{ item.Directions }}</i-option>
            </i-select>
        </i-modal>

    </div>
</template>

<script>
import {checkUser,checkEmailCode,getUserList,assignRole,addUser,delUser,roleList,resetPassword} from '@api'
import Operate from './components/operate'
import Expand from './components/expand'
import Vue from 'vue'
Vue.component('Operate',Operate)
Vue.component('Expand',Expand)
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
                        callback(new Error('用户名或邮箱太受欢迎!'));
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
            loading:false,
            pageSize:10,
            totalCount:0,
            currentPage:1,
            searchKey:'',
            currentRow:{},
            selectRole:'',
            addUserStatus:false,
            assignRoleStatus:false,
            isLoading:false,
            assignRoleTitle:'',
            roleAssign:{
                roleName:'',
            },
            addUser:{
                user: '',
                password: '',
                confirmPsw:'',
                phone:'',
                role:21,
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
                role: [
                    { required: true,type: 'number', message: '请选择角色',trigger: 'blur' },
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
                        type:'expand',
                        width:80,
                        align:'center',
                        render: (h, params) => {
                            return h(Expand, {
                                props: {
                                    row: Object.freeze(params.row)
                                }
                            })
                        }
                    },
                    
                    {
                        title: '中文名',
                        key: 'Cname',
                        align:'center'
                    },
                   
                    {
                        title: '角色',
                        key: 'Directions',
                        align:'center',
                    },
                    {
                        title: '操作',
                        align:'center',
                        width:360,
                        render(h,{row}){
                            return h('div',{
                                style:{
                                    display:'flex'
                                }
                            },[h('i-button', {
                                    props: {
                                        type: 'primary',
                                        icon:'ios-refresh'
                                    },
                                    style: {
                                        marginRight: '16px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.operate(1,row)
                                        }
                                    }
                                }, '重置密码'),h('i-button', {
                                    props: {
                                        type: 'primary',
                                        icon:'ios-create-outline'
                                    },
                                    style: {
                                        marginRight: '16px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.operate(2,row)
                                        }
                                    }
                                }, '分配角色'),h('i-button', {
                                    props: {
                                        type: 'error',
                                        icon:'ios-trash-outline'
                                    },
                                    style: {
                                        marginRight: '16px'
                                    },
                                    on: {
                                        click: () => {
                                            _this.operate(3,row)
                                        }
                                    }
                                }, '删除')])
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
        //分页
        goPage(page){
            this.currentPage = page
            this.getUserList()
        },
        search:debounce(function(){
            this.getUserList()
        },600,{leading:true}),
        //获取角色列表
        getRoleHandler(){
            roleList().then( (res) =>{
                this.roleList = Object.freeze(res.data.roleList)
            })
        },
        //操作
        operate(index,row){
            switch(index){
                case 1://重置密码
                
                    this.$Modal.confirm({
                        title: '提示',
                        loading:true,
                        closable:true,
                        content: `<p style='letter-spacing:2px;line-height:26px;'>确定重置 <span style='color:#2d8cf0;'> ${row.Cname} </span> 用户的密码? <br /> <span style="color:#999;">重置密码后新密码将发至该用户的账户邮箱<span></p>`,
                        onOk: () => {
                            resetPassword({userId:row.UserId,email:row.Email}).then( () => {
                                this.$Modal.remove()
                            },error => {
                                this.$Modal.remove()
                            })
                        },
                    });
                break;

                case 2://角色分配
                    this.assignRoleTitle = `分配角色 - ${row.Cname} `
                    this.assignRoleStatus = true
                    this.selectRole = row.RoleId
                    this.currentRow = Object.freeze(row)

                break;

                case 3://删除用户
                    this.$Modal.confirm({
                        title: '提示',
                        loading:true,
                        closable:true,
                        content: `<p>确定要删除 <span style='color:#2d8cf0;'> ${row.Cname} </span> 用户?</p>`,
                        onOk: () => {
                            delUser({userId:row.UserId}).then( (res) => {
                                this.$Modal.remove()
                                this.userData.splice(row._index,1)
                            },error => {
                                this.$Modal.remove()
                            })
                        },
                    });
                break;

            }
        },
        //分配角色
        assignRole(){
            this.loading = true
            assignRole({roleId:this.selectRole,userId:this.currentRow.UserId}).then( (res) => {
                this.loading = false
                this.assignRoleStatus = false
                this.currentRow.RoleId = this.selectRole

                this.currentRow.Directions = this.roleList.find( (item) => {
                    return item.RoleId === this.selectRole
                }).Directions

                this.selectRole = ''
            },error => {
                this.loading = false
            })
        },
        //添加用户
        addUserHandler(){
            this.$refs['form_adduser'].validate((valid) => {
                if (valid) {
                    this.loading = true
                    let params = {
                        username:this.addUser.user,
                        password:this.addUser.password,
                        email:this.addUser.email,
                        phone:this.addUser.phone,
                        cname:this.addUser.cname,
                        role:this.addUser.role
                    }
                    addUser(params).then( (res) => {
                        this.loading = false
                        this.addUserStatus = false
                        this.$refs['form_adduser'].resetFields();
                        this.getUserList()
                    },error => {
                        this.loading = false
                    })
                }
            })
        },
        //获取用户列表
        getUserList(){
            this.isLoading = true
            getUserList({key:this.searchKey,currentPage:this.currentPage,pageSize:this.pageSize}).then( (res) => {
                if(res.status===200){
                    this.isLoading = false
                    this.userData = res.data.userList
                    this.totalCount = res.data.total
                }
            },error => {
                this.isLoading = false
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .userManage{
        position:relative;
    }
</style>


