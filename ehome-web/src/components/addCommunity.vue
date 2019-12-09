<template>
    <el-container>
        <el-button type="success" @click="dialogFormVisible = true">添加小区</el-button>

        <el-dialog title="输入小区信息" :visible.sync="dialogFormVisible">
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
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCommunity" :loading="isload">确 定</el-button>
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
            form: {
                communityName:'',
                communityInfo:'',
                region:{
                    regionId:'',
                }
            },
            formLabelWidth: '120px',
            options:[]
        }
    },
    methods: {
        selected(e){
            console.log(e)
            this.form.region.regionId = e[3]
            console.log(this.form.region.regionId)
        },
        addCommunity(){
            this.isload = true
            
            this.axios.post("/admin/addCommunity",this.form)
            .then((res)=>{
                console.log(res)
                this.isload = false
                this.dialogFormVisible = false
                this.$message({
                    message:res.data.msg
                });
            })
            .catch((res)=>{
                console.log(res)
                this.isload = false
                this.$message({
                    message:res.data.msg
                });
            })

            
        }
    },
    created() {
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
}
</script>

<style>

</style>