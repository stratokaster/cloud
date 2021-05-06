<template>
    <div class="select" :class="[selectActive ? 'active' : '', selectClass ? selectClass : '']" :id="id">
        <span class="select__icon">
            <i class="icon-ic-search"></i>
        </span>
        <input class="select__search" type="search" v-model.trim="searchInput" placeholder=" " @click="selectFocused">
        <span class="select__label" v-if="!selectedList || selectedList.length == 0">
            {{selectLabel}}
        </span>
        <span v-if="selectedItems || selectedList" class="select__selected_items">
            {{selectedItems}}
        </span>
        <div class="select__dropdown">
            <div v-if="filter">
                <v-bar  wrapper="scroll_wrap">
                    <div>
                        <ul class="select__list" ref="select">
                            <li v-show="showSelectAll" data-value="all" :class="['select__item', activeAllOption ? 'selected' : '']" @click="selectAll()">{{selectAllText}}</li>
                            <li
                                v-for="(item, index) in filter"
                                :key="index"
                                :data-value="item.value"
                                @click="selectOption(item)"
                                :class="['select__item', item.selected ? 'selected' : '']"
                            >{{item.label}}</li>
                        </ul>
                    </div>
                </v-bar>
                <div class="select__confimation p14">
                    <div class="space_around__14">
                        <button class="btn btn__bordered" @click="cancelSelect($event)">Cancel</button>
                        <button class="btn btn__primary" @click="shareSelected($event)" :disabled="!!!selectedList.length">{{shareButton}}</button>
                    </div>
                </div>
            </div>
            <div v-else class="empty_data">There is no data</div>
        </div>
    </div>
</template>
<script>
import VBar from 'v-bar'
export default {
    data: ()=>({
        searchInput: '',
        select: [],
        selectedItemsNames: '',
        selectActive: false,
        selectedList: []
    }),
    components: {
        VBar: VBar
    },
    model: {
        prop: 'selected',
        event: 'click'
    },
    props: {
        id: String,
        selectClass: String,
        selectLabel: {
            type: String,
            default: 'Select Item'
        },
        selectList: {
            type: Array,
            required: true
        },
        selected: {
            type: Array
        },
        selectAllText: {
            type: String,
            default: 'Select All Items'
        },
        showSelectAll: {
            type: Boolean,
            default: true
        },
        shareButton: {
            type: String,
            default: 'Share'
        }
    },
    watch: {
        selectedList(val){
            for(let item of this.select){
                item.selected = false;
                for(let selectedItem of val){
                    if(item.value == selectedItem.value){
                        item.selected = true;
                    }
                }
            }
        },
        activeAllOption(val){
            if(val){
                this.selectAll;
            }
        }
    },
    computed:{
        filter(){
            if(this.searchInput){
                return this.select.filter((item)=>{
                    return item.label.match(this.searchInput);
                })
            }
            return this.select;
        },
        selectedItems(){
            this.selectedItemsNames = this.selectedList.map(item => item.label).join(', ');
            return this.selectedItemsNames;
        },
        activeAllOption(){
            return this.selectedList.length == this.select.length
        }
    },
    created(){
        if(this.selectList){
            this.select = this.selectList;
        }
        if(this.selected){
            this.selectedList = this.selected;
        }
    },
    mounted(){
        // click outside elementA
        const onClickOutside = e => this.selectActive = this.$el.contains(e.target) && this.selectActive;
        document.addEventListener('click', onClickOutside);
        this.$on('hook:beforeDestroy', () => document.removeEventListener('click', onClickOutside));
    },
    methods: {
        selectOption(item, index){
            item.selected = !item.selected
            this.selectedList.length = 0;
            this.select.forEach(itm=>{
                if(itm.selected){
                    this.selectedList.push(itm)
                }
            })
            if(this.selectedList.length == 0){
                this.selectedItemsNames = ''
            }
        },
        selectAll(){
            this.selectedList.length = 0;
            this.select.forEach(item=>{
                item.selected = true;
                this.selectedList.push(item);
            })
        },
        selectFocused(){
            this.selectActive = true;
        },
        cancelSelect(){
            if(this.selected){
                this.selectedList = this.selected;
            }else{
                this.selectedList = []
                this.select.forEach(item=>{
                    item.selected = false;
                })
                this.selectedItemsNames = '';
            }
            this.selectActive = false;
        },
        shareSelected(){
            this.$emit('share:click', this.selectedList);
            this.selectActive = false;
        }
    }
}
</script>
<style scoped lang="sass" src="./select.sass"></style>