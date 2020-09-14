<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表数据 -->
    <el-card>
      <el-table :data='rightsList' border stripe>
        <el-table-column type='index' label='#'></el-table-column>
        <el-table-column label='名称' prop='authName'></el-table-column>
        <el-table-column label='路径' prop='path'></el-table-column>
        <el-table-column label='等级' prop='level'>
          <template slot-scope='scope'>
            <el-tag v-if="scope.row.level === '0'" type='primary'>一级</el-tag>
            <el-tag v-if="scope.row.level === '1'" type='success'>二级</el-tag>
            <el-tag v-if="scope.row.level === '2'" type='info'>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created: function () {
    this.getRightsList()
  },
  methods: {
    getRightsList: async function () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error('数据获取失败！')
      this.rightsList = res.data
    }
  }
}
</script>

<style lang='less' scoped>
</style>
