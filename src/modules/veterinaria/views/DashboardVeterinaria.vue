<script setup>
import api from '@/api/axios.js';
import { onMounted, reactive, ref } from 'vue';
import FormularioDosPasos from '../components/FormularioDosPasos.vue';
import FormularioRegistrarVeterinaria from '../components/FormularioRegistrarVeterinaria.vue';
import TablaPacientesVeterinaria from '../components/TablaPacientesVeterinaria.vue';
import VeterinariaInfoCard from '../components/VeterinariaInfoCard.vue';
import { useVeterinariaStore } from '../stores/useVeterinariaStore';
import { useLoadingStore } from '@/stores/useLoadingStore';

const veterinariaStore = useVeterinariaStore();

const mostarFormularioMascota = ref(false);

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
    console.log('Abrir formulario');
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

onMounted(async () => {
    if (!veterinariaStore.datosVeterinaria) {
        await veterinariaStore.fetchDatosVeterinaria();
    }
});
</script>

<template>
    <Fluid>
        <div class="grid grid-cols-12 gap-8 mb-5">
            <VeterinariaInfoCard v-if="veterinariaStore.datosVeterinaria" :datosVeterinaria="veterinariaStore.datosVeterinaria" @abrir-formulario-mascota="abrirFormularioMascota" />
        </div>

        <FormularioRegistrarVeterinaria :showRegisterVeterinaryForm="veterinariaStore.mostarFormularioRegistroVeterinaria" />

        <FormularioDosPasos v-if="mostarFormularioMascota" :mascota="datosMascota" v-model:visible="mostarFormularioMascota" />

        <!-- <FormularioMascota v-if="mostarFormularioMascota" :mascota="datosMascota" v-model:visible="mostarFormularioMascota" @cerrar-formulario="cerrarFormulario" /> -->

        <TablaPacientesVeterinaria :mascotas="veterinariaStore.mascotas" @editar-mascota="obtenerDatosMascota" />
    </Fluid>
</template>
