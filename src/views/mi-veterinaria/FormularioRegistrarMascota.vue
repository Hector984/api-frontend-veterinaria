<script setup>
import api from '@/api/axios.js';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useVeterinaryStore } from '@/stores/useVeterinaryStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue';
import { computed, onMounted, reactive, ref, watch } from 'vue';

const visible = defineModel('visible', { type: Boolean });

const props = defineProps({
    mascota: {
        type: Object,
        default: null
    }
});

const store = useLoadingStore();
const { setLoading } = store;
const storeVeterinaria = useVeterinaryStore();
const { obtenerIdVeterinaria } = storeToRefs(storeVeterinaria);
const { actualizarMascotas } = storeVeterinaria;

const modoEdicion = computed(() => !!props.mascota);
const tituloFormulario = computed(() => (modoEdicion.value ? 'Editar información de la mascota' : 'Registrar datos de la mascota'));
const headerFormulario = computed(() => (modoEdicion.value ? 'Editar mascota' : 'Registrar mascota'));

const toast = useToast();

const clientes = ref([]);

const formularioValido = ref(false);

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

const erroresFormulario = reactive({
    nombre: '',
    especie: '',
    sexo: '',
    edad: '',
    peso: '',
    fechaNacimiento: '',
    observaciones: '',
    clienteId: ''
});

const validarFormulario = (event) => {
    if (typeof datosFormulario[event.target.id] === 'string' && datosFormulario[event.target.id] === '') {
        toast.add({ severity: 'error', summary: 'Error', detail: `El campo ${event.target.id} es obligatorio.`, life: 3000 });
        erroresFormulario[event.target.id] = `El campo ${event.target.id} es obligatorio.`;
        formularioValido.value = false;
    } else if (typeof datosFormulario[event.target.id] === 'number' && datosFormulario[event.target.id] === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: `El campo ${event.target.id} tiene que ser mayor a cero.`, life: 3000 });
        erroresFormulario[event.target.id] = `El campo ${event.target.id} tiene que ser mayor a cero.`;
        formularioValido.value = false;
    } else {
        erroresFormulario[event.target.id] = '';
        formularioValido.value = true;
    }
};

const mostrarErroresFormulario = () => {
    Object.entries(datosFormulario).forEach(([campo, valor]) => {
        if (valor === '' || valor === 0 || !valor) {
            erroresFormulario[campo] = `El campo es obligatorio.`;
        }
    });
};

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
        if (!formularioValido.value) {
            mostrarErroresFormulario();
            toast.add({ severity: 'error', summary: 'Error', detail: 'El formulario tiene errores.', life: 3000 });
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

watch(
    () => props.mascota,
    (newVal) => {
        if (newVal) {
            Object.assign(datosFormulario, newVal);
        } else {
            limpiarFormulario();
        }
    },
    { immediate: true }
);

onMounted(() => {
    obtenerClientesPorVeterinariaId();
});
</script>
<template>
    <Dialog :header="headerFormulario" v-model:visible="visible" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
        <form class="col-span-12 xl:col-span-6" @submit.prevent="onSubmit">
            <div class="flex mt-8">
                <div class="card flex flex-col gap-4 w-full">
                    <div class="font-semibold text-xl">{{ tituloFormulario }}</div>
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="nombre">Nombre *</label>
                            <InputText v-model.trim="datosFormulario.nombre" id="nombre" type="text" placeholder="Capitan" @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.nombre }" />
                            <span class="text-red-400" v-if="erroresFormulario.nombre">{{ erroresFormulario.nombre }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="especie">Especie *</label>
                            <InputText v-model.trim="datosFormulario.especie" id="especie" type="text" placeholder="Perro" @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.especie }" />
                            <span class="text-red-400" v-if="erroresFormulario.especie">{{ erroresFormulario.especie }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="sexo">Sexo *</label>
                            <InputText v-model.trim="datosFormulario.sexo" id="sexo" type="text" placeholder="Macho" @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.sexo }" />
                            <span class="text-red-400" v-if="erroresFormulario.sexo">{{ erroresFormulario.sexo }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="edad">Edad *</label>
                            <InputText v-model="datosFormulario.edad" id="edad" type="number" @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.edad }" />
                            <span class="text-red-400" v-if="erroresFormulario.edad">{{ erroresFormulario.edad }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="peso">Peso</label>
                            <InputText v-model="datosFormulario.peso" id="peso" type="number" />
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="fechaNacimiento">Fecha de nacimiento *</label>
                            <InputText v-model="datosFormulario.fechaNacimiento" id="fechaNacimiento" type="date" @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.fechaNacimiento }" />
                            <span class="text-red-400" v-if="erroresFormulario.fechaNacimiento">{{ erroresFormulario.fechaNacimiento }}</span>
                        </div>
                        <div class="flex flex-wrap gap-2 w-full">
                            <label for="duenio">Dueño *</label>
                            <Select id="duenio" v-model="datosFormulario.clienteId" :options="clientes" optionLabel="nombre" placeholder="Selecciona al dueño" class="w-full" :class="{ 'p-invalid': erroresFormulario.clienteId }" />
                            <span class="text-red-400" v-if="erroresFormulario.clienteId">{{ erroresFormulario.clienteId }}</span>
                        </div>
                    </div>

                    <div class="flex flex-wrap">
                        <label for="observaciones">Observaciones</label>
                        <Textarea v-model.trim="datosFormulario.observaciones" id="observaciones" rows="4" placeholder="Caracteristicas de la mascota..." />
                    </div>
                </div>
            </div>
        </form>
        <template #footer>
            <Button type="submit" label="Registrar mascota" :disabled="!formularioValido" size="large" @click="onSubmit">Registrar</Button>
            <Button label="Cerrar" @click="cerrarVentana" />
        </template>
    </Dialog>
</template>
