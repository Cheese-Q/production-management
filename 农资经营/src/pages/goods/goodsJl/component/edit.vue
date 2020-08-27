/*新增*/
<template>
  <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
    <div class="form-title f-fs18 f-tac f-mb30 f-mt30">新增</div>
    <el-form-item label="基本单位" prop="baseUnit">
      <el-select v-model="form.baseUnit" placeholder="全部" @change="changeSelect()">
        <el-option
          v-for="item in basicUnitList"
          :key="item.id"
          :label="item.unitName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="辅助单位1" prop="subUnit1">
      <el-select v-model="form.subUnit1" placeholder="全部" @change="subUnit1List()">
        <el-option
          v-for="item in subUnitList"
          :key="item.id"
          :label="item.unitName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span>=</span>
      <el-input v-model="form.subUnitNum1"></el-input>
      <span class="name" v-text="baseName"></span>
    </el-form-item>
    <el-form-item label="辅助单位2" prop="subUnit2">
      <el-select v-model="form.subUnit2" placeholder="全部" @change="subUnit2List()">
        <el-option
          v-for="item in subUnitList"
          :key="item.id"
          :label="item.unitName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span>=</span>
      <el-input v-model="form.subUnitNum2"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button
        round
        type="primary"
        @click="submitForm"
        :disabled="disabled"
      >{{disabled?'提交中':'提 交'}}</el-button>
      <el-button round @click="closeForm">取 消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { mapGetters } from "vuex";
import { exec } from "common/tools";
import fetch from "fetch/axios/";
export default {
  data() {
    return {
      baseName: "",
      baseUnitId: "",
      baseUnit: "",
      subUnitId1: "",
      subUnitId2: "",
      subUnit2: "",
      subUnit1: "",
      form: {
        subUnitNum1: "",
        subUnitNum2: ""
      },
      disabled: false,
      basicUnitList: [],
      subUnitList: [],
      rules: {
        baseUnit: [
          { required: true, message: "请选择基本单位", trigger: "change" }
        ],
        subUnit1: [
          { required: true, message: "请选择副单位1", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  created() {
    this.getbasicUnit();
    this.getSubUnit();
  },
  methods: {
    // 获取基本单位下拉列表
    getbasicUnit() {
      fetch({
        url: "/nzsyUnit/listUnit/",
        method: "get",
        data: {
          type: "1"
        }
      }).then(res => {
        this.basicUnitList = res.bean;
      });
    },
    // 获取辅助单位下拉列表
    getSubUnit() {
      fetch({
        url: "/nzsyUnit/listUnit/",
        method: "get",
        data: {
          type: "2"
        }
      }).then(res => {
        this.subUnitList = res.bean;
      });
    },
    // 循环输出basicUnitList  并复制到 baseName
    changeSelect() {
      let list = this.basicUnitList;
      console.log(list);
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == this.form.baseUnit) {
          console.log("id \t" + this.form.baseUnit);
          console.log("name \t" + list[i].unitName);
          this.baseName = list[i].unitName;
          this.baseUnitId = list[i].id;
          this.baseUnit = list[i].unitName;
        }
      }
    },
    // 验证输入是否为空
    judge() {
      if (this.subUnitId1 == this.subUnitId2) {
        this.$message.error("不能选择相同的副单位1跟副单位2");
      }
      if (this.form.subUnitNum1 == "") {
        // console.log("请输入副单位1的数量");
        this.$message.error("请输入副单位1的数量");
      } else if (this.subUnitId2 != null && this.form.subUnitNum2) {
        // console.log("请输入副单位2的数量");
        this.$message.error("请输入副单位2的数量");
      }
    },
    // 循环输出subUnit1List  并复制到 subUnitId1、subUnit1
    subUnit1List() {
      let lists = this.subUnitList;
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].id == this.form.subUnit1) {
          this.subUnitId1 = lists[i].id;
          this.subUnit1 = lists[i].unitName;
          console.log("subUnitId1 \t" + this.form.subUnit1);
          console.log("subUnit1 \t" + lists[i].unitName);
        }
      }
    },
    // 循环输出subUnit1List  并复制到 subUnitId2、subUnit2
    subUnit2List() {
      let list = this.subUnitList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id == this.form.subUnit2) {
          this.subUnitId2 = list[i].id;
          this.subUnit2 = list[i].unitName;
          console.log("subUnitId2 \t" + this.form.subUnit2);
          console.log("subUnit2 \t" + list[i].unitName);
        }
      }
    },
    // 提交
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          //防止二次提交
          this.disabled = true;
          //用户参数
          let bizId = this.userInfo;
          //传值参数
          console.log(
            "基本单位" + this.baseUnit + "\n基本单位id" + this.baseUnitId
          );
          console.log(
            "辅助单位1id" + this.subUnitId1 + "\n辅助单位1" + this.subUnit1
          );
          console.log(
            "辅助单位2id" + this.subUnitId2 + "\n辅助单位2" + this.subUnit2
          );
          let params = {
            baseUnitId: this.baseUnitId,
            baseUnit: this.baseUnit,
            subUnitId1: this.subUnitId1,
            subUnit1: this.subUnit1,
            subUnitNum1: this.form.subUnitNum1,
            subUnitId2: this.subUnitId2,
            subUnit2: this.subUnit2,
            subUnitNum2: this.form.subUnitNum2,
            bizId: this.userInfo.bizId
          };
          this.judge();
          this.$fetch.api_goods
            .dw_save(params)
            .then(res => {
              this.$message.success("操作成功！");
              this.closeForm(true);
              this.disabled = false;
            })
            .catch(() => {
              this.$message.error("操作失败！");
              this.disabled = false;
            });
        } else {
          this.$message.error("请按要求填写");
          return false;
        }
      });
    },
    closeForm(fresh = false) {
      this.$emit("closeForm", fresh);
    }
  }
};
</script>

<style lang="scss" scoped>
#name {
  color: red;
}
.el-form-item {
  width: 600px;
  .el-input {
    width: 213px;
  }
}
</style>
