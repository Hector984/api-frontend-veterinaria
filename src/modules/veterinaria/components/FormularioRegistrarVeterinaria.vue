<script setup>
import api from '@/api/axios.js';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { reactive, ref } from 'vue';

const store = useLoadingStore();
const { loading } = storeToRefs(store);
const { setLoading } = store;

const props = defineProps({
    showRegisterVeterinaryForm: {
        type: Boolean,
        required: true
    }
});

const formData = reactive({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
});

const toast = useToast();
const message = ref([]);

const clearFormValues = () => {
    formData.nombre = '';
    formData.email = '';
    formData.telefono = '';
    formData.direccion = '';
};

const onSubmit = async () => {
    try {
        setLoading(true);

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
                setLoading(false);
            });
    } catch (error) {
        if (error.response) {
            console.error('Error en el servidor:', error);
        } else {
            console.error('Error en la petición:', error);
        }
    }
};
</script>

<template>
    <div class="col-span-12 xl:col-span-6">
        <transition-group name="p-message" tag="div">
            <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
        </transition-group>
    </div>
    <form v-if="!loading && !props.showRegisterVeterinaryForm" class="col-span-12 xl:col-span-6" @submit.prevent="onSubmit">
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
