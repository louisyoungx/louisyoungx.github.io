import{l as p,_ as y,f as C,g as L,k as w,o as u,a as g,m as v,I as $,s as R,i as h,e as A,t as _,F as T,r as I,b as m,d as f,w as B,j as N,h as S,C as b}from"./app.b5660828.js";import{P as V}from"./PageHeader.e4a7eecb.js";import{u as k,g as j,f as z}from"./useBlog.767b9bc3.js";import"./resolveTime.439cd54d.js";const x=n=>{if(n.length===4){const e=/\w+/.exec(n);for(const t in e)e[t]=e[t]+e[t];n=e.join("")}const l=/(\w{2})(\w{2})(\w{2})/.exec(n);return[parseInt(l[1],16),parseInt(l[2],16),parseInt(l[3],16)]},D=n=>{const l=n.map(e=>{let t=e.toString(16);return t=t.length===1?"0"+t:t,t});return"#"+l.join("")},F=(n,l,e)=>{const t=x(n);return x(l).map((c,r)=>(c-t[r])/e)},H=(n,l,e)=>{const t=x(n).map((c,r)=>{let o=Math.round(c+l[r]*e);return o>255?o=255:o<0&&(o=0),o});return D(t)},M=(n="#a5a5e4",l="#4388c4")=>{const{posts:e}=k(),t=p(()=>{const r={};for(const a of e.value){const s=a.frontmatter;for(const i of s.tags)r[i]===void 0&&(r[i]=[]),r[i].push(a)}const o=[];for(const a in r){const s={};s.pages=r[a],s.name=a,s.path=`/tags/${a}`,o.push(s)}return o.sort((a,s)=>s.pages.length-a.pages.length),o}),c=p(()=>{if(t.value.length===0)return[];const r=t.value[t.value.length-1].pages.length,o=t.value[0].pages.length,a=Math.max(o-r,1),s=F(n,l,a),i=t.value;for(const d of i){const P=d.pages.length-r;d.tagColor=H(n,s,P)}return i});return{tags:t,tagsWithColor:c}},W=["onClick"],E={key:0},G={key:1},U=C({__name:"TagList",props:{currentTag:{type:String,default:""}},setup(n){const l=L(),e=w(),t=M(),{posts:c}=k(),r=p(()=>[{name:l.value.showAllTagsText,path:"/tags/"},...t.tagsWithColor.value]);return(o,a)=>(u(!0),g(T,null,v(h(r),(s,i)=>(u(),g("span",{key:i,class:$(["article-tag",{active:s.name==n.currentTag,"tag-all":s.path=="/tags/"}]),style:R({backgroundColor:s.tagColor}),onClick:d=>h(e).push(s.path)},[A(_(s.name)+" ",1),s.path=="/tags/"?(u(),g("sup",E,_(h(c).length),1)):(u(),g("sup",G,_(s.pages.length),1))],14,W))),128))}});var Y=y(U,[["__file","TagList.vue"]]);const q={class:"year"},J={class:"title"},K={key:0,class:"subtitle"},O=m("hr",null,null,-1),Q=C({__name:"TagPostList",props:{data:{type:Array,default:()=>[]}},setup(n){return(l,e)=>{const t=I("RouterLink");return u(!0),g(T,null,v(n.data,(c,r)=>(u(),g("section",{key:r},[m("span",q,_(c.year),1),(u(!0),g(T,null,v(c.data,(o,a)=>(u(),g("div",{key:a,class:"item"},[f(t,{to:o.path},{default:B(()=>[m("p",J,_(o.frontmatter.title),1),o.frontmatter.subtitle?(u(),g("p",K,_(o.frontmatter.subtitle),1)):N("",!0)]),_:2},1032,["to"]),O]))),128))]))),128)}}});var X=y(Q,[["__file","TagPostList.vue"]]);const Z={class:"tags-wrapper"},tt=C({__name:"Tags",setup(n){const l=w(),e=L(),{posts:t}=k(),c=p(()=>{const a=decodeURI(l.currentRoute.value.path.replace(/\/tags/g,"").replace(/\//g,""));return a===""?e.value.showAllTagsText:a}),r=p(()=>{const a=c.value===e.value.showAllTagsText?"":c.value;return j(z(t.value,a))}),o=p(()=>{var s;const a=e.value.pages&&e.value.pages.tags?e.value.pages.tags:{};return a.title===void 0&&(a.title=(s=e.value.pageText)==null?void 0:s.tags),a});return(a,s)=>(u(),S(b,null,{page:B(()=>[f(V,{"page-info":h(o)},null,8,["page-info"]),m("div",Z,[f(Y,{"current-tag":h(c)},null,8,["current-tag"]),f(X,{data:h(r)},null,8,["data"])])]),_:1}))}});var nt=y(tt,[["__file","Tags.vue"]]);export{nt as default};