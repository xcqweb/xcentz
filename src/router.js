import Vue from 'vue'
import Router from 'vue-router'
import layout from '@/views/layout/appMain'
import Demo from '@/views/Demo.vue'
import UserLayout from '@/views/user'
import HomeLayout from '@/views/layout/homeLayout'
Vue.use(Router)

let router = new Router({
  mode:'history',
  routes: [
    //登录注册
    {
      path:'/',
      redirect:'/home',
      component:layout,
      children:[
        {
          path:'login',
          component:UserLayout,
          name:'login',
          children:[
            {
              path:'/',
              component:() => import('@/views/user/login'),
              meta:{noRequire:true}
            }
          ]
        },
        {
          path:'regiest',
          component:UserLayout,
          name:'login',
          children:[
            {
              path:'/',
              component:() => import('@/views/user/regiest'),
              meta:{noRequire:true}
            }
          ]
        }
      ]
    },

    //demo
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/demo',
          component:Demo,
          name:'home',
          meta:{title:'演示'}
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
          component:() => import('@/views/home/setting/userManage'),
          name:'home',
          meta:{title:'主页'}
        }
      ]
    },

    //系统设置
    //系统用户管理
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/usermanage',
          component:() => import('@/views/home/setting/userManage'),
          name:'usermanage',
          meta:{title:'系统用户管理'}
        }
      ]
    },
    //动态菜单权限分配
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/menuconfig',
          component:() => import('@/views/home/setting/menuConfig'),
          name:'menuconfig',
          meta:{title:'动态菜单权限配置'}
        }
      ]
    },

    //系统角色管理
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/rolemanage',
          component:() => import('@/views/home/setting/roleManage'),
          name:'rolemanage',
          meta:{title:'系统角色管理'}
        }
      ]
    },

    //权限模块管理
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/modulemanage',
          component:() => import('@/views/home/setting/moduleManage'),
          name:'modulemanage',
          meta:{title:'权限模块管理'}
        }
      ]
    },

    //用户中心
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/usercenter',
          component:() => import('@/views/home/usercenter/user'),
          name:'usercenter',
          meta:{title:'用户中心'}
        }
      ]
    },
  ]
})

router.beforeEach( (from,to,next) => {
  let token = localStorage.getItem('token')

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
