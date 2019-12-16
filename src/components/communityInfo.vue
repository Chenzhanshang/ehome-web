<template>
  <el-container>
      <el-header>
          {{info.region.fullName}}:{{info.communityName}}
      </el-header>
      <main >
      <el-tabs v-model="activeName" @tab-click="handleClick" :tab-position="'left'" style="height: 500px;" >
        <el-tab-pane label="操作教程" name="first">
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="功能介绍" name="1">
                <div>您可以在此页面操作小区的楼栋和房间结构</div>
                <div>包括：查询小区的楼栋、查询小区的房间、修改楼栋名称、修改房间名称、删除楼栋、删除房间</div>
              </el-collapse-item>
              <el-collapse-item title="关于楼栋的操作看这" name="2">
                <div>搜索：在表格的右上角可以按照关键字进行搜索（只要楼栋名称包含关键字则能进行检索，无需输入完整楼栋名称）</div>
                <div>修改：点击修改按钮您可以修改楼栋信息（只能修改楼栋名称）</div>
                <div>删除：点击删除按钮您可以删除该楼栋（注意：楼栋中若<span class="text-color-red">包含房间</span>则无法删除）</div>
              </el-collapse-item>
              <el-collapse-item title="关于房间的操作看这" name="3">
                <div>搜索：在表格的右上角可以选择下拉菜单来按照楼栋查看房间</div>
                <div>修改：点击修改按钮您可以修改房间信息（只能修改房间名称）</div>
                <div>删除：点击删除按钮您可以删除该房间（注意：若该房间处于<span class="text-color-red">业主认证阶段</span>或<span class="text-color-red">业主已认证</span>则无法删除）</div>
              </el-collapse-item>
            </el-collapse>
        </el-tab-pane>
        <el-tab-pane label="楼栋管理" name="second">
            <el-table
            :data="showHouseList"
            style="width: 60%"
            height="500">
            <el-table-column
              type="index">
            </el-table-column>
          <el-table-column
              prop="community.communityName"
              label="小区名"
              width="280">
            </el-table-column>
            <el-table-column
              prop="houseName"
              label="楼栋名"
              width="180">
            </el-table-column>
            <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-input
                v-model="search"
                size="mini"
                placeholder="输入关键字搜索"/>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="updateHouse(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteHouse(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="房间管理" name=" three">
          <el-table
            :data="showRoomList"
            style="width: 60%"
            height="500">
            <el-table-column
              type="index">
            </el-table-column>
          <el-table-column
              prop="house.houseName"
              label="楼栋名"
              width="180">
            </el-table-column>
           <el-table-column
              prop="roomName"
              label="房间名"
              width="180">
            </el-table-column>
            <el-table-column
              label="房间状态"
              width="180">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.owner == null ? 'warning' : 'success'"
                  disable-transitions>{{scope.row.owner== null ? '未认证' : '已认证'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
                <el-select v-model="value" size="mini" clearable placeholder="请选择楼栋过滤">
                <el-option
                  v-for="item in houseList"
                  :key="item.houseId"
                  :label="item.houseName"
                  :value="item.houseId">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                plain
                @click="updateRoom(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="deleteRoom(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="录入候选人" name=" four">

          <el-table
          :data="candidateList"
          style="width: 100%">
          <el-table-column
            label="序号"
            type="index">
          </el-table-column>
          <el-table-column
            label="候选人姓名"
            prop="owner.ownerName">
          </el-table-column>
          <el-table-column
            label="所得票数"
            prop="candidatePoll">
          </el-table-column>
          <el-table-column
            label="创建时间"
            prop="candidateCreateTime">
          </el-table-column>
          <el-table-column
            align="right">
            <template slot="header" slot-scope="scope">
              <el-button type="primary" @click="addCandidateDialogVisible = true">添加候选人</el-button>
            </template>
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)" plain="">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="添加候选人"  :visible.sync="addCandidateDialogVisible">
          <el-transfer v-model="value" :data="transferList"></el-transfer>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCandidateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCandidate">确 定</el-button>
          </div>
        </el-dialog>
        </el-tab-pane>
    </el-tabs>
  </main>
  </el-container>
</template>

<script>
export default {
  computed:{
    showHouseList:function(){
      return this.houseList.filter((item)=>{
        if(item.houseName.includes(this.search)){
          return item
        }
      })
    },
    showRoomList:function(){
      return this.roomList.filter((item)=>{
        if(item.house.houseId.includes(this.value)){
          return item
        }
      })
    },
    transferList:function(){
      const data = [];
        for(let i = 0;i<this.ownerList.length;i++){
            data.push({
              key:this.ownerList[i].ownerId,
              label:this.ownerList[i].ownerName,
              disabled:this.atlist(this.ownerList[i].ownerId)
            })
        }
        console.log(data)
        return data;
    }
  },
  data() {
        return {
            value: [],
            addCandidateDialogVisible:false,
            activeNames: ['1','2','3'],
            search:'',
            activeName: 'first',
            info:'',
            houseList:[],
            roomList:[],
            ownerList:[],
            candidateList:[],
            value:''
        }
    },
    methods: {
      getOwnerList(communityId){
        this.axios.get("/admin/ownerList/"+communityId)
        .then((res)=>{
          console.log(res)
          if(res.data.status == 0){
            this.ownerList = res.data.data.ownerList;
            this.$message({
              type:"success",
              message:res.data.msg
            })
          }
          else{
            this.$message({
              type:"error",
              message:res.data.msg
            })
          }
            
        })
        .catch((res)=>{
          this.$message({
              type:"warning",
              message:"请求业主数据失败"
          })
        })
      },
      atlist(ownerId){
          this.candidateList.forEach((item)=>{
            if(ownerId === item.ownerId){
              return true
            }
          })
          return false
      },
      addCandidate(){
        console.log(this.value)
        this.addCandidateDialogVisible = false
      },
      handleChange(val) {
        console.log(val);
      },
      deleteLocalHouseData(houseId){
        this.houseList.forEach((item,index)=>{
          if(item.houseId == houseId){
              this.houseList.splice(index,1)
              return;
          }
        })
      },
      deleteHouse(index,row){
        this.$confirm('此操作将删除该楼栋, 是否继续?注意若楼栋中存在房间则无法删除楼栋!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/admin/deleteHouse',{houseId:row.houseId})
          .then((res)=>{
              if(res.data.status==0){
                //修改本地数据
                  this.deleteLocalHouseData(row.houseId)
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });   
              }else{
                  this.$message({
                    type: 'error',
                    message: res.data.msg
                  });
              }
          })
          .catch((res)=>{
            this.$message({
              type: 'warning',
              message: "请求删除楼栋失败"
            });   
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      deleteLocalRoomData(roomId){
        this.roomList.forEach((item,index)=>{
          if(item.roomId == roomId){
              this.roomList.splice(index,1)
              return;
          }
        })
      },
      deleteRoom(index,row){
        this.$confirm('此操作将删除该房间, 是否继续?注意如果该房间已被业主认证过，此操作会将该业主的认证信息一起删除!,请谨慎操作', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //如果被认证过
          if(row.owner != null){
            this.$message({
                type: 'warning',
                message: "该房间已被认证无法删除"
              });
              return;
          }
          this.axios.post('/admin/deleteRoom',{roomId:row.roomId})
          .then((res)=>{
              if(res.data.status==0){
                //修改本地数据
                  this.deleteLocalRoomData(row.roomId)
                  this.$message({
                    type: 'success',
                    message: res.data.msg
                  });   
              }
              else{
                this.$message({
                    type: 'error',
                    message: res.data.msg
                  });   
              }
          })
          .catch((res)=>{
            this.$message({
                type: 'error',
                message: "请求删除房间失败"
              });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        
      },
      updateLocalRoomData(roomId,roomName){
        this.roomList.forEach((item)=>{
          if(item.roomId===roomId){
            item.roomName = roomName
          }
        })
      },
      updateRoom(index,row){
        console.log(index,row);
            this.$prompt('请输新的房间名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:/\S/,
                inputErrorMessage: '房间名不能为空'
              }).then(({ value }) => {
                this.axios.post('/admin/updateRoom',{roomId:row.roomId,roomName:value})
                .then((res)=>{
                    if(res.data.status==0){
                      //修改本地数据
                        this.updateLocalRoomData(row.roomId,value)
                        this.$message({
                          type: 'success',
                          message: res.data.msg
                        });   
                    }
                    else{
                      this.$message({
                          type: 'error',
                          message: res.data.msg
                        });   
                    }
                })
                .catch((res)=>{
                  this.$message({
                          type: 'error',
                          message: "请求修改房间信息失败"
                        });   
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });       
              });
      },
      updateLocalHouseData(houseId,houseName){
        this.houseList.forEach((item)=>{
          if(item.houseId===houseId){
            item.houseName = houseName
          }
        })
      },
      //修改楼栋名
        updateHouse(index,row){
            console.log(index,row);
            this.$prompt('请输新的楼栋名', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern:/\S/,
                inputErrorMessage: '楼栋名不能为空'
              }).then(({ value }) => {
                this.axios.post('/admin/updateHouse',{houseId:row.houseId,houseName:value})
                .then((res)=>{
                    if(res.data.status==0){
                      //修改本地数据
                        this.updateLocalHouseData(row.houseId,value)
                        this.$message({
                          type: 'success',
                          message: res.data.msg
                        });   
                    }
                    else{
                      this.$message({
                          type: 'error',
                          message: res.data.msg
                        });   
                    }
                })
                .catch((res)=>{
                  this.$message({
                          type: 'error',
                          message: "请求修改楼栋信息失败"
                        });   
                })
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消输入'
                });       
              });
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
        //获取房间列表
        getRoom(communityId){
          this.axios.get('/admin/roomList/'+communityId)
            .then((res)=>{
              console.log(res)
              if(res.data.status==0){
                this.roomList = res.data.data.roomList
                this.$message({
                    type: 'success',
                    message: res.data.msg
                });
              }
              else{
                this.$message({
                    type: 'error',
                    message: res.data.msg
                });
              }

            })
            .catch((res)=>{
              this.$message({
                    type: 'warning',
                    message: "请求获取房间列表失败"
                });
            })
        },
        //获取楼栋列表
        getHouse(communityId){
            this.axios.get('/admin/houseList/'+communityId)
            .then((res)=>{
              console.log(res)
              if(res.data.status==0){
                this.houseList = res.data.data.houseList
                this.$message({
                    type: 'success',
                    message: res.data.msg
                });
              }
              else{
                this.$message({
                    type: 'error',
                    message: res.data.msg
                });
              }

            })
            .catch((res)=>{
              this.$message({
                    type: 'warning',
                    message: "请求获取楼栋列表失败"
                });
            })
        },
        getCandidateList(communityId){
          this.axios.get("/admin/candidateList/"+communityId)
          .then((res)=>{
            if(res.data.status == 0){
              console.log(res)
              this.candidateList = res.data.data.candidateList

              this.$message({
                type:'success',
                message:res.data.msg
              })
            }
            else{
              this.$message({
                type:'error',
                message:res.data.msg
              })
            }
          })
          .catch((res)=>{
            this.$message({
              type:'warning',
              message:'请求候选人列表失败'
            })
          })

        }
    },
    created() {
        //从缓存中获取信息
        this.info = JSON.parse(sessionStorage.getItem('communityInfo'))
        this.getHouse(this.info.communityId)
        this.getRoom(this.info.communityId)
        this.getCandidateList(this.info.communityId)
        this.getOwnerList(this.info.communityId)
    },
}
</script>

<style scoped>
  .text-color-red{
    color: red;
  }
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 480px;
  }
</style>