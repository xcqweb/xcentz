<template>
    <i-menu ref="menu" theme="dark" accordion :open-names='openNames' :active-name='$route.path' @on-select="selectBack">
        <i-submenu :name="item.id" v-for="item in menus" v-if="item.children" :key="item.id">
            <template slot="title">
                <i-icon :type="item.icon" />
                {{item.title}}
            </template>

            <i-submenu :name="child.id" v-if="child.children" v-for="child in item.children" :key="child.id">
                <template slot="title">{{child.title}}</template>
                <i-menu-item :name='childItem.route' v-for="childItem in child.children" :key="childItem.id" :class="$route.path===`/${childItem.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
                    {{childItem.title}}
                </i-menu-item>
            </i-submenu> 

            <i-menu-item :name='child.route' v-for="child in item.children" :key="child.id" v-if="!child.children" :class="$route.path===`/${child.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
                {{child.title}}
            </i-menu-item> 
            
        </i-submenu>

        <i-menu-item :name='item.route' v-for="item in menus" :key="item.id" v-if="!item.children" :class="$route.path===`/${item.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
        <i-icon :type="item.icon" />
            {{item.title}}
        </i-menu-item>
    </i-menu>
</template>

<script>
export default {
    name:'MenuTree',
    data(){
        return{
            openNames:[]
        }
    },
    watch:{
        '$route'(val){ //动态响应展开菜单(点击tag菜单会自动展开收起)
            let _this = this
            let ids = []
            function findParent(menus,pId){ //查找上级节点id
                for(let item of menus){
                    if(item.id === pId){
                        ids.push(item.id)
                    }
                    if(item.children){
                        findParent(item.children,pId)
                    }
                }
                return ids
            }

            function loop(menus){//递归查找
               for(let item of menus){
                   if(item.route.indexOf('/')>-1?item.route:`/${item.route}` === val.path){
                        _this.openNames = findParent(_this.menus,item.parent_id)
                   }
                   
                    if(item.children){
                        loop(item.children)
                    }
                } 
            }
            loop(this.menus)

            this.$nextTick( () => {//手动跟新展开菜单
               this.$refs.menu.updateOpened() 
            })
            
        }
    },
    props:{
        menus:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    
    methods:{
        selectBack(data){
            this.$emit('onSelected',data)
        }
    }
}
</script>

<style lang="less" scoped>

</style>


