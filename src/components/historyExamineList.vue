<template>
  <el-container >
      <el-main>
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
                prop="adminName"
                label="审批人"
                width="350">
                </el-table-column>
                <el-table-column
                prop="auditInfo"
                label="审批信息">
                </el-table-column>
                <el-table-column
                label="审批时间">
                 <template  slot-scope="scope">
                    {{scope.row.auditDate==null?new Date():scope.row.auditDate | dateFormart}}
                </template>
                </el-table-column>
                <el-table-column
                prop="auditState"
                label="您的意见">
                <template  slot-scope="scope">
                    {{scope.row.auditState==1?'通过':'未通过'}}
                </template>
                </el-table-column>
                <el-table-column
                align="right" >
                <template slot="header" slot-scope="scope">
                    <el-input
                    v-model="search1"
                    size="mini"
                    placeholder="输入审批人名字搜索" />
                </template>
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    type="primary"
                    plain
                    @click="handle(scope.$index, scope.row)">详情</el-button>
                </template>
                </el-table-column>
            </el-table>
        </el-main>
  </el-container>
</template>

<script>
export default {
    computed:{
        authenticationList:function(){
            return this.dataList.filter((item)=>{
                if(item.adminName.includes(this.search1)){
                    return item
                }
            })
        },
    },
    data() {
        return {
            search1:'',
            dataList:[],
            activeName: 'first'
        }
    },
    methods: {
        handle(index,row){
            sessionStorage.setItem("historyExamineInfoId",row.auditId);
            this.$router.push({path:'/home/historyExamineInfo'})
        },
      getHistoryExamineList(){
        this.axios.get("/audit/getHistoryExamineList")
        .then((res)=>{
            console.log(res)
            if(res.data.status == 0){
                this.dataList = res.data.data.AuditList
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
                    message: "请求列表失败"
                });  
        })
      }
    },
    created() {
        //获取审批列表
        this.getHistoryExamineList()
        
    },
}
</script>

<style>

</style>