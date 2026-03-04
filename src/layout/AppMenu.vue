<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Veterinarias', icon: 'pi pi-fw pi-home', to: '/veterinarias' },
            { label: 'Mi Veterinaria', icon: 'pi pi-fw pi-home', to: '/mi-veterinaria' }
        ]
    },
    {
        label: 'Configuración',
        items: [{ label: 'Receta', icon: 'pi pi-fw pi-home', to: '/configuracion/receta' }]
    },
    {
        label: 'Cuenta',
        items: [{ label: 'Perfil', icon: 'pi pi-fw pi-home', to: '/perfil' }]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
