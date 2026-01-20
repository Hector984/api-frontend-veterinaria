import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
    const loading = ref(false);
    const isLoading = computed(() => loading.value);

    function setLoading() {
        loading.value = !loading.value;
    }

    return { loading, isLoading, setLoading };
});
