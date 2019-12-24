<template>
    <el-container direction="vertical">
    <el-main>
    <el-dialog title="设置账号信息" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="账号" >
          <el-input v-model="form.adminAccount" disabled ></el-input>
        </el-form-item>
        <el-form-item label="密码" >
          <el-input v-model="form.adminPassword"  ></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.adminType" placeholder="请选择账号类型">
            <el-option v-for="role in roleList" :key="role.roleId" :label="role.roleName" :value="role.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区" >
          <el-cascader
          placeholder="试试搜索"
          :options="options"
          filterable
          :clearable=true
          @change="selected">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openUpdateWindow()">修改</el-button>
          <el-button  @click="dialogFormVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 管理员账号信息表格 -->
    <el-table
      :data="showList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      height="460">
      
      <el-table-column
      type="index"
      label="序号"
      width="50">
      </el-table-column>
      <el-table-column
        prop="adminAccount"
        label="账号"
        width="180">
      </el-table-column>
      
      <el-table-column
        prop="roles[0].roleName"
        label="账号类型"
        width="180">
      </el-table-column> 
      <el-table-column
        prop="region.fullName"
        label="地区">
      </el-table-column>
      <el-table-column
        prop="adminModify"
        label="账号状态"
        width="180">
      </el-table-column> 
      
      <el-table-column
      align="right">
      
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope" >
          <el-button
            size="mini"
            type="warning"
            plain
            @click="updateForm(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="openDeleteWindow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="adminList.length"
      prev-text="上一页"
      next-text="下一页"
      style="
        text-align:center;
        letter-spacing:4px
      "
    >
    </el-pagination>
    </el-main>
    </el-container>

</template>
<script>
export default {
    computed:{
        showList:function(){
            return this.adminList.filter((item)=>{
                item.adminModify == 0 || item.adminModify == "未激活" ? item.adminModify='未激活' : item.adminModify='激活'
                if(item.adminAccount.includes(this.search)||item.adminModify.includes(this.search)||(item.region!= null && item.region.fullName.includes(this.search))||item.roles[0].roleName.includes(this.search) ){
                   return item;
                }
            })
        }
    },
    data(){
        return{
          dialogFormVisible: false,
          //当前页
          currentPage: 1,
          //每页条数
          pageSize: 5,
          adminList: [],
          search:'',
          adminId: '',
          dialogVisible: false,
          //地区数据集合
          options:[],
          //角色列表
          roleList: [],
          //修改的表单
          form: {
            
            adminAccount: '',
            adminPassword: '',
            adminType: [],
            region:{
                  regionId:'',
            },

          }


        }
    },

    //加载管理员信息列表
    methods: {
        loadAdminList(){
            this.axios.get("/admin/adminList")
            .then((res)=>{
                this.adminList = res.data
            })
            .catch((res)=>{

            })
        },

        //唤出修改的表单
        updateForm(data){
          this.dialogFormVisible = true
          this.form.adminAccount = data.adminAccount
          this.form.adminType = data.roles[0].roleName
          this.form.region.regionId = data.region.regionId
          this.adminId = data.adminId

        },

        //删除管理员账号信息
        deleteAdmin(data){
          this.axios.get("/admin/deleteAdmin/" + data.adminId)
          .then((res)=>{

            //删除前端数据 
            this.adminList.forEach((admin,index) => {
              if(admin.adminId == data.adminId){
                //删除索引后的一个元素
                this.adminList.splice(index,1)
              }
            });
            this.$message({
              type: 'success',
              message:res.data.msg
            });

          })
          .catch((res)=>{
            this.$message({
              type: 'error',
              message:res.data.msg
            });
          })

        },

        //删除对话框
        openDeleteWindow(data) {
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.deleteAdmin(data)

          }).catch(() => {  

          });
        },

        //修改对话框
        openUpdateWindow() {
          this.$confirm('此操作将修改该账号数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.onSubmit()
          }).catch(() => {  

          });
        },

        //修改的表单提交
        onSubmit() {
          this.axios.post("/admin/updateAdmin",{
            adminId: this.adminId,
            adminAccount: this.form.adminAccount,
            adminPassword: this.form.adminPassword,
            region: {regionId:this.form.region.regionId},
            roles: [{roleId:this.form.adminType}]
          })
          .then((res)=>{
            this.$message({
              type: 'success',
              message:res.data.msg
            });
            this.dialogFormVisible = false

            //修改前端信息
            this.adminList.forEach((admin,index)=>{
              if(admin.adminId == res.data.data.admin.adminId){
                this.adminList.splice(index,index,res.data.data.admin)
              }
            })

            
          })
          .catch((res)=>{
             this.$message({
              type: 'error',
              message:res.data.msg
            });
          })

        },

        //选择地区监听方法
        selected(e){
            this.form.region.regionId = e[3]
        },

        //监听页数改变
        handleSizeChange: function(size){
          this.pageSize = size

        },

        //监听当前页码
        handleCurrentChange: function(currentPage){
            this.currentPage = currentPage
        },
    },

    created(){
      this.loadAdminList()

      //加载所有账号类型，不包含平台成员
      this.axios.get("/admin/getAllRole")
      .then((res)=>{
        console.log(res)
        this.roleList = res.data.data.roles
      })
      .catch((res)=>{

      })

      //页面加载调用方法
      this.axios.get("/admin/regionList")
      .then((res)=>{
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
}
</script>