<template>
  <el-container direction="vertical">
      <el-main>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            type="index"
            label="序号"
            width="150">
            </el-table-column>
            <el-table-column :label="committee==null?'暂无业委会信息':'第'+committee.committeeTerm+'届业委会成员信息'">
            <el-table-column
                prop="ownerName"
                label="姓名">
            </el-table-column>
            <el-table-column
            prop="ownerPhone"
            label="联系电话">
            </el-table-column>
            <el-table-column
            prop="ownerIdNumber"
            label="身份证号">
            </el-table-column>
            <el-table-column
            prop="ownerOfficeTrime"
            label="入职时间">
            <template slot-scope="scope">
              {{scope.row.ownerOfficeTrime | dateFormart}}
            </template>
            </el-table-column>
        </el-table-column>
        </el-table>
      </el-main>
  </el-container>
</template>

<script>
export default {
    data(){
        return{
            committee:null,
            tableData: []
        }
    },
    methods: {
        getCommitteeInfo(communityId){
            this.axios.get('/admin/committeeInfo/'+communityId)
            .then((res)=>{
                console.log(res)
                if(res.data.status == 0){
                    this.tableData = res.data.data.ownerList
                    this.committee = res.data.data.committee
                }
            })
            .catch((res)=>{

            })
        }
    },
    created() {
        this.info = JSON.parse(sessionStorage.getItem('communityInfo'))
        this.getCommitteeInfo(this.info.communityId)
    },
}
</script>

<style>

</style>