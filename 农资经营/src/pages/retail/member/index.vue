<!--
 * @Author: 龚铱白
 * @Date: 2019-08-14 19:26:39
 * @LastEditors: 龚铱白
 * @LastEditTime: 2019-09-02 14:36:46
 * @Description: 
 -->
/*用户信息*/
<template>
  <div>
    <v-table v-show="!isEdit"
             @edit=edit
             ref="table"></v-table>
    <v-edit class="editFzr"
            v-if="isEdit"
            :form=editRow
            @closeForm=closeForm></v-edit>
  </div>
</template>

<script>
import vEdit from './component/edit';
import vTable from './component/table';
export default {
  components: {
    vEdit,
    vTable
  },
  data () {
    return {
      isEdit: false,   // 判断显示table 还是 编辑弹框
      editRow: {
        id: '',
        hymc: '',
        sfz: '',
        sjhm: '',
        csrq: '',
        bz: '',
        hydj: '',
        hydjId: ''
      }
    }
  },
  methods: {
    edit (row = {}) {
      this.isEdit = true
      if (row.id) {
        this.editRow = row;
      } else {
        this.editRow = {
          id: '',
          hymc: '',
          sfz: '',
          sjhm: '',
          csrq: '',
          bz: '',
          hydj: '',
          hydjId: ''
        }
      }
    },
    closeForm (isRefresh) {
      this.isEdit = !this.isEdit;
      if (isRefresh) {
        //更新table的数据
        this.$refs.table.getTableData();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.input-with-select {
  width: 240px;
}
.ncp-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.editFzr {
  margin-left: 150px;
}
</style>



