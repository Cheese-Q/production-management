<template>

  <div class="main-info">
    <div class="subtitle">基本信息</div>
    <div class="baseinfo">
      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>主体名称</div>
        <div class="f-f1"><span>{{infos.bizName}}</span></div>
      </div>
      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>社会统一代码</div>
        <div class="f-f1"><span>{{infos.icCreditCode}}</span></div>
      </div>
      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>主体地址</div>
        <div class="f-f1"><span>{{infos.bizAddress}}</span></div>
      </div>
      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>坐标</div>
        <div class="f-f1 f-df">
          <template v-if="edit">
            <input :class="reqiredKeys.xzb?'border-red':''" placeholder="请输入" class="f-f1" type="text"
                   v-model="infos.xzb"/>
            <span class="f-pr20 f-pl20">.</span>
            <input :class="reqiredKeys.yzb?'border-red':''" placeholder="请输入" class="f-f1" type="text"
                   v-model="infos.yzb"/>
          </template>
          <span v-else>{{infos.xzb}}<span class="f-pr20 f-pl20">.</span>{{infos.yzb}}</span>
        </div>
      </div>
      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>联系人</div>
        <div class="f-f1">
          <input :class="reqiredKeys.contPerson?'border-red':''" placeholder="请输入" v-if="edit"
                 v-model="infos.contPerson"/>
          <span v-else>{{infos.contPerson}}</span>
        </div>
      </div>
      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>联系电话</div>
        <div class="f-f1">
          <input :class="reqiredKeys.contNumber?'border-red':''" placeholder="请输入" v-if="edit"
                 v-model="infos.contNumber"/>
          <span v-else>{{infos.contNumber}}</span>
        </div>
      </div>
      <div class="f-df row" style="align-items: center;">
        <div class="title cell" style="border: none;">经营场所照片</div>
        <div class="f-f1 imgList">
          <template v-if="edit">
            <el-upload
              :limit="5"
              action="''"
              :auto-upload="true"
              :http-request="uploadImg1"
              name="clientFile"
              :file-list="products"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              multiple
              list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </template>
          <template v-else>
            <el-upload
              :limit="5"
              action="''"
              :auto-upload="true"
              :http-request="uploadImg1"
              name="clientFile"
              :file-list="products"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              multiple
              list-type="picture-card"
              disabled>
              <i class="el-icon-plus"></i>
            </el-upload>
          </template>
          <div>注：图片支持的格式：JPG,PNG！图片不能大于1M，图片最多5张</div>
        </div>
      </div>

      <div class="f-df row">
        <div class="title" style="border-top: 1px solid #ececec;"><span class="must-icon">*</span>法人姓名</div>
        <div class="f-f1">
          <input :class="reqiredKeys.bizLegPerson?'border-red':''" placeholder="请输入" v-if="edit"
                 v-model="infos.bizLegPerson"/>
          <span v-else>{{infos.bizLegPerson}}</span>
        </div>
      </div>

      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>身份证号码</div>
        <div class="f-f1">
          <input :class="reqiredKeys.frsfz?'border-red':''" placeholder="请输入" v-if="edit"
                 v-model="infos.frsfz"/>
          <span v-else>{{infos.frsfz}}</span>
        </div>
      </div>

      <div class="f-df row">
        <div class="title"><span class="must-icon">*</span>法人电话</div>
        <div class="f-f1">
          <input :class="reqiredKeys.legalPerTel?'border-red':''" placeholder="请输入" v-if="edit"
                 v-model="infos.legalPerTel"/>
          <span v-else>{{infos.legalPerTel}}</span>
        </div>
      </div>

      <div class="f-df row" style="align-items: center;">
        <div class="title cell" style="border: none;">法人身份证</div>
        <div class="f-f1 imgList">
          <template v-if="edit">
              <el-upload
                :limit="2"
                action="''"
                :http-request="uploadImg2"
                :auto-upload="true"
                name="clientFile"
                :file-list="honors"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove2"
                multiple
                list-type="picture-card">
              <i class="el-icon-plus"></i>
            </el-upload>
          </template>
          <template v-else>
            <el-upload
              :limit="2"
              action="''"
              :auto-upload="true"
              :http-request="uploadImg2"
              name="clientFile"
              :file-list="honors"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove2"
              multiple
              list-type="picture-card"
              disabled>
              <i class="el-icon-plus"></i>
            </el-upload>
          </template>

          <!-- 图片预览 -->
          <el-dialog :visible.sync="dialogVisible" width="800px" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </div>
      </div>

    </div>
    <div class="baseinfo">

      <div class="f-tac f-mt30" v-if="!edit">
        <el-button @click="edit=!edit" type="primary" size="medium">修 改</el-button>
      </div>
      <div class="f-tac f-mt30" v-else>
        <el-button @click="submit" type="primary" size="medium">保 存</el-button>
        <el-button @click="edit=!edit" size="medium">取 消</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import { exec } from 'common/tools'
  import fetch from 'fetch/axios/'
  export default {
    data() {
      return {
        infos: {},
        edit: false,
        products: [],
        honors: [],
        dialogVisible: false,
        dialogImageUrl: '',
        attaUrl1: '',
        attaUrl2: '',
        pictypes: ['products', 'honors'],
        reqiredKeys: {
          'contNumber': false,
          'contPerson': false,
          'bizLegPerson': false,
          'frsfz': false,
          'legalPerTel': false
        }
      }
    },
    computed: {
      ...mapGetters({
        userInfo: 'getUserInfo',
      })
    },
    created() {
      this.getZtInfo();
    },
    methods: {
      getZtInfo() {
        var params = {bizId: this.userInfo.bizId};
        this.$fetch.api_base.ztxx_get(params).then((res) => {
          let infos = res.bean;
          this.infos = infos;
          let i=0;
          var url1 = "";
          infos.listTpb.forEach(item => {
            item.url = item.tpdz;
            if(i==0){
              url1 = item.url;
            }else{
              url1 = url1+","+item.url;
            }
            i++;
          })
          this.attaUrl1 = url1;
          this[this.pictypes[0]] = infos.listTpb;
          var hous=[];
          var url2="";
          if(infos.frsfzZm!=""){
            hous[0] = {url:infos.frsfzZm,name:infos.frsfzZm};
            url2 = infos.frsfzZm;
            if(infos.frsfzFm!=""){
              hous[1] = {url:infos.frsfzFm,name:infos.frsfzFm};
              if(url2!=""){
                url2 = ","+infos.frsfzFm;
              }else{
                url2 = infos.frsfzFm;
              }
            }
          }else{
            if(infos.frsfzFm!=""){
              hous[0] = {url:infos.frsfzFm,name:infos.frsfzFm};
              if(url2!=""){
                url2 = ","+infos.frsfzFm;
              }else{
                url2 = infos.frsfzFm;
              }
            }
          }
          this.attaUrl2 = url2;
          this[this.pictypes[1]] = hous;
        })
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 或者 PNG 格式!!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 1MB!');
        }
        return isJPG && isLt2M;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleRemove1(file, fileList) {
        var attaUrl = [];
        fileList.forEach(item => {
          attaUrl.push(item.url);
        })
        attaUrl = attaUrl.join(',')
        this.attaUrl1 = attaUrl;
      },
      handleRemove2(file, fileList) {
        var attaUrl = [];
        fileList.forEach(item => {
          attaUrl.push(item.url);
        })
        attaUrl = attaUrl.join(',')
        this.attaUrl2 = attaUrl;
      },
      //上传图片
      uploadImg1(item,picType){
        let formData = new FormData();
        formData.append("clientFile", item.file);
        var query =  {
          url:'/utilmodel/uploadFile/',
          method:'upload',
          data:formData
        }
        fetch(query).then(res=>{
          this.addImg1(res);
          this.$message.success('操作成功！')
        })
      },
      //上传图片
      uploadImg2(item,picType){
        let formData = new FormData();
        formData.append("clientFile", item.file);
        var query =  {
          url:'/utilmodel/uploadFile/',
          method:'upload',
          data:formData
        }
        fetch(query).then(res=>{
          this.addImg2(res);
          this.$message.success('操作成功！')
        })
      },
      addImg1(response, file) {
        this.attaUrl1 = this.attaUrl1 != "" ? this.attaUrl1 + "," + response.bean : response.bean;
      },
      addImg2(response, file) {
        this.attaUrl2 = this.attaUrl2 != "" ? this.attaUrl2 + "," + response.bean : response.bean;
      },

      submit() {
        let {
          bizId,
          bizName,
          bizProvince,
          bizCity,
          bizCounty,
          bizTown,
          bizAddress,
          bizType,
          bizCode,
          supplierType,
          icCreditCode,
          bizLegPerson,
          legalPerTel,
          contPerson,
          contNumber,
          bizCert,
          pestSaleLicense,
          bizLicense,
          comment,
          delFlag,
          createUserId,
          modifyUserId,
          frsfz,
          jyfw,
          xzb,
          yzb,
          brandNames,
        } = this.infos;
        let attaUrl1 = this.attaUrl1;
        let sfzdz = this.attaUrl2.split(",");
        let frsfzZm = sfzdz[0];
        let frsfzFm = sfzdz[1];
        let params = {
          bizId,
          bizName,
          bizProvince,
          bizCity,
          bizCounty,
          bizTown,
          bizAddress,
          bizType,
          bizCode,
          supplierType,
          icCreditCode,
          bizLegPerson,
          legalPerTel,
          contPerson,
          contNumber,
          bizCert,
          pestSaleLicense,
          bizLicense,
          comment,
          delFlag,
          createUserId,
          modifyUserId,
          frsfz,
          frsfzZm: frsfzZm,
          frsfzFm: frsfzFm,
          jyfw,
          xzb,
          yzb,
          tpdzs: attaUrl1,
          brandNames
        };
        //检验参数是否存在
        var isPass = true;
        for (var item in this.reqiredKeys) {
          if (!params[item]) {
            isPass = false;
            this.reqiredKeys[item] = true;
          } else {
            this.reqiredKeys[item] = false;
          }
        }
        if (!isPass) {
          this.$message.error('请按要求填写信息！');
          return
        }
        this.$fetch.api_base.ztxx_save(params).then(res => {
          this.$message.success('保存成功！')
          this.edit = !this.edit;
        }).catch(res => {
          this.$message.error('保存失败！');
          return false;
        })
      },

    }
  }
</script>

<style lang="scss" scoped>
  .baseinfo {
    border-top: 1px solid #ececec;
    border-left: 1px solid #ececec;
    line-height: 36px;

    .title {
      width: 200px;
      line-height: 40px;
      height: 40px;
      text-align: center;
    }

    .row > div {
      border-right: 1px solid #ececec;
      border-bottom: 1px solid #ececec;
    }

    .row span {
      padding-left: 10px;
    }
  }

  .subtitle {
    margin-bottom: 16px;
    font-weight: bold;
    color: #383838;
  }

  input, select {
    height: 40px;
    width: 100%;
    box-sizing: border-box;
    padding-left: 10px;
    background-color: rgba(247, 247, 247, 0.1);
  }

  .must-icon {
    font-size: 18px;
    color: red;
    padding-right: 3px;
  }

  .imgList {
    border-left: 1px solid #ececec;
    padding: 15px;
  }
</style>
<style lang="scss">
  .main-info .border-red {
    border-color: red;

    input {
      border-radius: 0 !important;
      border: 2px solid red !important;
    }
  }

</style>


