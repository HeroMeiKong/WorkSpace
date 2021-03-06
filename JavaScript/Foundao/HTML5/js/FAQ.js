//先取得不同板块的父元素
var All_Products = document.getElementById('All_Products')
var Merge_Video = document.getElementById('Merge_Video')
var Watermark = document.getElementById('Watermark')
var Video_Converter = document.getElementById('Video_Converter')
var Crop_Video = document.getElementById('Crop_Video')

//获取每个分类的元素
var li1 = document.getElementById('li1')
var li2 = document.getElementById('li2')
var li3 = document.getElementById('li3')
var li4 = document.getElementById('li4')
var li5 = document.getElementById('li5')

//每个模板下的内容
var all_Products_Arr = [
        {
          user_name: 'mouyi***@163.com',
          tip: 'Merge Video',
          question: 'What is Merge Video?',
          answer: 'Online transcoding is an online video file format and resolution converter.'
        },
        {
          user_name: 'mouyi***@163.com',
          tip: 'Crop Video',
          question: 'Hello, I want to know what is Crop Video? Do you have any instructions on how to use it? I might need to use this gadget, thanks.',
          answer: 'The large amount of material captured in the film production will be selected, selected, disassembled and assembled to complete a coherent, fluid, clear-cut, artistically appealing work. Starting with American director Griffith, the method of split-lens shooting was used, and then these shots were combined to create a clip art. Editing is both an indispensable work in the filmmaking process and the last re-creation in the film art creation process. French New Wave film director Godard: Editing is the official start of film creation.'
        },
        {
          user_name: 'mouyi***@163.com',
          tip: 'Crop Video',
          question: 'Hello, I want to know what is online watermarking? What does it do? I want to add the watermark on video today, but I don\'t know how to operate it. Could you please send the detailed tutorial to my email?',
          answer: 'It was invented by Europeans and has a history of 700 years. The watermark is formed by changing the density of the pulp during the papermaking process. The watermark is divided into two types. The watermark formed by thickening the paper is called “black watermark”, and the watermark formed by thinning the paper is called “white watermark”. You can clearly see the graphics, portraits or text with light and dark textures during the fluoroscopy. Usually, banknotes, documents, securities, food stamps, etc. are used in this way to prevent fraud.'
        },
        {
          user_name: 'Coo****@hotmail.com',
          tip: 'Merge Video',
          question: 'What formats are supported after video splicing?',
          answer: 'Currently only MP4 format export is supported, we will continue to optimize to support more formats export! But advanced technology allows you to upload and edit any video format that is common today!'
        },
        {
          user_name: 'Lih****@sina.com',
          tip: 'Video Converter',
          question: 'How long does it take to convert a video?',
          answer: 'While we offer one of the fastest conversion rates, the actual duration may vary based on the length of the original video and the time of the day. As our service is very popular, it might take slightly longer to convert during busy periods due to heavy load on our servers. The speed and stability of your internet connection may also affect the time it takes to complete the conversion process. To give you an idea, a five-minute video usually takes roughly a minute or less to convert.'
        },
        {
          user_name: 'Fre*****@mail.yahoo.com',
          tip: 'Video Converter',
          question: 'Can I download the batch videos after converted?',
          answer: 'We support multi-video converting at the same time. You can choose the appropriate site according to your personal situation. After this done, click "download" button, and you will download all the videos as ZIP directly.'
        },
        {
          user_name: 'Geo****@gmail.com',
          tip: 'Merge Video',
          question: 'How to ensure that the splicing video will not be missing?',
          answer: 'Unique and advanced technology has laid a solid foundation for our video Mosaic products of good stability, a very small probability of this situation, but most of the video itself has a relationship, if this situation, please contact us, we will give you a satisfactory answer!'
        },
        {
          user_name: 'mouyi***@163.com',
          tip: 'Watermark',
          question: 'What is Merge Video?',
          answer: 'Online transcoding is an online video file format and resolution converter.'
        },
        {
          user_name: 'mouyi***@163.com',
          tip: 'Crop Video',
          question: 'What is Merge Video?',
          answer: 'Online transcoding is an online video file format and resolution converter.'
        },
        {
          user_name: 'Gro****@hotmail.com',
          tip: 'Crop Video',
          question: 'I am a video clip novice, can I also use it?',
          answer: 'Sure! Love clip allows everyone (even if you are a senior user) can be arbitrary cut out of first-class video, which is its great value for the majority of ordinary users. This value reflects on video clip senior players, is naturally to save editing time and reduce the worry. Its users know that the traditional video editing software is either too professional complex, spend a lot of interactive time, even need to be in different software around special effects, or is a large resource and very unstable (crash, dead card), this is for most of our clips video, is to kill a bird with a knife, take trouble. Hi video \"light\", \"stable\", \"fast\", this time can better help you, do not bother to easily cut out first-class professional works!'
        },
        {
          user_name: 'tur***@gmail.com',
          tip: 'Crop Video',
          question: 'How long should it take to upload or download my file?',
          answer: 'This is completely dependent on the type of Internet connection you have. And the file size you uploaded.'
        },
        {
          user_name: 'Win***@gmail.com',
          tip: 'Watermark',
          question: 'Where are the watermark templates？',
          answer: 'After you sign up, you can view saved templates in your personal template library and rename them by double-clicking the template name.'
        },
        {
          user_name: 'Tur**@yahoo.com',
          tip: 'Watermark',
          question: 'Can I customize a font watermark?',
          answer: 'Currently we only support:\n1.Edit text content.\n2.Modify font color.\n3.Change font style.\n4.Modify font size.\nMore features are coming soon.\n'
        },
        {
          user_name: 'Try***@126.com',
          tip: 'Crop Video',
          question: 'Will video quality decrease after cutting？',
          answer: 'No need to worry about this. Video\'s quality remains the same as your original quality, and you can also choose the alternative quality you want.'
        },
        {
          user_name: 'Liy****@hotmail.com',
          tip: 'Crop Video',
          question: 'What is enjoy cut？',
          answer: 'A free online video editors.You can easily and quickly clip and cut video to any length without any foundation,You can trim, crop, rotate, flip, mirror, and adjust video.'
        },
        {
          user_name: 'Yaa****@yahoo.com',
          tip: 'Crop Video',
          question: 'What formats do uploaded files support?',
          answer: 'All video formats are supported. If it is not MP4, we will transcode first.'
        },
        {
          user_name: 'GRa*******@gmail.com',
          tip: 'Crop Video',
          question: 'What\'s the maximum size of files that I can upload?',
          answer: 'You can upload a maximum of 100MB.'
        },
        {
          user_name: 'Hko*****@gmail.com',
          tip: 'Video Converter',
          question: 'My video resolution is very high. Can I compress it lower?',
          answer: 'We support the adjustment of video resolution. You can upload video files in online convertor first, then click "resolution" to select an appropriate resolution . Your video will be reduced to this lower resolution.'
        },
        {
          user_name: 'Joh*@hotmail.com',
          tip: 'Video Converter',
          question: 'Where can I find my download video?',
          answer: 'Your download video will be saved in your local download folder and we will change its name into \'EnjoyCut\' prefix automatically . You can find the relevant video files in this folder. You can also change the default download path in your browser setting.'
        },
        {
          user_name: 'kuy****@gmail.com',
          tip: 'Watermark',
          question: 'How can I locate one watermark image accurately？',
          answer: 'You can use the free Auxiliary Line function by clicking the Auxiliary Line button on the Online Watermark page. You can drag the Auxiliary Line where you like and when you put the watermark image near to the intersection of the Auxiliary Line, it will automatically adsorb to tis Line.'
        },
        {
          user_name: 'Yho***@hotmail.com',
          tip: 'Watermark',
          question: 'Can I add one font watermark？',
          answer: 'You can upload the local GIF image or preview the  front watermark we provide automatically . After confirming and clicking the \"Start\" button, the watermark will be synthesized on your video file.'
        },
        {
          user_name: 'Hoo**@hotmail.com',
          tip: 'Merge Video',
          question: 'Video editing process preview play video, the picture is very stuck or sound stop and drop how to do?',
          answer: 'Normally this kind of problem will not happen, more depends on your current network environment, you can patiently wait for video to complete the cache, but you can continue to complete the operation, according to scientific knowledge, this is a normal phenomenon, after the conversion of exported video will still be smooth.'
        },
        {
          user_name: 'Tur****@gmail.com',
          tip: 'Merge Video',
          question: 'What will happen to my uploaded video after I finish video processing?',
          answer: 'We always attach great importance to the privacy of users. After your files are processed, they will be automatically deleted from our server within a few hours. Only you can access your files.'
        },
        {
          user_name: 'Dri**@yahoo.com',
          tip: 'Video Converter',
          question: 'I have already purchased one site. Can I upgrade to another?',
          answer: 'We offer different kinds of sites service for our users. You can choose another site based on the current one. We will calculate the price and deduct the charge fee according to your current pay. Your legitimate rights will be protected.'
        },
        {
          user_name: 'BBO**@gmail.com',
          tip: 'Video Converter',
          question: 'Is there a limit to the number of files I can convert?',
          answer: 'Our video conversion service is totally free and there\'s no limit to the number of files you can convert, so feel free to use our website as much as you want.'
        },
        {
          user_name: 'Lli*@hotmail.com',
          tip: 'Video Converter',
          question: 'What video formats do you support? ',
          answer: 'We support conversions to most of the available media formats out there, which include .mp3, .m4a, .aac, .flac, .ogg, .wav, .wma, .mp4, .avi, .mpg, .wmv, .mov, .flv and .m4v. '
        }
      ]

var merge_video_Arr = [
        {
          user_name: 'Coo****@hotmail.com',
          tip: 'Merge Video',
          question: 'What formats are supported after video splicing?',
          answer: 'Currently only MP4 format export is supported, we will continue to optimize to support more formats export! But advanced technology allows you to upload and edit any video format that is common today!'
        },
        {
          user_name: 'Geo****@gmail.com',
          tip: 'Merge Video',
          question: 'How to ensure that the splicing video will not be missing?',
          answer: 'Unique and advanced technology has laid a solid foundation for our video Mosaic products of good stability, a very small probability of this situation, but most of the video itself has a relationship, if this situation, please contact us, we will give you a satisfactory answer!'
        },
        {
          user_name: 'Hoo**@hotmail.com',
          tip: 'Merge Video',
          question: 'Video editing process preview play video, the picture is very stuck or sound stop and drop how to do?',
          answer: 'Normally this kind of problem will not happen, more depends on your current network environment, you can patiently wait for video to complete the cache, but you can continue to complete the operation, according to scientific knowledge, this is a normal phenomenon, after the conversion of exported video will still be smooth.'
        },
        {
          user_name: 'Tur****@gmail.com',
          tip: 'Merge Video',
          question: 'What will happen to my uploaded video after I finish video processing?',
          answer: 'We always attach great importance to the privacy of users. After your files are processed, they will be automatically deleted from our server within a few hours. Only you can access your files.'
        }
      ]

var watermark_Arr = [
        {
          user_name: 'mouyi***@163.com',
          tip: 'Watermark',
          question: 'What is Merge Video?',
          answer: 'Online transcoding is an online video file format and resolution converter.'
        },
        {
          user_name: 'Win***@gmail.com',
          tip: 'Watermark',
          question: 'Where are the watermark templates？',
          answer: 'After you sign up, you can view saved templates in your personal template library and rename them by double-clicking the template name.'
        },
        {
          user_name: 'Tur**@yahoo.com',
          tip: 'Watermark',
          question: 'Can I customize a font watermark?',
          answer: 'Currently we only support:\n1.Edit text content.\n2.Modify font color.\n3.Change font style.\n4.Modify font size.\nMore features are coming soon.\n'
        },
        {
          user_name: 'kuy****@gmail.com',
          tip: 'Watermark',
          question: 'How can I locate one watermark image accurately？',
          answer: 'You can use the free Auxiliary Line function by clicking the Auxiliary Line button on the Online Watermark page. You can drag the Auxiliary Line where you like and when you put the watermark image near to the intersection of the Auxiliary Line, it will automatically adsorb to tis Line.'
        },
        {
          user_name: 'Yho***@hotmail.com',
          tip: 'Watermark',
          question: 'Can I add one font watermark？',
          answer: 'You can upload the local GIF image or preview the  front watermark we provide automatically . After confirming and clicking the \"Start\" button, the watermark will be synthesized on your video file.'
        }
      ]

var video_Converter_Arr = [
        {
          user_name: 'Lih****@sina.com',
          tip: 'Video Converter',
          question: 'How long does it take to convert a video?',
          answer: 'While we offer one of the fastest conversion rates, the actual duration may vary based on the length of the original video and the time of the day. As our service is very popular, it might take slightly longer to convert during busy periods due to heavy load on our servers. The speed and stability of your internet connection may also affect the time it takes to complete the conversion process. To give you an idea, a five-minute video usually takes roughly a minute or less to convert.'
        },
        {
          user_name: 'Fre*****@mail.yahoo.com',
          tip: 'Video Converter',
          question: 'Can I download the batch videos after converted?',
          answer: 'We support multi-video converting at the same time. You can choose the appropriate site according to your personal situation. After this done, click "download" button, and you will download all the videos as ZIP directly.'
        },
        {
          user_name: 'Hko*****@gmail.com',
          tip: 'Video Converter',
          question: 'My video resolution is very high. Can I compress it lower?',
          answer: 'We support the adjustment of video resolution. You can upload video files in online convertor first, then click "resolution" to select an appropriate resolution . Your video will be reduced to this lower resolution.'
        },
        {
          user_name: 'Joh*@hotmail.com',
          tip: 'Video Converter',
          question: 'Where can I find my download video?',
          answer: 'Your download video will be saved in your local download folder and we will change its name into \'EnjoyCut\' prefix automatically . You can find the relevant video files in this folder. You can also change the default download path in your browser setting.'
        },
        {
          user_name: 'Dri**@yahoo.com',
          tip: 'Video Converter',
          question: 'I have already purchased one site. Can I upgrade to another?',
          answer: 'We offer different kinds of sites service for our users. You can choose another site based on the current one. We will calculate the price and deduct the charge fee according to your current pay. Your legitimate rights will be protected.'
        },
        {
          user_name: 'BBO**@gmail.com',
          tip: 'Video Converter',
          question: 'Is there a limit to the number of files I can convert?',
          answer: 'Our video conversion service is totally free and there\'s no limit to the number of files you can convert, so feel free to use our website as much as you want.'
        },
        {
          user_name: 'Lli*@hotmail.com',
          tip: 'Video Converter',
          question: 'What video formats do you support? ',
          answer: 'We support conversions to most of the available media formats out there, which include .mp3, .m4a, .aac, .flac, .ogg, .wav, .wma, .mp4, .avi, .mpg, .wmv, .mov, .flv and .m4v. '
        }
      ]

var crop_Video_Arr = [
        {
          user_name: 'mouyi***@163.com',
          tip: 'Crop Video',
          question: 'What is Merge Video?',
          answer: 'Online transcoding is an online video file format and resolution converter.'
        },
        {
          user_name: 'Gro****@hotmail.com',
          tip: 'Crop Video',
          question: 'I am a video clip novice, can I also use it?',
          answer: 'Sure! Love clip allows everyone (even if you are a senior user) can be arbitrary cut out of first-class video, which is its great value for the majority of ordinary users. This value reflects on video clip senior players, is naturally to save editing time and reduce the worry. Its users know that the traditional video editing software is either too professional complex, spend a lot of interactive time, even need to be in different software around special effects, or is a large resource and very unstable (crash, dead card), this is for most of our clips video, is to kill a bird with a knife, take trouble. Hi video \"light\", \"stable\", \"fast\", this time can better help you, do not bother to easily cut out first-class professional works!'
        },
        {
          user_name: 'tur***@gmail.com',
          tip: 'Crop Video',
          question: 'How long should it take to upload or download my file?',
          answer: 'This is completely dependent on the type of Internet connection you have. And the file size you uploaded.'
        },
        {
          user_name: 'Try***@126.com',
          tip: 'Crop Video',
          question: 'Will video quality decrease after cutting？',
          answer: 'No need to worry about this. Video\'s quality remains the same as your original quality, and you can also choose the alternative quality you want.'
        },
        {
          user_name: 'Liy****@hotmail.com',
          tip: 'Crop Video',
          question: 'What is enjoy cut？',
          answer: 'A free online video editors.You can easily and quickly clip and cut video to any length without any foundation,You can trim, crop, rotate, flip, mirror, and adjust video.'
        },
        {
          user_name: 'Yaa****@yahoo.com',
          tip: 'Crop Video',
          question: 'What formats do uploaded files support?',
          answer: 'All video formats are supported. If it is not MP4, we will transcode first.'
        },
        {
          user_name: 'GRa*******@gmail.com',
          tip: 'Crop Video',
          question: 'What\'s the maximum size of files that I can upload?',
          answer: 'You can upload a maximum of 100MB.'
        }
      ]

//在页面中展示内容
render('All_Products')
render('Merge_Video')
render('Watermark')
render('Video_Converter')
render('Crop_Video')
changeStyle('li1','All_Products')

//根据选择的模块显示模块下内容
function changeStyle(el,str) {
	el === 'li1' ? li1.className = 'active' : li1.className = ''
	el === 'li2' ? li2.className = 'active' : li2.className = ''
	el === 'li3' ? li3.className = 'active' : li3.className = ''
	el === 'li4' ? li4.className = 'active' : li4.className = ''
	el === 'li5' ? li5.className = 'active' : li5.className = ''

	str === 'All_Products' ? All_Products.style.display = 'flex' : All_Products.style.display = 'none'
	str === 'Merge_Video' ? Merge_Video.style.display = 'flex' : Merge_Video.style.display = 'none'
	str === 'Watermark' ? Watermark.style.display = 'flex' : Watermark.style.display = 'none'
	str === 'Video_Converter' ? Video_Converter.style.display = 'flex' : Video_Converter.style.display = 'none'
	str === 'Crop_Video' ? Crop_Video.style.display = 'flex' : Crop_Video.style.display = 'none'
}

//选择渲染的模块
function render(str) {
	let arr = []
	let father = All_Products
	switch(str){
	  case 'All_Products':
	    father = All_Products
        arr = all_Products_Arr
        break;

      case 'Merge_Video':
        father = Merge_Video
        arr = merge_video_Arr
        break;

      case 'Watermark':
        father = Watermark
        arr = watermark_Arr
        break;

      case 'Video_Converter':
        father = Video_Converter
        arr = video_Converter_Arr
        break;

      case 'Crop_Video':
        father = Crop_Video
        arr = crop_Video_Arr
        break;

      default:
        father = All_Products
        arr = all_Products_Arr
        break;
	}
	renderThis(father, arr)
}

//将渲染的内容加至某模块父元素下
function renderThis(father, arr) {
	if(arr){
		let length = arr.length
		for(let i=0;i<length;i++){
			renderQA(father, arr[i])
		}
	} else {
		let length = all_Products_Arr.length
		for(let i=0;i<length;i++){
			renderQA(All_Products, arr[i])
		}
	}
}

//这是一个完整的问答框，通过father定位，data渲染内容
function renderQA(father, data) {
	let div = document.createElement('div')
	let qa = document.createElement('div')
	let qa_left = document.createElement('div')
	let q = document.createElement('div')
	let a = document.createElement('div')
	let qa_right = document.createElement('div')
	let qa_top = document.createElement('div')
	let qa_user = document.createElement('div')
	let tip = document.createElement('div')
	let qa_question = document.createElement('div')
	let qa_answer = document.createElement('div')
	qa.className = 'qa'
	qa_left.className = 'qa_left'
	q.className = 'q'
	a.className = 'a'
	qa_right.className = 'qa_right'
	qa_top.className = 'qa_top'
	qa_user.className = 'qa_user'
	tip.className = 'tip'
	qa_question.className = 'qa_question'
	qa_answer.className = 'qa_answer'
	/////////////////////

	qa_user.innerText = 'User：' + (data && data.user_name || 'enjoycut')
	tip.innerText = (data && data.tip || 'All Products')
	qa_question.innerText = (data && data.question || 'question')
	qa_answer.innerText = (data && data.answer || 'answer')

	/////////////////////
    // <div className="qa_right">
  	//     <div className="qa_top">
  	//        <div className="qa_user">User：{data.user_name}</div>
  	//        <div className="tip">{data.tip}</div>
  	//     </div>
  	//     <div className="qa_question">{data.question}</div>
  	//     <div className="qa_answer">{data.answer}</div>
  	// </div>
	/////////////////////

	qa_top.appendChild(qa_user)
	qa_top.appendChild(tip)
	qa_right.appendChild(qa_top)
	qa_right.appendChild(qa_question)
	qa_right.appendChild(qa_answer)
	//
	// <div className="qa_left">
	//     <div className='q'></div>
	//     <div className='a'></div>
	// </div>
	/////////////////////

	qa_left.appendChild(q)
	qa_left.appendChild(a)
	/////////////////////

	qa.appendChild(qa_left)
	qa.appendChild(qa_right)

	father.appendChild(qa)
}