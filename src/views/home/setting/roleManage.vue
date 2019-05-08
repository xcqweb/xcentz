<template>
    <div class="roleManage">
        <div class="top_operate">
            <Input search enter-button="查询" v-model='searchKey' size="large" style="width:300px;margin-right:30px;" @on-search='search' @on-enter='search' placeholder="角色查询" />
            <Button size="large" icon="ios-add" type="primary" @click="addRoleStatus=true">新增角色</Button> 
        </div>

        <Table border stripe  size='large' :loading='isLoading' :columns="columnsRole" :data="dataRole" v-show="dataRole.length"></Table>
        <Page @on-change='goPage' :total="totalCount" :cureent='currentPage' show-total :page-size='pageSize' show-elevator style='margin-top:20px;' />
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
            @on-ok="menuAuthHandler"
            @on-cancel="menuAuthStatus=false">
            <Tree :data="treeData" show-checkbox :check-strictly='checkStrictly' multiple @on-check-change='checkedChange' ref='MenuTree'></Tree>
        </Modal>
    </div>
</template>

<script>
import {roleList,addRole,editRole,delRole,queryAuthMenu,updateAuthMenu} from '@api'
import { userInfo } from 'os';
export default {
    data(){
        return{
            pageSize:15,
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
            currentRoleId:'',
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
                        key: 'RoleName'
                    },
                     {
                        title: '角色说明',
                        key: 'Directions'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        // width:260,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
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

        },
        //菜单权限分配
        menuAuthAssign({row:{RoleId}}){
            this.menuAuthStatus = true
            this.checkStrictly = true
            this.currentRoleId = RoleId
            this.queryAuthMenu(RoleId)
        },
        checkedChange(){
            
            this.checkStrictly = false
            let checkedArr = this.$refs.MenuTree.getCheckedAndIndeterminateNodes()
            let len = checkedArr.length-1
            let str = ''
            for(let [index,item] of checkedArr.entries()){
                str += `(${this.currentRoleId},${item.id})${index===len?'':','}`
            }
            this.updateAuthMenuStr = str
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


