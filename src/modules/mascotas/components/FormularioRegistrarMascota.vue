<script setup>
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore';
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { useNotificacionesStore } from '@/modules/notificaciones/store/useNotificaciones';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore';

const emits = defineEmits(['formulario-mascota-valido']);

const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();

const { datosMascota } = storeToRefs(mascotaStore);

const bloquearWatch = ref(false);

const storeVeterinaria = useVeterinariaStore();

const notificacionesStore = useNotificacionesStore();

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

const sexoOptions = ref(['Macho', 'Hembra']);

const validarFormulario = (event) => {
    const campoId = event.target.id;
    let nombrePropiedadMascota;

    // Mapeo de IDs de input a nombres de propiedad en datosMascota (camelCase a PascalCase si es necesario)
    if (campoId === 'fechaNacimiento') {
        nombrePropiedadMascota = 'FechaNacimiento';
    } else if (campoId === 'clienteId' || campoId === 'duenio') { // 'duenio' is the id for ClienteId
        nombrePropiedadMascota = 'ClienteId';
    } else {
        nombrePropiedadMascota = campoId.charAt(0).toUpperCase() + campoId.slice(1);
    }

    let errorEncontrado = false;

    // Reiniciar el error específico para este campo
    erroresFormulario[campoId] = '';

    switch (nombrePropiedadMascota) {
        case 'Nombre':
        case 'Especie':
        case 'Sexo':
            if (!datosMascota.value[nombrePropiedadMascota] || String(datosMascota.value[nombrePropiedadMascota]).trim() === '') {
                erroresFormulario[campoId] = `El campo ${campoId} es obligatorio.`;
                errorEncontrado = true;
            }
            break;
        case 'Edad':
        case 'Peso':
            // Asegurarse de que sea un número y mayor a 0
            if (typeof datosMascota.value[nombrePropiedadMascota] !== 'number' || datosMascota.value[nombrePropiedadMascota] <= 0) {
                erroresFormulario[campoId] = `El campo ${campoId} debe ser mayor a cero.`;
                errorEncontrado = true;
            }
            break;
        case 'FechaNacimiento':
            if (!datosMascota.value[nombrePropiedadMascota]) {
                erroresFormulario[campoId] = `El campo fecha de nacimiento es obligatorio.`;
                errorEncontrado = true;
            }
            break;
        case 'ClienteId':
            if (!datosMascota.value.ClienteId) {
                erroresFormulario[campoId] = `Debe seleccionar un dueño.`;
                errorEncontrado = true;
            }
            break;
    }

    if (errorEncontrado) {
        notificacionesStore.mostrarError('Error de validación', erroresFormulario[campoId]);
    }
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

const obtenerClientesPorVeterinariaId = async () => {
    const respuesta = await clienteStore.fetchClientesPorVeterinariaId(storeVeterinaria.idVeterinaria);
    console.log(respuesta.data);
    if (respuesta?.status === 404) {
        alert('La mascota no existe en la base de datos');
    } else {
        // console.error('Error de servidor', respuesta);
    }
};

const mascotaValida = computed(() => {
    const sinErrores = Object.values(erroresFormulario).every((error) => error === '');

    const camposLlenos = datosMascota.value.Nombre && datosMascota.value.Especie && datosMascota.value.Sexo && datosMascota.value.Edad && datosMascota.value.Peso && datosMascota.value.fechaNacimiento && datosMascota.value.ClienteId;

    return camposLlenos && sinErrores;
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
                    <Select id="sexo" v-model="datosMascota.Sexo" :options="sexoOptions"
                        placeholder="Selecciona el sexo" class="w-full" :class="{ 'p-invalid': erroresFormulario.sexo }"
                        @change="validarFormulario" />
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
                        :class="{ 'p-invalid': erroresFormulario.clienteId }" filter>
                        <template #value="slotProps">
                            <div v-if="slotProps.value">
                                <span>{{ slotProps.value.nombre }}</span>
                            </div>
                            <span v-else>
                                {{ 'Selecciona al dueño' }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <div>
                                <span>{{ slotProps.option.nombre }}</span>
                            </div>
                        </template>
                    </Select>
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
