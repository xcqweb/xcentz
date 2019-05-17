<template>
    <div class="tags">
        <div class="tags_con" :style="{minWidth:`${comWidth}px`}">
            <span v-for="item in tags">
               <Tag closable :color="isActive(item)?'primary':'default'" @on-close='closeTag(item)'>
                   <router-link :to="item.path">{{item.meta.title}}</router-link>
                </Tag> 
            </span>
        </div>
    </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
    data(){
        return{
            tags:[],
            comWidth:0,

        }
    },
    watch:{
        '$route':{
            handler(){
                this.getTags()
            }
        }
    },
    mounted(){
        this.initScroll()
        this.getTags()
    },

    methods:{
        initScroll(){
            this.$nextTick( () => {
                let warpper = document.querySelector('.tags') 
                new Bscroll(warpper,{
                    scrollX:true,
                    scrollY:false,
                    click:true,
                    mouseWheel:true
                })
                let arr = Array.from(document.querySelector('.tags_con').children)
                for(let item of arr){
                    this.comWidth += item.offsetWidth+36.5
                }
            })
        },
        isHome(route) {
            const name = route && route.name
            if (!name) {
                return false
            }
            return name.trim().toLocaleLowerCase() === 'home'.toLocaleLowerCase()
        },
        isActive(route) {
            return route.path === this.$route.path
        },
        getTags() {
            let re = this.tags.some((item) => {
                return item.meta.title === this.$route.meta.title
            })

            if(!re){
              this.tags.push({
                  path:this.$route.path,
                  name:this.$route.name,
                  meta:{title:this.$route.meta.title}
              })  
            }
        },
        closeTag(data){
            
            let index = this.tags.findIndex( (item) => {
                return item.meta && item.meta.title === data.meta.title 
            })
            
            this.tags.splice(index,1)
            // console.log(this.tags)
            if(this.tags.length>=1){
                this.$router.push(this.tags.slice(-1)[0].path)
            }else{
                this.tags.push({
                  path:'/home',
                  name:'home',
                  meta:{title:'主页'}
              }) 
                this.$router.push('/home')
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .tags{
        height: 42px;
        width: 100%;
        border-top: 1px solid #ccc; 
        border-bottom: 1px solid #ccc;
        align-items: center;
        overflow: hidden;
        .tags_con{
            width: 100%;
            padding-top: 4px;
            display: flex;
        }
    }
</style>


