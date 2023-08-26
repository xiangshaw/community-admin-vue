<template>
  <div style="height: 60px; line-height: 60px; border-bottom: 1px solid #ccc; display: flex">
    <div style="width: 200px; padding-left: 30px; font-weight: bold; color: #FAAC7B">后台管理</div>
    <div style="flex: 1"></div>
    <div style="width: 150px">
      <el-dropdown>
        <span class="el-dropdown-link" style="text-align: center;display: grid; align-items: center; justify-content: center; margin: auto;">
          <el-avatar :size="30" :src="image" style="position: relative; top: 0"></el-avatar>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        {{ name }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="$router.push('/person')">个人信息</el-dropdown-item>
<!--            <el-dropdown-item @click="$router.push('/password')">修改密码</el-dropdown-item>-->
            <el-dropdown-item @click="$router.push('/login')">退出系统</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: ["user"],
  data() {
    return {
      form: [],
      name: '',
      image: ''
    }
  },
  created() {
    // 获取缓存信息
    this.form = JSON.parse(JSON.stringify(sessionStorage.getItem("user")) || "{}")
    this.name = JSON.parse(JSON.stringify(sessionStorage.getItem("name")) || "{}").replace("\"","").replace("\"","");
    this.image = JSON.parse(JSON.stringify(sessionStorage.getItem("avatarUrl")) || "{}").replace("\"", "").replace("\"", "");
  }
}
</script>

<style scoped>

</style>
