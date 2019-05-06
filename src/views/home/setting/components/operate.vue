<template>
    <Poptip placement='bottom-end'  v-model="visible" @on-popper-show='isDown=true' @on-popper-hide='isDown=false'>
        <span class="userInfo_name">操作</span>
        <span class="arrow">
            <Icon type="md-arrow-dropup" v-show="!isDown"/>
            <Icon type="md-arrow-dropdown" v-show="isDown"/>
        </span>
        
        <div slot="content">
            <Dropdown @click.native='itemHandler'>
                <!-- <DropdownItem data-index='1'>配置权限</DropdownItem> -->
                <DropdownItem data-index='1'>重置密码 <Icon type="md-radio-button-on" /></DropdownItem>
                <DropdownItem divided data-index='2'>分配角色 <Icon type="md-create" /></DropdownItem>
                <DropdownItem divided data-index='3'>删除 <Icon type="ios-trash" /></DropdownItem>
                <DropdownItem divided data-index='4'>权限分配 <Icon type="md-create" /></DropdownItem>

            </Dropdown>
        </div>
    </Poptip>
</template>

<script>
export default {
    name:'Operate',
    data(){
        return{
            isDown:false,
            visible:false
        }
    },
    props:{
        row:{
            type:Object 
        }
    },
    methods:{
        itemHandler(e){
            this.visible = false
            let index = e.target.dataset.index
            this.$emit('operate',index,this.row)
        }
    }
}
</script>

<style lang="less" scoped>

</style>


