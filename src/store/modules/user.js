import { login, logout, getInfo } from '@/api/user'
import { register as registerFnc, login_from_code, user_info } from '@/api/project'

import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import Layout from '@/layout'
// import router, { resetRouter } from '@/router'

// import {$message} from 'element-ui'
const state = {
  token: getToken(),
  userInfo: {}
}

let routeData = [
  {
    path: '/userCenter',
    component: Layout,
    children: [
      {
        path: 'userCenter',
        component: () => import('@/views/userCenter/index'),
        name: '个人中心',
        meta: { title: '个人中心', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },
  {
    path: '/collectionOrder',
    component: Layout,
    children: [
      {
        path: 'collectionOrder',
        component: () => import('@/views/collectionOrder/index'),
        name: '收款订单',
        meta: { title: '收款订单', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },
  {
    path: '/rechargeOrder',
    component: Layout,
    children: [
      {
        path: 'rechargeOrder',
        component: () => import('@/views/rechargeOrder/index'),
        name: '充值订单',
        meta: { title: '充值订单', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },
  {
    path: '/withdrawal',
    component: Layout,
    children: [
      {
        path: 'withdrawal',
        component: () => import('@/views/withdrawal/index'),
        name: '提现订单',
        meta: { title: '提现订单', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },
  {
    path: '/fundDetail',
    component: Layout,
    children: [
      {
        path: 'fundDetail',
        component: () => import('@/views/fundDetail/index'),
        name: '资金明细',
        meta: { title: '资金明细', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },


  {
    path: '/personalData',
    component: Layout,
    children: [
      {
        path: 'personalData',
        component: () => import('@/views/personalData/index'),
        name: '个人资料',
        meta: { title: '个人资料', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },

  {
    path: '/workOrder',
    component: Layout,
    children: [
      {
        path: 'workOrder',
        component: () => import('@/views/workOrder/index'),
        name: '我的工单',
        meta: { title: '我的工单', icon: 'el-icon-postcard', affix: true }
      }

    ]
  },
]



const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login_from_code(userInfo).then(response => {

        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)

        resolve(response)
      }).catch(error => {
        console.log(error, '=====2')
        resolve(error)
      })
      // resolve()
    })
  },
  registerAtion({ commit }, formInfo) {
    return new Promise((resolve, reject) => {
      registerFnc(formInfo).then(response => {
        console.log(response, '-----')
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve(response)
      }).catch(error => {
        console.log(error, '-----')
        resolve(error)
      })
      // resolve()
    })
  },
  // get user info
  getInfo({ commit, dispatch, state }) {

    return new Promise((resolve, reject) => {
      user_info().then(async response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        // resetRouter()
        console.log(data, '----------1')
        let identity1 = [{
          path: '/personalCenter',
          component: Layout,
          children: [
            {
              path: 'personalData',
              component: () => import('@/views/personal-center/personal-data'),
              name: '成为卡商',
              meta: { title: '成为卡商', icon: 'el-icon-postcard', affix: true }
            },
           

          ]
        },
        {
          path: '/merchantSettings',
          component: Layout,
          children: [
            {
              path: 'merchantSettings',
              component: () => import('@/views/merchantSettings/index'),
              name: '商家设置',
              meta: { title: '商家设置', icon: 'el-icon-postcard', affix: true }
            }
           

          ]
        },
        
      ]

        let identity2 = [{
          path: '/collectionSettings',
          component: Layout,
          children: [
            {
              path: 'collectionSettings',
              component: () => import('@/views/collectionSettings/index'),
              name: '收款设置',
              meta: { title: '收款设置', icon: 'el-icon-postcard', affix: true }
            }

          ]
        },]
        // if (data.identity == 1) {
        //   routeData.push(...identity1)
        // }
        // if (data.identity == 2) {
        //   routeData.push(...identity2)
        // }
        routeData.push(...identity1,...identity2)
        const accessRoutes = await dispatch('permission/generateRoutes', routeData, { root: true })
        router.addRoutes(routeData)
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      // commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
