var isAndroid = kendo.support.mobileOS.android;

//var apiSite = 'https://api-linko-sports-center.herokuapp.com/';
var apiSite = 'https://beida-api-for-firebase.herokuapp.com/';

var loadCourses = false;

// override datasources
navDataSource = new kendo.data.DataSource({
  // 使用 data 的方法一
  //  data: [
  //      {
  //        "課程名稱": "一起來運動",
  //        "url": "2-views/courseDetail.html?courseId=U0001",
  //        "section": "A"
  //      },
  //      {
  //        "課程名稱": "運動運動",
  //        "url": "2-views/pullToRefresh.html?courseId=U0002",
  //        "section": "A"        
  //      },
  //      {
  //        "課程名稱": "年後減肥大作戰",
  //        "url": "2-views/courseDetail.html?courseId=U0003",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "飛輪",
  //        "url": "2-views/courseDetail.html?courseId=U0004",
  //        "section": "B"        
  //      },
  //      {
  //        "課程名稱": "瑜珈",
  //        "url": "2-views/courseDetail.html?courseId=U0005",
  //        "section": "C"        
  //      },    
  //    
  //  ],
  
  // 使用 data 的方法二, transport
  transport: {
    read: function (data) { getCourseData(navDataSource); getCourseHistory(courseHistorySource);  }
  },
//  sort: {
//    field: "課程名稱",
//    dir: "asc"
//  },
  requestStart: function () {
    kendo.ui.progress($("#loading"), true);
  },
  requestEnd: function () {
    kendo.ui.progress($("#loading"), false);
  },

  schema: {
    total: function () {
      console.log("scheme total");
      取得經緯度();    
      return 77;
    }
  },
  serverPaging: true,
  pageSize: 40,
  //group: { field: "section" }
})


courseHistorySource = new kendo.data.DataSource({
  transport: {
    read: function (data) { getCourseHistory(courseHistorySource); }
  },
//  sort: {
//    field: "課程名稱",
//    dir: "asc"
//  },
  requestStart: function () {
    kendo.ui.progress($("#loading"), true);
  },
  requestEnd: function () {
    kendo.ui.progress($("#loading"), false);
  },

  schema: {
    total: function () {
      console.log("courseHistorySource scheme total");
      //取得經緯度();    
      return 77;
    }
  },
  serverPaging: true,
  pageSize: 40,
  //group: { field: "section" }
})

searchDataSource = navDataSource;

var indexForTest=0;
var dataTemp=[];
function getCourseData(data) {
  console.log("prepare data for CourseListView");
  
  if (loadCourses == false) return 1;
  
//  allDataReady = 0;
  readCourses();

//  var checkDataReady = setInterval(function(){
//    if (allDataReady==4) {
//      //console.log(inCourse, courseData);
//      clearInterval(checkDataReady);
      console.log("Set up data for listview")
      //var dataTemp =[];
//      inCourse.forEach(function(course, index, array){
      for (var i=0; i < inCourse.length; i++){
        courseData.forEach(function(item, ind, arr){
//          if (course==item[0]) {
          if (inCourse[i]==item[0]) {
            //console.log(course, ind);
            var 課程圖片Url = ( courseData[ind][11] !="")?courseData[ind][11]:"picPlaceholder.png";
            var courseTitle = {
              "課程編號": courseData[ind][0]+"-"+indexForTest++,              
              "課程名稱": courseData[ind][1],
              "老師時間": courseData[ind][2] + " | " + courseData[ind][3], 
              "課程費用": courseData[ind][5],  
              "課程圖片": 課程圖片Url,
              "繳費狀況": "未繳費",
              "繳費狀況顏色": "coral",              
              "url": "2-views/courseDetail.html?courseId=" + courseData[ind][0],
              "section": "A"             
            };   
            
            courseMember.forEach(function(course1, index1, array1){
              //console.log(index1, courseData[ind][0]);
              if (course1[0]==courseData[ind][0]) {
                for (var i=1; i< course1.length;i++){
                  //console.log(course1[i][3]);
                  if (course1[i][3]== userId[1] && course1[i][1]=="已繳費") {
                    courseTitle.繳費狀況 = "已繳費";
                    courseTitle.繳費狀況顏色 = "darkslategray";
                  } else if (course1[i][3]== userId[1] && course1[i][1]=="免費") {
                    courseTitle.繳費狀況 = "免費";
                    courseTitle.繳費狀況顏色 = "darkslategray";                    
                  }
                }
              }
            });           
            
            
            dataTemp.push(courseTitle);

          }
        });
      };
   
      console.log(dataTemp, length);
      data.success(dataTemp.slice().reverse()); //加上 slice() 才不會改變 dataTemp
      
      if (dataTemp.length==0) {
        $("#報名課程title").text("尚無報名課程");
      }else {
        $("#報名課程title").text("已報名課程");
      }    
//    }
//    
//  }, 100);
  //checkScroll();
}

function getCourseHistory(data) {
  console.log("getting CourseHistory", loadCourses);
  
  if (loadCourses == false) return 1;

//  var checkDataReady = setInterval(function(){
//    //console.log("in history", allDataReady);
//    if (allDataReady==4) {
//      clearInterval(checkDataReady);
//      //console.log("in xxx", myHistory)
      var dataTemp =[];
      myHistory.forEach(function(course, index, array){
        console.log(course);
        courseHistory.forEach(function(item, ind, arr){
          if (course==item[0]) {
            //console.log(course, ind);
            var 課程圖片Url = ( item[11] !="" )?item[11]:"picPlaceholder.png";            
            var courseTitle = {
              "課程編號": item[0],              
              "課程名稱": item[1],
              "老師時間": item[2] + " | " + item[3], 
              "課程費用": item[5], 
              "課程圖片": 課程圖片Url,              
              "url": "2-views/courseDetail.html?courseId=" + courseHistory[ind][0],
              "section": "A"             
            };
            dataTemp.push(courseTitle);
          }
        });
      });
   
      data.success(dataTemp);  
      
      if (dataTemp.length==0) {
        $("#參加過課程title").text("尚無參加過課程");
      }else {
        $("#參加過課程title").text("參加過課程");
      }      
//      
//    }
//    
//  }, 100);
  setTimeout(checkScroll, 500);
}

function mainShow(e) {
  console.log("main page showed");
  if (show到底) {
    $("#toBottom").show();
  } else {
    $("#toBottom").hide();
  }

  $("#ChatEnter").hide();
}

function chatShow(e) {
  console.log("chat page showed");

  const enterInputHTML = "<hr><input id=\"ChatEnterText\" type=\"text\" class=\"NotoSansFont\" placeholder=\"Type here ...\" style=\"border-width:0px;margin-left:20px; background:aqua;padding:10px; border-radius:10px; width:80%\"><span style=\"margin-left: 10px\" onclick=\"console.log('send a message')\">Send</span>";
  
  $("#ChatEnter").html(enterInputHTML);
  $("#ChatEnter").show();

}

function removeView(e) {
  //console.log("removeView", e);  
  if (reloadCourseNeeded) {
    readCourses(); 
    reloadCourseNeeded = false;
  }
  if (!e.view.element.data("persist")) {
    //console.log(e);
    
    // KPC: 找不到 persist 如何設定，只好用粗暴的做法
    if (e.view.id != "#forms") e.view.purge();
    
    //e.view.purge();
  }

}

function initMainListView(e){
  console.log("initMainListView");
//  var scroller = e.view.scroller;
//  scroller.bind("scroll", function(e) {
//    /* The result can be observed in the DevTools(F12) console of the browser. */
//    console.log("top***:",e.scrollTop);
//    /* The result can be observed in the DevTools(F12) console of the browser. */
//    console.log("left***:",e.scrollLeft);
//  });  
}

function initChatListView(e) {
  console.log("initChatListView");

}

var desktop = !kendo.support.mobileOS;

function showSearch() {
//  $("#normal").addClass("navbar-hidden");
//  $("#search").removeClass("navbar-hidden");
//  if (desktop) {
//    setTimeout(function () {
//      $("#demos-search").focus();
//    });
//  } else {
//    $("#demos-search").focus();
//  }
  console.log("search");
}

function hideSearch() {
  $("#normal").removeClass("navbar-hidden");
  $("#search").addClass("navbar-hidden");
}

function checkSearch(e) {
  if (!searchDataSource.filter()) {
    e.preventDefault();
    this.replace([]);
    $("#search-tooltip").show();
  } else {
    $("#search-tooltip").hide();
  }
}

function searchForCourse(value){ 
  if (value.length < 2) {
        searchDataSource.filter(null);
    } else {
        var filter = { logic: "and", filters: []};
        var words = value.split(" ");

        for (var i = 0; i < words.length; i ++) {
            var word = words[i];
            filter.filters.push({
                logic: "or",
                filters: [
                    //{ field: "section", operator: "contains", value: word },
                    { field: "課程名稱", operator: "contains", value: word },
                    //{ field: "title", operator: titleContains(word) }
                ]
            });
        }

        searchDataSource.filter(filter);
    }
}

window.app = new kendo.mobile.Application($(document.body), {
  layout: "courseDiv",
  transition: "slide",
  skin: "nova",
  icon: {
    "": '@Url.Content("~/content/mobile/AppIcon72x72.png")',
    "72x72": '@Url.Content("~/content/mobile/AppIcon72x72.png")',
    "76x76": '@Url.Content("~/content/mobile/AppIcon76x76.png")',
    "114x114": '@Url.Content("~/content/mobile/AppIcon72x72@2x.png")',
    "120x120": '@Url.Content("~/content/mobile/AppIcon76x76@2x.png")',
    "152x152": '@Url.Content("~/content/mobile/AppIcon76x76@2x.png")'
  }
});