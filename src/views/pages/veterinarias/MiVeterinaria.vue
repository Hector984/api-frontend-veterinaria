<script setup>
import api from '@/api/axios.js';
import VeterinariaForm from '@/components/panel/VeterinariaForm.vue';
import CardInfo from '@/components/ui/CardInfo.vue';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useVeterinaryStore } from '@/stores/useVeterinaryStore';
import FormularioRegistrarMascota from '@/views/mi-veterinaria/FormularioRegistrarMascota.vue';
import TablaMascotas from '@/views/mi-veterinaria/TablaMascotas.vue';
import { storeToRefs } from 'pinia';
import { onMounted, reactive, ref, watch } from 'vue';

const store = useLoadingStore();
const { setLoading } = store;
const { loading } = storeToRefs(store);
const storeVeterinaria = useVeterinaryStore();
const { setIdVeterinaria } = storeVeterinaria;

const showRegisterVeterinaryForm = ref(true);
const showRegisterPetForm = ref(false);

const veterinaryInfo = reactive({
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
    activo: false
});

const getMyVeterinary = async () => {
    try {
        setLoading(true);

        await api
            .get('veterinarias/mi-veterinaria')
            .then((res) => {
                Object.assign(veterinaryInfo, res.data);
                setIdVeterinaria(res.data.id);
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

function open() {
    showRegisterPetForm.value = true;
}

watch(
    () => veterinaryInfo,
    (newVal) => {
        if (newVal.nombre != '') {
            showRegisterVeterinaryForm.value = false;
        }
    }
);

onMounted(() => {
    getMyVeterinary();
});
</script>

<template>
    <Fluid>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-12 xl:col-span-12 mx-auto">
                <CardInfo :information="veterinaryInfo">
                    <Button icon="pi pi-plus" rounded severity="secondary" @click="open" />
                    <Button icon="pi pi-heart" rounded severity="secondary" />
                    <Button icon="pi pi-list" rounded severity="secondary" />
                </CardInfo>
            </div>
            <VeterinariaForm :showRegisterVeterinaryForm="showRegisterVeterinaryForm" />
        </div>
        <FormularioRegistrarMascota v-model:visible="showRegisterPetForm" />
        <TablaMascotas :mascotas="veterinaryInfo.mascotas" :loading="loading" />
    </Fluid>
</template>
