(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d207f0a"],{a357:function(e,t,o){"use strict";o.r(t);var d=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"moduleManage"},[o("div",{staticClass:"top_operate"},[o("Input",{staticStyle:{width:"300px","margin-right":"30px"},attrs:{search:"","enter-button":"",size:"large",placeholder:"模块名,说明..."},on:{"on-search":e.search,"on-enter":e.search},model:{value:e.searchKey,callback:function(t){e.searchKey=t},expression:"searchKey"}}),o("Button",{attrs:{size:"large",icon:"ios-add",type:"primary"},on:{click:function(t){e.addModuleStatus=!0}}},[e._v("新增权限模块")])],1),o("Table",{directives:[{name:"show",rawName:"v-show",value:e.dataModule.length,expression:"dataModule.length"}],attrs:{border:"",stripe:"",loading:e.isLoading,columns:e.columnsModule,data:e.dataModule}}),o("Page",{staticStyle:{margin:"20px 0"},attrs:{total:e.totalCount,cureent:e.currentPage,"show-total":"","page-size":e.pageSize,"show-elevator":""},on:{"on-change":e.goPage}}),o("Modal",{attrs:{title:"新增模块"},on:{"on-ok":e.addModule,"on-cancel":function(t){e.addModuleStatus=!1}},model:{value:e.addModuleStatus,callback:function(t){e.addModuleStatus=t},expression:"addModuleStatus"}},[o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("模块名称")]),o("Input",{attrs:{maxlength:8,placeholder:"请输入模块名..."},model:{value:e.moduleAdd.moduleName,callback:function(t){e.$set(e.moduleAdd,"moduleName",t)},expression:"moduleAdd.moduleName"}})],1),o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("模块说明")]),o("Input",{attrs:{placeholder:"请输入模块说明..."},model:{value:e.moduleAdd.moduleDirection,callback:function(t){e.$set(e.moduleAdd,"moduleDirection",t)},expression:"moduleAdd.moduleDirection"}})],1)]),o("Modal",{attrs:{title:"编辑模块"},on:{"on-ok":e.moduleEditHandler,"on-cancel":function(t){e.editModuleStatus=!1}},model:{value:e.editModuleStatus,callback:function(t){e.editModuleStatus=t},expression:"editModuleStatus"}},[o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("模块名称")]),o("Input",{attrs:{maxlength:8,placeholder:"请输入模块名..."},model:{value:e.moduleEdit.moduleName,callback:function(t){e.$set(e.moduleEdit,"moduleName",t)},expression:"moduleEdit.moduleName"}})],1),o("div",{staticClass:"center_g marginTop10"},[o("p",{staticClass:"label_g"},[e._v("模块说明")]),o("Input",{attrs:{placeholder:"请输入模块说明..."},model:{value:e.moduleEdit.moduleDirection,callback:function(t){e.$set(e.moduleEdit,"moduleDirection",t)},expression:"moduleEdit.moduleDirection"}})],1)])],1)},a=[],i=(o("7f7f"),o("880a")),l={data:function(){var e=this;return{addModuleStatus:!1,searchKey:"",moduleAdd:{moduleName:"",moduleDirection:""},editModuleStatus:!1,moduleEdit:{moduleName:"",moduleDirection:"",id:"",index:""},isLoading:!1,totalCount:0,currentPage:1,pageSize:10,dataModule:[],columnsModule:[{title:"序号",width:80,type:"index",render:function(e,t){return e("div",[e("Icon",{props:{type:"person"}}),e("strong",t.row.name)])}},{title:"模块名称",key:"ModuleName"},{title:"模块说明",key:"Directions"},{title:"操作",key:"action",align:"center",render:function(t,o){return t("div",[t("Button",{props:{type:"primary",icon:"md-create"},style:{margin:"8px"},on:{click:function(){e.edit(o)}}},"编辑"),t("Button",{props:{type:"error",icon:"ios-trash-outline"},style:{margin:"8px"},on:{click:function(){e.remove(o)}}},"删除")])}}]}},activated:function(){this.getModuleList()},methods:{goPage:function(e){this.currentPage=e,this.getModuleList()},search:function(){this.getModuleList()},getModuleList:function(){var e=this;Object(i["z"])({key:this.searchKey,currentPage:this.currentPage,pageSize:this.pageSize}).then(function(t){e.dataModule=t.data.moduleList,e.totalCount=t.data.total})},addModule:function(){var e=this;Object(i["b"])({moduleName:this.moduleAdd.moduleName,direction:this.moduleAdd.moduleDirection}).then(function(t){e.moduleAdd={moduleName:"",moduleDirection:""},e.getModuleList()})},edit:function(e){this.editModuleStatus=!0,this.moduleEdit={moduleName:e.row.ModuleName,moduleDirection:e.row.Directions,id:e.row.ModuleId,index:e.index}},moduleEditHandler:function(){var e=this;Object(i["p"])({moduleName:this.moduleEdit.moduleName,direction:this.moduleEdit.moduleDirection,id:this.moduleEdit.id}).then(function(t){e.$set(e.dataModule[e.moduleEdit.index],"ModuleName",e.moduleEdit.moduleName),e.$set(e.dataModule[e.moduleEdit.index],"Directions",e.moduleEdit.moduleDirection)})},remove:function(e){var t=this;this.$Modal.confirm({title:"提示",content:"<p>确定要要删除该角色?</p>",onOk:function(){Object(i["k"])({id:e.row.ModuleId}).then(function(o){t.dataModule.splice(e.index,1)})}})}}},n=l,u=o("2877"),s=Object(u["a"])(n,d,a,!1,null,null,null);t["default"]=s.exports}}]);