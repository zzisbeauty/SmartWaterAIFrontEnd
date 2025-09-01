<script lang="tsx">
import { defineComponent, unref, computed, PropType, ref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ComponentSize, ElPopover } from 'element-plus'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
import { useAppStore } from '@/store/modules/app'
import { TableColumn } from '../types'
import ColumnSetting from './ColumnSetting.vue'
import DialogColumnSetting from './DialogColumnSetting.vue'
import { getSlot } from '@/utils/tsxHelper'

const { t } = useI18n()

export default defineComponent({
  name: 'TableActions',
  components: {
    ColumnSetting,
    DialogColumnSetting
  },
  props: {
    columns: {
      type: Array as PropType<TableColumn[]>,
      default: () => []
    }
  },
  emits: ['refresh', 'changSize', 'confirm'],
  setup(props, { emit, slots }) {
    const appStore = useAppStore()
    const sizeMap = computed(() => appStore.sizeMap)
    const showSetting = ref(false)
    const refresh = () => {
      emit('refresh')
    }

    const changSize = (size: ComponentSize) => {
      emit('changSize', size)
    }

    const confirm = (columns: TableColumn[]) => {
      emit('confirm', columns)
    }

    const showColumnSetting = () => {
      showSetting.value = true
    }
    const buttonSlot = {
      default: () => {
        return getSlot(slots, 'buttonSlot')
      }
    }
    return () => (
      <>
        <div class="text-right h-32px mb-18px flex items-center justify-between">
          <div class="btnGroup">
            {{
              ...buttonSlot
            }}
          </div>
          <div class="text-right h-32px flex items-center justify-end">
            <div title="刷新" class="w-30px h-20px flex items-center justify-end" onClick={refresh}>
              <Icon
                icon="ant-design:sync-outlined"
                class="cursor-pointer"
                hover-color="var(--el-color-primary)"
              />
            </div>

            <ElDropdown trigger="click" onCommand={changSize}>
              {{
                default: () => {
                  return (
                    <div title="尺寸" class="w-30px h-20px flex items-center justify-end">
                      <Icon
                        icon="ant-design:column-height-outlined"
                        class="cursor-pointer"
                        hover-color="var(--el-color-primary)"
                      />
                    </div>
                  )
                },
                dropdown: () => {
                  return (
                    <ElDropdownMenu>
                      {{
                        default: () => {
                          return unref(sizeMap).map((v) => {
                            return (
                              <ElDropdownItem key={v} command={v}>
                                {t(`size.${v}`)}
                              </ElDropdownItem>
                            )
                          })
                        }
                      }}
                    </ElDropdownMenu>
                  )
                }
              }}
            </ElDropdown>
            <ElPopover trigger="click" placement="bottom" width="300px" v-model={showSetting.value}>
              {{
                reference: () => (
                  <div title="列设置" class="w-30px h-20px flex items-center justify-end">
                    <Icon
                      icon="ant-design:setting-outlined"
                      class="cursor-pointer"
                      hover-color="var(--el-color-primary)"
                    />
                  </div>
                ),
                default: () => (
                  <div>
                    <DialogColumnSetting columns={props.columns} onConfirm={confirm} />
                  </div>
                )
              }}
            </ElPopover>
            {/* <div
            title="列设置"
            style="position: relative"
            class="w-30px h-20px flex items-center justify-end"
            onClick={showColumnSetting}
          >
            <Icon
              icon="ant-design:setting-outlined"
              class="cursor-pointer"
              hover-color="var(--el-color-primary)"
            />
          </div> */}
          </div>
          {/* <ColumnSetting v-model={showSetting.value} columns={props.columns} onConfirm={confirm} /> */}
        </div>
      </>
    )
  }
})
</script>
<style lang="less" scoped>
.el-popper {
  padding: 5px 10px !important;
}
</style>
<!-- <style lang="less" scoped>
:deep(.el-button) {
  height: 28px !important;
}
</style> -->
