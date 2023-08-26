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
      <el-table-column
          fixed
          prop="author"
          width="175"
          label="作者"/>
      <el-table-column
          fixed
          prop="title"
          label="标题"/>
      <el-table-column
          fixed
          prop="tags"
          label="标签"/>
      <el-table-column
          prop="commentCount"
          label="评论数"/>
      <!--      <el-table-column
                prop="likeCount"
                label="喜欢数"/>-->
      <el-table-column
          prop="viewCount"
          label="浏览量"/>
      <el-table-column
          sortable
          prop="gmtCreate"
          label="发布"
          width="150"
          :formatter="dateFormat"
      />
      <el-table-column
          sortable
          prop="gmtModified"
          label="修改"
          width="150"
          :formatter="dateFormat"
          userable
      />
      <el-table-column label="置顶" width="150">
        <template slot="top" #default="scope">
          <el-switch
              active-text="置顶"
              inactive-text="撤下"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.top"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchTop(scope.row)"
          />
        </template>
      </el-table-column>
<!--      <el-table-column fixed prop="status" label="状态" sortable min-width="70%" align="center">
        <template #default="scope">
          <div v-if="scope.row.status === false" style="color: #4dc820;font-weight: bold">正常</div>
          <div v-if="scope.row.status === true" style="color:red;font-weight: bold">禁用</div>
        </template>
      </el-table-column>-->
      <el-table-column label="状态" width="150">
        <template slot="status" #default="scope">
          <el-switch
              active-text="正常"
              inactive-text="封禁"
              :active-value="false"
              :inactive-value="true"
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="switchStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="160">
        <template #default="scope">
          <!--type="text"-->
          <!--    0 false正常  1 true封禁      -->
<!--          <el-button
              size="small"
              type="success"
              plain
              class="el-button&#45;&#45;primary-text"
              :disabled="!scope.row.status"
              @click="updateQuestionStatus(scope.row.id, scope.row.author, false)">正常
          </el-button>
          <el-button
              size="small"
              type="warning"
              plain
              class="el-button&#45;&#45;danger-text"
              :disabled="scope.row.status"
              @click="updateQuestionStatus(scope.row.id, scope.row.author, true)">封禁
          </el-button>-->
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
          <div v-html="'标题：' + detail.title"></div>
          <div v-html="'作者：' + detail.author"></div>
          <div v-html="'标签：' + detail.tags"></div>
          <div v-html="'发布时间：' + detail.gmtCreate"></div>
        </div>
        <el-card :body-style="{ padding: '0px' }">
          <div v-html="detail.description" style="min-height: 100px"></div>
        </el-card>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import api from "@/api/news";
// 转换时间格式
const dayjs = require('dayjs');
export default {
  name: 'News',
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
    setValue(value){
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
    // 切换置顶状态
/*    switchTop: function (callback){
    },*/
    switchTop(row) {
      // 判断，如果当前用户可用，修改禁用
      // 首先通过row取到每行status值，可用切换位不可用，不可用切换为可用
      row.top = row.top === 0 ? 0 : 1
      api.updateTop(row.id, row.top).then(response => {
        if (response.code) {
          // 提示
          this.$message.success(response.message || '操作成功')
          // 刷新
          this.load()
        }
      })
    },
    switchStatus(row) {
      // 判断，如果当前用户可用，修改禁用
      // 首先通过row取到每行status值，可用切换位不可用，不可用切换为可用
      row.status = row.status === true ? true : false
      api.questionGitStatus(row.id, row.status).then(response => {
        if (response.code) {
          // 提示
          this.$message.success(response.message || '操作成功')
          // 刷新
          this.load()
        }
      })
    },
    // 切换问题状态
    async updateQuestionStatus(id, author, status) {
      const param = {
        id: id,
        name: author,
        status: status
      }
      const res = await api.questionStatus(param)
      if (res.code === 0) {
        this.dialogVisible = true
        this.load()
        this.$message({type: 'success', message: '操作成功！'})
      } else {
        this.$message({type: 'error', message: res.message})
      }
    },
/*    topFormat(row, column) {
      if (row.top === 0) {
        return '否'
      } else if (row.top === 1) {
        return '是'
      }
    },*/
    statusFormat(row, column) {
      if (row.status === true) {
        return '封禁'
      } else {
        return '正常'
      }
    },
    //时间格式化
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(Number(cellValue)).format('YY-MM-DD HH:mm:ss');
    },
    findUserName() { // 关键字查询
      request.get('/api/v1/aduser/findUserName/' + this.search, {
        params: {
          page: this.currentPage,
          size: this.pageSize,
          search: this.search
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = parseInt(res.data.total)
      })
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
      request.delete('/api/v1/question/remove/' + id).then(res => {
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
