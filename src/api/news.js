import request from '@/utils/request'

const api_name = '/api/v1/question'

export default {
    /*
    获取问题分页列表(带搜索)
    */
    getPageList(currentPage, pageSize, search) {
        return request({
            url: `${api_name}/${currentPage}/${pageSize}`,
            method: 'get',
            params: search // url查询字符串或表单键值对
        })
    },
    // get更新问题状态
    questionGitStatus(id, status) {
        return request({
            url: `${api_name}/updateStatus/${id}/${status}`,
            method: 'get'
        })
    },
    // 更新问题状态
    questionStatus(data) {
        return request({
            url: `${api_name}/update`,
            method: 'post',
            data
        })
    },
    // 更新置顶状态
    updateTop(id, top) {
        return request({
            url: `${api_name}/top/${id}/${top}`,
            method: 'get',
        })
    },
}
