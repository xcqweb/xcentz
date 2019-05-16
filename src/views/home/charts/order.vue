<template>
    <div>
        <Chart id='orderLine' height='600' />
        <Chart id='orderPie' type='bar' height='600' />
        <Chart id='orderRadar' :setOption='optionRadar' height='600' />
    </div>
</template>

<script>
import Chart from '@@/chart'
export default {
    data(){
        return{
            optionRadar:{
                 title: {
                    text: 'xcentz',
                    subtext: '',
                    top: 10,
                    left: 10
                },
                tooltip: {
                    trigger: 'item',
                    backgroundColor : 'rgba(0,0,250,0.2)'
                },
                legend: {
                    type: 'scroll',
                    bottom: 10,
                    data: (function (){
                        var list = [];
                        for (var i = 1; i <=28; i++) {
                            list.push(i + 2000 + '');
                        }
                        return list;
                    })()
                },
                visualMap: {
                    top: 'middle',
                    right: 10,
                    color: ['red', 'yellow'],
                    calculable: true
                },
                radar: {
                indicator : [
                    { text: '耳机', max: 400},
                    { text: '充电宝', max: 400},
                    { text: '数据线', max: 400},
                    { text: '墙充', max: 400},
                    { text: '多国旅充', max: 400}
                    ]
                },
                series : (function (){
                    var series = [];
                    for (var i = 1; i <= 28; i++) {
                        series.push({
                            name:'浏览器（数据纯属虚构）',
                            type: 'radar',
                            symbol: 'none',
                            lineStyle: {
                                width: 1
                            },
                            emphasis: {
                                areaStyle: {
                                    color: 'rgba(0,250,0,0.3)'
                                }
                            },
                            data:[
                            {
                                value:[
                                    (40 - i) * 10,
                                    (38 - i) * 4 + 60,
                                    i * 5 + 10,
                                    i * 9,
                                    i * i /2
                                ],
                                name: i + 2000 + ''
                            }
                            ]
                        });
                    }
                    return series;
                })()
            }
        }
    },
    components:{
        Chart
    }
}
</script>

<style lang="less" scoped>

</style>


