<template>
    <div class="regiest">
        <i-form ref="formInline_register" :model="formInline" :label-width="80" :rules="ruleInline" style="width:360px;">
			<i-form-item prop="user" style="height:40px;" label='用户名'>
				<i-input type="text" size="large" style="width:100%;" v-model="formInline.user" placeholder="用户名">
                    <!-- <p slot="prepend"></p> -->
				</i-input>
			</i-form-item>
			<i-form-item prop="password" style="margin:30px 0 30px 0;" label='密码'>
				<i-input type="password" size="large" style="width:100%;" v-model="formInline.password" placeholder="密码">
				</i-input>
			</i-form-item>

            <i-form-item prop="phone" style="margin:30px 0 30px 0;" label='电话'>
				<i-input type="text" size="large" style="width:100%;" v-model="formInline.phone" placeholder="电话">
				</i-input>
			</i-form-item>

            <i-form-item prop="cname" style="margin:30px 0 30px 0;" label='中文名'>
				<i-input type="text" size="large" style="width:100%;" v-model="formInline.cname" placeholder="中文名">
				</i-input>
			</i-form-item>

             <i-form-item prop="email" style="margin:30px 0 30px 0;" label='邮箱'>
				<i-input type="text" size="large" style="width:100%;" v-model="formInline.email" placeholder="邮箱">
				</i-input>
			</i-form-item>

			<i-form-item prop="code" style="margin:30px 0 30px 0;" label='验证码'>
				<i-input type="text" size="large" v-model.trim="formInline.code" placeholder="邮箱验证码">
					<!-- <img slot="append" :src='verifyImg' @click="getCode" /> -->
                    <i-button slot="append" :type="isSend?'text':'primary'" :loading="codeLoading" :disabled='isSend?true:false' @click="getEmailCodes">{{isSendText}}</i-button>
				</i-input>
			</i-form-item>
            
			<i-button type="primary" size='large' :disabled='!(formInline.user && formInline.password && formInline.email && formInline.code && validCode)' :loading="loading" @click="handleSubmit('formInline_register')" style="width:360px;margin-bottom:20px;">注册</i-button>

		</i-form>
    </div>
</template>

<script>
import {getEmailCode,register,checkUser,checkEmailCode} from '@/assets/api'
import { error } from 'util';
import { setTimeout } from 'timers';
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

        const validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱验证码!'));
            } else {
                checkEmailCode({code:value}).then( (res) => {
                    if(res.data.valid){
                        this.validCode = true
                        callback()
                    }else{
                        this.validCode = false
                        callback(new Error('邮箱验证码不正确!'));
                    }
                },error => {
                    this.validCode = false
                    callback(new Error('验证失败!'));
                })
            }
        };

        return{
            validCode:false,
            loading:false,
            codeLoading:false,
            isSend:false,
            isSendText:'获取邮箱验证码',
            formInline: {
                user: '',
                password: '',
                phone:'',
                cname:'',
                email:'',
                code:''
            },
            ruleInline: Object.freeze({
                user: [
                    { required: true,validator:validateUser, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不少于6位数', trigger: 'blur' }
                ],
                email: [
                    { required: true,validator:validateEmail, trigger: 'blur' },
                ],
                phone: [
                    { validator:validatePhone, trigger: 'blur' },
                ],
                code: [
                    { required: true,validator: validateCode, trigger: 'blur' },
                ]
            })
        }
    },
    created(){
        
    },
    methods:{
        getEmailCodes(){
            if(!this.formInline.email){
                this.$Message.warning({
                    content:'请输入邮箱！',
                    top: 50,
                    duration: 5
                });
                return
            }
            
            this.codeLoading = true
            getEmailCode({email:this.formInline.email}).then( (res) => {
                if(res.status==200){
                    this.codeLoading = false
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
                    console.log(res)
                }
            },error =>{
                this.$Message.error({
                    content:'验证码获取失败,请重新获取！',
                    top: 50,
                    duration: 5
                });
                this.isSendText = '重新获取邮箱验证码'
                this.isSend = false
                this.codeLoading = false
            })
        },
        handleSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.loading = true
                    let params = {
                        username:this.formInline.user,
                        password:this.formInline.password,
                        email:this.formInline.email,
                        phone:this.formInline.phone,
                        cname:this.formInline.cname,
                        code:this.formInline.code
                    }
                    register(params).then( (res) => {
                        if(res.status===200){
                            if(res.data.errorCode=='10002'){
                                this.loading = false
                                return
                            }
                            this.loading = false
                            this.$router.push('/login')
                        }
                        
                    },error => {
                        this.loading = false
                    })
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
.regiest{
    position: absolute;
    top:48px;
    padding-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    height:calc(100% - 48px);
    overflow: auto;
}

.regiest::-webkit-scrollbar {
    width: 3px;
}
.regiest::-webkit-scrollbar-track {
    background-color: #ccc;
    // border-right: 1px solid #ccc;
}
.regiest::-webkit-scrollbar-thumb {
    background-color: #888;
}
// .regiest::-webkit-scrollbar-thumb:hover {
//     background-color: #aaa;
// }
// .regiest::-webkit-scrollbar-thumb:active{
//     background-color:#333;
// }
</style>


