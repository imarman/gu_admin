<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      style="padding-bottom: 10px"
      placeholder="输入关键字进行过滤"/>

    <el-tree
      ref="tree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all/>
  </div>
</template>

<script>
import subjectApi from '@/api/subject'
export default {
  name: 'SubjectList',
  data() {
    return {
      // 过滤文本
      filterText: '',
      // 数据列表
      subjectList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }

    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchNodeList()
  },
  methods: {
    fetchNodeList() {
      subjectApi.getNestedTreeList().then(resp => {
        this.subjectList = resp.data.items
      })
    },
    filterNode(value, data) {
      if (!value) {
        return true
      }
      // 统一转换成小写  value 就是  filterText 变化的值
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
  }
}
</script>

<style scoped>

</style>
