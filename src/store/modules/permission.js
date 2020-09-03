import { asyncRoutes, constantRoutes } from '@/router'
import { listCurrentUserMenu } from '@/api/user'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

import Layout from '@/layout'

/**
 * 树状菜单转为路由
 * @param treeMenuJson
 * @returns []
 */
export const treeMenuToRouters = (treeMenuJson) => {
  const treeMenu = treeMenuJson.filter(router => {
    if (router.meta) {
      router.meta.icon = router.meta.icon ? router.meta.icon : 'component"'
    }
    if (router.component) {
      if (router.component === 'Layout') {
        router.component = Layout
      } else if (router.component === 'Test') {
        router.component = 'Test组件'
      } else {
        router.component = loadView(router.component)
      }
    }
    if (router.children && router.children.length) {
      router.children = treeMenuToRouters(router.children)
    }
    return true
  })
  treeMenu.push({ path: '*', redirect: '/404', hidden: true })
  return treeMenu
}
export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => {
    return require([`@/views/${view}`], resolve)
  }
}

const state = {
  routes: [],
  addRoutes: [],
  isAsyncRoutes: false
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.isAsyncRoutes = true
  },
  RESET_ASYNC_ROUTES: (state) => {
    state.addRoutes = []
    state.routes = constantRoutes
    state.isAsyncRoutes = true
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  generateAsyncRoutes({ commit }) {
    return new Promise(resolve => {
      listCurrentUserMenu().then(res => {
        if (res.code === 200) {
          const accessedRoutes = treeMenuToRouters(res.data)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        } else {
          commit('RESET_ASYNC_ROUTES', [])
          resolve([])
        }
      })
    })
  },
  resetAllRoutes({ dispatch, state }, routes) {
    return new Promise(resolve => {
      dispatch('resetRoutes')
      resolve()
    })
  },
  resetRoutes({ commit, state }) {
    return new Promise(resolve => {
      commit('RESET_ASYNC_ROUTES')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
