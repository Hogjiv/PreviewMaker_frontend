<script>
export default {
  data() {
    return {
      percentage: 0
    };
  },
  computed: { 
    percent() {
      return Math.floor(this.percentage);
    }
  },
  created() {
    var intval = setInterval(() => {
      if(this.percentage < 100)
        this.percentage += .1;
      else 
        clearInterval(intval);
    }, 1)
  }
};
</script>
<template> 
  <div class="container">
    <div> {{ percent }}% </div>
    <div class="loading-bar">
      <div class="percentage" :style="{'width' : percentage + '%'}"></div>
    </div>
  </div>
</template>

<style> 
.container {
  text-align:  right;
  font-size: 4rem;
  color:  #3d3d3d;
}
.loading-bar {
  position: relative;
  width: 500px;
  height: 30px;
  border-radius: 15px;
  overflow: hidden;
  border-bottom: 1px solid #ddd;
  box-shadow: inset 0 1px 2px rgba(147, 138, 191, 0.039),
    0 -1px 1px #ddd, 1px 0 rgb(195, 195, 195);
}
.percentage {
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  display: block;
  height: 100%;
  border-radius: 15px;
  background-color: #95c07a;
  background-size: 30px 30px;
  background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.039) 0%, transparent 50%, rgba(255, 255, 255, 0.039) 50%, transparent 75%, transparent);
animation: animate stripes 3s linear infinite;
}

@keyframes animate-stripes {
  0% { background-position: 0 0;}
  100% { background-position: 60px 0;}
}
</style>
