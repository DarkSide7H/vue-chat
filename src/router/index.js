import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    // 新建路由 begin
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/components/demo')
    }
    // 新建路由 end
  ]
})
