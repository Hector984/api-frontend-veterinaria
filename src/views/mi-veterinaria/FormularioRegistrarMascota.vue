<script setup>
import api from '@/api/axios.js';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useVeterinaryStore } from '@/stores/useVeterinaryStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue';
import { onMounted, reactive, ref } from 'vue';

const visible = defineModel('visible', { type: Boolean });

const store = useLoadingStore();
const { setLoading } = store;
const storeVeterinaria = useVeterinaryStore();
const { obtenerIdVeterinaria } = storeToRefs(storeVeterinaria);
const { actualizarMascotas } = storeVeterinaria;

const toast = useToast();

const clientes = ref([]);
const duenioMascota = ref(null);

const datosFormulario = reactive({
    nombre: '',
    especie: '',
    sexo: '',
    edad: 0,
    peso: 0,
    fechaNacimiento: null,
    observaciones: '',
    clienteId: null,
    veterinariaId: obtenerIdVeterinaria.value
});

const limpiarFormulario = () => {
    datosFormulario.nombre = '';
    datosFormulario.especie = '';
    datosFormulario.sexo = '';
    datosFormulario.edad = 0;
    datosFormulario.peso = 0;
    datosFormulario.fechaNacimiento = new Date();
    datosFormulario.observaciones = '';
    datosFormulario.clienteId = null;
    datosFormulario.activo = true;
};

const onSubmit = async () => {
    try {
        // Validar todos los campos del formulario
        datosFormulario.clienteId = duenioMascota.value ? duenioMascota.value.id : null;

        if (!datosFormulario.clienteId) {
            toast.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un dueño para la mascota.', life: 3000 });
            return;
        }

        setLoading(true);

        await api
            .post('mascotas', datosFormulario)
            .then((res) => {
                actualizarMascotas(res.data);
                toast.add({ severity: 'success', summary: 'Exito', detail: 'Mascota registrada.', life: 3000 });
                limpiarFormulario();
            })
            .catch((err) => {
                // err.status == 500
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la mascota.', life: 3000 });
            })
            .finally(() => {
                setLoading(false);
            });
    } catch (error) {
        setLoading(false);
        if (error.response) {
            console.error('Error en el servidor:', error);
        } else {
            console.error('Error en la petición:', error);
        }
    }
};

const obtenerClientesPorVeterinariaId = async () => {
    try {
        setLoading(true);

        await api
            .get(`clientes/veterinaria/${obtenerIdVeterinaria.value}`)
            .then((res) => {
                clientes.value = res.data;
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    } catch (error) {
        console.log(error);
    }
};

function cerrarVentana() {
    // Emite "update:visible" cuando se mita visible
    visible.value = false;
}

onMounted(() => {
    obtenerClientesPorVeterinariaId();
});
</script>
<template>
    <Dialog header="Registrar mascota" v-model:visible="visible" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <form class="col-span-12 xl:col-span-6" @submit.prevent="onSubmit">
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl">Llena los datos para registrar a una mascota</div>
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="firstname2">Nombre *</label>
                            <InputText v-model="datosFormulario.nombre" id="firstname2" type="text" placeholder="Capitan" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Especie *</label>
                            <InputText v-model="datosFormulario.especie" id="lastname2" type="text" placeholder="Perro" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Sexo *</label>
                            <InputText v-model="datosFormulario.sexo" id="lastname2" type="text" placeholder="Macho" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Edad *</label>
                            <InputText v-model="datosFormulario.edad" id="lastname2" type="number" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Peso</label>
                            <InputText v-model="datosFormulario.peso" id="lastname2" type="number" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="lastname2">Fecha de nacimiento</label>
                            <InputText v-model="datosFormulario.fechaNacimiento" id="lastname2" type="date" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="state">Dueño</label>
                            <Select id="state" v-model="duenioMascota" :options="clientes" optionLabel="nombre" placeholder="Selecciona al dueño" class="w-full"></Select>
                        </div>
                    </div>

                    <div class="flex flex-wrap">
                        <label for="address">Observaciones</label>
                        <Textarea v-model="datosFormulario.observaciones" id="address" rows="4" placeholder="Caracteristicas de la mascota..." />
                    </div>
                </div>
            </div>
        </form>
        <template #footer>
            <Button type="submit" label="Registrar mascota" size="large" @click="onSubmit">Registrar</Button>
            <Button label="Cerrar" @click="cerrarVentana" />
        </template>
    </Dialog>
</template>
