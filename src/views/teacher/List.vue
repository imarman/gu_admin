<template>
  <div class="app-container">
    <!-- 查询表单 -->
    <!--查询表单-->
    <el-form
      :inline="true">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师"/>
      </el-form-item>

      <el-form-item>
        <el-select
          v-model="searchObj.level"
          clearable
          placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getTeacherList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe>
      <el-table-column label="ID" width="50">
        <!-- 使用连续的序号 -->
        <template slot-scope="scope">
          {{ (currentPage - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="80"/>
      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">
            <el-tag type="primary" size="mini">高级讲师</el-tag>
          </span>
          <span v-else>
            <el-tag type="success" size="mini">首席讲师</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历"/>
      <el-table-column prop="sort" label="排序" width="50"/>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.deleted === 1">
            <el-tag type="danger" size="mini">已删除</el-tag>
          </span>
          <span v-else>
            <el-tag type="primary" size="mini">正常</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="joinDate" label="入驻时间" width="160"/>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toUpdate(scope.row.id)">更改</el-button>
          <el-button type="danger" size="mini" @click="removeById(scope.row)">删除</el-button>
          <!-- <el-button v-if="scope.row.deleted===0" type="danger" size="mini" @click="removeById(scope.row)">删除</el-button>-->
          <!-- 不做这个功能了 -->
          <!-- <el-button v-if="scope.row.deleted===1" type="success" size="mini">恢复</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :current-page="currentPage"
      :page-size="limit"
      :total="total"
      :page-sizes="[5, 10, 15, 20]"
      style="padding: 12px 8px; text-align: center"
      layout="sizes, prev, pager, next, jumper, ->, total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
  </div>
</template>

<script>
import teacherApi from '@/api/teacher'

export default {
  name: 'List',
  data() {
    return {
      // 讲师列表数据
      list: [],
      total: 0, // 总记录数
      // 当前页数
      currentPage: 1,
      // 每页记录数
      limit: 10,
      // 查询用的对象
      searchObj: {
        name: '',
        level: '',
        joinDateBegin: '',
        joinDateEnd: ''
      }
    }
  },
  created() {
    this.getTeacherList()
  },
  methods: {
    // 获取所有讲师 & 条件查询
    getTeacherList() {
      teacherApi.pageList(this.currentPage, this.limit, this.searchObj).then(resp => {
        this.list = resp.data.rows
        this.total = resp.data.total
        // console.log(this.list)
      })
    },
    // 改变每页条数
    handleSizeChange(size) {
      this.limit = size
      this.getTeacherList()
    },
    // 改变页码
    handleCurrentChange(page) {
      this.currentPage = page
      this.getTeacherList()
    },
    // 清空数据
    resetData() {
      this.searchObj = {}
    },
    removeById(data) {
      this.$confirm('此操作将永久删除【' + data.name + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除的 api
        teacherApi.deleteTeacherById(data.id).then(resp => {
          // 获取所有 讲师
          this.getTeacherList()
          // console.log(resp)
          this.$message({
            type: 'success',
            message: resp.message
          })
        })
      }).catch((err) => {
        // 如果是取消删除, 是 cancel
        // 如果是后端传来的错误, 不能按这个走
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      })
    },
    // 去更改页面
    toUpdate(id) {
      this.$router.push({ path: `/teacher/edit/${id}` })
    }
  }
}
</script>

<style scoped>

</style>
