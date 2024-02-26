export default {
  data() {
    return {

    }
  },
  methods: {
    handleSizeChange(val) {
      this.formData.pageSize = val;
      this.query();
    },
    handleCurrentChange(val) {
      this.formData.currentPage = val;
      this.query();
    },
    resetForm() {
      this.formData = this.resetForm
    },
    query(resetBool = false) {
      if (resetBool) {
        this.formData.page = 1
      }
      //------
    }
  }
}
