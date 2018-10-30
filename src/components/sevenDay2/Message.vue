<template>
    <div class="message-container">
        <div class="portrait" :style="{float: messageDataSource.direction}">
            <img src="../../assets/portrait.jpg" />
        </div>
        <div class="message-content" :style="directionStyle.leftRight">
            <div class="arrow" :style="directionStyle.arrowStyle" ></div>
            <div class="top" >
                <div class="student-name" :style="{float: messageDataSource.direction}">
                    {{messageDataSource.name}}
                </div>
                <div class="message-time" :style="{float: messageDataSource.direction==='left'?'right':'left'}">
                    {{messageDataSource.date}}
                </div>
            </div>
            <div class="bottom" :style="{textAlign: messageDataSource.direction}">
                {{messageDataSource.message}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        messageDataSource: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {

        };
    },
    computed: {
        directionStyle() {
            return {
                leftRight: {
                    float: this.messageDataSource.direction,
                    'margin-left': this.messageDataSource.direction === 'left' ? '18px' : '0px',
                    'margin-right': this.messageDataSource.direction === 'right' ? '18px' : '0px',
                },
                arrowStyle: {
                    [this.messageDataSource.direction]: '-15px',
                    'border-left': this.messageDataSource.direction === 'left' ? '15px solid transparent' : '0px solid transparent',
                    'border-right': this.messageDataSource.direction === 'right' ? '15px solid transparent' : '0px solid transparent',
                },
            };
        },
    },
};
</script>

<style lang="less" scoped>
    @font-size: 20px;

    .message-container{
        width: 100%;
        min-height: 50px;
        background: orangered;
        overflow: hidden;
        margin-bottom: 10px;
        .portrait{
            width: 40px;
            height: 50px;
            overflow: hidden;
            box-sizing: border-box;
            padding-left: 5px;
            float: left;
            img{
                display: block;
                width: 30px;
                border-radius: 50%;
            }
        }
        .message-content{
            float: left;
            margin-left: 18px;
            width: 612px;
            border-radius: 5px;
            background: blanchedalmond;
            border: 1px solid #eee;
            box-sizing: border-box;
            position: relative;
            .arrow{
                width: 0;
                height: 0;
                border-top: 16px solid blanchedalmond;
                position: absolute;
                top: 8px;
            }
            .top{
                font-size: @font-size;
                line-height: 10px;
                padding: 8px 25px 1px;
                overflow: hidden;
                font-family: 'Courier New', Courier, monospace;
                .student-name{
                    color: rgb(22, 80, 236);
                }
                .message-time{}
            }
            .bottom{
                min-height: 30px;
                margin: 0 auto;
                width: 580px;
                box-sizing: border-box;
                padding: 3px 10px;
                font-size: 10px;
            }
        }
    }
</style>
