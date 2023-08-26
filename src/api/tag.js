import request from '@/utils/request'

const api_name = '/api/v1/tag'

export default {
    updateData(data) {
        return request({
            url: "/api/v1/tag/update",
            method: 'post',
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
    /*
    批量删除
    */
    batchRemove(idList) {
        return request({
            url: `${api_name}/batchRemove`,
            method: 'delete',
            data: idList
        })
    },
    // 加载类别
    /*getSorts(data){
        return request({
            url: `/api/v1/sort/list`,
            method: 'post',
            data // url查询字符串或表单键值对
        })
    }*/
}