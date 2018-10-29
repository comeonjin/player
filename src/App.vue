<template>
    <div id="app" >
        <router-view  />
    </div>
    
</template>

<script>

export default {
    name: 'App',
    data(){
        return {}
    },
    components: {},
    created(){},
    mounted(){},
    destroyed(){},
    methods: {}

}
</script>

<style lang="less">
html,body{
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: #F2F2F2;
}

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}

</style>


