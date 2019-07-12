/***
 * data_zh 新闻列表中文数据
 * data_en 新闻列表英文数据
 * **/
/**
 * id  文章 ID 作为文章识别唯一标识
 * title 文章标题
 * cover 文章列表左侧封面图
 * date 文章更新时间
 * author 文章作者
 * desc 文章描述
 * abstract  文章摘要
 *
 *
 * content 文章内容  文章段落用 <p></p> 标签包裹
 *          文中图片用 <img src='图片链接' alt='图片描述'/>
 *          如果需要自定义加粗文章 <span style='font-weight:600;'>包裹的文字</span>
 *          如果需要加跳转链接 <a href='跳转链接' target="_blank">包裹的文字</span>
 *   
 *
 *   如果需要改变字体大小  或者加粗字体 
 *   在标签上 加 style='font-weight:600;font-size:14px ; color:"#333333' (font-size:14px 这个是设置字体大小;font-weight:600 设置字体粗细  color:#333333 设置字体颜色  如果不需要就不用写上)
 *   例如  <p style='font-weight:600;font-size:14px ; color:"#333333'>这里面是文字</p>
      如果是在某一段文字中加粗几个字  <span  style='font-weight:600'>需要加粗的字</span>
 *
 * **/
let NewsData={
  /**这是中文**/
  data_zh:[
    {
      id : "1",
      title : "菜鸟也能用的初级视频制作软件",
      cover:"https://www.enjoycut.com/ArticlesPic/pic10.jpg",
      author : "不是菜鸟",
      date : "2019-04-16",
      desc : "科技支撑着网络的快速发展，也一直推动着视频编辑制作的不断进步——好的创意，加上简单的制作，就有可能成为网络上红极一时的短视频。",
      abstract : "在我们普通人的日常中，为家人、同事、朋友制作视频短片已经成为了记录生活不可或缺的一部分，但是，用到一个好的剪辑工具也是非常重要的。不过工具也要看适合什么样的人使用，很多人都纠结于不会使用视频制作软件，没关系，这里，我们就为对刚入门的新手介绍几款菜鸟也能用的初级视频制作软件，让你一键成为视频制作大师。",
      content : "<p style='font-weight:600'>喜视频</p>" +
        "<p>在国内的初级在线剪辑视频制作视频的软件中，喜视频一直是首屈一指的制作软件，被人们推崇的不仅是在线制作编辑的强大的功能，还有特别是在线去水印的这一特点，备受人们喜爱.在众多的初级视频制作软件中，喜视频操作特别简单，没有什么特别要求的专业知识，只要根据操作流程，所有人都可以使用，非常简单方便，同时，在初级视频制作软件中，还具有强大的功能，可以添加字幕，还可以有自己的转场效果和滤镜，达到所有人需要的视频制作功能。</p>" +
        "<p style='font-weight:600'>iMovie</p>" +
        "<p>在初级视频制作软件中，有一款是只有苹果电脑能使用的，就是苹果公司开放的Imovie视频剪辑制作软件，仅限于苹果的设备才能使用，这也是目前比较火爆的一款初级视频制作软件。操作界面非常的简单，一目了然，在操作过程中，只要会一点简单的电脑技术就可以，比如说点击或者是拖拽就可以快速的完成，可以专场、添加背景音乐和文字，然你快速的而成为视频制作大师。</p>"
    },
{
      id : "2",
      title : "社交媒体：爆款视频的六大特征，你get到了吗？",
      cover:"https://www.enjoycut.com/ArticlesPic/pic11.jpg",
      author : "Bling",
      date : "2019-04-23",
      desc : "对于怎样的视频在社交平台反响最好似乎暂无标准答案，有的媒体所发布的视频片段能让用户疯狂点赞和分享，而其他即便与前者拥有相同特征的视频用户又不买账了。那么，社交平台上的爆款视频都长什么样？",
      abstract : "研究者选取了发布于Facebook和Instagram上的视频，就位列榜单前列的视频进行了分析，并总结出了Facebook和Instagram上爆款视频的六大特征：",
      content : "<p style='font-weight:600'>1.时长：短视频大行其道，叙事力是关键</p>" +
        "<p>在注意力稀缺的时代，短视频的风起云涌无需多言，尤其是对致力于开发原生视频的媒体而言，短视频更具意义。</p>" +
        "<p>在研究者提取出了Facebook上分享率最高的十个视频，它们分别出自六家媒体，大部分爆款视频时长都在60秒以内。</p>" +
        "<p>BBC News视频热度榜排名前十的视频时长从15秒到60秒不等，平均时长为32秒，但它们却拥有一个共同特征，那便是丰富的视觉镜头。这告诉我们，视频的开发或许不应拘泥于长短，但核心镜头必须富有叙事力和视觉感染力。</p>" +
        "<p style='font-weight:600'>2、内容：素材新奇，诉诸感性，唤起用户情感共鸣</p>" +
        "<p>通过对两大平台的热度视频进行取样分析不难看出，用户偏爱那些从标题“看上去”就会精彩的视频，或者是那些具有情节冲突的时事新闻、或是短奇快的科技小故事，或是富有生活乐趣的新奇故事。</p>"+
        "<p>一言以概之，就是能够唤起用户情感共鸣的故事素材。</p>"+
        "<img src='https://www.enjoycut.com/ArticlesPic/pic12.jpg' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter'/>"+
        "<p style='font-weight:600'>3、造型：方形设计（Video in Square）更受追捧</p>" +
        "<p>研究者对Buzzfeed一个月内分享率最高的视频进行观察，发现其中90%都是方形视频（Video in Square），这说明用户的视频观看习惯可能正在改变，将视频放至全屏模式并将手机横置进行观看的行为已经慢慢变得“非主流”。细想想，为了观看一则几十秒的视频还要进行一连串的动作，确实不划算。</p>"+
        "<p style='font-weight:600'>4、画面+声音：动态镜头吸引用户，静音自动播放功能为加分项</p>" +
        "<p>“一则视频放眼看去全是讲话的脸部特写，更多的时候用户会选择不去点击它。”通过对Spike置顶视频的特征进行分析得出了这样的结论：用户喜欢的是，标题和文字说明就能产生画面感的视频。</p>"+
        "<p>因此也就不难解释，为什么静音视频兴起。</p>"+
        "<p>美食相关视频成为Facebook平台上最受欢迎的视频种类之一。对于美食视频而言，图片就能讲故事。静音自动播放视频被新闻广泛引用，用户能够在火车上或排队时观看视频，省去插入耳机或调节音量的麻烦。如今，Facebook平台上最受用户喜爱的视频大都可以自动静音播放。</p>"+
        "<p style='font-weight:600'>5、附加值：视频字幕+配文，增强叙事性</p>" +
        "<p>“Facebook和Instagram视频中最常见的要素之一便是字幕。Instagram更是将这一功能运用得神乎其神。</p>"+
        "<p>设计准则：从字幕的字体、长度到遣词造句都以切中视频核心主旨，易于理解且不会分散用户观看视频的注意力。</p>"+
        "<p>Instagram的配文功能也为视频发布者，尤其是新闻机构提供了与读者对话的空间。</p>"+
        "<p>Instagram允许发布者为一则视频添加不超过2200字符的配文，配文的长短发布者可依据用户反馈进行调整。</p>"+
        "<p>配文所附带的标签也非常重要，它能激发用户的参与行为，使得新用户有可能通过检索标签的行为到达相关视频。</p>"+
        "<img src='https://www.enjoycut.com/ArticlesPic/pic13.jpg' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter'/>"+
        "<p style='font-weight:600'>6、营销：引入“行为召唤（call to action）”捆绑用户</p>" +
        "<p>“行为召唤（call to action）”是市场营销中经常用到的一个名词，意指商家开展商品、商家主页设计或开展活动，促使用户采取响应行动，包括下单购物、提交个人信息或订阅内容。</p>"+
        "<p>许多制作爆款视频的媒体也将这一策略引入推广中。</p>"+
        "<p>第一种是在品牌页面添加视频播放键，将用户的页面访问行为与视频播放行为联结起来。这种设计通常是针对有访问主页习惯的固定用户，可刺激用户消费更多视频内容，进一步将用户与品牌进行捆绑。</p>"+
        "<p>第二种是在一则视频播放完成后，插入该视频发布者的其他作品播放键。一般是用于刺激新用户对某一品牌的持续消费，将其转化为固定用户。</p>"
    },

  ],

  /**这是英文**/
  data_en:[
    {
      id : "1",
      title : "5 Useful Web Tools That're Easy to Use",
      // cover:"https://cdn.dribbble.com/users/3622551/screenshots/6617505/__.jpg",
      cover: "https://www.enjoycut.com/ArticlesPic/Web_Tools.jpg",
      author : "Nathan",
      date : "2019-03-03",
      desc : "Google isn’t the only company creating useful apps for the web. There are plenty of great online resources not made in Mountain view, provided you know where to look. ",
      abstract : "Here are 5 of our favorite online apps and websites that are worth collecting in your browser’s bookmarks, ready to go at a moment’s notice, to convert videos, enhance photos, make GIFs, pick colors, transfer documents and more besides.",
      content : "<p style='font-weight:600'>1# Improve low-res photos </p>"+ 
                "<p>Let’s Enhance is a slick and free site for improving your low-res photography. Blocky noise is automatically removed and some neural network smarts are applied to imagine missing parts of the picture and enlarge it in a smoother way. You need to create an account to see the end results, and then you get a choice of high-res enhanced variations to choose from. </p>"+
        "<p style='font-weight:600'>2# Online video converter</p>"+
        "<p> Online video converter</p>"+
        "<p> Getting a video in the wrong format is one of the most frustrating experiences of modern-day computing life. The Online Video Converter is a software you can use to convert any format video files to mp4 online. Its fast conversion time, high quality output and additional features make it the perfect choice for video converter software. It can convert any format video to Mp4 speedily. The The Online Video Converter allows you to change the resolution and size of the video in the browse. Just click a few clicks in the browser to get your file ready </p>"+
        "<img src='https://www.enjoycut.com/ArticlesPic/pic5.png' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter'/>"+
        "<p style='font-weight:600'>3# Make a GIF out of anything</p>"+
        "<p> Everyone loves GIFs, and one of the internet’s best GIF resources also has a creator component that lets you whip up a quick animation from an online video or a file stored on your hard drive. Keep a GIPHY bookmark available in your browser, and you’ll always be able to create a GIF from just about anything in seconds, ready to save to disk or share. </p>"+
        "<p style='font-weight:600'>4# Find the right color combination</p>"+
        "<p> If you work in design or web development, you’ve got a lot of palette pickers to choose from, but Palette Generator is one of the best online ones we’ve come across. Rather than asking you to seed or scroll through a set mix of colors, it asks you to upload a series of images from your computer—it then generates interesting color schemes to match. </p>"+
        "<p style='font-weight:600'>5# Send files over the web</p>"+
        "<p> Services like Dropbox and Google Drive make sharing large files over the web easier than ever, but sometimes you just want to quickly fling a file at someone with no need to register or log in or anything else. Enter Firefox Send (yes, like the browser), which lets you drop any file into a browser window and send it via a safe, private, and encrypted link. </p>"
    },
 {
      id : "2",
      title : "What’s the Difference Between MP4, MOV and AVI?",
      cover:"https://www.enjoycut.com/ArticlesPic/pic14.png",
      author : "Matt",
      date : "2019-03-16",
      desc : "A video file format is a type of file format for storing digital video data on a computer system. Video is almost always stored using lossy compression to reduce the file size.",
      abstract : "You’ll have to decide which file format to convert your videos to. Here’s a rundown of the most common file types and their characteristics——",
      content : "<img src='https://www.enjoycut.com/ArticlesPic/pic15.png' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter, can convert video to MP4'/>"+
        "<p style='font-weight:600'>1.MP4 - This file type is highly compatible with other platforms, which makes it one of the most popular video file types today.</p>" +
        "<p>MP4 compresses files into smaller sizes than other file types, making them easier to store and share. MP4 also captures high-quality video without blurring your imagery. This file type is considered the standard media file, and it plays on both Windows and Apple devices.</p>"+
        "<img src='https://www.enjoycut.com/ArticlesPic/pic16.png' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter, can convert MP4 video to MOV'/>"+
        "<p style='font-weight:600'>2.MOV - The default player for MOV is Apple's QuickTime Player.</p>" +
        "<p> It has a high compression ratio and perfect video clarity, but its biggest feature is cross-platform, not only Apple Mac system can be used, but also Windows system can be used. The QuickTime file format supports 25-bit color, supports leading integrated compression technology, offers more than 150 video effects, and is equipped with sound devices that offer more than 200 MIDI-compatible sounds and devices. At present, this video format has also been widely recognized in the industry and has become the de facto industry standard in the field of digital media software technology.</p>"+
        "<p> The MOV format is a container for QuickTime, not only for video and audio, but also for Java, scripts, skins, images, etc. It is a very complicated package format. Although it was created for Mac, it also works on Windows. However, it doesn't always work as well on non-Apple platforms. This file type is great for storing and sharing high-quality video. It sometimes creates larger files than MP4, but the two file types are mostly interchangeable. MOV files can be converted to MP4 files easily.</p>"+
       "<img src='https://www.enjoycut.com/ArticlesPic/pic17.png' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter, can convert MP4 video to AVI'/>"+
        "<p style='font-weight:600'>3.AVI - The background of AVI is not to be underestimated. </p>" +
        "<p> It is a digital audio and video file format developed by Microsoft. Originally used only for Microsoft's Windows Video Operating Environment (VFW, Microsoft Video for Windows), it is now directly used by most operating systems. The supported AVI format allows video and audio to be interlaced for simultaneous playback, but the AVI file does not have a compression standard, which also results in an AVI file format that is not compatible. AVI files generated by different compression standards must be played out using the corresponding decompression algorithm.</p>"+
        "<p> Microsoft created this file type specifically for use with Windows Media Player. Although this file type used to be the most popular due to its high compatibility, Microsoft no longer updates it. Therefore, AVI is often incompatible with newer and more advanced software. If you have a choice, it’s better to use MP4 or MOV.If you’re working on an Apple device and know that your video will be edited and played on other Apple software, it's a good idea to save your video as a MOV file. However, if you plan to share your video more widely online, consider going with the MP4 standard because it can be read by more platforms.</p>"+
        "<p>When AVI and MP4 are the same size as the movie playback screen, the memory and resolution are the same, too. So in principle, apart from the different playback formats, there is no difference between AVI and MP4.</p>"
    },
  {
      id : "3",
      title : "Rookies can also use the basic free video editor software",
      // cover:"https://i.pinimg.com/564x/6c/4c/d5/6c4cd577d9450618d859a6a374975672.jpg",
      cover: "https://www.enjoycut.com/ArticlesPic/cainiao.jpg",
      author : "Frank Seward",
      date : "2019-04-10",
      desc : "Technology supports the rapid development of the network, and has been promoting the continuous progress of video editing -- good ideas, coupled with simple editing, may create and edit a very popular short video on the internet. ",
      abstract : "In the daily life of ordinary people, making video short films for family members, colleagues and friends has become an indispensable part of recording life. However, it is also very important to use a good editing tool. ",
      content : "<p>But tools also depend on what kind of people use, a lot of people are struggling not to use one video editing software. It doesn't matter! Here, we will introduce a few rookies can also use the basic free video editor software just for beginners let you become a video master. </p>"+
        "<p style='font-weight:600'> 1. Enjoycut Video Editor : Video Editing Software by Enjoycut </p>"+ 
        "<p>Enjoycut Video Editor is a perfect video software to create and edit video for free. Edit videos any way you like: cut and clip, add or remove watermarks, music, and effects. No download required. No account required.</p>"+
        "<p> In domestic primary online editing video making software, Enjoycut Video Editor has been the leading video editing software. Which respects by people is not only the powerful features of online video editor, and especially to the characteristics of the watermark.</p>"+
        "<p> In numerous primary online video editor software, such as simple operation, without special requirements of the professional knowledge, as long as according to the operation process that everyone can use, is very simple and convenient. At the same time, in the primary online video editor software, it has powerful function that can add subtitles, can also have their own transitions and filter, achieve all the required video editing function.</p>"+
        "<p style='font-weight:600'>2. iMovie: Services-Rotate & Join & Cut Video, Merge & Split Video.</p>"+
        "<p> In the primary video making software, there is one only can mac computer use–iMovie. It can edit virtually any videos and supports 500+ effects. </p>"+
        "<p> iMovie is currently a relatively popular primary video editor software.</p>"+
        "<p> Its operation interface is very simple and clear at a glance. In the process of operation, as long as you can operate a little simple computer technology, such as click or drag and drop, the editing can be quickly completed. You can change the scene, add background music and text, and quickly become a video master. </p>"
    },
{
      id : "4",
      title : "Social media: hot style videos have six features, did you get them?",
      cover:"https://www.enjoycut.com/ArticlesPic/shejiao.jpg",
      author : "Harold",
      date : "2019-04-23",
      desc : "There seems to be no definitive answer as to what kind of video works best on social platforms. ",
      abstract : "With some media posting videos that drive users crazy about thumbing up and sharing. While other videos, even those with the same features, users are not buying it.",
      content : "<p>So, what do the hot style videos look like on social platforms?Researchers took videos posted on Facebook and Instagram, analyzed the top videos, and summarized six characteristics of hot style videos on Facebook and Instagram: </p>"+
        "<p style='font-weight:600'> 1. Duration: short video is popular, narrative power is key </p>"+ 
        "<p>In an age of attention scarcity, short video makes a lot of sense, especially for media dedicated to developing native videos.</p>"+
        "<p> The researchers extracted the top 10 most shared videos on Facebook from six different media, with most hot style video lasting less than 60 seconds.</p>"+
        "<p> The top 10 videos range from 15 to 60 seconds, with an average of 32 seconds, but they share one feature: plenty of visual footage. This tells us that video development should not be limited to length, but the core shot must be narrative and visual appeal.</p>"+
        "<p style='font-weight:600'>2.Content: novel material, appeal to sensibility, arouse emotional resonance of users</p>"+
        "<p> By sampling the popularity of video, it is not hard to see that users prefer videos which will be wonderful according to the title, or current news with plot conflicts, or short and fast technology stories, or novel stories full of life fun. </p>"+
        "<p> In a word, it is the story material that can arouse users' emotional resonance.</p>"+
        "<img src='https://www.enjoycut.com/ArticlesPic/shejiao1.jpg' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter, can convert MP4 video to AVI'/>"+
        "<p style='font-weight:600'>3. Style: Video in Square is more popular</p>"+
        "<p> Researchers observed the videos with the highest share rate of Buzzfeed within a month, and found that 90% of them were Video in Square, indicating that users' watching habits of videos may be changing, and the behavior of putting videos in full screen mode and holding the phone horizontally for watching has gradually become \"non-mainstream \". It's not cost-effective to watch a video for dozens of seconds and perform a series of actions.</p>"+
        "<p style='font-weight:600'>4. Picture + Sound: dynamic lens attracts users, and mute automatic playback function is a plus</p>"+
        "<p> “A video view is full of talking faces, and more times users choose not to click it.” Through the analysis of the characteristics of Spike's top videos, we come to the conclusion that users like videos which can create a pictorial feeling with the title and caption.</p>"+
        "<p> So it's not hard to explain why silent videos came into being.</p>"+
        "<p> Foods Video is one of the most popular video categories on Facebook. For Foods Video, pictures tell a story. Mute autoplaying video has been widely quoted in the news, allowing users to watch video on trains or in queues without having to plug in headphones or adjust the volume. Today, most of Facebook's favorite video programs are automatically silenced. </p>"+
        "<p style='font-weight:600'>5.Added value: video subtitle + caption, enhance narrative</p>"+
        "<p> One of the most common elements on Facebook and Instagram videos is subtitles. Instagram has used this feature to great effect.</p>"+
        "<p> Design guidelines: the font, length, and wording of the subtitles are relevant to video's core theme. It’s easy to understand and will not distract users from watching the video.</p>"+
        "<p> Instagram's captions also provide video publishers, especially news organizations, a space to talk to readers.</p>"+
        "<p> Instagram allows publishers to add captions of no more than 2,200 characters to a video, and the length of the captions can be adjusted based on users’ feedback.</p>"+
        "<p> Tags attached to the text are also very important, which can stimulate users' participation behavior and make it possible for new users to reach relevant videos through the behavior of retrieving tags.</p>"+
        "<img src='https://www.enjoycut.com/ArticlesPic/shejiao2.jpg' alt='Online Video Converter: Video Converter, MP4 Free Online File Converter, can convert MP4 video to AVI'/>"+
        "<p style='font-weight:600'>6. Marketing: bring in \"call to action\" to build close relationships with users</p>" +
        "<p> \"Call to action\" is a term often used in marketing. It means that merchants carry out products, homepages design or activities to prompt users to take response actions, including ordering shopping, submitting personal information or subscribing content.</p>"+
        "<p>Many of the media that produce hot style videos have also brought in this strategy into their campaigns.</p>"+
        "<p> The first is to add video play button on the brand page to link the user's page access behavior with video play behavior. This design is usually aimed at regular users who have the habit of visiting the homepage, which can stimulate users to consume more video content and further bind users with the brand.</p>"+
        "<p>The second is after a video playing, insert the other works of the video publisher play keys. Generally, it is used to stimulate new users' continuous consumption of a certain brand and convert it into regular users.</p>"
    },

  ]
};
export default NewsData