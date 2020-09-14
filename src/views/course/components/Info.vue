<template>
  <div class="app-container">

    <!-- 课程信息表单 -->
    <el-form label-width="120px">

      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <el-form-item label="课程类别">
        <!-- 一级分类 -->
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectChanged">
          <el-option
            v-for="subject in subjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select
          v-model="courseInfo.subjectId"
          placeholder="请选择">
          <el-option
            v-for="subject in subjectLevelTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="请填写课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <!-- 课程封面 -->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :on-error="handleCoverError"
          class="cover-uploader"
          action="http://localhost:9120/admin/oss/file/upload?module=cover">
          <img v-if="courseInfo.cover" :src="courseInfo.cover" alt="课程封面">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>
    </el-form>

    <div style="text-align:center">
      <el-button
        :disabled="saveBtnDisabled"
        type="primary"
        @click="saveAndNext()">保存并下一步
      </el-button>
    </div>
  </div>
</template>

<script>

import courseApi from '@/api/course'
import teacherApi from '@/api/teacher'
import subjectApi from '@/api/subject'
/* 引入富文本组件 */
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      // 按钮是否禁用
      saveBtnDisabled: false,
      courseInfo: {
        title: '',
        lessonNum: 0,
        price: 0,
        // 以下解决表单数据不全时, insert 语句非空校验
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        cover: '',
        description: ''
      },
      // 讲师列表
      teacherList: [],
      // 课程类别一级分类
      subjectList: [],
      // 课程类别二级分类
      subjectLevelTwoList: []
    }
  },
  created() {
    this.initTeacherList()
    this.initSubjectList()
  },
  methods: {
    saveAndNext() {
      this.saveBtnDisabled = true
      this.saveData()
    },
    saveData() {
      courseApi.saveCourseInfo(this.courseInfo).then(resp => {
        this.$message.success(resp.message)
        // 获取 courseId, 并给父组件的 courseId 赋值
        this.$parent.courseId = resp.data.courseId
        // 访问父组件的成员 this.$parent
        this.$parent.active += 1
      })
    },
    // 获取讲师列表
    initTeacherList() {
      teacherApi.teacherList().then(resp => {
        this.teacherList = resp.data.items
      })
    },
    // 获取课程分类
    initSubjectList() {
      subjectApi.getNestedTreeList().then(resp => {
        this.subjectList = resp.data.items
      })
    },
    // 切换一级类别下拉列表, 默认就有一个参数, value 就是选中的 id
    subjectChanged(value) {
      // console.log(value)
      // 切换一级列表的时候 清空二级列表的数据
      this.courseInfo.subjectId = ''
      this.subjectList.forEach(levelOneList => {
        // 通过一级菜单的id和二级菜单的 parentId, 把数据存进 subjectLevelTwoList
        if (levelOneList.id === value) {
          // 如果一致, 则将当前遍历的一级类别绑定在页面的二级类别列表中
          this.subjectLevelTwoList = levelOneList.children
        }
      })
    },
    // 上传成功回调
    handleCoverSuccess(res, file) {
      if (res.success) {
        // console.log(res)
        this.courseInfo.cover = res.data.url
        // 强制重新渲染
        this.$forceUpdate()
      } else {
        this.$message.error('上传失败!')
      }
    },
    handleCoverError() {
      this.$message.success('上传失败(http)!')
    },
    // 上传校验
    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style>
.tinymce-container {
  position: relative;
  line-height: normal;
}

.cover-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.cover-uploader .el-upload:hover {
  border-color: #409EFF;
}

.cover-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 640px;
  height: 357px;
  line-height: 357px;
  text-align: center;
}

.cover-uploader img {
  width: 640px;
  height: 357px;
  display: block;
}
</style>
