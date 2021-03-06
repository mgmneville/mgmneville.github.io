(function() {
    var a = Math, h = /webkit/i.test(navigator.appVersion) ? "webkit" : /firefox/i.test(navigator.userAgent) ? "Moz" : "opera" in window ? "O" : "", u = "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix(), p = "ontouchstart" in window, r = h + "Transform" in document.documentElement.style, e = /android/gi.test(navigator.appVersion), c = /iphone|ipad/gi.test(navigator.appVersion), b = /playbook/gi.test(navigator.appVersion), t = c || b, n = function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
            return setTimeout(a, 1);
        };
    }(), m = window.cancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout, k = "onorientationchange" in window ? "orientationchange" : "resize", y = p ? "touchstart" : "mousedown", l = p ? "touchmove" : "mousemove", q = p ? "touchend" : "mouseup", v = p ? "touchcancel" : "mouseup", z = "Moz" == h ? "DOMMouseScroll" : "mousewheel", w = "translate" + (u ? "3d(" : "("), x = u ? ",0)" : ")", b = function(a, d) {
        var g = this, l = document, b;
        g.wrapper = "object" == typeof a ? a : l.getElementById(a);
        g.wrapper.style.overflow = "hidden";
        g.scroller = g.wrapper.children[0];
        g.options = {
            hScroll: !0,
            vScroll: !0,
            bounce: !0,
            bounceLock: !1,
            momentum: !0,
            lockDirection: !0,
            useTransform: !0,
            useTransition: !1,
            topOffset: 0,
            checkDOMChanges: !1,
            hScrollbar: !0,
            vScrollbar: !0,
            fixedScrollbar: e,
            hideScrollbar: c,
            fadeScrollbar: c && u,
            scrollbarClass: "",
            zoom: !1,
            zoomMin: 1,
            zoomMax: 4,
            doubleTapZoom: 2,
            wheelAction: "scroll",
            snap: !1,
            snapThreshold: 1,
            onRefresh: null,
            onBeforeScrollStart: function(a) {
                a.preventDefault();
            },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null,
            onZoomStart: null,
            onZoom: null,
            onZoomEnd: null
        };
        for (b in d) g.options[b] = d[b];
        g.options.useTransform = r ? g.options.useTransform : !1;
        g.options.hScrollbar = g.options.hScroll && g.options.hScrollbar;
        g.options.vScrollbar = g.options.vScroll && g.options.vScrollbar;
        g.options.zoom = g.options.useTransform && g.options.zoom;
        g.options.useTransition = t && g.options.useTransition;
        g.scroller.style[h + "TransitionProperty"] = g.options.useTransform ? "-" + h.toLowerCase() + "-transform" : "top left";
        g.scroller.style[h + "TransitionDuration"] = "0";
        g.scroller.style[h + "TransformOrigin"] = "0 0";
        g.options.useTransition && (g.scroller.style[h + "TransitionTimingFunction"] = "cubic-bezier(0.33,0.66,0.66,1)");
        g.options.useTransform ? g.scroller.style[h + "Transform"] = w + "0,0" + x : g.scroller.style.cssText += ";position:relative;top:0;left:0";
        g.options.useTransition && (g.options.fixedScrollbar = !0);
        g.refresh();
        g._bind(k, window);
        g._bind(y);
        p || (g._bind("mouseout", g.wrapper), g._bind(z));
        g.options.checkDOMChanges && (g.checkDOMTime = setInterval(function() {
            g._checkDOMChanges();
        }, 500));
    };
    b.prototype = {
        enabled: !0,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0,
        currPageY: 0,
        pagesX: [],
        pagesY: [],
        aniTime: null,
        wheelZoomCount: 0,
        handleEvent: function(a) {
            switch (a.type) {
              case y:
                if (!p && 0 !== a.button) break;
                this._start(a);
                break;

              case l:
                this._move(a);
                break;

              case q:
              case v:
                this._end(a);
                break;

              case k:
                this._resize();
                break;

              case z:
                this._wheel(a);
                break;

              case "mouseout":
                this._mouseout(a);
                break;

              case "webkitTransitionEnd":
                this._transitionEnd(a);
            }
        },
        _checkDOMChanges: function() {
            this.moved || this.zoomed || this.animating || this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale || this.refresh();
        },
        _scrollbar: function(f) {
            var d = document, g;
            this[f + "Scrollbar"] ? (this[f + "ScrollbarWrapper"] || (g = d.createElement("div"), 
            this.options.scrollbarClass ? g.className = this.options.scrollbarClass + f.toUpperCase() : g.style.cssText = "position:absolute;z-index:100;" + ("h" == f ? "height:7px;bottom:1px;left:2px;right:" + (this.vScrollbar ? "7" : "2") + "px" : "width:7px;bottom:" + (this.hScrollbar ? "7" : "2") + "px;top:2px;right:1px"), 
            g.style.cssText += ";pointer-events:none;-" + h + "-transition-property:opacity;-" + h + "-transition-duration:" + (this.options.fadeScrollbar ? "350ms" : "0") + ";overflow:hidden;opacity:" + (this.options.hideScrollbar ? "0" : "1"), 
            this.wrapper.appendChild(g), this[f + "ScrollbarWrapper"] = g, g = d.createElement("div"), 
            this.options.scrollbarClass || (g.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-" + h + "-background-clip:padding-box;-" + h + "-box-sizing:border-box;" + ("h" == f ? "height:100%" : "width:100%") + ";-" + h + "-border-radius:3px;border-radius:3px"), 
            g.style.cssText += ";pointer-events:none;-" + h + "-transition-property:-" + h + "-transform;-" + h + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-" + h + "-transition-duration:0;-" + h + "-transform:" + w + "0,0" + x, 
            this.options.useTransition && (g.style.cssText += ";-" + h + "-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"), 
            this[f + "ScrollbarWrapper"].appendChild(g), this[f + "ScrollbarIndicator"] = g), 
            "h" == f ? (this.hScrollbarSize = this.hScrollbarWrapper.clientWidth, this.hScrollbarIndicatorSize = a.max(a.round(this.hScrollbarSize * this.hScrollbarSize / this.scrollerW), 8), 
            this.hScrollbarIndicator.style.width = this.hScrollbarIndicatorSize + "px", this.hScrollbarMaxScroll = this.hScrollbarSize - this.hScrollbarIndicatorSize, 
            this.hScrollbarProp = this.hScrollbarMaxScroll / this.maxScrollX) : (this.vScrollbarSize = this.vScrollbarWrapper.clientHeight, 
            this.vScrollbarIndicatorSize = a.max(a.round(this.vScrollbarSize * this.vScrollbarSize / this.scrollerH), 8), 
            this.vScrollbarIndicator.style.height = this.vScrollbarIndicatorSize + "px", this.vScrollbarMaxScroll = this.vScrollbarSize - this.vScrollbarIndicatorSize, 
            this.vScrollbarProp = this.vScrollbarMaxScroll / this.maxScrollY), this._scrollbarPos(f, !0)) : this[f + "ScrollbarWrapper"] && (r && (this[f + "ScrollbarIndicator"].style[h + "Transform"] = ""), 
            this[f + "ScrollbarWrapper"].parentNode.removeChild(this[f + "ScrollbarWrapper"]), 
            this[f + "ScrollbarWrapper"] = null, this[f + "ScrollbarIndicator"] = null);
        },
        _resize: function() {
            var a = this;
            setTimeout(function() {
                a.refresh();
            }, e ? 200 : 0);
        },
        _pos: function(f, d) {
            f = this.hScroll ? f : 0;
            d = this.vScroll ? d : 0;
            this.options.useTransform ? this.scroller.style[h + "Transform"] = w + f + "px," + d + "px" + x + " scale(" + this.scale + ")" : (f = a.round(f), 
            d = a.round(d), this.scroller.style.left = f + "px", this.scroller.style.top = d + "px");
            this.x = f;
            this.y = d;
            this._scrollbarPos("h");
            this._scrollbarPos("v");
        },
        _scrollbarPos: function(f, d) {
            var g = "h" == f ? this.x : this.y;
            this[f + "Scrollbar"] && (g *= this[f + "ScrollbarProp"], 0 > g ? (this.options.fixedScrollbar || (g = this[f + "ScrollbarIndicatorSize"] + a.round(3 * g), 
            8 > g && (g = 8), this[f + "ScrollbarIndicator"].style["h" == f ? "width" : "height"] = g + "px"), 
            g = 0) : g > this[f + "ScrollbarMaxScroll"] && (this.options.fixedScrollbar ? g = this[f + "ScrollbarMaxScroll"] : (g = this[f + "ScrollbarIndicatorSize"] - a.round(3 * (g - this[f + "ScrollbarMaxScroll"])), 
            8 > g && (g = 8), this[f + "ScrollbarIndicator"].style["h" == f ? "width" : "height"] = g + "px", 
            g = this[f + "ScrollbarMaxScroll"] + (this[f + "ScrollbarIndicatorSize"] - g))), 
            this[f + "ScrollbarWrapper"].style[h + "TransitionDelay"] = "0", this[f + "ScrollbarWrapper"].style.opacity = d && this.options.hideScrollbar ? "0" : "1", 
            this[f + "ScrollbarIndicator"].style[h + "Transform"] = w + ("h" == f ? g + "px,0" : "0," + g + "px") + x);
        },
        _start: function(f) {
            var d = p ? f.touches[0] : f, g, c;
            this.enabled && (this.options.onBeforeScrollStart && this.options.onBeforeScrollStart.call(this, f), 
            (this.options.useTransition || this.options.zoom) && this._transitionTime(0), this.zoomed = this.animating = this.moved = !1, 
            this.dirY = this.dirX = this.absDistY = this.absDistX = this.distY = this.distX = 0, 
            this.options.zoom && p && 1 < f.touches.length && (c = a.abs(f.touches[0].pageX - f.touches[1].pageX), 
            g = a.abs(f.touches[0].pageY - f.touches[1].pageY), this.touchesDistStart = a.sqrt(c * c + g * g), 
            this.originX = a.abs(f.touches[0].pageX + f.touches[1].pageX - 2 * this.wrapperOffsetLeft) / 2 - this.x, 
            this.originY = a.abs(f.touches[0].pageY + f.touches[1].pageY - 2 * this.wrapperOffsetTop) / 2 - this.y, 
            this.options.onZoomStart && this.options.onZoomStart.call(this, f)), this.options.momentum && (this.options.useTransform ? (g = getComputedStyle(this.scroller, null)[h + "Transform"].replace(/[^0-9-.,]/g, "").split(","), 
            c = 1 * g[4], g = 1 * g[5]) : (c = 1 * getComputedStyle(this.scroller, null).left.replace(/[^0-9-]/g, ""), 
            g = 1 * getComputedStyle(this.scroller, null).top.replace(/[^0-9-]/g, "")), c != this.x || g != this.y) && (this.options.useTransition ? this._unbind("webkitTransitionEnd") : m(this.aniTime), 
            this.steps = [], this._pos(c, g)), this.absStartX = this.x, this.absStartY = this.y, 
            this.startX = this.x, this.startY = this.y, this.pointX = d.pageX, this.pointY = d.pageY, 
            this.startTime = f.timeStamp || Date.now(), this.options.onScrollStart && this.options.onScrollStart.call(this, f), 
            this._bind(l), this._bind(q), this._bind(v));
        },
        _move: function(f) {
            var d = p ? f.touches[0] : f, g = d.pageX - this.pointX, l = d.pageY - this.pointY, c = this.x + g, b = this.y + l, q = f.timeStamp || Date.now();
            this.options.onBeforeScrollMove && this.options.onBeforeScrollMove.call(this, f);
            if (this.options.zoom && p && 1 < f.touches.length) c = a.abs(f.touches[0].pageX - f.touches[1].pageX), 
            b = a.abs(f.touches[0].pageY - f.touches[1].pageY), this.touchesDist = a.sqrt(c * c + b * b), 
            this.zoomed = !0, d = 1 / this.touchesDistStart * this.touchesDist * this.scale, 
            d < this.options.zoomMin ? d = .5 * this.options.zoomMin * Math.pow(2, d / this.options.zoomMin) : d > this.options.zoomMax && (d = 2 * this.options.zoomMax * Math.pow(.5, this.options.zoomMax / d)), 
            this.lastScale = d / this.scale, c = this.originX - this.originX * this.lastScale + this.x, 
            b = this.originY - this.originY * this.lastScale + this.y, this.scroller.style[h + "Transform"] = w + c + "px," + b + "px" + x + " scale(" + d + ")", 
            this.options.onZoom && this.options.onZoom.call(this, f); else {
                this.pointX = d.pageX;
                this.pointY = d.pageY;
                if (0 < c || c < this.maxScrollX) c = this.options.bounce ? this.x + g / 2 : 0 <= c || 0 <= this.maxScrollX ? 0 : this.maxScrollX;
                if (b > this.minScrollY || b < this.maxScrollY) b = this.options.bounce ? this.y + l / 2 : b >= this.minScrollY || 0 <= this.maxScrollY ? this.minScrollY : this.maxScrollY;
                6 > this.absDistX && 6 > this.absDistY ? (this.distX += g, this.distY += l, this.absDistX = a.abs(this.distX), 
                this.absDistY = a.abs(this.distY)) : (this.options.lockDirection && (this.absDistX > this.absDistY + 5 ? (b = this.y, 
                l = 0) : this.absDistY > this.absDistX + 5 && (c = this.x, g = 0)), this.moved = !0, 
                this._pos(c, b), this.dirX = 0 < g ? -1 : 0 > g ? 1 : 0, this.dirY = 0 < l ? -1 : 0 > l ? 1 : 0, 
                300 < q - this.startTime && (this.startTime = q, this.startX = this.x, this.startY = this.y), 
                this.options.onScrollMove && this.options.onScrollMove.call(this, f), $.DM.onIscrollScrolls(f));
            }
        },
        _end: function(f) {
            if (!p || 0 == f.touches.length) {
                var d = this, g = p ? f.changedTouches[0] : f, c, b, n = {
                    dist: 0,
                    time: 0
                }, e = {
                    dist: 0,
                    time: 0
                }, t = (f.timeStamp || Date.now()) - d.startTime, k = d.x, m = d.y;
                d._unbind(l);
                d._unbind(q);
                d._unbind(v);
                d.options.onBeforeScrollEnd && d.options.onBeforeScrollEnd.call(d, f);
                if (d.zoomed) k = d.scale * d.lastScale, k = Math.max(d.options.zoomMin, k), k = Math.min(d.options.zoomMax, k), 
                d.lastScale = k / d.scale, d.scale = k, d.x = d.originX - d.originX * d.lastScale + d.x, 
                d.y = d.originY - d.originY * d.lastScale + d.y, d.scroller.style[h + "TransitionDuration"] = "200ms", 
                d.scroller.style[h + "Transform"] = w + d.x + "px," + d.y + "px" + x + " scale(" + d.scale + ")", 
                d.zoomed = !1, d.refresh(), d.options.onZoomEnd && d.options.onZoomEnd.call(d, f); else {
                    if (d.moved) {
                        if (300 > t && d.options.momentum) {
                            n = k ? d._momentum(k - d.startX, t, -d.x, d.scrollerW - d.wrapperW + d.x, d.options.bounce ? d.wrapperW : 0) : n;
                            e = m ? d._momentum(m - d.startY, t, -d.y, 0 > d.maxScrollY ? d.scrollerH - d.wrapperH + d.y - d.minScrollY : 0, d.options.bounce ? d.wrapperH : 0) : e;
                            k = d.x + n.dist;
                            m = d.y + e.dist;
                            if (0 < d.x && 0 < k || d.x < d.maxScrollX && k < d.maxScrollX) n = {
                                dist: 0,
                                time: 0
                            };
                            if (d.y > d.minScrollY && m > d.minScrollY || d.y < d.maxScrollY && m < d.maxScrollY) e = {
                                dist: 0,
                                time: 0
                            };
                        }
                        n.dist || e.dist ? (n = a.max(a.max(n.time, e.time), 10), d.options.snap && (e = k - d.absStartX, 
                        t = m - d.absStartY, a.abs(e) < d.options.snapThreshold && a.abs(t) < d.options.snapThreshold ? d.scrollTo(d.absStartX, d.absStartY, 200) : (e = d._snap(k, m), 
                        k = e.x, m = e.y, n = a.max(e.time, n))), d.scrollTo(a.round(k), a.round(m), n)) : d.options.snap ? (e = k - d.absStartX, 
                        t = m - d.absStartY, a.abs(e) < d.options.snapThreshold && a.abs(t) < d.options.snapThreshold ? d.scrollTo(d.absStartX, d.absStartY, 200) : (e = d._snap(d.x, d.y), 
                        e.x == d.x && e.y == d.y || d.scrollTo(e.x, e.y, e.time))) : d._resetPos(200);
                    } else p && (d.doubleTapTimer && d.options.zoom ? (clearTimeout(d.doubleTapTimer), 
                    d.doubleTapTimer = null, d.options.onZoomStart && d.options.onZoomStart.call(d, f), 
                    d.zoom(d.pointX, d.pointY, 1 == d.scale ? d.options.doubleTapZoom : 1), d.options.onZoomEnd && setTimeout(function() {
                        d.options.onZoomEnd.call(d, f);
                    }, 200)) : d.doubleTapTimer = setTimeout(function() {
                        d.doubleTapTimer = null;
                        for (c = g.target; 1 != c.nodeType; ) c = c.parentNode;
                        "SELECT" != c.tagName && "INPUT" != c.tagName && "TEXTAREA" != c.tagName && (b = document.createEvent("MouseEvents"), 
                        b.initMouseEvent("click", !0, !0, f.view, 1, g.screenX, g.screenY, g.clientX, g.clientY, f.ctrlKey, f.altKey, f.shiftKey, f.metaKey, 0, null), 
                        b._fake = !0, c.dispatchEvent(b));
                    }, d.options.zoom ? 250 : 0)), d._resetPos(200);
                    d.options.onTouchEnd && d.options.onTouchEnd.call(d, f);
                }
            }
        },
        _resetPos: function(a) {
            var d = 0 <= this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x, g = this.y >= this.minScrollY || 0 < this.maxScrollY ? this.minScrollY : this.y < this.maxScrollY ? this.maxScrollY : this.y;
            d == this.x && g == this.y ? (this.moved && (this.moved = !1, this.options.onScrollEnd && this.options.onScrollEnd.call(this)), 
            this.hScrollbar && this.options.hideScrollbar && ("webkit" == h && (this.hScrollbarWrapper.style[h + "TransitionDelay"] = "300ms"), 
            this.hScrollbarWrapper.style.opacity = "0"), this.vScrollbar && this.options.hideScrollbar && ("webkit" == h && (this.vScrollbarWrapper.style[h + "TransitionDelay"] = "300ms"), 
            this.vScrollbarWrapper.style.opacity = "0")) : this.scrollTo(d, g, a || 0);
        },
        _wheel: function(a) {
            if ($.DM.isUseLayout() && "none" == this.options.wheelAction || 0 < this.maxScrollY || parseInt(a.currentTarget.style.height) < this.wrapperH) return !1;
            var d = this, g, c;
            "wheelDeltaX" in a ? (g = a.wheelDeltaX / 12, c = a.wheelDeltaY / 2) : "wheelDelta" in a ? g = c = a.wheelDelta : "detail" in a && (2 === a.axis ? (c = 10 * -a.detail, 
            g = 0) : (g = 3 * -a.detail, c = 0));
            "zoom" == d.options.wheelAction ? (c = d.scale * Math.pow(2, 1 / 3 * (c ? c / Math.abs(c) : 0)), 
            c < d.options.zoomMin && (c = d.options.zoomMin), c > d.options.zoomMax && (c = d.options.zoomMax), 
            c != d.scale && (!d.wheelZoomCount && d.options.onZoomStart && d.options.onZoomStart.call(d, a), 
            d.wheelZoomCount++, d.zoom(a.pageX, a.pageY, c, 400), setTimeout(function() {
                d.wheelZoomCount--;
                !d.wheelZoomCount && d.options.onZoomEnd && d.options.onZoomEnd.call(d, a);
            }, 400))) : (window.editorParent.$ && window.editorParent.$.deselectAllEditableElements && null != window.editorParent.NEFW && null != window.editorParent.$.dmfw.setPreviewEditPolicy && 0 == window.editorParent.$.dmfw.getPreviewElement(".dmLocked").length && window.editorParent.$.deselectAllEditableElements(), 
            $.DM.onIscrollScrolls(a), g = d.x + g, c = d.y + c, 0 < g ? g = 0 : g < d.maxScrollX && (g = d.maxScrollX), 
            c > d.minScrollY ? c = d.minScrollY : c < d.maxScrollY && (c = d.maxScrollY), d.scrollTo(g, c, 0), 
            a.stopPropagation(), a.preventDefault());
        },
        _mouseout: function(a) {
            var d = a.relatedTarget;
            if (d) for (;d = d.parentNode; ) if (d == this.wrapper) return;
            this._end(a);
        },
        _transitionEnd: function(a) {
            a.target == this.scroller && (this._unbind("webkitTransitionEnd"), this._startAni());
        },
        _startAni: function() {
            var f = this, d = f.x, c = f.y, l = Date.now(), b, e;
            f.animating || (f.steps.length ? (b = f.steps.shift(), b.x == d && b.y == c && (b.time = 0), 
            f.animating = !0, f.moved = !0, f.options.useTransition ? (f._transitionTime(b.time), 
            f._pos(b.x, b.y), f.animating = !1, b.time ? f._bind("webkitTransitionEnd") : f._resetPos(0)) : function A() {
                var q = Date.now(), t;
                q >= l + b.time ? (f._pos(b.x, b.y), f.animating = !1, f.options.onAnimationEnd && f.options.onAnimationEnd.call(f), 
                f._startAni()) : (q = (q - l) / b.time - 1, e = a.sqrt(1 - q * q), q = (b.x - d) * e + d, 
                t = (b.y - c) * e + c, f._pos(q, t), f.animating && (f.aniTime = n(A)));
            }()) : f._resetPos(400));
        },
        _transitionTime: function(a) {
            a += "ms";
            this.scroller.style[h + "TransitionDuration"] = a;
            this.hScrollbar && (this.hScrollbarIndicator.style[h + "TransitionDuration"] = a);
            this.vScrollbar && (this.vScrollbarIndicator.style[h + "TransitionDuration"] = a);
        },
        _momentum: function(f, d, c, l, b) {
            d = a.abs(f) / d;
            var e = d * d / .0012;
            0 < f && e > c ? (c += b / (6 / (e / d * 6e-4)), d = d * c / e, e = c) : 0 > f && e > l && (l += b / (6 / (e / d * 6e-4)), 
            d = d * l / e, e = l);
            return {
                dist: e * (0 > f ? -1 : 1),
                time: a.round(d / 6e-4)
            };
        },
        _offset: function(a) {
            for (var d = -a.offsetLeft, c = -a.offsetTop; a = a.offsetParent; ) d -= a.offsetLeft, 
            c -= a.offsetTop;
            a != this.wrapper && (d *= this.scale, c *= this.scale);
            return {
                left: d,
                top: c
            };
        },
        _snap: function(c, d) {
            var l, b, e;
            e = this.pagesX.length - 1;
            l = 0;
            for (b = this.pagesX.length; l < b; l++) if (c >= this.pagesX[l]) {
                e = l;
                break;
            }
            e == this.currPageX && 0 < e && 0 > this.dirX && e--;
            c = this.pagesX[e];
            b = (b = a.abs(c - this.pagesX[this.currPageX])) ? a.abs(this.x - c) / b * 500 : 0;
            this.currPageX = e;
            e = this.pagesY.length - 1;
            for (l = 0; l < e; l++) if (d >= this.pagesY[l]) {
                e = l;
                break;
            }
            e == this.currPageY && 0 < e && 0 > this.dirY && e--;
            d = this.pagesY[e];
            l = (l = a.abs(d - this.pagesY[this.currPageY])) ? a.abs(this.y - d) / l * 500 : 0;
            this.currPageY = e;
            e = a.round(a.max(b, l)) || 200;
            return {
                x: c,
                y: d,
                time: e
            };
        },
        _bind: function(a, d, c) {
            (d || this.scroller).addEventListener(a, this, !!c);
        },
        _unbind: function(a, d, c) {
            (d || this.scroller).removeEventListener(a, this, !!c);
        },
        destroy: function() {
            this.scroller.style[h + "Transform"] = "";
            this.vScrollbar = this.hScrollbar = !1;
            this._scrollbar("h");
            this._scrollbar("v");
            this._unbind(k, window);
            this._unbind(y);
            this._unbind(l);
            this._unbind(q);
            this._unbind(v);
            this.options.hasTouch && (this._unbind("mouseout", this.wrapper), this._unbind(z));
            this.options.useTransition && this._unbind("webkitTransitionEnd");
            this.options.checkDOMChanges && clearInterval(this.checkDOMTime);
            this.options.onDestroy && this.options.onDestroy.call(this);
        },
        refresh: function() {
            var c, d, l, b = 0;
            d = 0;
            this.scale < this.options.zoomMin && (this.scale = this.options.zoomMin);
            this.wrapperW = this.wrapper.clientWidth || 1;
            this.wrapperH = this.wrapper.clientHeight || 1;
            this.minScrollY = -this.options.topOffset || 0;
            this.scrollerW = a.round(this.scroller.offsetWidth * this.scale);
            this.scrollerH = a.round((this.scroller.offsetHeight + this.minScrollY) * this.scale);
            this.maxScrollX = this.wrapperW - this.scrollerW;
            this.maxScrollY = this.wrapperH - this.scrollerH + this.minScrollY;
            this.dirY = this.dirX = 0;
            this.options.onRefresh && this.options.onRefresh.call(this);
            this.hScroll = this.options.hScroll && 0 > this.maxScrollX;
            this.vScroll = this.options.vScroll && (!this.options.bounceLock && !this.hScroll || this.scrollerH > this.wrapperH);
            this.hScrollbar = this.hScroll && this.options.hScrollbar;
            this.vScrollbar = this.vScroll && this.options.vScrollbar && this.scrollerH > this.wrapperH;
            c = this._offset(this.wrapper);
            this.wrapperOffsetLeft = -c.left;
            this.wrapperOffsetTop = -c.top;
            if ("string" == typeof this.options.snap) for (this.pagesX = [], this.pagesY = [], 
            l = this.scroller.querySelectorAll(this.options.snap), c = 0, d = l.length; c < d; c++) b = this._offset(l[c]), 
            b.left += this.wrapperOffsetLeft, b.top += this.wrapperOffsetTop, this.pagesX[c] = b.left < this.maxScrollX ? this.maxScrollX : b.left * this.scale, 
            this.pagesY[c] = b.top < this.maxScrollY ? this.maxScrollY : b.top * this.scale; else if (this.options.snap) {
                for (this.pagesX = []; b >= this.maxScrollX; ) this.pagesX[d] = b, b -= this.wrapperW, 
                d++;
                this.maxScrollX % this.wrapperW && (this.pagesX[this.pagesX.length] = this.maxScrollX - this.pagesX[this.pagesX.length - 1] + this.pagesX[this.pagesX.length - 1]);
                d = b = 0;
                for (this.pagesY = []; b >= this.maxScrollY; ) this.pagesY[d] = b, b -= this.wrapperH, 
                d++;
                this.maxScrollY % this.wrapperH && (this.pagesY[this.pagesY.length] = this.maxScrollY - this.pagesY[this.pagesY.length - 1] + this.pagesY[this.pagesY.length - 1]);
            }
            this._scrollbar("h");
            this._scrollbar("v");
            this.zoomed || (this.scroller.style[h + "TransitionDuration"] = "0", this._resetPos(200));
        },
        scrollTo: function(a, d, c, l) {
            var b = a;
            this.stop();
            b.length || (b = [ {
                x: a,
                y: d,
                time: c,
                relative: l
            } ]);
            a = 0;
            for (d = b.length; a < d; a++) b[a].relative && (b[a].x = this.x - b[a].x, b[a].y = this.y - b[a].y), 
            this.steps.push({
                x: b[a].x,
                y: b[a].y,
                time: b[a].time || 0
            });
            this._startAni();
        },
        getScrollY: function() {
            return this.y;
        },
        getScrollX: function() {
            return this.x;
        },
        scrollToElement: function(c, d) {
            var b;
            if (c = c.nodeType ? c : this.scroller.querySelector(c)) b = this._offset(c), b.left += this.wrapperOffsetLeft, 
            b.top += this.wrapperOffsetTop, b.left = 0 < b.left ? 0 : b.left < this.maxScrollX ? this.maxScrollX : b.left, 
            b.top = b.top > this.minScrollY ? this.minScrollY : b.top < this.maxScrollY ? this.maxScrollY : b.top, 
            d = void 0 === d ? a.max(2 * a.abs(b.left), 2 * a.abs(b.top)) : d, this.scrollTo(b.left, b.top + 36, d);
        },
        scrollToPage: function(a, d, c) {
            this.options.onScrollStart && this.options.onScrollStart.call(this);
            this.options.snap ? (a = "next" == a ? this.currPageX + 1 : "prev" == a ? this.currPageX - 1 : a, 
            d = "next" == d ? this.currPageY + 1 : "prev" == d ? this.currPageY - 1 : d, a = 0 > a ? 0 : a > this.pagesX.length - 1 ? this.pagesX.length - 1 : a, 
            d = 0 > d ? 0 : d > this.pagesY.length - 1 ? this.pagesY.length - 1 : d, this.currPageX = a, 
            this.currPageY = d, a = this.pagesX[a], d = this.pagesY[d]) : (a *= -this.wrapperW, 
            d *= -this.wrapperH, a < this.maxScrollX && (a = this.maxScrollX), d < this.maxScrollY && (d = this.maxScrollY));
            this.scrollTo(a, d, c || 400);
        },
        disable: function() {
            this.stop();
            this._resetPos(0);
            this.enabled = !1;
            this._unbind(l);
            this._unbind(q);
            this._unbind(v);
        },
        enable: function() {
            this.enabled = !0;
        },
        stop: function() {
            this.options.useTransition ? this._unbind("webkitTransitionEnd") : m(this.aniTime);
            this.steps = [];
            this.animating = this.moved = !1;
        },
        zoom: function(a, d, c, b) {
            var l = c / this.scale;
            this.options.useTransform && (this.zoomed = !0, b = void 0 === b ? 200 : b, a = a - this.wrapperOffsetLeft - this.x, 
            d = d - this.wrapperOffsetTop - this.y, this.x = a - a * l + this.x, this.y = d - d * l + this.y, 
            this.scale = c, this.refresh(), this.x = 0 < this.x ? 0 : this.x < this.maxScrollX ? this.maxScrollX : this.x, 
            this.y = this.y > this.minScrollY ? this.minScrollY : this.y < this.maxScrollY ? this.maxScrollY : this.y, 
            this.scroller.style[h + "TransitionDuration"] = b + "ms", this.scroller.style[h + "Transform"] = w + this.x + "px," + this.y + "px" + x + " scale(" + c + ")", 
            this.zoomed = !1);
        },
        isReady: function() {
            return !this.moved && !this.zoomed && !this.animating;
        }
    };
    "undefined" !== typeof exports ? exports.iScroll = b : window.iScroll = b;
})();

(function(a) {
    function h(c) {
        return (c = a(c).attr("href")) ? 0 === c.indexOf("http://") : !1;
    }
    function u() {
        a.extend(a.layoutDevice.components, a.commonComponents);
        for (var c in a.layoutDevice.components) {
            var b = a.layoutDevice.components[c].selector;
            b || (b = "#", a.layoutDevice.components[c].getByClass && (b = "."), b += c);
            0 == a(b).length ? a.layoutDevice.components[c] = null : a.layoutDevice.components[c].element = a(b);
        }
    }
    function p(a) {
        return 0 == a ? function(a) {
            return !a.hasClass("dmSub");
        } : function(b) {
            return b.hasClass("dmSub" + (2 == a ? "2" : ""));
        };
    }
    function r() {
        var c, b;
        a.ua ? (c = "Android" === a.ua.os.name && 2.4 > a.ua.os.version, b = "Windows Phone OS" === a.ua.os.name && 7.5 >= a.ua.os.version) : (c = -1 != navigator.userAgent.indexOf("Android 2"), 
        b = -1 != navigator.userAgent.indexOf("Windows Phone OS 7"));
        return !c && !b;
    }
    var e = {
        _is_touch_device: a.DM.testTouch(),
        _layoutDomReady: !1,
        _isEditorMode: !1,
        _isEDMode: !1,
        _variationClassPrefix: "-var",
        _widgetClassPrefix: "widgetStyle-",
        _NEW_PAGES_PREFIX: "dmwlp://",
        _NEW_PAGE_LOC: "http://bfs._dudamobile.com",
        _layoutParams: {
            _navigationAnimationStyle: "slide"
        }
    };
    a.extend(e._layoutParams, Parameters.LayoutParams);
    a.extend({
        layoutManager: e
    });
    a(document).ready(function(c) {
        a.layoutManager._isEditorMode = a.DM.getQueryParam(window.location.href, "nee") ? !0 : !1;
        a.layoutManager._isEDMode = a.DM.getQueryParam(window.location.href, "ed") ? !0 : !1;
        a.layoutManager._isEditorMode && "DESKTOP" === a.layoutDevice.type.toUpperCase() && a.layoutDevice.addParallaxBehavior();
        0 < a("#dm").find("[data-background-parallax-selector]").length && !a.browser.msie && "DESKTOP" == a.layoutDevice.type.toUpperCase() || a.layoutManager._isEditorMode && "undefined" != typeof window.parent.window.DF && window.parent.window.DF.parallaxPromise.resolve();
        u();
        -1 == navigator.userAgent.indexOf("Mac OS X") && a("body").addClass("pcCustomScrollbar");
        c = a("body");
        a.layoutManager._isEditorMode && (c.addClass("bodyInsideNee"), c.toggleClass("bodyInsidePT", "PT" === getSafe("editorParent.dm_current_editor")), 
        isDudaone && c.addClass("bodyInsideD1"));
        isDudaone ? c.addClass("d1SiteBody") : c.addClass("dmSiteBody");
        20 > Parameters.ThemeVersion && isDudaone && c.addClass("bodyInsideDudaone");
        isDudaone && a.layoutManager._isEditorMode && !a.layoutManager._isEDMode || a.layoutManager.initLayout();
        a.layoutManager.initNavigation();
        "MOBILE" !== a.layoutDevice.type.toUpperCase() || a.layoutManager._isEditorMode || 8 !== e.getCurrentLayout() || document.addEventListener("focusout", function(a) {
            document.body.scrollTop = 0;
            document.scrollingElement && (document.scrollingElement.scrollTop = 0);
        });
        a.layoutDevice.components.iscrollBody && a.layoutDevice.components.iscrollBody.isUseIscroll && !a.layoutManager._isEditorMode ? (a("body").addClass("dmBodyUseIscroll"), 
        a("body").removeClass("dmBodyNoIscroll")) : (a("body").addClass("dmBodyNoIscroll"), 
        a("body").removeClass("dmBodyUseIscroll"));
        r() || a(".supportsFontIcons").removeClass("supportsFontIcons").addClass("noFontIcons");
        "runtime" in window && runtime.initLayout({
            instanceSettings: {
                containerId: "dm-outer-wrapper"
            }
        }).then(function() {
            a.layoutManager._layoutDomReady = !0;
        }).catch(function(a) {
            console.error(a);
        });
    });
    a(window).load(function() {
        e.updateContainerMinimumHeight();
    });
    a(window).resize(function() {
        e.refreshIscroll();
    });
    e.detectUserAgent = function() {
        var a = navigator.userAgent;
        return a.match(/(iPhone|iPod)/) && a.match(/CriOS/) ? "iPhone-chrome" : a.match(/(iPhone|iPod|iPad)/) ? "iPhone" : a.match(/Android/) ? "android" : a.match(/BlackBerry/) ? "blackberry" : a.match(/Windows Phone/i) || a.match(/iEMobile/i) ? "windowsmobile" : "";
    };
    e.initLayout = function() {
        a.layoutDevice.onReady(a.layoutManager._isEditorMode);
        a.layoutDevice.onLoad(a.layoutManager._isEditorMode);
    };
    e.refreshIscroll = function(c) {
        null == c && a.layoutDevice && (c = a.layoutDevice.components.iscrollBody);
        c && c.iscrollObject && c.iscrollObject.refresh();
    };
    e.reinitIscroll = function(c) {
        null == c && (c = a.layoutDevice.components.iscrollBody);
        c && c.iscrollObject && c.refresh();
    };
    e.getLayoutElement = function() {
        return a.layoutDevice.components;
    };
    e.isNee = function() {
        return a.layoutManager._isEditorMode;
    };
    e.setCurrentVariation = function(c, b, e) {
        e = e || "mobile";
        for (var n = a(".dm_wrapper").attr("class").split(" "), m = "", k = "", h = 0; h < n.length; h++) {
            var l = n[h];
            -1 != l.indexOf(a.layoutManager._variationClassPrefix) && (m = l, k = l.substr(0, l.indexOf(a.layoutManager._variationClassPrefix)) + a.layoutManager._variationClassPrefix + c);
            b && -1 != l.indexOf(a.layoutManager._widgetClassPrefix) && a(".dm_wrapper").removeClass(l);
        }
        a(".dm_wrapper").removeClass(m);
        a(".dm_wrapper").addClass(k);
        a(".dm_wrapper").addClass(b ? b[k] : "");
        Parameters.LayoutVariationID[e] = c;
        a.DM.restoreDefaultNavigationStyles();
        a.DM.initNavbar(!0);
        a.layoutDevice.components.dmNav.cssCalculations();
    };
    e.getCurrentVariation = function(a) {
        return Parameters.LayoutVariationID[a || "mobile"];
    };
    e.setCurrentLayout = function(a, b) {
        Parameters.LayoutID[b || "mobile"] = a;
    };
    e.getCurrentLayout = function(a) {
        return Parameters.LayoutID[a || "mobile"];
    };
    e.setCurrentWidgetStyleID = function(a) {
        Parameters.WidgetStyleID = a;
    };
    e.getCurrentWidgetStyleID = function() {
        return Parameters.WidgetStyleID;
    };
    e.cssCalculations = function() {
        a.layoutDevice.components.dmNav.cssCalculations();
    };
    e.afterDropPositionFoundHook = function() {};
    e.isLayoutDomReady = function() {
        return a.layoutManager._layoutDomReady;
    };
    e.afterInitNav = function() {
        a.layoutDevice.components.dmNav && a.layoutDevice.components.dmNav.cssCalculations();
    };
    e.isMobileBrowser = function() {
        var a = navigator.userAgent || navigator.vendor || window.opera, b = !1;
        if (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) b = !0;
        return b;
    };
    e.isWebkitMobileBrowser = function() {
        var c = {}, b = a.uaMatch(navigator.userAgent);
        c[b.browser] = !0;
        c.version = b.version;
        b = !1;
        if (c.chrome || c.webkit || c.safari) b = !0;
        "blackberry" == e.detectUserAgent() && (b = !1);
        return b;
    };
    e.isSafariMobileBrowser = function() {
        return -1 < navigator.userAgent.toLowerCase().indexOf("version/");
    };
    e._is_touch_device = e._is_touch_device && "blackberry" != e.detectUserAgent();
    e.hideAllSubItems = function() {
        a.layoutDevice.components.slideDownNav ? a.layoutDevice.components.slideDownNav.refresh() : a.layoutDevice.components.slideUpNav ? a.layoutDevice.components.slideUpNav.refresh() : a.layoutDevice.components.slideRightNav && a.layoutDevice.components.slideRightNav.refresh();
    };
    e.openAppropriateSub = function() {
        var c = window.location.hash.slice(1), b = a.DM.getPageUrlByPageId(c), e, n;
        a(".dmNavigation li:not(.listBtnHidden) a").each(function() {
            var m = a(this), k = unescape(a.DM.getQueryParam(m.attr("href"), "url") || m.attr("href"));
            e = document.createElement("a");
            e.href = k;
            n = "#" == k ? "#" : e.pathname;
            if (null != k && null != b && (k === b && ("/" !== n || e.search) || a.dmrt.isEditorMode && "MOBILE" === Parameters.SiteType && k === Parameters.CurrentPageUrl || n === b || ("http://dmbfs" === b || b === Parameters.CurrentPageUrl) && n === window.location.pathname && (a.dmrt.isEditorMode || "/" !== n || "/" === n && Parameters.IsCurrentHomePage)) && (!a.dmrt.isEditorMode || !k.match(/(http(s?)\:\/\/){1}[^\/]+(\/?)$/g)) || a.dmrt.isEditorMode && "" != c && a(this).attr("raw_url") && a.DM.getPageFromCache(c).pageContent.alias == a(this).attr("raw_url").split("/").pop() || (null == b || "null" == b || b.startsWith(a.layoutManager._NEW_PAGES_PREFIX) || b == a.layoutManager._NEW_PAGE_LOC) && a(this).is(".dmNavItemSelected>a")) {
                var h = m.parent();
                if (h.hasClass("hasdmSub")) a.layoutManager.showSpecificSubs(a(this).parent()); else if (h.hasClass("dmSub")) {
                    for (k = p(h.hasClass("dmSub2") ? 1 : 0); !h.hasClass("hasdmSub") || !k(h); ) h = h.prev();
                    a.layoutManager.showSpecificSubs(h);
                }
                m.parents(".dmNavigation").find("a").removeClass("currentPage");
                m.addClass("currentPage");
                return !1;
            }
        });
        a.layoutDevice.components.dmNav && a.layoutDevice.components.dmNav.cssCalculations();
    };
    e.getCurrentNavigationItemSelected = function(c, b) {
        c || (c = a(".dmNavWrapper, .dmNavigation, .dmNavigationWithLink"), b = !0);
        var e = null, n = a.DM.getCurrentPageUrl(), h = n.replace("&preview=true", "").replace("&dm_try_mode=true", ""), k = location.hash, p = k ? k.substring(1) : null;
        c.find("a").each(function() {
            var c = a(this).data("target-page-alias") || a(this).attr("href");
            c && -1 != c.indexOf("?url=") && (c = unescape(a.DM.getQueryParam(a(this).attr("href"), "url")));
            c && "DUDAONE" == Parameters.SiteType && (-1 < c.indexOf("?") && (c = c.substr(0, c.indexOf("?"))), 
            0 == c.indexOf("/site/") ? c = c.split(c.split("/")[2] + "/")[1] : 0 == c.indexOf("/") && (c = c.substr(1, c.length)), 
            -1 < c.indexOf("#") && !(-1 < c.indexOf("#!")) && (c = c.split("#")[0]), "" === c && (c = "home"));
            if (null != c && null != n && (c === n || c === h)) {
                if ("DUDAONE" == Parameters.SiteType) {
                    var q = c = null, v = a(this).attr("href").split("#");
                    1 < v.length && !v[1].startsWith("!") && (c = "#" + v[1], q = v[1]);
                    if ((c || k) && c != k) try {
                        if (a("#" + p + "[data-anchor]").length || a("#" + q + "[data-anchor]").length) return;
                    } catch (z) {}
                }
                null == e ? e = a(this) : b && (e = e.add(a(this)));
            }
        });
        return e;
    };
    e.markCurrentSelectedNavigation = function(c) {
        if (!(!isDudaone && a.layoutManager.markedSelected || window.exportsite)) {
            var b = a(".dmNavWrapper, .dmNavigation, .dmNavigationWithLink, .unifiednav__container");
            b.find("li").removeClass("dmNavItemSelected").end().find("a").removeClass("currentPage");
            b.each(function() {
                var b = a(this), e;
                c && b.data("cachedElement") ? e = b.data("cachedElement") : (e = a.layoutManager.getCurrentNavigationItemSelected(b)) && e.length && (e = e.eq(0));
                if (!b.find(".dmNavItemSelected").hasClass("dmNavKeepSelected")) {
                    var h = b.find(".navItemSelectedServer");
                    0 < h.size() ? (b.find("li").removeClass("dmNavItemSelected"), b.find("a").removeClass("currentPage"), 
                    h.removeClass("navItemSelectedServer"), h.addClass("dmNavItemSelected"), h.find(" > a").addClass("currentPage"), 
                    b.data("cachedElement", h.find(" > a"))) : (h = b.find("a.currentPage").eq(0), !e || h.html() == e.html() && 2 != e.closest("ul").find(".dmNavItemSelected").length ? (b.find("li").removeClass("dmNavItemSelected"), 
                    b.find("a").removeClass("currentPage dmNavItemSelected"), e = window.location.pathname, 
                    e = b.find('a[raw_url="' + decodeURI(e) + '"], a[href="' + decodeURI(e) + '"]'), 
                    b && b.hasClass("unifiednav__container") ? (e.addClass("dmNavItemSelected"), e.parents(".unifiednav__item-wrap").each(function(c) {
                        a(this).children("a").addClass("dmNavItemSelected");
                    })) : (e.addClass("currentPage"), e.closest("li").addClass("dmNavItemSelected"))) : (b.find("li").removeClass("dmNavItemSelected"), 
                    b.find("a").removeClass("currentPage dmNavItemSelected"), e.addClass("currentPage"), 
                    b.hasClass("unifiednav__container") ? (e.addClass("dmNavItemSelected"), e.parents(".unifiednav__item-wrap").each(function(c) {
                        a(this).children("a").addClass("dmNavItemSelected");
                    })) : e.closest("li").addClass("dmNavItemSelected"), b.data("cachedElement", e)));
                    a.layoutManager.finalizeMenu();
                }
                b.find(".dmNavKeepSelected").removeClass("dmNavKeepSelected");
            });
            a.layoutManager.markedSelected = !0;
        }
    };
    e.finalizeMenu = function() {
        0 < a(".dmNavigation .dmNavItemSelected").not(".dmHideFromNav").length && a(".dmNavigationWithLink .slideDownTrigger, .dmNavigationWithLink .slideUpTrigger").addClass("dmNavItemSelected");
        0 < a(".desktopTopNavMoreBtn .dmNavItemSelected").length && a("#upperFloatingNav .desktopTopNavMoreBtn").addClass("dmNavItemSelected");
        0 < a("#upperFloatingNav .dmNavItemSelected.dmSub, .dmLinksMenu .dmNavItemSelected.dmSub").length && a("#upperFloatingNav .dmNavItemSelected.dmSub, .dmLinksMenu .dmNavItemSelected.dmSub").parents("li").last().addClass("dmNavItemSelected");
        0 < a(".dmUDNavigationItem_dmMore").length && a(".dmNavItemSelected").closest(".dmUDNavigationItem_dmMore").each(function() {
            this.classList.contains("unifiednav__item-wrap") ? this.querySelector(".unifiednav__item").classList.add("dmNavItemSelected") : this.classList.add("dmNavItemSelected");
        });
    };
    e.onAjaxLinkClick = function(c) {
        var b = c.attr("href") && "#" !== c.attr("href");
        b && (a.layoutManager.closeAllOpenedNavs(void 0, !0), window.layoutApp && window.layoutApp.closeNavMenus());
        b && isDudaone || (a(".navItemSelectedServer, .dmNavItemSelected").removeClass("navItemSelectedServer dmNavItemSelected"), 
        c.is(".dmNavWrapper *") && (c.closest("li").addClass("dmNavItemSelected"), c.addClass("currentPage")));
        a.layoutDevice.handlePageSeoSettingsPerDevice && a.layoutDevice.handlePageSeoSettingsPerDevice();
    };
    e.layoutAfterAjax = function(c) {
        a.layoutManager.markCurrentSelectedNavigation();
    };
    e.initNavigation = function() {
        var c = !1, b = null, e = null, n = a.DM.isTouchDevice && !a.DM.isIOS() ? "touchend.menu" : "click.menu";
        a("#slideDownNav a, #slideUpNav a").off("touchstart.menu").on("touchstart.menu", function(a) {
            c = !1;
            b = a.originalEvent.targetTouches[0].pageX;
            e = a.originalEvent.targetTouches[0].pageY;
        }).off("touchmove.menu").on("touchmove.menu", function(a) {
            if (10 < Math.abs(a.originalEvent.targetTouches[0].pageY - e) || Math.abs(a.originalEvent.targetTouches[0].pageX - b)) c = !0;
        }).filter(function() {
            return !h(a(this));
        }).off(n).on(n, function(b) {
            if (window.editorParent && window.editorParent.$ && window.editorParent.$.dmx && window.editorParent.$.dmx.isTouchDevice) return !1;
            var e = a(this), n = e.is(Parameters.LinksToAjax), l = !1, q = e.attr("href");
            if (!c) return e.parent().hasClass("hasdmSub") ? (h(e), e.attr("href") && "" != e.attr("href") && "#" != e.attr("href")) ? h(e) || (a.layoutManager.isNee() && (a.DM.isAjaxLink(e) && window.editorParent.$ && window.editorParent.$.dmfw && window.editorParent.$.dmfw.showLoadingInEmulator(), 
            window.editorParent.$ && window.editorParent.$.dmfw && window.editorParent.$.dmfw.previewNavigateTo({
                url: e.attr("href"),
                navigateWithAjax: !0,
                el: e,
                e: b
            })), l = !0) : (b.preventDefault(), "0" == e.parent().next(".dmSub").css("opacity") ? a.layoutManager.showSpecificSubs(e.parent()) : "1" == e.parent().next(".dmSub").css("opacity") && a.layoutManager.hideSpacificSubs(e.parent())) : (a.layoutManager.isNee() && (b.preventDefault(), 
            window.editorParent.$ && window.editorParent.$.dmfw && (a.DM.isAjaxLink(e) && window.editorParent.$.dmfw.showLoadingInEmulator(), 
            h(this) || window.editorParent.$.dmfw.previewNavigateTo({
                url: e.attr("href"),
                navigateWithAjax: !0,
                el: e,
                e: b
            }))), Parameters.AllowAjax && (a(".navItemSelectedServer").removeClass("navItemSelectedServer"), 
            e.parent().addClass("dmNavItemSelected"), e.addClass("currentPage")), l = !0), (n = n && !(null != q && q.startsWith("#") && 1 < q.length) && a.DM.isPermittedOnClickValue(e.attr("onClick")) && !a.DM.isLinkException(q) && "_blank" !== e.attr("target")) && l ? a.DM.ajaxNavigateToLink(q, e, b) : l;
        });
        isDudaone && a.layoutManager.handleEmptyNavigation();
    };
    e.handleEmptyNavigation = function() {
        var c = a(".dmNavWrapper").eq(0), b = a("div.dmNavTriggerButton"), b = a().add(c).add(b);
        0 < c.length && (c = c.children().filter(function() {
            var c = a(this), b = !c.is(".dmHideFromNav, .dmDisplay_None, .dmNavTriggerButton, .slideDownTrigger");
            b && a.layoutDevice && a.layoutDevice.type && (b = b && !c.is(".dmHideFromNav-" + a.layoutDevice.type));
            return b;
        }), b.toggleClass("dmDisplay_None", 0 === c.length), c = 1 >= c.length, a("body").toggleClass("dm-single-page-nav", c), 
        c || a(".dm-single-page-nav").removeClass("dm-single-page-nav"));
    };
    e.showSpecificSubs = function(c) {
        a.layoutManager.hideAllSubItems();
        c.find(".navItemArrowBg").addClass("pointDown");
        var b = 0, e = c, h = c.index();
        if (c.is(".dmSub")) {
            for (var m = c; m.is(".dmSub"); ) m = m.prev();
            h = m.index();
            e = m;
        }
        a(".dmNavigation li:gt(" + Math.max(h - 1, 0) + ")").each(function() {
            a(this).is(e) || (0 == b && a(this).is(".dmSub") && !a(this).is(".dmSub2") ? (a(this).removeClass("dmDisplay_None").css({
                opacity: "0"
            }), a(this).css({
                "-webkit-transform": "translate3d(0px, 0px, 0px)",
                "-moz-transform": "translate(0px,0px)",
                "-ms-transform": "translate(0px, 0px)",
                "-o-transform": "translate(0px, 0px)",
                opacity: "1"
            }), a(this).index() == c.index() && (b = 1)) : 1 == b && a(this).is(".dmSub") ? (a(this).removeClass("dmDisplay_None").css("opacity", "0"), 
            a(this).css({
                "-webkit-transform": "translate3d(0px, 0px, 0px)",
                "-moz-transform": "translate(0px,0px)",
                "-ms-transform": "translate(0px, 0px)",
                "-o-transform": "translate(0px, 0px)",
                opacity: "1"
            }), a(this).is(".dmSub2") || (b = 0)) : a(this).is(".dmSub2") || (b = 2));
        });
        a.layoutDevice.components.slideDownNav ? (a.layoutDevice.components.slideDownNav.refresh(), 
        a.layoutDevice.components.slideDownNav.element.find("li").eq(-1).addClass("liRemoveBorder")) : a.layoutDevice.components.slideUpNav ? a.layoutDevice.components.slideUpNav.refresh() : a.layoutDevice.components.slideRightNav && a.layoutDevice.components.slideRightNav.refresh();
    };
    e.hideSpacificSubs = function(c) {
        c.find(".navItemArrowBg").removeClass("pointDown");
        c.index();
        var b = c.is(".dmSub") ? "dmSub2" : "dmSub";
        c.nextUntil(":not(." + b + ")").each(function() {
            1 == a(this).css("opacity") && (a(this).css({
                "-webkit-transform": "translate3d(0px,0px, 0px)",
                "-moz-transform": "translate(0px,0px)",
                "-ms-transform": "translate(0px,0px)",
                "-o-transform": "translate(0px,0px)"
            }), a(this).css("opacity", "0"), a(this).addClass("dmDisplay_None"));
        });
        a.layoutDevice.components.slideDownNav ? (a.layoutDevice.components.slideDownNav.refresh(), 
        a.layoutDevice.components.slideDownNav.element.find("li").filter(function() {
            return 1 == a(this).css("opacity");
        }).eq(-1).addClass("liRemoveBorder")) : a.layoutDevice.components.slideUpNav ? a.layoutDevice.components.slideUpNav.refresh() : a.layoutDevice.components.slideRightNav && a.layoutDevice.components.slideRightNav.refresh();
    };
    e.initHomeLinkAnchor = function() {
        a.layoutManager._is_touch_device ? a("#dm-logo-anchor").unbind("touchstart.t").bind("touchstart.t", function(c) {
            a.layoutManager.closeAllOpenedNavs();
        }) : a("#dm-logo-anchor").unbind("click.menu").bind("click.menu", function(c) {
            a.layoutManager.closeAllOpenedNavs();
        });
    };
    e.closeAllOpenedNavs = function(c, b) {
        function e() {
            a.layoutManager._closeAllOpenedNavs();
            c && c();
        }
        var h = a.layoutManager.isIOS() ? 300 : 0;
        b && 0 < h ? setTimeout(e, h) : e();
    };
    e._closeAllOpenedNavs = function() {
        window.editorParent && window.editorParent.$ && window.editorParent.$.dmx && window.editorParent.$.dmx.preventNavClose || (a.layoutDevice.components.slideDownNav && a.layoutDevice.components.slideDownNav.slideDownNavHandlerImpl(!1, !0), 
        a.layoutDevice.components.slideUpNav && a.layoutDevice.components.slideUpNav.slideUpNavHandlerImpl(!1, !0), 
        a.layoutDevice.components.slideRightNav && a.layoutDevice.components.slideRightNav.toggleMenu("close"), 
        a.layoutDevice.components.upperFloatingNav && a.layoutDevice.components.upperFloatingNav.hideSubnav(), 
        a.layoutDevice.components.popupNav && a.layoutDevice.components.popupNav.hidePopupNav());
    };
    e.initInnerPageTitle = function(c) {
        if (c && a.layoutDevice.components.innerBar) {
            var b = a.layoutDevice.components.innerBar.element.find(".innerPageTitle"), e = a.layoutDevice.components.innerBar.element.find("#dmBackBtn"), h = a.layoutDevice.components.innerBar.element.find("#pageTitleText");
            0 == b.length && (b = a("<div></div>"), 0 < h.length ? h.append(b) : 0 < e.length ? b.insertAfter(e) : a.layoutDevice.components.innerBar.element.append(b), 
            b.addClass("innerPageTitle"));
            b.text(c.page_title);
        }
        a.layoutDevice.initInnerPageTitle && a.layoutDevice.initInnerPageTitle(c);
    };
    e.setSelected = function(a, b) {
        a.toggleClass("dmNavItemSelected", b);
        return a;
    };
    e.isIOS7 = function() {
        return -1 != a.layoutManager.detectUserAgent().indexOf("iPhone") && navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i);
    };
    e.isPortrait = function() {
        return window.innerHeight > window.innerWidth ? !0 : !1;
    };
    e.updateContainerMinimumHeight = function() {
        var c = a(".dmRespRowsWrapper"), b = window.innerHeight, e = a(".dmFooterContainer");
        0 < e.length && (b -= e.outerHeight());
        var h = a("#mobileFooter");
        0 < h.length && (b -= h.outerHeight());
        h = a("#desktopHeaderBox");
        0 < h.length ? b -= h.outerHeight() : (h = a(".dmHeader"), 0 < h.length && (b -= h.outerHeight()));
        h = a("#popupNavHeaderBox");
        0 < h.length && (b -= h.outerHeight());
        Modernizr.cssvhunit || (c.css("min-height", b + "px"), a(".dmInner").css("minHeight", window.innerHeight + "px"));
        0 < e.length && setTimeout(function() {
            b += window.innerHeight - e[0].getBoundingClientRect().bottom;
            c.css("min-height", b + "px");
        }, 0);
        c.removeClass("dmRespRowsWrapperSize6", "dmRespRowsWrapperSize5", "dmRespRowsWrapperSize4", "dmRespRowsWrapperSize3", "dmRespRowsWrapperSize2", "dmRespRowsWrapperSize1");
        950 < b ? c.addClass("dmRespRowsWrapperSize6") : 890 < b ? c.addClass("dmRespRowsWrapperSize5") : 800 < b ? c.addClass("dmRespRowsWrapperSize4") : 700 < b ? c.addClass("dmRespRowsWrapperSize3") : 620 < b ? c.addClass("dmRespRowsWrapperSize2") : c.addClass("dmRespRowsWrapperSize1");
    };
    e.isIOS = function() {
        return /(iPhone|iPad|iPod)/.test(navigator.userAgent);
    };
    e.isAndroidDefaultBrowser = function() {
        return -1 < navigator.userAgent.indexOf("Mozilla/5.0") && -1 < nua.indexOf("Android ") && -1 < nua.indexOf("AppleWebKit") && !(-1 < nua.indexOf("Chrome"));
    };
})(jQuery);

var layoutDeviceComponentInterface = {
    onReadyGlobal: function(a) {},
    onReadyEditorMode: function(a) {},
    onReadyPreviewMode: function(a) {},
    onLoadGlobal: function(a) {},
    onLoadEditorMode: function(a) {},
    onLoadPreviewMode: function(a) {},
    afterAjaxCommand: function(a) {},
    onAjaxLinkClick: function(a, h) {},
    onAjaxLinkBeforeClick: function(a, h) {
        return !0;
    }
};

var layoutDeviceInterface = {
    type: "",
    components: {},
    onReady: function(a, h) {},
    onLoad: function(a, h) {},
    getTopFixedElementsOffset: function() {
        return 0;
    },
    getBottomFixedElementsOffset: function() {
        return 0;
    },
    initInnerBar: function() {},
    onAjaxLinkClick: function(a, h) {}
};

(function(a) {
    function h() {
        return a.layoutManager._isEditorMode && parent.window.$.dmfw && parent.window.$.dmfw.newInlineEditing;
    }
    function u() {
        this.element = null;
    }
    function p() {
        this.element = a("#upperFloatingNav");
    }
    function r() {
        this.element = a(".dmLinksMenu > ul");
    }
    function e() {
        this.slideTrigger = this.iscrollObject = this.element = null;
        this.slideDownNavHandlerImpl = function(b, c, e) {
            function h() {
                k.hide();
                m.element.css("visibility", "visible");
                k.off("webkitTransitionEnd").off("transitionend").off("oTransitionEnd").off("msTransitionEnd");
            }
            var k, m = this;
            k = a(document.getElementById("slideDownNav"));
            if ("undefined" == typeof b || null === b) b = !0;
            c || (c = !1);
            e || (e = !1);
            this.element.stop();
            this.element.unbind("webkitTransitionEnd").off("transitionend").off("oTransitionEnd").off("msTransitionEnd");
            this.element.css("display", "block");
            b ? a("#slideDownNav").css({
                "-webkit-transition-duration": ".5s",
                "-moz-transition-duration": ".5s",
                "-o-transition-duration": ".5s",
                "-ms-transition-duration": ".5s"
            }) : (a("#slideDownNav").css({
                "-webkit-transition-duration": "0s",
                "-moz-transition-duration": "0s",
                "-o-transition-duration": "0s",
                "-ms-transition-duration": "0s"
            }), m.element.css("visibility", "visible"));
            var f = a("#dmRoot");
            if (0 < k.length && k.hasClass("dmSlideNavClose") && !c || e) k.scrollTop(0), k.removeClass("dmSlideNavClose").removeClass("menuClosed"), 
            k.addClass("dmSlideNavOpen"), a.layoutManager.isNee() && a(document.querySelectorAll(".inlineEditorNewSelectionBarsLocked, .inlineEditorNewSelectionBarsSelected, .inlineEditorNewContext")).addClass("inlineEditorBarsLowZindex"), 
            k.show(), e = this.element.parent(), e.is(".fixedPart") && "fixed" === e.css("position") ? (this.element.css("overflow", "auto"), 
            f.css("overflow", "hidden"), f.css("position", "fixed")) : this.element.css("overflow", "visible"), 
            a.layoutManager.hideAllSubItems(), a.layoutManager.setSelected(a(".slideDownTrigger"), !0).siblings("li").removeClass("dmNavItemSelected"), 
            a.layoutManager.openAppropriateSub(), a.layoutDevice.components.slideDownNav.element.find("li").filter(function() {
                return 1 === a(this).css("opacity");
            }).eq(-1).addClass("liRemoveBorder"), "slide" === a.layoutManager._layoutParams._navigationAnimationStyle ? k.css({
                "-webkit-transform": "translate3d(0px, 0px, 0px)",
                "-o-transform": "translate(0px, 0px)",
                "-moz-transform": "translate(0px, 0px)",
                "-ms-transform": "translate(0px, 0px)"
            }) : "scale" === a.layoutManager._layoutParams._navigationAnimationStyle && k.css({
                "-webkit-transform": "scale3d(1, 1, 1)",
                "-o-transform": "scale(1, 1)",
                "-moz-transform": "scale(1, 1)",
                "-ms-transform": "scale(1, 1)",
                "-webkit-transform-origin": "0% 0%",
                "-moz-transform-origin": "0% 0%",
                "-o-transform-origin": "0% 0%",
                "-ms-transform-origin": "0% 0%"
            }), a.DM.handleExpandingNav({
                context: this,
                isOpen: !0
            }); else if (k.hasClass("dmSlideNavOpen") && !e || c) k.addClass("dmSlideNavClose").addClass("menuClosed"), 
            k.removeClass("dmSlideNavOpen"), a.layoutManager.isNee() && a(".inlineEditorNewSelectionBarsLocked, .inlineEditorNewSelectionBarsSelected, .inlineEditorNewContext").removeClass("inlineEditorBarsLowZindex"), 
            e = this.element.parent(), e.is(".fixedPart") && "fixed" === e.css("position") && (f.css("overflow", "auto"), 
            f.css("position", "static")), b && (this.element.off("webkitTransitionEnd").on("webkitTransitionEnd", h), 
            this.element.off("transitionend").on("transitionend", h), this.element.off("oTransitionEnd").on("oTransitionEnd", h), 
            this.element.off("msTransitionEnd").on("msTransitionEnd", h)), a.layoutManager.setSelected(a(".slideDownTrigger"), !1), 
            b ? "slide" === a.layoutManager._layoutParams._navigationAnimationStyle ? (b = this.element.find("ul").outerHeight(!0), 
            k.css({
                "-webkit-transform": "translate3d(0px, " + -b + "px, 0px)",
                "-o-transform": "translate(0px, " + -b + "px)",
                "-moz-transform": "translate(0px, " + -b + "px)",
                "-ms-transform": "translate(0px, " + -b + "px)"
            })) : "scale" === a.layoutManager._layoutParams._navigationAnimationStyle && k.css({
                "-webkit-transform": "scale3d(1, 0, 1)",
                "-o-transform": "scale(1, 0)",
                "-moz-transform": "scale(1, 0)",
                "-ms-transform": "scale(1, 0)",
                "-webkit-transform-origin": "0% 0%",
                "-moz-transform-origin": "0% 0%",
                "-o-transform-origin": "0% 0%",
                "-ms-transform-origin": "0% 0%"
            }) : k.hide(), b = a("#iscrollBody"), b.length && b.css("height", "auto"), a.layoutManager.hideAllSubItems(), 
            this.slideTrigger && 0 < this.slideTrigger.find(".navItemArrowBg").length && (b = this.slideTrigger.find(".navItemArrowBg"), 
            b.addClass("pointDown")), c ? a.layoutManager.markCurrentSelectedNavigation(!1) : a.layoutManager.markCurrentSelectedNavigation(!0), 
            a.DM.handleExpandingNav({
                context: this
            });
        };
        this.initSlideDownTrigger = function() {
            var b, c;
            c = this;
            this.slideTrigger && 0 < this.slideTrigger.find(".navItemArrowBg").length && (b = c.slideTrigger.find(".navItemArrowBg"), 
            b.addClass("pointDown"));
            a.layoutManager._is_touch_device && this.slideTrigger ? this.slideTrigger.unbind("touchstart.t").bind("touchstart.t", function(a) {
                c.slideDownNavHandlerImpl(null, null, null);
                a.preventDefault();
                a.stopPropagation();
            }) : this.slideTrigger && this.slideTrigger.unbind("click.c").bind("click.c", function(a) {
                c.slideDownNavHandlerImpl(null, null, null);
                a.preventDefault();
                a.stopPropagation();
            });
        };
    }
    function c() {
        this.iscrollObject = this.element = null;
        this.isUseIscroll = !1;
        this.isBodyScrollable = !0;
        this.afterAjaxCommand = null;
    }
    function b() {
        this.startY = this.slideNavigationObject = this.scrollObject = this.element = null;
        this.scrolled = !1;
    }
    function t(a, b) {
        var c = new Snap(a);
        b && n(b, c);
        return c;
    }
    function n(b, c) {
        a(b).off("click.nav-snap").on("click.nav-snap", function() {
            "closed" === c.state().state ? c.open("left") : c.close();
        });
    }
    function m() {}
    function k(a) {
        document.body.scrollTop = 0;
    }
    u.prototype = jQuery.extend(!0, {}, layoutDeviceComponentInterface);
    u.prototype.onReadyPreviewMode = function() {
        this.element = a("#innerBar");
        a.layoutDevice.initInnerBar();
    };
    u.prototype.onReadyEditorMode = function() {
        this.onReadyPreviewMode();
    };
    u.prototype.onLoadPreviewMode = function() {};
    u.prototype.onLoadEditorMode = function() {};
    u.prototype.afterAjaxCommand = function(b) {
        a.layoutDevice.initInnerBar(b);
    };
    p.prototype = jQuery.extend(!0, {}, layoutDeviceComponentInterface);
    p.prototype.onReadyEditorMode = function() {
        this.onReadyGlobal();
    };
    p.prototype.onReadyPreviewMode = function() {
        this.onReadyGlobal();
    };
    p.prototype.onLoadEditorMode = function(a) {};
    p.prototype.onLoadPreviewMode = function(a) {};
    p.prototype.hideSubnav = function() {
        "tablet" === a.layoutDevice.type && a("ul#upperFloatingNavigation > li > ul").stop(!0).fadeOut();
    };
    p.prototype.onReadyGlobal = function() {
        a("#upperFloatingNavigation").find("a").off("click.menu").on("click.menu", function(b) {
            window.editorParent.$ && window.editorParent.$.dmfw && a.layoutManager.isNee() && !window.editorParent.$.dmpages.isExternalLink(a(this).attr("href")) && (b.stopPropagation(), 
            b.preventDefault(), h() || window.editorParent.$.dmfw.previewNavigateTo({
                url: a(this).attr("href"),
                navigateWithAjax: !0,
                el: a(this),
                e: b
            }));
        });
        if ("tablet" === a.layoutDevice.type) {
            var b = a("ul#upperFloatingNavigation");
            a.commonComponents.upperFloatingNav.hideSubnav();
            b.off("touchend.subnav click.subnav", ">li.hasdmSub:not(:has(>a)), >li.desktopTopNavMoreBtn").on("touchend.subnav click.subnav", ">li.hasdmSub:not(:has(>a)), >li.desktopTopNavMoreBtn", function() {
                var b = a(this).find(">ul");
                b.is(":not(:visible)") && (a.commonComponents.upperFloatingNav.hideSubnav(), b.fadeIn().delay(1e4).fadeOut());
            }).off("mouseenter", ">li.hasdmSub, >li.desktopTopNavMoreBtn").on("mouseenter", ">li.hasdmSub, >li.desktopTopNavMoreBtn", function() {
                var b = a(this).find(">ul");
                b.is(":not(:visible)") && b.fadeIn();
            }).off("mouseleave", ">li.hasdmSub, >li.desktopTopNavMoreBtn").on("mouseleave", ">li.hasdmSub, >li.desktopTopNavMoreBtn", function() {
                a.commonComponents.upperFloatingNav.hideSubnav();
            });
        }
    };
    p.prototype.onAjaxLinkBeforeClick = function(b) {
        if (b.is("#upperFloatingNavigation li *") && "tablet" === a.layoutDevice.type && b.parent().is(".desktopTopNav.hasdmSub")) if (b = b.parent().find(">ul"), 
        b.is(":visible")) b.delay(1e3).fadeOut(); else return this.hideSubnav(), b.fadeIn().delay(1e4).fadeOut(), 
        !1;
        return !0;
    };
    p.prototype.onAjaxLinkClick = function(b) {
        b.is("#upperFloatingNavigation li *") && (a("#upperFloatingNavigation").find(".navItemSelectedServer, .dmNavItemSelected").removeClass("navItemSelectedServer").removeClass("dmNavItemSelected"), 
        b.closest("li").addClass("dmNavItemSelected"));
    };
    r.prototype = jQuery.extend(!0, {}, layoutDeviceComponentInterface);
    r.prototype.onReadyEditorMode = function() {
        this.onReadyGlobal();
    };
    r.prototype.onReadyPreviewMode = function() {
        this.onReadyGlobal();
    };
    r.prototype.onLoadEditorMode = function(a) {};
    r.prototype.onLoadPreviewMode = function(a) {};
    r.prototype.hideSubnav = function() {};
    r.prototype.onReadyGlobal = function() {
        "tablet" === a.layoutDevice.type && (a(".dmLinksMenu > ul"), a.commonComponents.extensionMenuNav.hideSubnav(), 
        a("#site_content").off("touchend.subnav click.subnav", ".dmLinksMenu > ul >li.hasdmSub:not(:has(>a)), .dmLinksMenu > ul >li.desktopTopNavMoreBtn").on("touchend.subnav click.subnav", ".dmLinksMenu > ul >li.hasdmSub:not(:has(>a)), .dmLinksMenu > ul >li.desktopTopNavMoreBtn", function() {
            var b = a(this).find(">ul");
            b.is(":not(:visible)") && (a.commonComponents.extensionMenuNav.hideSubnav(), b.fadeIn().delay(1e4).fadeOut());
        }).off("mouseenter", ">li.hasdmSub, >li.desktopTopNavMoreBtn").on("mouseenter", ">li.hasdmSub, >li.desktopTopNavMoreBtn", function() {
            var b = a(this).find(">ul");
            b.is(":not(:visible)") && b.fadeIn();
        }).off("mouseleave", ">li.hasdmSub, >li.desktopTopNavMoreBtn").on("mouseleave", ">li.hasdmSub, >li.desktopTopNavMoreBtn", function() {
            a.commonComponents.extensionMenuNav.hideSubnav();
        }));
        var b = a(".dmLinksMenu .innerUl");
        if (b.length) for (var c = 0; c < b.length; c++) {
            var e = b.eq(c), h = e.outerHeight(), k = e.parents("ul").offset().top + e.parents("ul").outerHeight() + 10, m = a("#dm").height();
            h + k > m && (h = e.parent().offset().top, h > m - h ? e.addClass("openAbove") : e.height(m - h).css("overflowY", "scroll"));
        }
    };
    r.prototype.onAjaxLinkBeforeClick = function(b) {
        if (b.is(".dmLinksMenu > ul li *") && "tablet" === a.layoutDevice.type && b.parent().is(".desktopTopNav.hasdmSub")) if (b = b.parent().find(">ul"), 
        b.is(":visible")) b.delay(1e3).fadeOut(); else return this.hideSubnav(), b.fadeIn().delay(1e4).fadeOut(), 
        !1;
        return !0;
    };
    r.prototype.onAjaxLinkClick = function(b) {
        if (b.is(".dmLinksMenu > ul li *") || b.is(".middleLogoLink")) a(".dmLinksMenu > ul").find(".navItemSelectedServer, .dmNavItemSelected").removeClass("navItemSelectedServer").removeClass("dmNavItemSelected"), 
        b.closest(".unifiednav").length ? b.addClass("dmNavItemSelected") : b.closest("li").addClass("dmNavItemSelected");
    };
    r.prototype.selector = ".dmLinksMenu > ul";
    e.prototype = jQuery.extend(!0, {}, layoutDeviceComponentInterface);
    e.prototype.initIscroll = function() {
        var b, c = a(document.getElementById("slideDownNav"));
        b = a("#iscrollBody");
        null !== this.iscrollObject && (this.iscrollObject.destroy(), this.iscrollObject = null);
        0 < a.layoutDevice.getTopFixedElementsOffset() ? (c.height(a.DM.getPageHeight() - a.layoutDevice.getTopFixedElementsOffset() - 10), 
        this.iscrollObject = new iScroll("slideDownNav", {
            onScrollStart: function() {
                var c, e, h;
                b = a("#iscrollBody");
                c = a(window).height() - b.offset().top;
                e = a("body").scrollTop();
                h = a.iOSVersion()[0];
                7 > h && (c += 60);
                b.attr("data-top", e).addClass("noScroll").css({
                    height: c,
                    "-webkit-transform": "translate(0, -" + e + "px)",
                    "-moz-transform": "translate(0, -" + e + "px)",
                    "-ms-transform": "translate(0, -" + e + "px)",
                    "-o-transform": "translate(0, -" + e + "px)",
                    transform: "translate(0, -" + e + "px)"
                });
                7 > h && window.scrollTo(0, 60);
            },
            onScrollEnd: function() {
                var b, c;
                c = a("#iscrollBody");
                b = c.attr("data-top");
                c.removeClass("noScroll").css({
                    height: "auto",
                    "-webkit-transform": "translate(0, 0)",
                    "-moz-transform": "translate(0, 0)",
                    "-ms-transform": "translate(0, 0)",
                    "-o-transform": "translate(0, 0)",
                    transform: "translate(0, 0)"
                });
                a("body").scrollTop(b);
            },
            bounce: !1
        })) : c.hasClass("dmSlideNavOpen") && c.offset().top + c.find("ul").height() > b.height() && (c = c.offset().top + c.find("ul").height(), 
        b.height(c));
    };
    e.prototype.initLoadGlobal = function() {
        this.initSlideDownTrigger();
    };
    e.prototype.onLoadEditorMode = function() {
        this.initIscroll();
        this.initLoadGlobal();
    };
    e.prototype.onLoadPreviewMode = function() {
        this.initIscroll();
        this.initLoadGlobal();
    };
    e.prototype.onReadyPreviewMode = function() {
        this.element = a("#slideDownNav").addClass("dmNavTriggerButton");
        this.slideTrigger = a(".slideDownTrigger");
        var b = 0;
        this.element.addClass("dmSlideNavClose").addClass("menuClosed");
        a.DM.isBodyScrollable() && (a.layoutManager._is_touch_device && this.element.find(".dmNavigation").unbind("touchstart").bind("touchstart", function() {
            b = event.touches[0].pageY;
            document.getElementById("slideDownNav");
        }), this.element.find(".dmNavigation").unbind("mousewheel DOMMouseScroll touchmove").bind("mousewheel DOMMouseScroll touchmove", function(c) {
            if (!(0 < a(this).parents(".fixedPart").length && "fixed" === a(this).parents(".fixedPart").css("position"))) {
                c.preventDefault();
                var e;
                a.layoutManager._is_touch_device ? (c = b - event.touches[0].pageY, a("html, body").scrollTop(document.body.scrollTop + c)) : (e = document.body.scrollTop, 
                c = event.wheelDelta || -event.detail, e = 0 < c ? e - 40 : e + 40, a("html, body").scrollTop(e));
            }
        }));
        0 === a("#innerBar:visible").length && 10 !== a.layoutManager.getCurrentLayout() && 1 !== a.layoutManager.getCurrentLayout() && this.element.find(".dmNavWrapper").removeClass("dmNavWrapper");
        this.initSlideDownTrigger();
    };
    e.prototype.onReadyEditorMode = function() {
        this.onReadyPreviewMode();
    };
    e.prototype.refresh = function() {
        this.initIscroll();
    };
    c.prototype = jQuery.extend(!0, {}, layoutDeviceComponentInterface);
    b.prototype = jQuery.extend(!0, {}, layoutDeviceComponentInterface);
    b.prototype.onReadyEditorMode = function() {
        this.onReadyGlobal();
    };
    b.prototype.onReadyPreviewMode = function() {
        this.onReadyGlobal();
    };
    b.prototype.onLoadEditorMode = function(a) {
        this.onLoadGlobal(a);
        this.initIscroll();
    };
    b.prototype.onLoadPreviewMode = function(a) {
        this.onLoadGlobal(a);
        this.initIscroll();
    };
    b.prototype.onReadyGlobal = function() {
        var b = this;
        a("#leftSidebar").find("a").off("click.menu").on("click.menu", function(c) {
            var e = a(document.getElementById("leftSidebar")), k = a(this).attr("href");
            k && 0 === k.indexOf("http://") || (h() || b.slideNavigationObject.close(), e.find(".navItemSelectedServer").removeClass("navItemSelectedServer"), 
            e.find(".dmNavItemSelected").removeClass("dmNavItemSelected"), a(this).closest("li").addClass("dmNavItemSelected"), 
            a(this).addClass("currentPage"), h() || a.layoutManager.isNee() && window.editorParent.$ && window.editorParent.$.dmfw && window.editorParent.$.dmfw.previewNavigateTo({
                url: a(this).attr("href"),
                navigateWithAjax: !0,
                el: a(this),
                e: c
            }));
        });
    };
    b.prototype.initIscroll = function() {
        var b = this;
        a("body").css({
            transform: "all .3 ease",
            "-webkit-transform": "all .3 ease"
        });
        a.DM.loadExternalScriptAsync("/_dm/s/rt/scripts/vendor/inobounce/inobounce.min.js");
        window.addEventListener("hashchange", k);
        a.layoutManager.getLayoutElement().iscrollBody.element = a("#iscrollBody");
        a.layoutManager.getLayoutElement().iscrollBody.isBodyScrollable = !1;
        var c = function(b) {
            var c = a("body").scrollTop(), e = a.layoutDevice.getTopFixedElementsOffset();
            a("body").css({
                width: "100%",
                height: "100%"
            });
            var d = window.innerHeight - e;
            window.innerHeight < a(window).height() && (d = a(window).height() - e);
            a("#iscrollBody").css({
                "-webkit-overflow-scrolling": "touch",
                height: d
            });
            c && b && a("#iscrollBody").scrollTop(c - e);
            a.DM.events.trigger("iscrollBodyResized");
        }, e = "tablet" === a.layoutDevice.type ? 240 : 190, m = {
            element: document.getElementById("dmSlideRightNavRight"),
            disable: "right",
            maxPosition: e,
            minPosition: -1 * e
        };
        h() && (a("#site_content").attr("data-snap-ignore", "true"), a("#dmSlideRightNavRight").attr("data-snap-ignore", "true"));
        e = a("#toggleMenuTrigger");
        b.slideNavigationObject ? m.element.addEventListener("transitionend", function() {
            b.slideNavigationObject = t(m);
        }) : b.slideNavigationObject = t(m, e);
        c(!0);
        a(window).resize(c);
    };
    b.prototype.onLoadGlobal = function(a) {};
    b.prototype.onAjaxLinkClick = function(b) {
        b.is("#leftSidebar li *") && (a("#leftSidebar").find(".navItemSelectedServer, .dmNavItemSelected").removeClass("navItemSelectedServer").removeClass("dmNavItemSelected"), 
        b.closest("li").addClass("dmNavItemSelected"));
        this.toggleMenu("close");
        a("#dmSlideRightNavRight").animate({
            scrollTop: 0
        }, "fast");
    };
    b.prototype.afterAjaxCommand = function(a) {};
    b.prototype.onAjaxLinkBeforeClick = function() {
        return !this.scrolled;
    };
    b.prototype.onAjaxLinkTouchStart = function(a, b) {
        this.startY = b.originalEvent.pageY;
        this.scrolled = !1;
    };
    b.prototype.onAjaxLinkTouchMove = function(a, b) {
        20 < Math.abs(b.originalEvent.pageY - this.startY) && (this.scrolled = !0);
    };
    b.prototype.toggleMenu = function(a) {
        this.slideNavigationObject && (a && "close" == a ? this.slideNavigationObject.close() : a && "open" == a ? this.slideNavigationObject.open("left") : "closed" === this.slideNavigationObject.state().state ? this.slideNavigationObject.open("left") : this.slideNavigationObject.close());
    };
    b.prototype.refresh = function() {
        this.initIscroll();
    };
    m.prototype.onReadyEditorMode = function() {
        this.onReadyPreviewMode();
    };
    m.prototype.onReadyPreviewMode = function() {
        var b;
        a(document.getElementById("slideDownTrigger")).off("click.openPopupNav").on("click.openPopupNav", m.prototype.openPopupNav);
        (b = document.body) && a(b).toggleClass("menuClosed");
    };
    m.prototype.onLoadEditorMode = function() {};
    m.prototype.hidePopupNav = function() {
        setTimeout(function() {
            var b;
            if (b = document.body) a(b).removeClass("popupNavActive"), a(b).removeClass("menuClosed");
        }, 0);
    };
    m.prototype.onLoadPreviewMode = function() {};
    m.prototype.openPopupNav = function() {
        var b;
        if (b = document.body) a(b).toggleClass("popupNavActive"), a(b).toggleClass("menuClosed");
    };
    var y = {
        iscrollBody: new c(),
        innerBar: new u(),
        slideDownNav: new e(),
        slideRightNav: new b(),
        upperFloatingNav: new p(),
        extensionMenuNav: new r(),
        popupNav: new m()
    };
    a.extend({
        commonComponents: y
    });
})(jQuery);