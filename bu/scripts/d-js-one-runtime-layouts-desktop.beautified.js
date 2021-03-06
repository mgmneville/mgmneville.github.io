(function(a) {
    function f() {
        Parameters.AfterAjaxCommand = function(b) {
            for (var c in a.layoutDevice.components) a.layoutDevice.components[c] && a.layoutDevice.components[c].afterAjaxCommand && a.layoutDevice.components[c].afterAjaxCommand(b);
            a.layoutManager.updateContainerMinimumHeight();
            a.layoutDevice.addParallaxBehavior();
        };
    }
    a.extend({
        layoutDevice: a.extend(!0, {}, layoutDeviceInterface)
    });
    a.extend(a.layoutDevice, {
        type: "desktop",
        components: {},
        onReady: function(b, c) {
            a("body").addClass("dmDesktopBody").addClass("dmLargeBody");
            if (b) {
                f();
                for (var d in a.layoutDevice.components) if (a.layoutDevice.components[d]) a.layoutDevice.components[d].onReadyEditorMode();
                a.layoutManager.markCurrentSelectedNavigation();
            } else {
                f();
                for (var e in a.layoutDevice.components) if (a.layoutDevice.components[e]) a.layoutDevice.components[e].onReadyPreviewMode();
                a.layoutManager.markCurrentSelectedNavigation();
                a.layoutDevice.addParallaxBehavior();
            }
        },
        onLoad: function(b, c) {
            if (b) for (var d in a.layoutDevice.components) {
                if (a.layoutDevice.components[d]) a.layoutDevice.components[d].onLoadEditorMode();
            } else for (var e in a.layoutDevice.components) if (a.layoutDevice.components[e]) a.layoutDevice.components[e].onLoadPreviewMode();
            a.layoutManager.updateContainerMinimumHeight();
        },
        getTopFixedElementsOffset: function() {
            return 0;
        },
        getBottomFixedElementsOffset: function() {
            return 0;
        },
        initInnerBar: function(b) {
            a.DM.isCurrentHomePage() ? a("#innerBar").addClass("dmDisplay_None") : a("#innerBar").removeClass("dmDisplay_None");
            a.layoutManager.initInnerPageTitle(b);
        },
        onAjaxLinkClick: function(b, c) {
            for (var d in a.layoutDevice.components) if (a.layoutDevice.components[d] && a.layoutDevice.components[d].onAjaxLinkClick) a.layoutDevice.components[d].onAjaxLinkClick(b, c);
        },
        addParallaxBehavior: function() {
            if (!a.layoutManager._is_touch_device && !a("body").hasClass("touchDevice")) {
                var b;
                b = a("#dm").find("[data-background-parallax-selector],.dmSectionParallaxNew");
                var c = !a.browser.msie || 8 <= a.browser.version || 8 <= document.documentMode;
                0 < b.length && c && (b = b.data(), b = b.backgroundParallaxSelector + ",.dmSectionParallaxNew", 
                a(b).filter(":not(.dmSectionNoParallax)").makeParallax(.1));
                if (navigator.userAgent.match(/Trident\/7\./)) a("body").on("mousewheel", function() {
                    event.preventDefault();
                    window.scrollTo(0, window.pageYOffset - event.wheelDelta);
                });
            }
        },
        setParallax: function(a, c) {
            c ? a.makeParallax(.1) : a.makeNoParallax(.1);
        }
    });
})(jQuery);