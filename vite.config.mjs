import { fileURLToPath, URL } from 'node:url';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        // CORRECCIÓN: Nombre de propiedad correcto
        include: [
            'primevue/config',
            'primevue/tabs',
            'primevue/tabpanel',
            'primevue/tablist',
            'primevue/tabpanels', // Añadido
            'primevue/card',
            'primevue/inputtext',
            'primevue/timeline',
            'primevue/avatar',    // Añadido (lo usas en tu código)
            'primevue/button'     // Añadido
        ]
    },
    plugins: [
        vue(),
        Components({
            resolvers: [
                PrimeVueResolver({
                    importStyle: false
                })
            ]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});