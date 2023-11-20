<script>
//import progressBar from "@/components/progressBar";
export default {
  data() {
    return {
      name: ''
    }
  },
  components: {
    // progressBar
  },
  created() {
    this.$store.dispatch('ioConnect')
  }
}
</script>

<template>
   <!-- <div id="app" class="d-flex justify-content-center content "> -->
    <div id="app" class="app">
    <!-- <router-link to="/progress">Test page</router-link> | -->
    <!-- <router-link to="/faqPage"> FAQ </router-link> | -->
    <router-view></router-view>  
  </div>
  
</template>

<style lang="scss">
@import "bootstrap/scss/bootstrap.scss";
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&display=swap');
 
body{
  background-color: #ffffff;
}
.app{
  position: relative
}
.normal-text {
  font-family: "Roboto", sans-serif;
  font-weight: 400; /* Обычный вес */
}

.medium-text {
  font-family: "Roboto", sans-serif;
  font-weight: 500; /* Средний вес */
}

.bold-text {
  font-family: "Roboto", sans-serif;
  font-weight: 900; /* Жирный вес */
}

.font-size-14 {
  font-size: 14px;
}
.font-size-16 {
  font-size: 16px;
}

.font-size-19 {
  font-size: 19px;
}
.font-size-22 {
  font-size: 22px;
}

.font-size-24 {
  font-size: 24px;
}

.font-size-32 {
  font-size: 32px;
}

.font-size-40 {
  font-size: 40px;
}

.font-color-dark{
  color: #5E5E5E;
}

.font-color-pink{
  color: #C97191;
}
 
 
 
</style>