<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <div id="root-main" style="width: 40%; height: 300px"></div>
      <div id="root-main2" style="width: 50%; height: 300px"></div>
    </div>
    <div id="main" style="width: 100%; height: 500px" class="main-box"></div>
  </div>
</template>

<script>
import { getReports } from "@/api/order";
import * as echarts from "echarts";
import { errorMessage } from "../../config/constant";
import _ from "lodash";
export default {
  data() {
    return {
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
      },
      options2: {
        title: {
          text: "用户来源",
          left: "center",
          top: 20,
          textStyle: {
            color: "#999",
          },
        },

        tooltip: {
          trigger: "item",
        },

        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 274, name: "联盟广告" },
              { value: 235, name: "视频广告" },
              { value: 400, name: "搜索引擎" },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: "radius",
            label: {
              color: "#999",
            },
            labelLine: {
              lineStyle: {
                color: "#999",
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              color: "#c23531",
              shadowBlur: 200,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },

            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      },
      options3: {
        xAxis: {},
        yAxis: {},
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68],
            ],
            type: "scatter",
          },
        ],
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      const data = await getReports();
      if (data.meta.status === 200) {
        //
        const myChart = echarts.init(document.getElementById("main"));
        const myChart2 = echarts.init(document.getElementById("root-main"));
        const myChart3 = echarts.init(document.getElementById("root-main2"));
        const result = _.merge(data.data, this.options);
        myChart.setOption(result);
        myChart2.setOption(this.options2);
        myChart3.setOption(this.options3);
      } else {
        this.$message.error(errorMessage);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.main-box {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin-top: 20px;
}
#root-main,
#root-main2 {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}
</style>