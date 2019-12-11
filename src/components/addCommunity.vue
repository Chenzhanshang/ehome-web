<template>
    <el-container >
        <el-header class="right">
            <el-button type="text" icon="el-icon-info" @click="attentionDialogVisible = true">注意事项</el-button>
            <el-button  type="success" @click="addCommunityFormVisible = true">添加小区</el-button>
        </el-header>
        
        <el-main>
            <el-dialog
            title="注意事项"
            :visible.sync="attentionDialogVisible"
            width="50%">
            <p>1、在此页面您可以查询系统中已存在的小区列表以及他们的信息</p>
            <p>2、在此页面您可以添加一个新的小区并设置它的基本信息</p>
            <p>3、您可以点击修改按钮来修改对应的小区的信息</p>
            <p>4、您可以点击删除按钮来删除一个已存在的小区（注意：若小区中<span class="text-color-red">存在楼栋</span>则无法删除该小区。）</p>
            <span slot="footer" class="dialog-footer">
                <el-button type="text" @click="displayAttention">不在显示</el-button>
                <el-button type="primary" @click="attentionDialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
        <!-- 添加小区的输入对话框 -->
        <el-dialog title="输入小区信息" :visible.sync="addCommunityFormVisible">
        <el-form :model="form">
            <el-form-item label="小区名" :label-width="formLabelWidth">
            <el-input v-model="form.communityName" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="小区信息" :label-width="formLabelWidth">
            <el-input v-model="form.communityInfo" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属地区" :label-width="formLabelWidth">
                <el-cascader
                placeholder="试试搜索"
                :options="options"
                filterable
                :clearable=true
                @change="selected">
                </el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="clearCommunityInfo">取 消</el-button>
            <el-button type="primary" @click="addCommunity" :loading="addCommunityIsload">确 定</el-button>
        </div>
        </el-dialog>
        <!-- 添加房间的输入框 -->
        <el-dialog title="输入房间信息" :visible.sync="addRoomFormVisible">
            <el-form :model="room">
                <el-form-item label="房间名" :label-width="formLabelWidth">
                <el-input v-model="room.roomName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属楼栋" :label-width="formLabelWidth">
                <el-select v-model="room.house.houseId" clearable placeholder="请选择">
                    <el-option
                    v-for="item in houseList"
                    :key="item.houseId"
                    :label="item.houseName"
                    :value="item.houseId">
                    </el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearRoomInfo">取 消</el-button>
                <el-button type="primary" @click="toAddRoom" :loading="addRoomIsload">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改小区信息 -->
        <el-dialog title="修改小区信息" :visible.sync="updateCommunityFormVisible">
            <el-form :model="preUpdateCommuntiy">
                <el-form-item label="小区名" :label-width="formLabelWidth">
                    <el-input v-model="preUpdateCommuntiy.communityName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="小区信息" :label-width="formLabelWidth">
                    <el-input v-model="preUpdateCommuntiy.communityInfo" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属地区" :label-width="formLabelWidth">
                <el-cascader
                    placeholder="试试搜索"
                    :options="options"
                    v-model="preUpdateCommuntiy.region.regionId"
                    filterable
                    :clearable=true
                    @change="setpreUpdateCommuntiyRegion">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="clearUpdateCommunityFormVisible">取 消</el-button>
                <el-button type="primary" @click="updateCommunityCommit" :loading="updateCommunityLoad">确 定</el-button>
            </div>
        </el-dialog>

    <!-- 表格 -->
    <el-table
      :data="showList"
      style="width: 100%"
      height="530">
          <el-table-column
      type="index"
      label="序号"
      width="50">
    </el-table-column>
            <el-table-column
        prop="communityName"
        label="小区名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="communityInfo"
        label="小区信息"
        width="180">
      </el-table-column> 
    <el-table-column
        prop="region.fullName"
        label="所属街道">
      </el-table-column>
      <el-table-column
      align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template slot-scope="scope" >
        <el-button
          size="mini"
          @click="addHouse(scope.$index, scope.row)">添加楼栋</el-button>
        <el-button
          size="mini"
          @click="addRoom(scope.$index, scope.row)">添加房间</el-button>
          <el-button
          size="mini"
          type="warning"
          plain
          @click="selectCommunityInfo(scope.$index, scope.row)">查看</el-button>
        <el-button
          size="mini"
          type="warning"
          plain
          @click="updateCommunity(scope.$index, scope.row)">修改</el-button>
        <el-button
          size="mini"
          type="danger"
          plain
          @click="deleteCommunity(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
</el-main>
    </el-container>

</template>

<script>
export default {
    computed:{
        showList:function(){
            return this.communityList.filter((item)=>{
                if(item.communityName.includes(this.search)||item.communityInfo.includes(this.search)||(item.region!= null && item.region.fullName.includes(this.search))){
                    return item;
                }
            })
        }
    },
    data() {
        return {
            attentionDialogVisible:false,
            updateCommunityFormVisible:false,
            updateCommunityLoad:false,
            addCommunityIsload:false,
            addRoomIsload:false,
            addCommunityFormVisible: false,
            addRoomFormVisible:false,
            form: {
                communityName:'',
                communityInfo:'',
                region:{
                    regionId:'',
                }
            },
            room:{
                roomName:'',
                house:{
                    houseId:''
                }
            },
            formLabelWidth: '120px',
            options:[],
            communityList:[],
            search:'',
            houseList:[],
            preUpdateCommuntiy:{
                communityId:'',
                communityName:'',
                communityInfo:'',
                region:{
                    regionId:'',
                }
            }
        }
    },
    methods: {
        //不在显示注意事项
        displayAttention(){
            localStorage.setItem("showAttention",JSON.stringify(false))
            this.attentionDialogVisible = false
        },
        setpreUpdateCommuntiyRegion(e){
            console.log(e)
            if(e.length==4){
                this.preUpdateCommuntiy.region.regionId = e[3]
            }
            else{
                this.preUpdateCommuntiy.region.regionId = null
            }
        },
        updateCommunityCommit(){
            this.updateCommunityLoad = true
            console.log(this.preUpdateCommuntiy)
            this.axios.post('admin/updateCommunity',this.preUpdateCommuntiy)
            .then((res)=>{
                    if(res.data.status == 0){
                        //显示消息
                        this.$message({
                            type: 'success',
                            message: res.data.msg
                        });
                        this.loadCommunityList()
                    }else{
                        //显示消息
                        this.$message({
                            type: 'error',
                            message: res.data.msg
                        });
                    }
                    this.updateCommunityLoad = false
                    this.updateCommunityFormVisible = false
            })
            .catch((res)=>{
                this.$message({
                    type: 'warning',
                    message: "请求修改小区信息失败"
                });  
                 this.updateCommunityLoad = false 
            })
        },
        clearUpdateCommunityFormVisible(){
            this.preUpdateCommuntiy.communityId = ''
            this.preUpdateCommuntiy.communityName = ''
            this.preUpdateCommuntiy.communityInfo = ''
            this.preUpdateCommuntiy.region.regionId = ''
            this.updateCommunityFormVisible = false

        },
        updateCommunity(index,row){
            console.log(row)
            this.updateCommunityFormVisible = true
            this.preUpdateCommuntiy.communityId = row.communityId
            this.preUpdateCommuntiy.communityName = row.communityName
            this.preUpdateCommuntiy.communityInfo = row.communityInfo
            this.preUpdateCommuntiy.region.regionId = row.region.regionId

            console.log(this.preUpdateCommuntiy)
        },
        deleteLocalCommunityData(communityId){
            this.communityList.forEach((item,index)=>{
            if(item.communityId == communityId){
                this.communityList.splice(index,1)
                return;
            }
            })
        },
        deleteCommunity(index,row){
            this.$confirm('此操作将删除该楼栋, 是否继续?注意若楼栋中存在房间则无法删除楼栋!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/admin/deleteCommunity',{communityId:row.communityId})
          .then((res)=>{
              if(res.data.status==0){
                //修改本地数据
                  this.deleteLocalCommunityData(row.communityId)
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
                    message: "请求删除小区失败"
                  });   
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
        },
        selectCommunityInfo(index,row){
            console.log(index,row)
            sessionStorage.setItem('communityInfo',JSON.stringify(row))
            this.$router.push({name:'communityInfo'})
        },
        //清空输入的房间信息
        clearRoomInfo(){
            this.room.roomName = ''
            this.room.house.houseId = ''
            this.addRoomFormVisible = false

        },
        toAddRoom(){
            this.addRoomIsload = true
            console.log(this.room)
            this.axios.post('/admin/addRoom',this.room)
            .then((res)=>{
                console.log(res)
                if(res.data.status == 0){
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
                
                this.addRoomIsload = false
                this.addRoomFormVisible = false
                this.clearRoomInfo()
            })
            .catch((res)=>{
                this.$message({
                    type: 'warning',
                    message: "请求添加房间失败"
                }); 
            })
        },
        //添加房间
        addRoom(index,row){
            //获取楼栋信息
            this.axios.get('/admin/houseList/' + row.communityId)
            .then((res)=>{
                if(res.data.status == 0){
                    this.houseList = res.data.data.houseList
                    //显示添加表单
                    this.addRoomFormVisible = true
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
                        message: "请求获取楼栋列表失败"
                    }); 
            })
        },
        //添加楼栋
        addHouse(index,row){
        this.$prompt('请输入楼栋', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
                this.axios.post("/admin/addHouse",{houseName:value,community:{communityId:row.communityId}})
                .then((res)=>{
                    if(res.data.status == 0){
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
                        message: "请求添加楼栋失败"
                    }); 
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
        console.log(index, row);
        },
        //过滤地区
        selected(e){
            console.log(e)
            if(e.length==4){
            this.form.region.regionId = e[3]
            }
            console.log(this.form.region.regionId)
        },
        clearCommunityInfo(){
            this.form.communityName = '',
            this.form.communityInfo = '',
            this.form.region.regionId = '',
            this.addCommunityFormVisible = false
        },
        //添加小区
        addCommunity(){
            this.addCommunityIsload = true
            this.axios.post("/admin/addCommunity",this.form)
            .then((res)=>{
                if(res.data.status == 0){
                    this.communityList.push(res.data.data.dbData)
                    this.$message({
                        type:'success',
                        message:res.data.msg
                    });
                }
                else{
                    this.$message({
                        type:'error',
                        message:res.data.msg
                    });
                }
                this.addCommunityIsload = false
                this.addCommunityFormVisible = false
                
            })
            .catch((res)=>{

                this.$message({
                    type:'warning',
                    message:"请求添加小区失败"
                });
            })
        },
        //加载地区信息
        loadRegion(){
            this.axios.get("/admin/regionList")
            .then((res)=>{
                if(res.data.status == 0){
                    this.options = res.data.data.regionList
                    this.$message({
                        type:'success',
                        message:res.data.msg
                    });
                }
                else{
                    this.$message({
                        type:'error',
                        message:res.data.msg
                    });
                }
            })
            .catch((res)=>{
                this.$message({
                        type:'warning',
                        message:"请求加载地区信息失败"
                    });
            })
        },
        //加载小区列表
        loadCommunityList(){
            this.axios.get("/admin/communityList")
            .then((res)=>{
                console.log(res);
                if(res.data.status == 0){
                    this.communityList = res.data.data.communityList
                    this.$message({
                        type:'success',
                        message:res.data.msg
                    });
                }
                else{
                    this.$message({
                        type:'error',
                        message:res.data.msg
                    });
                }
            })
            .catch((res)=>{
                this.$message({
                        type:'warning',
                        message:"请求加载小区列表失败"
                    });
            })
        }

    },
    created() {
        this.loadRegion()
        this.loadCommunityList()
        this.attentionDialogVisible = JSON.parse(localStorage.getItem("showAttention"))
    }, 
}
</script>

<style scoped>
    .right{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content:flex-end;
    }
    .text-color-red{
        color: red;
    }
</style>