<template>
    <div class="menuConfig">
        <div class="menu_tree">
           <Tree :data="treeData" :render="renderContent"></Tree> 
        </div>
        <!-- 新增菜单 -->
         <Modal
            v-model="addMenuStatus"
            title="新增菜单"
            class-name="center_g"
            @on-ok="addMenuHandler"
            @on-cancel="addMenuStatus=false">
            <div class="center_g marginTop10"><p class="label_g">菜单名称</p><Input v-model="formItem.menuName" placeholder="请输入菜单名..." /></div>
            <div class="center_g marginTop10"><p class="label_g">菜单路径</p><Input v-model="formItem.route" placeholder="请输入菜单路径..." /></div>
            <div class="center_g marginTop10"><p class="label_g">菜单图标</p><Input v-model="formItem.icon" placeholder="请输入菜单图标..." /></div>
        </Modal>
    </div>
</template>
<script>
import {addMenu,queryMenu,removeMenu} from '@api'
import { setTimeout } from 'timers';
    export default {
        data () {
            return {
                formItem:{
                  menuName:'',
                  route:''  
                },
                currentTreeData:[],
                addMenuStatus:false,
                treeData:[],
            }
        },
        activated(){
            
            queryMenu().then((res) => {
                this.treeData = res.data.menuList
            })
        },
        methods: {
            
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
                                type: 'ios-paper-outline'
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
                console.log(node)
            },
            //新增菜单
            addMenuHandler(){
                this.append(this.currentTreeData,this.formItem)
                this.addMenuStatus = false
                this.formItem = {
                    menuName:'',
                    route:''
                }
            },
            addMenu(data){
                this.addMenuStatus = true
                this.currentTreeData = data
            },
            append (data,menu) {
                let parentId = data.id
                
                const children = data.children || [];
                children.push({
                    title: menu.menuName,
                    expand: true
                });
                this.$set(data, 'children', children);
                
                this.$nextTick( () => {
                    setTimeout( () => {
                        let len = data.children.length-1
                        let menuId = data.children[len].id
                        let menuName = data.children[len].title
                        console.log(data,len,parentId,menuName,menuId,menu)
                        // return
                        // this.updateMenu({parentId,menuName,menuId})
                        addMenu({parentId,menuName,menuId}).then( (res) => {
                            console.log(res.status)
                            
                        },error=>{
                            console.log(666)
                            children.pop()
                            this.$set(data, 'children', children);
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
                
                function loop(node){
                    let arr = []
                    arr.push(node.nodeKey)
                    if(node.children){
                        for(let item of node.children){
                            arr.push(item.nodeKey)
                            if(item.children){
                                loop(item)
                            }
                        }
                    }
                    return arr
                }
                
                console.log(loop(node.node))
                let ids = loop(node.node)
                removeMenu({ids:this.createIds(ids)}).then( (res) => {
                    console.log()
                })
                return
                const parentKey = root.find(el => el === node).parent;
                const parent = root.find(el => el.nodeKey === parentKey).node;
                const index = parent.children.indexOf(data);
                parent.children.splice(index, 1);
            },
            createIds(ids){
                let str = ''
                for(let i=0; i<ids.length;i++){
                    if(i===ids.length-1){
                         str+="MenuId = "+ids[i]
                    }else{
                         str+="MenuId = "+ids[i]+" or "
                    }
                   
                }
                return str
                console.log(str)
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


