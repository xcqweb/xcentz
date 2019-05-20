(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7066f39e"],{5529:function(e,t,o){},"7c7a":function(e,t,o){"use strict";o.r(t);var l=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"roleManage"},[o("div",{staticClass:"top_operate"},[o("Input",{staticStyle:{width:"300px","margin-right":"30px"},attrs:{search:"","enter-button":"",size:"large",placeholder:"角色查询"},on:{"on-search":e.search,"on-enter":e.search},model:{value:e.searchKey,callback:function(t){e.searchKey=t},expression:"searchKey"}}),o("Button",{attrs:{size:"large",icon:"ios-add",type:"primary"},on:{click:function(t){e.addRoleStatus=!0}}},[e._v("新增角色")])],1),o("Table",{directives:[{name:"show",rawName:"v-show",value:e.dataRole.length,expression:"dataRole.length"}],attrs:{border:"",stripe:"",size:"large",loading:e.isLoading,columns:e.columnsRole,data:e.dataRole}}),o("Page",{staticStyle:{margin:"20px 0"},attrs:{total:e.totalCount,cureent:e.currentPage,"show-total":"","page-size":e.pageSize,"show-elevator":""},on:{"on-change":e.goPage}}),o("Modal",{attrs:{title:"新增角色"},on:{"on-ok":e.addRole,"on-cancel":function(t){e.addRoleStatus=!1}},model:{value:e.addRoleStatus,callback:function(t){e.addRoleStatus=t},expression:"addRoleStatus"}},[o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("角色名称")]),o("Input",{attrs:{placeholder:"请输入角色名..."},model:{value:e.roleAdd.roleName,callback:function(t){e.$set(e.roleAdd,"roleName",t)},expression:"roleAdd.roleName"}})],1),o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("角色说明")]),o("Input",{attrs:{placeholder:"请输入角色说明..."},model:{value:e.roleAdd.roleDirection,callback:function(t){e.$set(e.roleAdd,"roleDirection",t)},expression:"roleAdd.roleDirection"}})],1)]),o("Modal",{attrs:{title:"编辑角色"},on:{"on-ok":e.editRole,"on-cancel":function(t){e.editRoleStatus=!1}},model:{value:e.editRoleStatus,callback:function(t){e.editRoleStatus=t},expression:"editRoleStatus"}},[o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("角色名称")]),o("Input",{attrs:{placeholder:"请输入角色名..."},model:{value:e.roleEdit.roleName,callback:function(t){e.$set(e.roleEdit,"roleName",t)},expression:"roleEdit.roleName"}})],1),o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("角色说明")]),o("Input",{attrs:{placeholder:"请输入角色说明..."},model:{value:e.roleEdit.roleDirection,callback:function(t){e.$set(e.roleEdit,"roleDirection",t)},expression:"roleEdit.roleDirection"}})],1)]),o("Modal",{attrs:{title:"菜单权限分配",width:"600"},on:{"on-ok":e.menuAuthHandler,"on-cancel":function(t){e.menuAuthStatus=!1}},model:{value:e.menuAuthStatus,callback:function(t){e.menuAuthStatus=t},expression:"menuAuthStatus"}},[o("Tree",{ref:"MenuTree",attrs:{data:e.treeData,"show-checkbox":"","check-strictly":e.checkStrictly,multiple:""},on:{"on-check-change":e.checkedChange}})],1),o("Modal",{attrs:{title:"模块权限分配",width:"800"},on:{"on-ok":e.moduleAuthHandler,"on-cancel":function(t){e.moduleAuthStatus=!1}},model:{value:e.moduleAuthStatus,callback:function(t){e.moduleAuthStatus=t},expression:"moduleAuthStatus"}},[o("div",{staticStyle:{"border-bottom":"1px solid #e9e9e9","padding-bottom":"6px","margin-bottom":"6px"}},[o("Checkbox",{attrs:{indeterminate:e.indeterminate,value:e.checkAll,size:"large"},nativeOn:{click:function(t){return t.preventDefault(),e.handleCheckAll(t)}}},[e._v(e._s(e.checkAll?"取消全选":"全选"))])],1),o("CheckboxGroup",{on:{"on-change":e.ModulecheckedChange},model:{value:e.checkAllGroup,callback:function(t){e.checkAllGroup=t},expression:"checkAllGroup"}},e._l(e.moduleList,function(e){return o("Checkbox",{key:e.ModuleId,attrs:{size:"large",label:e.ModuleName}})}),1)],1)],1)},n=[],i=o("768b"),a=(o("ac6a"),o("5d73")),r=o.n(a),c=(o("7f7f"),o("880a")),u={data:function(){var e=this;return{indeterminate:!1,checkAll:!1,checkAllGroup:[],moduleList:[],pageSize:10,totalCount:0,currentPage:1,menuAuthStatus:!1,searchKey:"",isLoading:!1,addRoleStatus:!1,editRoleStatus:!1,checkStrictly:!1,roleAdd:{roleName:"",roleDirection:""},roleEdit:{roleName:"",roleDirection:"",id:"",index:""},updateAuthMenuStr:"",updateAuthModuleStr:"",currentRoleId:"",moduleAuthStatus:!1,treeDataModule:[],treeData:[],columnsRole:[{title:"序号",width:80,type:"index",render:function(e,t){return e("div",[e("Icon",{props:{type:"person"}}),e("strong",t.row.name)])}},{title:"角色名称",key:"RoleName"},{title:"角色说明",key:"Directions"},{title:"操作",key:"action",width:500,align:"center",render:function(t,o){return t("div",[t("Button",{props:{type:"primary",icon:"md-create"},style:{margin:"8px"},on:{click:function(){e.edit(o)}}},"编辑"),t("Button",{props:{type:"primary",icon:"ios-create-outline"},style:{margin:"8px"},on:{click:function(){e.menuAuthAssign(o)}}},"菜单权限分配"),t("Button",{props:{type:"primary",icon:"ios-create-outline"},style:{margin:"8px"},on:{click:function(){e.moduleAuthAssign(o)}}},"模块权限分配"),t("Button",{props:{type:"error",icon:"ios-trash-outline"},style:{margin:"8px"},on:{click:function(){e.remove(o)}}},"删除")])}}],dataRole:[]}},activated:function(){this.getRoleList()},methods:{handleCheckAll:function(){if(this.checkAll=!this.checkAll,this.checkAllGroup=[],this.updateAuthModuleStr="",this.checkAll){var e=!0,t=!1,o=void 0;try{for(var l,n=r()(this.moduleList);!(e=(l=n.next()).done);e=!0){var i=l.value;this.checkAllGroup.push(i.ModuleName)}}catch(a){t=!0,o=a}finally{try{e||null==n.return||n.return()}finally{if(t)throw o}}this.getSelectedModule()}},queryAuthMenu:function(e){var t=this;Object(c["w"])({roleId:e}).then(function(e){t.treeData=e.data.menuList})},search:function(){this.getRoleList()},addRole:function(){var e=this;Object(c["c"])({roleName:this.roleAdd.roleName,direction:this.roleAdd.roleDirection}).then(function(t){e.roleAdd={roleName:"",roleDirection:""},e.getRoleList()})},editRole:function(){var e=this;Object(c["q"])({roleName:this.roleEdit.roleName,direction:this.roleEdit.roleDirection,id:this.roleEdit.id}).then(function(t){e.$set(e.dataRole[e.roleEdit.index],"RoleName",e.roleEdit.roleName),e.$set(e.dataRole[e.roleEdit.index],"Directions",e.roleEdit.roleDirection)})},getRoleList:function(e){var t=this;this.isLoading=!0,Object(c["D"])({key:this.searchKey,currentPage:this.currentPage,pageSize:this.pageSize}).then(function(e){t.isLoading=!1,t.dataRole=e.data.roleList,t.totalCount=e.data.total},function(e){t.isLoading=!1})},edit:function(e){this.editRoleStatus=!0,this.roleEdit={roleName:e.row.RoleName,roleDirection:e.row.Directions,id:e.row.RoleId,index:e.index}},remove:function(e){var t=this;console.log(e),this.$Modal.confirm({title:"提示",content:"<p>确定要要删除该角色?</p>",onOk:function(){Object(c["l"])({id:e.row.RoleId}).then(function(o){t.dataRole.splice(e.index,1)})}})},moduleAuthAssign:function(e){var t=this;this.checkAllGroup=[],this.checkAll=!1,this.moduleAuthStatus=!0,this.currentRoleId=e.row.RoleId,Object(c["x"])({roleId:e.row.RoleId,isAdmin:!0}).then(function(e){t.moduleList=e.data.muduleList;var o=!0,l=!1,n=void 0;try{for(var i,a=r()(t.moduleList);!(o=(i=a.next()).done);o=!0){var c=i.value;c.selected&&t.checkAllGroup.push(c.ModuleName)}}catch(u){l=!0,n=u}finally{try{o||null==a.return||a.return()}finally{if(l)throw n}}t.ModulecheckedChange()})},moduleAuthHandler:function(){Object(c["j"])({str:this.updateAuthModuleStr,roleId:this.currentRoleId}).then(function(e){})},menuAuthAssign:function(e){var t=e.row.RoleId;this.menuAuthStatus=!0,this.checkStrictly=!0,this.currentRoleId=t,this.queryAuthMenu(t)},ModulecheckedChange:function(){var e=this.moduleList.length;this.checkAllGroup.length===e?this.checkAll=!0:this.checkAll=!1,this.getSelectedModule()},getSelectedModule:function(){var e="",t=this.checkAllGroup.length-1,o=!0,l=!1,n=void 0;try{for(var a,c=r()(this.checkAllGroup.entries());!(o=(a=c.next()).done);o=!0){var u=Object(i["a"])(a.value,2),s=u[0],d=u[1],h=!0,p=!1,m=void 0;try{for(var f,g=r()(this.moduleList);!(h=(f=g.next()).done);h=!0){var v=f.value;v.ModuleName===d&&(e+="(".concat(this.currentRoleId,",").concat(v.ModuleId,")").concat(s===t?"":","))}}catch(k){p=!0,m=k}finally{try{h||null==g.return||g.return()}finally{if(p)throw m}}}}catch(k){l=!0,n=k}finally{try{o||null==c.return||c.return()}finally{if(l)throw n}}this.updateAuthModuleStr=e,console.log(e)},checkedChange:function(){var e=this.$refs.MenuTree.getCheckedAndIndeterminateNodes(),t=e.length-1,o="",l=!0,n=!1,a=void 0;try{for(var c,u=r()(e.entries());!(l=(c=u.next()).done);l=!0){var s=Object(i["a"])(c.value,2),d=s[0],h=s[1];o+="(".concat(this.currentRoleId,",").concat(h.id,")").concat(d===t?"":",")}}catch(p){n=!0,a=p}finally{try{l||null==u.return||u.return()}finally{if(n)throw a}}this.updateAuthMenuStr=o,this.checkStrictly=!1,console.log(o)},menuAuthHandler:function(){var e=this;Object(c["E"])({str:this.updateAuthMenuStr,roleId:this.currentRoleId}).then(function(t){e.$root.eventBus.$emit("getMenu")})},goPage:function(e){this.currentPage=e,this.getRoleList()}}},s=u,d=(o("d184"),o("2877")),h=Object(d["a"])(s,l,n,!1,null,"05fca2be",null);t["default"]=h.exports},d184:function(e,t,o){"use strict";var l=o("5529"),n=o.n(l);n.a}}]);