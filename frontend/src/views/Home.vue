<template>
  <div class="Home">
    <Header />
    <SendPublication />
    <Timeline />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from '@/components/HomeHeader.vue'
import Timeline from '@/components/Timeline.vue'
import SendPublication from '@/components/SendPublication.vue'


export default {
  name: 'Home',
  components: {
    Header,
    SendPublication,
    Timeline
  },
  mounted: function () {
    if (this.$store.state.user.userId == -1) {
     this.$router.push('/');
      return ;
    }
  },
}
</script>

<style>
</style>