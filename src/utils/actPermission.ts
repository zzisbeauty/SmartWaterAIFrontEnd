let permissionList: any = []

const setPermissionList = (list) => {
  console.log(permissionList)
  permissionList = []
  list.forEach((item: any) => {
    permissionList.push(item.actioncode)
  })
}

export { permissionList, setPermissionList }
