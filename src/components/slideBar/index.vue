<template>
    <div class="slideBar">
        <Menu theme="dark" :active-name="$route.path" :open-names='openName' accordion @on-select='selectItem' ref="menu">
            <!-- <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-paper" />
                    内容管理
                </template>
                <MenuItem name="1-1">文章管理</MenuItem>
                <MenuItem name="1-2">评论管理</MenuItem>
                <MenuItem name="1-3">举报管理</MenuItem>
            </Submenu> -->
            <Submenu name="2">
                <template slot="title">
                    <Icon type="md-cog" />
                    系统设置
                </template>
                <MenuItem name="/home">
                    主页
                </MenuItem>
                <MenuItem name="/menuconfig">
                    动态菜单权限配置
                </MenuItem>
                <MenuItem name="/usermanage">
                    系统用户管理
                </MenuItem>
            </Submenu>
            
            
        </Menu>
        <!-- collapse -->
        <p class="collapse" @click="collapseHandler">
            <Icon type="ios-rewind" :style="{transform:isCollapse?'rotateZ(180deg)':''}" />
            <span class="txt">Collapse sidebar</span>
        </p>
    </div>
</template>

<script>
export default {
    data(){
        return{
            isCollapse:false,
            openName:['2']
        }
    },
    methods:{
        selectItem(name){
            this.$router.push(name)
            console.log(name)
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
</style>


