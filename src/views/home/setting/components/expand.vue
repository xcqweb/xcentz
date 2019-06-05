<template>
    <div style='height:100%'>
        <i-row class="expand-row">
            <i-col span="8">
                <span class="expand-key">英文名: </span>
                <span class="expand-value">{{ row.UserName }}</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">邮箱号: </span>
                <span class="expand-value">{{ row.Email }}</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">手机号: </span>
                <span class="expand-value">{{ row.Phone }}</span>
            </i-col>
            
        </i-row>
        <i-row>
            <i-col span="8">
                <span class="expand-key">最近登录时间: </span>
                <span class="expand-value">{{ row.LoatLoginTime }}</span>
            </i-col>
            <i-col span="8">
                <span class="expand-key">账号创建时间: </span>
                <span class="expand-value">{{ row.CreateTime }}</span>
            </i-col>
        </i-row>
    </div>
</template>

<script>
export default {
    props:{
        row:{
            type:Object
        }
    }
}
</script>

<style lang="less" scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>


