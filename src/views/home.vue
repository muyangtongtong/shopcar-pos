<template>
    <div class="container">
      <div class="container_main">
        <Main :member="member" ref="main" @getAlldata="getAlldata"></Main>
      </div>
      <div class="container_aside" >
        <Aside :member="member" @intoshowCart="intoshowCart" ref="aside"></Aside>
      </div>
      <div class="clear"></div>
    </div>
</template>

<script>
import Main from '@/components/main.vue'
import Aside from '@/components/aside.vue'
// import Dialog from '@/comments/dialog.vue'
export default {
  components: {
    Main,
    Aside
  },
  // props: ['member'],
  mounted () {
    // let w = document.documentElement.offsetWidth || document.body.offsetWidth
    // if (w < 1000) {
    //   this.$refs.con_aside.clientWidth = 99 %
    //   console.log('this.$refs.con_aside=>', this.$refs)
    // }
  },
  data () {
    return {
      member: {
        'fixationParameter': {
          'memberid': '521',
          'memtype': 0,
          'channeltype': 'A',
          'malorgid': '597',
          'outorgid': '854'
        }
      }
    }
  },
  computed: {
  },
  methods: {
    intoshowCart () {
      this.$refs.main.intoshowCart()
    },
    getAlldata () {
      this.$refs.aside.getAlldata()
    }
  }
}
</script>

<style>
body::-webkit-scrollbar {
    display:none;
    overflow-x:hidden
}
.container {
    height: 100%;
    margin:0;
    padding:0;
    width:100%;
  }
@media only screen and (min-width: 1000px){
  /* html {
    font-size: 62.5% !important;
  } */
  .container .container_aside {
    width: 58%;
    height: 100%;
    float: left;
    text-align: center;
    /* border:4px solid red; */
  }
  .container .container_main {
    width: 40%;
    float: right;
    color: #333;
    /* border:5px solid blue; */
  }
 }
@media only screen and (min-width: 319px) and (max-width:1000){
  .container .container_aside{
    display: none;
  }
  .container .container_main {
    width: 100%;
    min-width: 999px;
    overflow-x:initial
  }
}
</style>
