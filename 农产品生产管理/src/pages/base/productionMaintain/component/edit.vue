/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form cpwh" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{oldncpmc?'编辑':'新增'}}产品维护</div>
      <el-form-item label="产品分类" prop="zlmc" class="f-pr">
          <el-input  :value="form.zlmc?form.zlmc+'/'+form.ncpEjZlmc+'/'+form.ncpSjmc:''"  :disabled="oldncpmc?true:false"><span slot="suffix" class="f-fs24 f-pr10">···</span></el-input>
          <div class="f-pa" @click="oldncpmc?'':jcncpDialogVisable=true" style="top:0;right:0;left:0;bottom:0;opacity:0"></div>
      </el-form-item>
      <el-form-item label="产品名称" prop="ncpmc">
        <el-input v-model.trim="form.ncpmc" placeholder="请输入" :maxlength="30" show-word-limit></el-input>
      </el-form-item> 
      <el-form-item label="规格型号" prop="ggxh">
        <el-input v-model.trim="form.ggxh" placeholder="请输入"  :maxlength="30" show-word-limit></el-input>
      </el-form-item>
      <!--<el-form-item label="单位" prop="dw">
        <el-input v-model.trim="form.dw"  placeholder="请输入" :maxlength="2" show-word-limit></el-input>
      </el-form-item>-->
      <el-form-item label="单位" prop="dwzl">
          <!-- <el-autocomplete
              v-model="form.dw"
               :maxlength="2"
              :fetch-suggestions="querySearch"
              placeholder="请输入"
          >
          </el-autocomplete> -->
      <el-select v-model="form.dwzl" @change="dwchange" placeholder="请选择">
        <el-option
          v-for="item in dwoptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="商品条码" >
        <el-input v-model.trim="form.goodsCode"
          placeholder="请输入" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
          :maxlength="13" show-word-limit>
        </el-input>
      </el-form-item>
      <el-form-item label="保质期" prop="bzq" class="f4">
      <el-input v-model.trim="form.bzq" @input="(value)=>{$nextTick(()=>{form.bzq= String(value).slice(0,10)})}" placeholder="请输入" type="number">
        <el-select v-model="form.bzqlx" slot="append" placeholder="请选择" style="width:100px">
          <el-option label="年" :value="1"></el-option>
          <el-option label="个月" :value="2"></el-option>
          <el-option label="天" :value="3"></el-option>
          <el-option label="小时" :value="4"></el-option>
        </el-select>
      </el-input>
      </el-form-item>
      <el-form-item label="产品介绍">
         <el-input type="textarea" v-model.trim="form.intRoduce" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入"  :maxlength="300" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imgList">
        <el-upload
          :limit="9"
          action="''"
          :auto-upload="true"
          :http-request="uploadImg"
          :before-upload="beforeAvatarUpload"
          name="clientFile"
          :file-list="form.imglists"
          :on-preview="handlePictureCardPreview"
          :before-remove="beforeRemove"
          multiple
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        备注：最多上传9张，支持jpg，png格式图片
      </el-form-item>
      <el-form-item label="备注">
         <el-input type="textarea"  :autosize="{ minRows: 4, maxRows: 10}" v-model.trim="form.bz" placeholder="请输入"  :maxlength="100" show-word-limit></el-input>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round  @click="closeForm(false)">取 消</el-button>
      </el-form-item>
      <!-- 图片预览 -->
      <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
        <img width="100%" :src="dialogImageUrl" alt>
      </el-dialog>
      <!-- 选择所属分类 -->
      <el-dialog
        title="选择所属分类"
        width="900px"
		    :append-to-body="true"
        :visible.sync="jcncpDialogVisable"
      >
        <sel-jcncp @selJcncp="selJcncp"></sel-jcncp>
      </el-dialog>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { exec } from 'common/tools'  
  import fetch from 'fetch/axios/'
  export default {
    data(){
        //使用了一个input没有的事件select  目的：只在最后提交之前触发客户名称是否存在的校验
      const ncpmcExist = (rule, value, callback)=>{
              var params ={
                ncpMc:this.form.ncpmc,
                scjyztId:this.userInfo.scjyztId
              }
              //edit
              if(this.oldncpmc && this.form.ncpmc ===this.oldncpmc ){
                callback();
              }
              this.$fetch.api_base.cpwh_exist(params).then((res)=>{
              if(res.bean==1){
                  callback(new Error('该农产品名称已存在'));
              }else{
                  callback();
              }
        })
      };
      const zlmc =  (rule, value, callback)=>{
        if(this.form.zlmc){
          callback();
        }else{
           callback(new Error());
        }
      }
      const commonValidate = {required: true, message: '必填项', trigger: ['blur','change']}
      return {
        disabled:false,
        oldncpmc:'',
        dwoptions:[
          {value: 1,label: '公斤'},
          {value: 2,label: '斤'},
          {value: 3,label: '克'},
          {value: 4,label: '头'},
          {value: 5,label: '只'},
          {value: 6,label: '条'},
          {value: 7,label: '包'},
          {value: 8,label: '袋'},
          {value: 9,label: '盒'},
          {value: 10,label: '箱'},
          {value: 11,label: '瓶'},
          {value: 12,label: '筐'},
          {value: 13,label: '个'},
          {value: 14,label: '枚'},
          {value: 15,label: '坛'},
          {value: 16,label: '罐'},
          {value: 17,label: '杯'},
          {value: 18,label: '件'},
        ],
        dialogVisible:false,
        dialogImageUrl:'',
        jcncpDialogVisable:false,
        rules:{
            ncpmc:[commonValidate,{validator:ncpmcExist,message:'该农产品名称已存在',trigger:'blur'}], 
            ggxh:commonValidate, 
            dwzl:commonValidate, 
            typeEcode:commonValidate,
            bzq:commonValidate, 
            zlmc:{required: true,validator:zlmc,message:'必填项',trigger:'blur'}
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                    ncpmc: '',
                    ggxh: '',
                    dw:'',
                    intRoduce: '',
                    goodsCode: '', 
                    bz: '',
                    jcncpId:'',
                    zlmc:'',
					bzq:'',
					bzqlx:1,
                    ncpEjZlmc:'',
                    ncpSjmc:'',
                    imglists:[],
                    attaUrl:'',
                    dwzl:'',
                }
            }
        },
        khtype:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
      this.oldncpmc=this.form.ncpmc
    },
    methods: {
      dwchange(value){
        var selItem = this.dwoptions.filter(item=>{ return item.value === value})
        this.form.dw = selItem[0].label;
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let { 
              jcncpId,
              ncpmc,
              ggxh,
              dw,
              intRoduce,
              goodsCode,
              bz,
			  bzq,
			  bzqlx,
              dwzl,
              attaUrl
            } = this.form;
            //用户参数
            let {qydm,ztdm,scjyztId,userId:cjr} = this.userInfo;
            let params =  {
              jcncpId,
              ncpmc,
              ggxh,
              dw,
              intRoduce,
              goodsCode,
              bz,
              scjyztId,
              ztdm,
              qydm,
              cjr,
              dwzl,
			  bzq,
			  bzqlx,
              pic:attaUrl
            }
            //编辑的时候传递的参数
            if(this.form.ztncpId){
              params.ztncpId = this.form.ztncpId;
            }else{
              params.sfky = 1;
            }
            this.$fetch.api_base.cpwh_save(params).then((res)=>{
              this.$message.success('操作成功！')
              this.closeForm(true);
              this.disabled=false;
            }).catch((res)=>{
               this.$message.error(res.errorMess)
               this.disabled=false;
            })
          } else {
            this.$message.error('请按要求填写')
            return false;
          }
        });
      },
	          querySearch(queryString, cb) {
        var options = [
          {value:'箱'},
          {value:'包'},
          {value:'盒'},
          {value:'袋'},
          {value:'公斤'},
          {value:'斤'},
        ];
        var results = queryString ? options.filter(item=>{return item.value.indexOf(queryString)>-1}) : options;
        results = results?results:[];
         cb(results);
      },
      beforeAvatarUpload(file){
            const isJPG = file.type==='image/jpeg' || file.type==='image/jpg' ||  file.type==='image/png';
            const isLt3M = file.size / 1024 / 1024 < 3;
            if(!isJPG){
                this.$message.error('请上传图片格式为JPG、JPEG或者JNP！')
            }
            if(!isLt3M){
               this.$message.error('图片大小不能超过3M！')   
            }
             return isJPG && isLt3M;
      },
        //上传图片
      uploadImg(item,picType){
            let formData = new FormData();
            formData.append("clientFile", item.file);
            var query =  {
              url:'/utilmodel/uploadFile/',
              method:'upload',
              data:formData
            }
            fetch(query).then(res=>{
                this.addImg(res);
                this.$message.success('操作成功！')
            })
        }, 
      closeForm(fresh=false){
        this.$emit("closeForm",fresh);
      },
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
           beforeRemove(file,fileList){
        console.log('删除之前');
        var delIndex = fileList.findIndex(item=>{return item.url===file.url});
        var attaUrl = this.form.attaUrl.split(',');
        attaUrl.splice(delIndex,1);
        this.form.attaUrl=attaUrl.join(',');
        return true;
      },

      //上传图片成功
      addImg(response){
        this.form.attaUrl = this.form.attaUrl!=""? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      //类别选择好后，填充到页面
      selJcncp(row){
        this.jcncpDialogVisable=false;
        this.form.jcncpId = row.ncpId; 
        this.form.zlmc = row.ncpZlmc;
        this.form.ncpEjZlmc = row.ncpEjZlmc;
        this.form.ncpSjmc = row.ncpMc;
        this.$refs.form.validateField('zlmc');
      }
    }
  }
</script>

<style>
.cpwh .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.cpwh .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
</style>



