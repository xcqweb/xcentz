<template>
    <div class="roleManage">
        <div class="top_operate">
            <i-input search enter-button v-model='searchKey' size="large" style="width:300px;margin-right:30px;" @on-search='search' @on-enter='search' placeholder="角色查询" />
            <i-button size="large" icon="ios-add" type="primary" @click="addRoleStatus=true">新增角色</i-button> 
        </div>

        <i-table border stripe  size='large' :loading='isLoading' :columns="columnsRole" :data="dataRole" v-show="dataRole.length"></i-table>
        <i-page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin:20px 0;' />
        <!-- 新增角色 -->
         <i-modal
            v-model="addRoleStatus"
            title="新增角色">
            <div slot="footer">
                <i-button @click="addRoleStatus = false">取消</i-button>
                <i-button type='primary' @click="addRole" :loading='loading'>确定</i-button>
            </div>
            <div class="center_g marginTop10"><p class="label_g">角色名称</p><i-input v-model="roleAdd.roleName" placeholder="请输入角色名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">角色说明</p><i-input type='textarea' autosize v-model="roleAdd.roleDirection" placeholder="请输入角色说明..." /></div>
        </i-modal>

        <!-- 编辑角色 -->
         <i-modal
            v-model="editRoleStatus"
            :title="modalTitle">
            <div slot="footer">
                <i-button @click="editRoleStatus = false">取消</i-button>
                <i-button type='primary' @click="editRole" :loading='loading'>确定</i-button>
            </div>
            <div class="center_g marginTop10"><p class="label_g">角色名称</p><i-input v-model="roleEdit.roleName" placeholder="请输入角色名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">角色说明</p><i-input type='textarea' autosize v-model="roleEdit.roleDirection" placeholder="请输入角色说明..." /></div>
        </i-modal>

        <!-- 菜单权限分配 -->
         <i-modal
            v-model="menuAuthStatus"
            :title="modalTitle"
            width='600'>
            <div slot="footer">
                <i-button @click="menuAuthStatus = false">取消</i-button>
                <i-button type='primary' @click="menuAuthHandler" :loading='loading'>确定</i-button>
            </div>
            <i-tree :data="treeData" show-checkbox multiple @on-check-change='checkedChange' ref='MenuTree'></i-tree>
        </i-modal>

        <!-- 模块权限分配 -->
         <i-modal
            v-model="moduleAuthStatus"
            :title="modalTitle"
            width='800'>
            <div slot="footer">
                <i-button @click="moduleAuthStatus = false">取消</i-button>
                <i-button type='primary' @click="moduleAuthHandler" :loading='loading'>确定</i-button>
            </div>
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <i-checkbox
                    :indeterminate="indeterminate"
                    :value="checkAll"
                    size='large'
                    @click.prevent.native="handleCheckAll">{{checkAll?'取消全选':'全选'}}</i-checkbox>
            </div>
            <i-checkbox-group v-model="checkAllGroup" @on-change="ModulecheckedChange">
                <i-checkbox size='large' v-for="item in moduleList" :label="item.ModuleName" :key="item.ModuleId"></i-checkbox>
            </i-checkbox-group>
        </i-modal>
    </div>
</template>

<script>
import {roleList,addRole,editRole,delRole,queryAuthMenu,updateAuthMenu,queryAuthModule,configAuthModule} from '@api'
export default {
    data(){
        return{
            loading:false,
            modalTitle:'',
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
            treeData:[],
            columnsRole: Object.freeze([
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
                                h('i-button', {
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
                ]),
                dataRole: []
        }
    },
    activated(){
        this.getRoleList()
        
    },
    beforeDestroy(){
        this.$root.eventBus.$off('getMenu')
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
            let _this = this
            queryAuthMenu({roleId}).then( (res) => {
                this.treeData = Object.freeze(res.data.menuList)

                function everyOne(item){
                    for(let key of item){
                        if(key.children && key.children.length>0){
                            delete key.checked
                            everyOne(key.children)
                        }
                    }
                }
                everyOne(this.treeData)
            })
        },
        //搜索
        search:debounce(function(){
            this.getRoleList()
        },600,{leading:true}),
        //新增角色
        addRole(){
            this.addRoleStatus = true
            if(!this.roleAdd.roleName || !this.roleAdd.roleDirection){
                this.$Message.warning({
                    content:'角色名和角色说明不能为空!',
                    duration:3
                })
                return
            }
            this.loading = true
            addRole({roleName:this.roleAdd.roleName,direction:this.roleAdd.roleDirection}).then( (res) => {
                this.loading = false
                this.addRoleStatus = false
                this.roleAdd = {
                    roleName:'',
                    roleDirection:''
                }
                this.getRoleList()
            })
        },
        //编辑角色
        editRole(){
            if(!this.roleEdit.roleName || !this.roleEdit.roleDirection){
                this.$Message.warning({
                    content:'角色名和角色说明不能为空!',
                    duration:3
                })
                return
            }
            this.loading = true
            editRole({roleName:this.roleEdit.roleName,direction:this.roleEdit.roleDirection,id:this.roleEdit.id}).then( (res) => {
                this.loading = false
                this.editRoleStatus = false
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
            this.modalTitle = `编辑角色 - ${data.row.RoleName}`
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
                loading:true,
                content: `<p>确定要要删除 <span style='color:#2d8cf0;'>${data.row.RoleName}</span> 角色?</p>`,
                onOk: () => {
                    delRole({id:data.row.RoleId}).then( (res) => {
                        this.$Modal.remove()
                        this.dataRole.splice(data.index,1)
                    })
                }
            })
        },
        //模块权限分配
        moduleAuthAssign(data){
            this.modalTitle = `模块权限分配 - ${data.row.RoleName}`
            this.checkAllGroup = []
            this.checkAll = false
            this.moduleAuthStatus = true
            this.currentRoleId = data.row.RoleId
            queryAuthModule({roleId:data.row.RoleId,isAdmin:true}).then( (res) => {
                this.moduleList = Object.freeze(res.data.muduleList)
                for(let item of this.moduleList){
                    if(item.selected){
                        this.checkAllGroup.push(item.ModuleName)
                    }
                }
                this.ModulecheckedChange()
            })
        },
        moduleAuthHandler(){
            this.loading = true
            configAuthModule({str:this.updateAuthModuleStr,roleId:this.currentRoleId}).then( (res) => {
                this.loading = false
                this.moduleAuthStatus = false
            })
        },
        //菜单权限分配
        menuAuthAssign({row:{RoleId,RoleName}}){
            this.modalTitle = `菜单权限分配 - ${RoleName}`
            this.menuAuthStatus = true
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
            // console.log(str)
        },
        checkedChange(){
            let checkedArr = this.$refs.MenuTree.getCheckedAndIndeterminateNodes()
            let len = checkedArr.length-1
            let str = ''
            for(let [index,item] of checkedArr.entries()){
                str += `(${this.currentRoleId},${item.id})${index===len?'':','}`  
            }
            this.updateAuthMenuStr = str
            // console.log(str)
        },
        //确定 == 菜单权限分配
        menuAuthHandler(){
            this.loading = true
            this.checkedChange()
            updateAuthMenu({str:this.updateAuthMenuStr,roleId:this.currentRoleId}).then( (res) => {
                this.loading = false
                this.menuAuthStatus = false
                if(this.currentRoleId === this.userInfo.RoleId){
                  this.$root.eventBus.$emit('getMenu')  
                }
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




