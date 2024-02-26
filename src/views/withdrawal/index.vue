<template>
  <div class="home-container">

    <div class="main">
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="全部" />
          <el-tab-pane label="提现中" name="PayPal" />
          <el-tab-pane label="提现成功" name="Visa" />
          <el-tab-pane label="提现失败" name="Visa" />
        </el-tabs>
      </div>

      <div class="context">
        <div class="form">
          <div class="form-item">
            <el-select v-model="formData.keyword_type" placeholder="提现单号" style="width: 120px;">
              <el-option label="提现单号" value="withdraw_no" />
              <el-option label="交易哈希" value="transfer_hash" />
            </el-select>
          </div>
          <div class="form-item"><el-input v-model="formData.keyword" type="number" placeholder="请输入搜索.." /></div>
          <div class="form-item">
            <el-select v-model="formData.state" placeholder="提现状态" style="width: 120px;">

              <el-option label="提现中" :value="1" />
              <el-option label="提现成功 " :value="2" />
              <el-option label="提现失败" :value="3" />
            </el-select>
          </div>
          <div class="form-item">
            <el-select v-model="value" placeholder="创建时间" style="width: 120px;">
              <el-option label="创建时间" :value="1" />
              <!-- <el-option label="否" :value="0" /> -->
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
            <el-table-column prop="status" label="提现状态" />
            <el-table-column prop="money" label="提现金额" />
            <el-table-column prop="fee" label="提现固定费用" />
            <el-table-column prop="rate" label="提现费率" />
            <el-table-column prop="dreal_moneyate" label="可得金额" />
            <el-table-column prop="withdraw_no" label="提现单号" />
            <el-table-column prop="address" label="收款地址" />
            <el-table-column prop="transfer_hash" label="交易HASH" />
            <el-table-column prop="created_at" label="创建时间" min-width="180">
              <template slot-scope="scope">
                <span>{{ convertTimestampToDateString(scope.row.created_at) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" />
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination :current-page="formData.page" :page-sizes="[10, 20, 30, 40]" :page-size="formData.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="formData.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <CustomerService ref="CustomerService" />
  </div>
</template>
  
<script>
import Navbar from '@/layout/components/Navbar'
import formMixins from '@/mixins/formMixins'
//   import clooectionMixins from './clooectionMixins'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import CustomerService from '@/components/CustomerService/index'
import { convertTimestampToDateString } from '@/utils/time'
import { withdraw_list } from '@/api/project'

export default {
  name: 'Home',
  components: {
    Navbar,
    DirectiveDialog,
    CustomerService
  },
  mixins: [formMixins],
  data() {
    return {
      activeName: '全部',
      value: 1,
      formData: {
        limit: 1,
        page: 10,
        total: 0,
        keyword_type: "withdraw_no",
        keyword: '',
        state: '',
        time: '',
        time_start: '',
        time_end: ''
      },
      resertForm: {

      },
      tableData: []
    }
  },
  mounted() {
    this.getList()
    this.convertTimestampToDateString = convertTimestampToDateString;
  },
  methods: {
    handleSizeChange(val) {
      this.formData.limit = val;
      this.getList(true);
    },
    handleCurrentChange(val) {
      this.formData.page = val;
      this.getList();
    },
    resertFormFnc() {
      this.formData = {
        limit: 1,
        page: 10,
        total: 0,
        keyword_type: "withdraw_no",
        keyword: '',
        state: '',
        time: ''
      }
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
      let res = await withdraw_list(this.formData)
      if (res.code == 200) {
        this.tableData = res.data.data;
        this.formData.total = res.data.total;
      }
    },
    handleClick(e) {
      console.log(e)
    },
    handleBtn(scope) {
      this.$refs.CustomerService.init()
    }
  }
}
</script>
  
<style lang="scss" scoped>
::v-deep .el-pager {
  .active {
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
  height: 100%;
  display: flex;
  flex-direction: column;

  .tab {
    background-color: white;
    padding: 17px 0 0px 22px;
    border-radius: 10px 10px 0px 0px;
  }

  .context {
    width: 100%;
    margin: 7px auto;
    flex-grow: 1;
    display: flex;
    flex-direction: column;

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
      flex-grow: 1;
      padding-bottom: 70px;
      box-sizing: border-box;
      background-color: white;

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
        flex-direction: row;
        align-items: center;

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

        .button,
        .button1,
        .button2 {
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
          margin-right: 24px;
        }

        & .button1 {
          background: linear-gradient(90deg, #5B80EF 0%, #3D63F4 100%);
          color: white;
          border: none;
        }

        & .button2 {
          background: linear-gradient(90deg, #EFC05B 0%, #EB8E14 100%);
          color: white;
          border: none;
        }
      }
    }

    .pagination {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
      padding-bottom: 47px;
    }
  }
}
</style>
  