<template>
    <div style="height:41px;">
        <i-breadcrumb>
            <i-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                <!-- <Icon type="ios-home-outline"></Icon> -->
                <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">
                    {{item.meta.title}}
                </span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </i-breadcrumb-item>
        </i-breadcrumb>
        <div class="userInfo">
            <i-poptip trigger="hover" placement='top-end' width='360' style="margin:12px 48px 0 0">
                <i-badge :count='100'>
                    <i-icon type="ios-notifications-outline" size="26"></i-icon>
                </i-badge>
                <div slot="content" class="msg_content">
                    <div style="color:rgb(181, 186, 189);">
                        <i-icon type="ios-notifications-outline" size="50"></i-icon>
                        <p>暂无消息</p> 
                    </div>
                   
                </div>
            </i-poptip>
            
            <i-avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="margin-right:10px;"/>
            <i-poptip placement='bottom-end' trigger='hover' @on-popper-show='isDown=true' @on-popper-hide='isDown=false'>
                <span class="userInfo_name">{{userInfo.Cname}}</span>
                <span class="arrow">
                    <i-icon type="md-arrow-dropup" v-show="!isDown"/>
                    <i-icon type="md-arrow-dropdown" v-show="isDown"/>
                </span>
                
                <div slot="content">
                    <i-dropdown @click.native='itemHandler'>
                        <i-dropdown-item data-index='1'>主页</i-dropdown-item>
                        <i-dropdown-item divided data-index='2'>个人中心</i-dropdown-item>
                        <i-dropdown-item divided data-index='3'>退出登录</i-dropdown-item>
                        <i-dropdown-item divided data-index='4'>消息</i-dropdown-item>
                    </i-dropdown>
                </div>
            </i-poptip>
            <span class="fullScreen" title="全屏" @click="screenFullHandler">
                <i-icon type="md-expand" />
            </span>
        </div>
    </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import screenfull from 'screenfull'
import {loginOut} from '@api'

export default {
    data(){
        return{
            isDown:false,
            levelList:[]
        }
    },
    watch:{
        '$route':{
            handler(){
                this.getBreadcrumb()
            },
            immediate:true
        }
    },
    created(){
        // console.log(this.$route.matched.filter(item => item.meta && item.meta.title))
    },
    methods:{
        loginOut(){
            loginOut().then( (res) => {
                if(res.data.isLogin){
                    this.$Message.success({
                        content:'退出成功！',
                        top: 50,
                        duration: 5
                    });
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    this.$router.replace('/login')
                }
            })
        },
        itemHandler(e){
            let index = e.target.dataset.index
            switch(index){
                case '1':
                this.$router.push('/home')
                break;

                case '2':
                this.$router.push('/usercenter')
                break;

                case '3':
                this.loginOut()
                break;

                case '4':
                break;
            }
        },
        //全屏
        screenFullHandler(){
            screenfull.toggle()
        },
        getBreadcrumb() {
            let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
            const first = matched[0]
            if (!this.isHome(first)) {
                matched = [{ path: '/home', meta: { title: 'home' }}].concat(matched)
            }
            this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
        },
        isHome(route) {
            const name = route && route.name
            if (!name) {
                return false
            }
            return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
        },
        pathCompile(path) {
            const { params } = this.$route
            var toPath = pathToRegexp.compile(path)
            return toPath(params)
        },
        handleLink(item) {
            const { redirect, path } = item
            if (redirect) {
                this.$router.push(redirect)
                return
            }
            this.$router.push(this.pathCompile(path))
        }
    }
}
</script>

<style lang="less" scoped>
    .userInfo{
        position: absolute;
        top:0;
        right:30px;
        display: flex;
        align-items: center;
        .userInfo_name{
            font-size: 14px;
            cursor: pointer;
            user-select: none;
        }
        .arrow{
            font-size: 20px;
        }
        .fullScreen{
            font-size: 24px;
            margin-left: 10px;
            cursor: pointer;
        }
        .msg_content{
            min-height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>


