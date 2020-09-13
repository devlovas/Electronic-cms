<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src='../assets/impulse-logo.png' alt='logo'>
        <h1>产品后台管理系统</h1>
      </div>
      <el-button type='info' @click='logout'>退出系统</el-button>
    </el-header>
    <!--  -->
    <el-container>
      <el-aside :width="menuCollapse ? '64px' : '200px'">
        <div class='toggle-menu' :style="'padding-left:' + (menuCollapse ? '16px' : '165px')">
          <button :class="'el-icon-caret-' + (menuCollapse ? 'right' : 'left')" @click='toggleMenu'></button>
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu :default-active='menuActive' background-color='#373f51' active-text-color="#daa49a" text-color='#faf9f9' :collapse='menuCollapse' :collapse-transition='false' unique-opened router>
          <!-- 一级菜单 -->
          <el-submenu v-for='item in menuList' :key='item.id' :index='item.id.toString()'>
            <template slot='title'>
              <i :class='menuIcons[item.id]'></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for='subItem in item.children' @click='saveMenuActiveState(subItem.path)' :key='subItem.id' :index='subItem.path'>
              <i class='el-icon-menu'></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 正文内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function () {
    return {
      menuList: [], // 菜单列表
      menuActive: '',
      menuCollapse: false, // 菜单折叠状态
      menuIcons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created: function () {
    this.getMenuList()
    this.menuActive = window.sessionStorage.getItem('menuActive')
  },
  methods: {
    // 退出系统
    logout: function () {
      this.$confirm('此操作将退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({ type: 'success', message: '您已安全退出系统!' })
        // 清除客户端中的Token 即退出系统
        window.sessionStorage.clear()
        this.$router.push('/login')
      }).catch(function () {})
    },
    toggleMenu: function () {
      this.menuCollapse = !this.menuCollapse
    },
    // 获取菜单列表
    getMenuList: async function () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 记录菜单项激活状态
    saveMenuActiveState: function (path) {
      window.sessionStorage.setItem('menuActive', path)
      this.menuActive = path
    }
  }
}
</script>

<style lang='less' scoped>
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #58a4b0;
  padding: 0;
  .el-button {
    height: 40px;
    margin: 10px 5px;
    background-color: #a9bcd0;
  }
  > div {
    display: flex;
    align-items: center;
    img {
      height: 102%;
      width: 190px;
    }
    h1 {
      color: #FFF;
      margin-left: 10px;
      font-size: 2.2rem;
    }
  }
}
.el-aside {
  background-color: #373f51;
  .el-menu {
    border: none;
    .el-submenu i{
      margin-right: 10px;
    }
  }
}

.toggle-menu {
  padding: 5px;
  background-color: #333947;
  button {
    color: #999;
    cursor: pointer;
    font-size: 1.5rem;
    background: none;
    outline: none;
    border: none;
    padding: 0;
    &:hover {
      color: #FFF;
    }
  }
}

.el-main {
  background-color: #d8dbe2;
}
</style>
