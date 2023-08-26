<template>
  <div class="homepage-hero-module">
    <div class="video-container">
      <div :style="fixStyle" class="filter">
        <div style="width: 400px; margin: 100px auto">
          <div style="font-size: 30px; text-align: center; padding: 30px 0; color: #333">欢迎登录程序员论坛后台</div>
            <el-form ref="form" :model="form" size="normal" :rules="rules">
              <el-form-item prop="name">账户
                <el-input prefix-icon="" v-model="form.name"></el-input>
                <template #prefix>
                  <el-icon class="el-input__icon">
                    <search/>
                  </el-icon>
                </template>
              </el-form-item>
              <el-form-item prop="password">密码
                <el-input prefix-icon="" v-model="form.password" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <div style="display: flex">
                  <el-input prefix-icon="el-icon-key" v-model="form.validCode" style="width: 50%;"
                            placeholder="请输入验证码"></el-input>
                  <ValidCode @input="createValidCode"/>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button style="width: 100%" type="primary" @click="login">登录</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
<!--        <video :style="fixStyle" autoplay loop muted class="fillWidth" v-on:canplay="canplay">
          <source src="../assets/sea.mp4" type="video/mp4"/>
          浏览器不支持 video 标签，建议升级浏览器。
        </video>-->
      </div>
    </div>
</template>

<script>
import request from "@/utils/request";
import ValidCode from "@/components/ValidCode";

export default {
  name: "Login",
  components: {
    ValidCode,
  },
  data() {
    return {
      fixStyle: '',
      form: {},
      rules: {
        name: [
          {required: true, message: "请输入用户名", trigger: 'blur'}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: 'blur'}
        ]
      },
      validCode: ''
      // 加背景图片
      // bg: {
      //   backgroundImage: "url(" + require("@/assets/bg.jpg") + ")",
      //   backgroundRepeat: "no-repeat",
      //   backgroundSize: "100% 100%"
      // }
    }
  },
  mounted() {
    window.onresize = () => {
      const windowWidth = document.body.clientWidth
      const windowHeight = document.body.clientHeight
      const windowAspectRatio = windowHeight / windowWidth
      let videoWidth
      let videoHeight
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth
        videoHeight = videoWidth * 0.5625
        this.fixStyle = {
          height: windowWidth * 0.5625 + 'px',
          width: windowWidth + 'px',
          'margin-bottom': (windowHeight - videoHeight) / 2 + 'px',
          'margin-left': 'initial'
        }
      } else {
        videoHeight = windowHeight
        videoWidth = videoHeight / 0.5625
        this.fixStyle = {
          height: windowHeight + 'px',
          width: windowHeight / 0.5625 + 'px',
          'margin-left': (windowWidth - videoWidth) / 2 + 'px',
          'margin-bottom': 'initial'
        }
      }
    }
    window.onresize()
  },
  created() {
    // 清除缓存信息
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("avatarUrl")
  },
  methods: {
    canplay() {
      this.vedioCanPlay = true
    },
    // 接收验证码组件提交的 4位验证码
    createValidCode(data) {
      this.validCode = data
    },
    login() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.validCode) {
            this.$message.error("请填写验证码")
            return
          }
          if (this.form.validCode.toLowerCase() !== this.validCode.toLowerCase()) {
            this.$message.error("验证码错误")
            return
          }
          request.post("/api/v1/aduser/login/in", this.form).then(res => {
            if (res.code === 0) {
              this.$message({
                type: "success",
                message: res.message,
                showClose: true,
                center: true
              })
              sessionStorage.setItem("user",JSON.stringify(res.data.user)) // 缓存用户信息
              sessionStorage.setItem("name",JSON.stringify(res.data.name))
              sessionStorage.setItem("avatarUrl",JSON.stringify(res.data.avatarUrl))
              this.$router.push("/")  // 登录成功页面跳转主页
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
      })
    }
  }
}
</script>
<style scoped>
.homepage-hero-module,
.video-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-container .poster img{
  z-index: 0;
  position: absolute;
}

.video-container .filter {
  z-index: 1;
  position: absolute;
  /*background: rgba(0, 0, 0, 0.4);*/
  width: 100%;
}

.fillWidth {
  width: 100%;
}
</style>

