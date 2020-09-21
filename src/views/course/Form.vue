<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-bottom: 40px">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="发布课程" />
    </el-steps>

    <!-- 填写课程基本信息 Info -->
    <Info v-if="active === 0"/>
    <!-- 创建课程大纲 chapter/Index -->
    <Chapter v-else-if="active === 1"/>
    <!-- 发布课程 -->
    <Publish v-else/>

  </div>
</template>

<script>
import Info from './components/Info'
// 只要写到 chapter 即可, 会自动找 chapter/Chapter.vue 或 chapter/Index.vue
import Chapter from './components/chapter'
import Publish from './components/Publish'
export default {
  components: {
    Info,
    Chapter,
    Publish
  },
  data() {
    return {
      active: 0,
      // courseId = null 就说明市新增, 不是 null 是修改
      courseId: null
    }
  },
  created() {
    // 通过获取路由名称，判断进入哪个步骤
    if (this.$route.name === 'CourseChapterEdit') {
      // 步骤一
      // 路由带着 id 参数, 可以给 courseId 赋值
      this.courseId = this.$route.params.id
      // 第二页 创建课程大纲页
      this.active = 1
    } else if (this.$route.name === 'CourseInfoEdit') {
      // 步骤 二
      this.courseId = this.$route.params.id
      this.active = 0
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
