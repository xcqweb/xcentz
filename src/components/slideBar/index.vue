<template>
    <div>

    
    <div class="collapseMenu slideBar" v-show="isCollapse">
        <div :name="item.id" v-for="(item,index) in menus" @mouseover="collapseMenu(item,index)" @click="goPage(item)" class="ivu-menu-submenu" style="height:49px;line-height:49px;color:#fff;background:#515a6e;cursor:pointer;">
            <Icon :type="item.icon" />
        </div>
        <!-- collapse -->
        <p class="collapse" @click="collapseHandler">
            <Icon type="ios-rewind" :style="{transform:isCollapse?'rotateZ(180deg)':''}" />
            <span class="txt">Collapse sidebar</span>
        </p>
    </div>


    <div class="slideBar" v-show='!isCollapse'>
        <Menu theme="dark" :active-name="activeName" @on-select='selectItem' ref="menu">
            <Submenu :name="item.id" v-for="item in menus" v-if="item.children">
                <template slot="title">
                    <Icon :type="item.icon" />
                    {{item.title}}
                </template>

                <MenuItem :name="`${child.route}`" v-for="child in item.children" v-if="item.children.length>0" :style="{background:$route.path===`/${child.route}`?'#2d8cf0 !important':'#363e4f !important'}" :class="$route.path===`/${child.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
                    {{child.title}}
                </MenuItem>
            </Submenu>

            <MenuItem :name='`${item.route}`' v-for="item in menus" v-if="!item.children" :class="$route.path===`/${item.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
            <Icon :type="item.icon" />
                {{item.title}}
            </MenuItem>

            
        </Menu>
        <!-- collapse -->
        <p class="collapse" @click="collapseHandler">
            <Icon type="ios-rewind" :style="{transform:isCollapse?'rotateZ(180deg)':''}" />
            <span class="txt">Collapse sidebar</span>
        </p>
    </div>
    </div>
</template>

<script>
import {queryMenu} from '@api'
import { setTimeout } from 'timers';
export default {
    data(){
        return{
            visible:false,
            isCollapse:false,
            currentIndex:'',
            activeName:'/home',
            openName:[],
            menus:[]
        }
    },
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
        queryMenu(){
            queryMenu().then( (res) => {
                console.log(res)
                this.menus = res.data.menuList[0].children
                this.activeName = this.$route.path
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
                font-size: 16px;
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


