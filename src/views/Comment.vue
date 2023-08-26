<template>
  <div class="home" style="padding: 10px">
    <!--搜索-->
    <div style="margin: 10px 0">
      <el-form label-width="70px">
        <el-col :span="8">
          <el-form-item label="操作时间">
            <!--            <span class="demonstration">默认为 Date 对象</span>
                        <div class="demonstration">值：{{ createTimes }}</div>-->
            <el-date-picker
                v-model="createTimes"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="YYYY-MM-DD HH:mm:ss"
                @change="setValue"
                style="margin-right: 10px;width: 100%;"
            />
          </el-form-item>

        </el-col>
        <span style="font-family: 华文宋体">关键词 </span>
        <el-input v-model="search.keyword" placeholder="输入 作者/标题/内容 查找" style="width: 20%" clearable></el-input>
        <el-button type="primary" plain style="margin-left: 5px" @click="load">查询</el-button>
        <el-button type="primary" plain style="margin-left: 5px" @click="resetData">重置</el-button>
      </el-form>
    </div>
    <!--  表格  -->
    <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="正在加载中..."
        border
        setScrollLeft
        stripe
        max-height="620"
        :header-cell-style="{textAlign: 'center', fontWeight: '600'}"
        :cell-style="{textAlign: 'center'}"
        highlight-current-row
        style="width: 100%">
      <el-table-column
          fixed="left"
          sortable
          prop="id"
          label="ID"
          type="index"/>
      <!--      <el-table-column
                prop="commentator"
                label="评论人ID"/>-->
      <el-table-column
          prop="author"
          label="评论人"/>
      <el-table-column
          fixed
          prop="type"
          label="评论层级"/>
      <!--  parentId 文章ID    -->
      <el-table-column
          fixed
          label="所属文章"
          prop="title"
          width="175"
          :show-overflow-tooltip="true">
        <template #default="scope">
          <el-link type="warning" :underline="false" :href="'http://localhost:221/question/' + scope.row.parentId" target="_blank">
            {{scope.row.title}}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
          fixed
          prop="content"
          label="评论内容"/>
      <!--      <el-table-column
                prop="likeCount"
                label="喜欢数"/>-->
      <el-table-column
          prop="commentCount"
          label="下级评论数"/>
      <el-table-column
          sortable
          prop="gmtCreate"
          label="发布"
          width="150"
          :formatter="dateFormat"
          userable
      />
      <el-table-column fixed="right" label="操作" width="160">
        <template #default="scope">
          <el-button type="info" plain size="small" @click="details(scope.row)">详情</el-button>
          <el-popconfirm title="确认删除吗?" @confirm="handDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" plain>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件   -->
    <div style="margin: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!-- 详情弹窗   -->
      <el-dialog v-model="vis" title="详情" width="50%">
        <div class="dynamicFont" style="text-decoration:none; text-align: left">
          <div v-html="'评论人：' + detail.author"></div>
          <div v-html="'评论所属文章：' + detail.title"></div>
        </div>
        <el-card :body-style="{ padding: '0px' }">
          <div v-html="detail.content" style="min-height: 100px"></div>
        </el-card>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import api from "@/api/comment";
// 转换时间格式
const dayjs = require('dayjs');
export default {
  name: 'Comment',
  data() {
    return {
      form: {},
      dialogVisible: false,
      createTimes: [], // 数组 开始和结束时间
      search: {},
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      tableData: [],
      vis: false, // 详情弹窗
      detail: {}, // 详情
      // 加载
      loading:true
    }
  },
  created() { // 页面加载的时候调用
    this.load()
  },
  methods: {
    setValue(value) {
      console.log("时间戳：" + value)
    },

    // 重置表单
    resetData() {
      this.search = {},
          this.createTimes = []
      this.load()
    },
    details(row) {
      this.detail = row
      this.vis = true // 开启详情弹窗
    },
    //时间格式化
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(Number(cellValue)).format('YY-MM-DD HH:mm:ss');
    },

    load() { // 查询所有
      // createTimes是一个数组 开始和结束
      if (this.createTimes && this.createTimes.length === 2) {
        this.search.gmtCreate = this.createTimes[0]
        this.search.gmtModified = this.createTimes[1]
      }
      api.getPageList(this.currentPage, this.pageSize, this.search).then(
          response => {
            this.loading = false
            this.tableData = response.data.records
            this.total = parseInt(response.data.total)
          }
      )
    },
    handDelete(id) { // 删除
      request.delete('/api/v1/comment/remove/' + id).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: "删除成功",
            showClose: true,
            center: true
          })
        } else {
          this.$message({
            type: "error",
            message: res.message,
            showClose: true,
            center: true
          })
        }
        this.load()  // 删除之后刷新表格的数据
      })
    },
    handleSizeChange(size) { // 改变当前每页的个数触发
      this.pageSize = size
      this.load()
    },
    handleCurrentChange(currentPage) { // 改变当前页码触发
      this.currentPage = currentPage
      this.load()
    },
  }
}
</script>
