/*编辑*/
<template>
    <el-form ref="form" :model="form" label-width="100px" class="form" :rules="rules" status-icon>
      <div class="form-title f-fs18  f-tac f-mb30 f-mt30">{{form.id?'编辑':'新增'}}许可证信息</div>
      <el-form-item label="许可证" prop="zslx">
        <el-radio-group v-model="form.zslx">
          <el-radio :label="1">农药经营许可证</el-radio>
          <el-radio :label="2">兽药经营许可证</el-radio>
          <el-radio :label="3">肥料经营许可证</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效期">
        <el-date-picker
          v-model="yxq"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="经营单位" prop="jyfw">
        <el-input v-model="form.jyfw"  type="textarea" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="imgList">
        <el-upload
          :limit="9"
          action=""
          :auto-upload="true"
          :http-request="uploadImg"
          name="clientFile"
          :file-list="imglists"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :beforeUpload="beforeAvatarUpload"
          multiple
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
        注：图片支持的格式：JPG,PNG！图片不能大于5M，图片最多9张
        <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
          <img width="100%" :src="dialogImageUrl" alt>
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button round type="primary" @click=submitForm :disabled="disabled">{{disabled?'提交中':'提 交'}}</el-button>
        <el-button  round @click=closeForm>取 消</el-button>
      </el-form-item>
    </el-form>
</template>
<script>
  import { mapGetters } from 'vuex' 
  import { dateformat } from 'common/tools'
  import fetch from 'fetch/axios/'
  export default {
    data(){
			const commonValidate = {required: true, message: '必填项', trigger: 'blur'}
      return {
        disabled:false,
        dialogImageUrl: '',
        dialogVisible:false,
        yxq:'',
        imglists:[],
          rules:{
          zslx:commonValidate,
          jyfw:commonValidate,
        }
      }
    },
    props:{
        form:{
            type:Object,
            default:function(){
                return {
                  id:0,
                  zslx: '',
                  jyfw: '',
                  imgList:[],
                  attaUrl:'',
                }
            }
        }
    },
    computed:{
      ...mapGetters({
        userInfo:"getUserInfo"
      })
    },
    created(){
      var  start =this.form.ksyxq;
      var  end =this.form.jsyxq;
      if(start==''){
         start =dateformat.timeFormat(new Date());
         end =dateformat.timeFormat(new Date());
      }
      this.yxq = [start,end];
      this.getinfo();
    },
    methods: {
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            //防止二次提交
            this.disabled=true;
            //新增字段 
            let {id,zslx,jyfw,attaUrl} = this.form;
            //传值参数
            const searchDate = this.yxq;
            let params = {
              id:id==""?0:id,
              qyId:this.userInfo.bizId,
              ksyxq:searchDate[0],
              jsyxq:searchDate[1],
              zslx:zslx,
              jyfw:jyfw,
              tpdzs:attaUrl,
              zt:1
            };
            this.$fetch.api_base.xkz_save(params).then((res)=>{
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
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 或者 PNG 格式!!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isJPG && isLt2M;
      },
      handlePictureCardPreview(file){
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove(file, fileList) {
        var attaUrl=[];
        fileList.forEach(item=>{
          attaUrl.push(item.url);
        })
        attaUrl=attaUrl.join(',')
        this.form.attaUrl = attaUrl;
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
      //上传图片成功
      addImg(response, file){
        this.form.attaUrl = this.form.attaUrl!=""&&this.form.attaUrl!=undefined? this.form.attaUrl  +"," + response.bean:response.bean;
      },
      getinfo(){
        var attaUrl="";
        var params={
          id:this.form.id,
        };
        this.$fetch.api_base.xkz_get(params).then(res=>{
          res.bean.listTpb.forEach(item => {
            item.url = item.tpdz;
            item.name = item.tpmc;
            if(attaUrl===""){
              attaUrl =item.url;
            }else{
              attaUrl =attaUrl+","+item.url;
            }
          })
          this.form.attaUrl = attaUrl;
          this.imglists = res.bean.listTpb;
          console.log(this.imglists)
        }).catch(res=>{
        })
      }
    }
  }
</script>

