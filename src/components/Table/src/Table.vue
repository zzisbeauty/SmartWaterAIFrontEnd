<script lang="tsx">
import {
  ElTable,
  ElTableColumn,
  ElPagination,
  ComponentSize,
  ElTooltipProps,
  ElImage,
  ElEmpty,
  ElCard,
  ElInput
} from 'element-plus'
import {
  defineComponent,
  PropType,
  ref,
  computed,
  unref,
  watch,
  onMounted,
  nextTick,
  onActivated,
  onUpdated,
  onUnmounted
} from 'vue'
import { dynamicCalculationWidth } from '@/utils/index'
import { propTypes } from '@/utils/propTypes'
import { setIndex } from './helper'
import { useAppStore } from '@/store/modules/app'
import { getCssVar } from '@/utils'
import type { TableProps, TableColumn, Pagination, TableSetProps } from './types'
import { set, get } from 'lodash-es'
import { CSSProperties } from 'vue'
import { getSlot } from '@/utils/tsxHelper'
import TableActions from './components/TableActions.vue'
import { createVideoViewer } from '@/components/VideoPlayer'
import { Icon } from '@/components/Icon'
import { BaseButton } from '@/components/Button'
import { PagiNation as BasePagiNation } from '@/components/PagiNation'
import { useEventBus } from '@/hooks/event/useEventBus'
export default defineComponent({
  name: 'Table',
  props: {
    // 是否全部不换行，全展示，暂不需要
    // isAllCalculationWidth: propTypes.bool.def(false),
    // 请求耗时
    requestTime: propTypes.number.def(0),
    //当前正在编辑行的index
    editRowIndex: propTypes.number.def(-1),
    pageSize: propTypes.number.def(10),
    currentPage: propTypes.number.def(1),
    // 是否展示表格的工具栏
    showAction: propTypes.bool.def(false),
    // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
    showOverflowTooltip: propTypes.bool.def(true),
    // 表头
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    },
    // 是否展示分页
    pagination: {
      type: Object as PropType<Pagination>,
      default: (): Pagination | undefined => undefined
    },
    // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    reserveSelection: propTypes.bool.def(false),
    // 加载状态
    loading: propTypes.bool.def(false),
    // 是否叠加索引
    reserveIndex: propTypes.bool.def(true),
    // 对齐方式
    align: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    // 表头对齐方式
    headerAlign: propTypes.string
      .validate((v: string) => ['left', 'center', 'right'].includes(v))
      .def('left'),
    data: {
      type: Array as PropType<Recordable[]>,
      default: () => []
    },
    // 图片自动预览字段数组
    imagePreview: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    // 视频自动预览字段数组
    videoPreview: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    height: propTypes.oneOfType([Number, String]),
    maxHeight: propTypes.oneOfType([Number, String]),
    stripe: propTypes.bool.def(false),
    border: propTypes.bool.def(true),
    size: {
      type: String as PropType<ComponentSize>,
      validator: (v: ComponentSize) => ['default', 'large', 'small'].includes(v)
    },
    fit: propTypes.bool.def(true),
    showHeader: propTypes.bool.def(true),
    highlightCurrentRow: propTypes.bool.def(false),
    currentRowKey: propTypes.oneOfType([Number, String]),
    // row-class-name, 类型为 (row: Recordable, rowIndex: number) => string | string
    rowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: ''
    },
    rowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    cellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: ''
    },
    cellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    headerRowClassName: {
      type: [Function, String] as PropType<(row: Recordable, rowIndex: number) => string | string>,
      default: 'headerRowClassName'
    },
    headerRowStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    headerCellClassName: {
      type: [Function, String] as PropType<
        (row: Recordable, column: any, rowIndex: number) => string | string
      >,
      default: ''
    },
    headerCellStyle: {
      type: [Function, Object] as PropType<
        (row: Recordable, column: any, rowIndex: number) => Recordable | CSSProperties
      >,
      default: () => undefined
    },
    rowKey: propTypes.string.def('id'),
    emptyText: propTypes.string.def('暂无数据'),
    defaultExpandAll: propTypes.bool.def(false),
    expandRowKeys: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    defaultSort: {
      type: Object as PropType<{ prop: string; order: string }>,
      default: () => ({})
    },
    tooltipEffect: {
      type: String as PropType<'dark' | 'light'>,
      default: 'dark'
    },
    tooltipOptions: {
      type: Object as PropType<
        Pick<
          ElTooltipProps,
          | 'effect'
          | 'enterable'
          | 'hideAfter'
          | 'offset'
          | 'placement'
          | 'popperClass'
          | 'popperOptions'
          | 'showAfter'
          | 'showArrow'
        >
      >,
      default: () => ({
        enterable: true,
        placement: 'top',
        showArrow: true,
        hideAfter: 200,
        popperOptions: { strategy: 'fixed' }
      })
    },
    showSummary: propTypes.bool.def(false),
    sumText: propTypes.string.def('Sum'),
    summaryMethod: {
      type: Function as PropType<(param: { columns: any[]; data: any[] }) => any[]>,
      default: () => undefined
    },
    spanMethod: {
      type: Function as PropType<
        (param: { row: any; column: any; rowIndex: number; columnIndex: number }) => any[]
      >,
      default: () => undefined
    },
    selectOnIndeterminate: propTypes.bool.def(true),
    indent: propTypes.number.def(16),
    lazy: propTypes.bool.def(false),
    load: {
      type: Function as PropType<(row: Recordable, treeNode: any, resolve: Function) => void>,
      default: () => undefined
    },
    treeProps: {
      type: Object as PropType<{ hasChildren?: string; children?: string; label?: string }>,
      default: () => ({ hasChildren: 'hasChildren', children: 'children', label: 'label' })
    },
    tableLayout: {
      type: String as PropType<'auto' | 'fixed'>,
      default: 'fixed'
    },
    scrollbarAlwaysOn: propTypes.bool.def(false),
    flexible: propTypes.bool.def(false),
    // 自定义内容
    customContent: propTypes.bool.def(false),
    cardBodyStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    cardBodyClass: {
      type: String as PropType<string>,
      default: ''
    },
    cardWrapStyle: {
      type: Object as PropType<CSSProperties>,
      default: () => ({})
    },
    cardWrapClass: {
      type: String as PropType<string>,
      default: ''
    },
    noFooterHeight: {
      type: Number,
      default: 10
    }
  },
  emits: [
    'update:pageSize',
    'update:currentPage',
    'register',
    'refresh',
    'pagination',
    'update:editRowIndex',
    'handleRowCurrentChange',
    'handleSelectChange',
    'handleRowClick'
  ],
  setup(props, { attrs, emit, slots, expose }) {
    const elTableRef = ref<ComponentRef<typeof ElTable>>()
    const throttle = (fn, wait = 50) => {
      // 上一次执行 fn 的时间
      let previous = 0
      // 将 throttle 处理结果当作函数返回
      return function (...args) {
        // 获取当前时间，转换成时间戳，单位毫秒
        const now = +new Date()
        // 将当前时间和上一次执行函数的时间进行对比
        // 大于等待时间就把 previous 设置为当前时间并执行函数 fn
        if (now - previous > wait) {
          previous = now
          fn.apply(this, args)
        }
      }
    }
    const filterPx = (cssVal: String) => {
      return Number(cssVal.replace('px', ''))
    }
    const tableHeight = ref<number>(0)
    const tableWrapRef = ref<ElRef>(null)
    const footerAppendRef = ref<HTMLElement>(null)
    let resizeListener: EventListener | null = null
    const resize = throttle(() => {
      //   const topDistance: any = tableWrapRef.value?.getBoundingClientRect().top
      //   tableHeight.value =
      //     window.innerHeight - topDistance - 15 - filterPx(getCssVar('--app-pagination-height'))
      getTableHeight()
    }, 100)

    const getTableHeight = () => {
      console.log(tableWrapRef.value.getBoundingClientRect().height)
      const footerHeight = footerAppendRef.value
        ? footerAppendRef.value.getBoundingClientRect().height
        : 0
      const paginationHeight = props.pagination
        ? filterPx(getCssVar('--app-pagination-height'))
        : props.noFooterHeight
      tableHeight.value =
        tableWrapRef.value.getBoundingClientRect().height - paginationHeight - footerHeight
    }
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === tableWrapRef.value) {
          getInitHeight()
          //   tableHeight.value = height - paginationHeight - foo
          // terHeight
        }
      }
    })
    const getInitHeight = throttle(() => {
      getTableHeight()
    })
    // => {
    // resizeListener = () => {
    //     if (tableWrapRef.value) {
    //     resize()
    //     }
    // }
    // window.addEventListener('resize', resizeListener)
    // onUnmounted(() => {
    //     if (resizeListener) {
    //     window.removeEventListener('resize', resizeListener)
    //     }
    // })
    // }
    onMounted(() => {
      const tableRef = unref(elTableRef)
      emit('register', tableRef?.$parent, elTableRef.value)
      nextTick(() => {
        getInitHeight()
        if (tableWrapRef.value) {
          resizeObserver.observe(tableWrapRef.value)
        }
      })
    })
    onUnmounted(() => {
      if (tableWrapRef.value) {
        resizeObserver.unobserve(tableWrapRef.value)
      }
    })
    // 被keep-alive缓存后再次显示时
    onActivated(() => {
      if (tableWrapRef.value) {
        getInitHeight()
      }
    })
    // 展开收缩
    useEventBus({
      name: 'updateTableHeight',
      callback: (type: string) => {
        nextTick(() => {
          getInitHeight()
        })
      }
    })
    // 弹框
    useEventBus({
      name: 'updateDialog',
      callback: (type: string) => {
        tableHeight.value = 0
        nextTick(() => {
          getInitHeight()
        })
      }
    })

    const pageSizeNumber = ref(props.pageSize)
    const currentPageNumber = ref(props.currentPage)
    const editRowIndexRef = ref(props.editRowIndex)

    // useTable传入的props
    const outsideProps = ref<TableProps>({})
    const mergeProps = ref<TableProps>({})
    const getProps = computed(() => {
      const propsObj = { ...props }
      Object.assign(propsObj, unref(mergeProps))
      return propsObj
    })

    const setProps = (props: TableProps = {}) => {
      mergeProps.value = Object.assign(unref(mergeProps), props)
      outsideProps.value = { ...props } as any
    }

    const setColumn = (columnProps: TableSetProps[], columnsChildren?: TableColumn[]) => {
      const { columns } = unref(getProps)
      for (const v of columnsChildren || columns) {
        for (const item of columnProps) {
          if (v.field === item.field) {
            set(v, item.path, item.value)
          } else if (v.children?.length) {
            setColumn(columnProps, v.children)
          }
        }
      }
    }

    const addColumn = (column: TableColumn, index?: number) => {
      const { columns } = unref(getProps)
      if (index !== void 0) {
        columns.splice(index, 0, column)
      } else {
        columns.push(column)
      }
    }

    const delColumn = (field: string) => {
      const { columns } = unref(getProps)
      const index = columns.findIndex((item) => item.field === field)
      if (index > -1) {
        columns.splice(index, 1)
      }
    }

    const refresh = () => {
      emit('refresh')
    }
    const onpagination = () => {
      emit('pagination')
    }
    const changSize = (size: ComponentSize) => {
      setProps({ size })
    }

    const confirmSetColumn = (columns: TableColumn[]) => {
      setProps({ columns })
    }
    const handleCurrentChange = (currentRow) => {
      emit('handleRowCurrentChange', { currentRow })
    }
    const handleRowClick = (val) => {
      emit('handleRowClick', { val })
    }
    const handleSelectChange = (val) => {
      emit('handleSelectChange', { val })
    }

    expose({
      setProps,
      setColumn,
      delColumn,
      addColumn,
      elTableRef
    })

    const pagination = computed(() => {
      return Object.assign({}, unref(getProps).pagination)
    })

    watch(
      () => unref(getProps).pageSize,
      (val: number) => {
        pageSizeNumber.value = val
      }
    )

    watch(
      () => unref(getProps).currentPage,
      (val: number) => {
        editRowIndexRef.value = -1
        currentPageNumber.value = val
      }
    )
    watch(
      () => unref(getProps).editRowIndex,
      (val: number) => {
        editRowIndexRef.value = val
      }
    )
    watch(
      () => editRowIndexRef.value,
      (val: number) => {
        emit('update:editRowIndex', val)
      }
    )
    watch(
      () => pageSizeNumber.value,
      (val: number) => {
        emit('update:pageSize', val)
      }
    )

    watch(
      () => currentPageNumber.value,
      (val: number) => {
        emit('update:currentPage', val)
      }
    )

    const getBindValue = computed(() => {
      const bindValue: Recordable = { ...attrs, ...unref(getProps) }
      delete bindValue.columns
      delete bindValue.data
      return bindValue
    })

    const renderTreeTableColumn = (columnsChildren: TableColumn[]) => {
      const { align, headerAlign, showOverflowTooltip, imagePreview, videoPreview } =
        unref(getProps)
      return columnsChildren.map((v) => {
        if (v.hidden) return null
        const props = { ...v } as any
        if (props.children) delete props.children

        const children = v.children

        const slots = {
          default: (...args: any[]) => {
            const data = args[0]
            let isPreview = false
            isPreview =
              imagePreview.some((item) => (item as string) === v.field) ||
              videoPreview.some((item) => (item as string) === v.field)

            return children && children.length
              ? renderTreeTableColumn(children)
              : props?.slots?.default
                ? props.slots.default(...args)
                : v?.formatter
                  ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                  : isPreview
                    ? renderPreview(get(data.row, v.field), v.field)
                    : get(data.row, v.field)
          }
        }
        if (props?.slots?.header) {
          slots['header'] = (...args: any[]) => props.slots.header(...args)
        }

        return (
          <ElTableColumn
            showOverflowTooltip={showOverflowTooltip}
            align={align}
            headerAlign={headerAlign}
            {...props}
            prop={v.field}
          >
            {slots}
          </ElTableColumn>
        )
      })
    }

    const renderPreview = (url: string, field: string) => {
      const { imagePreview, videoPreview } = unref(getProps)
      return (
        <div class="flex items-center">
          {imagePreview.includes(field) ? (
            <ElImage
              src={url}
              fit="cover"
              class="w-[100%]"
              lazy
              preview-src-list={[url]}
              preview-teleported
            />
          ) : videoPreview.includes(field) ? (
            <BaseButton
              type="primary"
              icon={<Icon icon="ep:video-play" />}
              onClick={() => {
                createVideoViewer({
                  url
                })
              }}
            >
              预览
            </BaseButton>
          ) : null}
        </div>
      )
    }

    const renderTableColumn = (columnsChildren?: TableColumn[]) => {
      const {
        columns,
        reserveIndex,
        pageSize,
        currentPage,
        align,
        headerAlign,
        showOverflowTooltip,
        reserveSelection,
        imagePreview,
        videoPreview,
        editRowIndex
        // isAllCalculationWidth,
        // data
      } = unref(getProps)

      return (columnsChildren || columns).map((v) => {
        if (v.hidden) return null
        if (v.type === 'index') {
          return (
            <ElTableColumn
              type="index"
              index={
                v.index ? v.index : (index) => setIndex(reserveIndex, index, pageSize, currentPage)
              }
              align={v.align || align}
              headerAlign={v.headerAlign || headerAlign}
              label={v.label}
              fixed={v.fixed}
              width="65px"
            ></ElTableColumn>
          )
        } else if (v.type === 'selection') {
          return (
            <ElTableColumn
              type="selection"
              reserveSelection={reserveSelection}
              align={align}
              headerAlign={headerAlign}
              selectable={v.selectable}
              width="50"
            ></ElTableColumn>
          )
        } else if (v.type === 'editColumn') {
          const props = { ...v } as any
          const slots = {
            default: (...args: any[]) => {
              const data = args[0]
              if (editRowIndex != -1) {
                if (editRowIndex == data.$index) {
                  let returnItem = v?.editFormatter ? (
                    v?.editFormatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                  ) : (
                    <ElInput v-model={data.row[v.field]}></ElInput>
                  )
                  return returnItem
                }
              } else {
                let returnItem = props?.slots?.default
                  ? props.slots.default(...args)
                  : v?.formatter
                    ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                    : get(data.row, v.field)
                return returnItem
              }
            }
          }
          if (props?.slots?.header) {
            slots['header'] = (...args: any[]) => props.slots.header(...args)
          }
          return (
            <ElTableColumn
              showOverflowTooltip={showOverflowTooltip}
              align={align}
              headerAlign={headerAlign}
              {...props}
              prop={v.field}
            >
              {slots}
            </ElTableColumn>
          )
        } else {
          const props = { ...v } as any
          if (props.children) delete props.children

          const children = v.children

          const slots = {
            default: (...args: any[]) => {
              const data = args[0]

              let isPreview = false
              isPreview =
                imagePreview.some((item) => (item as string) === v.field) ||
                videoPreview.some((item) => (item as string) === v.field)

              return children && children.length
                ? renderTreeTableColumn(children)
                : props?.slots?.default
                  ? props.slots.default(...args)
                  : v?.formatter
                    ? v?.formatter?.(data.row, data.column, get(data.row, v.field), data.$index)
                    : isPreview
                      ? renderPreview(get(data.row, v.field), v.field)
                      : get(data.row, v.field)
            }
          }
          if (props?.slots?.header) {
            slots['header'] = (...args: any[]) => props.slots.header(...args)
          }

          return (
            // minWidth={isAllCalculationWidth? dynamicCalculationWidth(v.field, data, v.label) : v.width}
            <ElTableColumn
              showOverflowTooltip={showOverflowTooltip}
              align={align}
              headerAlign={headerAlign}
              {...props}
              prop={v.field}
            >
              {slots}
            </ElTableColumn>
          )
        }
      })
    }

    return () => {
      const tableSlots = {}
      if (getSlot(slots, 'empty')) {
        tableSlots['empty'] = (...args: any[]) => getSlot(slots, 'empty', args)
      }
      if (getSlot(slots, 'append')) {
        tableSlots['append'] = (...args: any[]) => getSlot(slots, 'append', args)
      }
      const customSlots = {}
      if (getSlot(slots, 'buttonSlot')) {
        customSlots['buttonSlot'] = (...args: any[]) => getSlot(slots, 'buttonSlot', args)
      }
      console.log('customSlots', customSlots)
      const footerAppendSlot: any = {}
      if (getSlot(slots, 'footerAppend')) {
        footerAppendSlot['footerAppend'] = (...args: any[]) => getSlot(slots, 'footerAppend', args)
      }

      return (
        <div
          class="tableComponentOutSide overflow-hidden flex flex-col h-100%"
          v-loading={unref(getProps).loading}
        >
          {unref(getProps).customContent ? (
            <div class="flex flex-wrap">
              {unref(getProps)?.data?.length ? (
                unref(getProps)?.data.map((item) => {
                  const cardSlots = {
                    default: () => {
                      return getSlot(slots, 'content', item)
                    }
                  }
                  if (getSlot(slots, 'content-header')) {
                    cardSlots['header'] = () => {
                      return getSlot(slots, 'content-header', item)
                    }
                  }
                  if (getSlot(slots, 'content-footer')) {
                    cardSlots['footer'] = () => {
                      return getSlot(slots, 'content-footer', item)
                    }
                  }
                  return (
                    <ElCard
                      shadow="hover"
                      class={unref(getProps).cardWrapClass}
                      style={unref(getProps).cardWrapStyle}
                      bodyClass={unref(getProps).cardBodyClass}
                      bodyStyle={unref(getProps).cardBodyStyle}
                    >
                      {cardSlots}
                    </ElCard>
                  )
                })
              ) : (
                <div class="flex flex-1 justify-center">
                  <ElEmpty description="暂无数据" />
                </div>
              )}
            </div>
          ) : (
            <>
              {unref(getProps).showAction && !unref(getProps).customContent ? (
                <TableActions
                  columns={unref(getProps).columns}
                  onChangSize={changSize}
                  onRefresh={refresh}
                  onConfirm={confirmSetColumn}
                >
                  {{
                    ...customSlots
                  }}
                </TableActions>
              ) : null}
              <div class="pos-relative flex-1" ref={tableWrapRef}>
                <ElTable
                  ref={elTableRef}
                  data={unref(getProps).data}
                  {...unref(getBindValue)}
                  maxHeight={unref(tableHeight)}
                  onCurrent-change={(currentRow) => handleCurrentChange(currentRow)}
                  onSelect={(currentRow) => handleSelectChange(currentRow)}
                  onRow-click={(currentRow) => handleRowClick(currentRow)}
                >
                  {{
                    default: () => renderTableColumn(),
                    ...tableSlots
                  }}
                </ElTable>
                {footerAppendSlot.footerAppend && (
                  <div ref={footerAppendRef}>{footerAppendSlot.footerAppend()}</div>
                )}
                {unref(getProps).pagination ? (
                  <BasePagiNation
                    v-model:limit={pageSizeNumber.value}
                    v-model:page={currentPageNumber.value}
                    queryTime={unref(getProps).requestTime}
                    size={unref(getProps).size}
                    class="mt-10px"
                    {...unref(pagination)}
                    onPagination={onpagination}
                  ></BasePagiNation>
                ) : undefined}
              </div>
            </>
          )}
        </div>
      )
    }
  }
})
</script>
