/**
 * git do not control webim.config.js
 * everyone should copy webim.config.js.demo to webim.config.js
 * and have their own configs.
 * In this way , others won't be influenced by this config while git pull.
 *
 */
var WebIM = {}
WebIM.config = {
  /*
   * XMPP server
   */
  xmppURL: 'im-api.easemob.com',
  /*
   * Backend REST API URL
   */
  apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
  /*
   * Application AppKey
   */
  appkey: '1106190415055331#test',

  /*
   * Whether to use wss
   * @parameter {Boolean} true or false
   */
  https: false,
  /*
   * isMultiLoginSessions
   * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
   * false: A visitor can sign in to only one webpage and receive messages at the webpage.
   */
  isMultiLoginSessions: true,
  /*
   * set presence after login
   */
  isAutoLogin: true,
  /**
   * Whether to use window.doQuery()
   * @parameter {Boolean} true or false
   */
  isWindowSDK: false,
  /**
   * isSandBox=true:  xmppURL: 'im-api-sandbox.easemob.com',  apiURL: '//a1-sdb.easemob.com',
   * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
   * @parameter {Boolean} true or false
   */
  isSandBox: false,
  /**
   * Whether to console.log in strophe.log()
   * @parameter {Boolean} true or false
   */
  isDebug: false,
  /**
   * will auto connect the xmpp server autoReconnectNumMax times in background when client is offline.
   * won't auto connect if autoReconnectNumMax=0.
   */
  autoReconnectNumMax: 2,
  /**
   * the interval seconds between each auto reconnectting.
   * works only if autoReconnectMaxNum >= 2.
   */
  autoReconnectInterval: 2,
  /**
   * webrtc supports WebKit and https only
   */
  isWebRTC: (/Firefox/.test(navigator.userAgent) || /WebKit/.test(navigator.userAgent)) && /^https\:$/.test(window.location.protocol),
  /**
   * after login, send empty message to xmpp server like heartBeat every 45s, to keep the ws connection alive.
   */
  heartBeatWait: 4500,
  /**
   * while http access,use ip directly,instead of ServerName,avoiding DNS problem.
   */
  isHttpDNS: false,

  /**
   * Will show the status of messages in single chat
   * msgStatus: true  show
   * msgStatus: true  hide
   */
  msgStatus: true,

  /**
   * When a message arrived, the receiver send an ack message to the
   * sender, in order to tell the sender the message has delivered.
   * See call back function onReceivedMessage
   */
  delivery: false,

  /**
   * When a message read, the receiver send an ack message to the
   * sender, in order to tell the sender the message has been read.
   * See call back function onReadMessage
   */
  read: true,

  /**
   * When a message sent or arrived, will save it into the localStorage,
   * true: Store the chat record
   * false: Don't store the chat record
   */
  saveLocal: true,

  /**
   * Will encrypt text message and emoji message
   * {type:'none'}   no encrypt
   * {type:'base64'} encrypt with base64
   * {type:'aes',mode: 'ebc',key: '123456789easemob',iv: '0000000000000000'} encrypt with aes(ebc)
   * {type:'aes',mode: 'cbc',key: '123456789easemob',iv: '0000000000000000'} encrypt with aes(cbc)
   */
  encrypt: {
    type: 'none'
  },

  emoConfig: {
    path: '/static/global/plugins/easemob/faces/',
    map: {
      '\\[\\):\\]': 'ee_1.png',
      '\\[\\:D\\]': 'ee_2.png',
      '\\[;\\)\\]': 'ee_3.png',
      '\\[\\:\\-o\\]': 'ee_4.png',
      '\\[\\:p\\]': 'ee_5.png',
      '\\[\\(H\\)\\]': 'ee_6.png',
      '\\[\\:@\\]': 'ee_7.png',
      '\\[\\:s\\]': 'ee_8.png',
      '\\[\\:\\$\\]': 'ee_9.png',
      '\\[\\:\\(\\]': 'ee_10.png',
      '\\[:\'\\(\\]': 'ee_11.png',
      '\\[:\\|\\]': 'ee_18.png',
      '\\[\\(a\\)\\]': 'ee_13.png',
      '\\[8o\\|\\]': 'ee_14.png',
      '\\[8\\-\\|\\]': 'ee_15.png',
      '\\[\\+o\\(\\]': 'ee_16.png',
      '\\[\\<o\\)\\]': 'ee_12.png',
      '\\[\\|\\-\\)\\]': 'ee_17.png',
      '\\[\\*\\-\\)\\]': 'ee_19.png',
      '\\[\\:\\-#\\]': 'ee_20.png',
      '\\[\\:\\-\\*\\]': 'ee_22.png',
      '\\[\\^o\\)\\]': 'ee_21.png',
      '\\[8\\-\\)\\]': 'ee_23.png',
      '\\[\\(\\|\\)\\]': 'ee_24.png',
      '\\[\\(u\\)\\]': 'ee_25.png',
      '\\[\\(S\\)\\]': 'ee_26.png',
      '\\[\\(\\*\\)\\]': 'ee_27.png',
      '\\[\\(#\\)\\]': 'ee_28.png',
      '\\[\\(R\\)\\]': 'ee_29.png',
      '\\[\\({\\)\\]': 'ee_30.png',
      '\\[\\(}\\)\\]': 'ee_31.png',
      '\\[\\(k\\)\\]': 'ee_32.png',
      '\\[\\(F\\)\\]': 'ee_33.png',
      '\\[\\(W\\)\\]': 'ee_34.png',
      '\\[\\(D\\)\\]': 'ee_35.png'
    }
  }
}
