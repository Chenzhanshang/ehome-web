<template>
  <div>
      审批列表
  </div>
</template>

<script>
export default {
    created() {

        this.axios.post("/admin/getAdminExamineList")
        .then((res)=>{

            console.log(res)
        })
        .catch((res)=>{

        })
    },
}
</script>

<style>

</style>