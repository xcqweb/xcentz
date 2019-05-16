<template>
    <div class="moduleManage">
        <div class="top_operate">
            <Input search enter-button v-model="searchKey" size="large" @on-search='search' @on-enter='search' style="width:300px;margin-right:30px;" placeholder="模块名,说明..." />
            <Button size="large" icon="ios-add" type="primary" @click="addModuleStatus=true">新增权限模块</Button> 
        </div>
        
        <Table border stripe  size='large' :loading='isLoading' :columns="columnsModule" :data="dataModule" v-show="dataModule.length"></Table>
        <Page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin:20px 0;' />

        <!-- 新增模块 -->
         <Modal
            v-model="addModuleStatus"
            title="新增模块"
            @on-ok="addModule"
            @on-cancel="addModuleStatus=false">
            <div class="center_g marginTop10"><p class="label_g">模块名称</p><Input v-model="moduleAdd.moduleName" :maxlength=8 placeholder="请输入模块名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">模块说明</p><Input v-model="moduleAdd.moduleDirection" placeholder="请输入模块说明..." /></div>
        </Modal>

        <!-- 编辑模块 -->
         <Modal
            v-model="editModuleStatus"
            title="编辑模块"
            @on-ok="moduleEditHandler"
            @on-cancel="editModuleStatus=false">
            <div class="center_g marginTop10"><p class="label_g">模块名称</p><Input v-model="moduleEdit.moduleName" :maxlength=8 placeholder="请输入模块名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">模块说明</p><Input v-model="moduleEdit.moduleDirection" placeholder="请输入模块说明..." /></div>
        </Modal>
    </div>
</template>

<script>
import {addModule,queryModule,editModule,delModule} from '@api'
export default {
    data(){
        return{
            addModuleStatus:false,
            searchKey:'',
            moduleAdd:{
                moduleName:'',
                moduleDirection:''
            },
            editModuleStatus:false,
            moduleEdit:{
                moduleName:'',
                moduleDirection:'',
                id:'',
                index:''
            },
            isLoading:false,
            totalCount:0,
            currentPage:1,
            pageSize:10,
            dataModule:[],
            columnsModule:[
                {
                        title: '序号',
                        width: 80,
                        type: 'index',
                        render: (h, params) => {
                            return h('div', [
                                h('Icon', {
                                    props: {
                                        type: 'person'
                                    }
                                }),
                                h('strong', params.row.name)
                            ]);
                        }
                    },
                    {
                        title: '模块名称',
                        key: 'ModuleName'
                    },
                     {
                        title: '模块说明',
                        key: 'Directions'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon:'md-create'
                                    },
                                    style: {
                                        margin: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.edit(params)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        icon:'ios-trash-outline'
                                    },
                                    style: {
                                        margin: '8px',
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
            ]

        }
    },
    activated(){
        this.getModuleList()
    },
    methods:{
        goPage(page){
            this.currentPage = page
            this.getModuleList()
        },
        //查询
        search(){
            this.getModuleList()
        },
        getModuleList(){
            queryModule({key:this.searchKey,currentPage:this.currentPage,pageSize:this.pageSize}).then( (res) => {
                this.dataModule = res.data.moduleList
                this.totalCount = res.data.total
            })
        },
        addModule(){
            addModule({moduleName:this.moduleAdd.moduleName,direction:this.moduleAdd.moduleDirection}).then( (res) => {
                this.moduleAdd = {
                    moduleName:'',
                    moduleDirection:''
                }
                this.getModuleList()
            })
        },
        //编辑模块
        edit (data) {
            this.editModuleStatus = true
            this.moduleEdit = {
                moduleName:data.row.ModuleName,
                moduleDirection:data.row.Directions,
                id:data.row.ModuleId,
                index:data.index
            }
        },
        moduleEditHandler(){
            editModule({moduleName:this.moduleEdit.moduleName,direction:this.moduleEdit.moduleDirection,id:this.moduleEdit.id}).then( (res) => {
                this.$set(this.dataModule[this.moduleEdit.index],'ModuleName',this.moduleEdit.moduleName)
                this.$set(this.dataModule[this.moduleEdit.index],'Directions',this.moduleEdit.moduleDirection)
            })
        },
        //编辑模块
        remove (data) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确定要要删除该角色?</p>',
                onOk: () => {
                    delModule({id:data.row.ModuleId}).then( (res) => {
                        this.dataModule.splice(data.index,1)
                    })
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .moduleManage{
        
    }
</style>


