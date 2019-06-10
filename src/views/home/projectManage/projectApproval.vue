<template>
    <div class="projectApproval">
        <!-- 审批 -->
        <i-divider>待审批流程</i-divider>
        <div class="approval">
            <i-card style="width:42%;margin:30px 30px;min-width:360px;" v-for="(project,index) in approvalProjects">
                <p slot="title">
                    <i-icon type="ios-film-outline"></i-icon>
                    审批项目 {{index+1}}{{project.ProjectStatus===1 && isNull(project.EndTime)?'(请填写宇龙编码)':''}}
                </p>

                <a href="javascript:;" slot="extra" @click="approval(project)">
                    <i-icon type></i-icon>
                    审批
                </a>
                <ul class="approval_item">
                   <li v-for="item in project.ProductionInfo" :key="item.name" v-show='item.value && transformName(item.name)'>
                        <span>{{transformName(item.name)}}:</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
            </i-card>
        </div>

        <!-- 项目审批流程 -->
        <div>
            <i-divider>项目审批流程</i-divider>
            <div class="flow">
                <div class="flow_item" v-for="(item,index) in projects">
                    <span>项目{{index+1}}</span>
                    <i-steps :current="item.CurrentNode+1">
                        <i-step title="项目立项" :content="item.ProductorRemark"></i-step>
                        <i-step title="项目经理审批" :content="item.ProjectorRemark"></i-step>
                        <i-step title="运营审批" :content="item.OperatorRemark"></i-step>
                    </i-steps>
                    <div class="status">
                        <i-circle v-if="item.ProjectStatus===4" :size="36" :percent="100" :stroke-width="8" stroke-color='#ff5500'>
                            <i-icon type="ios-close" size="36" style="color:#ff5500"></i-icon>
                        </i-circle>

                        <i-circle v-else :size="36" :percent="item.CurrentNode ? item.CurrentNode===1?66.6:100:33.3" :stroke-width="8" :stroke-color="item.ProjectStatus===1?'#5cb85c':'#2d8cf0'">
                            <i-icon v-if="item.CurrentNode===2" type="ios-checkmark" size="36" :style="{color:item.CurrentNode===2?'#5cb85c':'#5cb85c'}"></i-icon>
                        </i-circle>
                        <span style="margin-left:6px;">{{transformStatus(item.ProjectStatus)}}</span>
                    </div>
                    <div class="operate">
                        <Operate @operateHandler='operateHandler' :item='item'></Operate>
                    </div>
                </div>
            </div>
        </div>

        <!-- 审核 -->
        <i-modal
            v-model="approvalStatus"
            width='700'
            :styles="{marginBottom:'60px'}"
            title="项目审批">
            <div slot="footer">
                <i-button @click="approvalStatus = false" size='large'>取消</i-button>
                <i-button type='error' style="margin:0 20px;" @click="approvalCancel" size='large' v-if="!projectOver">不通过</i-button>
                <i-button type='primary' @click="approvalOk" size='large'>{{projectOver?'确定':'通过'}}</i-button>
            </div>

            <i-form  ref="formApproval" :model="formsPro" :rules="rulesPro" style="margin:20px 60px;" :label-width="100" v-if="userInfo.RoleId===24 || userInfo.RoleId===10">
                <i-form-item label="宇龙编码" prop="ylCode" v-if="projectOver">
                    <i-input v-model="formsPro.ylCode" placeholder="请输入宇龙编码"></i-input>
                </i-form-item>

                <i-form-item label="项目名称" prop="projectName"  v-if="!projectOver">
                    <i-input v-model="formsPro.projectName" placeholder="请输入项目名称"></i-input>
                </i-form-item>

                <i-form-item label="备注" prop="message" v-if="!projectOver">
                    <i-input type='textarea' :autosize='{minRows: 6}' v-model="formsPro.message" placeholder="请输入备注"></i-input>
                </i-form-item>
            </i-form>

            <!-- 运营 -->
            <i-form  ref="formApproval" :model="formsOp" :rules="rulesOp" style="margin:20px 60px;" :label-width="100" v-if="userInfo.RoleId===24 || userInfo.RoleId===2">
                <i-form-item label="Sku" prop="sku">
                    <i-input v-model="formsOp.sku" placeholder="请输入sku"></i-input>
                </i-form-item>

                <i-form-item label="Asin" prop="asin">
                    <i-input v-model="formsOp.asin" placeholder="请输入asin"></i-input>
                </i-form-item>

                <i-form-item label="ParentAsin" prop="parentAsin">
                    <i-input v-model="formsOp.parentAsin" placeholder="请输入parentAsin"></i-input>
                </i-form-item>

                <i-form-item label="备注" prop="message">
                    <i-input type='textarea' :autosize='{minRows: 6}' v-model="formsOp.message" placeholder="请输入备注"></i-input>
                </i-form-item>
            </i-form>
        </i-modal>

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
                        <span>{{approvalUsers[2] && approvalUsers[2].Cname}}</span>
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
                    <li v-for="item in scanProjectInfo.productionInfo " v-show='item.value && transformName(item.name)'>
                        <span>{{transformName(item.name)}}:</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>

                <i-divider>审批信息</i-divider>
                <ul class="approval_item">
                    <li style="width:100%;">
                        <span>项目经理审批 ({{ approvalUsers[1] && approvalUsers[1].Cname}}) :</span>
                        <span>{{scanProjectInfo.ProjectStatus===4 && scanProjectInfo.CurrentNode===-1?'审核不通过':scanProjectInfo.CurrentNode===0?'等待审批':`审批通过 / ${isNull(scanProjectInfo.ProjectorApprovalTime)?'':scanProjectInfo.ProjectorApprovalTime}`}}
                            <i-icon v-if='scanProjectInfo.CurrentNode>0' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                            <i-icon v-if='scanProjectInfo.ProjectStatus===4' style="color:#5cb85c;font-size:30px;color:#ff5500" type="ios-close" />
                        </span>
                    </li>
                    <li style="width:100%;">
                        <span>运营审批  ({{approvalUsers[0] && approvalUsers[0].Cname}}) :</span>
                        <span>{{scanProjectInfo.ProjectStatus===5 && scanProjectInfo.CurrentNode===-1?'审核不通过':scanProjectInfo.CurrentNode===0 || scanProjectInfo.CurrentNode===1 || scanProjectInfo.CurrentNode===-1 ?'等待审批':`审批通过 / ${isNull(scanProjectInfo.OperatorApprovalTime)?'':scanProjectInfo.OperatorApprovalTime}`}}
                            <i-icon v-if='scanProjectInfo.CurrentNode>0 && scanProjectInfo.CurrentNode===2' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                            <i-icon v-if='scanProjectInfo.ProjectStatus===5' style="color:#5cb85c;font-size:30px;color:#ff5500" type="ios-close" />
                        </span>
                    </li>

                    <li style="width:100%;">
                        <span>填写宇龙编码  ({{ approvalUsers[1] && approvalUsers[1].Cname}}) :</span>
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
import Operate from './components/operatePop'
import {
    queryProject,
    queryUserById,
    approvalProject,
    rejectApproval
} from '@api/project'
export default {
    data(){
        return{
            projectOver:false,
            projectId:'',
            approvalUsers:[],
            projects:[],
            approvalProjects:{ProductiomInfo:[]},
            scanProjectInfo:[],
            scanProjectStatus:false,
            approvalStatus:false,
            formsPro:{
                ylCode:'',
                projectName:'',
                message:''
            },
            rulesPro:Object.freeze({
                ylCode:[
                    { required: true, message: '请输入宇龙编码', trigger: 'blur' }
                ],
                projectName:[
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ]
            }),
            formsOp:{
                sku:'',
                asin:'',
                parentAsin:'',
                message:''
            },
            rulesOp:Object.freeze({
                sku:[
                    { required: true, message: '请输入sku', trigger: 'blur' }
                ],
                asin:[
                    { required: true, message: '请输入asin', trigger: 'blur' }
                ],
                parentAsin:[
                    { required: true, message: '请输入parentAsin', trigger: 'blur' }
                ]
            })
        }
    },
    components:{Operate},
    activated(){
        this.queryApprovalProject()
        this.queryProject()
    },
    
    methods:{
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
                return '项目立项'

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
        queryApprovalProject(){//查询审批项目
            queryProject({userId:'9da6e0a5e115474596f3d7e5219fd860',type:'ProjectorUserId',status:this.userInfo.RoleId === 2?1:0,projector:this.userInfo.RoleId === 2?'':'projector'}).then( (res) => {
                console.log(res)
                this.approvalProjects = res.data.items

                for(let i=0; i<this.approvalProjects.length; i++){
                    let list = JSON.parse(this.approvalProjects[i].ProductionInfo)
                    let arr = []
                    for(let key in list){
                        arr.push({
                            name:key,
                            value:list[key]
                        })
                    }
                    this.$set(this.approvalProjects[i],'ProductionInfo',arr)
                }
                console.log(this.approvalProjects)
            })
        },
        queryProject(){
            queryProject({userId:'9da6e0a5e115474596f3d7e5219fd860',type:'ProjectorUserId'}).then( (res) => {
                console.log(res)
                this.projects = res.data.items

            })
        },
        //审批
        approval(item){
            this.approvalStatus = true
            this.projectId = item.ProjectId
            this.projectOver = item.ProjectStatus===1?true:false
        },
        //审批通过
        approvalOk(){
            this.$refs['formApproval'].validate((valid) => {
                if (valid) {
                    let parmas = {}
                    if(!this.projectOver){
                         parmas = this.userInfo.RoleId === 2?
                        {
                            type:'Operator',
                            remark:this.formsOp.message,
                            sku:this.formsOp.sku,
                            asin:this.formsOp.asin,
                            parentAsin:this.formsOp.parentAsin,
                            id:this.projectId
                        }:
                        {
                            type:'Projector',
                            remark:this.formsPro.message,
                            projectName:this.formsPro.projectName,
                            id:this.projectId
                        }
                    }else{
                        parmas = {
                            type:'ylcode',
                            ylCode:this.formsPro.ylCode
                        }
                    }
                    
                    approvalProject(parmas).then( (res) => {
                        this.approvalStatus = false
                        this.$refs['formApproval'].resetFields()
                        this.queryApprovalProject()
                        this.queryProject()
                    })
                }
            })
        },
        //审批不通过
        approvalCancel(){
            rejectApproval({projectId:this.projectId,status:this.userInfo.RoleId===2?5:4}).then( (res) => {
                this.approvalStatus = false
                this.queryApprovalProject()
                this.queryProject()
            })
        },
        operateHandler(type,item){
            switch(type){
                case 1:
                    this.scanProjectStatus = true
                    queryUserById({ids:`${item.ProductorUserId},${item.ProjectorUserId},${item.OperatorUserId}`}).then( (res) => {
                        this.approvalUsers = res.data.users
                    })
                    this.scanProjectInfo = {...this.scanProjectInfo,...item}
                    this.scanProjectInfo.productionInfo = []
                    let list = JSON.parse(item.ProductionInfo)
                    for(let key in list){
                        this.scanProjectInfo.productionInfo.push({
                            name:key,
                            value:list[key]
                        })
                        
                    }
                break;
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .projectApproval{
        .approval{
            display: flex;
            flex-wrap: wrap;
        }
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


