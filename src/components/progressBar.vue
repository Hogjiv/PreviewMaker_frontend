<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      isVisible: true,
      //text: true,
    };
  },
  computed: {
    ...mapState(['modelsList']),
    totalReadyModels() {
      const totalModels = this.modelsList.length;
      const readyModels = this.modelsList.reduce((total, model) => {
        return total + (model.ready ? 1 : 0);
      }, 0);
      const notReadyModels = totalModels - readyModels;
      console.log("s1")
      return {
        totalModels,
        readyModels,
        notReadyModels,
      };
    },
    textToShow() {
      console.log("s2")
      return this.totalReadyModels.notReadyModels === 0;
    },
  },
};
</script>

<template>
 
  <div v-if="isVisible">
    <p class="bold-text  font-size-24   font-color-pink text-uppercase"> {{ totalReadyModels.notReadyModels }} models from {{ totalReadyModels.totalModels }} are not ready</p>
  </div>
  <div v-else>
    123
  </div>

</template>
