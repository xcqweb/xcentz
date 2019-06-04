<template>
    <div class="projectApproval">
        <!-- 审批 -->
        <i-divider>待审批流程</i-divider>
        <div class="approval">
            <i-card style="width:42%;margin:30px 30px;min-width:360px;" v-for="i in 2">
                <p slot="title">
                    <i-icon type="ios-film-outline"></i-icon>
                    项目{{i}}
                </p>

                <a href="javascript:;" slot="extra" @click="approval()">
                    <i-icon type></i-icon>
                    审批
                </a>
                <ul class="approval_item">
                    <li v-for="i in 20">
                        <span>品类:</span>
                        <span>cable</span>
                    </li>
                </ul>
            </i-card>
        </div>

        <!-- 项目审批流程 -->
        <div>
            <i-divider>项目审批流程</i-divider>
            <div class="flow">
                <div class="flow_item">
                    <span>项目一</span>
                        <i-steps :current="4">
                        <i-step title="项目立项" content="项目立项"></i-step>
                        <i-step title="项目经理审批" content="项目经理审批"></i-step>
                        <i-step title="运营审批" content="不符合要求"></i-step>
                        <!-- <i-step title="项目审批通过" content="项目审批通过"></i-step> -->
                    </i-steps>
                    <div class="status">
                        <i-circle :size="36" :percent="100" :stroke-width="8" stroke-color="#5cb85c">
                            <i-icon v-if="100" type="ios-checkmark" size="36" style="color:#5cb85c"></i-icon>
                        </i-circle>
                        <span style="margin-left:6px;">已完成</span>
                    </div>
                    <div class="operate">
                        <Operate @operateHandler='operateHandler'></Operate>
                    </div>
                </div>
                
                <div class="flow_item">
                    <span>项目二</span>
                        <i-steps :current="3" status="finish">
                        <i-step title="项目立项" content="项目立项"></i-step>
                        <i-step title="项目经理审批" content="项目经理审批"></i-step>
                        <i-step title="运营审批" content="不符合要求"></i-step>
                        <!-- <i-step title="项目审批通过" content="项目审批通过"></i-step> -->
                    </i-steps>
                    <div class="status">
                        <i-circle :size="36" :percent="100" :stroke-width="8" stroke-color="#5cb85c">
                            <i-icon v-if="100" type="ios-checkmark" size="36" style="color:#5cb85c"></i-icon>
                        </i-circle>
                        <span style="margin-left:6px;">已完成</span>
                    </div>
                    <div class="operate">
                        <Operate @operateHandler='operateHandler'></Operate>
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
                <i-button type='error' style="margin:0 20px;" @click="approvalCancel" size='large'>不通过</i-button>
                <i-button type='primary' @click="approvalOk" size='large'>通过</i-button>
            </div>

            <i-form  ref="formApproval" :model="formsPro" :rules="rulesPro" style="margin:20px 60px;" :label-width="100" v-if="userInfo.RoleId===24 || userInfo.RoleId===10">
                <i-form-item label="宇龙编码" prop="ylCode">
                    <i-input v-model="formsPro.ylCode" placeholder="请输入宇龙编码"></i-input>
                </i-form-item>

                <i-form-item label="项目名称" prop="projectName">
                    <i-input v-model="formsPro.projectName" placeholder="请输入项目名称"></i-input>
                </i-form-item>

                <i-form-item label="备注" prop="message">
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
                <ul class="approval_item">
                    <li v-for="i in 20" :key="i">
                        <span>品类:</span>
                        <span>cable</span>
                    </li>
                </ul>
            </div>
        </i-modal>
    </div>
</template>

<script>
import Operate from './components/operatePop'

export default {
    data(){
        return{
            scanProjectStatus:false,
            approvalStatus:false,
            formsPro:{
                ylCode:'',
                projectName:'',
                message:''
            },
            rulesPro:{
                ylCode:[
                    { required: true, message: '请输入宇龙编码', trigger: 'blur' }
                ],
                projectName:[
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ]
            },
            formsOp:{
                sku:'',
                asin:'',
                parentAsin:'',
                message:''
            },
            rulesOp:{
                sku:[
                    { required: true, message: '请输入sku', trigger: 'blur' }
                ],
                asin:[
                    { required: true, message: '请输入asin', trigger: 'blur' }
                ],
                parentAsin:[
                    { required: true, message: '请输入parentAsin', trigger: 'blur' }
                ]
            }
        }
    },
    components:{Operate},
    methods:{
        approval(){
            this.approvalStatus = true
        },
        approvalOk(){
            this.$refs['formApproval'].validate((valid) => {
                if (valid) {

                }
            })
        },
        approvalCancel(){
            
        },
        operateHandler(type){
            switch(type){
                case 1:
                    this.scanProjectStatus = true
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
                width: 50%;
                display: flex;
                height:30px;
                line-height: 30px;
                display: flex;
                justify-content: center;
                &>span:nth-child(2){
                    margin-left:10px;
                }
            }
        }
</style>


