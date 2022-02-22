const path = require("path");

module.exports = {
  title: "Louis Young (@louisyoungx)",
  description: "Louis's blog, powered by VuePress, themed by Gungnir.",
  head: [
    ["link", { rel: "icon", href: "/img/logo.svg" }],
    ["link", { rel: "shortcut icon", type: "image/png", href: "/img/logo/favicon-16x16.png" }],
    ["link", { rel: "mask-icon", type: "image/png", href: "/img/logo/favicon-32x32.png"}],
    ["link", { rel: "apple-touch-icon", href: "/img/logo/apple-touch-icon.png" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  theme: "gungnir",
  themeConfig: {
    repo: "louisyoungx/louisyoungx.github.io",
    docsDir: "blog",
    docsBranch: "master",
    editLinks: true,
    lastUpdated: true,
    hitokoto: {
      api: "https://v1.hitokoto.cn/?c=c&c=d&c=h&c=i&c=j&c=k"
    },
    searchIcon: "ri-search-2-line",
    codeTheme: "gungnir-dark",
    rss: {
      site_url: "https://rocke.top",
      copyright: "louisyoungx 2018-2021",
      count: 20
    },
    comment: {
      owner: "louisyoungz",
      repo: "gitalk-comments",
      clientId: "ddc15aed4656e1bb2733",
      clientSecret: "d2341e141193423f44c86625c165bdad3c488613"
    },
    analytics: {
      ga: "G-PQTY6HBG27",
      ba: "2e2c8699088629e7ee784fefe7da5621"
    },
    katex: true,
    mdPlus: {
      all: true
    },
    readingTime: {
      excludes: ["/about", "/tags/.*", "/links"]
    },
    nav: [
      {
        text: "Home",
        link: "/",
        icon: "fa-fort-awesome"
      },
      {
        text: "About",
        link: "/about/",
        icon: "fa-paw"
      },
      {
        text: "Tags",
        link: "/tags/",
        icon: "fa-tag"
      },
      // {
      //   text: "Links",
      //   link: "/links/",
      //   icon: "fa-satellite-dish"
      // },
      {
        text: "Portfolio",
        link: "https://github.com/louisyoungx/",
        icon: "ri-space-ship-fill"
      }
    ],
    personalInfo: {
      name: "louisyoungx",
      avatar: "/img/avatar.jpg",
      description: "Coding for fun.  if-else porter / TypeError creator",
      sns: {
        github: "louisyoungx",
        linkedin: "louis-young-4395b0221",
        facebook: "louisyoungx",
        twitter: "louisyoungx",
        zhihu: "gao-ji-tun-mao-shi",
        email: "eric_aaron@icloud.com"
      }
    },
    homeHeaderImages: {
      local: [
        {
          path: "/img/home-bg/1.jpg",
          mask: "rgba(40, 57, 101, .4)"
        },
        {
          path: "/img/home-bg/2.jpg",
          mask: "rgba(196, 176, 131, .1)"
        },
        {
          path: "/img/home-bg/3.jpg",
          mask: "rgba(68, 74, 83, .1)"
        },
        {
          path: "/img/home-bg/4.jpg",
          mask: "rgba(19, 75, 50, .2)"
        },
        {
          path: "/img/home-bg/5.jpg"
        }
      ]
    },
    pages: {
      tags: {
        title: "Tags",
        subtitle: "Black Sheep Wall",
        bgImage: {
          path: "/img/pages/tags.jpg",
          mask: "rgba(211, 136, 37, .5)"
        }
      },
      links: {
        title: "Links",
        subtitle:
          "When you are looking at the stars, please put the brightest star shining night sky as my soul.",
        bgImage: {
          path: "/img/pages/links.jpg",
          mask: "rgba(64, 118, 190, 0.5)"
        }
      }
    },
    footer: `
      &copy; <a href="https://github.com/louisyoungx" target="_blank">louisyoungx</a> 2018-2021
      <br>
      Powered by <a href="https://vuepress.vuejs.org" target="_blank">VuePress</a> &
      <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
    `
  },
  markdown: {
    // lineNumbers: true,
    extractHeaders: ["h2", "h3", "h4", "h5"]
  },
  configureWebpack: () => {
    return {
      resolve: {
        alias: {
          public: path.resolve(__dirname, "./public")
        }
      }
    };
    // const NODE_ENV = process.env.NODE_ENV;
    // if (NODE_ENV === "production") {
    //   return {
    //     output: {
    //       publicPath:
    //         "https://cdn.jsdelivr.net/gh/louisyoungx/louisyoungx.github.io@gh-pages/"
    //     },
    //     resolve: {
    //       alias: {
    //         public: path.resolve(__dirname, "./public")
    //       }
    //     }
    //   };
    // } else {
    //   return {
    //     resolve: {
    //       alias: {
    //         public: path.resolve(__dirname, "./public")
    //       }
    //     }
    //   };
    // }
  }
};
