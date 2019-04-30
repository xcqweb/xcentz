<template>
    <div class="topBar">
        <Bread-crumb />
        <Tags />
    </div>
</template>

<script>
import BreadCrumb from '../breadcrumb'
import Tags from '../tags'
export default {
    data(){
        return{

        }
    },
    components:{BreadCrumb,Tags}
}
</script>

<style lang="less" scoped>
    .topBar{
        
    }
</style>


