<template>
   <div class="text_gift" ref="text_gift">
    <!--1 选择框 判断后台数据是否被选中-->
    <!-- 未被选中 -->
    <div style="border:none"></div>
    <div class="s1">
      <el-checkbox  v-show="text.ischoice != 2" :class="'line-circle'+text.isgroup" @change="checkchange(item.operparam, item.proid, item.ischoice)" v-model="checkchoice"></el-checkbox>
    </div>
    <!--2 图标 文字 按钮-->
    <!-- 判断当icontype=='0'无图标  icontype== 1 正常生效 icontype== 2 未生效 icontype== 3 过期 -->
    <div class="s2">
      <a :class="'t'+item.icontype" target="_blank" v-if="item.icontype !=0">
        <a class="full-icon full-gray-icon">{{item.iconlabel}}<b></b></a>
        {{item.text1}}
      </a>
      <a v-else-if="item.icontype == 0">{{item.text1}}</a>
      <!-- 点击弹出弹框 -->
      <span class="s2_button" v-if="item.clicktype == 5">
        <!-- type=1 任选组合 -->
        <el-button v-if="JSON.parse(item.clickparam).type==1" @click="cartPromoPop(item.clickparam)">任选组合</el-button>
        <!-- type=2 赠品组合 -->
        <el-button type="button" v-else-if="JSON.parse(item.clickparam).type==2" @click="cartPromoPopz(item.clickparam)">赠品组合</el-button>
        <!-- type=3 加价购 -->
        <el-button type="buttont" v-else-if="JSON.parse(item.clickparam).type==3" @click="cartPromoPopj(item.clickparam)">加价购</el-button>
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
    <div v-if="item.showtype == '4'" class="s4">
      <p>{{'￥'+item.retailprice + '.00'}}</p>
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
        <!-- 判断计数器里的值如果小于1时 减数的按钮不可用 大于1时可用 -->
        <a v-if="item.updateqty == item.minqty" href="" class="disabled" onclick="return false;">-</a>
        <a v-else-if="item.updateqty != '1'" class="abled" @click="handleChange(item.operparam, 1, -1, item.updateqty)">-</a>
        <input type="text" id="input" @change="handleChange(item.operparam, 0, item.updateqty, item.updateqty)" v-model="item.updateqty">
        <!-- <a v-if="item.updateqty >= 200" href="#" @click.prevent="handle">+</a> -->
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
    <!-- <div class="s7" v-if="item.isdel == '0'"></div> -->
    <div class="s7" v-if="item.isdel != 0">
      <el-button type="text" @click="open2(item.operparam, item.ischoice, item.proid, item.protype)">删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['item', 'ind'],
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
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible1: false,
      tableData: [],
      checkList: [],
      poplist: 0,
      poplistz: 0,
      poplistj: 0
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
      let clazz = 'text_gift itemDisable'
      if (this.item.operstatus === 0) {
        if (this.item.ischoice === 1) {
          clazz = 'text_gift itemChoice'
        } else {
          clazz = 'text_gift itemNormal'
        }
      }
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
  methods: {
    // 点击计数器出发该方法
    handleChange (operparam, opertype, num, updataqty) {
      this.$emit('inputNumberChange', operparam, opertype, num, updataqty)
    },
    // 任选组合
    // 得到任选组合数据
    cartPromoPop (clickparam) {
      this.$emit('cartPromoPop', clickparam)
    },
    // 处理任选组合数据
    // 处理任选组合数据 this.tableData.maxqty
    handleClose () {
      this.$emit('handleClose')
    },
    // 赠品组合
    // 得到赠品组合数据
    cartPromoPopz (clickparam) {
      this.$emit('cartPromoPopz', clickparam)
    },
    // 处理赠品组合弹出数据
    handleClosez () {
      this.$emit('handleClosez')
    },
    // 加价购
    // 得到加价购数据
    cartPromoPopj (clickparam) {
      this.$emit('cartPromoPopj', clickparam)
    },
    // 处理加价购数据
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
    }
  }
}
</script>

<style scoped>
@media only screen and (min-width: 1000px){
  .text_gift{
    width: 100%;
    position: relative;
    height: 40px;
    line-height: 40px;
  }
  .text_gift .s1{
    margin-left: 3.5%;
    width: 5%;
  }
  .text_gift .s1,.text_gift .s2,.text_gift .s3,.text_gift .s4,.text_gift .s5,.text_gift .s6,.text_gift .s7{
    display: inline-block;
    /* border:1px solid red; */
    vertical-align: middle;
    height:40px;
    line-height: 40px;
    text-align: center;
  }
  .text_gift .s1{
    width: 5%;
    overflow: hidden;
  }
  /* 选择框上面虚线的样式 */
  .text_gift .s1 .line-circle2 {
    height: 27px;
    line-height: 40px;
    /* border:1px solid red; */
    position: relative;
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* 选择框上下面虚线的样式 */
  .text_gift .s1 .line-circle3 {
    position: relative;
    /* border:1px solid red; */
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* s2样式 */
  .text_gift .s2{
    width: 42.5%;
    text-align: left;
  }
  .text_gift .s2_button .el-button{
    border:1px solid #dcdfea;
    color: #E2231A;
    padding:5px 8px;
    background-color: #eee;
    margin-left: 5px;
    font-size: 8px;
  }
  /* 已生效样式 */
  .text_gift .t2 .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_gift .t2 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_gift .t2 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #f48719;
      border: 1px solid #f48719;
      color: #fff;
      padding: 1px 10px;
      height: 16px;
      line-height: 16px;
  }
  .text_gift .t2 .full-icon b {
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
  .text_gift .t1  .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_gift .t1 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_gift .t1 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #f48719;
      color: #f48719;
      padding: 1px 10px;
      height: 16px;
      line-height: 16px;
  }
  .text_gift .t1 .full-icon b {
      display: block;
      position: absolute;
      margin:0;
      padding: 0;
      font-weight: bold;
  }
  /* 过期样式 */
  .text_gift .t3  .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_gift .t3 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_gift .t3 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #f48719;
      color: #f48719;
      padding: 1px 10px;
      height: 16px;
      line-height: 16px;
  }
  .text_gift .t3 .full-icon b {
      display: block;
      position: absolute;
      margin:0;
      padding: 0;
      font-weight: bold;
  }
  /* 弹出界面样式设置开始任选组合 */
  .text_gift .s2 .renxuan table {
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
    padding:10px 0;
  }
  .text_gift .s2 .renxuan .el-dialog__header {
      padding: 16px 16px 0px;
  }
  .text_gift .s2 .renxuan .el-dialog__body {
    padding: 15px 20px;
    color: #606266;
    font-size: 11px;
  }
  .text_gift .s2 .renxuan td {
    border-bottom:1px solid #eee;
    padding-right: 29px;
  }
  .text_gift .s2 .renxuan .el-input-number--mini{
    width: 100px;
  }
  .text_gift .s2 .renxuan .counter {
    display: inline-block;
    width: 100px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 30px;
    margin-top: 7px;
  }
  .text_gift .s2 .renxuan .counter:hover {
    border:1px solid#409EFF;
  }
  .text_gift .s2 .renxuan .counter a{
    width: 26px;
    font-size: 12px;
    height: auto;
    text-align: center;
    background: #f5f7fa;
    color: #606266;
    display: inline-block;
  }
  .text_gift .s2 .renxuan .counter a:hover{
    color: #409EFF;
  }
  .text_gift .s2 .renxuan .counter a:first-child {
    left: 1px;
    border-radius: 4px 0 0 4px;
    border-right: 1px solid #dcdfe6;
    margin-left: -1px;
  }
  .text_gift .s2 .renxuan .counter a:last-child {
    right: 1px;
    border-radius: 0 4px 4px 0;
    border-left: 1px solid #dcdfe6;
  }
  .text_gift .s2 .renxuan .counter input {
    width: 38px;
    height: 26px;
    border: none;
    text-align: center;
    margin: 0;
  }
  /* 任选组合弹出界面样式设置结束 */

  /* 赠品组合样式设置开始 */
  .text_gift .s2 .el-dialog__header {
      padding: 16px 16px 0px;
  }
  .text_gift .s2 .el-dialog__body {
    padding: 15px 20px;
    color: #606266;
    font-size: 11px;
  }
  .text_gift .s2 .zeng table {
    background-color: rgb(247, 240, 240)
  }
  .text_gift .s2 .zeng tr {
    border:1px solid #ddd;
    padding-right: 29px;
    text-align: center
  }
  .text_gift .s2 .el-input-number--mini{
    width: 100px;
  }
  .text_gift .s2 .counter {
    display: inline-block;
    width: 99px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    margin-top: 7px;
    padding:0px;
    background: #fff
  }
  .text_gift .s2 .counter:hover {
    border:1px solid#409EFF;
  }
  .text_gift .s2 .counter a{
    width: 26px;
    font-size: 12px;
    height: auto;
    text-align: center;
    background: #f5f7fa;
    color: #606266;
    display: inline-block;
  }
  .text_gift .s2 .counter a:hover{
    color: #409EFF;
  }
  .text_gift .s2 .counter a:first-child {
    left: 1px;
    border-radius: 4px 0 0 4px;
    border-right: 1px solid #dcdfe6;
    margin-left: 0px;
  }
  .text_gift .s2 .counter a:last-child {
    right: 1px;
    border-radius: 0 4px 4px 0;
    border-left: 1px solid #dcdfe6;
  }
  .text_gift .s2 .counter input {
    width: 38px;
    height: 26px;
    border: none;
    text-align: center;
    margin: 0;
  }
  /* 赠品组合弹出框样式设置结束 */
  /* 促销框样式开始 */

  /* 促销框样式开始 */
  .text_gift .s3{
    text-align:left;
    width: 8.5%;
  }
  .text_gift .s3 .cuxiao {
    display: block;
    height: 22px;
    line-height: 22px;
  }
  .text_gift .s3 .sales-promotion{
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
  .text_gift .s3 .class-c{
    display: none;
  }
  .text_gift .s3 .sales-promotion b {
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
  .text_gift .s3 .promotion-tit b {
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
  .text_gift .s3 .class-b{
    display: none;
  }
  .text_gift .s3 .class-a {
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
  .text_gift .s3 .class-a .promotion-tit {
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
  .text_gift .s3 .promotion-cont {
      position: relative;
      line-height: 23px;
      width: 280px;
  }
  .text_gift .s3 .promotion-cont ul {
      list-style: none;
  }
  .text_gift .s3 .promotion-cont ul li{
      display: list-item;
      text-align: -webkit-match-parent;
  }
  /* 促销框样式结束 */

  /* 单价样式 */
  .text_gift .s4{
    width: 8%;
  }
  .text_gift .s4 p{
    display: block;
    height: 40px;
    line-height:40px;
  }
  /* 修改计数器样式开始 */
  .text_gift .s5{
      width: 15%;
    }
  .text_gift .s5 #calcu{
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
  .text_gift .s5 #calcu:hover{
      color: #409EFF;
      border:1px solid #409EFF;
    }
  .text_gift .s5 #calcu a:hover{
      color: #409EFF;
    }

  .text_gift .s5 #input{
      display: inline-block;
      width: 33px;
      height: 23px;
      line-height: 23px;
      text-align: center;
      border:none;
    }
  .text_gift .s5 #calcu a{
      text-align: center;
      width: 17px;
      height: 24px;
      display: inline-block;
    }
  .text_gift .s5 #calcu a:first-child{
      border-right: 1px solid #cacbcb;
    }
  .text_gift .s5 #calcu a:last-child{
      border-left: 1px solid #cacbcb;
    }
  /* 修改计数器样式结束 */

  .text_gift .s6{
    width: 10%;
    color: #666;
    font-family: verdana;
  }

  .text_gift .s6 strong {
    margin:10px auto;
    color: #333;
    font-weight: 700;
    display: block;
    line-height: 40px;;
  }
  .text_gift .s6 span {
    display: block;
    line-height: 20px;
    font-weight: normal;
  }
  .text_gift .s7{
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
}
@media only screen and (max-width:1000px) and (min-width: 320px) {
  .text_gift{
    width: 100%;
    position: relative;
    height: 27px;
    line-height: 27px;
  }
  .text_gift .s1{
    margin-left: 3.5%;
    width: 5%;
  }
  .text_gift .s1,.text_gift .s2,.text_gift .s3,.text_gift .s4,.text_gift .s5,.text_gift .s6,.text_gift .s7{
    display: inline-block;
    border:1px solid red;
    vertical-align: middle;
    height:25px;
    /* line-height: 25px; */
    text-align: center;
  }
  .text_gift .s1{
    width: 2%;
    overflow: hidden;
  }
  /* 选择框上面虚线的样式 */
  .text_gift .s1 .line-circle2 {
    height: 27px;
    line-height: 40px;
    /* border:1px solid red; */
    position: relative;
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* 选择框上下面虚线的样式 */
  .text_gift .s1 .line-circle3 {
    position: relative;
    /* border:1px solid red; */
    background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -6px -2px repeat-y;
    z-index: 2;
    overflow: hidden;
  }
  /* s2样式 */
  .text_gift .s2{
    width: 28.5%;
    text-align: left;
    /* border: 1px solid red; */
  }
  .text_gift .s2 .el-button{
    border:1px solid #dcdfea;
    color: #E2231A;
    padding:5px 8px;
    background-color: #eee;
    margin-left: 5px;
    font-size: 8px;
  }
  /* 已生效样式 */
  .text_gift .t2 .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_gift .t2 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_gift .t2 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #f48719;
      border: 1px solid #f48719;
      color: #fff;
      padding: 1px 10px;
      height: 16px;
      line-height: 16px;
  }
  .text_gift .t2 .full-icon b {
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
  .text_gift .t1  .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_gift .t1 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_gift .t1 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #f48719;
      color: #f48719;
      padding: 1px 10px;
      height: 16px;
      line-height: 16px;
  }
  .text_gift .t1 .full-icon b {
      display: block;
      position: absolute;
      margin:0;
      padding: 0;
      font-weight: bold;
  }
  /* 过期样式 */
  .text_gift .t3  .full-gray-icon {
      background: #fff;
      color: #f48719;
      border: 1px solid #f48719;
  }
  .text_gift .t3 .full-gray-icon b {
      width: 5px;
      height: 6px;
      left: -1px;
      border: 0;
      bottom: -5px;
      background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) 0 -7px no-repeat;
      overflow: hidden;
  }
  .text_gift .t3 .full-icon {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #f48719;
      color: #f48719;
      padding: 1px 10px;
      height: 16px;
      line-height: 16px;
  }
  .text_gift .t3 .full-icon b {
      display: block;
      position: absolute;
      margin:0;
      padding: 0;
      font-weight: bold;
  }
  /* 弹出界面样式设置开始任选组合 */
  .text_gift .s2 .renxuan table {
    border-top: 2px solid #ddd;
    border-bottom: 2px solid #ddd;
    padding:10px 0;
  }
  .text_gift .s2 .renxuan .el-dialog__header {
      padding: 16px 16px 0px;
  }
  .text_gift .s2 .renxuan .el-dialog__body {
    padding: 15px 20px;
    color: #606266;
    font-size: 11px;
  }
  .text_gift .s2 .renxuan td {
    border-bottom:1px solid #eee;
    padding-right: 29px;
  }
  .text_gift .s2 .renxuan .el-input-number--mini{
    width: 100px;
  }
  .text_gift .s2 .renxuan .counter {
    display: inline-block;
    width: 100px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    margin-left: 30px;
    margin-top: 7px;
  }
  .text_gift .s2 .renxuan .counter:hover {
    border:1px solid#409EFF;
  }
  .text_gift .s2 .renxuan .counter a{
    width: 26px;
    font-size: 12px;
    height: auto;
    text-align: center;
    background: #f5f7fa;
    color: #606266;
    display: inline-block;
  }
  .text_gift .s2 .renxuan .counter a:hover{
    color: #409EFF;
  }
  .text_gift .s2 .renxuan .counter a:first-child {
    left: 1px;
    border-radius: 4px 0 0 4px;
    border-right: 1px solid #dcdfe6;
    margin-left: -1px;
  }
  .text_gift .s2 .renxuan .counter a:last-child {
    right: 1px;
    border-radius: 0 4px 4px 0;
    border-left: 1px solid #dcdfe6;
  }
  .text_gift .s2 .renxuan .counter input {
    width: 38px;
    height: 26px;
    border: none;
    text-align: center;
    margin: 0;
  }
  /* 任选组合弹出界面样式设置结束 */

  /* 赠品组合样式设置开始 */
  .text_gift .s2 .el-dialog__header {
      padding: 16px 16px 0px;
  }
  .text_gift .s2 .el-dialog__body {
    padding: 15px 20px;
    color: #606266;
    font-size: 11px;
  }
  .text_gift .s2 .zeng table {
    background-color: rgb(247, 240, 240)
  }
  .text_gift .s2 .zeng tr {
    border:1px solid #ddd;
    padding-right: 29px;
    text-align: center
  }
  .text_gift .s2 .el-input-number--mini{
    width: 100px;
  }
  .text_gift .s2 .counter {
    display: inline-block;
    width: 99px;
    height: 26px;
    line-height: 26px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
    margin-top: 7px;
    padding:0px;
    background: #fff
  }
  .text_gift .s2 .counter:hover {
    border:1px solid#409EFF;
  }
  .text_gift .s2 .counter a{
    width: 26px;
    font-size: 12px;
    height: auto;
    text-align: center;
    background: #f5f7fa;
    color: #606266;
    display: inline-block;
  }
  .text_gift .s2 .counter a:hover{
    color: #409EFF;
  }
  .text_gift .s2 .counter a:first-child {
    left: 1px;
    border-radius: 4px 0 0 4px;
    border-right: 1px solid #dcdfe6;
    margin-left: 0px;
  }
  .text_gift .s2 .counter a:last-child {
    right: 1px;
    border-radius: 0 4px 4px 0;
    border-left: 1px solid #dcdfe6;
  }
  .text_gift .s2 .counter input {
    width: 38px;
    height: 26px;
    border: none;
    text-align: center;
    margin: 0;
  }
  /* 赠品组合弹出框样式设置结束 */
  /* 促销框样式开始 */

  /* 促销框样式开始 */
  .text_gift .s3{
    text-align:left;
    width: 8.5%;
  }
  .text_gift .s3 .cuxiao {
    display: block;
    height: 22px;
    line-height: 22px;
  }
  .text_gift .s3 .sales-promotion{
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
  .text_gift .s3 .class-c{
    display: none;
  }
  .text_gift .s3 .sales-promotion b {
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
  .text_gift .s3 .promotion-tit b {
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
  .text_gift .s3 .class-b{
    display: none;
  }
  .text_gift .s3 .class-a {
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
  .text_gift .s3 .class-a .promotion-tit {
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
  .text_gift .s3 .promotion-cont {
      position: relative;
      line-height: 23px;
      width: 280px;
  }
  .text_gift .s3 .promotion-cont ul {
      list-style: none;
  }
  .text_gift .s3 .promotion-cont ul li{
      display: list-item;
      text-align: -webkit-match-parent;
  }
  /* 促销框样式结束 */

  /* 单价样式 */
  .text_gift .s4{
    width: 8%;
  }
  .text_gift .s4 p{
    display: block;
    height: 40px;
    line-height:40px;
  }
  /* 修改计数器样式开始 */
  .text_gift .s5{
      width: 10%;
    }
  .text_gift .s5 #calcu{
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
  .text_gift .s5 #calcu:hover{
      color: #409EFF;
      border:1px solid #409EFF;
    }
  .text_gift .s5 #calcu a:hover{
      color: #409EFF;
    }

  .text_gift .s5 #input{
      display: inline-block;
      width: 33px;
      height: 23px;
      line-height: 23px;
      text-align: center;
      border:none;
    }
  .text_gift .s5 #calcu a{
      text-align: center;
      width: 17px;
      height: 24px;
      display: inline-block;
    }
  .text_gift .s5 #calcu a:first-child{
      border-right: 1px solid #cacbcb;
    }
  .text_gift .s5 #calcu a:last-child{
      border-left: 1px solid #cacbcb;
    }
  /* 修改计数器样式结束 */

  .text_gift .s6{
    width: 10%;
    color: #666;
    font-family: verdana;
  }

  .text_gift .s6 strong {
    margin:10px auto;
    color: #333;
    font-weight: 700;
    display: block;
    line-height: 40px;;
  }
  .text_gift .s6 span {
    display: block;
    line-height: 20px;
    font-weight: normal;
  }
  .text_gift .s7{
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
}
</style>
