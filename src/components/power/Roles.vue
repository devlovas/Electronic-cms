<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主体内容区域 -->
    <el-card>

      <!-- 添加角色按扭 -->
      <el-row>
        <el-col>
          <el-button type='primary' @click='addRolesVisible = true'>添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data='rolesList' border stripe>
        <el-table-column type='expand'>
          <template slot-scope='scope'>
            <el-row class='bordertop' v-if='scope.row.children.length'>
              <el-col :span='5'  class='tabHead'><strong>一级</strong></el-col>
              <el-col :span='19'>
                <el-row>
                  <el-col :span='5'  class='tabHead'><strong>二级</strong></el-col>
                  <el-col :span='19'  class='tabHead'>
                    <el-row><strong>三级</strong></el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row :class="['borderbottom', i === 0 && 'bordertop']" v-for='(fir, i) in scope.row.children' :key='fir.id'>
              <el-col :span='5' >
                <el-tag closable @close='removeRightsById(scope.row, fir.id)' type='primary'>{{ fir.authName }}</el-tag>
                <i class='el-icon-arrow-right'></i>
              </el-col>
              <el-col :span='19'>
                <el-row :class="[i !== 0 && 'bordertop']" v-for='(sec, i) in fir.children' :key='sec.id'>
                  <el-col :span='5'>
                    <el-tag @close='removeRightsById(scope.row, sec.id)' closable removeRightsByIdtype='success'>{{ sec.authName }}</el-tag>
                    <i class='el-icon-arrow-right'></i>
                  </el-col>
                  <el-col :span='19'>
                    <el-row>
                      <el-col>
                        <el-tag closable @close='removeRightsById(scope.row, thr.id)' type='info' v-for='thr in sec.children' :key='thr.id'>{{ thr.authName }}</el-tag>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type='index' label='#'></el-table-column>
        <el-table-column label='名称' prop='roleName'></el-table-column>
        <el-table-column label='描述' prop='roleDesc'></el-table-column>
        <el-table-column label='操作' width='287px'>
          <template slot-scope='scope'>
            <el-button size='mini' type='primary' icon='el-icon-edit' @click='showEditRoleDialog(scope.row)'>编辑</el-button>
            <el-button size='mini' type='danger' icon='el-icon-delete' @click='deleteRole(scope.row)'>删除</el-button>
            <el-button size='mini' type='warning' icon='el-icon-setting' @click='showSetRightsDialog(scope.row)'>分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog title='添加角色' :visible.sync='addRolesVisible' @close='$refs.addRoleFormRef.resetFields()'>
      <el-form :model='addRoleForm' :rules='addRoleFormRules' ref='addRoleFormRef' label-width='80px'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='addRoleForm.roleName' placeholder='请输入角色名称'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='addRoleForm.roleDesc' placeholder='请输入角色描述'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addRolesVisible = false'>取消</el-button>
        <el-button type='primary' @click='addRolesSubimt'>确认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title='修改角色' :visible.sync='editRolesVisible' @close='$refs.editFoleFormRef.resetFields()'>
      <el-form :model='editRoleForm' :rules='editFoleFormRules' ref='editFoleFormRef' label-width='80px'>
        <el-form-item label='角色名称' prop='roleName'>
          <el-input v-model='editRoleForm.roleName' placeholder='请输入角色名称'></el-input>
        </el-form-item>
        <el-form-item label='角色描述' prop='roleDesc'>
          <el-input v-model='editRoleForm.roleDesc' placeholder='请输入角色描述'></el-input>
        </el-form-item>
      </el-form>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='editRolesVisible = false'>取消</el-button>
        <el-button type='primary' @click='editRolesSubimt'>确认</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限功能面板 -->
    <el-dialog title='分配权限' :visible.sync='rightsDialogVisible' @close='rightsIds = []'>
      <el-tree
      node-key='id'
      show-checkbox
      ref='rightsRef'
      :data="rightsList"
      :default-expanded-keys='rightsIds'
      :default-checked-keys='rightsIds'
      :props="rightsProps">
      </el-tree>
      <span slot='footer' class='dialog-footer'>
        <el-button @click='rightsDialogVisible = false'>取消</el-button>
        <el-button type='primary' @click='rightsSubimt'>确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      rightsIds: [],
      // 角色列表
      rolesList: [],
      // 权限列表
      rightsList: [],

      rightsProps: {
        children: 'children',
        label: 'authName'
      },
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50个字符之间', trigger: 'blur' }
        ]
      },
      editFoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10个字符之间', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50个字符之间', trigger: 'blur' }
        ]
      },
      addRolesVisible: false,
      editRolesVisible: false,
      // 分配权限功能面板可见状态
      rightsDialogVisible: false
    }
  },
  created: function () {
    this.getRolesList()
    this.tagTogglerAnim()
  },
  methods: {
    deleteRole: function (roleRow) {
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${roleRow.id}`)
        if (res.meta.status !== 200) return this.$message.error('操作失败！ 请稍后再试...')
        this.$message({ type: 'success', message: '操作成功!' })
        this.getRolesList()
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消操作' })
      })
    },
    getRolesList: async function () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('数据获取失败!')
      this.rolesList = res.data
    },
    tagTogglerAnim: function () {
      // 标签移入移出动画效果
      const timer = setInterval(function () {
        const teableExpand = document.querySelectorAll('.el-table__expand-icon')
        if (teableExpand.length) {
          teableExpand.forEach(elem => {
            elem.onclick = function () {
              document.querySelectorAll('.el-table__expanded-cell .el-tag').forEach(tagElem => {
                tagElem.children[0].style.width = '0'
                tagElem.children[0].style.opacity = '0'
                tagElem.onmouseenter = e => {
                  let count = 0
                  const timer2 = setInterval(function () {
                    tagElem.children[0].style.width = ++count + 'px'
                    tagElem.children[0].style.opacity = count * 0.05
                    if (count === 16) clearInterval(timer2)
                  }, 5)
                }
                tagElem.onmouseleave = e => {
                  let count = 16
                  const timer3 = setInterval(function () {
                    tagElem.children[0].style.width = --count + 'px'
                    tagElem.children[0].style.opacity = count * 0.05
                    if (count === 0) clearInterval(timer3)
                  }, 5)
                }
              })
            }
          })
          clearInterval(timer)
        }
      }, 100)
    },
    // 删除角色权限
    removeRightsById: function (role, rightsId) {
      this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
        if (res.meta.status !== 200) return this.$message.error('操作失败！ 请稍后再试...')
        this.$message({ type: 'success', message: '操作成功!' })
        role.children = res.data
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消操作' })
      })
    },
    rightsSubimt: async function () {
      const rightsRef = this.$refs.rightsRef
      const checkedKeys = rightsRef.getCheckedKeys().concat(rightsRef.getHalfCheckedKeys())
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: checkedKeys.join(',') })
      if (res.meta.status !== 200) return this.$message.error('操作失败！ 请稍后再试...')
      this.$message.success('操作成功！')
      this.rightsDialogVisible = false
      this.getRolesList()
    },
    addRolesSubimt: async function () {
      this.$refs.addRoleFormRef.validate(async vaild => {
        if (!vaild) return this.$message.error('请按要求填写！')
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) return this.$message.error('请求失败！ 请稍后再试...')
        this.$message.success('操作成功！')
        this.addRolesVisible = false
        this.getRolesList()
      })
    },
    editRolesSubimt: async function () {
      this.$refs.editFoleFormRef.validate(async vaild => {
        if (!vaild) return this.$message.error('请按要求填写！')
        const { data: res } = await this.$http.put(`roles/${this.editRoleForm.roleId}`, this.editRoleForm)
        if (res.meta.status !== 200) return this.$message.error('请求失败！ 请稍后再试...')
        this.$message.success('操作成功！')
        this.editRolesVisible = false
        this.getRolesList()
      })
    },
    getRightsThrId: function (node, arr) {
      if (!node.children) { return arr.push(node.id) }
      node.children.forEach(item => this.getRightsThrId(item, arr))
    },
    showEditRoleDialog: function (roleRow) {
      this.editRoleForm.roleId = roleRow.id
      this.editRoleForm.roleName = roleRow.roleName
      this.editRoleForm.roleDesc = roleRow.roleDesc
      this.editRolesVisible = true
    },
    showSetRightsDialog: async function (data) {
      this.roleId = data.id
      this.rightsDialogVisible = true
      // 获取权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$messgae.error('数据获取失败！')
      this.getRightsThrId(data, this.rightsIds)
      this.rightsList = res.data
    }
  }
}
</script>

<style lang='less' scoped>
.el-table {
  margin-top: 15px;
  .el-tag {
    margin: 8px 0;
    margin-left: 15px;
    margin-right: 5px;
  }
  .el-row {
    display: flex;
    align-items: center;
    border-left: 1px solid #ccc;
  }
  .tabHead {
    font-size: 18px;
    background: #eef2f7;
    border-right: none;
    border-top: none;
    color: #777;
    strong {
      margin-left: 10px;
    }
  }
  .bordertop {
    border-top: 1px solid #ccc;
  }
  .borderbottom {
    border-bottom: 1px solid #ccc;
  }
}
</style>
