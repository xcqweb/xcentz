import Vue from 'vue'
import {
    Form,
    FormItem,
    Input,
    Icon,
    Button,
    Message,
    Upload,
    Menu,
    Submenu,
    MenuItem,
    MenuGroup,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
    Tag,
    Poptip,
    DropdownMenu,
    Dropdown,
    DropdownItem,
    Table,
    Modal,
    Tree,
    Tooltip,
    Select,
    Option
} from 'iview'

// Vue.prototype.$Loading = LoadingBar;
Vue.prototype.$Message = Message;
Vue.prototype.$Modal = Modal;
// Vue.prototype.$Modal = Modal;
// Vue.prototype.$Notice = Notice;
// Vue.prototype.$Spin = Spin;

let modules = [
    Form,
    FormItem,
    Input,
    Icon,
    Button,
    Upload,
    Menu,
    Submenu,
    MenuItem,
    MenuGroup,
    Row,
    Col,
    Breadcrumb,
    BreadcrumbItem,
    Tag,
    Poptip,
    DropdownMenu,
    Dropdown,
    DropdownItem,
    Table,
    Modal,
    Tree,
    Tooltip,
    Select,
    Option
]

for(let item of modules){
    Vue.component(item.name,item)
}