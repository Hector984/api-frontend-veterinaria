<script setup>
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useToast } from 'primevue/usetoast';
import { nextTick, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMascotaStore } from '../stores/useMascotaStore';

const route = useRoute();
const toast = useToast();

const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();
const loadingStore = useLoadingStore();
const activeTab = ref('0');
const editando = ref(false);
const informacionClienteEditada = ref(false);
const informacionMascotaEditada = ref(false);
const bloquearWatch = ref(false);

const habilitarEdicion = () => {
    editando.value = true;
};

const finalizarEdicion = () => {
    editando.value = false;
};

const guardarCambios = async () => {
    loadingStore.setLoading(true);
    try {
        if (informacionMascotaEditada.value) {
            await mascotaStore.actualizarDatosMascota();
        }
        if (informacionClienteEditada.value) {
            await clienteStore.actualizarCliente();
        }
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Información actualizada correctamente', life: 3000 });
        editando.value = false;
        informacionClienteEditada.value = false;
        informacionMascotaEditada.value = false;
        await fetchDatos();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar la información', life: 3000 });
    } finally {
        loadingStore.setLoading(false);
    }
};

const calcularEdadDesdeFecha = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    return edad < 0 ? 0 : edad;
};

const calcularFechaDesdeEdad = (nuevaEdad) => {
    const hoy = new Date();
    let fechaReferencia;

    if (mascotaStore.datosMascota.FechaNacimiento) {
        fechaReferencia = new Date(mascotaStore.datosMascota.FechaNacimiento);
    } else {
        fechaReferencia = hoy;
    }

    const nuevoAnio = hoy.getFullYear() - nuevaEdad;
    const mes = fechaReferencia.getMonth();
    const dia = fechaReferencia.getDate();

    return new Date(nuevoAnio, mes, dia);
};

const fetchDatos = async () => {
    const mascotaId = route.params.id;

    await mascotaStore.fetchDatosMascota(mascotaId);
};

watch(
    () => mascotaStore.datosMascota,
    () => {
        if (editando.value) {
            informacionMascotaEditada.value = true;
        }
    },
    { deep: true }
);

watch(
    () => clienteStore.datosCliente,
    () => {
        if (editando.value) {
            informacionClienteEditada.value = true;
        }
    },
    { deep: true }
);

watch(
    () => mascotaStore.datosMascota.FechaNacimiento,
    (nuevaFecha) => {
        if (bloquearWatch.value || !nuevaFecha) return;

        if (nuevaFecha) {
            const edadCalculada = calcularEdadDesdeFecha(nuevaFecha);
            if (mascotaStore.datosMascota.Edad !== edadCalculada) {
                bloquearWatch.value = true;
                mascotaStore.datosMascota.Edad = edadCalculada;
                nextTick(() => {
                    bloquearWatch.value = false;
                });
            }
        }
    }
);

watch(
    () => mascotaStore.datosMascota.Edad,
    (nuevaEdad) => {
        if (bloquearWatch.value) return;

        if (nuevaEdad !== null && nuevaEdad !== undefined && nuevaEdad >= 0) {
            const edadActualSegunFecha = calcularEdadDesdeFecha(mascotaStore.datosMascota.FechaNacimiento);

            if (nuevaEdad !== edadActualSegunFecha) {
                bloquearWatch.value = true;
                mascotaStore.datosMascota.FechaNacimiento = calcularFechaDesdeEdad(nuevaEdad);
                nextTick(() => {
                    bloquearWatch.value = false;
                });
            }
        }
    }
);

onMounted(async () => {
    mascotaStore.limpiarDatosMascota();
    await fetchDatos();
});
</script>

<template>
    <Toast />
    <div class="grid">
        <div class="col-12">
            <Card v-if="mascotaStore.datosMascota">
                <template #title>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <Button icon="pi pi-arrow-left" severity="secondary" text rounded @click="router.back()" />
                            <h2 class="font-bold text-3xl mb-0">Nueva Consulta: {{ mascotaStore.datosMascota.Nombre }}
                            </h2>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="flex justify-around items-center">
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Especie / Raza</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Especie }} / {{ 'Mestizo' }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Sexo</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Sexo }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Edad</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Edad }} años</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Peso Actual</p>
                            <p class="text-xl font-bold">{{ mascotaStore.datosMascota.Peso }} Kg</p>
                        </div>
                        <!-- <div class="text-center">
                            <p class="font-semibold text-lg text-muted-color mb-1">Esterilizado</p>
                            <Tag :severity="mascota.Esterilizado ? 'success' : 'info'"
                                :value="mascota.Esterilizado ? 'SÍ' : 'NO'" />
                        </div> -->
                    </div>
                </template>
            </Card>
        </div>

        <div class="col-12 mt-5">
            <Tabs v-model:value="activeTab">
                <TabList>
                    <Tab value="0">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-heart" style="font-size: 1.2rem"></i>
                            <span class="font-bold white-space-nowrap">Información de la Mascota</span>
                        </div>
                    </Tab>
                    <Tab value="1">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-user" style="font-size: 1.2rem"></i>
                            <span class="font-bold white-space-nowrap">Información del Dueño</span>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="p-4">
                            <Fluid v-if="mascotaStore.datosMascota">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreMascota" class="font-semibold">Nombre</label>
                                        <InputText id="nombreMascota" v-model="mascotaStore.datosMascota.Nombre"
                                            :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="especieMascota" class="font-semibold">Especie</label>
                                        <InputText id="especieMascota" v-model="mascotaStore.datosMascota.Especie"
                                            :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="edadMascota" class="font-semibold">Edad</label>
                                        <InputNumber id="edadMascota" v-model="mascotaStore.datosMascota.Edad"
                                            inputId="minmax" :min="0" :max="50" fluid :disabled="!editando"
                                            suffix="años" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="edadMascota" class="font-semibold">Fecha de nacimiento</label>
                                        <DatePicker dateFormat="dd/mm/yy"
                                            v-model="mascotaStore.datosMascota.FechaNacimiento" showIcon fluid
                                            iconDisplay="input" :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="sexoMascota" class="font-semibold">Sexo</label>
                                        <InputText id="sexoMascota" v-model="mascotaStore.datosMascota.Sexo"
                                            :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="pesoMascota" class="font-semibold">Peso</label>
                                        <InputNumber id="pesoMascota" v-model="mascotaStore.datosMascota.Peso"
                                            inputId="minmax" :min="0" :max="50" fluid :disabled="!editando"
                                            suffix="Kg" />
                                    </div>
                                </div>
                            </Fluid>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="p-4">
                            <Fluid v-if="clienteStore.datosCliente">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreCliente" class="font-semibold">Nombre</label>
                                        <InputText id="nombreCliente" v-model="clienteStore.datosCliente.Nombre"
                                            :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreCliente" class="font-semibold">A. Paterno</label>
                                        <InputText id="nombreCliente"
                                            v-model="clienteStore.datosCliente.ApellidoPaterno" :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreCliente" class="font-semibold">A. Materno</label>
                                        <InputText id="nombreCliente"
                                            v-model="clienteStore.datosCliente.ApellidoMaterno" :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="telefonoCliente" class="font-semibold">Teléfono</label>
                                        <InputText id="telefonoCliente" v-model="clienteStore.datosCliente.Telefono"
                                            :disabled="!editando" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="emailCliente" class="font-semibold">Email</label>
                                        <InputText id="emailCliente" v-model="clienteStore.datosCliente.Email"
                                            :disabled="!editando" />
                                    </div>
                                </div>
                            </Fluid>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
        <div class="col-12 flex justify-end gap-2 mt-4" v-if="activeTab === '0' || activeTab === '1'">
            <Button label="Volver al Inicio" icon="pi pi-arrow-left" severity="secondary"
                @click="router.push({ name: 'mi-veterinaria' })" />
            <template v-if="editando">
                <Button label="Cancelar" severity="secondary" icon="pi pi-times" @click="finalizarEdicion" />
                <Button label="Guardar Cambios" icon="pi pi-check" @click="guardarCambios" />
            </template>

            <Button v-else label="Editar información" icon="pi pi-pencil" @click="habilitarEdicion" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.custom-marker {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border-radius: 50%;
    z-index: 1;
}

:deep(.p-timeline-event-opposite) {
    display: none;
}
</style>
