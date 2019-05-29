<template>
    <div class='chart_item' :id='id' :style="{'height':isNaN(height)?height:`${height}px`}"></div>
</template>

<script>
import Echarts from 'echarts'
export default {
    data(){
        return{
            myChart:null,
            option:{
                title: {
                    text: 'xcentz'
                },
                tooltip: {},
                legend: {
                    data:['销量','同比','环比']
                },
                xAxis: {
                    data: ["耳机","充电宝","数据线","墙充","多国旅充","蓝牙耳机"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: this.type,
                    data: [5, 20, 36, 10, 10, 20]
                },{
                    name: '同比',
                    type: this.type,
                    data: [15, 8, 26, 18, 50, 29]
                },{
                    name: '环比',
                    type: this.type,
                    data: [12, 18, 6, 8, 30, 9]
                }]
            }
        }
    },
    props:{
        id:String,
        setOption:{
            type:Object
        },
        type:{
            type:String,
            default:'line'
        },
        height:[Number,String]
    },
    activated(){
        this.$nextTick( () => {
            this.init()
        })
    },
    mounted(){
        this.$nextTick( () =>{
            window.addEventListener('resize',throttle(() => {
                this.myChart.resize()
            },300),false)
        })
    },
    beforeDestroy(){
        window.removeEventListener('resize',throttle(() => {
            this.myChart.resize()
        },300),false)
    },
    methods:{
        init(){
            // console.log(this.setOption)
            let dom = document.querySelector(`#${this.id}`)
            let myChart = this.myChart = Echarts.init(dom)
            this.setOption ? myChart.setOption(this.setOption) :myChart.setOption({...this.option,...this.setOption})
        }
    }
}
</script>

<style lang="less" scoped>
    .chart_item{
        height:100%;
    }
</style>


