<template>
    <el-container>
        <el-header>
 
        </el-header>
        <el-main class="main">
            <el-row type="flex" align="middle" justify="end">

                <el-col :xs="18" :sm="14" :md="10" :lg="8" :xl="8" >
                    <el-form ref="loginForm" label-position="left" :model="form" :rules="rules" label-width="80px" class="login-box">
                    <h3 class="login-title">欢迎登录</h3>
                    <el-form-item label="登陆名" prop="adminAccount">
                        <el-input v-model="form.adminAccount" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="adminPassword">
                        <el-input type="password" v-model="form.adminPassword" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item >
                        <el-button type="primary" :loading="loading" @click="login('loginForm')">{{loading==false?'登录':'登录中'}}</el-button>
                    </el-form-item>
                </el-form>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            loading:false,
            form:{
                adminAccount:'',adminPassword:''
            },
             rules: {
                adminAccount: [
                    {required: true, message: '账号不可为空', trigger: 'blur'}
                ],
                adminPassword: [
                    {required: true, message: '密码不可为空', trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        login(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.loading = true
                    this.axios.post('/admin/login',this.form)
                    .then((res)=>{
                        if(res.data.status==0){
                            console.log(res)
                            //跳转页面
                            if(res.data.data.region != null){
                                sessionStorage.setItem("region",res.data.data.region); 
                            }
                            if(res.data.data.roles != null){
                                sessionStorage.setItem("roles",JSON.stringify(res.data.data.roles)); 
                                //console.log(res.data.data.roles[0].roleName)
                            }
                            if(res.data.data.adminModify != null){
                                sessionStorage.setItem("adminModify",JSON.stringify(res.data.data.adminModify)); 
                                //console.log(res.data.data.roles[0].roleName)
                            }
                            this.$router.push({name:'home'})
                        }
                        else{
                            console.log(res.data.msg)
                            //弹出提示
                            this.$message({
                                message:res.data.msg
                            });
                        }
                        this.loading = false
                        
                    })
                    .catch((err)=>{
                        console.log(err);
                        this.loading = false
                    });
                }
                else{
                    //校验未通过,不提交表单
                    return false
                }
            })
        }
    },
    
}
</script>

<style scoped>
    .login-box {
    border: 1px solid #DCDFE6;
    width: 70%;
    margin:  auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
    background-color: #fff;
  }

  .login-title {
    text-align: center;
    margin: 0 auto 15px auto;
    color: #303133;
  }
  .main{
      margin-top: calc(15vh)
  }


</style>