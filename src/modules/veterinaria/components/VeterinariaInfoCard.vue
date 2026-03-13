<script setup>
const props = defineProps({
    datosVeterinaria: {
        type: Object,
        default: null
    }
});

defineEmits(['abrir-formulario-mascota']);
</script>
<template>
    <div class="col-span-12 lg:col-span-12 xl:col-span-12 mx-auto mb-5">
        <Card>
            <template #title>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <img src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/object/public/block.images/blocks/pageheading/kathryn.png"
                            class="w-[6.42rem] h-[6.42rem]" />
                        <h2 class="font-bold text-3xl mb-0">{{ props.datosVeterinaria.nombre }}</h2>
                    </div>
                </div>
            </template>
            <template #content>
                <div class="flex justify-around items-center">
                    <div class="text-center">
                        <p class="font-semibold text-lg text-muted-color mb-1">Contacto</p>
                        <p class="text-xl font-bold">Correo: {{ props.datosVeterinaria.email }} / Teléfono: {{
                            props.datosVeterinaria.telefono }}</p>
                    </div>
                    <div class="text-center">
                        <Button label="Registrar Paciente" icon="pi pi-plus" severity="success"
                            @click="$emit('abrir-formulario-mascota')" />
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>
