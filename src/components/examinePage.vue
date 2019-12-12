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
      <el-aside width="450px">Aside</el-aside>
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
                files:[]
            },
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