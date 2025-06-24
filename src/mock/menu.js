import Mock from 'mockjs'
let menus = [
  {
    id: '100', // 父节点 ID
    name: 'Home',
    title: '数据预览',
    path: '/home',
    icon: 'odometer',
    type: 'menu'
  },
  {
    id: '1', // 父节点 ID
    name: 'System',
    title: '系统管理',
    path: '/system',
    icon: 'grid',
    type: 'directory',
    children: [
      {
        id: '2', // 独立 ID
        parentId: '1', // 父节点 ID
        name: 'User',
        title: '用户管理',
        path: '/system/user', // 避免路径冲突
        icon: 'user',
        type: 'menu',
        permission: [
          {
            id: '3', // 权限 ID 独立
            value: 'user:add',
            label: '新增用户',
            status: 1
          },
          {
            id: '4',
            value: 'user:edit',
            label: '编辑用户',
            status: 1
          },
          {
            id: '5',
            value: 'user:remove',
            label: '删除用户',
            status: 1
          }
        ]
      },
      {
        id: '6',
        parentId: '1',
        name: 'Role',
        title: '角色管理',
        path: '/system/role',
        icon: 'avatar',
        type: 'menu',
        permission: [
          {
            id: '7',
            value: 'role:add',
            label: '新增角色',
            status: 1
          },
          {
            id: '8',
            value: 'role:edit',
            label: '编辑角色',
            status: 1
          },
          {
            id: '9',
            value: 'role:remove',
            label: '删除角色',
            status: 1
          }
        ]
      },
      {
        id: '10',
        parentId: '1',
        name: 'Menu',
        title: '菜单管理',
        path: '/system/menu',
        icon: 'menu',
        type: 'menu',
        permission: [
          {
            id: '11',
            value: 'menu:add',
            label: '新增菜单',
            status: 1
          },
          {
            id: '12',
            value: 'menu:edit',
            label: '编辑菜单',
            status: 1
          },
          {
            id: '13',
            value: 'menu:remove',
            label: '删除菜单',
            status: 1
          }
        ]
      }
    ]
  },
  {
    id: '14',
    name: 'Content',
    title: '内容管理',
    path: '/content',
    icon: 'folder',
    type: 'directory',
    children: [
      {
        id: '15',
        parentId: '14',
        name: 'Category',
        title: '分类管理',
        path: '/content/category',
        icon: 'folderOpened',
        type: 'menu',
        permission: [
          {
            id: '16',
            value: 'category:add',
            label: '新增分类',
            status: 1
          },
          {
            id: '17',
            value: 'category:edit',
            label: '编辑分类',
            status: 1
          },
          {
            id: '18',
            value: 'category:remove',
            label: '删除分类',
            status: 1
          }
        ]
      },
      {
        id: '19',
        parentId: '14',
        name: 'Article',
        title: '文章管理',
        path: '/content/article',
        icon: 'document',
        type: 'menu',
        permission: [
          {
            id: '20',
            value: 'article:add',
            label: '新增文章',
            status: 1
          },
          {
            id: '21',
            value: 'article:edit',
            label: '编辑文章',
            status: 1
          },
          {
            id: '22',
            value: 'article:remove',
            label: '删除文章',
            status: 1
          }
        ]
      }
    ]
  },
  {
    id: '23',
    name: 'Agreement',
    title: '协议管理',
    path: '/agreement',
    icon: 'documentChecked',
    type: 'directory',
    children: [
      {
        id: '24',
        parentId: '23',
        name: 'ProCategory',
        title: '协议分类',
        path: '/agreement/pro_category',
        icon: 'chatLineRound',
        type: 'menu',
        permission: [
          {
            id: '25',
            value: 'pro_category:add',
            label: '新增协议分类',
            status: 1
          },
          {
            id: '26',
            value: 'pro_category:edit',
            label: '编辑协议分类',
            status: 1
          },
          {
            id: '27',
            value: 'pro_category:remove',
            label: '删除协议分类',
            status: 1
          }
        ]
      },
      {
        id: '28',
        parentId: '23',
        name: 'Protocol',
        title: '协议类目',
        path: '/agreement/protocol',
        icon: 'chatDotSquare',
        type: 'menu',
        permission: [
          {
            id: '29',
            value: 'protocol:add',
            label: '新增协议类目',
            status: 1
          },
          {
            id: '30',
            value: 'protocol:edit',
            label: '编辑协议类目',
            status: 1
          },
          {
            id: '31',
            value: 'protocol:remove',
            label: '删除协议类目',
            status: 1
          }
        ]
      },
      {
        id: '78',
        parentId: '23',
        name: 'ADetail',
        title: '协议详情',
        path: '/agreement/detail/:id',
        icon: 'document',
        type: 'menu',
        hidden: true
      }
    ]
  },
  {
    id: '32',
    name: 'Log',
    title: '日志管理',
    path: '/log',
    icon: 'tickets',
    type: 'directory',
    children: [
      // {
      //   id: '33',
      //   parentId: '32',
      //   name: '操作日志',
      //   path: '/log/operation',
      //   icon: 'histogram',
      //   type: 'menu'
      // },
      {
        id: '34',
        parentId: '32',
        name: 'LLogin',
        title: '登录日志',
        path: '/log/login',
        icon: 'message',
        type: 'menu'
      }
    ]
  },
  {
    id: '35',
    name: 'Setting',
    title: '系统设置',
    path: '/setting',
    icon: 'setting',
    type: 'directory',
    children: [
      {
        id: '40',
        parentId: '35',
        name: 'Storage',
        title: '文件存储配置',
        path: '/setting/storage',
        icon: 'folderAdd',
        type: 'menu',
        permission: [
          {
            id: '41',
            value: 'storage:add',
            label: '新增文件存储配置',
            status: 1
          },
          {
            id: '42',
            value: 'storage:edit',
            label: '编辑文件存储配置',
            status: 1
          },
          {
            id: '43',
            value: 'storage:remove',
            label: '删除文件存储配置',
            status: 1
          }
        ]
      },
      {
        id: '44',
        parentId: '35',
        name: 'Third',
        title: '第三方服务配置',
        path: '/setting/third',
        icon: 'setUp',
        type: 'menu',
        permission: [
          {
            id: '45',
            value: 'third:add',
            label: '新增第三方服务配置',
            status: 1
          },
          {
            id: '46',
            value: 'third:edit',
            label: '编辑第三方服务配置',
            status: 1
          },
          {
            id: '47',
            value: 'third:remove',
            label: '删除第三方服务配置',
            status: 1
          }
        ]
      }
    ]
  }
]

// 辅助函数：根据 ID 查找菜单
function findMenuById(menuId) {
  for (const menu of menus) {
    if (menu.id === menuId) {
      return menu
    }
    if (menu.children) {
      // const childMenu = menu.children.find(child => child.id === menuId);
      const childMenu = findMenuByIdInChildren(menu.children, menuId)
      if (childMenu) {
        return childMenu
      }
    }
  }
  return null
}
// 辅助函数：递归查找子菜单，保证层级关系（解决数据children层次深的问题）
function findMenuByIdInChildren(children, menuId) {
  for (const child of children) {
    if (child.id === menuId) {
      return child
    }
    if (child.children) {
      const nestedChild = findMenuByIdInChildren(child.children, menuId)
      if (nestedChild) {
        return nestedChild
      }
    }
  }
  return null
}

// 辅助函数：根据 ID 查找菜单索引
function findMenuIndexById(menuId) {
  for (let i = 0; i < menus.length; i++) {
    if (menus[i].id === menuId) {
      return i
    }
  }
  return -1
}

// 辅助函数：生成唯一 ID
function generateUniqueId() {
  return String(Date.now())
}

// 获取菜单列表接口
Mock.mock(/\/api\/menus/, 'get', () => {
  return {
    code: 200,
    data: menus,
    total: menus.length
  }
})

// 新增菜单接口
Mock.mock(/\/api\/menus/, 'post', (options) => {
  const menuData = JSON.parse(options.body)
  const newId = generateUniqueId()
  const newMenu = { ...menuData, id: newId }

  // 处理权限ID生成
  if (newMenu.permission && Array.isArray(newMenu.permission)) {
    newMenu.permission = newMenu.permission.map((permission) => {
      if (!permission.id) {
        return { ...permission, id: generateUniqueId() }
      }
      return permission
    })
  }

  if (menuData.parentId) {
    // 添加子菜单
    const parentMenu = findMenuById(menuData.parentId)
    if (parentMenu) {
      if (!parentMenu.children) {
        parentMenu.children = [] // 如果父菜单没有 children 属性，初始化为空数组
      }
      parentMenu.children.push(newMenu)
    }
  } else {
    // 添加一级菜单
    menus.push(newMenu)
  }

  return {
    code: 200,
    data: newMenu,
    message: '新增菜单成功'
  }
})

// 编辑菜单接口
Mock.mock(/\/api\/menus\/edit/, 'put', (options) => {
  const menuData = JSON.parse(options.body)

  // 获取当前菜单
  const currentMenu = findMenuById(menuData.id)
  // 如果当前菜单是目录且有子菜单，不允许改为菜单
  if (
    currentMenu.type === 'directory' &&
    currentMenu.children &&
    currentMenu.children.length > 0
  ) {
    if (menuData.type === 'menu') {
      return {
        code: 400,
        message: '当前为目录类型且有子菜单的菜单不能改为菜单类型'
      }
    }
  }

  // 处理权限ID生成
  if (menuData.permission && Array.isArray(menuData.permission)) {
    menuData.permission = menuData.permission.map((permission) => {
      if (!permission.id) {
        return { ...permission, id: generateUniqueId() }
      }
      return permission
    })
  }

  const menuIndex = findMenuIndexById(menuData.id)

  if (menuIndex !== -1) {
    // 更新一级菜单
    menus[menuIndex] = { ...menus[menuIndex], ...menuData }
  } else {
    // 更新子菜单
    const parentMenu = findMenuById(menuData.parentId)
    if (parentMenu && parentMenu.children) {
      const childIndex = parentMenu.children.findIndex(
        (child) => child.id === menuData.id
      )
      if (childIndex !== -1) {
        parentMenu.children[childIndex] = {
          ...parentMenu.children[childIndex],
          ...menuData
        }
      }
    }
  }

  return {
    code: 200,
    data: menuData,
    message: '编辑菜单成功'
  }
})

// 删除菜单接口
Mock.mock(/\/api\/menus\/\d+/, 'delete', (options) => {
  const id = options.url.split('/').pop()
  let deleted = false

  // 尝试删除一级菜单及其子菜单
  menus = menus.filter((menu) => {
    if (menu.id === id) {
      deleted = true
      return false
    }
    return true
  })

  // 如果未删除，尝试删除子菜单
  if (!deleted) {
    menus.forEach((parentMenu) => {
      if (parentMenu.children) {
        parentMenu.children = parentMenu.children.filter(
          (child) => child.id !== id
        )
      }
    })
  }

  return {
    code: 200,
    message: '删除菜单成功'
  }
})
