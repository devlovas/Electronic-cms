import Vue from 'vue'

import {
  Form,
  FormItem,
  Message,
  Input,
  Button,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItemGroup,
  Breadcrumb,
  BreadcrumbItem,
  MenuItem,
  Submenu,
  Table,
  TableColumn,
  Pagination,
  MessageBox,
  Tooltip,
  Dialog,
  Switch,
  Card,
  Row,
  Tag,
  Col
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Switch)
Vue.use(Card)
Vue.use(Row)
Vue.use(Tag)
Vue.use(Col)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
