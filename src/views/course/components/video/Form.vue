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
      <!-- 上传视频 -->
      <el-form-item label="上传视频">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :before-remove="handleBeforeRemove"
          :on-remove="handleOnRemove"
          :file-list="fileList"
          :limit="1"
          action="http://127.0.0.1:9130/admin/vod/media/upload">
          <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
          <el-button
            :disabled="uploadBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">上传</el-button>
        </el-upload>
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
import vodApi from '@/api/vod'
export default {
  data() {
    return {
      dialogVisible: false,
      video: {
        sort: 0,
        free: false
      },
      // 上传文件列表
      fileList: [],
      uploadBtnDisabled: false
    }
  },
  methods: {
    // 删除视频文件确认
    handleBeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 执行视频文件的删除
    handleOnRemove(file, fileList) {
      if (!this.video.videoSourceId) {
        return
      }
      vodApi.removeByVodId(this.video.videoSourceId).then(response => {
        this.video.videoSourceId = ''
        this.video.videoOriginalName = ''
        // 如果没有这一步, 那么点击取消之后 vod 视频会被删除, 但是数据库却没有删除资源
        // 删除的同时更新 video 数据信息
        videoApi.updateById(this.video)
        this.$message.success(response.message)
      })
    },
    // 上传
    submitUpload() {
      this.uploadBtnDisabled = true
      this.$refs.upload.submit() // 提交上传请求
    },
    // 视频上传成功的回调
    handleUploadSuccess(response, file, fileList) {
      this.uploadBtnDisabled = false
      if (response.success) {
        // 给 video_source_id 赋值
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName = file.name
      } else {
        this.$message.error('上传失败(非20000)')
      }
    },
    // 上传失败回调
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.$message.error('上传失败(http)')
    },
    // 上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
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
      // 清空 video
      this.video = {
        sort: 0,
        free: false
      }
      // 清空 fileList
      this.fileList = []
    },
    // 开启对话框
    open(chapterId, videoId) {
      this.video.chapterId = chapterId
      this.dialogVisible = true
      if (videoId) {
        videoApi.getById(videoId).then(resp => {
          this.video = resp.data.item
          // 回显
          // debugger
          if (this.video.videoSourceId) {
            this.fileList = [{ 'name': this.video.videoOriginalName }]
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
