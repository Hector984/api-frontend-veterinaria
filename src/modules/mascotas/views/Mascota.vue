<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Mock data - Replace with API calls later
const mascota = ref(null);
const cliente = ref(null);
const historialMedico = ref([]);

const fetchDatos = () => {
    // Simulate fetching data based on route id
    const mascotaId = route.params.id;
    console.log('Fetching data for pet ID:', mascotaId);

    mascota.value = {
        id: mascotaId,
        nombre: 'Max',
        especie: 'Perro',
        raza: 'Golden Retriever',
        sexo: 'Macho',
        edad: '5 años',
        peso: '30 kg',
        fotoUrl: 'https://www.primefaces.org/primevue/demo/images/galleria/galleria10.jpg' // Placeholder image
    };

    cliente.value = {
        id: 101,
        nombre: 'Carlos Santana',
        telefono: '555-123-4567',
        email: 'carlos.s@example.com',
        direccion: 'Av. Siempre Viva 742'
    };

    historialMedico.value = [
        {
            fecha: '15/01/2024',
            titulo: 'Vacunación Anual',
            descripcion: 'Se administró la vacuna polivalente y antirrábica.',
            doctor: 'Dr. House',
            icon: 'pi pi-check-circle',
            color: '#60A5FA'
        },
        {
            fecha: '20/03/2024',
            titulo: 'Consulta por cojera',
            descripcion: 'Leve esguince en la pata delantera derecha. Se recetó reposo y antiinflamatorios.',
            doctor: 'Dr. Strange',
            icon: 'pi pi-plus-circle',
            color: '#FBBF24'
        },
        {
            fecha: '05/06/2024',
            titulo: 'Control de peso',
            descripcion: 'El peso se mantiene estable. Dieta adecuada.',
            doctor: 'Dr. Dolittle',
            icon: 'pi pi-chart-line',
            color: '#34D399'
        }
    ];
};

onMounted(() => {
    fetchDatos();
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <Card v-if="mascota">
                <template #title>
                    <div class="flex items-center gap-4">
                        <Avatar :image="mascota.fotoUrl" size="xlarge" shape="circle" />
                        <div>
                            <h2 class="font-bold text-3xl mb-0">{{ mascota.nombre }}</h2>
                            <p class="text-gray-500 text-lg mt-0">{{ mascota.especie }} - {{ mascota.raza }}</p>
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="flex justify-around">
                        <div class="text-center">
                            <p class="font-semibold text-lg">Sexo</p>
                            <p>{{ mascota.sexo }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg">Edad</p>
                            <p>{{ mascota.edad }}</p>
                        </div>
                        <div class="text-center">
                            <p class="font-semibold text-lg">Peso</p>
                            <p>{{ mascota.peso }}</p>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div class="col-12">
            <Tabs value="0">
                <TabList>
                    <Tab value="0">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-user" style="font-size: 1.2rem"></i>
                            <span class="font-bold white-space-nowrap">Información del Dueño</span>
                        </div>
                    </Tab>
                    <Tab value="1">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-heart" style="font-size: 1.2rem"></i>
                            <span class="font-bold white-space-nowrap">Información de la Mascota</span>
                        </div>
                    </Tab>
                    <Tab value="2">
                        <div class="flex align-items-center gap-2">
                            <i class="pi pi-book" style="font-size: 1.2rem"></i>
                            <span class="font-bold white-space-nowrap">Historial Médico</span>
                        </div>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel value="0">
                        <div class="p-4">
                            <Fluid v-if="cliente">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreCliente" class="font-semibold">Nombre</label>
                                        <InputText id="nombreCliente" v-model="cliente.nombre" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreCliente" class="font-semibold">A. Paterno</label>
                                        <InputText id="nombreCliente" v-model="cliente.nombre" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="nombreCliente" class="font-semibold">A. Materno</label>
                                        <InputText id="nombreCliente" v-model="cliente.nombre" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="telefonoCliente" class="font-semibold">Teléfono</label>
                                        <InputText id="telefonoCliente" v-model="cliente.telefono" />
                                    </div>
                                    <div class="field col-12 md:col-6">
                                        <label for="emailCliente" class="font-semibold">Email</label>
                                        <InputText id="emailCliente" v-model="cliente.email" />
                                    </div>
                                </div>
                            </Fluid>
                        </div>
                    </TabPanel>
                    <TabPanel value="1">
                        <div class="p-4">
                            <div v-if="mascota" class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-6">
                                    <label for="nombreMascota" class="font-semibold">Nombre</label>
                                    <InputText id="nombreMascota" v-model="mascota.nombre" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="especieMascota" class="font-semibold">Especie</label>
                                    <InputText id="especieMascota" v-model="mascota.especie" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="razaMascota" class="font-semibold">Raza</label>
                                    <InputText id="razaMascota" v-model="mascota.raza" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="sexoMascota" class="font-semibold">Sexo</label>
                                    <InputText id="sexoMascota" v-model="mascota.sexo" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="edadMascota" class="font-semibold">Edad</label>
                                    <InputText id="edadMascota" v-model="mascota.edad" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="pesoMascota" class="font-semibold">Peso</label>
                                    <InputText id="pesoMascota" v-model="mascota.peso" />
                                </div>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value="2">
                        <div class="p-4">
                            <Timeline :value="historialMedico" align="alternate" class="customized-timeline">
                                <template #marker="slotProps">
                                    <span class="custom-marker" :style="{ backgroundColor: slotProps.item.color }">
                                        <i :class="slotProps.item.icon"></i>
                                    </span>
                                </template>
                                <template #content="slotProps">
                                    <Card>
                                        <template #title>{{ slotProps.item.titulo }}</template>
                                        <template #subtitle>
                                            {{ slotProps.item.fecha }} - {{ slotProps.item.doctor }}
                                        </template>
                                        <template #content>
                                            <p>{{ slotProps.item.descripcion }}</p>
                                        </template>
                                    </Card>
                                </template>
                            </Timeline>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
        <div class="col-12 flex justify-end gap-2 mt-4">
            <Button label="Cancelar" severity="secondary" icon="pi pi-times" />
            <Button label="Guardar Cambios" icon="pi pi-check" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.custom-marker {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border-radius: 50%;
    z-index: 1;
}

:deep(.p-timeline-event-opposite) {
    display: none;
}
</style>
