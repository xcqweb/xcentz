<template>

    <!-- 项目立项 -->
    <div class="projectCreate">
        <div style="text-align:left;">
          <i-button type='primary' @click="addProjectStatus = true;modalTitle='新增项目'" icon='ios-add'>新增项目</i-button>  
        </div>
        
        <!-- 新增或编辑项目 -->
        <i-modal
            v-model="addProjectStatus"
            width='700'
            :styles="{marginBottom:'60px'}"
            :title="modalTitle">
            <div slot="footer">
                <i-button @click="addProjectStatus = false" size='large' style="margin-right:20px;">取消</i-button>
                <i-button type='primary' @click="addProjectHandler('formProject')" :loading='loading' size='large'>确定</i-button>
            </div>
            <i-divider>产品信息录入</i-divider>
            <i-form ref="formProject" :model="modelProject" :rules="ruleProject" :label-width="120" style="display:flex;flex-direction:column;align-items:center;margin:20px 0;">
                <!-- <i-form-item label="项目名称" prop="projectName" class="pro_item">
                    <i-input ref="input" v-model="modelProject.projectName" />
                </i-form-item> -->
                <i-form-item label="品类" prop="product" class="pro_item">
                    <i-select 
                        clearable
                        v-model="modelProject.product">
                        <i-option v-for="option in products" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item >
                
                <i-form-item label="子品类" prop="productChild" class="pro_item">
                    <i-select 
                        clearable
                        :disabled='modelProject.product?false:true'
                        v-model="modelProject.productChild">
                        <i-option v-for="option in productChilds" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="供应商" prop="supplier" class="pro_item">
                    <i-select
                        clearable
                        :disabled='modelProject.productChild?false:true'
                        v-model="modelProject.supplier">
                        <i-option v-for="option in suppliers" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                

                <i-form-item label="销售状态" prop="sellStatu" class="pro_item">
                    <i-select
                        clearable
                        disabled 
                        v-model="modelProject.sellStatu">
                        <i-option v-for="option in sellStatus" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="包装" prop="pack" class="pro_item">
                    <i-select
                        clearable
                        v-model="modelProject.pack">
                        <i-option v-for="option in packs" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="线材长度" prop="lineLength" class="pro_item" v-if="modelProject.product==='Cable'">
                    <i-select 
                        clearable
                        v-model="modelProject.lineLength">
                        <i-option v-for="option in lineLengths" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="端子材质" prop="portMaterial" class="pro_item" v-if="modelProject.product==='Cable'">
                    <i-select 
                        clearable
                        v-model="modelProject.portMaterial">
                        <i-option v-for="option in portMaterials" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="外被材质" prop="outMaterial" class="pro_item" v-if="modelProject.product==='Cable'">
                    <i-select 
                        clearable
                        v-model="modelProject.outMaterial">
                        <i-option v-for="option in outMaterials" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="颜色" prop="color" class="pro_item">
                    <i-select 
                        clearable
                        v-model="modelProject.color">
                        <i-option v-for="option in colors" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="口数" prop="port" class="pro_item" v-if="modelProject.product==='Charger'">
                    <i-select 
                        clearable
                        v-model="modelProject.port">
                        <i-option v-for="option in ports" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="充电技术" prop="charge" class="pro_item" v-if="modelProject.product==='Charger'">
                    <i-select 
                        clearable   
                        v-model="modelProject.charge">
                        <i-option v-for="option in charges" :value="option" :key="option">{{option}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="电池容量(mAh)" prop="battery" class="pro_item" v-if="modelProject.product==='Charger'">
                    <!-- <i-select 
                        clearable
                        v-model="modelProject.battery">
                        <i-option v-for="option in batterys" :value="option" :key="option">{{option}}</i-option>
                    </i-select> -->
                    <i-input v-model="modelProject.battery" clearable placeholder="请输入电池容量"></i-input>
                </i-form-item>

                <i-form-item label="备注" prop="remarks" class="pro_item">
                    <i-input type='textarea' v-model="modelProject.remarks" clearable placeholder="请输入备注" :autosize='{minRows: 6}'></i-input>
                </i-form-item>

                <i-divider>选择审批相关人</i-divider>

                <i-form-item label="项目经理" prop="projector" class="pro_item">
                    <i-select 
                        clearable   
                        v-model="modelProject.projector">
                        <i-option v-for="option in roles[0]" :value="option.UserId" :key="option.UserId">{{option.Cname}}</i-option>
                    </i-select>
                </i-form-item>

                <i-form-item label="运营" prop="operator" class="pro_item">
                    <i-select 
                        clearable   
                        v-model="modelProject.operator">
                        <i-option v-for="option in roles[1]" :value="option.UserId" :key="option.UserId">{{option.Cname}}</i-option>
                    </i-select>
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
                    <li>
                        <span>创建人:</span>
                        <span>xxx</span>
                    </li>
                    <li>
                        <span>创建时间:</span>
                        <span>{{scanProjectInfo.CreateTime}}</span>
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
                    <li>
                        <span>项目经理审批:</span>
                        <span>等待审批</span>
                    </li>
                    <li>
                        <span>运营审批:</span>
                        <span>等待审批</span>
                    </li>
                </ul>
            </div>
        </i-modal>

        
        <!-- 项目审批流程 -->
        <div style="margin-top:20px;">
            <i-divider>项目审批流程</i-divider>
            <div class="flow">
                <div class="flow_item" v-for="item in projects">
                    <span>项目一</span>
                    <i-steps :current="item.CurrentNode+1">
                        <i-step title="项目立项" :content="item.ProductorRemark"></i-step>
                        <i-step title="项目经理审批" :content="item.ProjectorRemark"></i-step>
                        <i-step title="运营审批" :content="item.OperatorRemark"></i-step>
                    </i-steps>
                    <div class="status">
                        <i-circle v-if="item.ProjectStatus===3" :size="36" :percent="100" :stroke-width="8">
                            <i-icon type="ios-checkmark" size="36" style="color:#ff5500"></i-icon>
                        </i-circle>

                        <i-circle v-else :size="36" :percent="item.CurrentNode ? item.CurrentNode===1?66.6:100:33.3" :stroke-width="8">
                            <i-icon v-if="item.CurrentNode===2" type="ios-checkmark" size="36" :style="{color:item.CurrentNode===2?'#5cb85c':'#5cb85c'}"></i-icon>
                        </i-circle>
                        <span style="margin-left:6px;">{{transformStatus(item.ProjectStatus)}}</span>
                    </div>
                    <div class="operate">
                        <Operate @operateHandler='operateHandler' :item='item'></Operate>
                    </div>
                </div>
                
                <!-- <div class="flow_item">
                    <span>项目二</span>
                        <i-steps :current="3" status="finish">
                        <i-step title="项目立项" content="项目立项"></i-step>
                        <i-step title="项目经理审批" content="项目经理审批"></i-step>
                        <i-step title="运营审批" content="不符合要求"></i-step>
                        <i-step title="项目审批通过" content="项目审批通过"></i-step>
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
                    <span>项目三</span>
                        <i-steps :current="2" status="error">
                        <i-step title="项目立项" content="项目立项"></i-step>
                        <i-step title="项目经理审批" content="项目经理审批"></i-step>
                        <i-step title="运营审批" content="不符合要求"></i-step>
                    </i-steps>
                    <div class="status">
                        <i-circle :size="36" :percent="100" :stroke-width="8" stroke-color="#ed4014">
                            <i-icon v-if="100" type="ios-close" size="36" style="color:#ed4014"></i-icon>
                        </i-circle>
                        <span style="margin-left:6px;">已取消</span>
                    </div>
                    <div class="operate">
                        <Operate @operateHandler='operateHandler'></Operate>
                    </div>
                </div> -->


            </div>
        </div>
    </div>
</template>

<script>
import {product,productChild,supplier,sellStatus,packs,lineLengths,portMaterials,outMaterials,colors,ports,charges,batterys} from './products.json'
import Operate from './components/operatePop'
import {queryProject,addProject,queryRoleUser} from '@api/project'

export default {
    data(){
        return{
            modalTitle:'',
            scanProjectStatus:false,
            loading:false,
            addProjectStatus:false,
            projects:[],
            roles:[],
            scanProjectInfo:{},
            modelProject:{
                projectName:'',
                product:'',
                supplier:'',
                productChild:'',
                sellStatu:'项目立项',
                pack:'1pack',
                lineLength:'',
                portMaterial:'',
                outMaterial:'',
                color:'',
                port:'',
                charge:'',
                battery:'',
                remarks:'',
                projector:'',
                opertator:''
            },
            ruleProject:Object.freeze({
                projectName:[
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                product:[
                    { required: true, message: '请选择品类', trigger: 'blur' }
                ],
                supplier:[
                    { required: true, message: '请选择供应商', trigger: 'blur' }
                ],
                productChild:[
                    { required: true, message: '请选择子品类', trigger: 'blur' }
                ],
                sellStatu:[
                    { required: true, message: '请选择销售状态', trigger: 'blur' }
                ],
                pack:[
                    { required: true, message: '请选择包装类型', trigger: 'blur' }
                ],
                lineLength:[
                    { required: true, message: '请选择线材长度', trigger: 'blur' }
                ],
                portMaterial:[
                    { required: true, message: '请选择端子材质', trigger: 'blur' }
                ],
                outMaterial:[
                    { required: true, message: '请选择外被材质', trigger: 'blur' }
                ],
                color:[
                    { required: true, message: '请选择颜色', trigger: 'blur' }
                ],
                port:[
                    { required: true, message: '请选择充电口数', trigger: 'blur' }
                ],
                charge:[
                    { required: true, message: '请选择充电技术', trigger: 'blur' }
                ],
                battery:[
                    { required: true, message: '请选择电池容量', trigger: 'blur' }
                ],

                projector:[
                    { required: true, message: '请选择项目经理', trigger: 'blur' }
                ],

                operator:[
                    { required: true, message: '请选择运营', trigger: 'blur' }
                ],
            })
        }
    },
    components:{Operate},
    computed:{
        products(){
            return Object.freeze(product)
        },
        productChilds(){
            return Object.freeze(productChild[this.modelProject.product])
        },
        suppliers(){
            return Object.freeze(supplier[this.modelProject.productChild])
        },
        sellStatus(){
            return Object.freeze(sellStatus)
        },
        packs(){
            return Object.freeze(packs)
        },
        lineLengths(){
            return Object.freeze(lineLengths)
        },
        portMaterials(){
            return Object.freeze(portMaterials)
        },
        outMaterials(){
            return Object.freeze(outMaterials)
        },
        colors(){
            return Object.freeze(colors)
        },
        ports(){
            return Object.freeze(ports)
        },
        charges(){
            return Object.freeze(charges)
        },
        batterys(){
            return Object.freeze(batterys)
        }
    },
    watch:{
        'modelProject.product'(){
            this.modelProject.supplier = ''
            this.modelProject.productChild = ''
        },
        'modelProject.productChild'(){
            this.modelProject.supplier = ''
        }
    },
    activated(){
        this.queryProject()
        this.queryRoleUser()
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
        //查询角色用户
        queryRoleUser(){
            queryRoleUser({roles:'10,2'}).then( (res) => {
                this.roles = Object.freeze(res.data.roles)
            })
        },
        queryProject(){
            queryProject().then( (res) => {
                console.log(res.data.items)
                this.projects = Object.freeze(res.data.items)
            })
        },
        addProjectHandler(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let params = {
                        status:2,
                        curNode:0,
                        userId:this.userInfo.UserId,
                        projectorId:this.modelProject.projector,
                        operatorId:this.modelProject.opertator,
                        remarks:this.modelProject.remarks,
                        proInfo:JSON.stringify(this.modelProject)
                    }
                    console.log(params)
                    // return
                    addProject(params).then( () => {
                        this.queryProject()
                        this.addProjectStatus = false
                        this.$refs['formProject'].resetFields();
                    })
                }
            })
        },
        operateHandler(type,item){
            switch(type){
                case 1:
                    this.scanProjectStatus = true
                    this.scanProjectInfo = {...this.scanProjectInfo,...item}
                    this.scanProjectInfo.productionInfo = []
                    let list = JSON.parse(item.ProductionInfo)
                    for(let key in list){
                        this.scanProjectInfo.productionInfo.push({
                            name:key,
                            value:list[key]
                        })
                        
                    }
                    console.log(list)
                break;

                case 2:
                    this.modalTitle = '编辑项目'
                    this.addProjectStatus = true
                break;
            }
        }
        
    }
}
</script>

<style lang="less" scoped>
    .projectCreate{
        .project_top{
            width: 100%;
            text-align: right;
            margin-right: 10px;
            margin-top: 60px;
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
            height:36px;
            line-height: 36px;
            display: flex;
            justify-content: center;
             &>span:nth-child(1){
                flex: 1;
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
    
    .pro_item{
        width: 90% !important;
    }
</style>


