<template>
    <i-menu theme="dark" accordion :active-name='$route.path' @on-select="selectBack">
        <i-submenu :name="item.id" v-for="item in menus" v-if="item.children" :key="item.id">
            <template slot="title">
                <i-icon :type="item.icon" />
                {{item.title}}
            </template>

           
            <div v-for="child in item.children" :key="child.id">
                <i-menu-group :title="child.title" v-if="child.children && child.children.length">
                    <i-menu-item v-for="childItem in child.children" :key="childItem.id">{{childItem.title}}</i-menu-item>
                </i-menu-group>

                <i-menu-item v-else :name="`${child.route}`" :style="{background:$route.path===`/${child.route}`?'#2d8cf0 !important':'#363e4f !important'}" :class="$route.path===`/${child.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
                    {{child.title}}
                </i-menu-item>
            </div>

        </i-submenu>

        <i-menu-item :name='`${item.route}`' v-for="item in menus" v-if="!item.children" :class="$route.path===`/${item.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
        <i-icon :type="item.icon" />
            {{item.title}}
        </i-menu-item>
    </i-menu>
</template>

<script>
export default {
    name:'MenuTree',
    props:{
        menus:{
            type:Array
        },
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


