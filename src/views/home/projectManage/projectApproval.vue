<template>
    <div class="projectApproval">
        <!-- 审批 -->
        <i-divider>待审批流程</i-divider>
        <div class="approval">
            <i-card style="width:42%;margin:30px 30px;min-width:360px;" v-for="project in approvalProjects" :key="project.ProjectId">
                <p slot="title">
                    <i-icon type="ios-film-outline"></i-icon>
                    审批项目{{project.ProjectName?`-${project.ProjectName}`:''}} {{project.CurrentNode===2?'( 填写宇龙编码 )':''}}
                </p>

                <a href="javascript:;" slot="extra" @click="approval(project)">
                    <i-icon type='ios-create'></i-icon>
                    审批
                </a>
                <a href="javascript:;" slot="extra" @click="$refs.appList.detail(project)">
                    <i-icon type="md-alert" />
                    详情
                </a>
                <ul class="approval_item">
                   <li v-for="item in project.ProductionInfo" :key="item.name" v-show='item.value && transformName(item.name)'>
                        <span>{{transformName(item.name)}}:</span>
                        <span>{{item.value}}</span>
                    </li>
                </ul>
                <i-divider>审批信息</i-divider>
                <ul class="approval_item">
                    <li style="width:100%;">
                        <span>项目经理审批 ({{ project.ProjectorName}}) :</span>
                        <span>{{project.ProjectStatus===4 && project.CurrentNode===-1?`审核不通过 / ${isNull(project.ProjectorApprovalTime)?'':project.ProjectorApprovalTime}`:project.CurrentNode===0?'等待审批':`审批通过 / ${isNull(project.ProjectorApprovalTime)?'':project.ProjectorApprovalTime}`}}
                            <i-icon v-if='project.ProjectStatus===5 && project.CurrentNode===-1 || project.CurrentNode>0' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                            <i-icon v-if='project.ProjectStatus===4' style="color:#5cb85c;font-size:30px;color:#ff5500" type="ios-close" />
                        </span>
                    </li>
                    <li style="width:100%;">
                        <span>运营审批  ({{project.OperatorName}}) :</span>
                        <span>{{project.ProjectStatus===5 && project.CurrentNode===-1?`审核不通过 / ${isNull(project.OperatorApprovalTime)?'':project.OperatorApprovalTime}`:project.CurrentNode===0 || project.CurrentNode===1 || project.CurrentNode===-1 ?'等待审批':`审批通过 / ${isNull(project.OperatorApprovalTime)?'':project.OperatorApprovalTime}`}}
                            <i-icon v-if='project.CurrentNode>0 && project.CurrentNode>=2' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                            <i-icon v-if='project.ProjectStatus===5' style="color:#5cb85c;font-size:30px;color:#ff5500" type="ios-close" />
                        </span>
                    </li>

                    <li style="width:100%;">
                        <span>填写宇龙编码  ({{ project.ProjectorName}}) :</span>
                        <span>{{isNull(project.EndTime)?'未填写': `已填写 / ${isNull(project.EndTime)?'':project.EndTime}`}}
                            <i-icon v-if='!isNull(project.EndTime)' style="color:#5cb85c;font-size:30px;" type="ios-checkmark" />
                        </span>
                    </li>
                </ul>
            </i-card>
        </div>

        <!-- 项目审批流程 -->
        <ApprovalList ref='appList' @approval=" val => this.approval(val)" @updateKey="val => this.searchKey = val " @queryProject='queryProject' :projects='projects' :goPage='goPage' :totalCount='totalCount' :currentPage='currentPage' :pageSize='pageSize'></ApprovalList>

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

        
    </div>
</template>

<script>
import ApprovalList from './components/approvalList'
import {
    queryProject,
    approvalProject,
    rejectApproval,
    validateName
} from '@api/project'
export default {
    data(){
        const validateProjectName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入项目名称!'));
            } else {
                validateName({name:value}).then( ({data:{valid}}) => {
                    if(valid){
                        callback(new Error('项目名称已存在!'));
                    }else{
                        callback()
                    }
                })
            }
        };
        return{
            pageSize:10,
            totalCount:0,
            currentPage:1,
            searchKey:'',
            projectOver:false,
            projectInfo:{
                projectId:'',
                operatorId:'',
                projectorId:''
            },
            projects:[],
            approvalProjects:{ProductiomInfo:[]},
            
            
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
                    { required: true,validator:validateProjectName, trigger: 'blur' }
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
    components:{ApprovalList},
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
        goPage(page){
            this.currentPage = page
            this.queryProject()
        },
        queryApprovalProject(){//查询审批项目
        let params = {
            userId:this.userInfo.UserId,
            type:this.userInfo.RoleId === 2?'OperatorUserId':'ProjectorUserId',
            status:this.userInfo.RoleId === 2?1:20,
            projector:this.userInfo.RoleId === 2?'':'projector',
            
        }
            queryProject(params).then( (res) => {
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
            })
        },
        queryProject(){
            let params = {
                userId:this.userInfo.UserId,
                type:this.userInfo.RoleId === 2?'OperatorUserId':'ProjectorUserId',
                currentPage:this.currentPage,
                pageSize:this.pageSize,
                key:this.searchKey
            }
            queryProject(params).then( (res) => {
                this.projects = Object.freeze(res.data.items)
                this.totalCount = res.data.total

            })
        },
        //审批
        approval(item){
            this.approvalStatus = true
            this.projectInfo = {
                projectId: item.ProjectId,
                operatorId: item.OperatorUserId,
                projectorId: item.ProjectorUserId,
            }
            this.projectOver = item.CurrentNode===2?true:false
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
                            id:this.projectInfo.projectId,
                            operatorId:this.projectInfo.operatorId,
                            projectorId:this.projectInfo.projectorId,

                        }:
                        {
                            type:'Projector',
                            remark:this.formsPro.message,
                            projectName:this.formsPro.projectName,
                            id:this.projectInfo.projectId,
                            operatorId:this.projectInfo.operatorId,
                            projectorId:this.projectInfo.projectorId,
                        }
                    }else{
                        parmas = {
                            type:'ylcode',
                            ylCode:this.formsPro.ylCode,
                            id:this.projectInfo.projectId,
                        }
                    }
                    
                    approvalProject(parmas).then( (res) => {
                        this.approvalStatus = false
                        this.$refs['formApproval'].resetFields()
                        this.$root.eventBus.$emit('message',this.projectInfo.projectId)
                        this.queryApprovalProject()
                        this.queryProject()
                    })
                }
            })
        },
        //审批不通过
        approvalCancel(){
            rejectApproval({projectId:this.projectInfo.projectId,status:this.userInfo.RoleId===2?5:4}).then( (res) => {
                this.approvalStatus = false
                this.$root.eventBus.$emit('message',this.projectInfo.projectId)
                this.queryApprovalProject()
                this.queryProject()
            })
        },
        
        
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


