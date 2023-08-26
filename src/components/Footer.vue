<template>
  <footer class="ui inverted vertical segment m-padded-tb-large m-opacity">
    <div class="ui center aligned container">
      <div class="ui inverted section divider"></div>
      <div style="text-align: center">
      <div class="github-badge" v-for="(item,index) in badges" :key="index">
        <a rel="external nofollow noopener" :href="item.url" target="_blank" :title="item.title">
          <span class="badge-subject">{{ item.badgeName }}</span>
          <span class="badge-value" :class="`bg-${item.color}`">{{ item.value }}</span>
        </a>
      </div>
      </div>
    </div>
  </footer>
</template>

<script>
import request from "@/utils/request";

export default {
  name: "Footer",
  props: {
    badges: {
      type: Array,
      required: true
    },
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
    load() { // 查询所有标签
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
@import "../assets/css/badge.css";

.github-badge a {
  color: #fff;
}
</style>
