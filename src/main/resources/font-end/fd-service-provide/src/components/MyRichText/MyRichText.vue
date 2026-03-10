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
      :value="htmlContent"
      @input="e=>$emit('input', e)"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

import { imageUploadServer } from '@/settings'

export default {
  name: 'MyRichText',
  components: { Editor, Toolbar },
  props: {
   value: {
      type: String,
      default: ''
    }, 
  },
  data() {
    return {
      editor: null,
      htmlContent: '',
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
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
            //   // res 即服务端的返回结果
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

              const formData = new FormData()
              formData.append('image', file)

              try {
                const response = await fetch(imageUploadServer, {
                  method: 'POST',
                  body: formData
                })

                console.log('----------------')
                console.log(response)
                const data = await response.json()
                console.log(data)
                // document.getElementById('result').innerText = `Image URL: ${data.url}`

                let url = data[0]
                insertFn(url, '测试图片', 'http://www.qq.com')
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
        this.htmlContent = html
        this.$emit('blur', html)
      })

      this.editor.on('scroll', () => { console.log('scroll') })


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

.w-e-full-screen-container{
  z-index: 9999;
}
</style>
