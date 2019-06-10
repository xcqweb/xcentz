<template>
    <i-poptip trigger="click" placement="left">
        <i-icon type='ios-add' style="color:#888;font-size:26px;cursor:pointer;background:#f6f6f6;border-radius:50%;"></i-icon>
        <i-dropdown slot="content" @click.native='getSelected'>
            <i-dropdown-item data-index='1'><i-icon type="md-information-circle" /> 详情</i-dropdown-item>
            <i-dropdown-item data-index='2' divided v-if="(userInfo.RoleId === 6 || userInfo.RoleId === 24) && item.ProjectStatus===2 || (userInfo.RoleId === 6 || userInfo.RoleId === 24) && item.CurrentNode===-1 "><i-icon type="md-create" /> 编辑</i-dropdown-item>
            <i-dropdown-item data-index='3' divided v-if="(userInfo.RoleId === 6 || userInfo.RoleId === 24) && item.ProjectStatus!==1" ><i-icon type="ios-trash" /> 删除</i-dropdown-item>
            <i-dropdown-item data-index='4' divided v-if="(userInfo.RoleId !== 2 || userInfo.RoleId === 24) && item.ProjectStatus===2"><i-icon type="md-notifications" /> 通知</i-dropdown-item>
        </i-dropdown>
    </i-poptip>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    props:{
        item:{
            type:Object,
            default:() => {
                return {}
            }
        }
    },
    methods:{
        getSelected(e){
            let $index = e.target.dataset.index
            switch($index){

                case '1':
                    this.$emit('operateHandler',1,this.item)
                break;

                case '2'://编辑
                    this.$emit('operateHandler',2,this.item)
                break;

                case '3'://删除
                    this.$Modal.confirm({
                        title: '提示',
                        loading: true,
                        content: `<p>确定要删除 <span style='color:#2d8cf0;'>xxx</span> 项目?</p>`,
                        onOk: () => {
                            this.$Modal.remove();
                        }
                    });
                break;

                case '4'://通知审批
                    this.$Modal.confirm({
                        title: '提示',
                        loading: true,
                        content: `<p>确定要通知相关人员审批项目吗?</p>`,
                        onOk: () => {
                            this.$Modal.remove();
                        }
                    });
                break;
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>


