<template>
  <el-container>
    <el-header>
      <el-page-header @back="goBack" content="详情页面"></el-page-header>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="18">
          <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item title="审批信息" name="1">
              <div>审批人：<el-tag>{{leaveAudit.adminName}}</el-tag></div>
              <div>审批结果：<el-tag :type="leaveAudit.auditState==0?'error':'success'">{{leaveAudit.auditState==0?'未通过':'已通过'}}</el-tag></div>
              <div>审批时间：<el-tag>{{leaveAudit.auditDate |dateFormart}}</el-tag></div>
              <div>审批信息：<el-tag>{{leaveAudit.auditInfo}}</el-tag></div>
            </el-collapse-item>
            <el-collapse-item v-if="leaveAudit.apply!=null" title="申请信息" name="2">
                <div>申请时间：{{leaveAudit.apply.createTime |dateFormart}}</div>
                <div>最终结果：<el-tag :type="leaveAudit.apply.applyState==0?'error':'success'">{{leaveAudit.apply.applyState==0?'未通过':'已通过'}}</el-tag></div>
                <div v-if="leaveAudit.apply.owner!=null">
                  业主名：{{leaveAudit.apply.owner.ownerName}}
                </div>
                 <div v-if="leaveAudit.apply.owner!=null">
                  业主电话号码：{{leaveAudit.apply.owner.ownerPhone}}
                </div>
                <div v-if="leaveAudit.apply.house!=null">
                  楼栋名：{{leaveAudit.apply.house.houseName}}
                </div>
                <div v-if="leaveAudit.apply.room!=null">
                  房间名：{{leaveAudit.apply.room.roomName}}
                </div>
            </el-collapse-item>
            <el-collapse-item v-if="leaveAudit.apply!=null && leaveAudit.apply.files !=null" title="文件列表" name="3">
                <div v-for="(item,index) in leaveAudit.apply.files" :key="item.fileId">
                  文件{{index}}:{{item.fileName}}<el-button size="mini" @click="downloadFile(item.fileId,item.fileName)">下载</el-button>
                </div>
            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      leaveAudit:{
        auditId:'',
        adminName:'',
        auditState:'',
        auditDate:'',
        auditInfo:'',
        apply:{
          applyId:'',
          createTime:'',
          applyState:'',
          files:[],
          room:null,
          house:null,
          owner:null,
        }
      },
      activeNames: ['1']
    }
  },
  methods: {
    downloadFile(fileId,fileName){
        console.log(fileId)
        this.axios.post('admin/downloadFile/',{fileId:fileId},{
            responseType: 'blob'
        })
        .then((res)=>{
            console.log(res)
              if (window.navigator.msSaveBlob) {
                try {
                const blobObject = new Blob([res.data]);
                window.navigator.msSaveBlob(blobObject, fileName);
                } catch (e) {
                console.log(e);
                }
            } else {
                const blob = res.data;
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = (e) => {
                const a = document.createElement('a');
                a.download = fileName;
                a.href = e.target.result;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                }
            }

        })
        .catch((res)=>{
            console.log(res)
        })

    },
    handleChange(val) {
        console.log(val);
      },
    goBack() {
        console.log('go back');
        this.$router.go(-1);
      },
    getAuditInfo(auditId){
      this.axios.get('/audit/getAuditInfo/'+auditId)
      .then((res)=>{
        console.log(res)
        if(res.data.status == 0){
          this.leaveAudit = res.data.data.leaveAudit
        }
      })
      .catch((res)=>{

      })
    }
  },
  created() {
    var id = sessionStorage.getItem('historyExamineInfoId')
    if(id != null){
      this.getAuditInfo(id)
    }
  },
}
</script>

<style scoped>
  div{
    padding: 10px
  }
</style>