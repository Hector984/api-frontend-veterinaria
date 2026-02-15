<script setup>
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore';
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useVeterinariaStore } from '../stores/useVeterinariaStore';

const props = defineProps({
    modoEdicion: Boolean
});

const emits = defineEmits(['formulario-mascota-valido']);

const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();

const { datosMascota } = storeToRefs(mascotaStore);

const bloquearWatch = ref(false);

const store = useLoadingStore();
const { setLoading } = store;
const storeVeterinaria = useVeterinariaStore();
const { obtenerIdVeterinaria } = storeToRefs(storeVeterinaria);
const { actualizarMascotas } = storeVeterinaria;

const toast = useToast();

const formularioValido = ref(props.modoEdicion);

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
    if (typeof datosMascota[event.target.id] === 'string' && datosMascota[event.target.id] === '') {
        toast.add({ severity: 'error', summary: 'Error', detail: `El campo ${event.target.id} es obligatorio.`, life: 3000 });
        erroresFormulario[event.target.id] = `El campo ${event.target.id} es obligatorio.`;
        formularioValido.value = false;
    } else if (typeof datosMascota[event.target.id] === 'number' && datosMascota[event.target.id] === 0) {
        toast.add({ severity: 'error', summary: 'Error', detail: `El campo ${event.target.id} tiene que ser mayor a cero.`, life: 3000 });
        erroresFormulario[event.target.id] = `El campo ${event.target.id} tiene que ser mayor a cero.`;
        formularioValido.value = false;
    } else {
        erroresFormulario[event.target.id] = '';
        formularioValido.value = true;
    }
};

const mostrarErroresFormulario = () => {
    Object.entries(datosMascota).forEach(([campo, valor]) => {
        if (valor === '' || valor === 0 || !valor) {
            erroresFormulario[campo] = `El campo es obligatorio.`;
        }
    });
};

const limpiarFormulario = () => {
    datosMascota.nombre = '';
    datosMascota.especie = '';
    datosMascota.sexo = '';
    datosMascota.edad = 0;
    datosMascota.peso = 0;
    datosMascota.fechaNacimiento = null;
    datosMascota.observaciones = '';
    datosMascota.clienteId = null;
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
    if (datosMascota.value.FechaNacimiento) {
        fechaReferencia = new Date(datosMascota.value.FechaNacimiento);
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

// const registrarMascota = async () => {
//     return await api.post('mascotas', prepararDatos());
// };

// const actualizarMascota = async () => {
//     const datos = prepararDatos();
//     return await api.put(`mascotas/${datosMascota.clienteId.id}`, datos);
// };

// const onSubmit = async () => {
//     try {
//         if (!formularioValido.value) {
//             mostrarErroresFormulario();
//             toast.add({ severity: 'error', summary: 'Error', detail: 'El formulario tiene errores.', life: 3000 });
//             return;
//         }

//         setLoading(true);

//         if (props.modoEdicion) {
//             await actualizarMascota();
//             toast.add({ severity: 'success', summary: 'Exito', detail: 'Información actualizada.', life: 3000 });
//             limpiarFormulario();
//         } else {
//             const res = await registrarMascota();
//             actualizarMascotas(res.data);
//             toast.add({ severity: 'success', summary: 'Exito', detail: 'Mascota registrada.', life: 3000 });
//             limpiarFormulario();
//         }
//     } catch (error) {
//         setLoading(false);
//         if (error.response) {
//             console.error('Error en el servidor:', error);
//         } else {
//             console.error('Error en la petición:', error);
//         }
//     } finally {
//         setLoading(false);
//     }
// };

const obtenerClientesPorVeterinariaId = async () => {
    const respuesta = await clienteStore.fetchClientesPorVeterinariaId(storeVeterinaria.idVeterinaria);
    if (respuesta.status == 200 && props.modoEdicion) {
        const mascota = useMascotaStore.datosMascota;
        datosMascota.value.ClienteId = clienteStore.clientes.find((x) => x.id === mascota.value.ClienteId);
    } else if (respuesta?.status === 404) {
        alert('La mascota no existe en la base de datos');
    } else {
        // console.error('Error de servidor', respuesta);
    }
};

const mascotaValida = computed(() => {
    // Verificamos que no haya errores
    const sinErrores = Object.values(erroresFormulario).every((error) => error === '');

    // Verificamos que los campos obligatorios no estén vacíos
    // const camposLlenos = datosMascota.value.Nombre && datosMascota.value.Sexo && datosMascota.value.Especie && datosMascota.value.FechaNacimiento && datosMascota.value.Edad && datosMascota.value.Peso;

    return sinErrores;
});

// 1. Si cambia la fecha de nacimiento -> calculamos edad
watch(
    () => datosMascota.value.FechaNacimiento,
    (nuevaFecha) => {
        if (bloquearWatch.value || !nuevaFecha) return;

        if (nuevaFecha) {
            const edadCalculada = calcularEdadDesdeFecha(nuevaFecha);
            // Solo actualizamos si es diferente para evitar ciclos
            if (datosMascota.value?.Edad !== edadCalculada) {
                bloquearWatch.value = true;
                datosMascota.value.Edad = edadCalculada;
                nextTick(() => {
                    bloquearWatch.value = false;
                });
            }
        }
    }
);

// 2. Si cambia la edad -> estimamos fecha de nacimiento
watch(
    () => datosMascota.value.Edad,
    (nuevaEdad) => {
        if (bloquearWatch.value || !nuevaEdad) return;

        if (nuevaEdad !== null && nuevaEdad !== undefined && nuevaEdad >= 0) {
            // 1. Calculamos cuál es la edad actual según la fecha que tiene el formulario
            const edadActualSegunFecha = calcularEdadDesdeFecha(datosMascota.FechaNacimiento);

            // 2. Si la edad que escribió el veterinario es DIFERENTE a la que dice la fecha,
            // entonces sí actualizamos la fecha.
            if (nuevaEdad !== edadActualSegunFecha) {
                datosMascota.value.FechaNacimiento = calcularFechaDesdeEdad(nuevaEdad);
                bloquearWatch.value = true;
                nextTick(() => {
                    bloquearWatch.value = false;
                });
            }
        }
    }
);

watch(
    mascotaValida,
    (newVal) => {
        emits('formulario-mascota-valido', newVal);
    },
    { immediate: true }
);

onMounted(async () => {
    await obtenerClientesPorVeterinariaId();

    if (props.modoEdicion) {
        Object.assign(datosMascota, useMascotaStore.datosMascota);
        datosMascota.value.FechaNacimiento = new Date(datosMascota.value.FechaNacimiento).toISOString().split('T')[0];
    }
});
</script>
<template>
    <div class="col-span-12">
        <div class="card flex flex-col gap-6 w-full">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="nombre" class="font-semibold">Nombre *</label>
                    <InputText v-model.trim="datosMascota.Nombre" id="nombre" placeholder="Capitan"
                        @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.nombre }" />
                    <small class="text-red-400" v-if="erroresFormulario.nombre">{{ erroresFormulario.nombre }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="sexo" class="font-semibold">Sexo *</label>
                    <InputText v-model.trim="datosMascota.Sexo" id="sexo" placeholder="Macho" @blur="validarFormulario"
                        :class="{ 'p-invalid': erroresFormulario.sexo }" />
                    <small class="text-red-400" v-if="erroresFormulario.sexo">{{ erroresFormulario.sexo }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="especie" class="font-semibold">Especie *</label>
                    <InputText v-model.trim="datosMascota.Especie" id="especie" placeholder="Perro"
                        @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.especie }" />
                    <small class="text-red-400" v-if="erroresFormulario.especie">{{ erroresFormulario.especie }}</small>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="peso" class="font-semibold">Peso (kg)</label>
                    <InputText v-model="datosMascota.Peso" id="peso" type="number" />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="edad" class="font-semibold">Edad *</label>
                    <InputText v-model="datosMascota.Edad" id="edad" type="number" @blur="validarFormulario"
                        :class="{ 'p-invalid': erroresFormulario.edad }" />
                    <small class="text-red-400" v-if="erroresFormulario.edad">{{ erroresFormulario.edad }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="fechaNacimiento" class="font-semibold">Fecha de nacimiento *</label>
                    <InputText v-model="datosMascota.FechaNacimiento" id="fechaNacimiento" type="date"
                        @blur="validarFormulario" :class="{ 'p-invalid': erroresFormulario.fechaNacimiento }" />
                    <small class="text-red-400" v-if="erroresFormulario.fechaNacimiento">{{
                        erroresFormulario.fechaNacimiento }}</small>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="duenio" class="font-semibold">Dueño *</label>
                    <Select id="duenio" v-model="datosMascota.ClienteId" :options="clienteStore.clientes"
                        optionLabel="nombre" placeholder="Selecciona al dueño" class="w-full"
                        :class="{ 'p-invalid': erroresFormulario.clienteId }" />
                    <small class="text-red-400" v-if="erroresFormulario.clienteId">{{ erroresFormulario.clienteId
                        }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="observaciones" class="font-semibold">Observaciones</label>
                    <Textarea v-model.trim="datosMascota.Observaciones" id="observaciones" rows="1" autoResize
                        placeholder="Características de la mascota..." />
                </div>
            </div>
        </div>
    </div>
</template>
