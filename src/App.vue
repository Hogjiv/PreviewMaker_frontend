<script>
export default {
  data() {
    return {
      name: ''
    }
  },
  components: {
  },
  created() {
    this.$store.dispatch('ioConnect')
  }
}
</script>

<template>
   <div id="app" class="d-flex justify-content-center content ">
    <router-view></router-view>  
  </div>
</template>

<style lang="scss">
@import "bootstrap/scss/bootstrap.scss";
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&display=swap');

body{
  background-color: #F0EEF0;
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
/* .content{
  margin-top: 40px; 
} */
</style>