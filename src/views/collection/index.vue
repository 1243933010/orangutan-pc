<template>
  <div class="home-container">
    <navbar />

    <div class="main">
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="(item,index) in statusList" :key="index"  :label="item.name" :name="item.id.toString()" />
        </el-tabs>
      </div>

      <div class="context">
        <div class="form">
          <div class="form-item"><el-input v-model="formData.money" type="number" placeholder="输入收款金额.." /></div>
          <div class="form-item"><el-input v-model="formData.dealers_name" type="text" style="width: 250px;" placeholder="请输入商家名称搜索.." />
          </div>
          <div class="form-item">
            <el-select v-model="formData.is_auth" placeholder="是否认证" style="width: 120px;">
              <el-option label="已认证" :value="1" />
              <el-option label="未认证" :value="2" />
            </el-select>
          </div>
          <div class="form-item">
            <el-select v-model="formData.online" placeholder="是否在线" style="width: 120px;">
              <el-option label="在线" :value="1" />
              <el-option label="离线" :value="2" />
            </el-select>
          </div>
          <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
          <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" center>
            <el-table-column prop="date" label="商家" width="240">
              <template slot-scope="scope">
                <div class="table-name">
                  <div class="table-name-top">
                    <span class="table-name-top-title" @click="seeDetail(scope)">{{ scope.row.dealers_name }}</span>
                    <img class="table-name-top-icon" src="../../assets/online.png" alt="">
                    <span class="table-name-top-status success" v-if="scope.row.online==1">在线</span>
                    <span class="table-name-top-status success" v-if="scope.row.online==0">离线</span>
                  </div>
                  <div class="table-name-num">
                    <span>{{scope.row.order_num}}单</span> |
                    <span>{{scope.row.order_rate}}%</span> |
                    <span>成交{{scope.row.transaction}}家</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="balance_money" label="商家保证金" width="100">
            </el-table-column>
            <el-table-column prop="rate" label="收款汇率/区间" width="200">
              <template slot-scope="scope">
                <div class="between">
                  <span class="between-title">{{scope.row.rate}}%</span>
                  <span class="between-label">单笔收款区间: {{scope.row.min_money}}-{{scope.row.max_money}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="channel" label="收款渠道说明" width="180">
              <!-- <template slot-scope="scope">
                <div class="between">
                  <span class="between-title">PayPal</span>
                  <span class="between-label">仅支持亲密付</span>
                </div>
              </template> -->
            </el-table-column>
            <el-table-column prop="return_method" label="回款方式" width="180">
            </el-table-column>
            <el-table-column prop="remark" label="商家留言" width="300">
              <template slot-scope="scope">
                <div class="between">
                  <span class="between-label">{{scope.row.remark}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="操作" width="180">
              <template slot-scope="scope">
                <div class="between">
                  <div class="button" v-if="userInfo.identity==1" @click="handleBtn(scope,'Dialog1')">发起收款</div>
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
    <!-- 发起收款弹窗 -->
    <DirectiveDialog  ref="initiate" title="发起收款">
      <Dialog1 :collectionObj="collectionObj" @closeDialog="closeDialog('initiate',true)" />
    </DirectiveDialog>

    <!-- 商家详情 -->
    <DirectiveDialog  ref="detail" title="发起收款">
      <Dialog2 @closeDialog="closeDialog('detail')" />
    </DirectiveDialog>

      <!-- 付款弹窗 -->
      <DirectiveDialog  ref="pay" title="订单号xxxxx">
      <Pay @closeDialog="closeDialog('pay')" />
    </DirectiveDialog>

    <!-- 冻结弹窗 -->
    <DirectiveDialog  ref="freeze" title="账号冻结提示">
      <Freeze @closeDialog="closeDialog('Freeze')" />
    </DirectiveDialog>

  <!-- 首次收款提示 -->
   <DirectiveDialog  ref="firstCom" title="首次收款提示">
      <FirstCom @closeDialog="closeDialog('firstCom')" />
    </DirectiveDialog>
    
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
// import formMixins from '@/mixins/formMixins'
import clooectionMixins from './clooectionMixins'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import Dialog1 from './components/Dialog1'
import Dialog2 from './components/Dialog2'
import Pay from './components/Pay'
import Freeze from './components/Freeze'
import FirstCom from './components/FirstCom'
import {collection_list,order_options} from '@/api/project'
import $bus from '@/utils/mitt';


export default {
  name: 'Home',
  components: {
    Navbar,
    DirectiveDialog,
    Dialog1,
    Dialog2,
    Pay,
    Freeze,
    FirstCom
  },
  mixins: [clooectionMixins],
  data() {
    return {
      activeName: '',
      statusList:[],
      value: '',
      formData: {
        limit: 10,
        page: 1,
        total: 0,
        money:'',
        channel:'',
        dealers_name:'',
        online:'',
        is_auth:''
      },
      resertForm: {

      },
      tableData: [
      {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      ]
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  mounted(){
    this.getOptions();
    this.getList()
    $bus.on('dialogClose', (refName) => {
      console.log(this.$refs[refName],refName)
      // this.$refs[refName].clearIntervalFnc()
      this.getList(true)
    });
  },
  methods: {
    resertFormFnc() {
      this.formData = {
        limit: 10,
        page: 1,
        total: 0,
        money:'',
        channel:'',
        dealers_name:'',
        online:'',
        is_auth:''
      }
      this.getList();
    },
    async getOptions(){
      let res = await order_options();
      if(res.code==200){
        this.statusList = [
        { name: "全部", id: '' },
        ...res.data.channel
        ]
      }
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
      // if (this.formData.time.length > 0) {
      //   this.formData.time_start = this.formData.time[0];
      //   this.formData.time_end = this.formData.time[1];
      // }
      let res = await collection_list(this.formData)
      if (res.code == 200) {
        this.tableData = res.data.data;
        this.formData.total = res.data.total;
      }
    },
    handleClick(e) {
      this.formData.channel = this.statusList[+e.index].id;
      console.log(e)
      this.getList(true);
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-pager{
  .active{
    background: linear-gradient(0deg, #5B80EE 0%, #3E63F4 100%);
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
  color: #3E63F4;

  font-size: 18px;
  font-weight: 600;
}

::v-deep .el-tabs__active-bar {
  background-color: #3E63F4;
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
  max-width: 1495px;
  margin: 13px auto;

  .tab {
    background-color: white;
    padding: 17px 0 0px 22px;
    border-radius: 10px 10px 0px 0px;
  }

  .context {
    width: 100%;
    margin: 7px auto;

    // display: flex;
    // flex-direction: row;
    // align-items: center;
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
        background: linear-gradient(90deg, #5B80EE 0%, #3E63F4 100%);
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
        background: #FFFFFF;
        border: 1px solid #F1F1F1;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #333333;
        font-size: 14px;
      }
    }

    .table {
      // width: 95%;
      
      margin-bottom: 70px;
      box-sizing: border-box;
      // margin-left: 20px;
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
            color: #597FEE;
          }
        }

        .table-name-num {
          color: #8590A1;
          font-size: 12px;
        }
      }

      .between {
        display: flex;
        flex-direction: column;

        .between-title {
          color: #333333;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 10px;
          line-height: 1;
        }

        .between-label {
          color: #8590A1;
          font-size: 12px;
          line-height: 1;
        }

        .button {
          width: 80px;
          height: 32px;
          background: #FFFFFF;
          border: 1px solid #5B80EE;
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
    .pagination{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
