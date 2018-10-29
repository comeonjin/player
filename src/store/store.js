import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let Store = new Vuex.Store({
    state: {

        userToken: '',
        //用于播放的当前课程id
        currentCourseId: '',
        //用于播放的当前课节id
        currentKnowledgeId: '',
        //课程安排列表数据
        arrangeList: [],
        //用于购买完成页面显示的课程名称和上课时间显示
        courseName: '',
        courseStartTime: ''
    },
    getters: {

    },
    mutations: {
        updateList(state, payload){
            state.arrangeList = payload
        },
        setUserToken(state, payload){
            state.userToken = payload
        },
        setcurrentCourseId(state, payload){
            state.currentCourseId = payload
        },
        setcurrentKnowledgeId(state, payload){
            state.currentKnowledgeId = payload
        },
        //设置用于显示购课完成的finish页面的课程名称和首次上课时间
        setCourseFinish(state, payload){
            
        }
    }
})

export default Store