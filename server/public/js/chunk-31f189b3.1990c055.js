(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-31f189b3"],{"3f97":function(t,e,i){"use strict";var a=i("84fb"),n=i.n(a);n.a},"84fb":function(t,e,i){},b1b0:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("Chart",{attrs:{id:"orderLine",height:"600"}}),i("Chart",{attrs:{id:"orderPie",type:"bar",height:"600"}}),i("Chart",{attrs:{id:"orderRadar",setOption:t.optionRadar,height:"600"}})],1)},n=[],r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"chart_item",style:{height:isNaN(t.height)?t.height:t.height+"px"},attrs:{id:t.id}})},o=[],s=i("cebc"),c=(i("c5f6"),i("164e")),l=i.n(c),p={data:function(){return{option:{title:{text:"xcentz"},tooltip:{},legend:{data:["销量","同比","环比"]},xAxis:{data:["耳机","充电宝","数据线","墙充","多国旅充","蓝牙耳机"]},yAxis:{},series:[{name:"销量",type:this.type,data:[5,20,36,10,10,20]},{name:"同比",type:this.type,data:[15,8,26,18,50,29]},{name:"环比",type:this.type,data:[12,18,6,8,30,9]}]}}},props:{id:String,setOption:{type:Object},type:{type:String,default:"line"},height:[Number,String]},activated:function(){var t=this;this.$nextTick(function(){t.init()})},methods:{init:function(){console.log(this.setOption);var t=document.querySelector("#".concat(this.id)),e=l.a.init(t);this.setOption?e.setOption(this.setOption):e.setOption(Object(s["a"])({},this.option,this.setOption))}}},h=p,d=(i("3f97"),i("2877")),u=Object(d["a"])(h,r,o,!1,null,"b990e976",null),f=u.exports,b={data:function(){return{optionRadar:{title:{text:"xcentz",subtext:"",top:10,left:10},tooltip:{trigger:"item",backgroundColor:"rgba(0,0,250,0.2)"},legend:{type:"scroll",bottom:10,data:function(){for(var t=[],e=1;e<=28;e++)t.push(e+2e3+"");return t}()},visualMap:{top:"middle",right:10,color:["red","yellow"],calculable:!0},radar:{indicator:[{text:"耳机",max:400},{text:"充电宝",max:400},{text:"数据线",max:400},{text:"墙充",max:400},{text:"多国旅充",max:400}]},series:function(){for(var t=[],e=1;e<=28;e++)t.push({name:"浏览器（数据纯属虚构）",type:"radar",symbol:"none",lineStyle:{width:1},emphasis:{areaStyle:{color:"rgba(0,250,0,0.3)"}},data:[{value:[10*(40-e),4*(38-e)+60,5*e+10,9*e,e*e/2],name:e+2e3+""}]});return t}()}}},components:{Chart:f}},m=b,x=Object(d["a"])(m,a,n,!1,null,"71b4f32c",null);e["default"]=x.exports}}]);