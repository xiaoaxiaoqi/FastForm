// 导入axios
import axios from 'axios'
// 基地址
const service = axios.create({
    baseURL: 'http://127.0.0.1:8188/',
    // 5秒超时
    timeout: 10000
})
// 请求拦截
service.interceptors.request.use(
    config => {
        // 添加额外的参数
        config.params = {
            ...config.params,
        };
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
// 响应拦截
service.interceptors.response.use(
    res => {
        return res.data
    },
    // 响应错误的代码写这里
    error => {
        return Promise.reject(error)
    }
)
// 暴露副本
export default service
