<template>
    <div class="home">
        <div class="bar">
            <canvas id="barChart" width="400" height="400"></canvas>
        </div>
        <div class="pie">
            <canvas id="pieChart" width="400" height="400"></canvas>
        </div>
        <div class="radar">
            <canvas id="radarChart" width="400" height="400"></canvas>
        </div>
    </div>

</template>

<script>
import Charts from 'chart.js'
export default {
    data(){
        return{

        }
    },
    activated(){
        this.$nextTick( () => {
            
            new Chart(document.querySelector('#radarChart'), {
                type: 'radar',
                data: {
                    labels: ['Eating', 'Water', 'Sleeping', 'Graphics', 'Coding', 'Cycling', 'Running'],
                    datasets: [{
                        label: 'First dataset',
                        data: [12,12,12,12,10],
                        borderColor:[
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        pointStyle:'circle',
                        borderColor:'#ff6700',
                        borderWidth: 1,
                        backgroundColor:'rgba(220,0,220,0.2)',
                        pointBackgroundColor:'#ff6700'
                    },{
                        label: 'Second dataset',
                        data: [16,16,16,16,16],
                        borderColor:[
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        pointStyle:'circle',
                        borderColor:'#ff6700',
                        borderWidth: 1,
                        backgroundColor:'rgba(220,0,220,0.2)',
                        pointBackgroundColor:'#ff6700'
                    }]
                },
                options: {
                    legend: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Chart.js Radar Chart'
                        },
                        scale: {
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    }
                }
            });

            new Chart(document.querySelector('#pieChart'), {
                type: 'pie',
                data: {
                     datasets: [{
                        
                        data: [10, 20, 30],
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }],

                    labels: [
                        'Red',
                        'Yellow',
                        'Blue'
                    ],
                    
                },
                // options: options
            });
            var myChart = new Chart(document.querySelector('#barChart'), {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                    datasets: [{
                        label: 'color',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    layout: {
                        padding: {
                            left: 50,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        })
    }
}
</script>

<style lang="less" scoped>
    .home{
        height: 100%;
        width: 100%;
        .bar{
            height: 1454/3px;
            width: 1454/3px;
            position: relative;
        }
        .pie{
            position: relative;
            height: 1454/3px;
            width: 1454/3px;
            left: 1454/2px;
            top: -1454/3px;
        }
        .radar{
            position: relative;
            height: 1454/3px;
            width: 1454/3px;
            // left: 1454/2px;
            top: -1454/3px;
        }
    }
</style>


