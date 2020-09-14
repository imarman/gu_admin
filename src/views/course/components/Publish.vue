<template>
  <div class="app-container">

    <!--课程预览 TODO-->

    <div style="text-align:center">
      <el-button type="primary" @click="prev()">上一步</el-button>
      <el-button :disabled="publishBtnDisabled" type="primary" @click="publish()">发布课程</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 按钮是否禁用
      publishBtnDisabled: false
    }
  },
  methods: {
    prev() {
      this.$parent.active -= 1
    },
    publish() {
      this.publishBtnDisabled = true
      alert('发布成功')
      this.$parent.active = 3
    }
  }
}
</script>

<style scoped>

</style>
