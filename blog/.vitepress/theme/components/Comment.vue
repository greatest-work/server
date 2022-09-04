<template>
  <div id="gitalk-container"></div>
</template>

<script>
import conf from '../../utils/conf.js'
  export default {
    name: "blog-comments",
    mounted() {
      const commentConfig = conf.comment;
      const gitalk = new Gitalk({
        id: localtion.pathname,
        ...commentConfig,
      });
      gitalk.render("gitalk-container");
    },
  };
</script>