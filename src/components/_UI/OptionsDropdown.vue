<template>
  <div class="dropdown" :class="classes" v-click-away="hide">
    <div v-if="label" class="label">{{ label }}</div>
    <button class="summary" :aria-label="$t('aria.toggleDropdown')" type="button" @click="toggle">
      <TheIcon class="icon" :icon="currentOption?.icon ?? placeholderIcon" />
      <span>{{ summary }}</span>
      <ChevronDown class="chevron" />
    </button>
    <menu class="menu" role="listbox">
      <li
        v-for="item in options"
        :key="item.value"
        class="item"
        :class="{ '--selected': item.value === modelValue }"
        role="option"
        @click="updateValue(item)"
      >
        <TheIcon class="icon" :icon="item.icon" />
        <span>{{ item.label ?? item.value }}</span>
      </li>
    </menu>
  </div>
</template>

<script setup lang="ts">
import vClickAway from '@/directives/vClickAway'
import ChevronDown from '@/assets/icons/chevron-down.svg'
import type { IDropdownOption } from '@/interfaces/UI/Dropdown'
import { useToggler } from '@/composables/useToggler'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TheIcon from '@/components/_UI/TheIcon.vue'

const props = defineProps<{
  label?: string
  options: IDropdownOption[]
  placeholder?: string
  placeholderIcon?: any
}>()

const model = defineModel<string>()

const { isShown, hide, toggle } = useToggler()

const { t } = useI18n()

const currentOption = computed(() => props.options.find((opt) => opt.value === model.value))

const summary = computed(() => {
  let opt = props.placeholder ?? t('general.dropdownPlaceholder')
  if (currentOption.value) opt = currentOption.value.label ?? currentOption.value.value
  return opt
})

const classes = computed(() => ({
  '--shown': isShown.value,
}))

function updateValue(item: IDropdownOption) {
  model.value = item.value
  hide()
}
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
@use '@/css/components/Dropdown.scss';
</style>
