import request from '@/utils/request'

const api_name = '/api/v1/sort'
export default {
    updateData(data) {
        return request({
            url: `${api_name}/update`,
            method: 'put',
            data
        })
    },
    /*
  获取用户分页列表(带搜索)
  */
    getPageList(currentPage, pageSize, search) {
        return request({
            url: `${api_name}/${currentPage}/${pageSize}`,
            method: 'get',
            params: search // url查询字符串或表单键值对
        })
    },
}