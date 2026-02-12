<script setup>
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { onMounted, ref } from 'vue';
import FormularioDosPasos from '../components/FormularioDosPasos.vue';
import FormularioRegistrarVeterinaria from '../components/FormularioRegistrarVeterinaria.vue';
import TablaPacientesVeterinaria from '../components/TablaPacientesVeterinaria.vue';
import VeterinariaInfoCard from '../components/VeterinariaInfoCard.vue';
import { useVeterinariaStore } from '../stores/useVeterinariaStore';

const veterinariaStore = useVeterinariaStore();
const mascotaStore = useMascotaStore();

const mostarFormularioDosPasos = ref(false);

const obtenerDatosMascota = async (datos) => {
    const respuesta = await mascotaStore.fetchDatosMascota(datos.id);

    if (respuesta?.status === 200) {
        abrirFormularioMascota();
    } else if (respuesta?.status === 404) {
        alert('La mascota no existe en la base de datos');
    } else {
        console.error('Error de servidor', respuesta);
    }
};

function abrirFormularioMascota() {
    mostarFormularioDosPasos.value = true;
}

// const limpiarFormulario = () => {
//     datosMascota.nombre = '';
//     datosMascota.especie = '';
//     datosMascota.sexo = '';
//     datosMascota.edad = 0;
//     datosMascota.peso = 0;
//     datosMascota.fechaNacimiento = null;
//     datosMascota.observaciones = '';
//     datosMascota.clienteId = null;
// };

const cerrarFormulario = async () => {
    // limpiarFormulario();
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
        <div class="grid grid-cols-12 gap-8 mb-5">
            <VeterinariaInfoCard v-if="veterinariaStore.datosVeterinaria"
                :datosVeterinaria="veterinariaStore.datosVeterinaria"
                @abrir-formulario-mascota="abrirFormularioMascota" />
        </div>

        <FormularioRegistrarVeterinaria
            :showRegisterVeterinaryForm="veterinariaStore.mostarFormularioRegistroVeterinaria" />

        <FormularioDosPasos v-if="mostarFormularioDosPasos" v-model:visible="mostarFormularioDosPasos"
            @cerrar-formulario="cerrarFormulario" />

        <TablaPacientesVeterinaria :mascotas="veterinariaStore.mascotas" @editar-mascota="obtenerDatosMascota" />
    </Fluid>
</template>
