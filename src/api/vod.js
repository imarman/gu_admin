import request from '@/utils/request'

export default {

  removeByVodId(id) {
    return request({
      baseURL: 'http://127.0.0.1:9130',
      url: `/admin/vod/media/remove/${id}`,
      method: 'delete'
    })
  }
}
