<template>
  <div>
    <!--头部-->
    <Header></Header>
    <!--主体-->
    <div style="display: flex">
      <!--侧边栏-->
      <Aside/>
      <!--内容区域-->
      <router-view style="flex: 1" @userInfo="refreshUser"/>
    </div>
    <!--底部-->
    <el-footer class="footer">
      <app-footer class="footer-menu"/>
      <Footer :badges="badges"/>
    </el-footer>
  </div>
</template>

<script>
import Header from "@/components/Header";
import Aside from "@/components/Aside";
import request from "@/utils/request";
import Footer from "@/components/Footer";

export default {
  name: "Layout",
  props: {
    badges: {
      type: Array,
      required: true
    },
  },
  components: {
    Footer,
    Header,
    Aside
  },
  data() {
    return {
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      badges: [],
    }
  },
  created() { // 页面加载的时候调用
    this.load()
  },
  methods: {
    load() { // 查询所有
      request.post("/api/v1/badge/list", {
        page: this.currentPage,
        size: this.pageSize,
      }).then(res => {
        // console.log(res)
        this.tableData = res.data
        this.total = parseInt(res.total)
        this.badges = res.data
      })
    },
  }
}
</script>

<style scoped>
</style>
<style scoped lang="less">
.footer{
  background-color: #F8F8FF;
  height: 5% !important;
  .el-footer a {
    vertical-align: middle !important;
  }
}
/*动态字体*/
.slideShine{
  background:#676767 -webkit-linear-gradient(left,#636363,#00c1e4 50%,#abab00 90%,#bf4b48) no-repeat 0 0;
  background-size:20% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  text-decoration: underline;
}
.slideShine {-webkit-animation: slideShine 4s linear infinite;animation: slideShine 4s linear infinite;}
@-webkit-keyframes slideShine {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}
@keyframes slideShine {
  0% {background-position: 0 0; }
  100% {background-position: 100% 100%; }
}
</style>
