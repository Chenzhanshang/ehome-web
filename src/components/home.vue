<template>
    <el-container>
        <el-header>
            <!-- 头部导航栏 -->
            <el-menu :router=true :default-active="activeIndex"  class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">审批工作</template>
                <el-menu-item index="/home/examineList">审批作业</el-menu-item>
                <el-menu-item index="/home/historyExamineList">历史审批</el-menu-item>
            </el-submenu>
            
            <el-submenu v-if="show" index="2">
                <template slot="title">平台工作</template>
                <el-menu-item index="/home/addCommunity">小区管理</el-menu-item>
                <el-menu-item index="/home/generateAdminAccount">用户管理</el-menu-item>
            </el-submenu>
            <el-submenu class="right" index="3">
                <template slot="title">{{region}}:{{roles[0].roleName}}</template>
                <el-menu-item @click="updatePassword">修改密码</el-menu-item>
                <el-menu-item @click="safeExit">安全退出</el-menu-item>
            </el-submenu>
            </el-menu>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: '/home/examineList',
            region:'',
            roles:null,
            show:false,

        }
    },
    methods: {
        safeExit(){
            this.axios.get('/admin/logout')
            .then((res)=>{
                if(res.data.status == 0){
                    this.$message({
                        type:'success',
                        message:res.data.msg
                    })
                    this.$router.push({path:'/'})
                }
            })
            .catch((res)=>[
                this.$message({
                        type:'warning',
                        message:"安全退出失败"
                    })
            ])
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        //设置组件数据
        setComData(){
            this.region = sessionStorage.getItem('region')
            this.roles = JSON.parse(sessionStorage.getItem('roles'))
            this.roles.forEach(element => {
                if(element.roleName==="平台成员"){
                    this.show = true
                }
                
            })
        },
        updatePassword(){
            this.$prompt('请输入您的新密码', '注意', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                inputPlaceholder:'密码'
                }).then(({ value }) => {
                    console.log(value)
                    
                    this.axios.post('/admin/updatePassword',{adminPassword:value})
                    .then((res)=>{
                        console.log(res)
                            //弹出提示
                            this.$message({
                                message:res.data.msg
                            });
                            this.$router.push({name:'/'})
                    }).catch((res)=>{
                        console.log(res)
                    })


                }).catch(() => {
                });
        }
    },
    created() {
        //设置页面数据
        this.setComData()
        //判断是否修改密码
        var adminModify = sessionStorage.getItem("adminModify")
        console.log(adminModify)
        if(adminModify === '0'){
            this.$prompt('您的密码过于简单，请输入新密码，请妥善保存您的密码，若密码遗失请联系平台成员重置密码', '注意', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal:false,
                inputPlaceholder:'密码'
                }).then(({ value }) => {
                    console.log(value)
                    
                    this.axios.post('/admin/updatePassword',{adminPassword:value})
                    .then((res)=>{
                        console.log(res)
                            //弹出提示
                            this.$message({
                                message:res.data.msg
                            });
                            this.$router.push({name:'/'})
                    }).catch((res)=>{
                        console.log(res)
                    })


                }).catch(() => {
                    this.$router.push({name:'/'})
                });
        }

    }

}
</script>

<style scoped>
  .right{
    position: absolute;
    right: 0px;
  }
  .right-2{
    position: absolute;
    right: 80px;
  }
</style>