import axios from 'axios'
import Vue from 'vue'
import router from '@/router'
axios.defaults.headers.common['Content-Type'] = 'application/json'
import errorCodes from './errorCode'
import {Message} from 'iview'

let instance = axios.create({
	baseURL: '/api/xcentz/v1', // api的base_url
    timeout: 20000 // request timeout
})

instance.interceptors.request.use( (config) => {
	let token = localStorage.getItem('token')
	// if(config.method === 'post'){
    //     let _data = ''
    //     for(let it in config.data){
    //         _data += encodeURIComponent(it) + '=' + encodeURIComponent(config.data[it]) + '&';
    //     }
    //     config.data = _data
    // }
	
	if(token){
		config.headers['Authorization'] = 'Bearer '+token; 
	}
	return config
},error => {
	Promise.reject(error)
})


instance.interceptors.response.use( (response) => {
	
	// console.log(response)
	response.data && response.data.errorCode && Message.message('success',{
		content:errorCodes[response.data.errorCode],
		top: 50,
		duration: 3
	})
	return response
	
}, error => {
	console.dir(error)
	if(!error.response){
		Message.message('error',{	
			content: '请求超时!',
			top: 50,
			duration: 3
		})
		return Promise.reject(error)
	}
	error.response && error.response.data && error.response.data.errorCode && Message.message('error',{
		content: errorCodes[error.response.data.errorCode],
		top: 50,
		duration: 3
	})

	if(error.response && error.response.status==401){
		localStorage.setItem('token','')
		router.replace('/login')
	}

	return Promise.reject(error)
})

export default instance