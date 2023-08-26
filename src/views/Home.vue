<template>
  <div class="home" style="padding: 10px">
    <div style="text-align: center" class="slideShine">现在时刻：{{ times }}</div>
    <!--    <div>前端技术：vue3+element-plus</div>
        <div>后端技术：Springboot+mybatisPlus+SpringCloud+seata分布式事务+nacos注册中心+Swagger</div>-->
    <div id="myChart" class="chart" :style="{width: '100%', height: '500px'}"></div>
    <br>
    <div id="mychart1" class="chart" :style="myChartStyle"></div>
    <br>
  </div>
</template>
<script>
import request from "@/utils/request";
/*解决 xAxis "0" not found 报错*/
import 'echarts/lib/component/grid';
// vue文件中引入echarts工具
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
// 以下的组件按需引入
require('echarts/lib/component/tooltip')   // tooltip组件
require('echarts/lib/component/title')   //  title组件
require('echarts/lib/component/legend')  // legend组件

// 柱形图
export default {
  name: "Home",
  components: {},
  data() {
    return {
      xAxisData: ['新增用户', '新增提问', '新增评论', '新增类别','新增标签'], // x轴数据，可根据需求 直角坐标系 X 轴
      yAxisData1: [], // 数据1
      yAxisData2: [], // 数据2
      yAxisData3: [], // 数据3
      yAxisData4: [], // 数据4
      yAxisData5: [], // 数据5
      yAxisData6: [], // 数据6
      yAxisData7: [], // 数据7
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      tuData: [], // 表格数据
      times: '',//格式化之后的当前时间

      // 柱形图
      xData: ["总用户数 / 一天内新增", "总问题数 / 一天内新增", "总评论数 / 一天内新增", "总类别数 / 一天内新增", "总标签数 / 一天内新增"], //横坐标
      yData: [], //总数据
      taskDate: [], // 今日数据
      // float: "left",
      myChartStyle: { width: "100%", height: "500px"} //图表样式
    }
  },
  mounted() {
    // 折线图
    this.loadLine();
    // 柱形图
    this.initEcharts();
  },
  created() { // 页面加载的时候调用
    this.load()
    this.getTimes()
  },
  // 在Vue实例销毁前，清除我们的定时器
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.getTimesInterval);
    }
  },
  methods: {
    load() { // 分页查疫情数据
      const that = this;
      request.get("/api/v1/aduser/charts").then(res => {
        this.tuData = res.data
        this.yData = res.data
        console.log((this.yData) + "==========yData数据=======")
        this.loadLine(); // 加载数据
        this.initEcharts(); // 加载数据
      }),
          request.get("/api/v1/aduser/todays/charts").then(res => {
            this.taskDate = res.data
            this.initEcharts(); // 加载数据
          }),
          request.get("/api/v1/aduser/week/charts").then(res => {
            this.tuData = res.data
            console.log(JSON.stringify(that.tuData) + "==========that.tuDta总数据=======")
            console.log(JSON.stringify(that.tuData[0]) + ".replace(\"[\",\"\").replace(\"]\",\"\")==========that.tuDta[0]数据=======")
            console.log(that.tuData[0] + "==========that.tuDta[0]数据=======")
            console.log(that.tuData[1] + "==========that.tuDta[1]数据=======")
            console.log(that.tuData[2] + "==========that.tuDta[2]数据=======")
            console.log(that.tuData[3] + "==========that.tuDta[3]数据=======")
            console.log(that.tuData[4] + "==========that.tuDta[4]数据=======")
            console.log(that.tuData[5] + "==========that.tuDta[5]数据=======")
            console.log(that.tuData[6] + "==========that.tuDta[6]数据=======")
            console.log(this.yAxisData1)
            that.yAxisData1 = that.tuData[0]
            that.yAxisData2 = that.tuData[1]
            that.yAxisData3 = that.tuData[2]
            that.yAxisData4 = that.tuData[3]
            that.yAxisData5 = that.tuData[4]
            that.yAxisData6 = that.tuData[5]
            that.yAxisData7 = that.tuData[6]
            this.loadLine(); // 加载数据
          })
    },
    loadLine() {
      let option = {
        // option 每个属性是一类组件
        title: {
          // 图标题
          text: '本周程序员论坛数据折线图堆叠'
        },
        tooltip: {
          trigger: 'axis' //提示框组件，坐标轴触发
        },
        //图例组件，
        legend: {
          data: ['一天内', '两天内', '三天内', '四天内','五天内','六天内','七天内']
        },
        //直角坐标系内绘图网格
        grid: {
          left: '3%', //grid 组件离容器左侧的距离
          right: '4%',
          bottom: '3%',
          containLabel: true //grid 区域是否包含坐标轴的刻度标签
        },
        // 如果有多个同类组件，那么就是个数组。例如这里有三个 X 轴。
        xAxis: {
          type: 'category',
          boundaryGap: false, //坐标轴两边留白策略 默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间
          data: this.xAxisData, // x轴数据
          axisLabel: {
            textStyle: {
              fontSize: 13,
              color: '#551DB0'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#FB9DC7',
              width: 1 // 底栏X轴 为了突出显示加上的
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: { // y 坐标轴文本标签
            textStyle: {
              fontSize: 13,
              color: '#072CA6'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#0E42D2',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: { // 横线
              color: '#e5e6eb',
              width: 1,
              type: 'solid'
            }
          }
        },
        // 这里有多个系列，也是构成一个数组。[表示实际数据]
        series: [
          {
            name: '一天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData1 // y轴数据1
          },
          {
            name: '两天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData2 // y轴数据2
          },
          {
            name: '三天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData3 // y轴数据3
          },
          {
            name: '四天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData4 // y轴数据4
          },
          {
            name: '五天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData5 // y轴数据5
          },
          {
            name: '六天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData6 // y轴数据6
          },
          {
            name: '七天内',
            type: 'line',
            // 显示数值
            itemStyle: {normal: {label: {show: true}}},
            data: this.yAxisData7 // y轴数据7
          }
        ]
      }
      // 创建 echarts 实例。
      this.myChartOne = echarts.init(document.getElementById('myChart'))
      // 调用 setOption 将 option 输入 echarts，然后 echarts 渲染图表。
      this.myChartOne.setOption(option)
    },
    getTimes() {
      setInterval(this.getTimesInterval, 1000);
    },
    getTimesInterval: function () {
      let _this = this;
      let year = new Date().getFullYear(); //获取当前时间的年份
      let month = new Date().getMonth() + 1; //获取当前时间的月份
      let day = new Date().getDate(); //获取当前时间的天数
      let hours = new Date().getHours(); //获取当前时间的小时
      let minutes = new Date().getMinutes(); //获取当前时间的分数
      let seconds = new Date().getSeconds(); //获取当前时间的秒数
      //当小于 10 的是时候，在前面加 0
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      //拼接格式化当前时间
      _this.times = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    },
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format('YY-MM-DD HH:mm');
    },

    // 柱形图
    initEcharts() {
      // 多列柱状图
      let mulColumnZZTData = {
        xAxis: {
          data: this.xData,
          axisLabel: {
            textStyle: {
              fontSize: 13,
              color: '#F76560'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#FB9DC7',
              width: 1 // 底栏X轴 为了突出显示加上的
            }
          }
        },
        // 图例
        legend: {
          data: ["总数", "一天内新增"],
          top: "0%"
        },
        yAxis: {
          axisLabel: { // y 坐标轴文本标签
            textStyle: {
              fontSize: 13,
              color: '#072CA6'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#0E42D2',
              width: 1
            }
          },
          splitLine: {
            show: true,
            lineStyle: { // 横线
              color: '#FFE8FB',
              width: 1,
              type: 'solid'
            }
          }
        },
        series: [
          {
            type: "bar", //形状为柱状图
            data: this.yData,
            name: "总数", // legend属性
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: "top"
            },
          },
          {
            type: "bar", //形状为柱状图
            data: this.taskDate,
            name: "一天内新增", // legend属性
            label: {
              // 柱状图上方文本标签，默认展示数值信息
              show: true,
              position: "top"
            }
          }
        ]
      };
      this.myChart1 = echarts.init(document.getElementById("mychart1"));
      this.myChart1.setOption(mulColumnZZTData);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myChart1.resize();
      });
    }
  }
}
</script>

<!--动态文字-->
<style scoped>
.slideShine {
  background: #E865DF -webkit-linear-gradient(left, #FFB6C1, #DA70D6, #D8BFD8, #00c1e4, #00CED1 50%, #FF8C00, #BC8F8F, #4B0082, #FFDEAD, #4B0082, #FFDEAD, #ADFF2F 90%, #bf4b48) repeat 0 0;
  background-size: 60% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
}

.slideShine {
  -webkit-animation: slideShine 5s linear infinite;
  animation: slideShine 5s linear infinite;
}

@-webkit-keyframes slideShine {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}

@keyframes slideShine {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}
</style>
