import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
axios.defaults.headers.common['Content-Type'] = 'application/json'
import errorCodes from './errorCode'
import {Message} from 'iview'

let instance = axios.create({
	baseURL: '/api/xcentz/v1', // api的base_url
    timeout: 10000 // request timeout
})


let pending = []; 
let cancelToken = axios.CancelToken;
let removePending = (config) => {
    for(let p in pending){
        if(pending[p].u === config.url + '&' + config.method + '&'+JSON.stringify(config.params)) {
            pending[p].f(); 
            pending.splice(p, 1); 
        }
    }
}

//请求拦截器
instance.interceptors.request.use( (config) => {
    //防重复请求
    removePending(config)
     config.cancelToken = new cancelToken((c)=>{
        pending.push({ u: config.url + '&' + config.method + '&'+JSON.stringify(config.params), f: c });  
    });
    
	let token = localStorage.getItem('token')
	if(token){
		config.headers['Authorization'] = 'Bearer__'+token; 
	}
	return config
},error => {
	Promise.reject(error)
})

//响应拦截器
instance.interceptors.response.use( (response) => {
	removePending(response.config);
	
	response.data && response.data.errorCode && Message.message('success',{
		content:errorCodes[response.data.errorCode],
	})
	return new Promise( (re) => {
        re (response)
    }).catch( (err)=>{
        console.log(err)
    })
	
}, error => {
	if(error.code==='ECONNABORTED'){
		Message.message('error',{	
			content: '请求超时!',
		})
		return Promise.reject(error)
	}
	error.response && error.response.data && error.response.data.errorCode && Message.message('error',{
		content: errorCodes[error.response.data.errorCode],
	})

	if(error.response && error.response.status==401){
		localStorage.setItem('token','')
		router.replace('/login')
	}

	return Promise.reject(error)
})

export default instance