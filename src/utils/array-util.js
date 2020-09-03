export const differentArr = (arr1, arr2) => {
  return arr1.concat(arr2).filter((value, index, arr) => {
    //arr.indexOf(value) 查找value第一次出现的位置
    //arr.lastIndexOf(value)返回一value最后出现的位置
    //如果第一次和最后一次都是都是一样 [0,1,2,3,4,5,0,4,6,1,3,9],则返回true并封装 [2,5,6,9]
    return arr.indexOf(value) === arr.lastIndexOf(value)
  })
}


export const collectIdInArr = (treeJson) => {
  let arr = []
  //闭包方法
  let getMenuKeys = function(treeMenu) {
    treeMenu.forEach(menu => {
      arr.push(menu.id)
      if (menu.children) {
        getMenuKeys(menu.children)
      }
    })
  }
  getMenuKeys(treeJson)
  return arr
}
