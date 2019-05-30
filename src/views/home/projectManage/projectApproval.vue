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
                <!-- <i-button type="text" slot="extra" icon="ios-loop-strong">审批</i-button> -->
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
                    <i-steps :current="1">
                        <i-step title="项目立项" content="项目立项"></i-step>
                        <i-step title="项目经理审批" content="项目经理审批"></i-step>
                        <i-step title="运营审批" content="运营审批"></i-step>
                        <i-step title="项目审批通过" content="项目审批通过"></i-step>
                    </i-steps> 
                </div>
                
                <div class="flow_item">
                    <span>项目二</span>
                    <i-steps :current="2" status="error">
                        <i-step title="项目立项" content="项目立项"></i-step>
                        <i-step title="项目经理审批" content="项目经理审批"></i-step>
                        <i-step title="运营审批" content="不符合要求"></i-step>
                        <i-step title="项目审批通过" content="项目审批通过"></i-step>
                    </i-steps>
                </div>
            </div>
        </div>

        <!-- 审核 -->
        <i-modal
            v-model="approvalStatus"
            title="项目审批">
            <div slot="footer">
                <i-button @click="approvalStatus = false">取消</i-button>
                <i-button type='error' @click="approvalCancel">不通过</i-button>
                <i-button type='primary' @click="approvalOk">通过</i-button>
            </div>
            <i-form  ref="formApproval" :model="formsPro" :rules="rulesPro" :label-width="120" v-if="userInfo.RoleId===24 || userInfo.RoleId===10">
                <i-form-item label="宇龙编码" prop="ylCode">
                    <i-input v-model="formsPro.ylCode" placeholder="请输入宇龙编码"></i-input>
                </i-form-item>

                <i-form-item label="项目编码" prop="projectName">
                    <i-input v-model="formsPro.projectName" placeholder="请输入项目编码"></i-input>
                </i-form-item>

                <i-form-item label="备注" prop="message">
                    <i-input type='textarea' autosize v-model="formsPro.message" placeholder="请输入备注"></i-input>
                </i-form-item>
            </i-form>

            <!-- 运营 -->
            <i-form  ref="formApproval" :model="formsOp" :rules="rulesOp" :label-width="120" v-if="userInfo.RoleId===24 || userInfo.RoleId===2">
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
                    <i-input type='textarea' autosize v-model="formsOp.message" placeholder="请输入备注"></i-input>
                </i-form-item>
            </i-form>
        </i-modal>
    </div>
</template>

<script>
export default {
    data(){
        return{
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
                    { required: true, message: '请输入项目编码', trigger: 'blur' }
                ],
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
                ],
            }
        }
    },
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
            
        }
    }
}
</script>

<style lang="less" scoped>
    .projectApproval{
        .approval{
            display: flex;
            flex-wrap: wrap;
            .approval_item{
                display: flex;
                flex-wrap: wrap;
                &>li{
                    width: 50%;
                    display: flex;
                    &>span:nth-child(2){
                        margin-left:10px;
                    }
                }
            }
        }
        .flow{
            margin-top: 50px;
            .flow_item{
                display: flex;
                &>span{
                    flex-basis: 120px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }
</style>


