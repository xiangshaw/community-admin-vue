<template>
  <div class="home" style="padding: 10px">
    <!--功能-->
    <div style="margin: 10px 0">
      <el-button type="primary" plain @click="add">新增</el-button>
      <!--      <el-upload
                action="http://localhost:2022/api/v1/user/import"
                :on-success="handleUploadSuccess"
                :show-file-list=false
                :limit="1"
                accept='.xlsx'
                style="display: inline-block; margin: 0 10px"
            >
              <el-button type="primary">导入</el-button>
            </el-upload>-->
      <el-button type="primary" plain @click="exportUser">导出</el-button>
    </div>
    <!--搜索-->
    <div style="margin: 10px 0">
      <el-input v-model="search" placeholder="输入用户名查找" style="width: 20%" clearable></el-input>
      <el-button type="primary" plain style="margin-left: 5px" @click="findUserName">查询</el-button>
      <el-button type="primary" plain style="margin-left: 5px" @click="resetData">重置</el-button>
    </div>
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
          prop="accountId"
          label="身份ID"/>
      <el-table-column
          fixed
          prop="name"
          width="175"
          label="用户名"/>
      <el-table-column
          prop="phone"
          label="手机号"/>
      <el-table-column
          sortable
          prop="sex"
          :formatter="genderFormat"
          label="性别"/>
      <el-table-column
          label="头像">
        <template #default="scope">
          <div class="demo-image__preview">
            <el-image
                style="width: 60px; height: 60px;"
                :src="scope.row.avatarUrl"
                :preview-src-list="[scope.row.avatarUrl]"
                preview-teleported="true">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <!--      <el-table-column
                prop="status"
                :cell-style="cellStyle"
                :formatter="statusFormat"
                label="状态"/>-->
      <el-table-column fixed prop="status" label="状态" sortable min-width="70%" align="center">
        <template #default="scope">
          <div v-if="scope.row.status === false" style="color: #4dc820;font-weight: bold">正常</div>
          <div v-if="scope.row.status === true" style="color:red;font-weight: bold">禁用</div>
        </template>
      </el-table-column>
      <!--      <el-table-column
                prop="certification"
                :formatter="certificationFormat"
                label="认证"/>-->
      <el-table-column
          sortable
          prop="certification"
          label="认证">
        <template #default="scope">
          <div v-if="scope.row.certification === false" style="color: #4dc820;font-weight: bold">是</div>
          <div v-if="scope.row.certification === true" style="color:red;font-weight: bold">否</div>
        </template>
      </el-table-column>
      <el-table-column
          prop="gmtCreate"
          label="创建时间"
          userable
          sortable
          :formatter="dateFormat"
      />
      <el-table-column
          sortable
          prop="gmtModified"
          label="修改时间"
          :formatter="dateFormat"
          userable
      />
      <el-table-column
          sortable
          prop="loginTime"
          label="登录时间"
          :formatter="dateFormat"
          userable
      />
      <el-table-column fixed="right" label="操作" width="300%">
        <template #default="scope">
          <el-button type="info" plain size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <!--type="text"-->
          <el-button
              size="small"
              type="success"
              plain
              class="el-button--primary-text"
              :disabled="!scope.row.status"
              @click="updateUser(scope.row.id, scope.row.name, false)">正常
          </el-button>
          <!--    0 false正常  1 true封禁      -->
          <el-button
              size="small"
              type="warning"
              plain
              class="el-button--danger-text"
              :disabled="scope.row.status"
              @click="updateUser(scope.row.id, scope.row.name, true)">封禁
          </el-button>
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
          <el-form-item label="手机号">
            <el-input maxlength="11" show-word-limit autosize type="textarea" v-model="form.phone"
                      style="width: 80%;"></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input maxlength="20" show-word-limit v-model="form.name" style="width: 80%;"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input maxlength="100" type="textarea" show-word-limit v-model="form.bio" style="width: 80%;"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="form.sex" :label="false" size="large" border>男</el-radio>
            <el-radio v-model="form.sex" :label="true" size="large" border>女</el-radio>
          </el-form-item>
          <!--          <el-form-item label="头像"><el-input maxlength="255" show-word-limit autosize type="textarea" v-model="form.image" style="width: 80%;"></el-input></el-form-item>-->
          <el-form-item label="头像">
            <el-upload
                ref="upload"
                action="http://localhost:221/api/v1/aduser/adUpload"
                :on-success="filesUploadSuccess"
                multiple
                :limit="1">
              <el-button size="small" type="primary" plain>点击上传</el-button>
            </el-upload>
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
import api from "@/api/user";
// 转换时间格式
const dayjs = require('dayjs');
export default {
  name: 'user',
  data() {
    return {
      form: {},
      dialogVisible: false,
      search: '',
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      tableData: [],
      fileServerUrl: '', // 文件地址
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

    // 文件上传
    filesUploadSuccess(res) {
      console.log(res)
      this.form.avatarUrl = res.data
    },

    async updateUser(id, name, status) {
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
    genderFormat(row, column) {
      if (row.sex === false) {
        return '男'
      } else if (row.sex === true) {
        return '女'
      }
    },
    // 表体字体颜色设置
    /***
     * row为某一行的除操作外的全部数据
     * column为某一列的属性
     * rowIndex为某一行（从0开始数起）
     * columnIndex为某一列（从0开始数起）
     */
    cellStyle({row, column, rowIndex, columnIndex}) {
      // 状态列字体颜色
      if (row.status === false && columnIndex === 0) {
        return "color: #0CB618";
      } else if (row.status === true && columnIndex === 0) {
        return "color: #EA1B29";
      } else {
        return "";
      }
    },
    statusFormat(row, column) {
      if (row.status === true) {
        return '封禁'
      } else {
        return '正常'
      }
    },
    certificationFormat(row, column) {
      if (row.certification === false) {
        return '是'
      } else {
        return '否'
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
        console.log(res)
        this.tableData = res.data.records
        this.total = parseInt(res.data.total)
      })
    },
    load() { // 查询所有
      request.post("/api/v1/aduser/list", {
        page: this.currentPage,
        size: this.pageSize,
      }).then(res => {
        this.loading = false
        this.tableData = res.data
        this.fileServerUrl = res.host
        this.total = parseInt(res.total)
      })
    },

    handleUploadSuccess(res) {
      if (res.code === "0") {
        this.$message.success("导入成功")
        this.load()
      }
    },
    exportUser() {
      location.href = "http://localhost:221/api/v1/aduser/export";
    },

    add() { // 新增
      this.dialogVisible = true
      this.form = {} // 清空表单数据，避免影响下一次操作
      this.$refs['upload'].clearFiles() // 清除上传历史文件列表
    },
    save() {
      if (this.form.id) { // 更新
        request.post("/api/v1/aduser/update", this.form).then(res => {
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
        request.post("/api/v1/aduser/save", this.form).then(res => {
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
      this.$nextTick(() => { // 将回调延迟到下次 DOM更新循环之后执行
        this.$refs['upload'].clearFiles() // 清除上传历史文件列表
      })
    },
    handDelete(id) { // 删除
      console.log(id)
      request.delete('/api/v1/aduser/remove/' + id).then(res => {
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
