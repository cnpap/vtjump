import{w as b,e as u,u as B,a as k}from"./index-D6qaaLhX.js";import{S as $,i as I,s as L,e as m,l as S,a as T,b as D,c as H,m as x,d as g,g as E,t as R,h as V,o as A}from"./index-Cs1X0r9B.js";import{H as z}from"./Header-orQ4rCsI.js";import"./Button-D8w-DnV3.js";function P(a){let t,e,n,s,r;return e=new z({props:{user:a[0]}}),e.$on("login",a[1]),e.$on("logout",a[2]),e.$on("createAccount",a[3]),{c(){t=m("article"),S(e.$$.fragment),n=T(),s=m("section"),s.innerHTML=`<h2>Pages in Storybook</h2> <p>We recommend building UIs with a
      <a href="https://blog.hichroma.com/component-driven-development-ce1109d56c8e" target="_blank" rel="noopener noreferrer"><strong>component-driven</strong></a>
      process starting with atomic components and ending with pages.</p> <p>Render pages with mock data. This makes it easy to build and review page states without
      needing to navigate to them in your app. Here are some handy patterns for managing page data
      in Storybook:</p> <ul><li>Use a higher-level connected component. Storybook helps you compose such data from the
        &quot;args&quot; of child component stories</li> <li>Assemble data in the page component from your services. You can mock these services out
        using Storybook.</li></ul> <p>Get a guided tutorial on component-driven development at
      <a href="https://storybook.js.org/tutorials/" target="_blank" rel="noopener noreferrer">Storybook tutorials</a>
      . Read more in the
      <a href="https://storybook.js.org/docs" target="_blank" rel="noopener noreferrer">docs</a>
      .</p> <div class="tip-wrapper"><span class="tip">Tip</span>
      Adjust the width of the canvas with the
      <svg width="10" height="10" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M1.5 5.2h4.8c.3 0 .5.2.5.4v5.1c-.1.2-.3.3-.4.3H1.4a.5.5 0
            01-.5-.4V5.7c0-.3.2-.5.5-.5zm0-2.1h6.9c.3 0 .5.2.5.4v7a.5.5 0 01-1 0V4H1.5a.5.5 0
            010-1zm0-2.1h9c.3 0 .5.2.5.4v9.1a.5.5 0 01-1 0V2H1.5a.5.5 0 010-1zm4.3 5.2H2V10h3.8V6.2z" id="a" fill="#999"></path></g></svg>
      Viewports addon in the toolbar</div>`,D(s,"class","storybook-page")},m(o,l){H(o,t,l),x(e,t,null),g(t,n),g(t,s),r=!0},p(o,[l]){const p={};l&1&&(p.user=o[0]),e.$set(p)},i(o){r||(E(e.$$.fragment,o),r=!0)},o(o){R(e.$$.fragment,o),r=!1},d(o){o&&V(t),A(e)}}}function j(a,t,e){let n=null;return[n,()=>e(0,n={name:"Jane Doe"}),()=>e(0,n=null),()=>e(0,n={name:"Jane Doe"})]}class _ extends ${constructor(t){super(),I(this,t,j,P,L,{})}}_.__docgen={version:3,name:"Page.svelte",data:[],computed:[],methods:[],components:[],description:null,keywords:[],events:[],slots:[],refs:[]};const M={title:"Example/Page",component:_,parameters:{layout:"fullscreen"}},c={},i={play:async({canvasElement:a})=>{const t=b(a),e=t.getByRole("button",{name:/Log in/i});await u(e).toBeInTheDocument(),await B.click(e),await k(()=>u(e).not.toBeInTheDocument());const n=t.getByRole("button",{name:/Log out/i});await u(n).toBeInTheDocument()}};var d,h,f;c.parameters={...c.parameters,docs:{...(d=c.parameters)==null?void 0:d.docs,source:{originalSource:"{}",...(f=(h=c.parameters)==null?void 0:h.docs)==null?void 0:f.source}}};var v,w,y;i.parameters={...i.parameters,docs:{...(v=i.parameters)==null?void 0:v.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const loginButton = canvas.getByRole('button', {
      name: /Log in/i
    });
    await expect(loginButton).toBeInTheDocument();
    await userEvent.click(loginButton);
    await waitFor(() => expect(loginButton).not.toBeInTheDocument());
    const logoutButton = canvas.getByRole('button', {
      name: /Log out/i
    });
    await expect(logoutButton).toBeInTheDocument();
  }
}`,...(y=(w=i.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};const U=["LoggedOut","LoggedIn"];export{i as LoggedIn,c as LoggedOut,U as __namedExportsOrder,M as default};
