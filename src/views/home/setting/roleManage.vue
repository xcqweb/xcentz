<template>
    <div class="roleManage">
        <div class="top_operate">
            <Input search enter-button v-model='searchKey' size="large" style="width:300px;margin-right:30px;" @on-search='search' @on-enter='search' placeholder="角色查询" />
            <Button size="large" icon="ios-add" type="primary" @click="addRoleStatus=true">新增角色</Button> 
        </div>

        <Table border stripe  size='large' :loading='isLoading' :columns="columnsRole" :data="dataRole" v-show="dataRole.length"></Table>
        <Page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin:20px 0;' />
        <!-- 新增角色 -->
         <Modal
            v-model="addRoleStatus"
            title="新增角色"
            @on-ok="addRole"
            @on-cancel="addRoleStatus=false">
            <div class="center_g marginTop10"><p class="label_g">角色名称</p><Input v-model="roleAdd.roleName" placeholder="请输入角色名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">角色说明</p><Input v-model="roleAdd.roleDirection" placeholder="请输入角色说明..." /></div>
        </Modal>

        <!-- 编辑角色 -->
         <Modal
            v-model="editRoleStatus"
            title="编辑角色"
            @on-ok="editRole"
            @on-cancel="editRoleStatus=false">
            <div class="center_g marginTop10"><p class="label_g">角色名称</p><Input v-model="roleEdit.roleName" placeholder="请输入角色名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">角色说明</p><Input v-model="roleEdit.roleDirection" placeholder="请输入角色说明..." /></div>
        </Modal>

        <!-- 菜单权限分配 -->
         <Modal
            v-model="menuAuthStatus"
            title="菜单权限分配"
            width='600'
            @on-ok="menuAuthHandler"
            @on-cancel="menuAuthStatus=false">
            <Tree :data="treeData" show-checkbox :check-strictly='checkStrictly' multiple @on-check-change='checkedChange' ref='MenuTree'></Tree>
        </Modal>

        <!-- 模块权限分配 -->
         <Modal
            v-model="moduleAuthStatus"
            title="模块权限分配"
            width='800'
            @on-ok="moduleAuthHandler"
            @on-cancel="moduleAuthStatus=false">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    size='large'
                    @click.prevent.native="handleCheckAll">{{checkAll?'取消全选':'全选'}}</Checkbox>
            </div>
            <CheckboxGroup v-model="checkAllGroup" @on-change="ModulecheckedChange">
                <Checkbox size='large' v-for="item in moduleList" :label="item.ModuleName" :key="item.ModuleId"></Checkbox>
            </CheckboxGroup>
        </Modal>
    </div>
</template>

<script>
import {roleList,addRole,editRole,delRole,queryAuthMenu,updateAuthMenu,queryAuthModule,configAuthModule} from '@api'
export default {
    data(){
        return{
            indeterminate:false,
            checkAll:false,
            checkAllGroup:[],
            moduleList:[],
            pageSize:10,
            totalCount:0,
            currentPage:1,
            menuAuthStatus:false,
            searchKey:'',
            isLoading:false,
            addRoleStatus:false,
            editRoleStatus:false,
            checkStrictly:false,
            roleAdd:{
                roleName:'',
                roleDirection:''
            },
            roleEdit:{
                roleName:'',
                roleDirection:'',
                id:'',
                index:''
            },
            updateAuthMenuStr:'',
            updateAuthModuleStr:'',
            currentRoleId:'',
            moduleAuthStatus:false,
            treeDataModule:[],
            treeData:[],
            columnsRole: [
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
                        title: '角色名称',
                        key: 'RoleName',
                        // width:120,
                    },
                     {
                        title: '角色说明',
                        key: 'Directions',
                        // width:120,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width:500,
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
                                        type: 'primary',
                                        icon:'ios-create-outline'
                                    },
                                    style: {
                                        margin: '8px'
                                    },
                                    on: {
                                        click: () => {
                                            this.menuAuthAssign(params)
                                        }
                                    }
                                }, '菜单权限分配'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        icon:'ios-create-outline'
                                    },
                                    style: {
                                        margin: '8px',
                                    },
                                    on: {
                                        click: () => {
                                            this.moduleAuthAssign(params)
                                        }
                                    }
                                }, '模块权限分配'),
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
                ],
                dataRole: []
        }
    },
    activated(){
        this.getRoleList()
        
    },
    methods:{
        //模块权限全选
        handleCheckAll(){
            this.checkAll = !this.checkAll
            this.checkAllGroup = []
            this.updateAuthModuleStr = ''
            if(!this.checkAll)return
            for(let item of this.moduleList){
                this.checkAllGroup.push(item.ModuleName)
            }
            this.getSelectedModule()
        },
        //查询权限菜单
        queryAuthMenu(roleId){
            queryAuthMenu({roleId}).then( (res) => {
             this.treeData = res.data.menuList
         })
        },
        //搜索
        search(){
            this.getRoleList()
        },
        //新增角色
        addRole(){
            addRole({roleName:this.roleAdd.roleName,direction:this.roleAdd.roleDirection}).then( (res) => {
                this.roleAdd = {
                    roleName:'',
                    roleDirection:''
                }
                this.getRoleList()
            })
        },
        //编辑角色
        editRole(){
            editRole({roleName:this.roleEdit.roleName,direction:this.roleEdit.roleDirection,id:this.roleEdit.id}).then( (res) => {
                this.$set(this.dataRole[this.roleEdit.index],'RoleName',this.roleEdit.roleName)
                this.$set(this.dataRole[this.roleEdit.index],'Directions',this.roleEdit.roleDirection)
            })
        },
        //获取角色列表
        getRoleList(key){
            this.isLoading = true
            roleList({key:this.searchKey,currentPage:this.currentPage,pageSize:this.pageSize}).then( (res) => {
                this.isLoading = false
                this.dataRole = res.data.roleList
                this.totalCount = res.data.total
            },error => {
                this.isLoading = false
            })
        },
        //编辑角色
        edit (data) {
            this.editRoleStatus = true
            this.roleEdit = {
                roleName:data.row.RoleName,
                roleDirection:data.row.Directions,
                id:data.row.RoleId,
                index:data.index
            }
        },
        //删除角色
        remove (data) {
            console.log(data)
            this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要要删除该角色?</p>',
                    onOk: () => {
                        delRole({id:data.row.RoleId}).then( (res) => {
                            this.dataRole.splice(data.index,1)
                        })
                    }
            })
        },
        //模块权限分配
        moduleAuthAssign(data){
            this.checkAllGroup = []
            this.checkAll = false
            this.moduleAuthStatus = true
            this.currentRoleId = data.row.RoleId
            queryAuthModule({roleId:data.row.RoleId,isAdmin:true}).then( (res) => {
                this.moduleList = res.data.muduleList
                for(let item of this.moduleList){
                    if(item.selected){
                        this.checkAllGroup.push(item.ModuleName)
                    }
                }
                this.ModulecheckedChange()
            })
        },
        moduleAuthHandler(){
            configAuthModule({str:this.updateAuthModuleStr,roleId:this.currentRoleId}).then( (res) => {

            })
        },
        //菜单权限分配
        menuAuthAssign({row:{RoleId}}){
            this.menuAuthStatus = true
            this.checkStrictly = true
            this.currentRoleId = RoleId
            this.queryAuthMenu(RoleId)
        },
        ModulecheckedChange(){
            let len = this.moduleList.length
            if(this.checkAllGroup.length===len){
                this.checkAll = true
            }else{
                this.checkAll = false
            }
            this.getSelectedModule()
        },
        getSelectedModule(){
            let str = ''
            let len = this.checkAllGroup.length - 1 
            for(let [index,key] of this.checkAllGroup.entries()){
                for(let item of this.moduleList){
                    if(item.ModuleName === key){
                        str += `(${this.currentRoleId},${item.ModuleId})${index===len?'':','}`
                    }
                }
            }
            this.updateAuthModuleStr = str
            console.log(str)
        },
        checkedChange(){
            let checkedArr = this.$refs.MenuTree.getCheckedAndIndeterminateNodes()
            let len = checkedArr.length-1
            let str = ''
            for(let [index,item] of checkedArr.entries()){
                str += `(${this.currentRoleId},${item.id})${index===len?'':','}`
            }
            this.updateAuthMenuStr = str

            this.checkStrictly = false
            console.log(str)
            
        },
        //确定 == 菜单权限分配
        menuAuthHandler(){
            updateAuthMenu({str:this.updateAuthMenuStr,roleId:this.currentRoleId}).then( (res) => {
                this.$root.eventBus.$emit('getMenu')
            })
        },
        //分页
        goPage(page){
            this.currentPage = page
            this.getRoleList()
        }
    }
}
</script>

<style lang="less" scoped>
.roleManage{
    
}
</style>


