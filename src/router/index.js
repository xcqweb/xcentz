


import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layout/appMain'
import UserLayout from '@/views/user'
import HomeLayout from '@/views/layout/homeLayout'
import authRoute from './modules/authRoute'

Vue.use(Router)

let staticRoute = [
    {
      path:'/401',
      name:'401',
      component:() => import('@/views/errorPage/401.vue'),
      meta:{noRequire:true}
    },
    {
      path:'/404',
      name:'404',
      component:() => import('@/views/errorPage/404.vue'),
      meta:{noRequire:true}
    },
    //登录注册
    {
      path:'/',
      redirect:'/home',
      component:layout,
      children:[
        {
          path:'/login',
          component:UserLayout,
          name:'login',
          children:[
            {
              path:'/',
              name:'login',
              component:() => import('@/views/user/login'),
              meta:{noRequire:true}
            }
          ]
        },
        {
          path:'/regiest',
          component:UserLayout,
          name:'regiest',
          children:[
            {
              path:'/',
              name:'regiest',
              component:() => import('@/views/user/regiest'),
              meta:{noRequire:true}
            }
          ]
        }
      ]
    },
    //首页
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/home',
          component:() => import('@/views/home/charts/chartsHome'),
          name:'home',
          meta:{title:'主页'}
        }
      ]
    },
  ]

  // console.log(authRoute,staticRoute)
let router = new Router({
  mode:'history',
  routes: [...staticRoute]
})

router.beforeEach( (from,to,next) => {
  let token = localStorage.getItem('token')
  if(from.name == null){//解决动态路由(addRoutes)刷新404的问题
    console.log(from,to)
    let re = authRoute.find( (item) => {
      return item.children[0].path === sessionStorage.getItem('currentRoute')
    })
    router.matcher.addRoutes([re,{ path: '*',name:'all', redirect: '/404',meta:{noRequire:true}}])
    router.push({path:sessionStorage.getItem('currentRoute')})
    return
  }
  router.matcher.addRoutes([{ path: '*',name:'all', redirect: '/404',meta:{noRequire:true}}])
  if(token && from.path === '/login'){
    
    
    Vue.$Message.warning({
      content:'您已登录成功,无需重复登录!',
      duration: 3
    })
    next({
      path:'/home'
    })
  }
  
  if(from.meta.noRequire){
    next()
  }else{
    if(token){
      next()
    }else{
      router.push('/login')
    }
  }
})

export default router
