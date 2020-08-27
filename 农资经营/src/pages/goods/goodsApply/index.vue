/*商品维护*/
<template>
  <div>
    <v-table v-show="!isEdit && !isEdit1"  @edit=edit @select=select ref="table" :khtype="khtype"></v-table>
    <v-edit class="editFzr" :khtype="khtype" v-if="isEdit" :form=editRow @closeForm=closeForm></v-edit>
    <v-select class="editFzr" v-if="isEdit1" :form=editRow @closeForm=closeForm></v-select>
  </div>
</template>

<script>
  import vEdit from './component/edit.vue';
  import vTable from './component/table';
  import vSelect from "./component/editSubmit.vue";

  export default {
    components: {
      vEdit,
      vTable,
      vSelect
    },
    data() {
      return {
        isEdit: false,   // 判断显示table 还是 编辑弹框
        isEdit1:false,
        khtype: [
          {label: '销售商', value: '01'},
          {label: '农资销售商', value: '02'},
          {label: '农产品供应商', value: '04'},
        ],
        editRow: {}
      }
    },
    methods: {
      select (row = {}) {
        console.log(row);
        this.isEdit = false;
        this.isEdit1 = true;
        this.editRow = row;
        // if (row.id) {
        //   this.editRow = row;
        // } else {
        //   this.editRow = {
        //     nzid: "",
        //   };
        // }
      },
      edit(row = {}) {
        this.isEdit = true;
        this.isEdit1 = false;
        if (row.ncpmc) {
          var imglists = row.attaUrl.split(',');
          imglists.forEach((item, index) => {
            imglists[index] = {"name": index + '.jpg', "url": item};
          })
          row.imglists = imglists;
          this.editRow = row;
        } else {
          this.editRow = {
            nhId: '',
            nhxm: '',
            sfzh: '',
            xb: '1',
            dz: '',
            bz: '',
            lxdh: '',
            sfky: 1,
            imglists: [],
            attaUrl: ''
          }
        }
      },
      closeForm(isRefresh) {
        this.isEdit = false;
        this.isEdit1 = false;
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



