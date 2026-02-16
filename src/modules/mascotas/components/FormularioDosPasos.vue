<script setup>
import { useClienteStore } from '@/modules/clientes/stores/useClienteStore';
import { useMascotaStore } from '@/modules/mascotas/stores/useMascotaStore';
import { useNotificacionesStore } from '@/modules/notificaciones/store/useNotificaciones';
import { ref } from 'vue';
import FormularioRegistrarCliente from './FormularioRegistrarCliente.vue';
import FormularioRegistrarMascota from './FormularioRegistrarMascota.vue';

const notificacionesStore = useNotificacionesStore();

const visible = defineModel('visible', { type: Boolean });
const mascotaStore = useMascotaStore();
const clienteStore = useClienteStore();
const emits = defineEmits(['cerrar-formulario']);

const activeStep = ref(1);

const formularioClienteValido = ref(false);
const formularioMascotaValido = ref(false);

const registrarMascota = async () => {
    if (formularioMascotaValido.value) {
        try {
            const respuesta = await mascotaStore.registrarMascota();
            if (respuesta && respuesta.status == 200) {
                notificacionesStore.mostrarExito('Éxito', 'Mascota registrada.');
                mascotaStore.limpiarDatosMascota();
                cerrarFormulario();
            } else {
                notificacionesStore.mostrarError('Error', 'No se pudo registrar la mascota.');
            }
        } catch (error) {
            console.error('Error al registrar mascota:', error);
            notificacionesStore.mostrarError('Error', 'Ocurrió un error al registrar la mascota.');
        }
    }
};

const registrarCliente = async () => {
    if (formularioClienteValido.value) {
        try {
            const respuesta = await clienteStore.registrarCliente();
            if (respuesta && respuesta.status == 200) {
                notificacionesStore.mostrarExito('Éxito', 'Cliente registrado.');
                mascotaStore.seleccionarCliente(respuesta.data);
                activeStep.value = 2;
            } else {
                notificacionesStore.mostrarError('Error', 'No se pudo registrar el cliente.');
            }
        } catch (error) {
            console.error('Error al registrar cliente:', error);
            notificacionesStore.mostrarError('Error', 'Ocurrió un error al registrar el cliente.');
        }
    }
};

const habilitarRegistroMascota = () => {
    activeStep.value = 2;
};

const cerrarFormulario = () => {
    emits('cerrar-formulario');
};
</script>

<template>
    <Dialog header="Alta de nuevo paciente" v-model:visible="visible" :breakpoints="{ '960px': '90vw' }"
        :style="{ width: '60vw' }" :modal="true">
        <div class="w-full">
            <Stepper v-model:value="activeStep" class="w-full">
                <StepList class="w-full flex justify-between items-center mb-4">
                    <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="1">
                        <div class="flex flex-auto items-center" v-bind="a11yAttrs.root">
                            <button class="bg-transparent border-0 cursor-pointer p-0" @click="activateCallback"
                                v-bind="a11yAttrs.header">
                                <span :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center transition-colors duration-300',
                                    { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700 text-surface-400': value > activeStep }
                                ]">
                                    <i class="pi pi-user" />
                                </span>
                            </button>
                            <div class="flex-auto border-t-2 ml-4 mr-2 transition-colors duration-300"
                                :class="{ 'border-primary': activeStep > 1, 'border-surface-200 dark:border-surface-700': activeStep <= 1 }">
                            </div>
                        </div>
                    </Step>

                    <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild :value="2">
                        <div class="flex items-center" v-bind="a11yAttrs.root">
                            <button class="bg-transparent border-0 cursor-pointer p-0" @click="activateCallback"
                                v-bind="a11yAttrs.header">
                                <span :class="[
                                    'rounded-full border-2 w-12 h-12 inline-flex items-center justify-center transition-colors duration-300',
                                    { 'bg-primary text-primary-contrast border-primary': value <= activeStep, 'border-surface-200 dark:border-surface-700 text-surface-400': value > activeStep }
                                ]">
                                    <i class="pi pi-star" />
                                </span>
                            </button>
                        </div>
                    </Step>
                </StepList>

                <StepPanels class="w-full">
                    <StepPanel :value="1">
                        <div class="flex flex-col gap-4 w-full" style="min-height: 16rem">
                            <div class="text-center mt-4 mb-2 text-xl font-semibold">Datos del dueño</div>
                            <FormularioRegistrarCliente
                                @cliente-valido="formularioClienteValido = $event" />
                        </div>
                    </StepPanel>

                    <StepPanel :value="2">
                        <div class="flex flex-col gap-4 w-full" style="min-height: 16rem">
                            <div class="text-center mt-4 mb-2 text-xl font-semibold">Datos de la mascota</div>
                            <FormularioRegistrarMascota v-if="activeStep === 2"
                                @formulario-mascota-valido="formularioMascotaValido = $event" />
                        </div>
                    </StepPanel>
                </StepPanels>

                <div class="flex justify-end gap-3 mt-4">
                    <Button label="Cancelar" icon="pi pi-times" severity="secondary" @click="cerrarFormulario" />
                    <Button v-if="activeStep === 1" label="¿Ya estas registrado?"
                        severity="secondary" @click="habilitarRegistroMascota" />

                    <Button v-if="activeStep === 1" type="button" label="Siguiente: Datos Mascota"
                        icon="pi pi-arrow-right" iconPos="right" :disabled="!formularioClienteValido"
                        @click="registrarCliente" />

                    <Button v-if="activeStep === 2" label="Atrás" severity="secondary" icon="pi pi-arrow-left"
                        @click="activeStep = 1" />

                    <Button v-if="activeStep === 2" label="Registrar Paciente" icon="pi pi-check"
                        :disabled="!formularioMascotaValido" @click="registrarMascota" />
                </div>
            </Stepper>
        </div>
    </Dialog>
</template>
