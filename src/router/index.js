import Vue from 'vue'
import Router from 'vue-router'
// import Seven from '@/components/sevenDay/index.vue'


import Player from '../components/sevenDay2/Player.vue'

Vue.use(Router)

const router = new Router({

    routes: [
       
        {
            path: '/',
            name: 'Player',
            component: Player
        }
        
    ]
})

export default router