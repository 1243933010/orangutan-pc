import { collection_detail } from '@/api/project'

export default {
  data() {
    return {
      collectionObj: {

      }
    }
  },
  methods: {
    async getDetail(payment_id) {
      let res = await collection_detail({ payment_id: payment_id });
      if(res.code==200){
        this.collectionObj = {payment_id,...res.data};
      }
    },
    handleBtn(scope, type) {
      console.log(scope.row)
      if (type == 'Dialog1') {
        // this.collectionObj = scope.row;
        this.getDetail(scope.row.payment_id)
        this.$refs.initiate.openDialog()
      }
      // if (scope.$index == 1) {
      //   this.$refs.pay.openDialog()
      // }
      // if (scope.$index == 2) {
      //   this.$refs.freeze.openDialog()
      // }
      // if (scope.$index == 3) {
      //   this.$refs.firstCom.openDialog()
      // }
    },
    closeDialog(ref, bool) {
      if (this.$refs[ref].close) {
        this.$refs[ref].close();
        if (bool) {
          this.getList(true)
        }
      }
    },
    seeDetail(scope) {
      this.$refs.detail.openDialog()
    }
  }
}