/*
* Javascript
*
* Subject : Handle URL (sending data in local)
*
*
* get data map:
* uri.search(true); // returns { foo: "bar", hello : ["world", "mars"] }
*/

/**
 * Sound manager
 */
soundManager.setup({
    url: 'plugins/soundmanager2/swf/',

    ontimeout: function() {
        alert("Lo sentimos este sonido no se pudo reproducir...");
    }
});


$(function(){
    
    var vars = {
        CONTENTSLOT : "#contentSlot",
        ALPHABET : [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l','m',
            'n', 'ñ', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        URI : new URI(location.href),
        URIdata : {level : 0, indice : 0, points : 0, totalPoints : 0},
        LIFE_BASE: 3,
        LIFE_CURRENT: 0,
        
        DOM_BTN_ALPHABET : '.btn',
        DOM_MESSAGE_WIN : '#popup-message-win',
        //DOM_MESSAGE_WIN_POINTS : '#popup-message-win-points',
        
        DOM_COUNT_DOWN : '#countdown'        
    };

    var App = {
        urlLocal : vars.URI.protocol() +'://'+ vars.URI.hostname() + vars.URI.path(),
        alphabetPosition : 0,
        // AUDIO
        sm : soundManager,        
        mySoundWrong : null,
        mySoundCorrect : null,
        // static
        pointsValue : 10,
        // timer ID
        countdownTimer : false,

        init : function() {
            console.log("readAllDataLevel()");
            this.readAllDataLevel();
            this.renderMyLifes();
            console.log("loadSoundManager2()");
            this.loadSoundManager2();            
            this.listenerButtonsAlphabet();
            
            
            
            
            
            // init timer
            var myLevel = parseInt(vars.URIdata.level) || 1;
            if (false/*myLevel === 2 || myLevel === 3*/) {
                var seconds = (myLevel === 3) ? 5 : 8; // countDown
                
                this.countdownTimer = setInterval( function() {
                    var remainingSeconds = seconds % 60;
                    console.log('remainingSeconds', remainingSeconds);
                    $(vars.DOM_COUNT_DOWN).text(remainingSeconds);
                    if (seconds === 0) {
                        $(vars.DOM_COUNT_DOWN).text(remainingSeconds);
                        
                        setTimeout(function() {
                            var myIndice = parseInt(vars.URIdata.indice) + 1;
                            var myPoints = parseInt(vars.URIdata.points) || 0;
                            var myTotalPoints = parseInt(vars.URIdata.totalPoints) || 0;
                            vars.URI.query({
                                level : myLevel,
                                indice : myIndice,
                                points: myPoints,
                                totalPoints : myTotalPoints
                            });               
                            vars.URIdata = vars.URI.query(true); 
                            var fileHtml = vars.URIdata.level + '_' + myIndice;
                            console.log('fileHtml', fileHtml);
                            console.log('vars.URIdata', vars.URIdata);
                            
                            App.redirect(fileHtml + '.html?' + vars.URI.query());
                        }, 100);
                        
                    } else {
                        seconds--;
                    }
                    
                }, 1000);
            }
            
            
        },
        // 01 : Get level
        readAllDataLevel : function() {
            // get data 01
            vars.URIdata = vars.URI.search(true);
            
            // load data bootstrap
            var myIndice = parseInt(vars.URIdata.indice) || 0;
            var myPoints = parseInt(vars.URIdata.points) || 0;
            var myTotalPoints = parseInt(vars.URIdata.totalPoints) || 0;
            var myLevel = parseInt(vars.URIdata.level) || -1;
            var life = parseInt(vars.URIdata.life) || vars.LIFE_BASE;
            // get data 02  
            //vars.URIdata = vars.URI.query(true);
            vars.URIdata.indice = myIndice;
            vars.URIdata.level = myLevel;
            vars.URIdata.points = myPoints;
            vars.URIdata.totalPoints = myTotalPoints;
            vars.URIdata.life = life;
            vars.URI.query(vars.URIdata);
            
            console.log("INIT");
            console.log(vars.URIdata);
            //App.data = data;
        },
        renderMyLifes : function() {
            
            console.log('LIFE',vars.URIdata.life);
            if (parseInt(vars.LIFE_BASE) === parseInt(vars.URIdata.life)) {
                // nothing
            } else {
                var counter = 0;    
                $($(".popup-life-items img").get().reverse()).each(function(index, element) {
                    console.log('index', index);
                   // vars.URIdata.life = 1;

                    if (parseInt(vars.URIdata.life) === 2 && counter < 2) {
                        if (element.getAttribute('src') === 'assets/img/life.png') {
                            element.setAttribute('src', 'assets/img/life-off.png');
                            counter = counter +1;
                        }

                    } else if (parseInt(vars.URIdata.life) === 1 && counter < 1){
                        if (element.getAttribute('src') === 'assets/img/life.png') {
                            element.setAttribute('src', 'assets/img/life-off.png');
                            counter = counter +1;
                        }
                    }

                });
            }
            
        },        
        
        // cargar los sonidos correspondientes a la pagina
        // Requiere the library soundmanager2
        loadSoundManager2 : function() {
            // step 01
            var stringSound = '';
            $(vars.DOM_BTN_ALPHABET).each(function(index, element) {
                var uriAudio = $(this).attr( "data-audio" ) || '';                
                if (uriAudio.length > 0) {
                    stringSound = uriAudio;
                    return false;
                }
            });
    
//            // setting sound
//            var mp3URL = this.cordova_getMediaURL(stringSound);
//            var media = new Media(mp3URL, null, this.cordova_mediaError, this.cordova_callbackAbcMediaStatus); //media.play(); 
//            this.mySoundCorrect = media;

            var urlAudio = stringSound;
            var mySound = App.sm.createSound({
                id: 'some-id-for-your-sound',
                url: urlAudio,
                autoLoad: true,
                autoPlay: false,                
            });
            //mySound.play();
            this.mySoundCorrect = mySound;  

            
        },
        redirect : function(stringFileHtml) {
            window.location.href = vars.URI.protocol() +'://'+ vars.URI.hostname() + vars.URI.directory() + '/' + stringFileHtml;
        },        
        listenerButtonsAlphabet : function() {
            // LISTENER DESPUES DE CREAR LOS OBJETOS
            $(vars.DOM_BTN_ALPHABET).unbind();
            $(vars.DOM_BTN_ALPHABET).bind('click',function() {
                
                var myLevel = parseInt(vars.URIdata.level) || 1;
                if (myLevel === 1) {
                    getDomButtonCorrect();
                    isLevel1($(this));
                } else if (myLevel === 2) {
                    getDomButtonCorrect();
                    isLevel2($(this));
                } else if (myLevel === 3) {
                    isLevel3($(this));
                }
                
            });
            
            // private function Select Correct
            function getDomButtonCorrect() {
                var button = false;
                $(vars.DOM_BTN_ALPHABET).each(function(index, element) {
                    var uriAudio = $(this).attr( "data-audio" ) || '';
                    if (uriAudio.length > 0) {
                        button = element;
                        button.className = button.className + " x-btn-1-green";
                        return false;
                    }
                });
                
                return button;
            }
            
            /*
             * Action Level 1
             * at this level are accumulated all points played
             */
            function isLevel1(el) {

                var attribute = el.attr('data-audio') || '';
                var myIndice = parseInt(vars.URIdata.indice) || 0;
                var myPoints = parseInt(vars.URIdata.points) || 0;
                var myTotalPoints = parseInt(vars.URIdata.totalPoints) || 0;
                var myLevel = parseInt(vars.URIdata.level) || 1;

                if (attribute.length > 0) {
                    var totalPointsQuery =  myTotalPoints + parseInt(App.pointsValue);
                    $(vars.DOM_MESSAGE_WIN).fadeIn();  
                    $(vars.DOM_MESSAGE_WIN).find('div').html( totalPointsQuery +" puntos");                       
                    //console.log(vars.URIdata);
                    
                    vars.URIdata.indice = (myIndice + 1);
                    vars.URIdata.points = App.pointsValue;
                    vars.URIdata.totalPoints = totalPointsQuery;
                    vars.URI.query(vars.URIdata);
                    
                    console.log('vars.URIdata', vars.URIdata);
                    console.log('vars.URI.query()', vars.URI.query());
                    
                    //App.mySoundCorrect.play();
                    App.mySoundCorrect.play();
                    setTimeout(function() {
                        var fileHtml = myLevel + '_' + vars.URIdata.indice;
                        App.redirect(fileHtml + '.html?' + vars.URI.query());
                    }, 700);  

                    
                    //alert('vars.URIdata ' + JSON.stringify(vars.URIdata) );
                    console.log("app.data despues : vars.URI.query()", vars.URI.query());
                } else { // WRONG                
                    vars.URI.query({
                        level : myLevel,
                        indice : (myIndice + 1),
                        points: 0,
                        totalPoints : myTotalPoints + 0
                    });
                    vars.URIdata = vars.URI.query(true);
                    console.log("app.data despues : vars.URI.query()", vars.URI.query());
                
                    // redirect
                    setTimeout(function() {
                        var fileHtml = myLevel + '_' + vars.URIdata.indice;
                        App.redirect(fileHtml + '.html?' + vars.URI.query());
                    }, 700);                    
                    
                }

            }
            
            /*
             * Action Level 2
             */
            function isLevel2(el) {
                console.log('app.data antes : vars.URIdata', vars.URIdata);
                var attribute = el.attr('data-audio') || '';
                var myIndice = parseInt(vars.URIdata.indice) || 0;
                var myPoints = parseInt(vars.URIdata.points) || 0;
                var myTotalPoints = parseInt(vars.URIdata.totalPoints) || 0;
                var myLevel = parseInt(vars.URIdata.level) || 1;
                
                if (attribute.length > 0) {
                    var totalPointsQuery =  myTotalPoints + parseInt(App.pointsValue);
                    $(vars.DOM_MESSAGE_WIN).fadeIn();  
                    $(vars.DOM_MESSAGE_WIN).find('div').html( totalPointsQuery +" puntos");                    
                    //App.mySound.play();
                    vars.URI.query({
                        level : myLevel,
                        indice : (myIndice + 1),
                        points: App.pointsValue,
                        totalPoints : totalPointsQuery
                    });
                    vars.URIdata = vars.URI.query(true);
                    console.log("app.data despues : vars.URI.query()", vars.URI.query());
                    App.mySoundCorrect.play();
                    setTimeout(function() {
                        var fileHtml = myLevel + '_' + vars.URIdata.indice;
                        App.redirect(fileHtml + '.html?' + vars.URI.query());
                    }, 700);  
                    
                } else { // WRONG                
                    vars.URI.query({
                        level : myLevel,
                        indice : (myIndice + 1),
                        points: 0,
                        totalPoints : myTotalPoints + 0
                    });
                    vars.URIdata = vars.URI.query(true);
                    console.log("app.data despues : vars.URI.query()", vars.URI.query());
                }
                // redirect
                 setTimeout(function() {
                     var fileHtml = myLevel + '_' + vars.URIdata.indice;
                     App.redirect(fileHtml + '.html?' + vars.URI.query());
                 }, 700);            
            }
            
            /*
             * Action Level 3
             */
            function isLevel3(el) {
                console.log('app.data antes : vars.URIdata', vars.URIdata);
                var attribute = el.attr('data-audio') || '';
                var myIndice = parseInt(vars.URIdata.indice) || 0;
                var myPoints = parseInt(vars.URIdata.points) || 0;
                var myTotalPoints = parseInt(vars.URIdata.totalPoints) || 0;
                var myLevel = parseInt(vars.URIdata.level) || 1;
                var life = parseInt(vars.URIdata.life) || vars.LIFE_BASE;
                //console.log('attribute', attribute);
                if (attribute.length > 0) {
                    getDomButtonCorrect();
                    //App.mySoundCorrect.play();
                    vars.URI.query({
                        level : myLevel,
                        indice : (myIndice + 1),
                        points: App.pointsValue,
                        totalPoints : myTotalPoints + parseInt(App.pointsValue),
                        life :life
                    });
                    vars.URIdata = vars.URI.query(true);
                    console.log('app.data despues : vars.URIdata', vars.URIdata);
                    
                    // redirect
                     setTimeout(function() {
                         var fileHtml = myLevel + '_' + vars.URIdata.indice;
                         App.redirect(fileHtml + '.html?' + vars.URI.query());
                     }, 700); 
                    
                    
                } else { // WRONG
                    console.log("WRONG", vars.URI.query());
                        vars.URIdata.life = (life-1);
                        console.log('echo',vars.URIdata);
                        vars.URI.query(vars.URIdata);    
                    
                    var flagredirect = false;
                    $($(".popup-life-items img").get().reverse()).each(function(index, element) {
                        if (element.getAttribute('src') === 'assets/img/life.png') {
                            element.setAttribute('src', 'assets/img/life-off.png');
                            flagredirect = false;
                            return false;
                        } else {
                            flagredirect = true;
                        }
                    });
                    

                    // redirect perdio todas sus vidas
                    if (flagredirect === true) {
                        vars.URIdata.indice = myIndice;
                        vars.URIdata.level = myLevel;
                        vars.URIdata.points = myPoints;
                        vars.URIdata.totalPoints = myTotalPoints;
                     
                        
                        /*vars.URI.query({
                             level : myLevel,
                             indice : (myIndice + 1),
                             points: 0,
                             totalPoints : myTotalPoints + 0
                         });*/
                         //vars.URIdata = vars.URI.query(true);
                         console.log('data es', vars.URI.query(true));

//                         setTimeout(function() {
//                             var fileHtml = myLevel + '_' + vars.URIdata.indice;
//                             App.redirect(fileHtml + '.html?' + vars.URI.query());
//                         }, 700);
                    }
                    
                }/* endIF */
           
            }            
            
                       
        },

        // ------------------ NATIVO ANDROID -------------
        // get path file 
        cordova_getMediaURL: function(s) {
            if (typeof(device) != "undefined") {
                if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
                return s;   
            } else {
                return false;
            }
        },
        cordova_mediaError: function(e) {
            alert('Media Error');
            alert(JSON.stringify(e));
        },
        cordova_callbackAbcMediaStatus: function(e) {
            //alert('estado MEDIA es  ' + JSON.stringify(e));
            
            if (4 == e) { // Media.MEDIA_STOPPED = 4;
                var fileHtml = vars.URIdata.level + '_' + vars.URIdata.indice + '.html?' + vars.URI.query();
                console.log(' fileHtml = '+fileHtml)
                App.redirect(fileHtml);
            }
        }
        
    };
    

    soundManager.onready(function() {
        //
        App.init();
    });


});


/******************************************************************************/
// Android
/******************************************************************************/
document.addEventListener('deviceready', onDeviceReady, false);
function onDeviceReady() {
    App.init();
    //alert("App.init android");
};

