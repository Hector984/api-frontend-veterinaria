<script setup>
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const props = defineProps({
    mascotas: {
        type: Array,
        required: true,
        default: () => []
    },
    loading: {
        type: Boolean,
        required: true,
        default: false
    }
});

const filtros = ref(null);

onBeforeMount(() => {
    initfilters();
});

function initfilters() {
    filtros.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        especie: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        sexo: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        duenio: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        telefono: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        activo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Pacientes</div>
        <DataTable
            :value="props.mascotas"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filtros"
            filterDisplay="menu"
            :loading="props.loading"
            :filters="filtros"
            :globalFilterFields="['nombre', 'especie', 'sexo', 'duenio', 'telefono', 'activo']"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Borrar" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filtros['global'].value" placeholder="Buscar por..." />
                    </IconField>
                </div>
            </template>
            <template #empty> No se encontraron resultados. </template>
            <template #loading> Cargando los datos. Espere un momento. </template>
            <!-- Columna 1 -->
            <Column field="nombre" header="Nombre" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.nombre }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre" />
                </template>
            </Column>
            <!-- Columna 2 -->
            <Column header="Especie" filterField="especie" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.especie }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por especie" />
                </template>
            </Column>
            <!-- Columna 3 -->
            <Column header="Sexo" filterField="sexo" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.sexo }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por sexo" />
                </template>
            </Column>
            <!-- Columna 4 -->
            <Column header="Dueño" filterField="duenio" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.nombreCliente }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por dueño" />
                </template>
            </Column>
            <!-- Columna 5 -->
            <Column header="Teléfono" filterField="telefono" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.telefonoCliente }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por telefono" />
                </template>
            </Column>
            <!-- Columna 6 -->
            <Column field="activo" header="Status" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.activo, 'pi-times-circle text-red-500': !data.activo }"></i>
                </template>
                <template #filter="{ filterModel }">
                    <label for="verified-filter" class="font-bold"> Verified </label>
                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
