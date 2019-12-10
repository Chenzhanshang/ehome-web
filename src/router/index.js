import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import addCommunity from '../components/addCommunity'
import communityInfo from '../components/communityInfo'

Vue.use(VueRouter)

const routes = [
  {
    name:'/',
    path:'/',
    redirect:'/login'
  },
  {
    name:'login',
    path:'/login',
    component:login
  },
  {
    name:'home',
    path:'/home',
    component:home,
    children:[
      {
        path:'addCommunity',
        component:addCommunity
      },
      {
        name:'communityInfo',
        path:'communityInfo',
        component:communityInfo
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
