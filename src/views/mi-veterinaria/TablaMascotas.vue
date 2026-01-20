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
        nombreCliente: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        telefono: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        activo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Filtros</div>
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
            :globalFilterFields="['nombre', 'especie', 'sexo', 'nombreCliente', 'telefono', 'activo']"
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
                    <div class="flex items-center gap-2">
                        <!-- <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" /> -->
                        <span>{{ data.especie }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Buscar por email" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>
            </Column>
            <!-- Columna 3 -->
            <!-- <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                        <span>{{ data.representative.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img :alt="slotProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" style="width: 32px" />
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column> -->
            <!-- Columna 4 -->
            <Column header="Sexo" filterField="sexo" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.sexo }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
            <!-- Columna 5 -->
            <Column header="Dueño" filterField="nombreCliente" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.nombreCliente }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>
            <!-- Columna 6 -->
            <Column header="Teléfono" filterField="telefono" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.telefono }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>
            <!-- Columna 8 -->
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
