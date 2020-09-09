<template>
  <div class="app-container">
    <!-- 输入表单 -->
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name" />
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker v-model="teacher.joinDate" value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level">
          <!--
          数据类型一定要和取出的  json 中的一致，否则没法回填
          因此，这里 value 使用动态绑定的值，保证其数据类型是 number
          :value="1" 是数字
          value="1" 是字符串
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro"/>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->

      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate()">{{ saveOrUpdateVal }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import request from '@/api/teacher'

export default {
  name: 'Form',
  data() {
    return {
      // 讲师对象
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        joinDate: '',
        intro: '',
        career: ''
      },
      saveOrUpdateVal: '保存',
      // 默认按钮可用  防止表单重复提交
      saveBtnDisabled: false
    }
  },
  created() {
    /**
     * 问题: 怎么区分是添加还是编辑才转到这个页面 ?
     *    在 router/index.js 中, 配置了编辑和添加的两个路由
     *    如果要编辑, 就会在路由添加 id,
     *    所以可以用有没有 id 来判断是 添加页面还是编辑页面
     *
     *    this.$router  操作路由的对象
     *    this.$route   路由对象本身
     */
    if (this.$route.params.id) {
      // 如果路由当中有 id, 就是编辑页面, 再把 id 传进去
      this.fetchDataById(this.$route.params.id)
      this.saveOrUpdateVal = '修改'
    }
  },
  methods: {
    saveOrUpdate() {
      this.saveBtnDisabled = true
      // 如果 teacher 有 id 属性,就是修改! 没有 id 就是添加
      if (!this.teacher.id) {
        this.saveData()
      } else {
        this.updateData()
      }
      this.saveBtnDisabled = false
    },
    // 数据保存
    saveData() {
      request.save(this.teacher).then(resp => {
        this.$message({
          type: 'success',
          message: resp.message
        })
        this.$router.push({ path: '/teacher/list' })
      })
    },
    // 根据 id 查询数据, 用于数据更改时的回显
    fetchDataById(id) {
      request.getById(id).then(resp => {
        this.teacher = resp.data.item
      })
    },
    // 更新用户
    updateData() {
      request.updateById(this.teacher).then(resp => {
        this.$message({
          type: 'success',
          message: resp.message
        })
        this.$router.push({ path: '/teacher/list' })
      })
    }
  }
}
</script>

<style scoped>

</style>
