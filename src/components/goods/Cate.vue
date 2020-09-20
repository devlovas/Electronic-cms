<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体内容区域 -->
    <el-card>

      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type='primary'>添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table :data='cateList' :columns='columns' :selection-type='false' :expand-type='false' show-index index-text='#' border>
      </tree-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      // 商品分类数据列表
      cateList: [],

      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }],
      // 数据条数
      total: 0
    }
  },
  created: function () {
    this.getCateList()
  },
  methods: {
    getCateList: async function () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败!')
      this.cateList = res.data.result
      this.toal = res.data.total
    }
  }
}
</script>

<style lang='less' scoped>
</style>
