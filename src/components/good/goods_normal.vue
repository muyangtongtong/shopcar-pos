<template>
  <div :class="classObject">
    <!-- 有选择框 -->
    <div class="s1">
      <el-checkbox v-show="text.ischoice != 2" :class="'line-circle'+item.isgroup" @change="checkchange(item.operparam, item.proid, item.ischoice)" v-model="checkchoice"></el-checkbox>
    </div>
    <!--2 商品图片属性及名称 -->
    <div class="s2">
      <a class="s2_img" href=""><img id="img" :src="item.productvarimage" alt=""></a>
      <a class="s2_name" href="" v-text="item['productvarname']"></a>
      <div class="s2_field">
        <span v-if="item['fieldname2']" >{{item.fieldname2 + ':' + item.fielditemname2}}</span>
        <span v-if="item['fieldname1']">{{item.fieldname1 + ':' + item.fielditemname1}}</span>
      </div>
    </div>
    <!--3 商品价格 促销框 -->
    <div class="s4">
      <p>{{'￥'+item.retailprice}}</p>
      <div v-if="item.operstatus == 0 && item.isselpromo==1" class="cuxiao fl" v-clickoutside="handleClose">
        <p class="sales-promotion" @click="showtoggle(item.selpromo)" v-show="isshow1" >促销<b></b></p>
        <div :class="{'promotion-tips class-a':isshow,'promotion-tips class-b':!isshow}" >
          <div class="promotion-tit" style="width: 32px;" @click.stop="showtoggle">促销<b></b></div>
          <div class="promotion-cont">
            <!-- 促销框内容 -->
              <el-radio-group v-for="(value, index) in item.selpromo" :key="index" v-model="checkpro">
                <el-radio @change="getRadioVal(value)" :label="value.id">{{value.gname ? value.gname : value.pname}}</el-radio>
              </el-radio-group>
              <div class="op-btns ac mt20">
                <a class="btn-1 select-promotion" @click.stop="showtogglesure(item.operparam)">确定</a>
                <a class="btn-9 ml10 del cancel-promotion" @click="isshow=false,isshow1=true">取消</a>
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
      <div class="s5_edit" v-if="item['iseditqty'] == '0'">
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
      <div class="s5_div" v-if="item.stockqty<1">无货</div>
      <div class="s5_div" v-else-if="item.stockqty>10">有货</div>
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
      <el-button type="text" @click="open2(item.operparam, item.productvarname)">删除</el-button>
    </div>
    <div class="clear"></div>
  </div>
</template>

<script>
// 点击任何地方促销框都能收起
const clickoutside = {
  bind (el, binding, vnode) {
    function documentHandler (e) {
      if (el.contains(e.target)) {
        return false
      }
      if (binding.expression) {
        binding.value(e)
      }
    }
    el.vueClickOutside = documentHandler
    document.addEventListener('click', documentHandler)
  },
  updated () {},
  unbind (el, binding) {
    document.removeEventListener('click', el.vueClickOutside)
    delete el.vueClickOutside
  }
}
export default {
  props: ['item', 'ind', 'id', 'data1', 'ind1'],
  data () {
    return {
      clickwidth: 0,
      text: {},
      checked: true,
      num1: 3,
      isshow: false,
      isshow1: true,
      elements: [],
      checkpro: ''
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
      let clazz = 'row itemDisable'
      if (this.item.operstatus === 0) {
        if (this.item.ischoice === 1) {
          clazz = 'row itemChoice'
          // console.log(clazz)
        } else if (this.data1.ischoice === 1) {
          // console.log('111')
          clazz = 'row itemChoice'
        } else {
          clazz = 'row itemNormal'
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
    },
    clickwidth () {
      // console.log('clickwidth=>', '这是' + this.clickwidth)
    }
  },
  mounted () {
    this.clickwidth = document.documentElement.clientWidth || document.body.clientWidth
  },
  directives: {clickoutside},
  methods: {
    // 点击计数器出发该方法
    handleChange (operparam, opertype, num, updataqty) {
      this.$emit('inputNumberChange', operparam, opertype, num, updataqty)
    },
    // 商品的选中和取消选中
    checkchange (operparam, id, choice) {
      console.log('choice=>', choice)
      this.$emit('dealShowCartChoice', operparam, id, choice)
    },
    // 删除
    open2 (operparam, productvarname) {
      this.$confirm('确认删除删除' + productvarname + '吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.$emit('delet_nom', operparam, productvarname)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 商品促销框中方法
    showtoggle (selpromo) {
      for (var i = 0; i < selpromo.length; i++) {
        if (selpromo[i].ischoice === 1) {
          this.checkpro = selpromo[i].id
          // console.log('checkpro=>', selpromo[i].id)
        }
      }
      this.isshow = !this.isshow
      this.isshow1 = !this.isshow1
    },
    handleClose () {
      this.isshow = false
      this.isshow1 = true
    },
    // 选中促销框中的促销列表项时，触发得方法
    getRadioVal (val) {
      // this.inputval = val.target.value
      // this.inputval = val
      this.$emit('getRadioVal', val)
      console.log('val.id=>', val.id)
    },
    // 商品促销框中点击确定触发得方法
    showtogglesure (operparam) {
      this.isshow = !this.isshow
      this.isshow1 = !this.isshow1
      this.$emit('showtogglesure', operparam)
    }
  }
}

</script>

<style>
.row{
  display: block;
  font: 8px tahoma,arial,Microsoft YaHei,Hiragino Sans GB,"\u5b8b\u4f53",sans-serif;
  width: 100%;
  height:121px;
  line-height: 121px;
}
.row .s1,.row .s2,.row .s3,.row .s4,.row .s5,.row .s6,.row .s7{
  display: inline-block;
  line-height: 100%;
  height: 121px;
  vertical-align: top;
  text-align: center;
  /* border:1px solid green */
}
.row .s1{
  width: 5%;
  overflow: hidden;
}
/* 选择框 */
.row .s1 .el-checkbox{
  /* border:1px solid red; */
  height: 100%;
  padding-top:60%
}
/* 选择框上面虚线的样式 */
.row .s1 .line-circle1 {
  height: 12%;
  background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -7px -2px repeat-y;
  z-index: 2;
  overflow: hidden;
}
/* 选择框上下面虚线的样式 */
 .row .s1 .line-circle2 {
  background: url(//misc.360buyimg.com/user/cart/css/i/cart-line-02.png) -7px -2px repeat-y;
  z-index: 2;
  overflow: hidden;
}
.row .s2{
  width: 44.5%;
  text-align: left;
  /* border:1px solid #666; */
}
.row .s2 .s2_img{
  display: inline-block;
  margin-top:20px;
  border:1px solid #409EFF;
  display: inline-block;
  width: 80px;
  height: 80px;
}
.row .s2 .s2_img img{
  display: block;
  width: 80px;
  height: 80px;
}
.row .s2 .s2_name {
  display: inline-block;
  /* border:1px solid #409EFF; */
  line-height: 1.2rem;
  vertical-align: top;
  margin-top:20px;
  width: 4.5rem;
}
.row .s2 .s2_field {
  width: 4rem;
  display: inline-block;
  /* border:1px solid #409EFF; */
  margin-left: 5px;
  vertical-align: top;
  margin-top: 40px;
}
.row .s2 .s2_field span{
 line-height: 1rem;
 display: block;
}
.row .s3{
  width: 8%;
}
/* 促销框样式开始 */
.row .s4 {
  width: 8%;
  text-align: left
}
/* 单价样式 */
.row .s4 p{
  display: block;
  height: 32px;
  margin-top: 30px;
  /* border: 1px solid red; */
  text-align: center;
  line-height:32px;
  padding:10px 0;
  position: relative;
}
.row .s4 .cuxiao {
  margin-left: 3px;
  display: block;
  height: 22px;
  line-height: 22px;
}

.row .s4 .sales-promotion{
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
}
.row .s4 .class-c{
  display: none;
}
.row .s4 .sales-promotion b {
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
.row .s4 .promotion-tit b {
    display: block;
    z-index: 100;
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
.row .s4 .class-b{
  display: none;
}
.row .s4 .class-a {
  margin: -1px 0 0;
  z-index: 100;
  display: block;
  padding: 10px 14px 10px 10px;
  width: 250px;
  z-index: 30;
  box-shadow: 0 0 2px 2px #eee;
  border: 1px solid #e4393c;
  background: none repeat scroll 0 0 #fff;
  position: relative;
  top:20px;
  left: 1px;
  text-align: left;
}
.row .s4 .class-a .promotion-tit {
  z-index: 100;
  position: absolute;
  height: 19px;
  line-height: 20px;
  width: 53px;
  border: 1px solid #e4393c;
  border-bottom: 0;
  top: -20px;
  left: -1px;
  background: #fff;
  color: #E2231A;
  padding: 0 7px 0 5px;
  cursor: pointer;
}
.row .s4 .promotion-cont {
    position: relative;
    line-height: 23px;
    width: 280px;
    z-index: 100;
}
.row .s4 .promotion-cont ul {
    list-style: none;
}
.row .s4 .promotion-cont ul li{
    display: list-item;
    text-align: -webkit-match-parent;
}
.row .s4 .opers {
  color: red;
  /* font-weight: bold; */
}
.row .s4 .op-btns .select-promotion:hover{
  color: #eee;
  box-shadow:2px 2px 3px #aaa
}
.row .s4 .op-btns .cancel-promotion:hover{
  color: #000;
  box-shadow:2px 2px 3px #aaa
}
/* 促销框样式结束 */
/* 计算器样式开始 */
  .row .s5{
    width: 17%;
  }
  .row .s5 .disabled{
    color: #eee
  }
  .row .s5 .s5_div {
    display: block;
    /* border: 1px solid red; */
    height: 15px;
    line-height: 15px;
  }
  .row .s5 #calcu {
    background-color: #fff;
    border: 1px solid #cacbcb;
    border-radius: 4px;
    color:#666;
    width: 80px;
    height: 25px;
    line-height: 27px;
    display: block;
    margin:33px auto;
  }
  .row .s5 .s5_edit {
    height: 20px;
    line-height: 20px;
    margin: 33px auto
  }
  .row .s5 #calcu:hover{
    color: #409EFF;
    border:1px solid #409EFF;
  }
  .row .s5 #calcu a.abled:hover{
    color: #409EFF;
  }
  .row .s5  #calcu a.disabled:hover{
    color: #eee;
  }
  .row .s5 #input{
    display: inline-block;
    width: 33px;
    height: 21px;
    line-height: 21px;
    text-align: center;
    border:none;
  }
  .row .s5 #calcu a{
    text-align: center;
    width: 17px;
    height: 24px;
    display: inline-block;
  }
  .row .s5 #calcu a:first-child{
    border-right: 1px solid #cacbcb;
  }
  .row .s5 #calcu a:last-child{
    border-left: 1px solid #cacbcb;
  }
/* 计算器样式结束 */

.row .s6{
  width: 10%;
  color: #666;
  font-family: verdana;
}
.row .s6 strong {
  margin:10px auto;
  color: #333;
  font-weight: 700;
  display: block;
  height: 100px;
  display: block;
  /* border: 1px solid green; */
  line-height: 100px;
}
.row .s6 span {
  display: block;
  line-height: 10px;
  font-weight: normal;
}
.row .s7{
  width: 10%;
  float: right;
  display: inline-block
}
.row .s7 .el-button{
  line-height: 100%;
  height: 100%;
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
.el-radio.el-radio {
  margin-left:0px;
  font-size: 10px;
}
.el-radio__label {
  font-size: 10px!important
}
.el-radio__input.is-checked+.el-radio__label {
    color: #666;
}
.el-message-box__content {
  padding: 18px 15px;
}
.el-message-box__message{
  color: #000
}
.el-message-box__btns{
  text-align: center;
}
.el-button--small {
    padding: 9px 25px;
}
</style>
