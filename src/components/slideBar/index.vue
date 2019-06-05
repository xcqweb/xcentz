<template>
    <div>
        <div class="collapseMenu slideBar" v-show="isCollapse" @mouseleave="$emit('collapse',isCollapse)">
            <div :name="item.id" v-for="(item,index) in menus" :key="item.id" @mouseover="collapseMenu(item,index)" @click="goPage(item)" class="ivu-menu-submenu" style="height:49px;line-height:49px;color:#fff;background:#515a6e;cursor:pointer;">
                <i-icon :type="item.icon" />
            </div>
            <!-- collapse -->
            <p class="collapse" @click="collapseHandler">
                <i-icon type="ios-rewind" :style="{transform:isCollapse?'rotateZ(180deg)':''}" />
                <span class="txt">Collapse</span>
            </p>
        </div>


        <div class="slideBar" v-show='!isCollapse'>
            <p class="logo">
                <span>xcentz</span>
                <span>后台运营管理系统</span>
            </p>
            <Menu-tree :menus='menus' @onSelected='selectItem' ref="menu" />
            <span style="color:#ccc;cursor:pointer;position:relative;top:100px;font-size:12px;" v-if="err" @click="queryMenu">
               <i-icon type="ios-refresh" style="color:#ccc;font-size:20px;"  />
               重新加载
            </span>
            <!-- collapse -->
            <p class="collapse" @click="collapseHandler">
                <i-icon type="ios-rewind" :style="{transform:isCollapse?'rotateZ(180deg)':''}" />
                <span class="txt">Collapse</span>
            </p>
        </div>
    </div>
</template>

<script>
import {queryMenu} from '@api'
import MenuTree from './menuTree'
import {flatten} from '@/assets/js/until'
import authRoute from '@/router/modules/authRoute'
export default {
    data(){
        return{
            err:false,
            visible:false,
            isCollapse:false,
            currentIndex:'',
            openName:[],
            menus:[]
        }
    },
    components:{MenuTree},
    created(){
        this.queryMenu()
    },
    mounted(){
        this.$root.eventBus.$on('getMenu',() => {
            this.queryMenu()
        })
    },
    methods:{
        collapseMenu(item,index){
            this.$emit('collapseMenu',item,index)
        },
        goPage(item){
            if(!item.children){
                item.route.indexOf('/')>-1?this.$router.push(item.route):this.$router.push(`/${item.route}`)
            }
        },
        //设置动态路由 根据后台返回权限菜单设置
        fliterRoute(menus){
            let newRoute = []
            for(let menu of menus){
                let route = menu && menu.route && menu.route.indexOf('/')>-1?menu.route:`/${menu.route}`
                for(let routeKey of authRoute){
                    if(route === routeKey.children[0].path){
                        routeKey.children[0].meta.title = menu.title
                       newRoute.push(routeKey)
                    }
                }
            }
            return newRoute
        },
        queryMenu(){
            queryMenu({roleId:this.userInfo.RoleId}).then( (res) => {
                this.err = false
                let menuList = res.data.menuList
                this.menus = Object.freeze(menuList[0].children)
                //配置权限动态路由
                let filterAuthRoutes = this.fliterRoute(flatten(menuList))
                this.$router.matcher.addRoutes(filterAuthRoutes)
            },error => {
                this.err = true
            })
        },
        selectItem(name){
            if(name.indexOf('/')>-1){
                this.$router.push(name)
            }else{
                this.$router.push(`/${name}`)
            }
        },
        collapseHandler(){
            let menuChilds = this.$refs.menu.$children
            this.isCollapse = !this.isCollapse
            for(let item of menuChilds){
                if(item.opened){
                    this.openName = item.name
                    item.opened = false
                }
            }
            
            if(!this.isCollapse){
                let collapseArr = menuChilds.find( (item) => {
                    return item.name == this.openName
                })
                
                if(collapseArr){
                    collapseArr.opened = true
                }
                   
            }
            this.$emit('collapse',this.isCollapse)
        }
    }
}
</script>

<style lang="less" scoped>
    .slideBar{
        min-height: 100vh;
        position: fixed;
        background-color: #515a6e;
        .logo{
            color:#fff;
            height: 83px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background-color: rgb(54, 62, 79);
            &>:nth-child(1){
                font-style: italic;
                font-size: 20px;
                margin-bottom: 10px;
            }
        }
        .collapse{
            width: 100%;
            position: absolute;
            bottom:0;
            left: 0;
            height: 36px;
            line-height: 36px;
            font-size: 20px;
            border-top: 1px solid #70798c;
            color: #fff;
            text-align: left;
            padding-left: 16px;
            background-color: #515a6e;
            cursor: pointer;
            user-select: none;
            .txt{
                margin-left: 10px;
                font-size: 14px;
            }
            &:hover{
                background-color: #70798c;
            }
        }
    }
    .collapseMenu{
            width:40px;
            height: calc(100vh - 36px);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2000;
            .collapse{
                padding-left: 0;
                text-align: center;
            }
        }
</style>


