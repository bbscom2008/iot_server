<template>
  <div>
    <MarkdownViewer :content="markdownContent" />
  </div>
</template>

<script>
import MarkdownViewer from "@/components/Markdown/MarkdownViewer.vue";

export default {
  components: {
    MarkdownViewer,
  },
  data() {
    return {
      markdownContent:'markdownContent',
    };
  },
  async created() {
    // 在这里可以加载 Markdown 文件内容
    // const docPath = `/doc/api-rule.md`;
    const docPath = `/doc${this.$route.fullPath}.md`;
    const response = await fetch(docPath);
    let responseText = await response.text();
    responseText=responseText.replace(/\(imgs\//g, '(/doc/imgs/');

    this.markdownContent = responseText;
  },
};
</script>
