<template>
    <div class="projectCreate">
        <!-- 项目立项 -->
        <div>
            <i-divider>项目立项</i-divider>
            <div style="text-align:left;">
                项目名称:<i-input ref="input" v-model="projectName" style="width:260px;padding-left:10px;" />
            </div>
            <div class="project_con">
                <div class="pro_item">
                    <span class="pro_label">品类:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="product">
                        <i-option v-for="(option, index) in products" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item">
                    <span class="pro_label">供应商:</span> 
                    <i-select
                        clearable
                        :disabled='product?false:true'
                        style="width:160px;"
                        v-model="supplier">
                        <i-option v-for="(option, index) in suppliers" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item">
                    <span class="pro_label">子品类:</span> 
                    <i-select 
                        clearable
                        :disabled='supplier?false:true'
                        style="width:160px;"
                        v-model="productChild">
                        <i-option v-for="(option, index) in productChilds" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item">
                    <span class="pro_label">销售状态:</span> 
                    <i-select
                        clearable
                        style="width:160px;"
                        v-model="sellStatu">
                        <i-option v-for="(option, index) in sellStatus" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item">
                    <span class="pro_label">包装:</span> 
                    <i-select
                        clearable
                        style="width:160px;"
                        v-model="pack">
                        <i-option v-for="(option, index) in packs" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item" v-show="product==='cable'">
                    <span class="pro_label">线材长度:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="lineLength">
                        <i-option v-for="(option, index) in lineLengths" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item" v-show="product==='cable'">
                    <span class="pro_label">端子材质:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="portMaterial">
                        <i-option v-for="(option, index) in portMaterials" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item" v-show="product==='cable'">
                    <span class="pro_label">外被材质:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="outMaterial">
                        <i-option v-for="(option, index) in outMaterials" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item">
                    <span class="pro_label">颜色:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="color">
                        <i-option v-for="(option, index) in colors" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item" v-show="product==='charger'">
                    <span class="pro_label">口数:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="port">
                        <i-option v-for="(option, index) in ports" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item" v-show="product==='charger'">
                    <span class="pro_label">充电技术:</span> 
                    <i-select 
                        clearable   
                        style="width:160px;"
                        v-model="charge">
                        <i-option v-for="(option, index) in charges" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item" v-show="product==='charger'">
                    <span class="pro_label">电池容量:</span> 
                    <i-select 
                        clearable
                        style="width:160px;"
                        v-model="battery">
                        <i-option v-for="(option, index) in batterys" :value="option.value" :key="index">{{option.label}}</i-option>
                    </i-select>
                </div>

                <div class="pro_item">
                    <span class="pro_label">备注:</span>
                    <i-input type='textarea' autosize style="width:320px;"></i-input>
                </div>

                <div class="project_top">
                    <i-button style="width:160px;" type="primary" @click="addProject">确认立项</i-button> 
                </div>
            </div>
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
        
        <!-- 产品库 -->
        <div class="productLibrary">
            <i-divider>产品库</i-divider>
            
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            projectName:'',
            product:'',
            products:[
                {value: 'cable',label: 'V-cable'},
                {value: 'charger',label: 'V-Charger'},
                {value: 'protection',label: 'V-Protection'},
            ],
            supplier:'',
            suppliers:[
                {value: '炬神',label: '炬神'},
            ],
            productChild:'',
            productChilds:[
                {value: '移动电源',label: '移动电源'},
            ],
            sellStatu:'',
            sellStatus:[
                {value: '项目立项',label: '项目立项'},
            ],
            pack:'',
            packs:[
                {value: '1pack',label: '1pack'},
            ],
            lineLength:'',
            lineLengths:[
                {value: '3FT',label: '3FT'},
            ],
            portMaterial:'',
            portMaterials:[
                {value: '锌合金',label: '锌合金'},
            ],
            outMaterial:'',
            outMaterials:[
                {value: '编织',label: '编织'},
            ],
            color:'',
            colors:[
                {value: '黑色',label: '黑色'},
            ],
            port:'',
            ports:[
                {value: '四口',label: '四口'},
            ],
            charge:'',
            charges:[
                {value: '四口',label: '四口'},
            ],
            battery:'',
            batterys:[
                {value: '四口',label: '四口'},
            ]
        }
    },
    watch:{
        product(){
            this.supplier = ''
            this.productChild = ''
        },
        supplier(){
            this.productChild = ''
        },
        projectName(){
            this.$refs.input.$el.classList.remove('ivu-form-item-error')
        }
    },
    methods:{
        addProject(){
            
            if(!this.projectName){
                this.$refs.input.$el.classList.add('ivu-form-item-error')
                this.$Message.warning({
                    content:'项目名称不能为空!'
                })
                return
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
        .project_con{
            margin: 30px 0 100px 0;
            text-align: left;
            display: flex;
            flex-wrap: wrap;
            .pro_item{
                margin-left: 20px;
                margin-top: 20px;
                .pro_label{
                    margin-right: 10px;
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
        .productLibrary{
            margin-top: 100px;
        }
    }
</style>


