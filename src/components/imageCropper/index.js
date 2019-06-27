//图片上传插件
import ImageCropper from './index.vue'

let vm

export default{
    install(Vue){
        if(!vm){
            let CropperInstance = Vue.extend(ImageCropper)
            vm = new CropperInstance({
                el:document.createElement('div')
            })
        }


        let obj = {
            async upload(){
                document.querySelector('#homeLayout').appendChild(vm.$el)
                vm.visable = true
            }
        }
        Vue.prototype.$imageCropper = Vue.$imageCropper = obj
    }
}