<template>
    <div class="menuConfig">
        <div class="menu_tree">
           <Tree :data="treeData" :render="renderContent"></Tree> 
        </div>
        <!-- 新增菜单 -->
         <Modal
            v-model="addMenuStatus"
            title="新增菜单"
            @on-ok="addMenuHandler"
            @on-cancel="addMenuStatus=false">
            <div class="center_g marginTop10"><p class="label_g">菜单名称</p><Input v-model="formItem.menuName" placeholder="请输入菜单名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">菜单路径</p><Input v-model="formItem.route" placeholder="请输入菜单路径..." /></div>
            <div class="center_g marginTop10"><p class="label_g">菜单图标</p><Input v-model="formItem.icon" placeholder="请输入菜单图标..." /></div>
        </Modal>

        <!-- 编辑菜单 -->
         <Modal
            v-model="editMenuStatus"
            title="编辑菜单"
            @on-ok="editMenuHandler"
            @on-cancel="editMenuStatus=false">
            <div class="center_g marginTop10"><p class="label_g">菜单名称</p><Input v-model="editFrom.menuName" placeholder="请输入菜单名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">菜单路径</p><Input v-model="editFrom.route" placeholder="请输入菜单路径..." /></div>
            <div class="center_g marginTop10"><p class="label_g">菜单图标</p><Input v-model="editFrom.icon" placeholder="请输入菜单图标..." /></div>
        </Modal>
    </div>
</template>
<script>
import {addMenu,queryMenu,removeMenu,editMenu} from '@api'
    export default {
        data () {
            return {
                formItem:{
                  menuName:'',
                  route:'',
                  icon:'',  
                },
                editFrom:{
                  menuName:'',
                  route:'',
                  icon:'',
                  id:''  
                },
                maxId:0,
                parentId:0,
                currentTreeData:[],
                addMenuStatus:false,
                editMenuStatus:false,
                treeData:[],
            }
        },
        
        activated(){
            this.queryMenu()
        },
        beforeDestroy(){
            this.$root.eventBus.$off('getMenu')
        },
        methods: {
            //查询菜单
            queryMenu(){
                queryMenu({isAdmin:true}).then((res) => {
                    this.treeData = Object.freeze(res.data.menuList)
                    this.maxId = res.data.maxId
                })
            },
            renderContent (h, { root, node, data }) {
                return h('span', {
                    style: {
                        display: 'inline-block',
                        width: '100%',
                    }
                }, [
                    h('span',{style:{float:'left'}}, [
                        h('Icon', {
                            props: {
                                type: 'ios-leaf'
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', data.title)
                    ]),
                    h('span', {
                        style: {
                            display: 'inline-block',
                            float: 'right',
                            marginLeft: '32px'
                        }
                    }, [
                        h('span', {
                            style: {
                                marginRight: '32px',
                                color:'#2d8cf0',
                                cursor:'pointer'
                            },
                            on: {
                                click: () => { this.addMenu(data) }
                            }
                        },'增加子菜单'),
                        h('span', {
                            style:{
                                color:'#2d8cf0',
                                marginRight: '32px',
                                cursor:'pointer'
                            },
                            on: {
                                click: () => { this.remove(root, node, data) }
                            }
                        },'删除'),
                         h('span', {
                            style:{
                                color:'#2d8cf0',
                                cursor:'pointer'
                            },
                            on: {
                                click: () => { this.edit(root, node, data) }
                            }
                        },'编辑')
                    ])
                ]);
            },
            edit(root, node, data){
                this.parentId = data.parent_id
                this.editMenuStatus = true
                this.editFrom = {
                  menuName:node.node.title,
                  route:node.node.route,
                  icon:node.node.icon,  
                  id:node.node.id,  
                }
            },
            //编辑菜单
            editMenuHandler(){
                editMenu({menuName:this.editFrom.menuName,route:this.editFrom.route,icon:this.editFrom.icon,id:this.editFrom.id}).then( (res) => {
                    this.queryMenu()
                    this.$root.eventBus.$emit('getMenu')
                })
            },
            //新增菜单
            addMenuHandler(){
                this.append(this.currentTreeData,this.formItem)
                this.addMenuStatus = false
                this.formItem = {
                    menuName:'',
                    route:'',
                    icon:''
                }
            },
            addMenu(data){
                // console.log(data)
                // return
                this.parentId = data.parent_id
                this.addMenuStatus = true
                this.currentTreeData = Object.freeze(data)
            },
            append (data,menu) {
                let parentId = data.id
                
                const children = data.children || [];
                children.push({
                    title: menu.menuName,
                    expand: true
                });


                this.$nextTick( () => {
                    setTimeout( () => {
                        let menuId = this.maxId+1
                        let menuName = menu.menuName
                        
                        addMenu({parentId,menuName,menuId,route:menu.route,icon:menu.icon}).then( (res) => {
                            this.queryMenu()
                            this.$root.eventBus.$emit('getMenu')
                        },error=>{
                        })
                    },0)
                    
                })
                
            },
            updateMenu(params){
                
            },
            remove (root, node, data) {
                if(typeof node.parent === 'undefined'){
                    this.$Message.warning({
                        content:'跟节点不可删除!',
                        duration:3
                    })
                    return
                }
                 this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确定要要删除菜单?</p>',
                    onOk: () => {
                        let arr = []
                        function loop(node){
                            arr.push(node.id)
                            if(node.children){
                                for(let item of node.children){
                                    arr.push(item.id)
                                    if(item.children){
                                        loop(item)
                                    }
                                }
                            }
                            return [...new Set(arr)]
                        }
                
                        let ids = loop(node.node)

                        removeMenu({ids:this.createIds(ids)}).then( (res) => {
                            this.queryMenu()
                            this.$root.eventBus.$emit('getMenu')
                        })
                    },
                });
                
            },
            createIds(ids){
                let str = ''
                for(let i=0; i<ids.length;i++){
                    if(i===ids.length-1){
                         str+="t1.MenuId = "+ids[i]
                    }else{
                         str+="t1.MenuId = "+ids[i]+" or "
                    }
                   
                }
                return str
            }
        }
    }
</script>


<style lang="less" scoped>
    .menuConfig{
        .menu_tree{
            width: 600px;
            &>ul{
                padding-right: 18px;
            }
        }
    }
</style>


