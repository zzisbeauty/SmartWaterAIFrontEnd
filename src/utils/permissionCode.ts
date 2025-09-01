
const permissionCode = Object.freeze({
    VIEW: '00', // 查看
    ADD: '01', // 新增
    EDIT: '02', // 编辑
    DELETE: '03', // 删除
    IMPORT: '04', // 导入
    EXPORT: '05', // 导出
    MUTIDELETE: '06', // 批量删除
    UPMOVE: '07', // 上移
    DOWNMOVE: '08', // 下移
    STATECHANGE:'09',//启用
    ACTIONCONFIG: '10', // 动作点配置
    LEFTADD: '11', // 左侧新增
    LEFTEDIT: '12', // 左侧编辑
    LEFTDELETE: '13', // 左侧删除
    LEFTMOVEUP: '14', // 左侧上移
    LEFTMOVEDOWN: '15', // 左侧下移
    LEFTVIEW: '16', // 左侧查看
    RELESE:'17',            //发布
    SAVE: '18', // 保存 ,
    MODIFY:'19',//调整
    EXPORTAPIDOC:'20', // 导出接口文档
    APITEST: '21', // 接口测试
    SETAUTH:'22',//授权


})
export default permissionCode
