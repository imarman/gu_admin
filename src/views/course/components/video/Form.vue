<template>
  <!-- 添加和修改课时表单 -->
  <el-dialog :visible="dialogVisible" title="添加课时" @close="close()">
    <el-form :model="video" label-width="120px">
      <el-form-item label="课时标题">
        <el-input v-model="video.title"/>
      </el-form-item>
      <el-form-item label="课时排序">
        <el-input-number v-model="video.sort" :min="0" />
      </el-form-item>
      <el-form-item label="是否免费">
        <el-radio-group v-model="video.free">
          <el-radio :label="true">免费</el-radio>
          <el-radio :label="false">默认</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import videoApi from '@/api/video'

export default {
  data() {
    return {
      dialogVisible: false,
      video: {
        sort: 0,
        free: false
      }
    }
  },
  methods: {
    // 保存或更新
    saveOrUpdate() {
      if (!this.video.id) {
        this.save()
      } else {
        this.update()
      }
    },
    // 保存
    save() {
      this.video.courseId = this.$parent.$parent.courseId
      videoApi.save(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    },
    // 更新
    update() {
      videoApi.updateById(this.video).then(response => {
        this.$message.success(response.message)
        // 关闭组件
        this.close()
        // 刷新列表
        this.$parent.fetchNodeList()
      })
    },
    // 关闭对话框
    close() {
      this.dialogVisible = false
      this.video = {
        sort: 0,
        free: false
      }
    },
    // 开启对话框
    open(chapterId, videoId) {
      this.video.chapterId = chapterId
      this.dialogVisible = true
      if (videoId) {
        videoApi.getById(videoId).then(resp => {
          this.video = resp.data.item
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
