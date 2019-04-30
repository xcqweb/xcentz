<template>
    <div style="width:100%;overflow:hidden;">
        <slide-bar @collapse='collapse' :style="{width:iscollapse?'40px':'',paddingRight:iscollapse?'50px':'',marginLeft:iscollapse?'-10px':''}" style="overflow:hidden;transition: width 1s;"/>
        <div class="home_left" :style="{marginLeft:iscollapse?'40px':'240px',width:iscollapse?'calc(100% - 40px)':'calc(100% - 240px)'}">
            <top-bar />
            <div class="home_view">
                <keep-alive>
                   <router-view></router-view> 
                </keep-alive>
            </div>
        </div>
        
    </div>
</template>

<script>
import SlideBar from '@/components/slideBar'
import TopBar from '@/components/topBar'
export default {
    data(){
        return{
            iscollapse:false
        }
    },
    components:{SlideBar,TopBar},
    methods:{
        collapse(flag){
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
            margin: 20px 0 20px 20px;
            height: calc(100vh - 123px);
            overflow: auto;
        }
    }
</style>


