<template>
  <div>
    <!-- :default-openeds="['1']" 默认展开 -->
    <el-menu
        style="width: 200px; min-height:calc(100vh - 2px)"
        :default-active="this.$route.path"
        router
        :default-openeds="['1']"
        class="el-menu-vertical-demo">
      <el-sub-menu index="1">
        <template #title>程序员论坛后台</template>
        <el-menu-item index="/home"><el-icon style="color:#F5319D"><Odometer /></el-icon>主页</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/sort"><el-icon style="color:#57A9FB"><Menu /></el-icon>类别管理</el-menu-item>
      <el-menu-item index="/tag"><el-icon style="color:#F53F3F"><Discount /></el-icon>标签管理</el-menu-item>
      <el-menu-item index="/user"><el-icon style="color:#E865DF"><User/></el-icon>用户管理</el-menu-item>
      <el-menu-item index="/news"><el-icon style="color:#FF7D00"><Document /></el-icon>文章管理</el-menu-item>
      <el-menu-item index="/comment"><el-icon style="color:#23C343"><ChatDotSquare /></el-icon>评论管理</el-menu-item>
      <el-menu-item index="/badge"><el-icon style="color:#9FDB1D"><Medal /></el-icon>底栏徽章管理</el-menu-item>
      <el-menu-item index="/person"><el-icon style="color:#14C9C9"><Postcard /></el-icon>个人信息</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside"
}
</script>

<style scoped>

</style>
