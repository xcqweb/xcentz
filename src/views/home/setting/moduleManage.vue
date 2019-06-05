<template>
    <div class="moduleManage">
        <div class="top_operate">
            <i-input search enter-button v-model="searchKey" size="large" @on-search='search' @on-enter='search' style="width:300px;margin-right:30px;" placeholder="模块名,说明..." />
            <i-button size="large" icon="ios-add" type="primary" @click="addModuleStatus=true">新增权限模块</i-button> 
        </div>
        
        <i-table border stripe :loading='isLoading' :columns="columnsModule" :data="dataModule" v-show="dataModule.length"></i-table>
        <i-page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin:20px 0;' />

        <!-- 新增模块 -->
         <i-modal
            v-model="addModuleStatus"
            title="新增模块">
            <div slot="footer">
                <i-button @click="addModuleStatus = false">取消</i-button>
                <i-button type='primary' @click="addModule" :loading='loading'>确定</i-button>
            </div>
            <div class="center_g marginTop10"><p class="label_g">模块名称</p><i-input v-model="moduleAdd.moduleName" :maxlength=8 placeholder="请输入模块名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">模块说明</p><i-input type='textarea' autosize v-model="moduleAdd.moduleDirection" placeholder="请输入模块说明..." /></div>
        </i-modal>

        <!-- 编辑模块 -->
         <i-modal
            v-model="editModuleStatus"
            :title="modalTitle">
            <div slot="footer">
                <i-button @click="editModuleStatus = false">取消</i-button>
                <i-button type='primary' @click="moduleEditHandler" :loading='loading'>确定</i-button>
            </div>
            <div class="center_g marginTop10"><p class="label_g">模块名称</p><i-input v-model="moduleEdit.moduleName" :maxlength=8 placeholder="请输入模块名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">模块说明</p><i-input type='textarea' autosize v-model="moduleEdit.moduleDirection" placeholder="请输入模块说明..." /></div>
        </i-modal>
    </div>
</template>

<script>
import {addModule,queryModule,editModule,delModule} from '@api'
export default {
    data(){
        return{
            loading:false,
            modalTitle:'',
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
            columnsModule:Object.freeze([
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
                            h('i-button', {
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
                            h('i-button', {
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
            ])

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
        search:debounce(function(){
            this.getModuleList()
        },600,{leading:true}),
        
        getModuleList(){
            queryModule({key:this.searchKey,currentPage:this.currentPage,pageSize:this.pageSize}).then( (res) => {
                this.dataModule = res.data.moduleList
                this.totalCount = res.data.total
            })
        },
        addModule(){
            if(!this.moduleAdd.moduleName){
                this.$Message.warning({
                    content:'权限模块名称不能为空!',
                    duration:3
                })
                return
            }
            this.loading = true
            addModule({moduleName:this.moduleAdd.moduleName,direction:this.moduleAdd.moduleDirection}).then( (res) => {
                this.loading = false
                this.addModuleStatus = false
                this.moduleAdd = {
                    moduleName:'',
                    moduleDirection:''
                }
                this.getModuleList()
            })
        },
        //编辑模块
        edit (data) {
            this.modalTitle = `编辑模块 - ${data.row.ModuleName}`
            this.editModuleStatus = true
            this.moduleEdit = {
                moduleName:data.row.ModuleName,
                moduleDirection:data.row.Directions,
                id:data.row.ModuleId,
                index:data.index
            }
        },
        moduleEditHandler(){
            if(!this.moduleEdit.moduleName){
                this.$Message.warning({
                    content:'权限模块名称不能为空!',
                    duration:3
                })
                return
            }
            this.loading = true
            editModule({moduleName:this.moduleEdit.moduleName,direction:this.moduleEdit.moduleDirection,id:this.moduleEdit.id}).then( (res) => {
                this.loading = false
                this.editModuleStatus = false
                this.$set(this.dataModule[this.moduleEdit.index],'ModuleName',this.moduleEdit.moduleName)
                this.$set(this.dataModule[this.moduleEdit.index],'Directions',this.moduleEdit.moduleDirection)
            })
        },
        //编辑模块
        remove (data) {
            this.$Modal.confirm({
                title: '提示',
                loading:true,
                closable:true,
                content: `<p>确定要要删除 <span style='color:#2d8cf0;'>${data.row.ModuleName}</span> 模块?</p>`,
                onOk: () => {
                    delModule({id:data.row.ModuleId}).then( (res) => {
                        this.$Modal.remove()
                        this.dataModule.splice(data.index,1)
                    })
                }
            })
        },
    }
}
</script>




