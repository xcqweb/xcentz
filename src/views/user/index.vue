<template>
    <div class="user" id="particles-js">
        <p class="title"><span></span>centz后台运营管理系统</p>
        <div class="userCon" :style="{height:$route.path==='/login'?'400px':'500px'}">
            <ul class="userTab">
                <li @click="$router.push('/login')" :class="{active:$route.path==='/login'}">登录</li>
                <li @click="$router.push('/regiest')" :class="{active:$route.path==='/regiest'}">注册</li>
            </ul>
            <keep-alive>
               <router-view></router-view> 
            </keep-alive>
        </div>
    </div>
</template>

<script>
    import '../../../static/particles'
    import data from '../../../static/particles/particles.json'
export default {
    data(){
        return{
            tab:true
        }
    },
    methods:{
        tabHander(flag){
            this.tab = flag
            // flag?this.$router.push('/login'):
        }
    },
    mounted(){
        this.$nextTick( () => {
            particlesJS.load('particles-js', function() {})
        })
    }
}
</script>

<style lang="less" scoped>
    .user{
        width: 100vw;
		height: 100vh;
		position: fixed;
        background-color: #5cadff;
        .title{
            color: #fff;
            font-size: 30px;
            position: absolute;
            letter-spacing: 2px;
            text-shadow: 4px 4px 2px #444;
            width: 100%;
            margin-top: calc(26vh - 45px);
            &>span{
                padding: 10px 30px;
                background: url('../../assets/images/logo.png') no-repeat;
                background-size:cover; 
            }
        }
        .userCon{
            min-width: 400px;
            max-width: 660px;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: 30vh auto;
            position: absolute;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            .userTab{
                width: 100%;
                position: absolute;
                top: 0;
                display:flex;
                background: #fff;
                font-size: 16px;
                box-shadow: 2px 2px 12px #ccc;
                cursor: pointer;
                &>li{
                    flex:1;
                    line-height: 48px;
                    text-align: center;
                }
                .active{
                    position: relative;
                    &::after{
                        position: absolute;
                        bottom:0;
                        right:0;
                        left:0;
                        border: 1px solid #2b85e4;
                        content: '';
                    }
                }
            }
        }
    }
</style>


