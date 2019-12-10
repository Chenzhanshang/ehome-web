<template>
    <el-container >
        <el-header class="right">
            <el-button  type="success" @click="addCommunityFormVisible = true">添加小区</el-button>
        </el-header>
        
        <el-main>
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

        <el-dialog title="收货地址" :visible.sync="addRoomFormVisible">
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

    <!-- 表格 -->
    <el-table
      :data="showList"
      style="width: 100%">
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
      <template slot="header" >
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template slot-scope="scope">
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
          @click="handleEdit(scope.$index, scope.row)">查看</el-button>
        <el-button
          size="mini"
          type="warning"
          plain
          @click="handleEdit(scope.$index, scope.row)">修改</el-button>
        <el-button
          size="mini"
          type="danger"
          plain
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
                if(item.communityName.includes(this.search)||item.communityInfo.includes(this.search)||item.region.fullName.includes(this.search)){
                    return item;
                }
            })
        }
    },
    data() {
        return {
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
            houseList:[]
        }
    },
    methods: {
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
                this.$message({
                    type: 'success',
                    message: res.data.msg
                });
                this.addRoomIsload = false
                this.addRoomFormVisible = false
                this.clearRoomInfo()
            })
            .catch((res)=>{
                this.$message({
                    type: 'error',
                    message: res.data.msg
                }); 
            })
        },
        //添加房间
        addRoom(index,row){
            //获取楼栋
            this.axios.get('/admin/houseList/' + row.communityId)
            .then((res)=>{
                this.houseList = res.data.data.houseList
                //显示添加表单
                this.addRoomFormVisible = true
            })
            .catch((res)=>{
                console.log("1111");
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
                    console.log(res)
                    this.$message({
                        type: 'success',
                        message: res.data.msg
                    });     
                })
                .catch((res)=>{
                    console.log(res)
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
            this.form.region.regionId = e[3]
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
                console.log(res)
                this.addCommunityIsload = false
                this.addCommunityFormVisible = false
                if(res.data.data.dbData != null){
                    this.communityList.push(res.data.data.dbData)
                }
                this.$message({
                    message:res.data.msg
                });
            })
            .catch((res)=>{
                console.log(res)
                this.addCommunityIsload = false
                this.$message({
                    message:res.data.msg
                });
            })
        },
        //加载地区信息
        loadRegion(){
            this.axios.get("/admin/regionList")
            .then((res)=>{
                console.log(res);
                if(res.data.status == 0){
                    this.options = res.data.data.regionList
                }
                else{
                    this.$message({
                        message:res.data.msg
                    });
                }
            })
            .catch((res)=>{
                console.log(res);
            })
        },
        //加载小区列表
        loadCommunityList(){
            this.axios.get("/admin/communityList")
            .then((res)=>{
                console.log(res);
                if(res.data.status == 0){
                    this.communityList = res.data.data.communityList
                }
                else{
                    this.$message({
                        message:res.data.msg
                    });
                }
            })
            .catch((res)=>{
                console.log(res);
            })
        }

    },
    created() {
        this.loadRegion()
        this.loadCommunityList()
    }, 
}
</script>

<style scoped>
    .right{
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content:flex-end;
    }
</style>