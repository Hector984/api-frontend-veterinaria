<script setup>
import api from '@/api/axios.js';
import VeterinariaForm from '@/components/panel/VeterinariaForm.vue';
import CardInfo from '@/components/ui/CardInfo.vue';
import { useLoadingStore } from '@/stores/useLoadingStore';
import TablaMascotas from '@/views/mi-veterinaria/TablaMascotas.vue';
import { onMounted, reactive, ref, watch } from 'vue';

const store = useLoadingStore();
const { setLoading } = store;

const showRegisterVeterinaryForm = ref(true);

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
                <CardInfo :information="veterinaryInfo" />
            </div>
            <VeterinariaForm :showRegisterVeterinaryForm="showRegisterVeterinaryForm" />
            <TablaMascotas :mascotas="veterinaryInfo.mascotas" :loading="loading" />
        </div>
    </Fluid>
</template>
