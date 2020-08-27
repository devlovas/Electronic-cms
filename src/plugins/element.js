import Vue from 'vue'

import {
  Form,
  FormItem,
  Message,
  Input,
  Button
} from 'element-ui'

Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

Vue.prototype.$message = Message
