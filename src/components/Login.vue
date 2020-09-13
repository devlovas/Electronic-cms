<template>
  <div class='login_container'>
    <div class='login_box'>

      <!-- 头像区域 -->
      <div class='login_title'>
        <h1>产品后台管理系统</h1>
      </div>

      <!-- 表单区域 -->
      <el-form class='login_form' ref='loginFormRef' :model='loginForm' :rules='loginFormRules' label-width='0'>

        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model='loginForm.username' placeholder='请输入账号' prefix-icon='iconfont icon-user'></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input v-model='loginForm.password' placeholder='请输入密码' type='password' prefix-icon='iconfont icon-3702mima'></el-input>
        </el-form-item>

        <el-form-item class='login_btns'>
          <el-button type='primary' @click='subimt'>登录</el-button>
          <el-button type='info' @click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 登录表单
      loginForm: {
        username: 'admin',
        password: '123456'
      },

      // 表单验证
      loginFormRules: {
        // 验证账号是否合法
        username: [
          { required: true, message: '请输入账号', tigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', tigger: 'blur' }
        ],

        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', tigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单内容
    resetLoginForm: function () {
      this.$refs.loginFormRef.resetFields()
    },
    // 提交登录表单
    subimt: function () {
      this.$refs.loginFormRef.validate(async flag => {
        if (!flag) return

        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('用户信息不存在！')

        window.sessionStorage.setItem('token', res.data.token) // 将从服务端获取到的Token 设置到session 中
        this.$message.success('登录成功！')
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .login_container {
    height: 100%;
    background-color: #00afb9;
  }

  .login_box {
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    background-color: #FFF;
    border-radius: 3px;
    position: absolute;
    transform: translate(-50%, -50%);
  }

  .login_title {
    height: 62px;
    padding: 15px;
    line-height: 38px;
    font-size: 15px;
    background-color: #006d77;
    // background-color: #373f51;
    box-sizing: border-box;
    color: #d8dbe2;
    h1 {
      margin: 0;
    }
  }

  .login_btns {
    display: flex;
    justify-content: flex-end;
  }

  .login_form {
    bottom: 0;
    width: 100%;
    position: absolute;
    padding: 0 20px;
    box-sizing: border-box;
  }
</style>
