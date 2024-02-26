<template>
  <div class="home-container">

    <div class="main">
      <div class="tab">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane label="待客服回复" name="PayPal" />
          <el-tab-pane label="待我确认" name="Visa" />
          <el-tab-pane label="已完成" name="ready" />
        </el-tabs>
      </div>

      <div class="context">
        <div class="form">
          <div class="form-item">
            <el-select v-model="value" placeholder="工单号" style="width: 120px;">
              <el-option label="工单号" :value="1" />
            </el-select>
          </div>
          <div class="form-item"><el-input v-model="formData.search_no" type="number" placeholder="请输入工单号搜索.." /></div>
          <div class="form-item">
            <el-select v-model="value1" placeholder="创建时间" style="width: 120px;">
              <el-option label="创建时间" :value="1" />
            </el-select>
          </div>
          <div class="form-item"><el-date-picker v-model="formData.time" value-format="yyyy-MM-dd HH-mm-ss"
              type="datetime" placeholder="选择日期时间" /></div>
          <div class="form-item submit" @click="getList(true)"><span>搜索</span></div>
          <div class="form-item reset" @click="resertFormFnc"><span>重置</span></div>
          <div class="form-item submit" @click="addWorkOrder"><span>添加</span></div>
        </div>
        <div class="table">
          <el-table :data="tableData" style="width: 100%" center>
            <el-table-column prop="order_status" label="工单状态" width="180" />
            <el-table-column prop="work_order_no" label="工单号" min-width="280" />
            <el-table-column prop="title" label="标题" min-width="180" />
            <el-table-column prop="created_at" label="创建时间" min-width="180">
              <template slot-scope="scope">
                <span>{{ convertTimestampToDateString(scope.row.created_at) }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="date" label="操作" min-width="280">
              <template slot-scope="scope">
                <div class="between">
                  <!-- <div class="button" @click="handleBtn(scope)">查看</div> -->
                  <div class="button1" @click="handleBtn(scope)">回复</div>
                  <!-- <div class="button2" @click="resolvedBtn(scope.row)">已解决</div>
                  <div class="button" @click="cancelBtn(scope.row)">取消</div> -->

                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination :current-page="formData.currentPage" :page-sizes="[10, 20, 30, 40]"
            :page-size="formData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formData.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>

    <CustomerService ref="CustomerService" />

    <!-- 详情弹窗 -->
    <DirectiveDialog ref="detail" :title="dialogTitle" :width="700">
      <!-- <div class="dialog-box">
        <div class="form">
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>收款金额</span></div>
              <div class="form-item-input"><el-input v-model="detailObject.amount" @input="changeNum" /></div>
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>充值单号</span></div>
              <div class="form-item-input"><el-input v-model="detailObject.recharge_no" /></div>
            </div>
            <div class="form-item-right">
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-left">
              <div class="form-item-title"><span>钱包地址</span></div>
              <div class="form-item-input"><el-input v-model="detailObject.url" /></div>
            </div>
          </div>

        </div>
        <div class="submit-btn">
          <div class="btn1 flex-content">确定</div>
          <div class="btn2 flex-content" @click="closeFnc">关闭</div>
        </div>
      </div> -->
    </DirectiveDialog>
  </div>
</template>

<script>
import Navbar from '@/layout/components/Navbar'
import formMixins from '@/mixins/formMixins'
//   import clooectionMixins from './clooectionMixins'
import DirectiveDialog from '@/components/DirectiveDialog/index'
import CustomerService from './CustomerService/index'
import { workorder_list, workorder_resolved, workorder_cancel } from '@/api/project'
import {convertTimestampToDateString} from '@/utils/time'
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
      activeName: 'all',
      value: 1,
      value1: 1,
      formData: {
        page: 1,
        limit: 10,
        total: 0,
        search_no: '',
        time: '',
        screen_start_time: '',
        screen_end_time: ''
      },
      tableData: [
        {
          "work_order_id": 3,
          "work_order_no": "2401251923177933",
          "email": "18336672717@163.com",
          "mobile": "18520793690",
          "member_id": 45,
          "order_status": 0,
          "title": "关于登录注册时的问题",
          "content": "问题描述：在登录注册过程中，如果验证码固定就好了",
          "last_time": "",
          "chat_history": [],
          "created_at": "2024-01-25 19:23:17",
          "finish_at": "2024-01-25 19:37:15",
          "updated_at": "2024-01-25 19:37:15",
          "date_time": "2024-01-25 19:27:26",
          "order_status_text": "待客服回复"
        },
      ],
      detailObject:{
          work_order_id: 3,
          work_order_no: "2401251923177933",
          email: "18336672717@163.com",
          mobile: "18520793690",
          member_id: 45,
          order_status: 0,
          title: "关于登录注册时的问题",
          content: "问题描述：在登录注册过程中，如果验证码固定就好了",
          last_time: "",
          chat_history: [],
          created_at: "2024-01-25 19:23:17",
          finish_at: "2024-01-25 19:37:15",
          updated_at: "2024-01-25 19:37:15",
          date_time: "2024-01-25 19:27:26",
          order_status_text: "待客服回复"
      },
      dialogTitle:'详情'
    }
  },
  mounted() {
    // this.getList()
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
    addWorkOrder(id) {
      this.detailObject.work_order_id = id;
      if(id){
        this.dialogTitle = '详情'
      }else{
        this.dialogTitle = '添加'
      }
    },
    async cancelBtn(row) {
      this.$alert('是否取消该工单', '提示', {
        confirmButtonText: '确定',
        callback: async (action) => {
          if (action == 'confirm') {
            let res = await workorder_cancel(row.work_order_id)
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.getList()
              return
            }
            this.$message.error(res.msg);
          }
        }
      });
    },
    async resolvedBtn(row) {
      this.$alert('是否确定标记已解决', '提示', {
        confirmButtonText: '确定',
        callback: async (action) => {
          if (action == 'confirm') {
            let res = await workorder_resolved(row.work_order_id)
            if (res.code == 200) {
              this.$message.success(res.msg);
              this.getList()
              return
            }
            this.$message.error(res.msg);
          }
        }
      });
    },
    resertFormFnc() {
      this.formData = {
        page: 1,
        limit: 10,
        total: 0,
        search_no: '',
        time: '',
        screen_start_time: '',
        screen_end_time: ''
      }
      this.getList();
    },
    async getList(bool = false) {
      if (bool) {
        this.formData.page = 1;
      }
      if (this.formData.time.length > 0) {
        this.formData.screen_start_time = this.formData.time[0];
        this.formData.screen_end_time = this.formData.time[1];
      }
      let res = await workorder_list(this.formData)
      if (res.code == 200) {
        this.tableData = res.data.data;
        this.formData.total = res.data.total;
      }
    },
    handleClick(e) {
      console.log(e)
    },
    handleBtn(scope) {
      this.$refs.CustomerService.openDialog(scope.row)
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
      padding-bottom: 70px;
      box-sizing: border-box;
      background-color: white;
      flex-grow: 1;

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
      border-radius: 0px 0px 10px 10px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
      padding-bottom: 47px;
    }
  }
}

.dialog-box {
  .form {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 37px;

    .form-item1 {
      display: flex;
      flex-direction: column !important;
    }

    .form-item {
      width: 100%;
      display: flex;
      flex-direction: row;
      margin-bottom: 25px;

      .info {
        color: #858585;
        font-size: 14px;
        margin-bottom: 16px;
      }

      .color {
        span {
          color: #F29D51;
        }
      }

      // align-content: flex-start;
      // align-self: flex-start;
      .form-item-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 70%;
        margin-right: 12px;

        .form-item-title {
          width: 115px;
          height: 42px;
          border: 1px solid #F1F1F1;
          font-size: 14px;
          color: #333333;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
        }

        .form-item-input {
          width: calc(100% - 115px);
          // height: 42px;
          // background-color: red;
          // height: 100%;
          box-sizing: border-box;
          border-top: 1px solid #F1F1F1;
          border-bottom: 1px solid #F1F1F1;
          border-right: 1px solid #F1F1F1;
          // padding: 14px 20px;
          // margin-bottom: 12px;
        }
      }


      .form-item-right {
        display: flex;
        flex-grow: 1;
        flex-direction: column;

        .form-item-button {
          width: 164px;
          height: 42px;
          border: 1px solid #F1F1F1;
          background: linear-gradient(90deg, #5B81EE 0%, #3D63F4 100%);
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
          font-size: 14px;
          box-sizing: border-box;
          // padding: 10px 58px;
        }


        .form-item-right-label {
          color: #8E8E8E;
          font-size: 14px;
        }

      }
    }

    .form-text {
      width: 100%;
      color: #333333;
      font-size: 14px;
      padding-left: 30px;

      .title {
        margin-right: 70px;
      }
    }
  }

  .submit-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    // margin-top: 120px;

    div {
      margin: 0 10px;
    }

    .btn1 {
      width: 120px;
      height: 42px;
      border: 1px solid #F1F1F1;
      background: linear-gradient(90deg, #5A80EE 0%, #3D63F4 100%);
      border-radius: 6px;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;

    }

    .btn2 {
      width: 120px;
      height: 42px;
      background: #F7F9FA;
      border: 2px solid #597FEE;
      border-radius: 6px;
      color: #3E64F4;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
