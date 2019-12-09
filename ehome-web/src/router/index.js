import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login'
import home from '../components/home'
import addCommunity from '../components/addCommunity'

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
