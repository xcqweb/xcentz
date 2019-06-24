<template>
    <i-tabs class="usercenter_info" v-model="tab" @on-click='page'>
        <i-tab-pane label="个人信息" name='0' icon="ios-contact" style="display:flex;margin:30px 0 0 0;cursor:pointer;">
            <i-avatar :src="avatar" class="avatar" @click.native='updateAvatar' />
            <i-form ref="form_adduser" :model="addUser" :label-width="120" :rules="ruleInline" style="width:480px;">
                <i-form-item prop="user" style="height:40px;" label='用户名'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.user" disabled/>
                </i-form-item>

                <i-form-item prop="phone" style="margin:26px 0;" label='电话'>
                    <i-input type="text" size="large" style="width:100%;" @on-blur="editUser('phone')" v-model="addUser.phone"/>
                    <i-spin fix style="position:absolute;right:-36px;width:36px;height:36px;width:100%" v-show="phoneStatus">
                        <i-icon type="ios-loading" size=18 class="demo-spin-icon-load"></i-icon>
                    </i-spin>
                </i-form-item>

                <i-form-item prop="role" style="margin:26px 0;" label='角色'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.role" disabled />
                </i-form-item>

                <i-form-item prop="cname" style="margin:26px 0;" label='中文名'>
                    <i-input type="text" size="large" style="width:100%;" @on-blur="editUser('cname')" v-model="addUser.cname" />
                    <i-spin fix style="position:absolute;right:-36px;width:36px;height:36px;width:100%" v-show="cnameStatus">
                        <i-icon type="ios-loading" size=18 class="demo-spin-icon-load"></i-icon>
                    </i-spin>
                </i-form-item>

                <i-form-item prop="email" style="margin:26px 0;" label='邮箱'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.email" disabled placeholder="请输入邮箱" />
                </i-form-item>

                <i-form-item prop="role" style="margin:26px 0;" label='账号创建时间'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.CreateTime" disabled />
                </i-form-item>

                <i-form-item prop="role" style="margin:26px 0;" label='最近登录时间'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.LoatLoginTime" disabled />
                </i-form-item>              
            </i-form>
        </i-tab-pane>
        <i-tab-pane label="修改密码" name='1' icon="md-create">
            <i-form ref="form_adduser" :model="addUser" :label-width="120" :rules="ruleInline" style="width:480px;">
                <i-form-item prop="old_password" style="margin:26px 0;" label='原密码'>
                    <i-input type="password" size="large" style="width:100%;" v-model="addUser.old_password" placeholder="请输入原密码" />
                </i-form-item>

                <i-form-item prop="password" style="margin:26px 0;" label='新密码'>
                    <i-input type="password" size="large" style="width:100%;" v-model="addUser.password" placeholder="请输入密码" />
                </i-form-item>

                <i-form-item prop="confirmPsw" style="margin:26px 0;" label='确认密码'>
                    <i-input type="password" size="large" style="width:100%;" v-model="addUser.confirmPsw" placeholder="请再次输入密码" />
                </i-form-item>

                <i-form-item prop="email" style="margin:26px 0;" label='邮箱'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.email" disabled placeholder="请输入邮箱" />
                </i-form-item> 

                <i-form-item prop="code" style="margin:26px 0;" label='验证码'>
                    <i-input type="text" size="large" style="width:100%;" v-model="addUser.code" placeholder="请输入邮箱验证码" >
                        <i-button :disabled="isSend?true:false" slot="append" :loading='loading' :style="{backgroundColor:isSend?'#f7f7f7':'#2d8cf0',color:isSend?'#c5c8ce':'#fff'}" @click="getCode">{{isSendText}}</i-button>
                    </i-input>
                </i-form-item>

            </i-form>
            <i-button type="primary" @click="handlerSubmit('form_adduser')" style="float:left;margin-left:120px;width:360px;" :disabled='!(addUser.old_password && addUser.password && addUser.confirmPsw && addUser.code)'>确认</i-button>
        </i-tab-pane>
        <i-tab-pane label="用户设置" name='2' icon="logo-tux">
            <ul style="margin-top:20px;">
                <li style="display:flex;align-items:center;width:100%;padding:20px 0;border-bottom:1px solid rgb(245, 238, 238);">
                    <span style="flex:0.96;text-align:left;font-size:16px;">消息接收设置</span>
                    <i-switch size="large" style="transform:scale(1.5);" />
                </li>
            </ul>
        </i-tab-pane>
        <i-tab-pane label="系统消息" name='3' icon="md-alarm">
            <i-table stripe :columns="columnsMsg" :data="msgs"></i-table>
        </i-tab-pane>
    </i-tabs>
</template>

<script>
import { queryUser,editPassword,edituserInfo } from "@api/userCenter";
import { getEmailCode } from '@api'
import { queryMsg } from '@api/message'
import {Bus} from '@/assets/js/until'
export default {
    data(){
                
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
        
        return{
            tab:'0',
            msgs:[],
            columnsMsg: Object.freeze([
                {
                    title: '序号',
                    type:'index'
                },
                {
                    title: '消息内容',
                    key: 'Content'
                },
                {
                    title: '发送时间',
                    key: 'CreateTime'
                },
                {
                    title: '状态',
                    key: 'ReadStatus',
                    render: (h, {row:{ReadStatus}}) => {
                        if(ReadStatus===0){
                            return h('i-badge',{
                                props:{
                                    'dot':true
                                },
                                style:{
                                    marginTop:'6px'
                                }
                            }, [
                                h('span','未读')
                            ]);
                        }else{
                            return h('i-badge',{
                                style:{
                                    marginTop:'6px'
                                }
                            }, [
                                h('span','已读')
                            ]);
                        }
                        
                    }
                }
            ]),
            avatar:'https://i.loli.net/2017/08/21/599a521472424.jpg',
            phoneStatus:false,
            cnameStatus:false,
            loading:false,
            isSend:false,
            isSendText:'获取邮箱验证码',
            addUser:{
                user: '',
                old_password:'',
                password: '',
                confirmPsw:'',
                phone:'',
                role:21,
                cname:'',
                email:'',
                code:'',
                CreateTime:'',
                LoatLoginTime:''
            },
            ruleInline: Object.freeze({
                user: [
                    { required: true, trigger: 'blur' }
                ],
                old_password:[
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                confirmPsw: [
                    { required: true,validator:validatePassword, trigger: 'blur' },
                ],
                canme: [
                    { required: true, message: '请输中文名',trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请选输入验证码',trigger: 'blur' },
                ],
            }),
        }
    },
    activated(){
        
        this.queryUser()
        if(this.$route.query.tab){
            this.tab = this.$route.query.tab
            this.queryMsg()
        }
    },
    methods:{
        page(name){
            switch(name){
                case '0':
                break;

                case '1':
                break;

                case '2':
                break;

                case '3':
                this.queryMsg()
                break;
            }
        },
        queryMsg(){
            queryMsg({userId:this.userInfo.UserId,status:1}).then( (res) => {
                this.msgs = Object.freeze(res.data.msgs)
            })
        },
        //查询用户信息
        queryUser(){
            queryUser({userId:this.userInfo.UserId}).then( (res) => {
                this.addUser = {...this.addUser,...res.data.userInfo}
            })
        },
        //获取验证码
        getCode(){
            this.loading = true
            getEmailCode({email:this.addUser.email,type:'edit'}).then( (res) => {
                this.loading = false
                this.isSend = true
                let num = 60
                let timer = setInterval( () =>{
                    this.isSendText = `${num--}s后重新获取`
                    if(num<0){
                        clearInterval(timer)
                        this.isSendText = '获取邮箱验证码'
                        this.isSend = false
                    }
                },1000)
            },error => {
                this.$Message.error({
                    content:'验证码获取失败,请重新获取！',
                    top: 50,
                    duration: 5
                });
                this.isSendText = '重新获取邮箱验证码'
                this.loading = false
                this.isSend = false
            })
        },
        //修改密码
        handlerSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    editPassword({user:JSON.stringify(this.addUser),userId:this.userInfo.UserId}).then( (res) => {
                        let timer = setTimeout( () => {
                            clearTimeout(timer)
                            localStorage.clear()
                            this.$router.replace('/login')
                        },3000)
                    })
                }
            })
        },
        //更新信息
        editUser(type){
            if(!/^1(3|4|5|7|8)\d{9}$/.test(this.addUser.phone)){
                this.$Message.error({
                    content:'手机号格式不正确!'
                })
                return
            }
            this[`${type}Status`] = true
            let params = {phone:this.addUser.phone,cname:this.addUser.cname,userId:this.userInfo.UserId}
            edituserInfo(params).then( (res) => {
                this[`${type}Status`] = false
            },error => {
                this[`${type}Status`] = false
            })
        },
        //更新头像
        updateAvatar(){
            this.$imageCropper.upload().then(() => {
                Bus.$on('uploadImage',(src) => {
                    this.avatar = src
                    Bus.$off('uploadImage')
                })
            })
        }
    }
}
</script>

<style lang="less" scoped>
.usercenter_info{
    .avatar{
        width:260px;
        height:300px;
        margin:0 36px;
        box-shadow: 0 1px 6px rgba(0,0,0,.2);  
        &:hover>{
          box-shadow: 0 2px 12px rgba(0,0,0,.2);  
        }
    }
}

</style>


