<script setup>
import api from '@/api/axios.js';
import { useToast } from 'primevue/usetoast';
import { onMounted, reactive, ref, watch } from 'vue';
import SpinnerUI from '../ui/SpinnerUI.vue';

const formData = reactive({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
});

const loading = ref(true);
const toast = useToast();
const message = ref([]);
const veterinaryInfo = reactive({
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
    activo: false
});
const registerVeterinaryForm = ref(true);

const clearFormValues = () => {
    formData.nombre = '';
    formData.email = '';
    formData.telefono = '';
    formData.direccion = '';
};

const onSubmit = async () => {
    try {
        loading.value = true;

        await api
            .post('veterinarias', formData)
            .then((res) => {
                console.log(res.data);
                toast.add({ severity: 'success', summary: 'Exito', detail: 'Veterinaria registrada.', life: 3000 });
                clearFormValues();
            })
            .catch((err) => {
                console.log(err);
                toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo registrar la veterinaria.', life: 3000 });
            })
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

const getMyVeterinary = async () => {
    try {
        await api
            .get('veterinarias/mi-veterinaria')
            .then((res) => {
                Object.assign(veterinaryInfo, res.data);
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                loading.value = false;
            });
    } catch (error) {
        console.log(error);
    }
};

watch(
    () => veterinaryInfo,
    (newVal) => {
        if (newVal.nombre != '') {
            registerVeterinaryForm.value = false;
        }
    }
);

onMounted(() => {
    getMyVeterinary();
});
</script>

<template>
    <div class="col-span-12 xl:col-span-6">
        <transition-group name="p-message" tag="div">
            <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
        </transition-group>
    </div>
    <SpinnerUI v-if="loading" :message="'Cargando...'" />
    <div class="col-span-12 lg:col-span-6 xl:col-span-3">
        <div class="card mb-0">
            <div class="flex justify-between mb-4">
                <div>
                    <div class="text-surface-900 dark:text-surface-0 font-medium text-xl mb-4">Veterinaria: {{ veterinaryInfo.nombre }}</div>
                    <span class="block text-muted-color font-medium mb-4">Email: {{ veterinaryInfo.email }}</span>
                    <span class="block text-muted-color font-medium mb-4">Dirección: {{ veterinaryInfo.direccion }}</span>
                    <span class="block text-muted-color font-medium mb-4">Teléfono: {{ veterinaryInfo.telefono }}</span>
                </div>
                <div class="flex items-center justify-center" style="width: 2.5rem; height: 2.5rem">
                    <Tag icon="pi pi-check" severity="success" :value="veterinaryInfo.activo"></Tag>
                </div>
            </div>
            <span class="text-primary font-medium">24 new </span>
            <span class="text-muted-color">since last visit</span>
        </div>
    </div>
    <form v-if="!loading && !registerVeterinaryForm" class="col-span-12 xl:col-span-6" @submit.prevent="onSubmit">
        <div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="font-semibold text-xl">Llena los datos para registrar la veterinaria</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="firstname2">Nombre *</label>
                        <InputText v-model="formData.nombre" id="firstname2" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Email *</label>
                        <InputText v-model="formData.email" id="lastname2" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">Teléfono *</label>
                        <InputText v-model="formData.telefono" id="lastname2" type="text" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="address">Dirección *</label>
                    <Textarea v-model="formData.direccion" id="address" rows="4" />
                </div>
                <div>
                    <Button type="submit" label="Registrar vterinaria" size="large">Guardar</Button>
                </div>
            </div>
        </div>
    </form>
</template>
