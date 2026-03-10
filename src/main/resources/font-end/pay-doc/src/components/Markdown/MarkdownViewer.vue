<!-- components/MarkdownViewer.vue -->
<template>
  <div class="markdown-container">
    <!-- 左侧内容 -->
    <div class="markdown-body" @scroll="handleScroll" >
      <!-- :highlight="highlight" -->
      <vue-markdown :source="content" ></vue-markdown>
      <!-- @rendered="extractHeadings" -->
    </div>

    <!-- 右侧导航栏 -->
    <div class="markdown-toc" v-if="headings.length > 0">
      <h3 style="padding-left: 40px;" >目录</h3>
      <ul>
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="{
            'level-1': heading.level === 1,
            'level-2': heading.level === 2,
            'level-3': heading.level === 3,
            'curr-item': heading.current,
          }"
        >
          <a :href="'#' + heading.id" @click.prevent="scrollTo(heading.id)">{{
            heading.text
          }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import VueMarkdown from "vue-markdown";
import hljs from "highlight.js";
// import "highlight.js/styles/github.css";

export default {
  components: {
    VueMarkdown,
  },
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      markdownContent: "",
      headings: [], // 存储提取的标题
    };
  },
  methods: {
    handleScroll(event) {
      const scrollTop = event.target.scrollTop; // 滚动距离
      // const scrollHeight = event.target.scrollHeight; // 内容总高度
      // const clientHeight = event.target.clientHeight; // 可视区域高度
      
      // console.log('滚动位置:', scrollTop);
      for (let index = 0; index < this.headings.length; index++) {
        const element = this.headings[index];
        if (element.y < scrollTop + 100) {
          this.headings.forEach((item) => {
            item.current = false;
          }); 
          element.current = true;
        }
        
      }
      
      // 判断是否滚动到底部
      // if (scrollTop + clientHeight >= scrollHeight - 10) {
      //   console.log('接近底部，可触发加载更多');
      // }
    },
    // 代码高亮
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },

    // 提取 Markdown 中的标题
    extractHeadings() {
      console.log("extractHeadings-------");
     
      this.headings = [];
      const headers = document.querySelectorAll(
        ".markdown-body h2, .markdown-body h3, .markdown-body h1"
      );

      if(headers.length === 0){
        setTimeout(() => {
          this.extractHeadings();
        }, 200);
      }

      headers.forEach((header,index) => {
        // 确保标题有 id 属性
        if (!header.id) {
          header.id = "heading-" + Date.now() + "-" + this.headings.length;
        }

        this.headings.push({
          id: header.id,
          text: header.textContent,
          y: header.offsetTop,
          current: index === 0,
          level: parseInt(header.tagName.charAt(1)), // H2 -> 2, H3 -> 3
        });
      });

      // console.log("-----extractHeadings------", this.headings);
    },

    // 滚动到指定标题
    scrollTo(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "instant" });
      }
    },
  },
  mounted() {
    // this.loadMarkdown();
    setTimeout(() => {
      this.extractHeadings();
    }, 100);
  },
  async loadMarkdown() {
    // try {
    //   // 加载 assets 中的 md 文件
    //   const response = await fetch('/src/assets/article.md'); // 注意路径
    //   this.markdownContent = await response.text();
    // } catch (error) {
    //   console.error('加载 Markdown 文件失败:', error);
    // }
  },
};
</script>

<style>
/* @import '~highlight.js/styles/github.css'; */
@import "./md.css";

.markdown-container {
  display: flex;
  gap: 20px;
}

.markdown-toc {
  width: 200px;
  position: sticky;
  top: 20px;
  height: calc(100vh - 50px);
  overflow-y: auto;
  font-size: 14px;
}

.markdown-toc ul {
  list-style: none;
  padding-left: 20px;
}

.markdown-toc li {
  margin-bottom: 8px;
}
.markdown-toc li.curr-item a{
  color: #007bff;
}

.markdown-toc a {
  color: #333;
  text-decoration: none;
  transition: color 0.2s;
}

.markdown-toc a:hover {
  color: #007bff;

}
.level-1 {
  font-weight: bold;
}

.level-2 {
  font-weight: bold;
  padding-left: 10px;
}

.level-3 {
  padding-left: 20px;
}

.markdown-content {
  flex: 1;
}

/* Markdown 样式 */
.markdown-body {
  /* max-width: 1000px; */
  margin: 30px;
  flex: 1;
  background-color: #fbfbfb;
  padding: 20px 30px;
  height: calc(100vh - 110px);
  overflow-y: auto;
  box-sizing: border-box;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  scroll-margin-top: 20px; /* 滚动时的顶部间距 */
}
</style>
