import request from '@/utils/request'

export default {
  saveCourseInfo(courseInfo) {
    return request({
      url: '/admin/edu/course/save-course-info',
      method: 'post',
      data: courseInfo
    })
  },
  getCourseInfoById(id) {
    return request({
      url: `/admin/edu/course/course-info/${id}`,
      method: 'get'
    })
  },
  updateCourseInfoById(courseInfo) {
    return request({
      url: '/admin/edu/course/update-course-info',
      method: 'put',
      data: courseInfo
    })
  },
  getPageList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/course/list/${page}/${limit}`,
      method: 'get',
      params: searchObj
    })
  },
  removeById(id) {
    return request({
      url: `/admin/edu/course/remove/${id}`,
      method: 'delete'
    })
  },
  // 获取发布课程信息
  getCoursePublishById(id) {
    return request({
      url: `/admin/edu/course/course-publish/${id}`,
      method: 'get'
    })
  },
  // 发布课程
  publishCourseById(id) {
    return request({
      url: `/admin/edu/course/publish-course/${id}`,
      method: 'put'
    })
  }
}
