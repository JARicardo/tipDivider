<!-- src/components/NavBar.vue -->
<template>
    <v-navigation-drawer expand-on-hover rail app >
      <v-list dense>
        <v-list-item prepend-icon="mdi-phone" title="My Files" value="myfiles">Hola</v-list-item>

        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>

        <v-list-item prepend-icon="mdi-folder" title="My Files" value="myfiles"></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const drawer = ref(false);  // Drawer visibility state
  const router = useRouter();
  
  // Toggle the drawer open/close
  const toggleDrawer = () => {
    drawer.value = !drawer.value;
  };
  
  // Function to navigate to a route
  const navigateTo = (path: string) => {
    router.push(path);
  };
  </script>
  
  <style scoped>
  /* Optional custom styles */
  </style>
  