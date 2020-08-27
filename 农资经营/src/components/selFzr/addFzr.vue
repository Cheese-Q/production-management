/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}地块负责人信息</div>
      <el-form-item label="负责人姓名" prop="nhxm">
        <el-input v-model="form.nhxm" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="xb" >
        <el-radio-group v-model="form.xb">
          <el-radio :label="'1'">男</el-radio>
          <el-radio :label="'2'">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh">
        <el-input v-model="form.lxdh" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="sfzh">
        <el-input v-model="form.sfzh" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.dz" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="form.bz" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click=closeForm>取 消</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  export default {
    data(){
			const sjIsExist = (rule, value, callback)=>{
        let{nhId,lxdh} = this.form;
        var params2 ={
          str:lxdh,
          type:2,
          qyid:this.userInfo.qyid
        }
        if(nhId){
          params2.nhId=nhId;
        }
        this.$fetch.api_base.dkfzr_exist(params2).then((res)=>{
            if(res.bean==1){
              callback(new Error('该联系电话已使用！'));
            }else{
               callback();
            }
        })
      };
			const sfzhIsExist = (rule, value, callback)=>{
        let{nhId,sfzh} = this.form;
        var params2 ={
          str:sfzh,
          type:1,
          qyid:this.userInfo.qyid
        }
        if(nhId){
          params2.nhId=nhId;
        }
        this.$fetch.api_base.dkfzr_exist(params2).then((res)=>{
            if(res.bean==1){
              callback(new Error('该身份证号已使用！'));
            }else{
               callback();
            }
        })
      };
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
			const checkCardNo = { validator: exec.checkCardNo, trigger: 'blur' }
			const checkPhone = { validator: exec.checkPhone, trigger: 'blur' }

      return {
        disabled:false,
        rules:{
            nhxm:[commonValidate],
            xb:commonValidate,
            lxdh:[commonValidate,checkPhone,{ validator: sjIsExist, trigger: 'blur' }],
            sfzh:[commonValidate,checkCardNo,{ validator: sfzhIsExist, trigger: 'blur' }]
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    nhId: '',
                    nhxm: '',
                    sfzh:'',
                    xb: '1',
                    dz: '',
                    bz: '',
                    lxdh: '',
                }
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { nhId,nhxm,sfzh,xb,dz, bz,lxdh,sfky,sfsc,cdbsk} = this.form;
            //用户参数
            let {qydm,qyid,ztdm,scjyztId,yhxm:czr } = this.userInfo;
            //系统时间
            var  date = new Date();
            var czrq = date.getFullYear()  + '-'+ (date.getMonth()+1) +'-'+(date.getDate())
            let params = {nhxm,sfzh,xb,dz, bz,lxdh,sfky:1,sfsc:'',cdbsk:'',qydm,qyid,ztdm,scjyztId,czr}
            if(nhId){
              params.nhId = nhId;
            }
            this.$fetch.api_base.dkfzr_save(params).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch(()=>{
               this.$message.error('操作失败！')
               this.closeForm();
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写')
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
//         width:550px;
//         .form-title{
//             padding-left:180px;
//         }
//     }
</style>