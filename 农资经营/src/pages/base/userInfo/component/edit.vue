/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.nhId?'编辑':'新增'}}用户信息</div>
      <el-form-item label="账号名称" prop="registerName">
        <el-input v-model="form.registerName" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="用户姓名" prop="yhxm">
        <el-input v-model="form.yhxm" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="contTel">
        <el-input v-model="form.contTel" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="角色"
                    prop="jsbh">
        <el-select v-model="form.jsbh"
                   size="small"
                   class="f-vab f-mr20"
                   style="width:100%;"
                   placeholder="请选择">
          <el-option v-for="item in roleList"
                     :key="item.jsbh"
                     :label="item.jsmc"
                     :value="item.jsbh">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" v-model="form.comment" placeholder="请输入"></el-input>
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
  import fetch from "fetch/axios/";
  export default {
    data(){
      //使用了一个input没有的事件select  目的：只在最后提交之前触发用户是否存在的校验
      const yhmIsExist = (rule, value, callback)=>{
        let{registerName} = this.form;
        var params ={
          checkData:registerName,
          checkType:1
        }
        if(this.form.bizUserId){
          params.bizUserId=this.form.bizUserId;
        }
        this.$fetch.api_base.yhxx_exist(params).then((res)=>{
          if(res.bean){
            callback(new Error('该账号名称已被使用！'));
          }else{
            callback();
          }
        })
      };
			const sjhIsExist = (rule, value, callback)=>{
        let{contTel} = this.form;
        var params ={
          checkData:contTel,
          checkType:2,
          qyId:this.userInfo.bizId
        }
        if(this.form.bizUserId){
          params.bizUserId=this.form.bizUserId;
        }
        this.$fetch.api_base.yhxx_exist(params).then((res)=>{
          if(res.bean){
            callback(new Error('该手机号已被使用！'));
          }else{
            callback();
          }
        })
      };
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
			const checkPhone = { validator: exec.checkPhone, trigger: 'blur' }
       
      return {
        disabled:false,
        rules:{
            registerName:[commonValidate,,{ validator: yhmIsExist, trigger: 'blur' }],
            yhxm:[commonValidate,,],
            jsbh:[commonValidate,,],
            contTel:[commonValidate,checkPhone,{ validator: sjhIsExist, trigger: 'blur' }],
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  registerName: '',
                  yhxm: '',
                  contTel:'',
                  jsbh:'',
                  comment: ''
                }
            }
        },
       roleList:[]
    },
    created() {
    this.getRoles();
   },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    methods: {
      getRoles() {
        fetch({
          url: "/jcJsGn/listJsb/",
          method: "get",
          data: {
            qyId: this.userInfo.bizId + "",
            xtdm: "NZ_NZJY",
          }
        })
          .then(res => {
            this.roleList = res.list;
          })
          .catch(() => {
            this.loading = false;
          });
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { registerName,yhxm,jsbh,contTel,comment} = this.form;
            //用户参数
            let {bizId,bizName} = this.userInfo;
            //传值参数
            let params = {registerName,yhxm,jsbh,contTel,comment,bizId,bizName};
            if(this.form.bizUserId){
              params.bizUserId = this.form.bizUserId;
              params.modifyUserId=this.userInfo.bizUserId;
            }else{
              params.modifyUserId=this.userInfo.bizUserId;
              params.createUserId=this.userInfo.bizUserId;
            }
            if(this.form.delFlag){
              params.delFlag = this.form.delFlag;
            }else{
              params.delFlag = 1;
            }
            params.bizId=this.userInfo.bizId;
            params.bizName=this.userInfo.bizName;
            params.xtdm="NZ_NZJY";
            this.$fetch.api_base.yhxx_save(params).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch(()=>{
               this.$message.error('操作失败！')
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

