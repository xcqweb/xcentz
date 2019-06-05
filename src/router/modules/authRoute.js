

const HomeLayout = () => import('@/views/layout/homeLayout')

export default[
    //demo
    {
        path: '/',
        component: HomeLayout,
        children:[
          {
            path:'/demo',
            component:() => import('@/views/Demo.vue'),
            name:'demo',
            meta:{title:'演示'}
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
            meta:{title:'个人中心'}
          }
        ]
      },

      //上传excle
      {
        path: '/',
        component: HomeLayout,
        children:[
          {
            path:'/uploadExcle',
            component:() => import('@/views/home/upload/uploadExcle'),
            name:'uploadExcle',
            meta:{title:'上传excle'}
          }
        ]
      },
      //订单情况
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/order',
          component:() => import('@/views/home/charts/chartsHome'),
          name:'order',
          meta:{title:'订单情况'}
        }
      ]
    },
    //销量情况
    {
      path: '/',
      component: HomeLayout,
      children:[
        {
          path:'/sell',
          component:() => import('@/views/home/charts/order'),
          name:'sell',
          meta:{title:'销量情况'}
        }
      ]
    },

    //项目立项
    {
        path: '/',
        component: HomeLayout,
        children:[
          {
            path:'/projectCreate',
            component:() => import('@/views/home/projectManage/projectCreate'),
            name:'projectApproval',
            meta:{title:'项目立项'}
          }
        ]
      },

      //项目审批
    {
        path: '/',
        component: HomeLayout,
        children:[
          {
            path:'/projectApproval',
            component:() => import('@/views/home/projectManage/projectApproval'),
            name:'projectCreate',
            meta:{title:'项目审批'}
          }
        ]
      },
]


// console.log(Vue.$authMenus)