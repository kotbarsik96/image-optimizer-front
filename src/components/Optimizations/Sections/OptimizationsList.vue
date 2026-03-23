<template>
  <div class="optimizations">
    <OptimizationItem
      v-for="optimization in optimizationsList"
      :key="optimization.id"
      :optimization="optimization"
    />
  </div>
</template>

<script setup lang="ts">
import type { IOptimizationEntity } from '@/api/entities/Optimization/IOptimizationEntity'
import type { IProjectEntity } from '@/api/entities/Project/IProjectEntity'
import { EQueryKeys } from '@/api/interfaces/EQueryKeys'
import type { IResponseWrapper } from '@/api/interfaces/IResponseWrapper'
import OptimizationItem from '@/components/Optimizations/Blocks/OptimizationItem.vue'
import { useApi } from '@/composables/useApi'
import { useNotifications } from '@/composables/useNotifications'
import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

const props = defineProps<{
  project: IProjectEntity
}>()

const api = useApi()

const { addNotification } = useNotifications()

const projectId = computed(() => props.project.id)

const { data, isPending, isFetching } = useQuery<IResponseWrapper<IOptimizationEntity[]>>({
  queryKey: [EQueryKeys.OptimizationsList],
  queryFn: async () => {
    const response = await api.request(`/optimizations/list/${projectId.value}`, {
      method: 'GET',
    })

    const data = (await response?.json()) as IResponseWrapper<IOptimizationEntity[]>

    if (response?.ok) {
    } else {
      if (data.error) addNotification('error', data.error)
    }

    return data
  },
})

const optimizationsList = computed(() => data.value?.data ?? [])
</script>

<style lang="scss" scoped>
@use '@/css/mixins/mixins.scss';
</style>
