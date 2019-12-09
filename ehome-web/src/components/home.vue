<template>
    <el-container>
        <el-header>
            <!-- 头部导航栏 -->
            <el-menu :router=true :default-active="activeIndex"  class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="1">
                <template slot="title">审批工作</template>
                <el-menu-item index="1-1">审批作业</el-menu-item>
                <el-menu-item index="1-2">历史审批</el-menu-item>
            </el-submenu>
            
            <el-submenu v-if="show" index="2">
                <template slot="title">平台工作</template>
                <el-menu-item index="/home/addCommunity">录入小区</el-menu-item>
                <el-menu-item index="2-2">用户管理</el-menu-item>
            </el-submenu>
            <el-menu-item class="right">{{region}}</el-menu-item>
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
            activeIndex: '1',
            region:'',
            roles:null,
            show:false
        }
    },
    methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
        },
        //设置组件数据
        setComData(){
            this.region = localStorage.getItem('region')
            this.roles = JSON.parse(localStorage.getItem('roles'))
            this.roles.forEach(element => {
                if(element.roleName==="平台成员"){
                    this.show = true
                }
            })
        }
    },
    created() {
        //设置页面数据
        this.setComData()
        //判断是否修改密码
        var adminModify = localStorage.getItem("adminModify")
        console.log(adminModify)
        if(adminModify === '0'){
            this.$prompt('您的密码过于简单，请输入新密码，不修改则不能使用本系统', '注意', {
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