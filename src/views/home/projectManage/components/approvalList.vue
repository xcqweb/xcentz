<template>
    <div style="margin-bottom:60px;">
        <i-divider>项目审批流程</i-divider>
        <p><i-input search enter-button v-model="searchKey" size="large" @on-search='$emit("queryProject")' @on-enter='$emit("queryProject")' style="width:100%;margin-right:30px;" placeholder="项目名称 产品经理 项目经理 运营..." /></p>
        <div class="flow">
            <div class="flow_item" v-for="item in projects" :key="item.ProjectId">
                <span>{{item.ProjectName?item.ProjectName:''}}</span>
                <i-steps :current="item.CurrentNode+1">
                    <i-step :title="'产品立项 '+' ('+item.ProductorName+')'" :content="item.ProductorRemark"></i-step>
                    <i-step :title="'项目经理审批 '+' ('+item.ProjectorName+')'" :content="item.ProjectorRemark"></i-step>
                    <i-step :title="'运营审批 '+' ('+item.OperatorName+')'" :content="item.OperatorRemark"></i-step>
                    <i-step :title="'填写宇龙编码 '+' ('+item.ProjectorName+')'"></i-step>
                </i-steps>
                <div class="status">
                    <i-circle v-if="item.ProjectStatus===4 || item.ProjectStatus===5" :size="36" :percent="100" :stroke-width="8" stroke-color='#ff5500'>
                        <i-icon type="ios-close" size="36" style="color:#ff5500"></i-icon>
                    </i-circle>

                    <i-circle v-else :size="36" :percent="(item.CurrentNode+1)*25" :stroke-width="8" :stroke-color="item.ProjectStatus===1?'#5cb85c':'#2d8cf0'">
                        <i-icon v-if="item.CurrentNode===3" type="ios-checkmark" size="36" :style="{color:item.CurrentNode===3?'#5cb85c':'#5cb85c'}"></i-icon>
                    </i-circle>
                    <span style="margin-left:6px;font-size:14px;">{{transformStatus(item.ProjectStatus)}}</span>
                </div>
                <div class="operate">
                    <Operate @operateHandler="operateHandler"  :item='item'></Operate>
                </div>
            </div>
        </div>
        <i-page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin:20px 0;' />

        <!-- 查看项目 -->
        <i-modal
            v-model="scanProjectStatus"
            width='700'
            :styles="{marginBottom:'60px'}"
            footer-hide
            title="项目详情">
            <div style="margin:20px;">

                <i-divider>项目详情</i-divider>
                <ul class="approval_item">
                    <li v-if="scanProjectInfo.ProjectName">
                        <span>项目名称:</span>
                        <span>{{scanProjectInfo.ProjectName}}</span>
                    </li>

                     <li v-if="scanProjectInfo.YLCode">
                        <span>宇龙编码:</span>
                        <span>{{scanProjectInfo.YLCode}}</span>
                    </li>

                    <li v-if="scanProjectInfo.Sku">
                        <span>Sku:</span>
                        <span>{{scanProjectInfo.Sku}}</span>
                    </li>

                    <li v-if="scanProjectInfo.Asin">
                        <span>Asin:</span>
                        <span>{{scanProjectInfo.Asin}}</span>
                    </li>

                    <li v-if="scanProjectInfo.ParentAsin">
                        <span>ParentAsin:</span>
                        <span>{{scanProjectInfo.ParentAsin}}</span>
                    </li>

                     <li>
                        <span>创建人:</span>
                        <span>{{scanProjectInfo.ProductorName}}</span>
                    </li>
                    <li>
                        <span>创建时间:</span>
                        <span>{{scanProjectInfo.CreateTime}}</span>
                    </li>

                    <li v-if="!isNull(scanProjectInfo.EndTime)">
                        <span>结束时间:</span>
                        <span>{{isNull(scanProjectInfo.EndTime)?'':scanProjectInfo.EndTime}}</span>
                    </li>
                </ul>

                <i-divider>产品信息</i-divider>
                <ul class="approval_item">
                    <li v-for="item in scanProjectInfo.productionInfo " v-show='item.value && transformName(item.name)' :key="item.name">
                        <span>{{transformName(item.name)}}:</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>

                <i-divider>审批信息</i-divider>
                <ul class="approval_item">
                    <li style="width:100%;">
                        <span>项目经理审批 ({{ scanProjectInfo.ProjectorName}}) :</span>
                        <span>{{scanProjectInfo.ProjectStatus===4 && scanProjectInfo.CurrentNode===-1?`审核不通过 / ${isNull(scanProjectInfo.ProjectorApprovalTime)?'':scanProjectInfo.ProjectorApprovalTime}`:scanProjectInfo.CurrentNode===0?'等待审批':`审批通过 / ${isNull(scanProjectInfo.ProjectorApprovalTime)?'':scanProjectInfo.ProjectorApprovalTime}`}}
                            <i-icon v-if='scanProjectInfo.ProjectStatus===5 && scanProjectInfo.CurrentNode===-1 || scanProjectInfo.CurrentNode>0' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                            <i-icon v-if='scanProjectInfo.ProjectStatus===4' style="color:#5cb85c;font-size:30px;color:#ff5500" type="ios-close" />
                        </span>
                    </li>
                    <li style="width:100%;">
                        <span>运营审批  ({{scanProjectInfo.OperatorName}}) :</span>
                        <span>{{scanProjectInfo.ProjectStatus===5 && scanProjectInfo.CurrentNode===-1?`审核不通过 / ${isNull(scanProjectInfo.OperatorApprovalTime)?'':scanProjectInfo.OperatorApprovalTime}`:scanProjectInfo.CurrentNode===0 || scanProjectInfo.CurrentNode===1 || scanProjectInfo.CurrentNode===-1 ?'等待审批':`审批通过 / ${isNull(scanProjectInfo.OperatorApprovalTime)?'':scanProjectInfo.OperatorApprovalTime}`}}
                            <i-icon v-if='scanProjectInfo.CurrentNode>0 && scanProjectInfo.CurrentNode>=2' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                            <i-icon v-if='scanProjectInfo.ProjectStatus===5' style="color:#5cb85c;font-size:30px;color:#ff5500" type="ios-close" />
                        </span>
                    </li>

                    <li style="width:100%;">
                        <span>填写宇龙编码  ({{ scanProjectInfo.ProjectorName}}) :</span>
                        <span>{{isNull(scanProjectInfo.EndTime)?'未填写': `已填写 / ${isNull(scanProjectInfo.EndTime)?'':scanProjectInfo.EndTime}`}}
                            <i-icon v-if='!isNull(scanProjectInfo.EndTime)' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                        </span>
                    </li>
                </ul>
            </div>
        </i-modal>
    </div>
</template>

<script>
import Operate from './operatePop'

export default {
    props:{
        projects:{
            type:Array
        },
        goPage:{
            type:Function
        },
        totalCount:{
            type:Number
        },
        currentPage:{
            type:Number
        },
        pageSize:{
            type:Number
        },
        
    },
    data(){
        return{
            searchKey:'',
            scanProjectInfo:[],
            scanProjectStatus:false,
        }
    },
    watch:{
        searchKey(val){
            this.$emit('updateKey',val)
        }
    },
    components:{Operate},
    methods:{
        operateHandler(type,item){
            switch(type){
                case 1:
                    this.detail(item)//详情
                break;
                case 5:
                    this.$emit('approval',item)//审批
                    break;
            }
        },
        detail(item){
            this.scanProjectStatus = true
            this.scanProjectInfo = {...this.scanProjectInfo,...item}
            this.scanProjectInfo.productionInfo = []
            if(Array.isArray(item.ProductionInfo)){
                this.scanProjectInfo.productionInfo = item.ProductionInfo
                return
            }
            
            let list = JSON.parse(item.ProductionInfo)
            for(let key in list){
                this.scanProjectInfo.productionInfo.push({
                    name:key,
                    value:list[key]
                })
                
            }
        },
        transformStatus(status){
            switch(status){
                case 1:
                return '已完成'

                case 2:
                return '进行中'

                case 3:
                return '已取消'

                case 4:
                return '不通过'

                case 5:
                return '不通过'
            }
        },
        transformName(key){
            switch(key){
                case 'projectName':
                return '项目名称'

                case 'product':
                return '品类'

                case 'productChild':
                return '子品类'

                case 'supplier':
                return '供应商'

                case 'sellStatu':
                return '项目状态'

                case 'pack':
                return '包装'

                case 'color':
                return '颜色'

                case 'lineLength':
                return '线材长度'

                case 'outMaterial':
                return '外被材质'

                case 'portMaterial':
                return '端子材质'

                case 'port':
                return '口数'

                case 'charge':
                return '充电技术'

                case 'battery':
                return '电池容量(mAh)'

                // case 'remarks':
                // return '口数'
            }

        },
    }
}
</script>

<style lang="less" scoped>
.flow{
    margin-top: 50px;
    .flow_item{
        display: flex;
        &>span{
            flex-basis: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .operate,.status{
            width: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
    .approval_item{
        display: flex;
        flex-wrap: wrap;
        &>li{
            width: 100%;
            display: flex;
            height:36px;
            line-height: 36px;
            display: flex;
            justify-content: center;
             &>span:nth-child(1){
                flex-basis: 160px;
                text-align: right;
                font-weight: bold;
                font-size: 14px;
            }
            &>span:nth-child(2){
                flex: 2;
                margin-left:10px;
                text-align: left;
            }
        }
    }
</style>


