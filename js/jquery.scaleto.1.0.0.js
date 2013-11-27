(function($) {

    $.fn.scaleTo = function(options) {
        var _len = this.length;
        for(var i=0;i<_len;i++){
        var self = $(this[i]);
        var scaleTo = {target:{},parent:{}};
        var settings = $.extend({
            'scale': 'cover',
            'parent': null,
            'targetSize': null,
            'parentSize': null,
            'resize': false,
            'resizeWait': 200
        }, options);
        
        //Switch functions for fit vs scale
        var greater = function(parentRatio, TargetRatio) { return parentRatio < TargetRatio; }
           ,less = function(parentRatio, TargetRatio) { return parentRatio > TargetRatio; };        
        var operatorL = less
           ,operatorP = greater;       
        
        //Setup objs and attributes
        settings.target = self;
        settings.parent = (settings.parent) ? $(settings.parent) : settings.target.parent();         
                
        //Switch scale:fit
        if (settings.scale == 'fit') { operatorL = greater; operatorP = less; }                       
        
        // Get target diminsions 
        if ( settings.targetSize ){
            scaleTo.target = { w:settings.targetSize.w,h:settings.targetSize.h,r: settings.targetSize.h / settings.targetSize.w };
        }else{
            var imgSrc = settings.target.attr("src");
            if (typeof imgSrc !== "undefined" && imgSrc !== null) {
                var loadImg = new Image();
                loadImg.src = imgSrc;
        
                scaleTo.target.w  = loadImg.width;
                scaleTo.target.h = loadImg.height;
            }else{
                scaleTo.target.w  = settings.target.width();
                scaleTo.target.h = settings.target.height();
            }     
        }
        
        scaleTo.target.r = scaleTo.target.h / scaleTo.target.w;   
        
        function marginAdj(targetDim,parentDim) {  return (targetDim - parentDim) / -2; }

       // Scale Background            
        (function scaleIt() {
    
            if ( settings.parentSize ){
                scaleTo.parent = { w:settings.parentSize.w, h:settings.parentSize.h };
            }else{
                scaleTo.parent.w = settings.parent.width();
                scaleTo.parent.h = settings.parent.height(); 
            }
            
            //Get dimensions, calculate, and apply  
            if ( operatorL( ( scaleTo.parent.h / scaleTo.parent.w ), scaleTo.target.r ) && 
            settings.scale !== "landscape" || 
            settings.scale === "portrait") {
                var newImgWidth = scaleTo.parent.h / scaleTo.target.r;
                settings.target.css({
                    height:scaleTo.parent.h,
                    width:newImgWidth,
                    marginLeft:marginAdj(newImgWidth,scaleTo.parent.w),
                    marginTop:0,
                    display:'block'
                });          
            } else 
            if ( operatorP( ( scaleTo.parent.h / scaleTo.parent.w ), scaleTo.target.r ) && 
            settings.scale !== "portrait" || 
            settings.scale == "landscape") {
                var newImgHeight = scaleTo.target.r * scaleTo.parent.w;
                settings.target.css({
                    width:scaleTo.parent.w,
                    height:newImgHeight,
                    marginTop: marginAdj(newImgHeight,scaleTo.parent.h),
                    marginLeft:0,
                    display:'block'
                });
            }

            if (settings.resize){
                scaleToTimer = null;
                $(window).bind('resize.ScaleTo',function(){
                    clearTimeout(scaleToTimer);
                    scaleToTimer = setTimeout(scaleIt,settings.resizeWait);                    
                });
            }else{
                $(window).unbind('resize.ScaleTo');
            }           

        })();

        }
        return this;
    };
})(jQuery);
