<template>
  <div class="home" style="padding: 10px">
    <!--功能-->
    <div style="margin: 10px 0">
      <el-button type="primary" plain @click="add">新增</el-button>
    </div>
    <!--搜索-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="输入类别名称" style="width: 20%" clearable></el-input>
      <el-button type="primary" plain style="margin-left: 5px" @click="findsortName">查询</el-button>
      <el-button type="warning" plain style="margin-left: 5px" @click="resetData">重置</el-button>
    </div>
    <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="正在加载中..."
        border
        stripe
        :header-cell-style="{textAlign: 'center', fontWeight: '600'}"
        :cell-style="{textAlign: 'center'}"
        highlight-current-row
        style="width: 100%">
      <el-table-column
          fixed
          prop="id"
          label="ID"
          type="index"/>
      <el-table-column
          fixed
          prop="sortName"
          label="类别"/>
      <el-table-column fixed="right" label="操作" width="300%">
        <template #default="scope">
          <el-button type="info" plain size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除吗?" @confirm="handDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" plain>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
      <el-dialog v-model="dialogVisible" title="提示" width="30%">
        <el-form :model="form" label-width="20%">
          <el-form-item label="类别">
            <el-input maxlength="20" show-word-limit v-model="form.sortName" style="width: 80%;"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="info" plain @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" plain @click="save">确定</el-button>
      </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import {updateData} from "@/api/sort";
// 转换时间格式
const dayjs = require('dayjs');
import api from '@/api/sort'

export default {
  name: 'Sort',
  components: {},
  data() {
    return {
      form: {},
      dialogVisible: false,
      search: '',
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      tableData: [],
      // 加载
      loading:true
    }
  },
  created() { // 页面加载的时候调用
    this.load()
  },
  methods: {
    // 重置表单
    resetData() {
      this.search = ''
      this.load()
    },
    async updatesort(id, name, status) {
      const param = {
        id: id,
        name: name,
        status: status
      }
      const res = await api.updateData(param)

      if (res.code === 0) {
        this.dialogVisible = false
        this.load()
        this.$message({type: 'success', message: '操作成功！'})
      } else {
        this.$message({type: 'error', message: res.message})
      }
    },
    //时间格式化
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(Number(cellValue)).format('YY-MM-DD HH:mm:ss');
    },
    findsortName() { // 关键字查询
      request.get('/api/v1/sort/findSortName/' + this.search, {
        params: {
          page: this.currentPage,
          size: this.pageSize,
          search: this.search
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.records
        this.total = parseInt(res.data.total)
      })
    },
    load() { // 查询所有类别
      api.getPageList(this.currentPage, this.pageSize, this.search).then(
          response => {
            this.loading = false
            this.tableData = response.data.records
            this.total = parseInt(response.data.total)
          })
    },
    add() { // 新增
      this.dialogVisible = true
      this.form = {} // 清空表单数据，避免影响下一次操作
    },
    save() {
      if (this.form.id) { // 更新
        request.put("/api/v1/sort/update", this.form).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: res.message,
              showClose: true,
              center: true
            })
          } else {
            this.$message({
              type: "error",
              message: res.message,
              showClose: true,
              center: true,
            })
          }
          this.load()  // 刷新表格的数据
          this.dialogVisible = false // 关闭弹窗
        })
      } else { // 新增
        request.post("/api/v1/sort/save", this.form).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.$message({
              type: "success",
              message: "保存成功",
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
          this.load()  // 刷新表格的数据
          this.dialogVisible = false // 关闭弹窗
        })
      }
    },
    handleEdit(row) { // 编辑
      this.form = JSON.parse(JSON.stringify(row)) // form就是独立对象 - 避免浅拷贝的问题
      this.dialogVisible = true
    },
    handDelete(id) { // 删除
      console.log(id)
      request.delete('/api/v1/sort/remove/' + id).then(res => {
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
    handleCurrentChange(PageNum) { // 改变当前页码触发
      this.currentPage = PageNum
      this.load()
    },
  }
}
</script>
