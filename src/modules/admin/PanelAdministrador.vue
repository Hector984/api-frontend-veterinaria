<script setup>
import api from '@/api/axios.js';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, onMounted, ref } from 'vue';

const veterinaries = ref([]);
const filters = ref(null);

const loading = ref(true);

const getVeterinarias = async () => {
    try {
        await api
            .get('veterinarias')
            .then((res) => {
                veterinaries.value = res.data;
            })
            .catch((err) => console.log(err))
            .finally(() => {
                loading.value = false;
            });
    } catch (error) {
        if (error.response) {
            console.error('Error en el servidor:', error);
        } else {
            console.error('Error en la petición:', error);
        }
    }
};

onBeforeMount(() => {
    initfilters();
});

onMounted(() => {
    getVeterinarias();
});

function initfilters() {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        email: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        telefono: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        direccion: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        activo: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] }
    };
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Filtering</div>
        <DataTable
            :value="veterinaries"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters"
            filterDisplay="menu"
            :loading="loading"
            :filters="filters"
            :globalFilterFields="['nombre', 'email', 'telefono', 'direccion', 'activo']"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Borrar" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Buscar por..." />
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
            <Column header="Email" filterField="email" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <!-- <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" /> -->
                        <span>{{ data.email }}</span>
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
            <!-- Columna 4 -->
            <Column header="Telefono" filterField="telefono" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.telefono }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" placeholder="mm/dd/yyyy" />
                </template>
            </Column>
            <!-- Columna 5 -->
            <Column header="Dirección" filterField="direccion" style="min-width: 10rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <span>{{ data.direccion }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />
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
