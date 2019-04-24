<template>
  <div :class="classTextn">
    <!--1 选择框 判断后台数据是否被选中-->
    <div class="s1" >
      <el-checkbox v-show="text.ischoice != 2" :class="'line-circle'+text.isgroup" @change="checkchange( item.operparam, item.proid, item.ischoice)" v-model="checkchoice"></el-checkbox>
    </div>
    <!--2 图标 文字 按钮-->
    <!-- 判断当icontype=='0'无图标  icontype== 1 正常生效 icontype== 2 未生效 icontype== 3 过期 -->
    <div class="s2">
      <a :class="'t'+item.icontype" target="_blank" v-if="item.icontype != 0">
        <a class="full-icon full-gray-icon">{{item.iconlabel}}<b></b></a>
      <span> {{item.text1}}</span>
      </a>
      <a v-else-if="item.icontype == 0">{{item.text1}}</a>
      <!-- 点击弹出弹框 -->
      <span class="s2_button" v-if="item.clicktype == 5">
        <el-button slot="reference" v-if="JSON.parse(item.clickparam).type==1" @click="cartPromoPop(item.clickparam)">任选组合</el-button>
        <el-button slot="reference" v-else-if="JSON.parse(item.clickparam).type==2" @click="cartPromoPop(item.clickparam)">赠品组合</el-button>
        <el-button slot="reference" v-else-if="JSON.parse(item.clickparam).type==3" @click="cartPromoPopj(item.clickparam)">加价购</el-button>
      </span>
    </div>
    <!-- 促销框 -->
    <div class="s3" v-if="item.isselpromo == 0" style="display:none"></div>
    <div  class="s3" v-if="item.isselpromo == 1">
      <div v-if="item.operstatus == 0 && item.isselpromo==1" class="cuxiao fl">
        <p class="sales-promotion" @click="showtoggle" v-bind:class="{'class-c':!isshow1}">促销<b></b></p>
        <div class="promotion-tips" v-bind:class="{'class-a':isshow,'class-b':!isshow}">
          <div class="promotion-tit" style="width: 32px;" @click="showtoggle">促销<b></b></div>
          <div class="promotion-cont">
            <ul>
              <li v-for="(value,ind,index) in item.promo" :key="ind">
                <input type="radio" name="radioPromotion_31045017189" value="-50000058374_50000058374_31045017189_11_50000058374" :checked="index == 0" multipromotion="20" title="每满299元减30元">{{value}}
              </li>
            </ul>
            <div class="op-btns ac mt20">
              <a class="btn-1 select-promotion" @click="sure">确定</a>
              <a class="btn-9 ml10 del cancel-promotion" @click="showtoggle">取消</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 判断是否有加价购 当clicktype=5 时 clickparam点击参数type=1 任选组合 type=2 赠品组合 type=3 加价购 -->
    <!--3 商品价格 -->
    <div class="s4">
      <p>{{'￥'+item.retailprice}}</p>
    </div>
    <!--4 计数器 -->
    <!-- 判断商品状态等于0可用 -->
    <div  class="s5" v-if="item['operstatus']==0">
      <!-- 判断iseditqty等于0 是没有计数器 -->
      <div v-if="item['iseditqty'] == '0'">
        <div v-if="item['calqtytype']==0">{{item.qty + 'X' + item.updateqty}}</div>
        <div v-else-if="item['calqtytype']==1">{{' X ' + item.updateqty}}</div>
      </div>
      <!-- 判断iseditqty等于1 有计数器 -->
      <div id="calcu" v-else-if="item['iseditqty'] == 1">
        <!-- 判断计数器里的值如果小于1时 减数的按钮不可用 大于1时可用 -->
        <a v-if="item.updateqty == item.minqty" class="disabled" onclick="return false;">-</a>
        <a v-else-if="item.updateqty != '1'" class="abled" @click="handleChange(item.operparam, 1, -1, item.updateqty)">-</a>
        <input type="text" id="input" @change="handleChange(item.operparam, 0, item.updateqty, item.updateqty)" v-model="item.updateqty">
        <a @click="handleChange(item.operparam, 1, 1, item.updateqty)">+</a>
      </div>
    </div>
    <!--5 小计 -->
    <div class="s6" v-if="item.showtype== '4'">
      <span class="redu0" v-if="item.reduceamt==0">{{'￥'+item.amt}}</span>
      <span class="redu1" v-if="item.reduceamt!=0">
        <div>{{'￥'+item.retailprice}}</div>
        <div>减</div>
        <div>{{'￥'+item.reduceamt}}</div>
      </span>
    </div>
    <!--6 操作 删除按钮 -->
    <div class="s7" v-if="item.isdel != '0'">
      <el-button type="text" @click="open2(item.operparam, item.ischoice, item.proid, item.protype)">删除</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item', 'ind', 'data1'],
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
      },
      text: {},
      num1: 3,
      checked: false,
      isshow: false,
      isshow1: true,
      // dialogVisible: false,
      dialogVisible1: false,
      checkList: [],
      groupqty: 0,
      operparam: '',
      maxqty: 0
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
    classTextn () {
      let clazz = 'text_normal itemDisable'
      // if (this.item.operstatus === 0) {
      if (this.data1.ischoice === 1) {
        clazz = 'text_normal itemChoice'
      } else {
        clazz = 'text_normal itemNormal'
      }
      // }
      return clazz
    }
  },
  watch: {
    item: {
      handler: function (val, oldVal) {
        this.text = this.item
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    // 点击计数器出发该方法
    handleChange (operparam, opertype, num, updataqty) {
      this.$emit('inputNumberChange', operparam, opertype, num, updataqty)
    },
    // 得到任选组合弹出数据
    cartPromoPop (clickparam) {
      this.$emit('cartPromoPop', clickparam)
    },
    // 处理任选组合数据 this.tableData.maxqty
    handleClose () {
      this.$emit('handleClose')
    },
    // 得到加价购得数据
    cartPromoPopj (clickparam) {
      this.$emit('cartPromoPopj', clickparam)
    },
    // 处理加价购数据
    handleClosej () {
      this.$emit('handleClosej')
    },
    // 商品的选中和取消选中
    checkchange (operparam, id, choice) {
      this.$emit('dealShowCartChoice', operparam, id, choice)
    },
    // 删除
    open2 (operparam, ischoice, proid, protype) {
      this.$emit('delet_nom', operparam, ischoice, proid, protype)
    },
    // 点击促销框 展开和收起
    showtoggle () {
      this.isshow = !this.isshow
      this.isshow1 = !this.isshow1
    },
    // 点击促销狂中得确定按钮 促销框收起
    sure () {
      this.isshow = !this.isshow
      this.isshow1 = !this.isshow1
    }
  }
}
</script>
<style scoped>
@media only screen and (min-width: 1000px){
  .text_normal{
    width: 99.9%;
    height: 40px;
    line-height: 40px;
  }
  .text_normal .s1,.text_normal .s2,.text_normal .s2 .s2_button,.text_normal .s3,.text_normal .s4,.text_normal .s5,.text_normal .s6,.text_normal .s7{
    display: inline-block;
    /* border:1px solid red; */
    vertical-align: middle;
    height:40px;
    line-height: 40px;
    text-align: center
  }
  .text_normal .s1{
    width: 5%;
    overflow: hidden;
  }
  .text_normal .s1 .el-checkbox__input {
      vertical-align: middle;
  }
  /* 选择框上面虚线的样式 */
  .text_normal .s1 .line-circle2 {
    vertical-align: top;
    /* border: 1px solid red; */
    position: relative;
    height: 28px;
    line-height: 40px;
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* 选择框上下面虚线的样式 */
  .text_normal .s1 .line-circle3 {
    position: relative;
    /* border:1px solid red; */
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* s2样式 */
  .text_normal .s2{
    width: 37%;
    text-align: left;
    overflow: hidden;
  }
  .text_normal .s2_button button{
    border:1px solid #dcdfea;
    color: #E2231A;
    background-color: #eee;
    margin-left: 5px;
    font-size: 8px;
  }
  /* 已生效样式 */
  .text_normal .t2 .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_normal .t2 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_normal .t2 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #f48719;
      border: 1px solid #f48719;
      color: #fff;
      padding: 1px 3px;
      height: 16px;
      line-height: 16px;
  }
  .text_normal .t2 .full-icon b {
      display: block;
      position: absolute;
      width: 5px;
      height: 6px;
      left: -1px;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 0 no-repeat;
      overflow: hidden;
  }
  /* 未生效样式 */
  .text_normal .t1  .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_normal .t1 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_normal .t1 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #f48719;
      color: #f48719;
      padding: 1px 3px;
      height: 16px;
      line-height: 16px;
  }
  .text_normal .t1 .full-icon b {
      display: block;
      position: absolute;
      margin:0;
      padding: 0;
      font-weight: bold;
  }
  /* 过期样式 */
  .text_normal .t3  .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_normal .t3 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_normal .t3 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #f48719;
      color: #f48719;
      padding: 1px 3px;
      height: 16px;
      line-height: 16px;
  }
  .text_normal .t3 .full-icon b {
      display: block;
      position: absolute;
      margin:0;
      padding: 0;
      font-weight: bold;
  }
  .text_normal .s3{
    width: 9%;
  }
  .text_normal .s3 .cuxiao {
    display: block;
    height: 22px;
    line-height: 22px;
  }
  .text_normal .s3 .sales-promotion{
    margin:10px auto;
    display: block;
    width: 41px;
    height: 22px;
    line-height: 22px;
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
  .text_normal .s3 .class-c{
    display: none;
  }
  .text_normal .s3 .sales-promotion b {
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
  .text_normal .s3 .promotion-tit b {
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
  .text_normal .s3 .class-b{
    display: none;
  }
  .text_normal .s3 .class-a {
    margin: 10px 0 0;
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
  .text_normal .s3 .class-a .promotion-tit {
      position: absolute;
      height: 19px;
      line-height: 20px;
      width: 20px;
      border: 1px solid #e4393c;
      border-bottom: 0;
      top: -20px;
      left: -1px;
      background: #fff;
      color: #E2231A;
      padding: 1px 11px 0 5px;
      cursor: pointer;
  }
  .text_normal .s3 .promotion-cont {
      position: relative;
      line-height: 23px;
      width: 280px;
  }
  .text_normal .s3 .promotion-cont ul {
      list-style: none;
  }
  .text_normal .s3 .promotion-cont ul li{
      display: list-item;
      text-align: -webkit-match-parent;
  }
  /* 促销框样式结束 */

  /* 单价样式 */
  .text_normal .s4{
    width: 8%;
    text-align: left;
  }
  .text_normal .s4 p{
    display: block;
    height: 40px;
    /* line-height:90px; */
  }
  /* 计算器样式开始 */
    .text_normal .s5{
      width: 17%;
    }
    .text_normal .s5 .disabled{
      color: #eee
    }
    .text_normal .s5 .disabled:hover{
      color: #409EFF;
    }
    .text_normal .s5 #calcu{
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
    .text_normal .s5 #calcu:hover{
      color: #409EFF;
      border:1px solid #409EFF;
    }
    .text_normal .s5 #calcu a.abled:hover{
      color: #409EFF;
    }
    .text_normal .s5 #input{
      display: inline-block;
      width: 33px;
      height: 21px;
      line-height: 21px;
      text-align: center;
      border:none;
    }
    .text_normal .s5 #calcu a{
      text-align: center;
      width: 17px;
      height: 24px;
      display: inline-block;
    }
    .text_normal .s5 #calcu a:first-child{
      border-right: 1px solid #cacbcb;
    }
    .text_normal .s5 #calcu a:last-child{
      border-left: 1px solid #cacbcb;
    }
  /* 计算器样式结束 */
    .text_normal .s6{
      width: 10%;
      color: #666;
      font-family: verdana;
      overflow: hidden;
      /* border:1px solid blue; */
    }

    .text_normal .s6 span.redu0 {
      display: block;
      line-height: 40px;
    }
    .text_normal .s6 span.redu1 {
      display: block;
      line-height: 14px;
    }
    .text_normal .s6 .redu1 div{
      display: inline-block;
      /* border:1px solid green; */
      height: 20px;
      line-height: 20px;
      text-align: center;
    }
    .text_normal .s6 .redu1 div:first-child {
      width: 35px;
      padding-left: 20px;
    }
    .text_normal .s6 .redu1 div:last-child {
      width: 35px;
    }
    .text_normal .s7{
      width: 10%;
      float: right;
    }
    .text_normal .s7 .el-button{
      margin:auto 0;
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
}
@media only screen and (max-width:1000px) and (min-width: 319px) {
  .text_normal {
    /* border:1px solid blue */
  }
  .text_normal .s1, .text_normal .s2, .text_normal .s3, .text_normal .s4, .text_normal .s5, .text_normal .s6{
    display: inline-block;
    /* border:1px solid red; */
    height:30px;
    line-height: 30px;
    overflow: hidden;
  }
  .text_normal .s1{
    margin-left:5px;
  }
  .text_normal .s2 {
    width: 38%;
    /* border:1px solid red; */
  }
  .text_normal .s2 .el-button {
    padding:6px;
    font-size: 11px;
  }
  .text_normal .s4 {
    width:20%;
    text-align: center;
  }
  /* 计算器样式开始 */
    .text_normal .s5{
      width: 78px;
      /* border:1px solid red; */
    }
    .text_normal .s5 .disabled{
      color: #eee
    }
    .text_normal .s5 .disabled:hover{
      color: #409EFF;
    }
    .text_normal .s5 #calcu{
      background-color: #fff;
      border: 1px solid #cacbcb;
      border-radius: 4px;
      color:#666;
      min-width: 40px;
      height: 24px;
      line-height: 27px;
      display: block;
      margin:2px auto;
    }
    .text_normal .s5 #calcu:hover{
      color: #409EFF;
      border:1px solid #409EFF;
    }
    .text_normal .s5 #calcu a.abled:hover{
      color: #409EFF;
    }
    .text_normal .s5 #input{
      display: inline-block;
      width: 33px;
      height: 21px;
      line-height: 21px;
      text-align: center;
      border:none;
    }
    .text_normal .s5 #calcu a{
      text-align: center;
      width: 17px;
      height: 24px;
      display: inline-block;
    }
    .text_normal .s5 #calcu a:first-child{
      border-right: 1px solid #cacbcb;
    }
    .text_normal .s5 #calcu a:last-child{
      border-left: 1px solid #cacbcb;
    }
  /* 计算器样式结束 */
  .s6 {
    width:10%;
  }
  .s7 {
    display: none;
  }
}

</style>
