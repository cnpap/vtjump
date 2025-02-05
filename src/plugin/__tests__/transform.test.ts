import { describe, it, expect } from 'vitest';
import { transformVueTemplate } from '../transform';

describe('transformVueTemplate', () => {
  // 基本功能测试
  it('should return null for non-vue files', () => {
    const result = transformVueTemplate('<div>test</div>', 'test.js');
    expect(result).toBeNull();
  });

  it('should return null for vue files without template', () => {
    const code = `
      <script>
        export default {}
      </script>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).toBeNull();
  });

  // HTML标签处理测试
  it('should add attributes to basic HTML tags', () => {
    const code = `
      <template>
        <div>Hello</div>
        <span>World</span>
      </template>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/data-vtjump="vtj-\d+"/);
    expect(result?.code).toMatch(/data-vtjump-line="\d+"/);
    expect(result?.code).toMatch(/data-vtjump-file="test.vue"/);
  });

  // 自闭合标签测试
  it('should handle self-closing tags correctly', () => {
    const code = `
      <template>
        <img src="test.jpg" />
        <input type="text" />
        <br />
      </template>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/<img[^>]*data-vtjump="vtj-\d+"[^>]*\/>/);
    expect(result?.code).toMatch(/<input[^>]*data-vtjump="vtj-\d+"[^>]*\/>/);
    expect(result?.code).toMatch(/<br[^>]*data-vtjump="vtj-\d+"[^>]*\/>/);
  });

  // Vue组件测试
  it('should not modify Vue components', () => {
    const code = `
      <template>
        <div>Basic div</div>
        <MyComponent>Custom component</MyComponent>
        <a-button>Arco component</a-button>
        <el-input />
      </template>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/<div[^>]*data-vtjump="vtj-\d+"/);
  });

  // 复杂场景测试
  it('should handle complex nested structures', () => {
    const code = `
      <template>
        <div class="container">
          <header>
            <h1>Title</h1>
            <nav>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </nav>
          </header>
          <main>
            <article>
              <h2>Article Title</h2>
              <p>Paragraph text</p>
              <img src="test.jpg" />
            </article>
          </main>
          <a-layout>
            <a-layout-header>Header</a-layout-header>
            <div>Content</div>
          </a-layout>
        </div>
      </template>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).not.toBeNull();

    // 应该修改的标签
    const shouldModify = [
      'div',
      'header',
      'h1',
      'nav',
      'ul',
      'li',
      'main',
      'article',
      'h2',
      'p',
      'img',
    ];
    for (const tag of shouldModify) {
      expect(result?.code).toMatch(new RegExp(`<${tag}[^>]*data-vtjump="vtj-\\d+"`));
    }
  });

  // 特殊属性测试
  it('should handle tags with special attributes', () => {
    const code = `
      <template>
        <div v-if="show">Conditional</div>
        <span v-for="item in items" :key="item.id">{{ item.name }}</span>
        <input v-model="value" />
        <button @click="handleClick">Click me</button>
      </template>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/<div[^>]*v-if="show"[^>]*data-vtjump="vtj-\d+"/);
    expect(result?.code).toMatch(/<span[^>]*v-for="item in items"[^>]*data-vtjump="vtj-\d+"/);
    expect(result?.code).toMatch(/<input[^>]*v-model="value"[^>]*data-vtjump="vtj-\d+"/);
    expect(result?.code).toMatch(/<button[^>]*@click="handleClick"[^>]*data-vtjump="vtj-\d+"/);
  });

  // 已有data-vtjump属性的标签测试
  it('should not modify tags that already have data-vtjump', () => {
    const code = `
      <template>
        <div data-vtjump="existing">Should not change</div>
        <span>Should change</span>
      </template>
    `;
    const result = transformVueTemplate(code, 'test.vue');
    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/<div[^>]*data-vtjump="existing"[^>]*>/);
    expect(result?.code).toMatch(/<span[^>]*data-vtjump="vtj-\d+"[^>]*>/);
  });
});
