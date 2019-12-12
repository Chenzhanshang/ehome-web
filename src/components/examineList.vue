<template>
  <el-container >
      <el-main>
        <el-tabs v-model="activeName" @tab-click="handleClick" :tab-position="'left'" style="height: 600px;">
            <el-tab-pane label="认证申请" name="first">
                <el-table
                :data="authenticationList"
                height="600px"
                stripe
                style="width: 100%">
                <el-table-column
                type="index"
                label="序号"
                width="50">
                </el-table-column>
                <el-table-column
                prop="community.region.fullName"
                label="地区"
                width="350">
                </el-table-column>
                <el-table-column
                prop="community.communityName"
                label="小区名">
                </el-table-column>
                <el-table-column
                prop="house.houseName"
                label="楼栋">
                </el-table-column>
               <el-table-column
                prop="room.roomName"
                label="房间">
                </el-table-column>
                <el-table-column
                prop="room.roomName"
                label="申请时间">
                </el-table-column>
                <el-table-column
                align="right" >
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search1"
                    size="mini"
                    placeholder="输入小区名搜索" />
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handle(scope.$index, scope.row)">处理</el-button>
                </template>
                </el-table-column>
            </el-table>

            </el-tab-pane>
            <el-tab-pane label="其他申请" name="second">
                <el-table
                :data="otherList"
                height="600px"
                stripe
                style="width: 100%">
                <el-table-column
                type="index"
                label="序号"
                width="50">
                </el-table-column>
                <el-table-column
                prop="community.region.fullName"
                label="地区">
                </el-table-column>
                <el-table-column
                prop="community.communityName"
                label="小区名">
                </el-table-column>
                <el-table-column
                prop="community.communityName"
                label="申请时间">
                </el-table-column>
                <el-table-column
                align="right">
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search2"
                    size="mini"
                    placeholder="输入小区名搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handle(scope.$index, scope.row)">处理</el-button>
                </template>
                </el-table-column>
            </el-table>
            </el-tab-pane>
        </el-tabs>
        </el-main>
  </el-container>
</template>

<script>
export default {
    computed:{
        authenticationList:function(){
            return this.dataList.filter((item)=>{
                if(item.room != null && item.community.communityName.includes(this.search1)){
                    return item
                }
            })
        },
        otherList:function(){
            return this.dataList.filter((item)=>{
                if((item.room == null || item.house == null) && item.community.communityName.includes(this.search2) ){
                    return item
                }
            })
        }
    },
    data() {
        return {
            search1:'',
            search2:'',
            dataList:[],
            activeName: 'first'
        }
    },
    methods: {
        //处理的对象
        handle(index,row){
            //将要处理的对象放入缓存
            sessionStorage.setItem('waitHandleApplyId',JSON.stringify(row.applyId))
            this.$router.push({path:'/home/examinePage'})
        },
        handleClick(tab, event) {
        console.log(tab, event);
      },
      getExamineList(){
        this.axios.post("/admin/getAdminExamineList")
        .then((res)=>{
            console.log(res)
            if(res.data.status == 0){
                this.dataList = res.data.data.applyList
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
                    message: "请求审批列表失败"
                });  
        })
      }
    },
    created() {
        //获取审批列表
        this.getExamineList()
        
    },
}
</script>

<style>

</style>