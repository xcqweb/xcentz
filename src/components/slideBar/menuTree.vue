<template>
    <Menu theme="dark" accordion :active-name='$route.path' @on-select="selectBack">
        <Submenu :name="item.id" v-for="item in menus" v-if="item.children" :key="item.id">
            <template slot="title">
                <Icon :type="item.icon" />
                {{item.title}}
            </template>

           
            <div v-for="child in item.children" :key="child.id">
                <MenuGroup :title="child.title" v-if="child.children && child.children.length">
                    <MenuItem v-for="childItem in child.children" :key="childItem.id">{{childItem.title}}</MenuItem>
                </MenuGroup>

                <MenuItem v-else :name="`${child.route}`" :style="{background:$route.path===`/${child.route}`?'#2d8cf0 !important':'#363e4f !important'}" :class="$route.path===`/${child.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
                    {{child.title}}
                </MenuItem>
            </div>

        </Submenu>

        <MenuItem :name='`${item.route}`' v-for="item in menus" v-if="!item.children" :class="$route.path===`/${item.route}`?['ivu-menu-item-active', 'ivu-menu-item-selected', 'ivu-menu-item-active']:''">
        <Icon :type="item.icon" />
            {{item.title}}
        </MenuItem>
    </Menu>
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


