<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useToast } from "primevue/usetoast";
import HeaderToolbar from "./header-toolbar.component.vue";
import WebSocketClient from "../../iam/services/websocket-client";

const toast = useToast();
let wsClient = null;

const showNotification = (message) => {
    try {
        const obj = JSON.parse(message);
        console.log("🔍 Objeto parseado:", obj);

        // Solo mostramos si es tipo "notification"
        if (obj.type === "notification" && obj.content) {
            toast.add({
                severity: "info",
                summary: "Notificación",
                detail: obj.content,
                life: 5000
            });
        } else {
            console.warn("Mensaje recibido sin tipo 'notification':", obj);
        }
    } catch (err) {
        console.error("❌ Error parseando mensaje JSON:", err);
        console.warn("Mensaje bruto:", message);
    }
};

onMounted(() => {
    if (localStorage.getItem("token")) {
        wsClient = new WebSocketClient(showNotification);
        wsClient.connect();
    }
});

onBeforeUnmount(() => {
    if (wsClient) {
        wsClient.close();
    }
});
</script>


<template>
    <HeaderToolbar />
    <div class="main-content">
        <router-view />
    </div>
    <pv-toast position="bottom-right" />
</template>

<style>
.main-content {
    padding-top: 60px;
}
</style>
