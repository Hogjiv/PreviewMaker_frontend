<script>
//import progressBar from "@/components/progressBar";
export default {
  data() {
    return {
      name: "",
    };
  },
  components: {
    // progressBar
  },
  created() {
    this.$store.dispatch("electronConnect");
  },
};
</script>

<template>
  <!-- <div id="app" class="d-flex justify-content-center content "> -->
  
    <div id="app" class="app">
      <router-view></router-view>
    </div>

    <div class=" footer font-color-gray  mt-5 font-size-14 normal-text text-center ">
      Questions to
      <a href="mailto:hogjiv@gmail.com">
        hhyperplace@gmail.com </a> <br>
      donation to PayPal <u> hogjiv01@gmail.com </u> <br>
      Copyright Irina Avdeyeva | 2023
    </div>
 
</template>

<style lang="scss">
@import "bootstrap/scss/bootstrap.scss";
</style>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&display=swap");

body {
  height: 100%;
  margin: 0;
  /* Убираем отступы */
}

a {
  color: #B9B9B9 !important;
}


.footer {
  width: 100%;
  position: absolute;
}

.app {
  /*  position: relative;*/
  /*  height: 100%;*/

}
 

.normal-text {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  /* Обычный вес */
}

.medium-text {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  /* Средний вес */
}

.bold-text {
  font-family: "Roboto", sans-serif;
  font-weight: 900;
  /* Жирный вес */
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

.font-color-dark {
  color: #5e5e5e;
}

.font-color-pink {
  color: #c97191;
}

.font-color-gray {
  color: #B9B9B9
}



::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: #6e6e6e;
  border-radius: 2px;
}

::-webkit-scrollbar-track {
  background-color: #2c2c2c;
}


.scrollbar {
  scrollbar-color: #3f3f3f;
  width: 8px;
}


.scrollbar-corner {
  background-color: #6e6e6e;
}
</style>
