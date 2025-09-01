import  {  type Directive, App,nextTick } from 'vue'
import { useEventBus } from '../hooks/event/useEventBus'
const emitters = useEventBus().emit
// 该自定义指令用于拖拽dialog弹框，拉伸弹框宽高
// 由于无法在dialog标签身上去写自定义指令，该指令只能写在dialog的字元素中，通过parentNode获取dialog元素
const dialogDrag: Directive = {
  mounted(el, binding, vnode, oldVnode) {
    if (binding.value === false) return
    el = el.parentNode.parentNode

    //弹框可拉伸最小宽高
    let dialogTables: any = null
    let minWidth = null
    let minHeight = null
    setTimeout(() => {
      minWidth = el.clientWidth
      minHeight = el.clientHeight
    }, 0)
    //初始非全屏
    const isFullScreen = false
    //当前宽高
    let nowWidth = 0
    let nowHight = 0
    let innerNowHeight = null
    // 全屏图标
    const toFull = `<path fill="currentColor" d="M4 4h6v2H7.414l3 3L9 10.414l-3-3V10H4zm10 0h6v6h-2V7.414l-3 3L13.586 9l3-3H14zm-3.586 11l-3 3H10v2H4v-6h2v2.586l3-3zM15 13.586l3 3V14h2v6h-6v-2h2.586l-3-3z" />`
      // <path fill="currentColor" fill-rule="evenodd" d="M2 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0zm7 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V3H9.5a.5.5 0 0 1-.5-.5M2.5 9a.5.5 0 0 1 .5.5V12h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5m10 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H12V9.5a.5.5 0 0 1 .5-.5" clip-rule="evenodd"></path>
      
    const overFull = `
      <path fill="currentColor" d="M14 20v-6h6v2h-4v4zm-6 0v-4H4v-2h6v6zm12-10h-6V4h2v4h4zm-10 0H4V8h4V4h2z" />
    `
    //当前顶部高度
    const nowMarginTop = 0
    //获取弹框头部（这部分可双击全屏）
    const dialogHeaderEl = el.childNodes[0]
    // const dialogHeaderEl = el.querySelector('.el-dialog__header .header-title-drag');
    //弹窗
    const dragDom = el
    //获取当前dialog id
    // const dialogID = el.childNodes[1].id
    dragDom.id = 'id_' + Math.random().toString(36).substring(2, 9)
    const dialogID = dragDom.id

    // console.dir(el)
    // console.log(el.childNodes)
    // console.log(el.parentNode)
    // console.log(dialogHeaderEl)
    // console.log(dragDom)
    // console.log(dialogID)

    //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
    dragDom.style.overflow = 'hidden'
    //清除选择头部文字效果
    //dialogHeaderEl.onselectstart = new Function("return false");
    //头部加上可拖动cursor
    dialogHeaderEl.style.cursor = 'move'
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, null)[attr]
      }
    })()
    //拖拽边界优化
    const moveDown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      const screenWidth = document.body.clientWidth // body当前宽度
      const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)
      const dragDomWidth = dragDom.offsetWidth // 对话框宽度
      const dragDomheight = dragDom.offsetHeight // 对话框高度
      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
      const minDragDomTop = dragDom.offsetTop
      const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight
      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left')
      let styT = sty(dragDom, 'top')
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        // eslint-disable-next-line no-useless-escape
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
        // eslint-disable-next-line no-useless-escape
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
        styT = +styT.replace(/\px/g, '')
      }
      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY
        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }
        if (-top > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }
        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
      return false
    }
    dialogHeaderEl.onmousedown = moveDown
    //双击头部全屏效果
    dialogHeaderEl.ondblclick = (e) => {
      if (e.target.children[0].children.length === 1) {
        return
      }
      const innerContent = dragDom.children[1]
      console.log(e.target.children[0].children)
      if (dragDom.clientHeight !== window.innerHeight) {
        nowHight = dragDom.clientHeight
        nowWidth = dragDom.clientWidth
        innerNowHeight = innerContent.clientHeight
        if (dragDom !== null) {
          dragDom.style.height = '-webkit-fill-available'
          dragDom.style.width = '-webkit-fill-available'
          dragDom.style.left = 0
          dragDom.style.top = 0

          innerContent.style.height = 'auto'
        }

        // 修改全屏图标
        if (e.target.children[0].children.length === 2) {
          e.target.children[0].children[0].children[0].innerHTML = overFull
        }
      } else {
        dragDom.style.height = nowHight + 'px'
        dragDom.style.width = nowWidth + 'px'
        innerContent.style.height = innerNowHeight + 'px'
        if (e.target.children[0].children.length === 2) {
          e.target.children[0].children[0].children[0].innerHTML = toFull
        }
      }
      emitters('updateDialog',true)
    }
    // 当设置了该指令，外部的fullscreen会产生冲突，需要重写覆盖
    dialogHeaderEl.onclick = (e) => {
      if (
        (e.target.nodeName === 'I' &&
          e.target.children[0]?.nodeName === 'svg' &&
          e.target.children[0]?.className.animVal === 'tdesign:fullscreen-2 iconify iconify--tdesign') ||
        e.target.className.animVal === 'tdesign:fullscreen-2 iconify iconify--tdesign' ||
        e.target.parentNode.className.animVal === 'tdesign:fullscreen-2 iconify iconify--tdesign'  //新增判断，解决点击到path时条件不成立问题
      ) {
        console.log(dragDom.children)

        const innerContent = dragDom.children[1]
        if (dragDom.clientHeight !== window.innerHeight) {
          nowHight = dragDom.clientHeight
          nowWidth = dragDom.clientWidth
          innerNowHeight = innerContent.clientHeight
          if (dragDom !== null) {
            dragDom.style.height = '-webkit-fill-available'
            dragDom.style.width = '-webkit-fill-available'
            dragDom.style.left = 0
            dragDom.style.top = 0
            innerContent.style.height = 'auto'
          }
          // 修改全屏图标
          if (e.target.children[0]?.nodeName === 'svg') {
            e.target.children[0].innerHTML = overFull
          } else {
            e.target.innerHTML = overFull
          }
        } else {
          dragDom.style.height = nowHight + 'px'
          dragDom.style.width = nowWidth + 'px'
          innerContent.style.height = innerNowHeight + 'px'
          if (e.target.children[0]?.nodeName === 'svg') {
            e.target.children[0].innerHTML = toFull
          } else {
            e.target.innerHTML = toFull
          }
        }
        nextTick(()=>{
            emitters('updateDialog',true)
        })

      }
    }
    dragDom.onmousemove = function (e) {
      const moveE = e
      if (
        e.clientX > dragDom.offsetLeft + dragDom.clientWidth - 10 ||
        dragDom.offsetLeft + 10 > e.clientX
      ) {
        dragDom.style.cursor = 'w-resize'
      } else if (el.scrollTop + e.clientY > dragDom.offsetTop + dragDom.clientHeight - 10) {
        dragDom.style.cursor = 's-resize'
      } else {
        dragDom.style.cursor = 'default'
        dragDom.onmousedown = null
      }
      dragDom.onmousedown = (e) => {
        const clientX = e.clientX
        const clientY = e.clientY
        const elW = dragDom.clientWidth
        const elH = dragDom.clientHeight
        const EloffsetLeft = dragDom.offsetLeft
        const EloffsetTop = dragDom.offsetTop
        // dragDom.style.userSelect = 'none';
        const ELscrollTop = el.scrollTop
        //判断点击的位置是不是为头部
        if (
          clientX > EloffsetLeft &&
          clientX < EloffsetLeft + elW &&
          clientY > EloffsetTop &&
          clientY < EloffsetTop + 100
        ) {
          //如果是头部在此就不做任何动作，以上有绑定dialogHeaderEl.onmousedown = moveDown;
        } else {
          document.onmousemove = function (e) {
            // e.preventDefault(); // 移动时禁用默认事件
            //左侧鼠标拖拽位置
            if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
              //往左拖拽
              if (clientX > e.clientX) {
                dragDom.style.width = elW + (clientX - e.clientX) * 2 + 'px'
              }
              //往右拖拽
              if (clientX < e.clientX) {
                if (dragDom.clientWidth < minWidth) {
                } else {
                  dragDom.style.width = elW - (e.clientX - clientX) * 2 + 'px'
                }
              }
            }
            //右侧鼠标拖拽位置
            if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
              //往左拖拽
              if (clientX > e.clientX) {
                if (dragDom.clientWidth < minWidth) {
                } else {
                  dragDom.style.width = elW - (clientX - e.clientX) * 2 + 'px'
                }
              }
              //往右拖拽
              if (clientX < e.clientX) {
                dragDom.style.width = elW + (e.clientX - clientX) * 2 + 'px'
              }
            }
            //底部鼠标拖拽位置
            if (
              ELscrollTop + clientY > EloffsetTop + elH - 20 &&
              ELscrollTop + clientY < EloffsetTop + elH
            ) {
              console.log(dialogID)
              if (dialogID == 'dialog-detail') {
                dialogTables = document.getElementById('childTable')
              }
              if (dialogID == 'dialog-error-detail') {
                dialogTables = document.getElementById('childErrorTable')
              }
              if (dialogID == 'dialog-bill-detail') {
                dialogTables = document.getElementById('childBillTable')
              } else {
                dialogTables = document.getElementById(dialogID)
              }
              const headerContent = dialogTables.children[0]?.clientHeight || 0
              const innerContent = dialogTables.children[1]
              const footerContent = dialogTables.children[2]?.clientHeight || 0
              // 往上拖拽
              if (clientY > e.clientY) {
                if (dragDom.clientHeight < minHeight) {
                } else {
                  dragDom.style.height = elH - (clientY - e.clientY) + 'px'
                  innerContent.style.height =
                    elH - (clientY - e.clientY) - headerContent - footerContent - 32 + 'px'

                  // const changeHeightSize = elH - (clientY - e.clientY)
                  // dialogTables.style.height = (changeHeightSize - 109 - 25 - 32) * 0.1522 + 'vh'
                  // dialogTables.style.height = changeHeightSize - 84 - 25 + 'px'
                }
              }
              //往下拖拽
              if (clientY < e.clientY) {
                dragDom.style.height = elH + (e.clientY - clientY) + 'px'
                innerContent.style.height =
                  elH - (clientY - e.clientY) - headerContent - footerContent - 32 + 'px'

                // const changeHeightSize = elH - (clientY - e.clientY)
                // dialogTables.style.height = (changeHeightSize - 109 - 25 - 32) * 0.1522 + 'vh'
                // dialogTables.style.height = changeHeightSize - 84 - 25 + 'px'
              }
              nextTick(()=>{
              emitters('updateDialog',true)
              })
              
            }
          }
          //拉伸结束
          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    }
  }
}

export function setupDialogDragDirective(app: App) {
  app.directive('dialogDrag', dialogDrag)
}

export default dialogDrag
