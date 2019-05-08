<template>
    <div>
        <Breadcrumb>
            <BreadcrumbItem v-for="(item,index) in levelList" :key="item.path">
                <!-- <Icon type="ios-home-outline"></Icon> -->
                <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">
                    {{item.meta.title}}
                </span>
                <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
            </BreadcrumbItem>
        </Breadcrumb>
        <div class="userInfo">
            <Poptip placement='bottom-end' @on-popper-show='isDown=true' @on-popper-hide='isDown=false'>
                <span class="userInfo_name">{{userInfo.Cname}}</span>
                <span class="arrow">
                    <Icon type="md-arrow-dropup" v-show="!isDown"/>
                    <Icon type="md-arrow-dropdown" v-show="isDown"/>
                </span>
                
                <div slot="content">
                    <Dropdown @click.native='itemHandler'>
                        <DropdownItem data-index='1'>主页</DropdownItem>
                        <DropdownItem divided data-index='2'>个人中心</DropdownItem>
                        <DropdownItem divided data-index='3'>退出登录</DropdownItem>
                    </Dropdown>
                </div>
            </Poptip>
            <span class="fullScreen" title="全屏" @click="screenFullHandler">
                <Icon type="md-expand" />
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
        console.log(this.$route.matched.filter(item => item.meta && item.meta.title))
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
                    localStorage.clear()
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
    }
</style>


