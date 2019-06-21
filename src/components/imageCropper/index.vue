<template>
    <i-modal v-model="visable" scrollable width='660' @on-visible-change="closeModal" @on-ok='upload'>
        <div class="imageCropper">
            <img :src="imgSrc" id="image" alt="avatar" v-if="imgSrc">
            <span @click="chooseImage" v-else style="cursor:pointer;">
                <i-icon type="md-add" style="font-size: 26px;" />选择图片
            </span>
            <div class="preview" v-show="previewSrc">
                预览
                <span :style="{backgroundImage:`url(${previewSrc})`}"></span>
            </div>
        </div>
        <input style="display:none" type="file" @change="change" id="file" accept="image/png, image/jpeg">
    </i-modal>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import {Bus} from '@/assets/js/until'
import {uploadAvatar} from '@api/userCenter'
export default {
    data(){
        return{
            previewSrc:'',
            imgSrc:'',
            cropper:''
        }
    },
    props:{
        visable:{
            type:Boolean
        }
    },
    mounted(){
    },
    methods:{
        chooseImage(){
            document.querySelector('#file').click()
        },
        change(e){
            let file = e.target.files[0];
            let _self = this               
            let reader = new FileReader()
            reader.readAsDataURL(file)                  
            reader.onload = function(e) {
                _self.imgSrc = e.target.result;
                _self.init()
            }
        },
        closeModal(){
            if(!this.visable){
                this.imgSrc=''
                this.previewSrc=''
                document.querySelector('#file').value = ''
                if(this.cropper){
                   this.cropper.destroy()
                }
            }
        },
        init(){
            this.$nextTick( () => {
                const image = document.getElementById('image')
                let _self = this
                this.cropper = new Cropper(image, {
                    aspectRatio: 1,
                    cropmove(event) {
                        _self.getImg()
                    },
                })
            })
            if(this.cropper){
                this.getImg()
            }
        },
        upload(){
            let _self = this
            this.cropper.getCroppedCanvas().toBlob((blob) => {
                let params = new FormData()
                params.append('file',blob)
                uploadAvatar(params).then( (res) => {
                    let _self = this
                    var a = new FileReader();
                    a.readAsDataURL(blob);
                    a.onload = function (e){
                        Bus.$emit('uploadImage',res.data.path)
                    }
                    console.log(res)
                })
                
            })
        },
        getImg(){
            this.cropper.getCroppedCanvas().toBlob((blob) => {
                let _self = this
                var a = new FileReader();
                a.readAsDataURL(blob);
                a.onload = function (e){
                    _self.previewSrc = e.target.result
                }
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .imageCropper{
        height: 360px;
        margin: 30px 150px 30px 30px;
        display:flex;
        align-items: center;
        justify-content: center;
        border: 1px dotted #000;
        position: relative;
        .preview{
            position: absolute;
            right: -150px;
            width: 150px;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding-top: 20%;
            &>span{
                padding: 50%;
                border-radius: 50%;
                border: 1px solid #ccc;
                margin-left: 6px;
                background-size: cover;
                background-repeat: no-repeat;
            }
        }
    }
</style>


