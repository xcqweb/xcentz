<template>
    <Tabs>
        <TabPane label="个人信息" icon="ios-contact" style="display:flex;margin:30px 0 0 0;cursor:pointer;">
            <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="width:260px;height:300px;margin:0 36px;" @click.native='updateAvatar' />
            <i-form ref="form_adduser" :model="addUser" :label-width="80" :rules="ruleInline" style="width:360px;">
                <FormItem prop="user" style="height:40px;" label='用户名'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.user" disabled/>
                </FormItem>

                <FormItem prop="phone" style="margin:26px 0;" label='电话'>
                    <Input type="text" size="large" style="width:100%;" @on-blur="editUser" v-model="addUser.phone"/>
                </FormItem>

                <FormItem prop="role" style="margin:26px 0;" label='角色'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.role" disabled />
                </FormItem>

                <FormItem prop="cname" style="margin:26px 0;" label='中文名'>
                    <Input type="text" size="large" style="width:100%;" @on-blur="editUser" v-model="addUser.cname" />
                </FormItem>

                <FormItem prop="email" style="margin:26px 0;" label='邮箱'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.email" disabled placeholder="请输入邮箱" />
                </FormItem>              
            </i-form>
        </TabPane>
        <TabPane label="修改密码" icon="md-create">
            <i-form ref="form_adduser" :model="addUser" :label-width="80" :rules="ruleInline" style="width:360px;">
                <FormItem prop="old_password" style="margin:26px 0;" label='原密码'>
                    <Input type="password" size="large" style="width:100%;" v-model="addUser.old_password" placeholder="请输入原密码" />
                </FormItem>

                <FormItem prop="password" style="margin:26px 0;" label='新密码'>
                    <Input type="password" size="large" style="width:100%;" v-model="addUser.password" placeholder="请输入密码" />
                </FormItem>

                <FormItem prop="confirmPsw" style="margin:26px 0;" label='确认密码'>
                    <Input type="password" size="large" style="width:100%;" v-model="addUser.confirmPsw" placeholder="请再次输入密码" />
                </FormItem>

                <FormItem prop="email" style="margin:26px 0;" label='邮箱'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.email" disabled placeholder="请输入邮箱" />
                </FormItem> 

                <FormItem prop="code" style="margin:26px 0;" label='验证码'>
                    <Input type="text" size="large" style="width:100%;" v-model="addUser.code" placeholder="请输入邮箱验证码" >
                        <Button :disabled="isSend?true:false" slot="append" :loading='loading' :style="{backgroundColor:isSend?'#f7f7f7':'#2d8cf0',color:isSend?'#c5c8ce':'#fff'}" @click="getCode">{{isSendText}}</Button>
                    </Input>
                </FormItem>

            </i-form>
            <Button type="primary" @click="handlerSubmit('form_adduser')" style="float:left;margin-left:30px;width:330px;" :disabled='!(addUser.old_password && addUser.password && addUser.confirmPsw && addUser.code)'>确认</Button>
        </TabPane>
        <TabPane label="用户设置" icon="logo-tux">
            <ul style="margin-top:20px;">
                <li style="display:flex;align-items:center;width:100%;padding:20px 0;border-bottom:1px solid rgb(245, 238, 238);" v-for="i in 10">
                    <span style="flex:1;text-align:left;font-size:16px;">消息接收设置</span>
                    <i-Switch size="large" />
                </li>
            </ul>
        </TabPane>
        <TabPane label="系统消息" icon="md-alarm"></TabPane>
    </Tabs>
</template>

<script>
import { queryUser,editPassword,edituserInfo } from "@api/userCenter";
import { getEmailCode } from '@api'
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
                code:''
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
    },
    methods:{
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
            console.log(this.addUser)
            this.$refs[name].validate((valid) => {
                if (valid) {
                    editPassword({user:JSON.stringify(this.addUser),userId:this.userInfo.UserId}).then( (res) => {
                        let timer = setTimeout( () => {
                            clearTimeout(timer)
                            localStorage.removeItem('token')
                            this.$router.replace('/login')
                        },3000)
                    })
                }
            })
        },
        //更新信息
        editUser(){
            let params = {phone:this.addUser.phone,cname:this.addUser.cname,userId:this.userInfo.UserId}
            edituserInfo(params).then( (res) => {

            })
        },
        //更新头像
        updateAvatar(){
            alert('正在加紧开发中...`')
        }
    }
}
</script>

<style lang="less" scoped>
.usercenter_info{
    display: flex;
    margin-top: 30px;
}

</style>


