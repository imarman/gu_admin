<template>
  <!-- 添加和修改章节表单 -->
  <el-dialog :visible="dialogVisible" title="添加章节" @close="close()">
    <el-form :model="chapter" label-width="120px">
      <el-form-item label="章节标题">
        <el-input v-model="chapter.title"/>
      </el-form-item>
      <el-form-item label="章节排序">
        <el-input-number v-model="chapter.sort" :min="0"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import chapterApi from '@/api/chapter'

export default {
  data() {
    return {
      // 是否显示对话框
      dialogVisible: false,
      // 章节数据
      chapter: {
        sort: 0
      }
    }
  },
  methods: {
    // 打开对话框
    open(chapter) {
      this.dialogVisible = true
      // console.log(chapter)
      if (chapter) {
        // 这个方法的弊端就是, 输入框和显示的课程信息会同步 v-model
        // this.chapter = chapter
        // 这个就不会同步，但是要多查询一次数据库
        chapterApi.getById(chapter.id).then(resp => {
          this.chapter = resp.data.item
        })
      }
    },
    // 关闭对话框乱
    close() {
      this.dialogVisible = false
      this.chapter = {}
    },
    // 保存或更新
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.save()
      } else {
        this.update()
      }
    },
    // 保存章节
    save() {
      // 给 chapter 对象赋 course_id
      this.chapter.courseId = this.$parent.$parent.courseId
      chapterApi.save(this.chapter).then(resp => {
        this.$message.success(resp.message)
        // 关闭组件
        this.close()
        // 刷新页面
        this.$parent.fetchNodeList()
      })
    },
    // 更新章节
    update() {
      chapterApi.updateById(this.chapter).then(resp => {
        this.$message.success(resp.message)
        // 关闭组件
        this.close()
        // 刷新页面
        this.$parent.fetchNodeList()
      })
    }
  }
}
</script>

<style scoped>

</style>
