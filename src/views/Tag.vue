<template>
  <div class="home" style="padding: 10px">
    <!--功能-->
    <div style="margin: 10px 0">
      <el-button type="primary" plain @click="add">新增</el-button>
    </div>
    <!--搜索-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="输入标签名称" style="width: 20%" clearable></el-input>
      <el-button type="primary" plain style="margin-left: 5px" @click="findTagName">查询</el-button>
      <el-button type="warning" plain style="margin-left: 5px" @click="resetData">重置</el-button>
      <el-button type="danger" plain class="btn-add" size="mini" @click="batchRemove()">批量删除</el-button>
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
        style="width: 100%"
        @selection-change="handleSelectionChange">
      <!-- 复选框 handleSelectionChange触发方法-->
      <!--  <el-table-column type="selection" /> 复选框    -->
      <el-table-column
          type="selection"
          fixed
          prop="id"
          label="ID"
          />
      <el-table-column
          prop="sortId"
          :formatter="switchSortsName"
          label="类别"/>
      <el-table-column
          fixed
          prop="tagName"
          label="标签"/>
      <el-table-column fixed="right" label="操作" width="300%">
        <template #default="scope">
          <el-button size="small" type="info" plain @click="handleEdit(scope.row)">编辑</el-button>
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

          <el-form-item label="标签">
            <el-input maxlength="20" show-word-limit v-model="form.tagName" style="width: 80%;"></el-input>
          </el-form-item>

          <el-form-item label="类别">
            <el-select v-model="form.sortId" placeholder="请选择" popper-class="selectStyle">
              <el-option v-for="item in sortsData" :key="item.id"
                         :label="item.sortName"
                         :value="item.id">
              </el-option>
            </el-select>
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
// 转换时间格式
const dayjs = require('dayjs');
import api from '@/api/tag'
import sortApi from '@/api/sort'

export default {
  name: 'Tag',
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
      sortName: '',
      sortsData: [],
      sortId: '',
      sortListName: '', // 列表上类别名称
      sortTotal: 0,
      // 加载
      loading:true
    }
  },
  created() { // 页面加载的时候调用
    this.load()
    this.loadSort()
    this.sortSum()
  },
  methods: {
    sortSum() {
      sortApi.getPageList(this.currentPage, this.pageSize, this.search).then(
          response => {
            this.sortTotal = parseInt(response.data.total)
          })
    },
    switchSortsName(row, column) {
      /*const id = row.sortId;
      const map = new Map();
      const sortTotal = this.sortTotal; // 总数
      for (let i = 1; i <= 0; i++) {
        if(i == sortTotal){
          break;
        }
        request.get('/api/v1/sort/' + i).then(res => {
          map.set(i, res.data.sortName)
          console.log("打印i：" + i)
        })
        if(i > sortTotal){
          break;
        }
      }
      console.log("sortListName：" + this.sortListName)
      console.log("this.sortTotal：" + this.sortTotal)
      console.log("打印map：" + map)*/

      if (row.sortId == 1) {
        return '开发工具'
      }else if (row.sortId == 2){
        return '开发语言'
      }else if (row.sortId == 3){
        return '开发框架'
      }else if (row.sortId == 4){
        return '服务器'
      }else if (row.sortId == 5){
        return '数据库'
      }else if (row.sortId == 6){
        return '其它'
      }
    },
    // 重置表单
    resetData() {
      this.search = ''
      this.load()
    },
    async updateTag(id, name, status) {
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
      return dayjs(cellValue).format('YY-MM-DD HH:mm:ss');
    },
    findTagName() { // 关键字查询
      request.get('/api/v1/tag/findTagName/' + this.search, {
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
    load() { // 查询所有标签
      api.getPageList(this.currentPage, this.pageSize, this.search).then(
          response => {
            this.loading = false
            this.tableData = response.data.records
            this.total = parseInt(response.data.total)
          })
    },
    loadSort() {
      request.get("/api/v1/sort/lists").then(
          response => {
            this.sortsData = response.data
          }
      )
    },
    add() { // 新增
      this.dialogVisible = true
      this.form = {} // 清空表单数据，避免影响下一次操作
    },
    save() {
      if (this.form.id) { // 更新
        request.put("/api/v1/tag/update", this.form).then(res => {
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
        request.post("/api/v1/tag/save", this.form).then(res => {
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
      request.get('/api/v1/tag/del/' + id).then(res => {
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
    // 当多选选项发生变化的时候调用
    handleSelectionChange(selection) {
      this.selectValue = selection
      console.log(this.selectValue)
    },
    // 批量删除
    batchRemove() {
      // 判断是否等于0 也就是没有选择复选框
      if (this.selectValue.length === 0) {
        this.$message.warning('请选择要删除的记录！')
        return
      }
      this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }).then(() => {
        // 点击确定，远程调用ajax
        // 遍历selection，将id取出放入id列表
        const idList = [];
        this.selectValue.forEach(item => {
          idList.push(item.id)
        })
        // 调用api
        return api.batchRemove(idList)
      }).then((response) => {
        this.load()
        this.$message.success(response.message)
      }).catch(error => {
        if (error === 'cancel') {
          this.$message.info('取消删除')
        }
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
<style lang="less">
//下拉框标题文本label
::v-deep .el-form-item__label {
  color: #fff;
  font-weight: 100;
}

//选择框
::v-deep .el-input__wrapper {
  background-color: rgba(26, 84, 128, 0.5);
  width: 130px;
}

//下拉框文字
/deep/ .el-input__inner {
  color: #e1dcdc;
}

//下拉框背景色
.el-popper.is-light.selectStyle {
  background-color: rgba(0, 136, 255, 0.1) !important;
  border: 1px solid #254277 !important;
}

//下拉框的链接小方块
.selectStyle.el-popper[data-popper-placement^=bottom] .el-popper__arrow::before {
  background: rgba(0, 136, 255, 0.1) !important;
  border: 1px solid #254277 !important;
}

.selectStyle.el-popper[data-popper-placement^=top] .el-popper__arrow::before {
  background: #254277 !important;
  border: 1px solid #254277 !important;
}

//鼠标移动上去的选中色
.selectStyle {
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: #2A77C6 !important;
  }

  //下拉框的文本颜色
  .el-select-dropdown__item {
    color: #B3BCCE !important;
  }

  //选中之后的颜色
  .el-select-dropdown__item.selected {
    background: #2A77C6 !important;
  }
}

</style>
