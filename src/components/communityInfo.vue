<template>
  <el-container>
      <el-header>
          {{info.region.fullName}}
      </el-header>
      <main >
      <el-tabs v-model="activeName" @tab-click="handleClick" :tab-position="'left'" style="height: 500px;" >
        <el-tab-pane label="楼栋管理" name="first">
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
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="房间管理" name="second">
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
              width="280">
            </el-table-column>
           <el-table-column
              prop="roomName"
              label="房间名"
              width="180">
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
                @click="handleEdit(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                plain
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
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
    }
  },
  data() {
        return {
            search:'',
            activeName: 'first',
            info:'',
            houseList:[],
            roomList:[],
            value:''
        }
    },
    methods: {
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
              }
              else{
                this.$message({
                    type: 'success',
                    message: res.data.msg
                });
              }

            })
            .catch((res)=>{
              this.$message({
                    type: 'success',
                    message: res.data.msg
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
              }
              else{
                this.$message({
                    type: 'success',
                    message: res.data.msg
                });
              }

            })
            .catch((res)=>{
              this.$message({
                    type: 'success',
                    message: res.data.msg
                });
            })
        }
    },
    created() {
        //从缓存中获取信息
        this.info = JSON.parse(sessionStorage.getItem('communityInfo'))
        this.getHouse(this.info.communityId)
        this.getRoom(this.info.communityId)
    },
}
</script>

<style>

</style>