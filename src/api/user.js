import request from '@/utils/request'

export default {
    updateData(data) {
        return request({
            url: "/api/v1/aduser/update",
            method: 'post',
            data
        })
    }
}