<template>
    <v-app-bar flat color="white" class="elevation-1">
      <v-btn icon @click="goBack" v-if="showBackButton">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
  
      <v-toolbar-title class="text-h6 font-weight-bold">
        {{ title }}
      </v-toolbar-title>
  
      <v-spacer />
    </v-app-bar>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { defineProps } from 'vue';
  
  const router = useRouter();
  
  // Define props
  defineProps<{
    title: string
    showBackButton?: boolean
  }>()
  
  // Navigation logic
  const goBack = () => {
    router.back();
  };
  </script>
  
  <style scoped>
  .v-toolbar-title {
    margin-left: 8px;
  }
  </style>
  