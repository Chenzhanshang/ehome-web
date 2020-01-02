<template>
    <el-container direction="vertical">
        <div align="center">
            <el-button type="success" @click="dialogFormVisible = true" style="width:150px;" plain>生成管理账号</el-button>
        </div>
        <router-view></router-view>
    


    <el-dialog title="设置生成账号信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="账号类型">
                <el-radio-group v-model="role" @change="selectRole">
                    <el-radio v-for="role in roleList" :key="role.roleId" :label="role.roleId" border>{{role.roleName}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="所属地区" >
          <el-cascader
          v-show="!isAuthority"
          placeholder="试试搜索"
          :options="regions4"
          filterable
          :clearable=true
          @change="selected">
          </el-cascader>

          <el-cascader
          v-show="isAuthority"
          placeholder="试试搜索"
          :options="regions3"
          filterable
          :clearable=true
          @change="selected">
          </el-cascader>
        </el-form-item>

            <!-- 设置账号信息显示的表单，默认隐藏 -->
            <el-form-item label="账号信息" v-show = flag >
                <template>
                    <el-table
                    :data="tableData"
                    style="width: 100%">
                        <el-table-column
                            prop="account"
                            label="账号"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="password"
                            label="密码"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="type"
                            label="类型">
                        </el-table-column>
                        <el-table-column
                            prop="addressId"
                            label="地区编号">
                        </el-table-column>
                    </el-table>
                </template>
            </el-form-item>
                
            
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="generateAccount" :loading="isload">确 定</el-button>
        </div>
    </el-dialog>

    </el-container>
</template>

<script>
export default {
    data() {
        return {
            isload:false,
            dialogFormVisible: false,
            //标志信息
            flag: false,
            //是否为房产管理局
            isAuthority: false,
            //定义表格展示的数据信息
            tableData: [{
                account: '',
                password: '',
                type: '',
                addressId: ''
            }],

            role: '2',
            //定义表单信息
            form: {
                
                region:{
                    regionId:'',
                },
                
            },
            //三级地区数据集合
            regions3: [],
           //四级地区数据集合
            regions4:[],
            //角色类型集合
            roleList: []
        }
    },

    //监听选择角色变化
    watch: {
      role(value){
        if(value == 3){
          this.isAuthority = true
        }
        else{
          this.isAuthority = false
        }
      }
    },
    methods: {
        //选择账号类型监听方法
        selectRole(data){
            console.log(data)
            this.role = data
        },

        //选择地区监听方法
        selected(e){
            if(this.role == 3){
            this.form.region.regionId = e[2]
            }
            else{
            this.form.region.regionId = e[3]
            }  
        },
        

        //生成账号方法
        generateAccount(){
            this.isload = true
            this.axios.post("/generate/generateAccount",
            {roleId:this.role,regionId:this.form.region.regionId})
            .then((res)=>{
                this.isload = false

                 //设置表格展示的数据信息
                this.tableData[0].account = res.data.data.admin.adminAccount
                this.tableData[0].password = '123456'
                try{
                    this.roleList.forEach(item=>{
                        if(item.roleId === this.role){
                            this.tableData[0].type = item.roleName
                            //已找到对应数据，抛异常跳出循环
                            throw new Error("已找到角色对应角色名")
                        }
                    })  
                 }
                catch{
                }
                this.tableData[0].addressId = this.form.region.regionId

                this.flag = true
                this.$message({
                    type: 'success',
                    message:res.data.msg
                });

               

            })
            .catch((res)=>{
                console.log(res)
                this.isload = false
                type: 'error',
                this.$message({
                    message:res.data.msg
                });
            })

            
        },

        toUserManage(){
            this.$router.push({path:'/home/generateAdminAccount/userManage'})
        }
        
    },

    //页面加载调用方法
    created() {
        this.toUserManage()

         //加载所有账号类型，不包含平台成员
        this.axios.get("/admin/getAllRole")
        .then((res)=>{
            this.roleList = res.data.data.roles
        })
        .catch((res)=>{

        })
         if(localStorage.getItem("regionList")&&localStorage.getItem("regionTreesForThree"))
           {
                this.regions4 = JSON.parse(localStorage.getItem("regionList"))
                this.regions3 = JSON.parse(localStorage.getItem("regionTreesForThree"))

           }
           else{
               this.axios.get("/admin/regionList")
                .then((res)=>{
                    console.log(res);
                    if(res.data.status == 0){
                        this.regions4 = res.data.data.regionList
                        this.regions3 = res.data.data.regionTreesForThree
                        localStorage.setItem("regionList",JSON.stringify(res.data.data.regionList))
                        localStorage.setItem("regionTreesForThree",JSON.stringify(res.data.data.regionTreesForThree))
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
        
    }
    
}
</script>