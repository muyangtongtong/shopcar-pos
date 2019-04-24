
<template>
  <div class="show_data">
    <div class="category" style="width:100%;">
      <div v-for="(data, index) in this.options" :key="index">
        <a @click="categoryfun(data.classid)" class="category_a">{{data.classname}}</a>
      </div>
      <!-- 三级联动 -->
      <!-- <div v-for="(data, index) in this.options" :key="index" style="border:1px solid red; height:40px; text-aline: left;display:block;background:#fff;">
        <div style="display:inline-block;width: 10%;line-height:25px;height: 25px;border:1px solid green;float:left">
          <a>{{data.classname}}</a>
        </div>
        <div style="display:inline-block;width: 80%;border:1px solid green;">
          <button v-for="(dat, ind) in data.data3" :key="ind">{{dat}}</button>
        </div>
      </div> -->
    </div>
    <div v-for="(dat,ind) in datasfoud" :key="'dat.id'+ind" class="box" style="position:relative">
      <div class="div_top" @click="addshopcart(dat.operparam,ind, 1)">
        <img :src="dat.imageurl" alt="图片加载失败" title="这是一张图片" style="width:100%;height:130px;text-align:center;line-height:130px">
      </div>
      <div class="div_bottom">
        <div class="productvarname" @click="addshopcart(dat.operparam,ind, 1)">{{dat.productvarname}}</div>
        <div class="price">
          <span style="color:red">{{'￥'+dat.retailprice}}</span>
          <span @click="addshopcart(dat.operparam,ind, 1)"> <i class="fa fa-shopping-cart" style="color:red;font-size:18px;"></i></span>
        </div>
      </div>
    </div>
    <div class="clear"></div>
  </div>
</template>
<script>
export default {
  // aside 8003 main 8002
  props: ['member'],
  data () {
    return {
      currpage: 1,
      pagesize: 10,
      val: '',
      options: [], // 三级联查数据
      datasfoud: [],
      groups: [],
      filterText: '',
      show2: false
    }
  },
  mounted () {
    this.getAlldata()
    this.getlist()
  },
  watch: {
  },
  methods: {
    getlist () {
      this.$http.post('/app/productCata', Object.assign({}, this.member))
        .then(res => {
          let classname = {}
          for (var i = 0; i < res.data.data.data.length; i++) {
            let data3 = []
            for (var j = 0; j < res.data.data.data[i].data.length; j++) {
              for (var k = 0; k < res.data.data.data[i].data[j].data.length; k++) {
                data3.push(res.data.data.data[i].data[j].data[k].fielditemname)
              }
            }
            classname = {
              'classid': res.data.data.data[i].classid,
              'classname': res.data.data.data[i].classname,
              'data3': data3
            }
            this.options.push(classname)
          }
        }).catch(err => {
          console.error(err)
          this.$alert('请求超时，刷新重试！')
        })
    },
    handleCurrentChange (cpage) {
      this.currpage = cpage
    },
    handleSizeChange (psize) {
      this.pagesize = psize
    },
    // 获取购物车商品数量
    getCartqty () {
      this.$http.post('/cart/getCartQty',
        {
          'channeltype': 'A',
          'gradeid': 10,
          'malorgid': 10214,
          'mempricefieldid': 0,
          'memtype': 1,
          'memberid': 521,
          'outorgid': 10218
        })
        .then(res => {
          if (res.status === 200) {
            for (var i = 0; i < this.datasfoud.length; i++) {
              this.datasfoud[i].cartqty = res.data.data[i].qty
              // console.log(res.data.data[i].qty)
            }
          }
        })
    },
    // 查找商品列表
    getAlldata () {
      let that = this
      this.$http.post('/app/productSearch', Object.assign({}, this.member))
        .then(res => {
          let { data } = res.data
          that.datasfoud = data.prolist
          // console.log('/app/productSearch=>', this.datasfoud)
          this.$emit('intoshowCart')
          // 调用getCartQty()方法再点击查询按钮时将购物车数量渲染到页面上
          // this.getCartqty()
        }).catch(err => {
          console.log('err=>', err)
        })
    },
    // 得到查询数据
    productSearch () {
      this.getAlldata()
      // let searchText = this.$refs.searchval.currentValue
      // if (!searchText) { // 空串 ， undefined ， 0
      //   return this.getAlldata()
      // } else {
      //   // 提交参数
      //   this.$http.post('/app/productSearch', Object.assign({}, this.member, {
      //     'keyword': searchText
      //   }))
      //     .then(res => {
      //       if (res.status === 200) {
      //         this.datasfoud = res.data.data.prolist
      //         // console.log('/app/productSearch=>', this.datasfoud)
      //         this.$emit('intoshowCart')
      //       }
      //     })
      //     .catch((err) => {
      //       console.log(err)
      //       this.$alert('请求超时，刷新重试！')
      //     })
      // }
    },
    // 点击添加到购物车 更改加购物车后面数量
    addshopcart (operparam, index, num) {
      // console.log('operparam=>', operparam)
      this.$http.post('/cart/dealCartQty', Object.assign({}, this.member, {
        'answersParameter': JSON.parse(operparam),
        'receptionParameter': {
          'qty': num,
          'opertype': 1
        }
      })).then(res => {
        // console.log('addshopcart=>', res)
        // let row = this.datasfoud[index]
        // row.cartqty = res.data.data[0].qty
        // this.datasfoud.splice(index, 1, row)
        // console.log('this.datasfoud111=>', this.datasfoud)
        // this.productSearch()
        this.$emit('intoshowCart')
      }).catch((err) => {
        console.log('ree=>', err)
        this.$alert('请求超时，刷新重试！')
      })
    },
    handlecascader (vale) {
      // console.log('vale=>', vale)
      for (var i = 0; i < vale.length; i++) {
        this.$http.post('/app/productSearch', Object.assign({}, this.member, {
          'searchfield': [{
            'fieldid': vale[1],
            'fielditemid': vale[2]
          }],
          'webclassid': vale[0]
        }))
          .then(res => {
            if (res.status === 200) {
              this.datasfoud = res.data.data.prolist
              this.$emit('intoshowCart')
            }
          })
          .catch((err) => {
            console.log(err)
            this.$alert('请求超时，刷新重试！')
          })
      }
    },
    categoryfun (id) {
      this.$http.post('/app/productSearch', Object.assign({}, this.member, {
        'webclassid': id
      }))
        .then(res => {
          if (res.status === 200) {
            this.datasfoud = res.data.data.prolist
            this.$emit('intoshowCart')
          }
        })
        .catch((err) => {
          console.log(err)
          this.$alert('请求超时，刷新重试！')
        })
    }
  }
}
</script>

<style>
/* 展示数据样式 */
  .show_data {
    /* border:1px solid red;; */
    width: 100%;
    font-size: 0.5rem;
    background: rgb(215, 227, 243);
    margin:0;
    padding:0;
  }
   .show_data .box{
     float: left;
     border-bottom: 1px solid #fff;
     border-radius: 0.5rem;
     background: #fff;
     display: inline-block;
     width: 24%;
     min-height: 180px;
     height: 35%;
     overflow: hidden;
     margin: 0.5rem 0.1rem;
   }
   .show_data .box .div_top {
     width: 99%;
     height: 130px;
     border: 1px solid red;
     border-top-left-radius: 0.5rem;
     border-top-right-radius: 0.5rem;
   }
   .show_data .box .div_bottom {
     width: 92%;
     height: 50px;
     padding:0 0.3rem;
     /* border:1px solid blue; */
     border-bottom-left-radius: 0.5rem;
     border-bottom-right-radius: 0.5rem;
   }
   .show_data .box .div_bottom .productvarname{
     width: 99%;
     text-align: left;
     height: 50%;
     line-height: 1.5rem;
     /* border:1px solid blue; */
     overflow: hidden;
   }
   .show_data .box .div_bottom .price {
     width: 99%;
     text-align: left;
     height: 50%;
     line-height: 1.5rem;
     /* border:1px solid blue; */
   }
   .show_data .box .div_bottom .price span:first-child {
     width: 70%;
     display: inline-block;
     border-right:1px solid #aaa;
   }
   .show_data .box .div_bottom .price span:last-child {
     text-align: center;
     width: 24%;
     /* border:1px solid blue; */
     display: inline-block
   }
   /* 三级目录样式 */
   .show_data .category .category_a {
      /* border:1px solid red;  */
      height:20px;
      line-height: 20px;
      color: #292cb8;
      width: 9%;
      float: left;
      text-align: center;
      display:inline-block;
      font-size: 14px;
      padding:10px 5px;
      margin:0 5px;
   }
/* 展示样式结束 */
</style>
