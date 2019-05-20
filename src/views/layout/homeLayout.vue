<template>
    <div style="width:100%;overflow:hidden;">
        <slide-bar @collapseMenu='collapseMenu' @collapse='collapse' :style="{width:iscollapse?'40px':'',paddingRight:iscollapse?'50px':'',marginLeft:iscollapse?'-10px':''}" style="overflow:hidden;transition: width 1s;"/>
        <div class="home_left" :style="{marginLeft:iscollapse?'40px':'240px',width:iscollapse?'calc(100% - 40px)':'calc(100% - 240px)'}">
            <top-bar />
            <div class="home_view">
                <keep-alive>
                   <router-view></router-view> 
                </keep-alive>
            </div>
        </div>

        <div style="position:absolute;top:0;left:32px;" :style="{top:comPopTip}" v-show="hoverMenus.children" class="popTip">
            <Poptip trigger="hover" v-model="visible" placement="right-start">
                <div slot="content">
                     <Dropdown @on-click='goPage' ref="dropDown">
                        <DropdownItem v-for="item in hoverMenus.children" :name='item.route' class="collapse_item">{{item.title}}</DropdownItem>
                     </Dropdown>
                </div>
            </Poptip>
        </div>

        <div style="position:absolute;top:0;left:36px;" :style="{top:comToolTip}" v-show="!hoverMenus.children">
            <Tooltip trigger="hover" placement="right" ref="toolTip">
                <div slot='content'>
                    {{hoverMenus.title}}
                </div>
            </Tooltip>
        </div>
    </div>
</template>

<script>
import SlideBar from '@/components/slideBar'
import TopBar from '@/components/topBar'
export default {
    data(){
        return{
            visible:false,
            iscollapse:false,
            hoverIndex:0,
            hoverMenus:{}
        }
    },
    components:{SlideBar,TopBar},
    computed:{
        comPopTip(){
            return this.hoverIndex*48+'px'
        },
         comToolTip(){
            return this.hoverIndex*56+'px'
        },
    },
    methods:{
        goPage(item){
            item.indexOf('/')>-1?this.$router.push(item):this.$router.push(`/${item}`)
        },
        collapseMenu(item,index){
            this.visible = true
            this.$refs.toolTip.visible = true
            this.hoverIndex = index
            this.hoverMenus = item
        },
        collapse(flag){
            this.$refs.toolTip.visible = false
            this.visible = false
            this.iscollapse = flag
        }
    }
}
</script>

<style lang="less" scoped>
    .home_left{
        transition: all 0.1s;
        overflow: hidden;
        .home_view{
            padding: 20px;
            height: calc(100vh - 83px);
            overflow: hidden auto;
        }
    }
    .popTip{
        .collapse_item{
            width: 139px;
            height: 42px;
            line-height: 42px;
            padding: 0;
            margin-top: 0;
            color: #fff;
            &:hover{
                background: #1b1d22;
            }
        }
        .ivu-poptip-body{
            padding: 0;
        }
    }
    
</style>


