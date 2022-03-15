const l={key:"v-4618351d",path:"/post/2022/01/26/linux-training-3-vim-advanced-linux-tasks-services/",title:"Linux Training 3 - Vim advanced & Linux tasks & Services",lang:"en-US",frontmatter:{layout:"Post",title:"Linux Training 3 - Vim advanced & Linux tasks & Services",subtitle:"Linux\u57F9\u8BAD(\u4E09) Vim\u8FDB\u9636\u548CLinux\u4EFB\u52A1\u4E0E\u670D\u52A1",author:"louisyoungx",date:"2022-01-26T00:00:00.000Z",useHeaderImage:!0,headerImage:"/img/in-post/2022-01-26/header.jpg",headerMask:"rgb(14, 21, 5, .2)",permalinkPattern:"/post/:year/:month/:day/:slug/",tags:["chinese","linux","training"]},excerpt:`<p>vim\u8FDB\u9636\u64CD\u4F5C\u4E0E\u5B8F\uFF0Ccrontab\u5B9A\u65F6\uFF0C\u81EA\u5B9A\u4E49\u670D\u52A1\uFF0C\u73AF\u5883\u53D8\u91CF\uFF0Cssh\u914D\u7F6E\u6587\u4EF6\uFF0C\u5F00\u673A\u81EA\u542F</p>
`,headers:[{level:2,title:"vim\u8FDB\u9636\u64CD\u4F5C",slug:"vim\u8FDB\u9636\u64CD\u4F5C",children:[{level:3,title:"\u7528 VIM \u6253\u5F00\u6587\u4EF6",slug:"\u7528-vim-\u6253\u5F00\u6587\u4EF6",children:[{level:4,title:"\u5982\u4F55\u7528 VIM \u4E00\u6B21\u6027\u6253\u5F00\u591A\u4E2A\u6587\u4EF6\u5462\uFF1F",slug:"\u5982\u4F55\u7528-vim-\u4E00\u6B21\u6027\u6253\u5F00\u591A\u4E2A\u6587\u4EF6\u5462",children:[]}]},{level:3,title:"VIM \u7684\u9000\u51FA",slug:"vim-\u7684\u9000\u51FA",children:[]},{level:3,title:"VIM \u7684\u8F93\u5165\u6A21\u5F0F",slug:"vim-\u7684\u8F93\u5165\u6A21\u5F0F",children:[{level:4,title:"VIM \u7684\u4EE3\u7801\u63D0\u793A\u529F\u80FD",slug:"vim-\u7684\u4EE3\u7801\u63D0\u793A\u529F\u80FD",children:[]}]},{level:3,title:"VIM \u7684\u547D\u4EE4\u6A21\u5F0F",slug:"vim-\u7684\u547D\u4EE4\u6A21\u5F0F",children:[{level:4,title:"VIM \u5904\u7406\u5927\u5C0F\u5199\u7684\u533A\u5206",slug:"vim-\u5904\u7406\u5927\u5C0F\u5199\u7684\u533A\u5206",children:[]},{level:4,title:"VIM \u5220\u9664\u591A\u884C\u6587\u672C",slug:"vim-\u5220\u9664\u591A\u884C\u6587\u672C",children:[]},{level:4,title:"VIM \u5904\u7406\u6587\u672C\u7684\u66FF\u6362",slug:"vim-\u5904\u7406\u6587\u672C\u7684\u66FF\u6362",children:[]},{level:4,title:"VIM \u6267\u884C Linux \u547D\u4EE4",slug:"vim-\u6267\u884C-linux-\u547D\u4EE4",children:[]},{level:4,title:"VIM \u6267\u884C\u547D\u4EE4\uFF0C\u5E76\u4E14\u6DFB\u52A0\u7ED3\u679C\u81F3\u64CD\u4F5C\u6587\u672C\u5149\u6807\u5904",slug:"vim-\u6267\u884C\u547D\u4EE4-\u5E76\u4E14\u6DFB\u52A0\u7ED3\u679C\u81F3\u64CD\u4F5C\u6587\u672C\u5149\u6807\u5904",children:[]},{level:4,title:"\u5B9A\u4E49\u5FEB\u6377\u952E",slug:"\u5B9A\u4E49\u5FEB\u6377\u952E",children:[]}]},{level:3,title:"VIM \u7684\u6B63\u5E38\u6A21\u5F0F\uFF08Normal-model\uFF09",slug:"vim-\u7684\u6B63\u5E38\u6A21\u5F0F-normal-model",children:[{level:4,title:"\u5927\u5C0F\u5199\u8F6C\u6362",slug:"\u5927\u5C0F\u5199\u8F6C\u6362",children:[]},{level:4,title:"VIM \u7684\u91CD\u590D\u547D\u4EE4",slug:"vim-\u7684\u91CD\u590D\u547D\u4EE4",children:[]}]},{level:3,title:"VIM \u53EF\u89C6\u5316\u6A21\u5F0F\uFF08Visual-mode)",slug:"vim-\u53EF\u89C6\u5316\u6A21\u5F0F-visual-mode",children:[{level:4,title:"\u53EF\u89C6\u5316\u6A21\u5F0F\u4E0B v \u7684\u7279\u6B8A\u64CD\u4F5C",slug:"\u53EF\u89C6\u5316\u6A21\u5F0F\u4E0B-v-\u7684\u7279\u6B8A\u64CD\u4F5C",children:[]},{level:4,title:"\u5757\u533A\u57DF\u4E0B\u7684\u7279\u6B8A\u64CD\u4F5C",slug:"\u5757\u533A\u57DF\u4E0B\u7684\u7279\u6B8A\u64CD\u4F5C",children:[]}]}]},{level:2,title:"crontab \u5B9A\u65F6\u4EFB\u52A1",slug:"crontab-\u5B9A\u65F6\u4EFB\u52A1",children:[{level:3,title:"\u4EFB\u52A1\u8C03\u5EA6\u6982\u5FF5",slug:"\u4EFB\u52A1\u8C03\u5EA6\u6982\u5FF5",children:[]},{level:3,title:"\u57FA\u672C\u8BED\u6CD5",slug:"\u57FA\u672C\u8BED\u6CD5",children:[{level:4,title:"\u5FEB\u901F\u5165\u95E8",slug:"\u5FEB\u901F\u5165\u95E8",children:[{level:5,title:"\u4EFB\u52A1\u8981\u6C42",slug:"\u4EFB\u52A1\u8981\u6C42",children:[]},{level:5,title:"\u64CD\u4F5C\u6B65\u9AA4",slug:"\u64CD\u4F5C\u6B65\u9AA4",children:[]}]},{level:4,title:"5\u4E2A\u5360\u4F4D\u7B26\u8BF4\u660E",slug:"_5\u4E2A\u5360\u4F4D\u7B26\u8BF4\u660E",children:[]},{level:4,title:"\u7279\u6B8A\u7B26\u53F7\u8BF4\u660E",slug:"\u7279\u6B8A\u7B26\u53F7\u8BF4\u660E",children:[]},{level:4,title:"\u7279\u5B9A\u65F6\u95F4\u6267\u884C\u4EFB\u52A1\u6848\u4F8B",slug:"\u7279\u5B9A\u65F6\u95F4\u6267\u884C\u4EFB\u52A1\u6848\u4F8B",children:[]},{level:4,title:"crontab \u4EFB\u52A1\u8C03\u5EA6\u5B9E\u4F8B",slug:"crontab-\u4EFB\u52A1\u8C03\u5EA6\u5B9E\u4F8B",children:[]},{level:4,title:"crontab \u5E38\u7528\u9009\u9879",slug:"crontab-\u5E38\u7528\u9009\u9879",children:[]}]}]},{level:2,title:"\u670D\u52A1\u7BA1\u7406\uFF08service / systemctl\uFF09",slug:"\u670D\u52A1\u7BA1\u7406-service-systemctl",children:[{level:3,title:"service",slug:"service",children:[{level:4,title:"service \u57FA\u672C\u8BED\u6CD5",slug:"service-\u57FA\u672C\u8BED\u6CD5",children:[]},{level:4,title:"\u670D\u52A1\u7684\u8FD0\u884C\u7EA7\u522B",slug:"\u670D\u52A1\u7684\u8FD0\u884C\u7EA7\u522B",children:[]}]},{level:3,title:"chkconfig",slug:"chkconfig",children:[{level:4,title:"\u57FA\u672C\u8BED\u6CD5",slug:"\u57FA\u672C\u8BED\u6CD5-1",children:[]},{level:4,title:"\u5E94\u7528\u5B9E\u4F8B",slug:"\u5E94\u7528\u5B9E\u4F8B",children:[]}]},{level:3,title:"systemctl \u7BA1\u7406\u6307\u4EE4",slug:"systemctl-\u7BA1\u7406\u6307\u4EE4",children:[{level:4,title:"\u57FA\u672C\u8BED\u6CD5",slug:"\u57FA\u672C\u8BED\u6CD5-2",children:[]},{level:4,title:"\u5E94\u7528\u6848\u4F8B",slug:"\u5E94\u7528\u6848\u4F8B",children:[]},{level:4,title:"\u7EC6\u8282\u8BA8\u8BBA",slug:"\u7EC6\u8282\u8BA8\u8BBA",children:[]}]}]},{level:2,title:"\u73AF\u5883\u53D8\u91CF",slug:"\u73AF\u5883\u53D8\u91CF",children:[{level:3,title:"\u5168\u5C40\u73AF\u5883\u53D8\u91CF",slug:"\u5168\u5C40\u73AF\u5883\u53D8\u91CF",children:[]},{level:3,title:"\u7528\u6237\u73AF\u5883\u53D8\u91CF",slug:"\u7528\u6237\u73AF\u5883\u53D8\u91CF",children:[]},{level:3,title:"\u4E34\u65F6\u73AF\u5883\u53D8\u91CF",slug:"\u4E34\u65F6\u73AF\u5883\u53D8\u91CF",children:[]}]},{level:2,title:"ssh\u914D\u7F6E\u6587\u4EF6",slug:"ssh\u914D\u7F6E\u6587\u4EF6",children:[{level:3,title:"\u6982\u8FF0",slug:"\u6982\u8FF0",children:[]},{level:3,title:"\u4E3B\u8981\u7684\u89C4\u5219",slug:"\u4E3B\u8981\u7684\u89C4\u5219",children:[]},{level:3,title:"\u5E38\u89C1\u53C2\u6570\u7C7B\u578B",slug:"\u5E38\u89C1\u53C2\u6570\u7C7B\u578B",children:[{level:4,title:"Host",slug:"host",children:[]},{level:4,title:"HostName",slug:"hostname",children:[]},{level:4,title:"User",slug:"user",children:[]},{level:4,title:"IdentityFile",slug:"identityfile",children:[]},{level:4,title:"Port",slug:"port",children:[]},{level:4,title:"\u5176\u4ED6",slug:"\u5176\u4ED6",children:[]}]},{level:3,title:"\u5229\u7528ssh\u7A7F\u8D8A\u8DF3\u677F\u673A\u914D\u7F6E",slug:"\u5229\u7528ssh\u7A7F\u8D8A\u8DF3\u677F\u673A\u914D\u7F6E",children:[]},{level:3,title:"ssh\u96A7\u9053",slug:"ssh\u96A7\u9053",children:[{level:4,title:"frp",slug:"frp",children:[]},{level:4,title:"ngrok",slug:"ngrok",children:[]}]}]},{level:2,title:"\u81EA\u5B9A\u4E49\u5F00\u673A\u81EA\u542F\u7A0B\u5E8F/\u811A\u672C",slug:"\u81EA\u5B9A\u4E49\u5F00\u673A\u81EA\u542F\u7A0B\u5E8F-\u811A\u672C",children:[{level:3,title:"\u901A\u8FC7 crontab \u5B9E\u73B0",slug:"\u901A\u8FC7-crontab-\u5B9E\u73B0",children:[]},{level:3,title:"\u901A\u8FC7 systemd service \u5B9E\u73B0",slug:"\u901A\u8FC7-systemd-service-\u5B9E\u73B0",children:[]}]},{level:2,title:"Tmux",slug:"tmux",children:[{level:3,title:"\u57FA\u672C\u64CD\u4F5C",slug:"\u57FA\u672C\u64CD\u4F5C",children:[{level:4,title:"\u5B89\u88C5",slug:"\u5B89\u88C5",children:[]},{level:4,title:"\u542F\u52A8\u4E0E\u9000\u51FA",slug:"\u542F\u52A8\u4E0E\u9000\u51FA",children:[]},{level:4,title:"\u524D\u7F00\u952E",slug:"\u524D\u7F00\u952E",children:[]}]},{level:3,title:"\u4F1A\u8BDD\u7BA1\u7406",slug:"\u4F1A\u8BDD\u7BA1\u7406",children:[{level:4,title:"\u65B0\u5EFA\u4F1A\u8BDD",slug:"\u65B0\u5EFA\u4F1A\u8BDD",children:[]},{level:4,title:"\u5206\u79BB\u4F1A\u8BDD",slug:"\u5206\u79BB\u4F1A\u8BDD",children:[]},{level:4,title:"\u63A5\u5165\u4F1A\u8BDD",slug:"\u63A5\u5165\u4F1A\u8BDD",children:[]},{level:4,title:"\u6740\u6B7B\u4F1A\u8BDD",slug:"\u6740\u6B7B\u4F1A\u8BDD",children:[]},{level:4,title:"\u5207\u6362\u4F1A\u8BDD",slug:"\u5207\u6362\u4F1A\u8BDD",children:[]},{level:4,title:"\u91CD\u547D\u540D\u4F1A\u8BDD",slug:"\u91CD\u547D\u540D\u4F1A\u8BDD",children:[]},{level:4,title:"\u67E5\u770B\u73B0\u6709\u4F1A\u8BDD",slug:"\u67E5\u770B\u73B0\u6709\u4F1A\u8BDD",children:[]},{level:4,title:"\u4F1A\u8BDD\u5FEB\u6377\u952E",slug:"\u4F1A\u8BDD\u5FEB\u6377\u952E",children:[]}]},{level:3,title:"\u6700\u7B80\u64CD\u4F5C\u6D41\u7A0B",slug:"\u6700\u7B80\u64CD\u4F5C\u6D41\u7A0B",children:[]},{level:3,title:"\u7A97\u683C\u64CD\u4F5C",slug:"\u7A97\u683C\u64CD\u4F5C",children:[{level:4,title:"\u5212\u5206\u7A97\u683C",slug:"\u5212\u5206\u7A97\u683C",children:[]},{level:4,title:"\u79FB\u52A8\u5149\u6807",slug:"\u79FB\u52A8\u5149\u6807",children:[]},{level:4,title:"\u4EA4\u6362\u7A97\u683C\u4F4D\u7F6E",slug:"\u4EA4\u6362\u7A97\u683C\u4F4D\u7F6E",children:[]},{level:4,title:"\u7A97\u683C\u5FEB\u6377\u952E",slug:"\u7A97\u683C\u5FEB\u6377\u952E",children:[]}]},{level:3,title:"\u7A97\u53E3\u7BA1\u7406",slug:"\u7A97\u53E3\u7BA1\u7406",children:[{level:4,title:"\u65B0\u5EFA\u7A97\u53E3",slug:"\u65B0\u5EFA\u7A97\u53E3",children:[]},{level:4,title:"\u5207\u6362\u7A97\u53E3",slug:"\u5207\u6362\u7A97\u53E3",children:[]},{level:4,title:"\u91CD\u547D\u540D\u7A97\u53E3",slug:"\u91CD\u547D\u540D\u7A97\u53E3",children:[]},{level:4,title:"\u7A97\u53E3\u5FEB\u6377\u952E",slug:"\u7A97\u53E3\u5FEB\u6377\u952E",children:[]}]},{level:3,title:"\u5176\u4ED6\u547D\u4EE4",slug:"\u5176\u4ED6\u547D\u4EE4",children:[]}]}],git:{updatedTime:1647368038e3},readingTime:{minutes:30,words:7789},filePathRelative:"posts/2022-01-26-linux-training-3-vim-advanced-linux-tasks-services.md"};export{l as data};