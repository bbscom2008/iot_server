<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <!-- v-model="htmlContent" -->
    <Editor
      style="height: 500px; overflow-y: hidden"
      :value="value"
      @input="(e) => $emit('input', e)"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { imageUploadServer } from '@/settings'

import { uploadFileToServer, getFileById } from '@/api/upload'

export default {
  name: 'MyRichText',
  components: { Editor, Toolbar },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editor: null,
      // htmlContent: '',
      toolbarConfig: {
        //         toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ "headerSelect","blockquote","|","bold","underline","italic","color","bgColor","|","fontSize","fontFamily","lineHeight","|",
        //         "bulletedList","numberedList","todo",{
        //           iconSvg:"<svg viewBox=\"0 0 1024 1024\"><path d=\"M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z\"></path></svg>",
        // key:"group-justify",

        //         },"uploadVideo" ],
        toolbarKeys: [
          'headerSelect',
          'blockquote',
          '|',
          'bold',
          'underline',
          'italic',
          {
            key: 'group-more-style',
            title: '更多',
            iconSvg: `<svg viewBox="0 0 1024 1024"><path d="M204.8 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M505.6 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path><path d="M806.4 505.6m-76.8 0a76.8 76.8 0 1 0 153.6 0 76.8 76.8 0 1 0-153.6 0Z"></path></svg>`,
            menuKeys: ['through', 'code', 'sup', 'sub', 'clearStyle']
          },
          'color',
          'bgColor',
          '|',
          'fontSize',
          'fontFamily',
          'lineHeight',
          '|',
          'bulletedList',
          'numberedList',
          'todo',
          {
            key: 'group-justify',
            title: '对齐',
            iconSvg: `<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>`,
            menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify']
          },
          {
            key: 'group-indent',
            title: '缩进',
            iconSvg: `<svg viewBox="0 0 1024 1024"><path d="M0 64h1024v128H0z m384 192h640v128H384z m0 192h640v128H384z m0 192h640v128H384zM0 832h1024v128H0z m0-128V320l256 192z"></path></svg>`,
            menuKeys: ['indent', 'delIndent']
          },
          '|',
          'emotion',
          'insertLink',
          'uploadImage',
          'uploadVideo',
          'insertTable',
          'codeBlock',
          'divider',
          '|',
          'undo',
          'redo',
          '|',
          'fullScreen'
        ],
        // excludeKeys: [/* 隐藏哪些菜单 */]
      },
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          // https://www.wangeditor.com/v5/menu-config.html#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE
          uploadImage: {
            // base64LimitSize: 1000 * 1024 * 1024, // 1M
            // fieldName: 'your-custom-name',
            // meta: {
            //   token: 'xxx',
            //   otherKey: 'yyy'
            // },
            maxNumberOfFiles: 1,
            allowedFileTypes: ['image/*'],
            server: imageUploadServer,

            // 使用 editor 自带的上传功能，但自己解析返回结果，插入图片
            // customInsert(res, insertFn) {
            //   // res 即码商端的返回结果
            //   // 从 res 中找到 url alt href ，然后插入图片
            //   console.log(res);

            //   let url = res.imageUrl
            //   insertFn(url, '示例图片', 'href-data')
            // },
            // 自己实现上传功能，并解析结果，插入图片
            async customUpload(file, insertFn) {
              // file 即选中的文件
              // 自己实现上传，并得到图片 url alt href
              console.log(file)
              // let url = 'http://192.168.12.125:9532/static/img/zhifu-pay.d5c7b586.png'

              // const formData = new FormData()
              // formData.append('image', file)

              try {
                const res = await uploadFileToServer(file)

                const ret = await getFileById(res.data)

                // const response = await fetch(imageUploadServer, {
                //   method: 'POST',
                //   body: formData
                // })
                // console.log('----------------')
                // console.log(response)
                // const data = await response.json()
                // console.log(data)
                // document.getElementById('result').innerText = `Image URL: ${data.url}`
                insertFn(ret.data.fileUrl, ret.data.originalName)
              } catch (error) {
                console.error('Error:', error)
              }

              // 最后插入图片
            }

            // // 上传之前触发
            // onBeforeUpload(file) {
            //   // file 选中的文件，格式如 { key: file }
            //   return file
            //   // 可以 return
            //   // 1. return file 或者 new 一个 file ，接下来将上传
            //   // return false //  ，不上传这个 file
            // },
            // // 上传进度的回调函数
            // onProgress(progress) {
            //   // JS 语法
            //   // progress 是 0-100 的数字
            //   console.log('progress', progress)
            // },
            // // 单个文件上传成功之后
            // onSuccess(file, res) {
            //   console.log(`${file.name} 上传成功`, res)
            // },
            // // 单个文件上传失败
            // onFailed(file, res) {
            //   console.log(`${file.name} 上传失败`, res)
            // },
            // // 上传错误，或者触发 timeout 超时
            // onError(file, err, res) {
            //   console.log(`${file.name} 上传出错`, err, res)
            // }
          },
          uploadVideo: {
            // 自定义插入视频
            async customUpload(file, insertFn) {
              try {
                const res = await uploadFileToServer(file)

                const ret = await getFileById(res.data)

                insertFn(ret.data.fileUrl, ret.data.originalName)
              } catch (error) {
                console.error('Error:', error)
              }
            }
          }
        }
      },
      mode: 'default' // or 'simple'
      //--------------
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错

      this.editor.on('blur', () => {
        const html = this.editor.getHtml()
        console.log('-----myRichText----', html)

        // this.htmlContent = html
        this.$emit('blur', html)
      })

      this.editor.on('scroll', () => {
        console.log('scroll')
      })
    }
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
}
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style>
.w-e-full-screen-container {
  z-index: 9999;
}

.w-e-text-container {
  word-wrap: break-word;
  word-break: break-all;
}
</style>
