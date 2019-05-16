<template>
    <div style='height:100%'>
        <Row class="expand-row">
            <i-Col span="8">
                <span class="expand-key">英文名: </span>
                <span class="expand-value">{{ row.UserName }}</span>
            </i-Col>
            <i-Col span="8">
                <span class="expand-key">邮箱号: </span>
                <span class="expand-value">{{ row.Email }}</span>
            </i-Col>
            <i-Col span="8">
                <span class="expand-key">手机号: </span>
                <span class="expand-value">{{ row.Phone }}</span>
            </i-Col>
            
        </Row>
        <Row>
            <i-Col span="8">
                <span class="expand-key">最近登录时间: </span>
                <span class="expand-value">{{ row.LoatLoginTime }}</span>
            </i-Col>
            <i-Col span="8">
                <span class="expand-key">账号创建时间: </span>
                <span class="expand-value">{{ row.CreateTime }}</span>
            </i-Col>
            
            <!-- <i-Col span="8">
                <span class="expand-key">Favorite music: </span>
                <span class="expand-value">{{ row.music }}</span>
            </i-Col> -->
        </Row>
    </div>
</template>

<script>
export default {
    props:{
        row:{
            type:Object
        }
    },
    created(){
        console.log(this.row)
    }
}
</script>

<style lang="less" scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>


