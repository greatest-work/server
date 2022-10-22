<template>
  <div>
     <footer class="page-edit">
     <p class="platform"> Copyright &copy; 2020-2022
        <a href="https://github.com/CrazyMrYan">@CrazyMrYan</a> 
        <a href="https://beian.miit.gov.cn/">湘ICP备2022013329号-1</a> </p>
      </footer>
  </div>
</template>

<script>

export default {
  setup(){
    const data = {

    }
    return{
      data
    }
  }
}
</script>

<style>
.platform{
  text-align: center;
}
.platform > a{
  color:  #2196f3;
}
.page-edit {
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.page-edit a {
  color: var(--text-color);
  margin-right: 0.25rem;
  display: inline-block;
  margin: 0 .2rem;
}
.imgIcon{
  width: 1.5rem;
  border-radius: 50%;
}
</style>
