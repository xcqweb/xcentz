<template>
    <div class="tags">
        <div class="tags_con" :style="{minWidth:`${comWidth}px`}">
            <span v-for="(item ,index) in tags">
               <i-tag closable :color="isActive(item)?'primary':'default'" @on-close='closeTag(item)' @contextmenu.prevent.native="menuRight($event,index,item)">
                   <router-link :to="item.path">{{item.meta.title}}</router-link>
                </i-tag> 
            </span>
            <div :style="{left:position.left+'px',top:position.top+'px'}" style="position:absolute;left: -50px;top: 16px;">
                <i-poptip placement="bottom" v-model="visible">
                
                    <div slot="content">
                        <i-dropdown @click.native='itemHandler'>
                            <i-dropdown-item data-index='1'>关闭当前</i-dropdown-item>
                            <i-dropdown-item divided data-index='2'>关闭其他</i-dropdown-item>
                            <i-dropdown-item divided data-index='3'>关闭右侧</i-dropdown-item>
                            <i-dropdown-item divided data-index='4'>全部关闭</i-dropdown-item>
                        </i-dropdown>
                    </div>
                </i-poptip>
            </div>
            
        </div>
    </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
    data(){
        return{
            position:{
                left:0,
                top:0
            },
            visible:false,
            seletedIndex:0,
            seletedItem:{},
            tags:[],
            comWidth:0,

        }
    },
    watch:{
        '$route':{
            handler(){
                this.visible = false
                this.getTags()
            }
        }
    },
    mounted(){
        this.initScroll()
        this.getTags()
    },

    methods:{
        itemHandler(e){
            let $index = e.target.dataset.index
            switch($index){
                case '1'://关闭当前
                    this.tags = this.tags.filter( (item,index) => {
                        return item.meta.title !== this.seletedItem.meta.title
                    })
                    this.visible = false
                    this.initRoute()
                break;

                case '2'://关闭其他
                    this.tags = this.tags.filter( (item,index) => {
                        return item.meta.title === this.seletedItem.meta.title
                    })
                    this.visible = false
                    this.initRoute()
                break;

                case '3'://关闭右侧
                    this.tags.splice(this.seletedIndex+1)
                    this.visible = false
                    this.initRoute()
                break;

                case '4'://关闭全部
                    this.tags = []
                    this.visible = false
                    this.initRoute()
                break;
            } 
        },
        //右键
        menuRight(e,index,item){
            this.seletedIndex = index
            this.seletedItem = item
            this.position = {
                left:e.clientX,
                top:e.clientY
            }
            this.visible = true
            return
        },
        // 初始化better-scroll
        initScroll(){
            this.$nextTick( () => {
                let warpper = document.querySelector('.tags') 
                new Bscroll(warpper,{
                    scrollX:true,
                    scrollY:false,
                    click:true,
                    mouseWheel:true
                })
                this.comWidth = 0
                let arr = Array.from(document.querySelector('.tags_con').children)
                for(let item of arr){
                    this.comWidth += item.offsetWidth+5
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
            this.initScroll()
        },
        closeTag(data){
            
            let index = this.tags.findIndex( (item) => {
                return item.meta && item.meta.title === data.meta.title 
            })
            
            this.tags.splice(index,1)
            this.initRoute()
        },
        initRoute(){
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


