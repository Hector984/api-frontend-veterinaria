<script setup>
import { FilterMatchMode } from '@primevue/core/api';
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
const statuses = ref([
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false }
]);

const initFilters = () => {
    filtros.value = {
        nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
        especie: { value: null, matchMode: FilterMatchMode.CONTAINS },
        sexo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombreCliente: { value: null, matchMode: FilterMatchMode.CONTAINS },
        telefonoCliente: { value: null, matchMode: FilterMatchMode.CONTAINS },
        activo: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const clearFilter = () => {
    initFilters();
};

onBeforeMount(() => {
    initFilters();
});
</script>

<template>
    <DataTable :value="props.mascotas" :paginator="true" :rows="10" dataKey="id" :rowHover="true" v-model:filters="filtros" filterDisplay="menu" :loading="props.loading" showGridlines>
        <template #header>
            <div class="flex justify-start">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtros" outlined @click="clearFilter()" />
            </div>
        </template>

        <template #empty> No se encontraron resultados. </template>
        <template #loading> Cargando los datos. Espere un momento. </template>

        <Column field="nombre" header="Nombre" style="min-width: 12rem">
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar por nombre" />
            </template>
        </Column>

        <Column field="especie" header="Especie" style="min-width: 12rem">
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar por especie" />
            </template>
        </Column>

        <Column field="sexo" header="Sexo" style="min-width: 10rem">
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar por sexo" />
            </template>
        </Column>

        <Column header="Dueño" filterField="nombreCliente" style="min-width: 10rem">
            <template #body="{ data }">
                {{ data.nombreCliente }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar por dueño" />
            </template>
        </Column>

        <Column header="Teléfono" filterField="telefonoCliente" style="min-width: 10rem">
            <template #body="{ data }">
                {{ data.telefonoCliente }}
            </template>
            <template #filter="{ filterModel }">
                <InputText v-model="filterModel.value" type="text" placeholder="Buscar por teléfono" />
            </template>
        </Column>

        <Column field="activo" header="Estatus" dataType="boolean" style="min-width: 10rem">
            <template #body="{ data }">
                <Tag :severity="data.activo ? 'success' : 'danger'" :value="data.activo ? 'Activo' : 'Inactivo'" />
            </template>
            <template #filter="{ filterModel, filterCallback }">
                <Dropdown v-model="filterModel.value" @change="filterCallback()" :options="statuses" optionLabel="label" optionValue="value" placeholder="Cualquiera">
                    <template #option="slotProps">
                        <Tag :severity="slotProps.option.value ? 'success' : 'danger'" :value="slotProps.option.label" />
                    </template>
                </Dropdown>
            </template>
        </Column>

        <Column header="Acciones" bodyClass="text-center" style="min-width: 8rem">
            <template #body="slotProps">
                <div class="flex gap-2 justify-center" v-if="slotProps.data.activo">
                    <Button icon="pi pi-pencil" severity="secondary" rounded @click="$emit('editarMascota', slotProps.data)" />
                    <Button icon="pi pi-trash" severity="danger" rounded @click="confirmarEliminar(slotProps.data)" />
                </div>
            </template>
        </Column>
    </DataTable>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
