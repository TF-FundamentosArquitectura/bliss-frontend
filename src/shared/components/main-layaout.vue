<script setup>
import HeaderToolbar from "./header-toolbar.component.vue";
</script>

<template>
    <HeaderToolbar />
    <div class="main-content">
        <router-view />
    </div>
</template>

<style>
.main-content {
    padding-top: 60px;
}
</style>
