<script setup>
import api from '@/api/axios.js';
import VeterinariaForm from '@/components/panel/VeterinariaForm.vue';
import CardInfo from '@/components/ui/CardInfo.vue';
import { useLoadingStore } from '@/stores/useLoadingStore';
import { useVeterinaryStore } from '@/stores/useVeterinaryStore';
import TablaMascotas from '@/views/mi-veterinaria/TablaMascotas.vue';
import { storeToRefs } from 'pinia';
import { Stepper } from 'primevue';
import { onMounted, reactive, ref, watch } from 'vue';

const store = useLoadingStore();
const { setLoading } = store;
const { loading } = storeToRefs(store);
const storeVeterinaria = useVeterinaryStore();
const { obtenerMascotas } = storeToRefs(storeVeterinaria);
const { setIdVeterinaria, actualizarMascotas } = storeVeterinaria;

const mostarFormularioRegistroVeterinaria = ref(true);
const mostarFormularioMascota = ref(false);

const datosVeterinaria = reactive({
    nombre: '',
    direccion: '',
    email: '',
    telefono: '',
    activo: false
});

const datosMascota = reactive({
    id: null,
    nombre: '',
    especie: '',
    sexo: '',
    edad: 0,
    peso: 0,
    fechaNacimiento: null,
    observaciones: '',
    clienteId: null,
    veterinariaId: null
});

const obtenerDatosVeterinaria = async () => {
    try {
        setLoading(true);

        await api
            .get('veterinarias/mi-veterinaria')
            .then((res) => {
                Object.assign(datosVeterinaria, res.data);
                console.log(res.data);
                setIdVeterinaria(res.data.id);
                actualizarMascotas(datosVeterinaria.mascotas);
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

const obtenerDatosMascota = async (datos) => {
    try {
        setLoading(true);

        await api
            .get(`mascotas/${datos.id}`)
            .then((res) => {
                Object.assign(datosMascota, res.data);
                abrirFormularioMascota();
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

function abrirFormularioMascota() {
    mostarFormularioMascota.value = true;
}

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

const cerrarFormulario = async () => {
    limpiarFormulario();
    mostarFormularioMascota.value = false;
    await obtenerDatosVeterinaria();
};

watch(
    () => datosVeterinaria,
    (newVal) => {
        if (newVal.nombre != '') {
            mostarFormularioRegistroVeterinaria.value = false;
        }
    }
);

onMounted(() => {
    obtenerDatosVeterinaria();
});
</script>

<template>
    <Fluid>
        <div class="grid grid-cols-12 gap-8">
            <div class="col-span-12 lg:col-span-12 xl:col-span-12 mx-auto">
                <CardInfo :information="datosVeterinaria">
                    <Button icon="pi pi-plus" rounded severity="secondary" @click="abrirFormularioMascota" />
                    <Button icon="pi pi-heart" rounded severity="secondary" />
                    <Button icon="pi pi-list" rounded severity="secondary" />
                </CardInfo>
            </div>
            <VeterinariaForm :showRegisterVeterinaryForm="mostarFormularioRegistroVeterinaria" />
        </div>
        <Stepper value="1">
            <StepList>
                <Step value="1">Dueño</Step>
                <Step value="2">Mascota</Step>
            </StepList>
            <StepPanels>
                <StepPanel value="1"> </StepPanel>
                <StepPanel value="2"> </StepPanel>
            </StepPanels>
        </Stepper>
        <!-- <FormularioMascota v-if="mostarFormularioMascota" :mascota="datosMascota" v-model:visible="mostarFormularioMascota" @cerrar-formulario="cerrarFormulario" /> -->
        <TablaMascotas :mascotas="obtenerMascotas" :loading="loading" @editar-mascota="obtenerDatosMascota" />
    </Fluid>
</template>
