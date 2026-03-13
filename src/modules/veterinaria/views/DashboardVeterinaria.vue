<script setup>
import FormularioDosPasos from '@/modules/mascotas/components/FormularioDosPasos.vue';
import { onMounted, ref } from 'vue';
import FormularioRegistrarVeterinaria from '../components/FormularioRegistrarVeterinaria.vue';
import TablaPacientesVeterinaria from '../components/TablaPacientesVeterinaria.vue';
import VeterinariaInfoCard from '../components/VeterinariaInfoCard.vue';
import { useVeterinariaStore } from '../stores/useVeterinariaStore';

const veterinariaStore = useVeterinariaStore();

const mostarFormularioDosPasos = ref(false);

function abrirFormularioMascota() {
    mostarFormularioDosPasos.value = true;
}

const cerrarFormulario = async () => {
    mostarFormularioDosPasos.value = false;
    await veterinariaStore.fetchDatosVeterinaria();
};

onMounted(async () => {
    if (!veterinariaStore.datosVeterinaria) {
        await veterinariaStore.fetchDatosVeterinaria();
    }
});
</script>

<template>
    <Fluid>
        
        <VeterinariaInfoCard v-if="veterinariaStore.datosVeterinaria"
            :datosVeterinaria="veterinariaStore.datosVeterinaria"
            @abrir-formulario-mascota="abrirFormularioMascota" />

        <FormularioRegistrarVeterinaria v-if="veterinariaStore.mostarFormularioRegistroVeterinaria"
            :showRegisterVeterinaryForm="veterinariaStore.mostarFormularioRegistroVeterinaria" />

        <FormularioDosPasos v-if="mostarFormularioDosPasos" v-model:visible="mostarFormularioDosPasos"
            @cerrar-formulario="cerrarFormulario" />

        <TablaPacientesVeterinaria v-if="veterinariaStore.mascotas" :mascotas="veterinariaStore.mascotas" />
    </Fluid>
</template>
