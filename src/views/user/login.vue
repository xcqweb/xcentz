<template>
	<div class="con">
		<i-form ref="formInline" :model="formInline" :rules="ruleInline" style="width:360px;">
			<FormItem prop="user" style="height:40px;position:relative;">
				<Input type="text" size="large" style="width:100%;" v-model="formInline.user" @on-blur='tipUserStatus = false' @on-keyup="appendFix" placeholder="用户名或邮箱">
						<Icon type="ios-person-outline" slot="prepend"></Icon>
				</Input>
				<div class="ivu-select-dropdown" v-show="tipUserStatus" style="width: 100%; position: absolute; will-change: top, left; transform-origin: center top; top: 33px; left: 0px;" x-placement="bottom-start">
					<ul class="ivu-select-dropdown-list">
						<li class="ivu-select-item" style='text-align:left;' @click="chooseTipUser">{{tipUser}}</li>
					</ul> 
				</div>
			</FormItem>
			<FormItem prop="password" style="margin:36px 0 36px 0;">
				<Input :type="showPsw?'password':'text'" size="large" style="width:100%;" v-model="formInline.password" placeholder="密码">
					<Icon type="ios-lock-outline" slot="prepend"></Icon>
					<Icon type="md-eye" slot="append" style="cursor:pointer;" v-show="showPsw" @click="showPsw=false"/>
					<Icon type="md-eye-off" slot="append" style="cursor:pointer;" v-show="!showPsw" @click="showPsw=true"/>
				</Input>
			</FormItem>
			<FormItem prop="code" style="margin:36px 0 36px 0;">
				<Input type="text" size="large" style="width:100%;" v-model="formInline.code" placeholder="验证码">
					<img slot="append" :src='verifyImg' @click="getCode" width="80" height="20" style="cursor:pointer;"/>
				</Input>
			</FormItem>
			<p style="position:relative;height:30px;">
				<Checkbox v-model="memory" style="position:absolute;top:-10px;left:0;">记住密码</Checkbox>
			</p>
			<FormItem>
				<Button type="primary" size='large' :disabled='!(formInline.user && formInline.password && formInline.code && validCode)' :loading="loading" @click="handleSubmit('formInline')" style="width:360px;">登录</Button>
			</FormItem>

		</i-form>
	</div>
</template>

<script>

	import {login,getCode,checkCode} from '@/assets/api'
	export default{
		name:'login',
		data(){
			const validateCode = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入验证码!'));
				} else {
					checkCode({code:value}).then( (res) => {
						if(res.data.valid){
							this.validCode = true
							callback();
						}else{
							this.validCode = false
							callback(new Error('验证码不正确!'));
						}
					})
				}
			};
			return{
				tipUserStatus:false,
				tipUser:'',
				memory:false,
				validCode:false,
				showPsw:true,
				verifyImg:'',
				loading:false,
				formInline: {
					user: '',
					password: '',
					code:''
				},
				ruleInline: {
					user: [
						{ required: true, message: '请输入用户名', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ type: 'string', min: 6, message: '密码长度不少于6位数', trigger: 'blur' }
					],
					code: [
						{ validator: validateCode, trigger: 'blur' }
					]
				}
			}
		},
		watch:{
			'memory'(val){
				val?localStorage.setItem('loginUser',JSON.stringify({user:this.formInline.user,password:this.formInline.password})):localStorage.removeItem('loginUser')
			},
			'formInline':{
				handler(val){
					if(this.memory){
						localStorage.setItem('loginUser',JSON.stringify({user:this.formInline.user,password:this.formInline.password}))
					}
				},
				deep:true
			},
		},
		created(){
			if(this.isNull(localStorage.getItem('loginUser'))){
				this.memory = false
			}else{
				let user = JSON.parse(localStorage.getItem('loginUser'))
				this.formInline.user = user.user
				this.formInline.password = user.password
				this.memory = true
			}
		},
		deactivated(){
			removeEventListener('keyup',this.keyupLogin,false)
		},
		activated(){
			this.getCode()
			addEventListener('keyup',this.keyupLogin,false)
		},
		methods:{
			appendFix(){
				if(this.formInline.user){
					this.tipUserStatus = true
					if(this.formInline.user.indexOf('@') >= 0){
						let index = this.formInline.user.indexOf('@')
						let str = this.formInline.user.substr(0,index)
						this.tipUser = str+'@xcentz.com'
					}else{
						this.tipUser = this.formInline.user+'@xcentz.com'
					}
					
				}
			},
			chooseTipUser(){
				this.tipUserStatus = false
				this.formInline.user = this.tipUser
			},
			keyupLogin(e){
				if(e.keyCode==13){
					this.handleSubmit('formInline')
				}
			},
			//获取验证码
			getCode(){
				getCode().then( (res) => {
					let obj = res.data
					var a = new FileReader();
					a.readAsDataURL(obj);
					a.onload =  (e) => {
						this.verifyImg = e.target.result
					}; 
				})
			},
			handleSubmit(name) {
					this.$refs[name].validate((valid) => {
						if (valid) {
							this.loading = true
							login({username:this.formInline.user,password:this.formInline.password,code:this.formInline.code}).then( (res) => {
								if(res.status===200){
									this.loading = false
									this.userInfo = res.data.user
									localStorage.setItem('token',res.data.token)
									localStorage.setItem('userInfo',JSON.stringify(res.data.user))
									this.$router.push('/home')
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

<style scoped="scoped" lang="less">
		.con{
			position: absolute;
			top: 88px;
		}
		
	.el-input__inner{
		background-color: #000 !important;
	}
	
	.el-icon-view{
		color: #000;
	}
</style>