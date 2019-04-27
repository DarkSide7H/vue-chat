<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>
          <div style="height: 480px;">
            <el-row style="height: 100%;">
              <el-col :span="4" style="height: 100%;">
                <el-card style="height: 100%; text-align: left">
                  <div class="chatting-roster-group-list">
                    <span class="title">好友</span>
                    <ul>
                      <li v-for="(roster, index) in rosterList" :key="index" @click="toChats(roster)">{{roster.name}}</li>
                    </ul>
                  </div>
                  <div class="chatting-roster-group-list">
                    <span class="title">群组</span>
                    <ul>
                      <li v-for="(group, index) in groupList" :key="index" @click="toChats(group)"> {{group.groupname}}</li>
                    </ul>
                  </div>
                </el-card>
              </el-col>
              <!-- 聊天信息 -->
              <el-col :span="20">
                <el-row>
                  <el-col :span="24">
                    <div style="width: 100%; text-align: left;">
                      <span style="font-weight: 400">To => <span style="color: blue"> {{imTo.toName}} </span></span>
                    </div>
                    <el-scrollbar v-on:scroll.native="scrollHandler"  ref="chattingContent" class="chatting-content">
                      <div v-for="(item, index) in charts" :key="index">
                        <div v-if="item.from" class="chatting-item clearfix" :class="item.className">
                          <div class="msg-date">
                            {{ item.timeStr }}
                          </div>
                          <div class="msg-from">
                            <span class="msg-author">{{ item.from}}</span>
                            <img src="/static/images/im/kf-default.png" alt="">
                          </div>
                          <div class="msg-content">
                            <Aplayer
                              v-if="item.objectURL && item.fileType == 'audio'"
                              mini
                              :music="{
                               src: item.objectURL
                              }"
                            ></Aplayer>
                            <Viewer v-if="item.url && item.fileType == 'image'" :images="[item.url]">
                              <img :src="item.url" width="200px"/>
                            </Viewer>
                            <span v-if="item.sourceMsg" v-html="item.sourceMsg"></span>
                          </div>
                        </div>
                      </div>
                    </el-scrollbar>
                  </el-col>
                </el-row>
                <!-- 输入区域 -->
                <el-row>
                  <el-col :span="20">
                    <div class="chatting-input">
                      <el-input type="textarea" @keyup.enter.native="sendMessage" ref="textarea" v-model.trim="txt"></el-input>
                    </div>
                  </el-col>
                  <el-col :span="2" style="text-align: center">
                    <label class="chatting-btn-file">
                      <input :disabled="!imTo.toName" @change="sendImageMessage($event)" ref="imageInput"
                             type="file"
                             multiple="false">
                      <el-button :disabled="!imTo.toName" type="success" style="margin-top: 5px;">上传图片</el-button>
                    </label>
                  </el-col>
                  <el-col :span="2" style="text-align: center">
                    <el-button type="success" style="margin-top: 5px;" @click="sendMessage" :disabled="!imTo.toName">发送</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import Viewer from '@/components/Viewer'
import Easemob from '@/utils/Easemob'
import {mapGetters} from 'vuex'
export default {
  name: 'HelloWorld',
  components: {
    Viewer
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      im: new Easemob(),
      txt: '',
      wrap: null,
      imTo: {
        chatType: '',
        toName: '',
        toId: ''
      },
      fileTrigger: true
    }
  },
  created () {
    // 初始im
    this.initIm()
  },
  mounted () {
    const chatsScrollBar = this.$refs['chatsScrollBar']
    if (chatsScrollBar) {
      this.wrap = chatsScrollBar.$refs['wrap']
      this.wrap.addEventListener('scroll', this.scrollHandler)
    }
  },
  computed: {
    // 用户
    rosterList () {
      return this.GET_IM_CHART_ROSTERLIST || []
    },
    groupList () {
      return this.GET_IM_CHART_GROUPLIST || []
    },
    // 聊天数据
    charts () {
      return this.GET_IM_CHART_DIALOG_GROUP_MESSAGE(this.imTo.toId) || []
    },
    ...mapGetters({
      GET_IM_CHART_ROSTERLIST: 'GET_IM_CHART_ROSTERLIST',
      GET_IM_CHART_GROUPLIST: 'GET_IM_CHART_GROUPLIST',
      GET_IM_CHART_DIALOG_GROUP_MESSAGE: 'GET_IM_CHART_DIALOG_GROUP_MESSAGE',
      GET_IM_CHART_DIALOG_GROUP_ID: 'GET_IM_CHART_DIALOG_GROUP_ID'
    })
  },
  watch: {
    charts (val, oldVal) {
      this.scrollToBottom()
    }
  },
  methods: {
    initIm () {
      // im 登陆
      this.im.login('test1', '123456')
    },
    // 发送消息
    sendMessage () {
      if (this.imTo.chatType === 'single') {
        // 会话
        this.im.sendTextMessage(this.txt, this.imTo.toId, () => {
          this.txt = ''
        })
      } else {
        // 组
        this.im.sendTextMessageGroup(this.txt, this.imTo.toId, () => {
          this.txt = ''
        })
      }
    },
    // 发送图片消息
    sendImageMessage () {
      if (!this.imTo.toId) {
        alert('发送对象必须')
        return
      }
      this.im.sendGroupImageMessage(this.$refs.imageInput, this.imTo.toId, () => {
        this.fileTrigger = !this.fileTrigger
        this.$nextTick(_ => {
          this.fileTrigger = !this.fileTrigger
        })
      })
    },
    toChats (opt) {
      if (opt.groupid) {
        this.imTo = {
          chatType: 'group',
          toId: opt.groupid,
          toName: opt.groupname
        }
      } else {
        this.imTo = {
          chatType: 'single',
          toId: opt.name,
          toName: opt.name
        }
      }
    },
    scrollHandler () {},
    // 滚动到底
    scrollToBottom () {
      this.$nextTick(_ => {
        this.$refs['chattingContent'].wrap.scrollTop = this.$refs['chattingContent'].wrap.scrollHeight
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }

</style>
