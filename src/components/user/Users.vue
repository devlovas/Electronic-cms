<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容展示 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入内容' v-model='queryInfo.query' @clear='getUserList' clearable>
            <el-button slot='append' icon='el-icon-search' @click='getUserList'></el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
         <el-button type='primary' @click='addUserBoxVisible = true'>添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data='userList' border stripe>
        <el-table-column type='index' label='#'  fixed></el-table-column>
        <el-table-column label='姓名' prop='username'  fixed></el-table-column>
        <el-table-column label='角色' prop='role_name'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='日期' prop='create_time'></el-table-column>
        <el-table-column label='状态'>
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.mg_state' @change='userStateChanged(scope.row)'></el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作' fixed='right' width='175'>
          <template slot-scope='scope'>
            <el-button type='primary' icon='el-icon-edit' size='mini' @click='editUser(scope.row.id)'></el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini' @click='removeUserById(scope.row.id)'></el-button>
            <el-tooltip effect='dark' content='分配权限' placement='top' :enterable='false'>
              <el-button type='warning' icon='el-icon-setting' size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"></el-pagination>
    </el-card>
    <!-- 添加用户功能面板 -->
    <el-dialog title='添加用户' :visible.sync='addUserBoxVisible' @close='$refs.addUserFormRef.resetFields()' width='50%'>
      <el-form :model='addUserForm' :rules='addUserFormRules' ref='addUserFormRef' label-width='60px'>
        <el-form-item label='账号' prop='username'>
          <el-input v-model='addUserForm.username' placeholder='请输入账号'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='password'>
          <el-input v-model='addUserForm.password' type='password' placeholder='请输入密码'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='addUserForm.email' placeholder='请输入邮箱'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input v-model='addUserForm.mobile' placeholder='请输入手机'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addUserBoxVisible = false'>取消</el-button>
        <el-button type='primary' @click='addUserSubmit'>确定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户功能面板 -->
    <el-dialog title='修改用户' :visible.sync='editUserBoxVisible' @close='$refs.editUserFormRef.resetFields()' width='50%'>
      <el-form :model='editUserForm' :rules='editUserFormRules' ref='editUserFormRef' label-width='60px'>
        <el-form-item label='账号'>
          <el-input v-model='editUserForm.username' disabled></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='editUserForm.email' placeholder='请输入邮箱'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input v-model='editUserForm.mobile' placeholder='请输入手机'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='editUserBoxVisible = false'>取消</el-button>
        <el-button type='primary' @click='editUserFormSubmit'>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    const checkEmail = (rules, value, cb) => {
      const regEmail = /^([A-z0-9])+@([A-z0-9])+(\.[A-z0-9])+/
      if (regEmail.test(value)) return cb()
      cb(new Error('请输入合法的邮箱地址'))
    }
    const checkMobile = (rules, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]14[57])[0-9]{8}$/
      if (regMobile.test(value)) return cb()
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 请求数据所携带参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      // 添加用户表单数据
      addUserForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      // 修改用户表单数据
      editUserForm: {},
      // 添加用户表单规则验证
      addUserFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15个字符之间', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 修改用户表单规则验证
      editUserFormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符之间', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      addUserBoxVisible: false, // 添加用户功能面板可见状态
      editUserBoxVisible: false, // 修改用户功能面板可见状态
      userList: [],
      total: 0
    }
  },
  created: function () {
    this.getUserList()
  },
  methods: {
    editUser: async function (userId) {
      const { data: res } = await this.$http.get('users/' + userId)
      if (res.meta.status !== 200) return this.$message.error('查询数据失败！')
      this.editUserBoxVisible = true
      this.editUserForm = res.data
    },
    parseDate: function (timestamp) {
      const date = new Date(timestamp)
      const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      return `${date.getFullYear()}-${M}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    },
    // 获取用户列表
    getUserList: async function () {
      const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败!')
      // 将时间戳解析为日期时间格式
      res.data.users.forEach(item => { item.create_time = this.parseDate(item.create_time) })
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 删除用户
    removeUserById: function (userId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + userId)
        if (res.meta.status !== 200) return this.$message.error('删除用户失败！ 请稍后再试...')
        this.$message({ type: 'success', message: '删除成功!' })
        this.getUserList()
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' })
      })
    },
    // 监听分页变更事件
    handleSizeChange: function (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码变更事件
    handleCurrentChange: function (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听用户状态变更事件
    userStateChanged: async function (userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status === 200) { return this.$message.success('更新用户状态成功!') }
      this.$message.error('更新用户状态失败!')
      userInfo.mg_state = !userInfo.mg_state
    },
    // 添加用户表单的提交事件处理函数
    addUserSubmit: function () {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return false
        // 向服务端提交添加用户请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败!')
        this.$message.success('添加用户成功!')
        this.addUserBoxVisible = false
        this.getUserList()
      })
    },
    editUserFormSubmit: function () {
      this.$refs.editUserFormRef.validate(async vaild => {
        if (!vaild) return this.$message.error('请按要求填写！')
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
        if (res.meta.status !== 200) return this.$message.error('数据更新失败！ 请稍后再试...')
        this.$message.success('数据更新成功！')
        this.editUserBoxVisible = false
        this.getUserList()
      })
    }
  }
}
</script>

<style lang='less' scoped>
.el-breadcrumb {
  font-size: 12px;
}
.el-table {
  margin: 15px 0;
  font-size: 12px;
}
</style>
