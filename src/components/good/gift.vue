<template>
  <div :class="classObject" ref="gift">
    <!--1 选择框 判断后台数据是否被选中-->
    <!-- 未被选中 -->
    <div class="s1">
      <el-checkbox v-show="text.ischoice != 2" :class="'line-circle'+item.isgroup" @change="checkchange(item.operparam, item.proid, item.ischoice)" v-model="checkchoice"></el-checkbox>
    </div>
    <!--2 商品图片属性及名称 -->
    <div class="s2">
      <a class="s2_img" href=""><img id="img" :src="item.productvarimage" alt=""></a>
      <a href="" class="s2_name" v-text="item['productvarname']"></a>
      <div class="s2_field">
        <span v-if="item['fieldname2']" >{{item.fieldname2 + ':' + item.fielditemname2}}</span>
        <span v-if="item['fieldname1']">{{item.fieldname1 + ':' + item.fielditemname1}}</span>
      </div>
    </div>
    <!--3 商品价格 促销框-->
    <div class="s4">
      <p>{{'￥'+item.retailprice}}</p>
      <div v-if="item.operstatus == 0 && item.isselpromo==1" class="cuxiao fl">
        <p class="sales-promotion" @click="showtoggle" v-bind:class="{'class-c':!isshow1}">促销<b></b></p>
        <div :class="{'promotion-tips class-a':isshow,'promotion-tips class-b':!isshow}">
          <div class="promotion-tit" style="width: 32px;" @click="showtoggle">促销<b></b></div>
          <div class="promotion-cont">
            <ul>
              <li v-for="(value, index) in item.promo" :key="index">
                <div v-if="index === 0">
                  <input type="radio" multipromotion="20" checked="checked" name="radioPromotion_31045017189">{{value.gname ? value.gname : value.pname}}
                </div>
                <div v-else>
                  <input type="radio" multipromotion="20" name="radioPromotion_31045017189">{{value.gname ? value.gname : value.pname}}
                </div>
              </li>
            </ul>
            <div class="op-btns ac mt20">
              <a class="btn-1 select-promotion" @click="showtoggle">确定</a>
              <a class="btn-9 ml10 del cancel-promotion" @click="showtoggle">取消</a>
            </div>
          </div>
        </div>
      </div>
      <div class="opers" v-else-if="item.operstatus == 1">
        该商品已下架
      </div>
      <div class="opers" v-else-if="item.operstatus == 2">
        该商品在本地区暂不支持销售
      </div>
    </div>
    <!--4 计数器 -->
    <!-- 判断商品状态等于0可用 -->
    <div class="s5" v-if="item['operstatus']==0">
      <!-- 判断iseditqty等于0 是没有计数器 -->
      <div v-if="item['iseditqty'] == '0'">
        <div v-if="item['calqtytype']==0">{{item.qty + 'X' + item.updateqty}}</div>
        <div v-else-if="item['calqtytype']==1">{{'X' + item.updateqty}}</div>
      </div>
      <!-- 判断iseditqty等于1 有计数器 -->
      <div id="calcu" v-else-if="item['iseditqty'] == 1">
        <a @click="handleChange(item.operparam, 1, -1)">-</a>
        <input type="text" v-if="item['maxqty'] == '-1'" @change="handleChange(item.operparam, 0, item.updateqty)" id="input" v-model="item.updateqty" :min="item.minqty" :max="200">
        <input type="text" v-else-if="item['maxqty'] != '-1'"   @change="handleChange(item.operparam, 0, item.updateqty)" id="input" v-model="item.updateqty" :min="item.minqty" :max="item.maxqty">
        <a @click="handleChange(item.operparam, 1, +1)">+</a>
      </div>
      <div class="s5_div" v-if="item.stockqty<1">无货</div>
      <div class="s5_div" v-else-if="item.stockqty>10">有货 </div>
      <div class="s5_div" v-else-if="item.stockqty">仅剩{{item.stockqty}}件</div>
    </div>
    <!--5 小计 -->
    <div class="s6">
      <strong v-text="'￥' + item.amt"></strong>
      <span v-if="item.weight==0"></span>
      <span v-if="item.weight!=0">{{item.weight+ 'kg'}}</span>
    </div>
    <!--6 操作 删除按钮 -->
    <div class="s7" v-if="item.isdel != '0'">
      <el-button type="text" @click="open2(item.operparam, item.ischoice, item.proid, item.protype)">删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item', 'ind', 'id', 'data1', 'ind1'],
  data () {
    return {
      text: {},
      checked: true,
      num1: 3,
      isshow: false,
      isshow1: true,
      elements: []
    }
  },
  computed: {
    checkchoice: {
      get: function () {
        return this.text.ischoice === 1
      },
      set: function (v) {
        this.text.ischoice = v ? 1 : 0
      }
    },
    classObject () {
      let clazz = 'gift itemDisable'
      if (this.item.operstatus === 0) {
        if (this.data1.ischoice === 1) {
          clazz = 'gift itemChoice'
        } else {
          clazz = 'gift itemNormal'
        }
      }
      return clazz
    }
  },
  watch: {
    item: {
      handler: function () {
        this.text = this.item
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    handleChange (operparam, opertype, num) {
      this.$emit('inputNumberChange', operparam, opertype, num)
    },
    // 商品的选中和取消选中
    checkchange (operparam, id, choice) {
      this.$emit('dealShowCartChoice', operparam, id, choice)
    },
    // 删除
    open2 (operparam, ischoice, proid, protype) {
      this.$emit('delet_nom', operparam, ischoice, proid, protype)
    },
    showtoggle () {
      this.isshow = !this.isshow
      this.isshow1 = !this.isshow1
    },
    pro () {
      this.isshow1 = !this.isshow1
    }

  }
}
</script>

<style scoped>
  .gift{
    display: block;
    font: 12px/150% tahoma,arial,Microsoft YaHei,Hiragino Sans GB,"\u5b8b\u4f53",sans-serif;
    width: 100%;
    height:80px;
    line-height: 72px;
  }
  .gift .s1, .gift .s2, .gift .s3, .gift .s4, .gift .s5, .gift .s6, .gift .s7{
    display: inline-block;
    text-align: center;
    height: 70px;
    line-height: 70px;
    position: relative;
    vertical-align: top;
    border:1px solid green
  }
  .gift .s1{
    margin-left: 3.5%;
    width: 5%;
  }
  .gift .s1 .el-checkbox{
    height: 100%;
  padding-top:60%
  }
  /* 商品选择框上的虚线样式 */
  /* 选择框上面虚线的样式 */
  .gift .s1 .line-circle1 {
    vertical-align: top;
    height: 38px;
    line-height: 57px;
    /* border: 1px solid blue; */
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* 选择框上下面虚线的样式 */
  .gift .s1 .line-circle2 {
    vertical-align: top;
    height: 70px;
    line-height: 70px;
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  .gift .s2{
    width: 42%;
    text-align: left;
    /* border:1px solid red; */
  }
  .gift .s2 .s2_img{
    display: inline-block;
    width: 40px;
    height: 40px;
    vertical-align: middle;
    /* border: 1px solid red; */
    margin-right: 10px;
  }
  .gift .s2 .s2_img img{
    width: 40px;
    height: 40px;
    vertical-align: top;
  }
  .gift .s2 .s2_name {
    display: inline-block;
    height: 60px;
    margin:5px 0;
    width: 100px;
    overflow: hidden;
    /* border:1px solid green; */
    vertical-align: middle
  }
  .gift .s2 .s2_field {
    width: 4rem;
    display: inline-block;
    margin-left: 5px;
    margin-top:40px;
    vertical-align: top;
    /* border:1px solid red; */
  }
  .gift .s2 .s2_field span{
  line-height: 18px;
  display: block;
  }
  /* 单价样式 */
  .gift .s4{
    width: 8%;
    text-align: left;
  }
  .gift .s4 p{
    display: block;
    /* border: 1px solid red; */
    height: 40px;
    line-height:40 px;
    text-align: center;
    /* padding:10px 0; */
    position: relative;
  }
  /* 促销框样式开始 */
  .gift .s4 .cuxiao {
    display: block;
    height: 22px;
    line-height: 22px;
  }
  .gift .s4 .sales-promotion{
    margin:0 auto;
    display: block;
    width: 41px;
    height: 2px;
    line-height: 2px;
    text-align: left;
    padding-left: 5px;
    border: 1px solid #f9d2d3;
    color: #E2231A;
    cursor: pointer;
    background: #fff;
    text-decoration: none;
    position: relative;
    left: 1px;
  }
  .gift .s4 .class-c{
    display: none;
  }
  .gift .s4 .sales-promotion b {
      display: block;
      position: absolute;
      right: 4px;
      top: 9px;
      width: 7px;
      height: 4px;
      margin-left: 5px;
      overflow: hidden;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-icons-201811.png) -82px -3px;
  }
  .gift .s4 .promotion-tit b {
      display: block;
      position: absolute;
      right: 5px;
      top: 7px;
      vertical-align: middle;
      width: 7px;
      height: 4px;
      margin-left: 5px;
      overflow: hidden;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-icons-201811.png) -82px 0;
  }
  .gift .s4 .class-b{
    display: none;
  }
  .gift .s4 .class-a {
    margin: -1px 0 0;
    display: block;
    padding: 10px 14px 10px 10px;
    width: 200px;
    z-index: 30;
    box-shadow: 0 0 2px 2px #eee;
    border: 1px solid #e4393c;
    background: none repeat scroll 0 0 #fff;
    position: relative;
    top:20px;
    left: 1px;
    text-align: left;
  }
  .gift .s4 .class-a .promotion-tit {
    position: absolute;
    height: 19px;
    line-height: 20px;
    width: 25px;
    border: 1px solid #e4393c;
    border-bottom: 0;
    top: -20px;
    left: -1px;
    background: #fff;
    color: #E2231A;
    padding: 0 17px 0 4px;
    cursor: pointer;
  }
  .gift .s4 .promotion-cont {
    position: relative;
    line-height: 23px;
    width: 280px;
  }
  .gift .s4 .promotion-cont ul {
    list-style: none;
  }
  .gift .s4 .promotion-cont ul li{
    display: list-item;
    text-align: -webkit-match-parent;
  }
  /* 促销框样式结束 */

  /* 修改计数器样式开始 */
    /* 计算器样式开始 */
    .gift .s5{
      width: 17%;
    }
    .gift .s5 div {
      height: 45px;
      line-height: 35px
    }
    .gift .s5 .s5_div{
      display: block;
      height: 10px;
      line-height: 10px;
      border:1x solid red;
    }
    .gift .s5 #calcu{
      background-color: #fff;
      border: 1px solid #cacbcb;
      border-radius: 4px;
      color:#666;
      width: 80px;
      height: 25px;
      line-height: 27px;
      display: block;
      margin:7px auto;
    }
    .gift .s5 #calcu:hover{
      color: #409EFF;
      border:1px solid #409EFF;
    }
    .gift .s5 #calcu a:hover{
      color: #409EFF;
    }

    .gift .s5 #input{
      display: inline-block;
      width: 33px;
      height: 21px;
      line-height: 21px;
      text-align: center;
      border:none;
    }
    .gift .s5 #calcu a{
      text-align: center;
      width: 17px;
      height: 24px;
      display: inline-block;
    }
    .gift .s5 #calcu a:first-child{
      border-right: 1px solid #cacbcb;
    }
    .gift .s5 #calcu a:last-child{
      border-left: 1px solid #cacbcb;
    }
  /* 计算器样式结束 */

  /* 修改计数器样式结束 */

  .gift .s6{
    width: 10.5%;
    color: #666;
    font-family: verdana;
  }

  .gift .s6 strong {
    /* margin:10px auto; */
    color: #333;
    font-weight: 700;
    display: block;
    line-height: 70px;;
  }
  .gift .s6 span {
    display: block;
    line-height: 20px;
    font-weight: normal;
  }
  .gift .s7{
    width: 10%;
    float: right;
  }

  .itemDisable {
    background-color: #ddd
  }
  .itemNormal {
    background-color: #fff
  }
  .itemChoice {
    background-color: #fff4e8
  }
</style>
