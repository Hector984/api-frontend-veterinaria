<script setup>
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore';
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { useNotificacionesStore } from '@/modules/notificaciones/store/useNotificaciones';
import { useVeterinariaStore } from '@/modules/veterinaria/stores/useVeterinariaStore';
import { storeToRefs } from 'pinia';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const emits = defineEmits(['formulario-mascota-valido']);

const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();

const { datosMascota } = storeToRefs(mascotaStore);

const bloquearWatch = ref(false);

const storeVeterinaria = useVeterinariaStore();

const notificacionesStore = useNotificacionesStore();

const erroresFormulario = ref({
    nombre: false,
    especie: false,
    sexo: false,
    edad: false,
    peso: false,
    fechaNacimiento: false,
    fechaProximaCita: false,
    observaciones: false,
    clienteId: false
});

const sexoOptions = ref(['Macho', 'Hembra']);

const limits = {
    nombre: 20,
    edad: 100,
    peso: 100,
    observaciones: 1000
};

var campoTocado = (campo) => {
    validarCamposFormulario(campo);
};

const validarTiempoReal = (campo) => {
    if (erroresFormulario[campo]) {
        validarCamposFormulario(campo);
    }
};

const validarCamposFormulario = (campo) => {
    switch (campo) {
        case 'nombre':
            erroresFormulario.value.nombre = !datosMascota.value.Nombre || datosMascota.value.Nombre.length > limits.nombre;
            break;
        case 'especie':
            erroresFormulario.value.especie = !datosMascota.value.Especie;
            break;
        case 'sexo':
            erroresFormulario.value.sexo = !datosMascota.value.Sexo || String(datosMascota.value.Sexo).trim() === '';
            break;
        case 'edad':
            erroresFormulario.value.edad = !datosMascota.value.Edad || Number(datosMascota.value.Edad) > limits.edad;
            break;
        case 'peso':
            erroresFormulario.value.peso = !datosMascota.value.Peso && Number(datosMascota.value.Peso) > limits.peso;
            break;
        case 'fechaNacimiento':
            erroresFormulario.value.fechaNacimiento = !datosMascota.value.FechaNacimiento;
            break;
        case 'observaciones':
            erroresFormulario.value.observaciones = datosMascota.value.Obervaciones && datosMascota.value.Obervaciones.length > limits.observaciones;
            break;
        case 'clienteId':
            erroresFormulario.value.costo = !datosMascota.value.ClienteId;
            break;
        default:
            break;
    }
};

const validarFormulario = (event) => {
    const campoId = event.target?.id || event.originalEvent?.target?.id;
    let nombrePropiedadMascota;

    // Mapeo de IDs de input a nombres de propiedad en datosMascota (camelCase a PascalCase si es necesario)
    if (campoId === 'fechaNacimiento') {
        nombrePropiedadMascota = 'FechaNacimiento';
    } else if (campoId === 'clienteId' || campoId === 'duenio') {
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
            var pesoNumerico = Number(datosMascota.value[nombrePropiedadMascota]);
            if (typeof pesoNumerico !== 'number' || pesoNumerico <= 0) {
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
    if (respuesta?.status === 404) {
        alert('La mascota no existe en la base de datos');
    } else {
        // console.error('Error de servidor', respuesta);
    }
};

const formularioValido = computed(() => {
    const camposRequeridosLlenos = datosMascota.value.Nombre && datosMascota.value.Especie && datosMascota.value.Sexo && datosMascota.value.Edad && datosMascota.value.Peso && datosMascota.value.FechaNacimiento && datosMascota.value.ClienteId;
    const formularioSinErrores =
        !erroresFormulario.value.nombre &&
        !erroresFormulario.value.sexo &&
        !erroresFormulario.value.edad &&
        !erroresFormulario.value.obervaciones &&
        !erroresFormulario.value.especie &&
        !erroresFormulario.value.peso &&
        !erroresFormulario.value.fechaNacimiento;

    return camposRequeridosLlenos && formularioSinErrores;
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
    formularioValido,
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
                        @blur="campoTocado('nombre')" @input="validarTiempoReal('nombre')"
                        :class="{ 'p-invalid': erroresFormulario.nombre }" />
                    <small class="text-red-500" v-if="erroresFormulario.nombre">El nombre es obligatorio y no debe
                        exceder los 20 caracteres.</small>
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
