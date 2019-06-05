<template>
    <i-poptip :placement='palce' trigger="hover" v-model="visible" @on-popper-show='isDown=true' @on-popper-hide='isDown=false'>
        <span class="userInfo_name">操作</span>
        <span class="arrow">
            <i-icon type="md-arrow-dropup" v-show="!isDown"/>
            <i-icon type="md-arrow-dropdown" v-show="isDown"/>
        </span>
        
        <div slot="content">
            <i-dropdown @click.native='itemHandler'>
                <i-dropdown-item data-index='1'>重置密码 <i-icon type="md-radio-button-on" /></i-dropdown-item>
                <i-dropdown-item divided data-index='2'>分配角色 <i-icon type="md-create" /></i-dropdown-item>
                <i-dropdown-item divided data-index='3'>删除 <i-icon type="ios-trash" /></i-dropdown-item>
            </i-dropdown>
        </div>
    </i-poptip>
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
        },
        palce:{
            type:String,
            default:'left'
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


