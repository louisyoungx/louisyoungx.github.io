const isProd = process.env.NODE_ENV === "production";

module.exports = {
  title: "Louis Young (@louisyoungx)",
  description: "Louis Young a Web developer and Python full stack developer.",

  head: [
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/img/logo/favicon-16x16.png`
      }
    ],
    [
      "link",
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `/img/logo/favicon-32x32.png`
      }
    ],
    ["meta", { name: "application-name", content: "Louis Young" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "Louis Young" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" }
    ],
    [
      "link",
      { rel: "apple-touch-icon", href: `/images/icons/apple-touch-icon.png` }
    ],
    ["meta", { name: "theme-color", content: "#377bb5" }],
    ["meta", { name: "msapplication-TileColor", content: "#377bb5" }]
  ],

  bundler: "@vuepress/vite",

  theme: "vuepress-theme-gungnir",

  themeConfig: {
    repo: "louisyoungx/louisyoungx.github.io",
    docsDir: "blog",
    docsBranch: "master",

    hitokoto: "https://v1.hitokoto.cn?c=d&c=i", // enable hitokoto (一言) or not?

    // personal information
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

    // header images on home page
    homeHeaderImages: [
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
    ],

    // other pages
    pages: {
      tags: {
        subtitle: "Black Sheep Wall",
        bgImage: {
          path: "/img/pages/tags.jpg",
          mask: "rgba(211, 136, 37, .5)"
        }
      },
      links: {
        subtitle:
          "When you are looking at the stars, please put the brightest star shining night sky as my soul.",
        bgImage: {
          path: "/img/pages/links.jpg",
          mask: "rgba(64, 118, 190, 0.5)"
        }
      }
    },

    themePlugins: {
      // only enable git plugin in production mode
      git: isProd,
      katex: true,
      giscus: {
        repo: "This-is-an-Apple/blog-giscus-comments",
        repoId: "R_kgDOGl2SjQ",
        category: "Announcements",
        categoryId: "DIC_kwDOGl2Sjc4CAcxK",
        darkTheme: "https://rocke.top/giscus/dark.css"
      },
      mdPlus: {
        all: true
      },
      ga: "G-PQTY6HBG27",
      ba: "2e2c8699088629e7ee784fefe7da5621",
      rss: {
        siteURL: "https://rocke.top",
        copyright: "louisyoungx 2018-2022"
      }
    },

    navbar: [
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
        icon: "oi-rocket"
      }
    ],

    footer: `
      &copy; <a href="https://github.com/louisyoungx" target="_blank">louisyoungx</a> 2018-2022
      <br>
      Powered by <a href="https://v2.vuepress.vuejs.org" target="_blank">VuePress</a> &
      <a href="https://github.com/Renovamen/vuepress-theme-gungnir" target="_blank">Gungnir</a>
    `
  },

  markdown: {
    extractHeaders: {
      level: [2, 3, 4, 5]
    },
    code: {
      lineNumbers: false
    }
  }
};
