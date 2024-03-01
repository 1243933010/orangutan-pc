<template>
  <div class="home-container">
    <div class="main">
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in statusList" :key="index" :label="item.name" :name="item.id.toString()" />
        </el-tabs>
      </div>

      <div class="context">
        <div class="form">
          <div class="form-item">
            <el-select v-model="formData.keyword_type" placeholder="订单号" style="width: 120px">
              <el-option label="订单号" value="order_no" />
              <el-option label="对方账号" value="account" />
            </el-select>
          </div>
          <div class="form-item">
            <el-input v-model="formData.keyword" placeholder="请输入搜索...." />
          </div>
          <div class="form-item">
            <el-select v-model="formData.channel" placeholder="收款类型" style="width: 120px">
              <el-option v-for="(item, index) in channelList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </div>
          <div class="form-item">
            <el-select v-model="value" placeholder="创建时间" style="width: 120px">
              <el-option label="创建时间" :value="1" />
            </el-select>
          </div>
          <div class="form-item">
            <el-date-picker v-model="formData.time" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>

          </div>
          <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
          <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" center>
            <el-table-column prop="order_no" label="订单号"> </el-table-column>
            <el-table-column prop="channel" label="收款渠道"> </el-table-column>
            <el-table-column prop="order_status_name" label="状态"> </el-table-column>
            <el-table-column prop="account_name" label="收款账号"> </el-table-column>
            <el-table-column prop="account" label="收款地址"> </el-table-column>
            <el-table-column prop="rate" label="费率"> </el-table-column>
            <el-table-column prop="order_status" label="订单状态">
              <template slot-scope="scope">
                <span v-for="(item, index) in statusList" :key="index" v-if="scope.row.order_status == item.id">
                  {{ item.name }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="order_money" label="订单金额"> </el-table-column>
            <el-table-column prop="real_money" label="收款收益"> </el-table-column>
            <el-table-column prop="order_forzen" label="订单是否冻结">
              <template slot-scope="scope">
                <span v-if="scope.row.order_forzen == 0">未冻结</span>
                <span v-if="scope.row.order_forzen == 1">冻结</span>
              </template>
            </el-table-column>
            <el-table-column prop="date" fixed="right" label="操作" width="400">
              <template slot-scope="scope">
                <div class="between">
                 
                  <div class="button" @click="handleDialog('detail', scope.row)">查看</div>

                  <div class="button" @click="handleDialog('chats', scope.row)"
                    v-if="[0, 2, 4, 5, 6, 7, 11, 12, 13, 14, 15].includes(scope.row.order_status) && (userInfo.identity == 1 || userInfo.identity == 2)">
                    聊天</div>
                  <div class="button" v-if="scope.row.order_status == 0 && userInfo.identity == 2"
                    @click="handleDialog('cooperate', scope.row)">确认合作</div>
                  <div class="button"
                    v-if="scope.row.order_status == 0 && (userInfo.identity == 1 || userInfo.identity == 2)"
                    @click="handleDialog('cooperate', scope.row)">取消合作</div>
                     <!-- identity 1 贸易商 2 卡商 -->
                  <!--  v-if="scope.row.order_status ==1&&userInfo.identity==1" -->
                  <!-- 0 待合作 1 取消合作 2 已合作 3超时未付款取消 4付款争议 5已付款 6已收款 7收款争议 8收款成功(资金冻结) 9收款成功(资金到账) 
                  11已申请退款 12不同意退款 13退款争议 14同意退款 15已退款 16退款成功 20已冻结
                  -->
                  <div class="button" v-if="scope.row.order_status == 1 && userInfo.identity == 1"
                    @click="handleDialog('initiate', scope.row)">重新发起收款</div> <!-- 未接通 -->
                  <div class="button" v-if="scope.row.order_status == 2 && userInfo.identity == 1"
                    @click="handleDialog('pay', scope.row)">付款</div> 
                  <div class="button" v-if="scope.row.order_status == 3 && userInfo.identity == 1"
                    @click="handleDialog('pay', scope.row)">付款争议</div>
                  <div class="button" v-if="scope.row.order_status == 5 && userInfo.identity == 2"
                    @click="handleDialog('collection', scope.row)">收款</div>
                  <div class="button" v-if="[5, 8,9].includes(scope.row.order_status) && userInfo.identity == 2"
                    @click="handleDialog('collection', scope.row)">收款争议</div>
                  <div class="button" v-if="scope.row.order_status == 8 && userInfo.identity == 1"
                    @click="handleDialog('refund', scope.row)">申请退款</div>
                  <div class="button" v-if="scope.row.order_status == 11 && userInfo.identity == 2"
                    @click="handleDialog('refundExamine', scope.row)">退款审核</div>
                  <div class="button" v-if="[12, 15].includes(scope.row.order_status) && userInfo.identity == 1"
                    @click="handleDialog('refundExamine', scope.row)">退款争议</div>
                  <div class="button" v-if="scope.row.order_status == 12 && userInfo.identity == 1"
                    @click="handleDialog('refundExamine', scope.row)">取消退款</div>
                  <div class="button" v-if="scope.row.order_status == 14 && userInfo.identity == 2"
                    @click="handleDialog('refundExamine', scope.row)">退款</div>
                  <div class="button" v-if="scope.row.order_status == 15 && userInfo.identity == 1"
                    @click="handleDialog('refundExamine', scope.row)">确认退款</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination :current-page="formData.page" :page-sizes="[10, 20, 30, 40]" :page-size="formData.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="formData.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <!-- Detail -->
    <Detail ref="detail"  refName="detail" :statusList="statusList" @closeDialog="closeDialog('detail', true)"  @dialogClose="dialogClose('detail')" />

    <!-- 聊天 -->
    <Chats ref="chats" />

    <!-- 确认合作 -->
    <Cooperate ref="cooperate"  refName="cooperate" :statusList="statusList" @closeDialog="closeDialog('cooperate', true)"  @dialogClose="dialogClose('cooperate')" />

    <!-- 重新发起收款弹窗 -->
    <Dialog1 ref="initiate" refName="initiate" title="发起收款" :collectionObj="collectionObj" @closeDialog="closeDialog('initiate', true)"  @dialogClose="dialogClose('initiate')" />

    <!-- 商家详情 -->
    <!-- <DirectiveDialog  ref="detail" title="发起收款">
      <Dialog2 @closeDialog="closeDialog('detail')" />
    </DirectiveDialog> -->

    <!-- 付款弹窗 -->
    <!-- <DirectiveDialog  ref="pay" title="订单号xxxxx"> -->
    <Pay ref="pay" @closeDialog="closeDialog('pay',true)" refName="pay"  @dialogClose="dialogClose('pay')" />
    <!-- </DirectiveDialog> -->

        <!-- 收款弹窗 -->
    <Collection ref="collection" @closeDialog="closeDialog('collection',true)" refName="collection" @dialogClose="dialogClose('collection')" />

    
      <!-- 退款弹窗 -->
     <Refund ref="refund" @closeDialog="closeDialog('refund',true)" refName="refund"  @dialogClose="dialogClose('refund')" />

     <!-- 退款审核弹窗 -->
     <RefundExamine ref="refundExamine" @closeDialog="closeDialog('refundExamine',true)" refName="refundExamine"  @dialogClose="dialogClose('refundExamine')" />
     

    <!-- 冻结弹窗 -->
    <DirectiveDialog ref="freeze" title="账号冻结提示">
      <Freeze @closeDialog="closeDialog('Freeze')" />
    </DirectiveDialog>

    <!-- 首次收款提示 -->
    <DirectiveDialog ref="firstCom" title="首次收款提示">
      <FirstCom @closeDialog="closeDialog('firstCom')" />
    </DirectiveDialog>

  </div>
</template>

<script>
//identity 1 贸易商 2 卡商
import Navbar from "@/layout/components/Navbar";
// import formMixins from "@/mixins/formMixins";
import DirectiveDialog from "@/components/DirectiveDialog/index";
import { order_options, order_list, order_submit, order_cancel } from '@/api/project'
import Dialog1 from './components/Dialog1'
import Cooperate from './components/Cooperate'
import Collection from './components/Collection'
import Refund from './components/Refund'
import RefundExamine from './components/RefundExamine'
import Detail from './components/Detail'


// import Dialog2 from './components/Dialog2'
import Pay from './components/Pay'
import Freeze from './components/Freeze'
import FirstCom from './components/FirstCom'
import clooectionMixins from './clooectionMixins'
import Chats from './components/CustomerService/index'
import { getToken } from '@/utils/auth'
import $bus from '@/utils/mitt';
// import WebSocketService from '@/utils/websocketService';
export default {
  name: "Home",
  components: {
    Navbar,
    DirectiveDialog,
    Dialog1,
    // Dialog2,
    Pay,
    Freeze,
    FirstCom,
    Chats,
    Cooperate,
    Collection,
    Refund,
    RefundExamine,
    Detail
  },
  mixins: [clooectionMixins],
  data() {
    return {
      activeName: '-1',
      value: 1,
      formData: {
        limit: 10,
        page: 1,
        total: 0,
        keyword_type: 'order_no',
        keyword: "",
        channel: '',
        time: "",
        status: -1
      },
      resertForm: {},
      tableData: [],
      statusList: [],
      channelList: []
    };
  },
  mounted() {
    this.getOptions();
    this.getList()
    $bus.on('dialogClose', (refName) => {
      console.log(this.$refs[refName],refName)
      this.$refs[refName]?.clearIntervalFnc()
      this.getList(true)
    });
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },

  methods: {
    // handleBtn(row) {
    //   this.$confirm('是否确认合作', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消'
    //   }).then(async () => {
    //     const res = await order_submit({ order_id: row.order_id })
    //     if (res.code == 200) {
    //       this.$message.success(res.msg)
    //       this.getList(true)
    //       return
    //     }
    //     this.$message.error(res.msg)
    //     this.getList(true)
    //   })
    // },
    dialogClose(refName){
      console.log('11111111111')
      this.$refs[refName].clearIntervalFnc()
      
    },
    resertFormFnc() {
      this.formData = {
        limit: 10,
        page: 1,
        total: 0,
        keyword_type: 'order_no',
        keyword: "",
        channel: '',
        time: "",
        status: -1
      }
      this.getList();
    },
    handleSizeChange(val) {
      this.formData.limit = val;
      this.getList(true);
    },
    handleCurrentChange(val) {
      this.formData.page = val;
      this.getList();
    },
    async getList(bool = false) {
      if (bool) {
        this.formData.page = 1;
      }
      if (this.formData.time.length > 0) {
        this.formData.time_start = this.formData.time[0];
        this.formData.time_end = this.formData.time[1];
      }
      let res = await order_list(this.formData)
      if (res.code == 200) {
        this.tableData = res.data.data;
        this.formData.total = res.data.total;
      }
    },
    async getOptions() {
      let res = await order_options();
      if (res.code == 200) {
        this.statusList = [
          { name: "全部", id: -1 },
          ...res.data.status
        ]
        this.channelList = res.data.channel;
      }
    },
    handleClick(e) {
      this.formData.status = this.statusList[+e.index].id;
      this.getList(true);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  margin: 0;
}

::v-deep .el-pager {
  .active {
    background: linear-gradient(0deg, #5b80ee 0%, #3e63f4 100%);
    font-size: 14px;
    color: white;
    border-radius: 5px;
  }
}

::v-deep .el-table thead th {
  height: 65px;
  /* 替换为你想要的高度值 */
}

::v-deep .el-tabs__nav-wrap::after {
  background-color: white;
}

::v-deep .el-tabs__item.is-active {
  color: #3e63f4;
}

::v-deep .el-tabs__active-bar {
  background-color: #3e63f4;
  height: 3px;
}

::v-deep .el-input__inner {
  border: 1px solid white;
}

//   #3E63F4
.home-container {
  height: 100%;
}

.main {
  height: 100%;
  display: flex;
  flex-direction: column;

  .tab {
    background-color: white;
    padding: 17px 0 10px 22px;
    border-radius: 10px 10px 0px 0px;
  }

  .context {
    margin: 7px auto;
    width: 100%;
    flex-grow: 1;
    flex-direction: column;
    display: flex;

    .form {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .form-item {
        margin-right: 7px;
      }

      .submit {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: linear-gradient(90deg, #5b80ee 0%, #3e63f4 100%);
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 14px;
      }

      .reset {
        cursor: pointer;
        width: 94px;
        height: 38px;
        background: #ffffff;
        border: 1px solid #f1f1f1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333333;
        font-size: 14px;
      }
    }

    .table {
      box-sizing: border-box;
      flex-grow: 1;
      background-color: #fff;
      max-height: 600px;
      overflow-y: scroll;
      .table-name {

        // padding-left: 20px;
        .table-name-top {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 10px;
          cursor: pointer;

          .table-name-top-title {
            color: #333333;
            font-size: 16px;
            font-weight: 600;
            line-height: 12px;
            margin-right: 6px;
          }

          .table-name-top-icon {
            width: 17px;
            height: 14px;
            margin-right: 8px;
          }

          .table-name-top-status {
            font-size: 12px;
            font-weight: 600;
          }

          .success {
            color: #597fee;
          }
        }

        .table-name-num {
          color: #8590a1;
          font-size: 12px;
        }
      }

      .between {
        display: flex;
        flex-direction: row;
        align-items: center;

        .between-title {
          color: #333333;
          font-size: 14px;

          margin-bottom: 10px;
          line-height: 1;
        }

        .between-label {
          color: #333333;
          font-size: 14px;
          line-height: 1;
          font-weight: 600;
        }

        .button {
          // width: 90px;
          height: 32px;
          margin-bottom: 5px;
          margin-right: 4px;
          padding: 0 15px;
          background: #ffffff;
          border: 1px solid #5b80ee;
          // border-image: linear-gradient(0deg, #5B80EE, #3E63F4) 10 10;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #333333;
          font-size: 14px;
          line-height: 1;
        }
      }
    }

    .pagination {
      padding-bottom: 47px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
    }
  }
}
</style>
