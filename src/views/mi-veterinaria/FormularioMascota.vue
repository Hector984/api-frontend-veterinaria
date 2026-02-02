<script setup>
import api from '@/api/axios.js';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useVeterinaryStore } from '@/stores/useVeterinaryStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';

const visible = defineModel('visible', { type: Boolean });

const props = defineProps({
    mascota: {
        type: Object,
        default: null
    }
});

const emits = defineEmits(['cerrarFormulario']);

const bloquearWatch = ref(false);

const store = useLoadingStore();
const { setLoading } = store;
const storeVeterinaria = useVeterinaryStore();
const { obtenerIdVeterinaria } = storeToRefs(storeVeterinaria);
const { actualizarMascotas } = storeVeterinaria;

const modoEdicion = computed(() => !!props.mascota.nombre);
const tituloFormulario = computed(() => (modoEdicion.value ? 'Editar información de la mascota' : 'Registrar datos de la mascota'));
const headerFormulario = computed(() => (modoEdicion.value ? 'Editar mascota' : 'Registrar mascota'));
const tituloBoton = computed(() => (modoEdicion.value ? 'Editar' : 'Registrar'));

const toast = useToast();

const formularioValido = ref(modoEdicion.value);

const clientes = reactive([]);

const datosFormulario = reactive({
    nombre: '',
    especie: '',
    sexo: '',
    edad: 0,
    peso: 0,
    fechaNacimiento: null,
    observaciones: '',
    clienteId: null
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

const prepararDatos = () => {
    return {
        ...datosFormulario,
        veterinariaId: obtenerIdVeterinaria.value,
        clienteId: parseInt(datosFormulario.clienteId.id)
    };
};

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
    datosFormulario.fechaNacimiento = null;
    datosFormulario.observaciones = '';
    datosFormulario.clienteId = null;
};

const calcularEdadDesdeFecha = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;

    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    // Ajuste si aún no ha cumplido años este año
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }

    // Si es menor a un año, devolvemos 0 como pide tu regla
    return edad < 0 ? 0 : edad;
};

// Función para establecer una fecha estimada basada en la edad
const calcularFechaDesdeEdad = (nuevaEdad) => {
    const hoy = new Date();
    let fechaReferencia;

    // Si ya hay una fecha en el formulario, la usamos como base para mes y día
    if (datosFormulario.fechaNacimiento) {
        fechaReferencia = new Date(datosFormulario.fechaNacimiento);
    } else {
        fechaReferencia = hoy;
    }

    const nuevoAnio = hoy.getFullYear() - nuevaEdad;
    const mes = fechaReferencia.getMonth(); // Mantiene el mes original
    const dia = fechaReferencia.getDate(); // Mantiene el día original

    // Creamos la nueva fecha con el año ajustado pero mes y día preservados
    const nuevaFecha = new Date(nuevoAnio, mes, dia);

    // Formatear a YYYY-MM-DD para el input
    const yyyy = nuevaFecha.getFullYear();
    const mm = String(nuevaFecha.getMonth() + 1).padStart(2, '0');
    const dd = String(nuevaFecha.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
};

const registrarMascota = async () => {
    return await api.post('mascotas', prepararDatos());
};

const actualizarMascota = async () => {
    const datos = prepararDatos();
    return await api.put(`mascotas/${datosFormulario.clienteId.id}`, datos);
};

const cerrarFormulario = () => {
    emits('cerrarFormulario');
};

const onSubmit = async () => {
    try {
        if (!formularioValido.value) {
            mostrarErroresFormulario();
            toast.add({ severity: 'error', summary: 'Error', detail: 'El formulario tiene errores.', life: 3000 });
            return;
        }

        setLoading(true);

        if (modoEdicion.value) {
            await actualizarMascota();
            toast.add({ severity: 'success', summary: 'Exito', detail: 'Información actualizada.', life: 3000 });
            limpiarFormulario();
            cerrarFormulario();
        } else {
            const res = await registrarMascota();
            actualizarMascotas(res.data);
            toast.add({ severity: 'success', summary: 'Exito', detail: 'Mascota registrada.', life: 3000 });
            limpiarFormulario();
        }
    } catch (error) {
        setLoading(false);
        if (error.response) {
            console.error('Error en el servidor:', error);
        } else {
            console.error('Error en la petición:', error);
        }
    } finally {
        setLoading(false);
    }
};

const obtenerClientesPorVeterinariaId = async () => {
    try {
        setLoading(true);

        await api
            .get(`clientes/veterinaria/${obtenerIdVeterinaria.value}`)
            .then((res) => {
                Object.assign(clientes, res.data);
                if (modoEdicion.value) {
                    datosFormulario.clienteId = clientes.find((x) => x.id === props.mascota.clienteId);
                }
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

watch(
    () => props.mascota,
    (newVal) => {
        if (modoEdicion.value) {
            Object.assign(datosFormulario, newVal);
            datosFormulario.fechaNacimiento = new Date(props.mascota.fechaNacimiento).toISOString().split('T')[0];
        }
    },
    { immediate: true }
);

// 1. Si cambia la fecha de nacimiento -> calculamos edad
watch(
    () => datosFormulario.fechaNacimiento,
    (nuevaFecha) => {
        if (bloquearWatch.value || !nuevaFecha) return;

        if (nuevaFecha) {
            const edadCalculada = calcularEdadDesdeFecha(nuevaFecha);
            // Solo actualizamos si es diferente para evitar ciclos
            if (datosFormulario.edad !== edadCalculada) {
                bloquearWatch.value = true;
                datosFormulario.edad = edadCalculada;
                nextTick(() => {
                    bloquearWatch.value = false;
                });
            }
        }
    }
);

// 2. Si cambia la edad -> estimamos fecha de nacimiento
watch(
    () => datosFormulario.edad,
    (nuevaEdad) => {
        if (bloquearWatch.value || !nuevaEdad) return;

        if (nuevaEdad !== null && nuevaEdad !== undefined && nuevaEdad >= 0) {
            // 1. Calculamos cuál es la edad actual según la fecha que tiene el formulario
            const edadActualSegunFecha = calcularEdadDesdeFecha(datosFormulario.fechaNacimiento);

            // 2. Si la edad que escribió el veterinario es DIFERENTE a la que dice la fecha,
            // entonces sí actualizamos la fecha.
            if (nuevaEdad !== edadActualSegunFecha) {
                datosFormulario.fechaNacimiento = calcularFechaDesdeEdad(nuevaEdad);
                bloquearWatch.value = true;
                nextTick(() => {
                    bloquearWatch.value = false;
                });
            }
        }
    }
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
            <Button type="submit" :disabled="!formularioValido" size="large" @click="onSubmit">{{ tituloBoton }}</Button>
            <Button label="Cerrar" @click="cerrarFormulario" />
        </template>
    </Dialog>
</template>
