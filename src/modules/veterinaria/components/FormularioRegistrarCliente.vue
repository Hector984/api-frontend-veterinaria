<script setup>
import { computed, reactive, watch } from 'vue';

const props = defineProps({
    modoEdicion: Boolean
});

const emits = defineEmits(['cliente-valido']);

// 1. Objeto principal para los datos del cliente
const datosCliente = reactive({
    Nombre: '',
    ApellidoPaterno: '',
    ApellidoMaterno: '',
    Email: '',
    Telefono: '',
    VeterinariaId: null // Se debe asignar según la sesión o contexto
});

// 2. Objeto para gestionar los mensajes de error
const erroresCliente = reactive({
    Nombre: '',
    ApellidoPaterno: '',
    Email: '',
    Telefono: ''
});

// 3. Función de validación (Se ejecuta al perder el foco 'blur')
const validarCliente = () => {
    // Nombre
    erroresCliente.Nombre = datosCliente.Nombre.length < 4 ? 'El nombre es obligatorio y debe ser válido.' : '';

    // Apellido Paterno
    erroresCliente.ApellidoPaterno = datosCliente.ApellidoPaterno.length < 4 ? 'El apellido paterno es obligatorio.' : '';

    erroresCliente.ApellidoMaterno = datosCliente.ApellidoMaterno.length < 4 ? 'El apellido materno es obligatorio.' : '';

    // Email (Validación básica con Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    erroresCliente.Email = !emailRegex.test(datosCliente.Email) ? 'Ingresa un correo electrónico válido.' : '';

    // Teléfono (Validación simple de longitud)
    erroresCliente.Telefono = datosCliente.Telefono.length < 7 ? 'El teléfono debe tener al menos 7 dígitos.' : '';
};

// 4. Propiedad computada para habilitar/deshabilitar el botón "Siguiente"
const clienteValido = computed(() => {
    // Verificamos que no haya errores
    const sinErrores = Object.values(erroresCliente).every((error) => error === '');

    // Verificamos que los campos obligatorios no estén vacíos
    const camposLlenos = datosCliente.Nombre && datosCliente.ApellidoPaterno && datosCliente.Email && datosCliente.Telefono;

    return sinErrores && camposLlenos;
});

watch(
    clienteValido,
    (newVal) => {
        emits('cliente-valido', newVal);
    },
    { immediate: true }
);
</script>
<template>
    <form class="col-span-12" @submit.prevent="onSubmit">
        <div class="card flex flex-col gap-6 w-full">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="nombre" class="font-semibold">Nombre *</label>
                    <InputText v-model.trim="datosCliente.Nombre" id="nombre" placeholder="Ej. Juan"
                        @blur="validarCliente" :class="{ 'p-invalid': erroresCliente.Nombre }" />
                    <small class="text-red-400" v-if="erroresCliente.Nombre">{{ erroresCliente.Nombre }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="apellidoPaterno" class="font-semibold">Apellido Paterno *</label>
                    <InputText v-model.trim="datosCliente.ApellidoPaterno" id="apellidoPaterno" placeholder="Ej. Pérez"
                        @blur="validarCliente" :class="{ 'p-invalid': erroresCliente.ApellidoPaterno }" />
                    <small class="text-red-400" v-if="erroresCliente.ApellidoPaterno">{{ erroresCliente.ApellidoPaterno
                        }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="apellidoMaterno" class="font-semibold">Apellido Materno *</label>
                    <InputText v-model.trim="datosCliente.ApellidoMaterno" id="apellidoMaterno" placeholder="Ej. García"
                        @blur="validarCliente" :class="{ 'p-invalid': erroresCliente.apellidoMaterno }" />
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="email" class="font-semibold">Email *</label>
                    <InputText v-model.trim="datosCliente.Email" id="email" type="email" placeholder="juan@correo.com"
                        @blur="validarCliente" :class="{ 'p-invalid': erroresCliente.Email }" />
                    <small class="text-red-400" v-if="erroresCliente.Email">{{ erroresCliente.Email }}</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="telefono" class="font-semibold">Teléfono *</label>
                    <InputText v-model.trim="datosCliente.Telefono" id="telefono" placeholder="5512345678"
                        @blur="validarCliente" :class="{ 'p-invalid': erroresCliente.Telefono }" />
                    <small class="text-red-400" v-if="erroresCliente.Telefono">{{ erroresCliente.Telefono }}</small>
                </div>
            </div>

            <div v-if="false">
                <InputText v-model="datosCliente.VeterinariaId" type="hidden" />
            </div>
        </div>
    </form>
</template>
