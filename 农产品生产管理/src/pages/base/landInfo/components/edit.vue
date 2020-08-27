/*编辑*/
<template>
<div>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{oldscmc?'编辑':'新增'}}地块信息</div>
      <el-form-item label="场所名称" prop="csmc">
        <el-input v-model.trim="form.csmc" placeholder="请输入" :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="cslxbh" >
      <el-select
        v-model.trim="form.cslxbh"
        class="form-select"
        placeholder="请选择"
        @change="selDKType"
        >
        <el-option
          v-for="item in dktypes"
          :key="item.value"
          :label="item.sjzdMc"
          :value="item.sjzdBm+'/'+item.sjzdMc">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="fzr" class="f-pr">
          <el-input  v-model.trim=form.fzr><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="fzrDialogVisable=true" style="top:0;right:0;left:0;bottom:0;opacity:0;"></div>
      </el-form-item>
      <el-form-item label="面积" prop="mj">
        <el-input v-model.trim="form.mj" placeholder="请输入":maxlength="15" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="场所位置码">
        <el-input v-model.trim="form.positCode" placeholder="请输入":maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入":maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click="closeForm(false)">取 消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="选择负责人"
      width="900px"
      :append-to-body="true"
      :visible.sync="fzrDialogVisable"
    >
      <sel-fzr @selfzr="selfzr"></sel-fzr>
    </el-dialog>
</div>

</template>
<script>
 import {mapGetters} from 'vuex'
  export default {
    data(){
			const dkExist = (rule, value, callback)=>{
        var params ={
          csmc:this.form.csmc,
          ztdm:this.userInfo.ztdm
        }
        //edit
        if(this.oldscmc && this.form.csmc ===this.oldscmc ){
           callback();
        }
        this.$fetch.api_base.dk_exist(params).then((res)=>{
          if(res.bean==1){
            callback(new Error('该地块已存在'));
          }else{
            callback();
          }
        })
			};
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}

			const countLimitValidate = (rule, value, callback)=>{
				const pattern = /^[0-9]+$/;
				if (!pattern.test || value === 0) {
          callback(new Error('数值必须大于零'));
        }  else{
          callback();
        }
			};
      return {
        disabled:false,
        dktypes:[],
        selDK:[],
        oldscmc:'',
        fzrDialogVisable:false,
        rules:{
            csmc:[commonValidate,{ validator: dkExist, trigger: 'blur' }],  
            cslxbh: {required: true, message: '必填项', trigger: 'change'},
            fzr:commonValidate,
            mj:commonValidate
        },
      }
    },
    computed:{
      ...mapGetters({userInfo:'getUserInfo'})
    },
    created(){
      this.getTypes();
      this.oldscmc=this.form.csmc
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    csmc:'',
                    fzr:'',
                    nhsfzh:'',
                    nhxm:'',
                    cslxbh:'',
                    cslxmc:'',
                    mj: '',
                    positCode:'',
                    bz:'',
                    sfky:'1',
                    syjsz:''
                }
            }
        }
    },
    methods: {
      getTypes(){
          let param = {lxbm:'CSLX',hy:this.userInfo.hy}
          this.$fetch.api_base.dk_type(param).then((res)=>{
              this.dktypes=res.list;
          })
      },
      selfzr(row){
        this.fzrDialogVisable=false;
        this.form.nhsfzh=row.sfzh;
        this.form.nhxm=row.nhxm;
        this.form.fzr=row.nhxm;
        this.$refs.form.validateField('fzr');
      },
      selDKType(value){
        this.selDK = value.split('/');
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //用户参数
            let {ztdm,scjyztId} =this.userInfo;
            let paramsAll ={ztdm,scjyztId};
            Object.assign(paramsAll,this.form);
            if(this.selDK[0]){
              paramsAll.cslxbh=this.selDK[0];
              paramsAll.cslxmc=this.selDK[1];
            }else{
              paramsAll.cslxbh =  paramsAll.cslxbh.split('/')[0];
            }
            this.$fetch.api_base.dk_save(paramsAll).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch(()=>{
               this.$message.error('操作失败！')
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写!!');
            return false;
          }
        });
      },
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      }
    }
  }
</script>

 <style scoped lang="scss">
//     .form{
//         width:700px;
//         .form-title{
//             padding-left:180px;
//         }
//     }
</style>
