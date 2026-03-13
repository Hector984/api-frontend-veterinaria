<script setup>
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const clienteStore = useClienteStore();
const { datosCliente } = storeToRefs(clienteStore);

const emits = defineEmits(['cliente-valido']);

// 2. Objeto para gestionar los mensajes de error
const erroresFormulario = ref({
    nombre: false,
    apellidoPaterno: false,
    apellidoMaterno: false,
    email: false,
    telefono: false
});

const limits = {
    nombre: 20,
    apellidoPaterno: 20,
    apellidoMaterno: 20,
    email: 50,
    telefono: 10
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
            erroresFormulario.value.nombre = !datosCliente.value.Nombre || datosCliente.value.Nombre.length < 4 || datosCliente.value.Nombre.length > limits.nombre;
            break;
        case 'apellidoPaterno':
            erroresFormulario.value.apellidoPaterno = !datosCliente.value.ApellidoPaterno || datosCliente.value.ApellidoPaterno.length < 4 || datosCliente.value.ApellidoPaterno.length > limits.apellidoPaterno;
            break;
        case 'apellidoMaterno':
            erroresFormulario.value.apellidoMaterno = !datosCliente.value.ApellidoMaterno || datosCliente.value.ApellidoMaterno.length < 4 || datosCliente.value.ApellidoMaterno.length > limits.apellidoMaterno;
            break;
        case 'email':
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            erroresFormulario.value.email = !datosCliente.value.Email || !emailRegex.test(datosCliente.value.Email);
            break;
        case 'telefono':
            erroresFormulario.value.telefono = !datosCliente.value.Telefono || datosCliente.value.Telefono.length != limits.telefono;
            break;
        default:
            break;
    }
};

// 4. Propiedad computada para habilitar/deshabilitar el botón "Siguiente"
const clienteValido = computed(() => {
    // Verificamos que no haya errores
    const camposRequeridosLlenos = datosCliente.value.Nombre && datosCliente.value.ApellidoPaterno && datosCliente.value.Email && datosCliente.value.Telefono;
    const formularioSinErrores = !erroresFormulario.value.nombre && !erroresFormulario.value.apellidoPaterno && !erroresFormulario.value.apellidoMaterno && !erroresFormulario.value.email && !erroresFormulario.value.telefono;

    return camposRequeridosLlenos && formularioSinErrores;
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
    <div class="col-span-12">
        <div class="card flex flex-col gap-6 w-full">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="nombre" class="font-semibold">Nombre *</label>
                    <InputText v-model.trim="datosCliente.Nombre" id="nombre" placeholder="Ej. Juan"
                        @blur="campoTocado('nombre')" @input="validarTiempoReal('nombre')"
                        :class="{ 'p-invalid': erroresFormulario.nombre }" />
                    <small class="text-red-400" v-if="erroresFormulario.nombre">El campo es obligatorio y debe tener una
                        longitud máxima de 20 caracteres</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="apellidoPaterno" class="font-semibold">Apellido Paterno *</label>
                    <InputText v-model.trim="datosCliente.ApellidoPaterno" id="apellidoPaterno" placeholder="Ej. Pérez"
                        @blur="campoTocado('apellidoPaterno')" @input="validarTiempoReal('apellidoPaterno')"
                        :class="{ 'p-invalid': erroresFormulario.apellidoPaterno }" />
                    <small class="text-red-400" v-if="erroresFormulario.apellidoPaterno">El campo es obligatorio y debe
                        tener una longitud máxima de 20 caracteres</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="apellidoMaterno" class="font-semibold">Apellido Materno *</label>
                    <InputText v-model.trim="datosCliente.ApellidoMaterno" id="apellidoMaterno" placeholder="Ej. García"
                        @blur="campoTocado('apellidoMaterno')" @input="validarTiempoReal('apellidoMaterno')"
                        :class="{ 'p-invalid': erroresFormulario.apellidoMaterno }" />
                    <small class="text-red-400" v-if="erroresFormulario.apellidoMaterno">El campo es obligatorio y debe
                        tener una longitud máxima de 20 caracteres</small>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                    <label for="email" class="font-semibold">Email *</label>
                    <InputText v-model.trim="datosCliente.Email" id="email" type="email" placeholder="juan@correo.com"
                        @blur="campoTocado('email')" @input="validarTiempoReal('email')"
                        :class="{ 'p-invalid': erroresFormulario.email }" />
                    <small class="text-red-400" v-if="erroresFormulario.email">El correo debe tenr un formato
                        válido.</small>
                </div>
                <div class="flex flex-col gap-2">
                    <label for="telefono" class="font-semibold">Teléfono *</label>
                    <InputText v-model.trim="datosCliente.Telefono" id="telefono" placeholder="5512345678"
                        @blur="campoTocado('telefono')" @input="validarTiempoReal('telefono')"
                        :class="{ 'p-invalid': erroresFormulario.telefono }" />
                    <small class="text-red-400" v-if="erroresFormulario.telefono">El teléfono debe tener 10
                        digítos.</small>
                </div>
            </div>
        </div>
    </div>
</template>
