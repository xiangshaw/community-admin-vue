<template>
  <div>
    <el-card style="width: 40%; margin: 10px;">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
            style="text-align: center;display: grid; align-items: center; justify-content: center; margin: auto;"
            label-width="0">
          <el-upload
              class="avatar-uploader"
              action="http://localhost:221/api/v1/aduser/adUpload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户ID" v-if='condition'>
          <el-input v-model="form.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.bio" show-word-limit autosize maxlength="100" type="textarea" clearable></el-input>
        </el-form-item>
        <!--        <el-form-item label="注册时间">
                  <el-input
                      name="myTime"
                      v-model="form.gmtCreate"
                      :formatter="dateFormat"
                      disabled>
                  </el-input>
                </el-form-item>
                <el-form-item label="修改时间">
                  <el-input
                      v-model="form.gmtModified"
                      :formatter="dateFormat"
                      disabled>
                  </el-input>
                </el-form-item>
                <el-form-item label="登录时间">
                  <el-input
                      v-model="form.loginTime"
                      :formatter="dateFormat"
                      disabled>
                  </el-input>
                </el-form-item>-->
        <!--        <el-form-item label="密码">-->
        <!--          <el-input v-model="form.password" show-password></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="update">保存</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import request from "@/utils/request";
// 转换时间格式
const dayjs = require('dayjs');
// var timeCycle = Date.parse($('#myTime').val())
export default {
  name: "Person",
  data() {
    return {
      form: {},
      fileServerUrl: '' // 文件地址
    }
  },
  created() {
    let str = sessionStorage.getItem("user") || "{}"
    this.form = JSON.parse(str)
  },
  methods: {
    //时间格式化
    dateFormat(row, column, cellValue, index) {
      if (cellValue === undefined || cellValue === null) {
        return "";
      }
      return dayjs(cellValue).format('YY-MM-DD HH:mm:ss');
    },
    handleAvatarSuccess(res) {
      this.form.avatarUrl = res.data
      sessionStorage.setItem("avatarUrl",res.data)
      this.$message.success("上传成功")
      // this.update()
    },
    update() {
      request.put("/api/v1/aduser/adUserInfo", this.form).then(res => {
        console.log("更新的数据：" + res)
        if (res.code === 0) {
          this.$message({
            type: "success",
            message: res.message,
            showClose: true,
            center: true
          })
          // 更新缓存信息
          sessionStorage.setItem("user", JSON.stringify(this.form))
          // 触发Layout更新用户信息
          this.$emit("userInfo")
        } else {
          this.$message({
            type: "error",
            message: res.message,
            showClose: true,
            center: true
          })
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>
