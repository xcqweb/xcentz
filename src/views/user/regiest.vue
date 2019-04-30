<template>
    <div class="regiest">
        <i-form ref="formInline_register" :model="formInline" :rules="ruleInline" style="width:360px;">
			<FormItem prop="user" style="height:40px;">
				<Input type="text" size="large" style="width:100%;" v-model="formInline.user" placeholder="用户名">
						<Icon type="ios-person-outline" slot="prepend"></Icon>
				</Input>
			</FormItem>
			<FormItem prop="password" style="margin:30px 0 30px 0;">
				<Input type="password" size="large" style="width:100%;" v-model="formInline.password" placeholder="密码">
					<Icon type="ios-lock-outline" slot="prepend"></Icon>
				</Input>
			</FormItem>

            <FormItem prop="phone" style="margin:30px 0 30px 0;">
				<Input type="text" size="large" style="width:100%;" v-model="formInline.phone" placeholder="电话">
                    <Icon type="md-tablet-portrait" slot="prepend" />
				</Input>
			</FormItem>

             <FormItem prop="email" style="margin:30px 0 30px 0;">
				<Input type="text" size="large" style="width:100%;" v-model="formInline.email" placeholder="邮箱">
                    <Icon type="ios-at-outline" slot="prepend"/>
				</Input>
			</FormItem>

			<FormItem prop="code" style="margin:30px 0 30px 0;">
				<Input type="text" size="large" v-model="formInline.code" placeholder="邮箱验证码">
					<!-- <img slot="append" :src='verifyImg' @click="getCode" /> -->
                    <Button slot="append" :type="isSend?'text':'primary'" :loading="codeLoading" :disabled='isSend?true:false' @click="getEmailCodes">{{isSendText}}</Button>
				</Input>
			</FormItem>
			<FormItem>
				<Button type="primary" size='large' :disabled='!(formInline.user && formInline.password && formInline.email && formInline.code)' :loading="loading" @click="handleSubmit('formInline_register')" style="width:360px;">注册</Button>
			</FormItem>

		</i-form>
    </div>
</template>

<script>
import {getEmailCode,register,checkUser} from '@/assets/api'
import { error } from 'util';
import { setTimeout } from 'timers';
export default {
    data(){
        const validateEmail = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入邮箱!'));
            } else {
                if(!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(this.formInline.email)){
                    callback(new Error('邮箱格式不正确!'));
                }
                callback();
            }
        };

         const validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号!'));
            } else {
                if(!/^1(3|4|5|7|8)\d{9}$/.test(this.formInline.phone)){
                    callback(new Error('手机号格式不正确!'));
                }
                callback();
            }
        };

        const validateUser = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名或邮箱!'));
            } else {
                checkUser({username:this.formInline.user}).then( (res) => {
                    console.log(res.data.user)
                    let user = res.data.user
                    if(user.length>0){
                        callback(new Error('用户名或邮箱已注册!'));
                    }else{
                        callback()
                    }
                })
            }
        };

        return{
            loading:false,
            codeLoading:false,
            isSend:false,
            isSendText:'获取邮箱验证码',
            formInline: {
                user: '',
                password: '',
                phone:'',
                email:'',
                code:''
            },
            ruleInline: Object.freeze({
                user: [
                    { validator:validateUser, trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不少于6位数', trigger: 'blur' }
                ],
                email: [
                    { validator:validateEmail, trigger: 'blur' },
                ],
                phone: [
                    { validator:validatePhone, trigger: 'blur' },
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
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
            // console.log(this.formInline.email)
            
            this.codeLoading = true
            getEmailCode({email:this.formInline.email}).then( (res) => {
                if(res.status==200){
                    this.codeLoading = false
                    this.$Message.success({
                        content:'验证码发送成功！',
                        top:50,
                        duration:5
                    })
                    this.isSend = true
                    let num = 0
                    let timer = setInterval( () =>{
                        this.isSendText = `${num++}s后重新获取`
                        if(num>=60){
                            clearInterval(timer)
                            this.isSendText = '获取邮箱验证码'
                            this.isSend = false
                        }
                    },1000)
                    console.log(res)
                }
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
                            code:this.formInline.code
                        }
                        register(params).then( (res) => {
                            if(res.status===200){
                                if(res.data.errorCode=='10002'){
                                    this.loading = false
                                    this.$Message.success({
                                        content:'验证码错误！',
                                        top: 50,
                                        duration: 5
                                    });
                                    return
                                }
                                this.loading = false
                                this.$Message.success({
                                    content:'注册成功！',
                                    top: 50,
                                    duration: 5
                                });
                            }
                            
                        },error => {
                            this.loading = false
                        })
                        
                            
                    } else {
                            this.$Message.error({
                                content:'注册失败！',
                                top: 50,
                                duration: 5
                            });
                    }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .regiest{
       position: absolute;
       top:88px;
    }
    // .ivu-btn-primary{
    //     color: #fff !important;
    //     background-color: #2d8cf0 !important;
    //     border-color: #2d8cf0 !important;
    // }
</style>


