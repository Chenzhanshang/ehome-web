<template>
  <el-container>
      <el-main  class="c">
        <el-divider>小区信息</el-divider>
            <el-card class="box-card">
                <div class="text item">
                地区名：{{applyInfo.community.region.fullName}}
                </div>
                <div class="text item">
                小区名：{{applyInfo.community.communityName}}
                </div>
                <div class="text item">
                楼栋名：{{applyInfo.house.houseName}}
                </div>
                <div class="text item">
                房间名：{{applyInfo.room.roomName}}
                </div>
            </el-card>
        <el-divider>业主信息</el-divider>
            <el-card class="box-card">
                <div class="text item">
                业主名：{{applyInfo.owner.ownerName}}
                </div>
                <div class="text item">
                业主身份证号：{{applyInfo.owner.ownerIdNumber}}
                </div>
            </el-card>
        <el-divider>文件列表</el-divider>
            <el-card class="box-card">
                <div v-for="(item,index) in applyInfo.files" :key="item.fileId" class="text item">
                    文件{{index}}:<el-link  target="_blank">{{item.fileName}} </el-link><el-button @click="downloadFile(item.fileId,item.fileName)" size="mini" >下载</el-button>
                </div>
            </el-card>
      </el-main>


      <el-aside width="450px" style="margin-top:40px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="审批人" prop="adminName" style="margin-top:40px" >
                <el-input v-model="form.adminName" placeholder="请输入审批人名"></el-input>
            </el-form-item>

            <el-form-item label="审批结果" style="margin-top:60px; text-align:center">
                <el-radio-group v-model="form.auditState">
                    <el-radio label="1" >通过申请</el-radio>
                    <el-radio label="0" >拒绝申请</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审批意见" prop="auditInfo" style="margin-top:60px" >
                <el-input type="textarea" v-model="form.auditInfo" placeholder="请输入审批意见"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:60px; text-align:center">
                <el-button type="primary" @click="openSubmitWindow()">提交</el-button>
            </el-form-item>
        </el-form>
      </el-aside>


  </el-container>
</template>

<script>
export default {
    data() {
        return {
            applyId:'',
            applyInfo:{
                applyId:'',
                community:{
                    communityId:'',
                    ommunityName:'',
                    region:{
                        regionId:'',
                        fullName:''
                    }
                },
                house:{
                    houseId: '',
                    houseName: ''
                },
                room:{
                    roomId:'',
                    roomName:''
                },
                owner:{
                    ownerId:'',
                    ownerIdNumber:'',
                    ownerName:''
                },
                files:[],      
            },
            form: {
                adminName: '',
                auditState: "1",
                auditInfo: '',
                },

             rules: {
                adminName: [
                    {required: true, message: '处理人不能为空', trigger: 'blur'}
                ],
                auditInfo: [
                    {required: true, message: '审批意见不能为空', trigger: 'blur'}
                ]
            }
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

        onSubmit(){
            console.log(this.form)
            this.axios.post("/audit/dispose",{
                adminName: this.form.adminName,
                auditState: this.form.auditState,
                auditInfo: this.form.auditInfo,
                applyId: this.applyId
            }).then((res)=>{
                this.$message({
                type: 'success',
                message:res.data.msg
                });
                this.$router.push({path:'/home/examineList'})
            })
            .catch((res)=>{
                this.$message({
                    type: 'eroor',
                    message:res.data.msg
                })   
            })
        },

        //提交处理对话框
        openSubmitWindow() {
            this.$confirm('处理该申请？该操作不可逆, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.onSubmit()
        
          }).catch(() => {  

          })
        }
    },
    created() {
        //取出缓存中的appid
        this.applyId = JSON.parse(sessionStorage.getItem('waitHandleApplyId'))
        //请求后台数据
        this.axios.get('admin/getApply/'+this.applyId)
        .then((res)=>{
            console.log(res)
            this.applyInfo = res.data.data.applyInfo
        })
        .catch((res)=>{

        })

    },
}
</script>

<style scoped>
    .c{
       box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
  .text {
    font-size: 14px;
  }

  .item {
    padding: 8px 0;
  }

  .box-card {
    width: 100%;
  }
</style>