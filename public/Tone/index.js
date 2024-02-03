!function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.Tone = e() : t.Tone = e()
}("undefined" != typeof self ? self : this, (function() {
    return function(t) {
        var e = {};
        function s(n) {
            if (e[n])
                return e[n].exports;
            var i = e[n] = {
                i: n,
                l: !1,
                exports: {}
            };
            return t[n].call(i.exports, i, i.exports, s),
            i.l = !0,
            i.exports
        }
        return s.m = t,
        s.c = e,
        s.d = function(t, e, n) {
            s.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: n
            })
        }
        ,
        s.r = function(t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }),
            Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }
        ,
        s.t = function(t, e) {
            if (1 & e && (t = s(t)),
            8 & e)
                return t;
            if (4 & e && "object" == typeof t && t && t.__esModule)
                return t;
            var n = Object.create(null);
            if (s.r(n),
            Object.defineProperty(n, "default", {
                enumerable: !0,
                value: t
            }),
            2 & e && "string" != typeof t)
                for (var i in t)
                    s.d(n, i, function(e) {
                        return t[e]
                    }
                    .bind(null, i));
            return n
        }
        ,
        s.n = function(t) {
            var e = t && t.__esModule ? function() {
                return t.default
            }
            : function() {
                return t
            }
            ;
            return s.d(e, "a", e),
            e
        }
        ,
        s.o = function(t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }
        ,
        s.p = "",
        s(s.s = 9)
    }([function(t, e, s) {
        !function(t, e, s, n) {
            "use strict";
            function i(t) {
                return t && "object" == typeof t && "default"in t ? t : {
                    default: t
                }
            }
            var o = i(e)
              , r = i(s)
              , a = i(n)
              , c = function(t, e, s) {
                return {
                    endTime: e,
                    insertTime: s,
                    type: "exponentialRampToValue",
                    value: t
                }
            }
              , h = function(t, e, s) {
                return {
                    endTime: e,
                    insertTime: s,
                    type: "linearRampToValue",
                    value: t
                }
            }
              , u = function(t, e) {
                return {
                    startTime: e,
                    type: "setValue",
                    value: t
                }
            }
              , l = function(t, e, s) {
                return {
                    duration: s,
                    startTime: e,
                    type: "setValueCurve",
                    values: t
                }
            }
              , p = function(t, e, s) {
                var n = s.startTime
                  , i = s.target
                  , o = s.timeConstant;
                return i + (e - i) * Math.exp((n - t) / o)
            }
              , d = function(t) {
                return "exponentialRampToValue" === t.type
            }
              , f = function(t) {
                return "linearRampToValue" === t.type
            }
              , _ = function(t) {
                return d(t) || f(t)
            }
              , m = function(t) {
                return "setValue" === t.type
            }
              , g = function(t) {
                return "setValueCurve" === t.type
            }
              , v = function t(e, s, n, i) {
                var o = e[s];
                return void 0 === o ? i : _(o) || m(o) ? o.value : g(o) ? o.values[o.values.length - 1] : p(n, t(e, s - 1, o.startTime, i), o)
            }
              , y = function(t, e, s, n, i) {
                return void 0 === s ? [n.insertTime, i] : _(s) ? [s.endTime, s.value] : m(s) ? [s.startTime, s.value] : g(s) ? [s.startTime + s.duration, s.values[s.values.length - 1]] : [s.startTime, v(t, e - 1, s.startTime, i)]
            }
              , x = function(t) {
                return "cancelAndHold" === t.type
            }
              , w = function(t) {
                return "cancelScheduledValues" === t.type
            }
              , b = function(t) {
                return x(t) || w(t) ? t.cancelTime : d(t) || f(t) ? t.endTime : t.startTime
            }
              , T = function(t, e, s, n) {
                var i = n.endTime
                  , o = n.value;
                return s === o ? o : 0 < s && 0 < o || s < 0 && o < 0 ? s * Math.pow(o / s, (t - e) / (i - e)) : 0
            }
              , S = function(t, e, s, n) {
                return s + (t - e) / (n.endTime - e) * (n.value - s)
            }
              , k = function(t, e) {
                var s = e.duration
                  , n = e.startTime
                  , i = e.values;
                return function(t, e) {
                    var s = Math.floor(e)
                      , n = Math.ceil(e);
                    return s === n ? t[s] : (1 - (e - s)) * t[s] + (1 - (n - e)) * t[n]
                }(i, (t - n) / s * (i.length - 1))
            }
              , C = function(t) {
                return "setTarget" === t.type
            }
              , A = function() {
                function t(e) {
                    r.default(this, t),
                    this._automationEvents = [],
                    this._currenTime = 0,
                    this._defaultValue = e
                }
                return a.default(t, [{
                    key: Symbol.iterator,
                    value: function() {
                        return this._automationEvents[Symbol.iterator]()
                    }
                }, {
                    key: "add",
                    value: function(t) {
                        var e = b(t);
                        if (x(t) || w(t)) {
                            var s = this._automationEvents.findIndex((function(s) {
                                return w(t) && g(s) ? s.startTime + s.duration >= e : b(s) >= e
                            }
                            ))
                              , n = this._automationEvents[s];
                            if (-1 !== s && (this._automationEvents = this._automationEvents.slice(0, s)),
                            x(t)) {
                                var i = this._automationEvents[this._automationEvents.length - 1];
                                if (void 0 !== n && _(n)) {
                                    if (C(i))
                                        throw new Error("The internal list is malformed.");
                                    var o = g(i) ? i.startTime + i.duration : b(i)
                                      , r = g(i) ? i.values[i.values.length - 1] : i.value
                                      , a = d(n) ? T(e, o, r, n) : S(e, o, r, n)
                                      , p = d(n) ? c(a, e, this._currenTime) : h(a, e, this._currenTime);
                                    this._automationEvents.push(p)
                                }
                                void 0 !== i && C(i) && this._automationEvents.push(u(this.getValue(e), e)),
                                void 0 !== i && g(i) && i.startTime + i.duration > e && (this._automationEvents[this._automationEvents.length - 1] = l(new Float32Array([6, 7]), i.startTime, e - i.startTime))
                            }
                        } else {
                            var m = this._automationEvents.findIndex((function(t) {
                                return b(t) > e
                            }
                            ))
                              , v = -1 === m ? this._automationEvents[this._automationEvents.length - 1] : this._automationEvents[m - 1];
                            if (void 0 !== v && g(v) && b(v) + v.duration > e)
                                return !1;
                            var y = d(t) ? c(t.value, t.endTime, this._currenTime) : f(t) ? h(t.value, e, this._currenTime) : t;
                            if (-1 === m)
                                this._automationEvents.push(y);
                            else {
                                if (g(t) && e + t.duration > b(this._automationEvents[m]))
                                    return !1;
                                this._automationEvents.splice(m, 0, y)
                            }
                        }
                        return !0
                    }
                }, {
                    key: "flush",
                    value: function(t) {
                        var e = this._automationEvents.findIndex((function(e) {
                            return b(e) > t
                        }
                        ));
                        if (e > 1) {
                            var s = this._automationEvents.slice(e - 1)
                              , n = s[0];
                            C(n) && s.unshift(u(v(this._automationEvents, e - 2, n.startTime, this._defaultValue), n.startTime)),
                            this._automationEvents = s
                        }
                    }
                }, {
                    key: "getValue",
                    value: function(t) {
                        if (0 === this._automationEvents.length)
                            return this._defaultValue;
                        var e = this._automationEvents[this._automationEvents.length - 1]
                          , s = this._automationEvents.findIndex((function(e) {
                            return b(e) > t
                        }
                        ))
                          , n = this._automationEvents[s]
                          , i = b(e) <= t ? e : this._automationEvents[s - 1];
                        if (void 0 !== i && C(i) && (void 0 === n || !_(n) || n.insertTime > t))
                            return p(t, v(this._automationEvents, s - 2, i.startTime, this._defaultValue), i);
                        if (void 0 !== i && m(i) && (void 0 === n || !_(n)))
                            return i.value;
                        if (void 0 !== i && g(i) && (void 0 === n || !_(n) || i.startTime + i.duration > t))
                            return t < i.startTime + i.duration ? k(t, i) : i.values[i.values.length - 1];
                        if (void 0 !== i && _(i) && (void 0 === n || !_(n)))
                            return i.value;
                        if (void 0 !== n && d(n)) {
                            var r = y(this._automationEvents, s - 1, i, n, this._defaultValue)
                              , a = o.default(r, 2)
                              , c = a[0]
                              , h = a[1];
                            return T(t, c, h, n)
                        }
                        if (void 0 !== n && f(n)) {
                            var u = y(this._automationEvents, s - 1, i, n, this._defaultValue)
                              , l = o.default(u, 2)
                              , x = l[0]
                              , w = l[1];
                            return S(t, x, w, n)
                        }
                        return this._defaultValue
                    }
                }]),
                t
            }();
            t.AutomationEventList = A,
            t.createCancelAndHoldAutomationEvent = function(t) {
                return {
                    cancelTime: t,
                    type: "cancelAndHold"
                }
            }
            ,
            t.createCancelScheduledValuesAutomationEvent = function(t) {
                return {
                    cancelTime: t,
                    type: "cancelScheduledValues"
                }
            }
            ,
            t.createExponentialRampToValueAutomationEvent = function(t, e) {
                return {
                    endTime: e,
                    type: "exponentialRampToValue",
                    value: t
                }
            }
            ,
            t.createLinearRampToValueAutomationEvent = function(t, e) {
                return {
                    endTime: e,
                    type: "linearRampToValue",
                    value: t
                }
            }
            ,
            t.createSetTargetAutomationEvent = function(t, e, s) {
                return {
                    startTime: e,
                    target: t,
                    timeConstant: s,
                    type: "setTarget"
                }
            }
            ,
            t.createSetValueAutomationEvent = u,
            t.createSetValueCurveAutomationEvent = l,
            Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }(e, s(1), s(7), s(8))
    }
    , function(t, e, s) {
        var n = s(2)
          , i = s(3)
          , o = s(4)
          , r = s(6);
        t.exports = function(t, e) {
            return n(t) || i(t, e) || o(t, e) || r()
        }
    }
    , function(t, e) {
        t.exports = function(t) {
            if (Array.isArray(t))
                return t
        }
    }
    , function(t, e) {
        t.exports = function(t, e) {
            if ("undefined" != typeof Symbol && Symbol.iterator in Object(t)) {
                var s = []
                  , n = !0
                  , i = !1
                  , o = void 0;
                try {
                    for (var r, a = t[Symbol.iterator](); !(n = (r = a.next()).done) && (s.push(r.value),
                    !e || s.length !== e); n = !0)
                        ;
                } catch (t) {
                    i = !0,
                    o = t
                } finally {
                    try {
                        n || null == a.return || a.return()
                    } finally {
                        if (i)
                            throw o
                    }
                }
                return s
            }
        }
    }
    , function(t, e, s) {
        var n = s(5);
        t.exports = function(t, e) {
            if (t) {
                if ("string" == typeof t)
                    return n(t, e);
                var s = Object.prototype.toString.call(t).slice(8, -1);
                return "Object" === s && t.constructor && (s = t.constructor.name),
                "Map" === s || "Set" === s ? Array.from(t) : "Arguments" === s || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s) ? n(t, e) : void 0
            }
        }
    }
    , function(t, e) {
        t.exports = function(t, e) {
            (null == e || e > t.length) && (e = t.length);
            for (var s = 0, n = new Array(e); s < e; s++)
                n[s] = t[s];
            return n
        }
    }
    , function(t, e) {
        t.exports = function() {
            throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
        }
    }
    , function(t, e) {
        t.exports = function(t, e) {
            if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function")
        }
    }
    , function(t, e) {
        function s(t, e) {
            for (var s = 0; s < e.length; s++) {
                var n = e[s];
                n.enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n)
            }
        }
        t.exports = function(t, e, n) {
            return e && s(t.prototype, e),
            n && s(t, n),
            t
        }
    }
    , function(t, e, s) {
        "use strict";
        s.r(e),
        s.d(e, "getContext", (function() {
            return Ji
        }
        )),
        s.d(e, "setContext", (function() {
            return Ki
        }
        )),
        s.d(e, "Clock", (function() {
            return qo
        }
        )),
        s.d(e, "Context", (function() {
            return Gi
        }
        )),
        s.d(e, "BaseContext", (function() {
            return Wi
        }
        )),
        s.d(e, "Delay", (function() {
            return Fo
        }
        )),
        s.d(e, "Gain", (function() {
            return ko
        }
        )),
        s.d(e, "Offline", (function() {
            return Io
        }
        )),
        s.d(e, "OfflineContext", (function() {
            return Yi
        }
        )),
        s.d(e, "Param", (function() {
            return xo
        }
        )),
        s.d(e, "ToneAudioBuffer", (function() {
            return Xi
        }
        )),
        s.d(e, "ToneAudioBuffers", (function() {
            return Vo
        }
        )),
        s.d(e, "ToneAudioNode", (function() {
            return wo
        }
        )),
        s.d(e, "connectSeries", (function() {
            return bo
        }
        )),
        s.d(e, "connect", (function() {
            return To
        }
        )),
        s.d(e, "disconnect", (function() {
            return So
        }
        )),
        s.d(e, "FrequencyClass", (function() {
            return lo
        }
        )),
        s.d(e, "Frequency", (function() {
            return _o
        }
        )),
        s.d(e, "MidiClass", (function() {
            return No
        }
        )),
        s.d(e, "Midi", (function() {
            return Po
        }
        )),
        s.d(e, "TimeClass", (function() {
            return ho
        }
        )),
        s.d(e, "Time", (function() {
            return uo
        }
        )),
        s.d(e, "TicksClass", (function() {
            return jo
        }
        )),
        s.d(e, "Ticks", (function() {
            return Lo
        }
        )),
        s.d(e, "TransportTimeClass", (function() {
            return mo
        }
        )),
        s.d(e, "TransportTime", (function() {
            return go
        }
        )),
        s.d(e, "Emitter", (function() {
            return Bi
        }
        )),
        s.d(e, "IntervalTimeline", (function() {
            return Bo
        }
        )),
        s.d(e, "StateTimeline", (function() {
            return yo
        }
        )),
        s.d(e, "Timeline", (function() {
            return Ni
        }
        )),
        s.d(e, "isUndef", (function() {
            return ai
        }
        )),
        s.d(e, "isDefined", (function() {
            return ci
        }
        )),
        s.d(e, "isFunction", (function() {
            return hi
        }
        )),
        s.d(e, "isNumber", (function() {
            return ui
        }
        )),
        s.d(e, "isObject", (function() {
            return li
        }
        )),
        s.d(e, "isBoolean", (function() {
            return pi
        }
        )),
        s.d(e, "isArray", (function() {
            return di
        }
        )),
        s.d(e, "isString", (function() {
            return fi
        }
        )),
        s.d(e, "isNote", (function() {
            return _i
        }
        )),
        s.d(e, "dbToGain", (function() {
            return eo
        }
        )),
        s.d(e, "gainToDb", (function() {
            return so
        }
        )),
        s.d(e, "intervalToFrequencyRatio", (function() {
            return no
        }
        )),
        s.d(e, "ftom", (function() {
            return oo
        }
        )),
        s.d(e, "mtof", (function() {
            return ao
        }
        )),
        s.d(e, "optionsFromArguments", (function() {
            return Di
        }
        )),
        s.d(e, "defaultArg", (function() {
            return Oi
        }
        )),
        s.d(e, "Unit", (function() {
            return i
        }
        )),
        s.d(e, "debug", (function() {
            return n
        }
        )),
        s.d(e, "Noise", (function() {
            return Jo
        }
        )),
        s.d(e, "UserMedia", (function() {
            return er
        }
        )),
        s.d(e, "Oscillator", (function() {
            return ir
        }
        )),
        s.d(e, "AMOscillator", (function() {
            return hr
        }
        )),
        s.d(e, "FMOscillator", (function() {
            return ur
        }
        )),
        s.d(e, "PulseOscillator", (function() {
            return lr
        }
        )),
        s.d(e, "FatOscillator", (function() {
            return pr
        }
        )),
        s.d(e, "PWMOscillator", (function() {
            return dr
        }
        )),
        s.d(e, "OmniOscillator", (function() {
            return _r
        }
        )),
        s.d(e, "ToneOscillatorNode", (function() {
            return nr
        }
        )),
        s.d(e, "LFO", (function() {
            return yr
        }
        )),
        s.d(e, "ToneBufferSource", (function() {
            return $o
        }
        )),
        s.d(e, "Player", (function() {
            return br
        }
        )),
        s.d(e, "Players", (function() {
            return Tr
        }
        )),
        s.d(e, "GrainPlayer", (function() {
            return Sr
        }
        )),
        s.d(e, "Add", (function() {
            return mr
        }
        )),
        s.d(e, "Abs", (function() {
            return kr
        }
        )),
        s.d(e, "AudioToGain", (function() {
            return ar
        }
        )),
        s.d(e, "GainToAudio", (function() {
            return Cr
        }
        )),
        s.d(e, "GreaterThan", (function() {
            return Mr
        }
        )),
        s.d(e, "GreaterThanZero", (function() {
            return Or
        }
        )),
        s.d(e, "Multiply", (function() {
            return cr
        }
        )),
        s.d(e, "Negate", (function() {
            return Ar
        }
        )),
        s.d(e, "Pow", (function() {
            return Er
        }
        )),
        s.d(e, "Signal", (function() {
            return Do
        }
        )),
        s.d(e, "connectSignal", (function() {
            return Oo
        }
        )),
        s.d(e, "Scale", (function() {
            return gr
        }
        )),
        s.d(e, "ScaleExp", (function() {
            return Rr
        }
        )),
        s.d(e, "Subtract", (function() {
            return Dr
        }
        )),
        s.d(e, "SyncedSignal", (function() {
            return qr
        }
        )),
        s.d(e, "WaveShaper", (function() {
            return rr
        }
        )),
        s.d(e, "Zero", (function() {
            return vr
        }
        )),
        s.d(e, "AMSynth", (function() {
            return zr
        }
        )),
        s.d(e, "DuoSynth", (function() {
            return Qr
        }
        )),
        s.d(e, "FMSynth", (function() {
            return Zr
        }
        )),
        s.d(e, "MetalSynth", (function() {
            return Yr
        }
        )),
        s.d(e, "MembraneSynth", (function() {
            return Hr
        }
        )),
        s.d(e, "MonoSynth", (function() {
            return Ur
        }
        )),
        s.d(e, "NoiseSynth", (function() {
            return $r
        }
        )),
        s.d(e, "PluckSynth", (function() {
            return oa
        }
        )),
        s.d(e, "PolySynth", (function() {
            return ra
        }
        )),
        s.d(e, "Sampler", (function() {
            return aa
        }
        )),
        s.d(e, "Synth", (function() {
            return jr
        }
        )),
        s.d(e, "Loop", (function() {
            return ha
        }
        )),
        s.d(e, "Part", (function() {
            return ua
        }
        )),
        s.d(e, "Pattern", (function() {
            return xa
        }
        )),
        s.d(e, "Sequence", (function() {
            return wa
        }
        )),
        s.d(e, "ToneEvent", (function() {
            return ca
        }
        )),
        s.d(e, "AutoFilter", (function() {
            return ka
        }
        )),
        s.d(e, "AutoPanner", (function() {
            return Aa
        }
        )),
        s.d(e, "AutoWah", (function() {
            return Oa
        }
        )),
        s.d(e, "BitCrusher", (function() {
            return Ma
        }
        )),
        s.d(e, "Chebyshev", (function() {
            return Ra
        }
        )),
        s.d(e, "Chorus", (function() {
            return Na
        }
        )),
        s.d(e, "Distortion", (function() {
            return Pa
        }
        )),
        s.d(e, "FeedbackDelay", (function() {
            return La
        }
        )),
        s.d(e, "FrequencyShifter", (function() {
            return Ba
        }
        )),
        s.d(e, "Freeverb", (function() {
            return Ua
        }
        )),
        s.d(e, "JCReverb", (function() {
            return Ya
        }
        )),
        s.d(e, "PingPongDelay", (function() {
            return $a
        }
        )),
        s.d(e, "PitchShift", (function() {
            return Ja
        }
        )),
        s.d(e, "Phaser", (function() {
            return Ka
        }
        )),
        s.d(e, "Reverb", (function() {
            return tc
        }
        )),
        s.d(e, "StereoWidener", (function() {
            return ic
        }
        )),
        s.d(e, "Tremolo", (function() {
            return oc
        }
        )),
        s.d(e, "Vibrato", (function() {
            return rc
        }
        )),
        s.d(e, "Analyser", (function() {
            return ac
        }
        )),
        s.d(e, "Meter", (function() {
            return hc
        }
        )),
        s.d(e, "FFT", (function() {
            return uc
        }
        )),
        s.d(e, "DCMeter", (function() {
            return lc
        }
        )),
        s.d(e, "Waveform", (function() {
            return pc
        }
        )),
        s.d(e, "Follower", (function() {
            return Da
        }
        )),
        s.d(e, "Channel", (function() {
            return _c
        }
        )),
        s.d(e, "CrossFade", (function() {
            return ba
        }
        )),
        s.d(e, "Merge", (function() {
            return Fa
        }
        )),
        s.d(e, "MidSideMerge", (function() {
            return sc
        }
        )),
        s.d(e, "MidSideSplit", (function() {
            return ec
        }
        )),
        s.d(e, "Mono", (function() {
            return mc
        }
        )),
        s.d(e, "MultibandSplit", (function() {
            return gc
        }
        )),
        s.d(e, "Panner", (function() {
            return Ca
        }
        )),
        s.d(e, "Panner3D", (function() {
            return yc
        }
        )),
        s.d(e, "PanVol", (function() {
            return fc
        }
        )),
        s.d(e, "Recorder", (function() {
            return xc
        }
        )),
        s.d(e, "Solo", (function() {
            return dc
        }
        )),
        s.d(e, "Split", (function() {
            return qa
        }
        )),
        s.d(e, "Volume", (function() {
            return Go
        }
        )),
        s.d(e, "Compressor", (function() {
            return wc
        }
        )),
        s.d(e, "Gate", (function() {
            return bc
        }
        )),
        s.d(e, "Limiter", (function() {
            return Tc
        }
        )),
        s.d(e, "MidSideCompressor", (function() {
            return Sc
        }
        )),
        s.d(e, "MultibandCompressor", (function() {
            return kc
        }
        )),
        s.d(e, "AmplitudeEnvelope", (function() {
            return Pr
        }
        )),
        s.d(e, "Envelope", (function() {
            return Fr
        }
        )),
        s.d(e, "FrequencyEnvelope", (function() {
            return Gr
        }
        )),
        s.d(e, "EQ3", (function() {
            return Cc
        }
        )),
        s.d(e, "Filter", (function() {
            return Wr
        }
        )),
        s.d(e, "OnePoleFilter", (function() {
            return na
        }
        )),
        s.d(e, "FeedbackCombFilter", (function() {
            return sa
        }
        )),
        s.d(e, "LowpassCombFilter", (function() {
            return ia
        }
        )),
        s.d(e, "Convolver", (function() {
            return Ac
        }
        )),
        s.d(e, "BiquadFilter", (function() {
            return Br
        }
        )),
        s.d(e, "version", (function() {
            return o
        }
        )),
        s.d(e, "start", (function() {
            return to
        }
        )),
        s.d(e, "supported", (function() {
            return Kn
        }
        )),
        s.d(e, "now", (function() {
            return Dc
        }
        )),
        s.d(e, "immediate", (function() {
            return Oc
        }
        )),
        s.d(e, "Transport", (function() {
            return Mc
        }
        )),
        s.d(e, "getTransport", (function() {
            return Ec
        }
        )),
        s.d(e, "Destination", (function() {
            return Rc
        }
        )),
        s.d(e, "Master", (function() {
            return qc
        }
        )),
        s.d(e, "getDestination", (function() {
            return Fc
        }
        )),
        s.d(e, "Listener", (function() {
            return Ic
        }
        )),
        s.d(e, "getListener", (function() {
            return Vc
        }
        )),
        s.d(e, "Draw", (function() {
            return Nc
        }
        )),
        s.d(e, "getDraw", (function() {
            return Pc
        }
        )),
        s.d(e, "context", (function() {
            return jc
        }
        )),
        s.d(e, "loaded", (function() {
            return Lc
        }
        )),
        s.d(e, "Buffer", (function() {
            return zc
        }
        )),
        s.d(e, "Buffers", (function() {
            return Bc
        }
        )),
        s.d(e, "BufferSource", (function() {
            return Wc
        }
        ));
        var n = {};
        s.r(n),
        s.d(n, "assert", (function() {
            return ti
        }
        )),
        s.d(n, "assertRange", (function() {
            return ei
        }
        )),
        s.d(n, "assertContextRunning", (function() {
            return si
        }
        )),
        s.d(n, "setLogger", (function() {
            return ii
        }
        )),
        s.d(n, "log", (function() {
            return oi
        }
        )),
        s.d(n, "warn", (function() {
            return ri
        }
        ));
        var i = {};
        s.r(i);
        const o = "14.7.77";
        var r = s(0);
        const a = new WeakSet
          , c = new WeakMap
          , h = new WeakMap
          , u = new WeakMap
          , l = new WeakMap
          , p = new WeakMap
          , d = new WeakMap
          , f = new WeakMap
          , _ = new WeakMap
          , m = new WeakMap
          , g = {
            construct: ()=>g
        }
          , v = /^import(?:(?:[\s]+[\w]+|(?:[\s]+[\w]+[\s]*,)?[\s]*\{[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?(?:[\s]*,[\s]*[\w]+(?:[\s]+as[\s]+[\w]+)?)*[\s]*}|(?:[\s]+[\w]+[\s]*,)?[\s]*\*[\s]+as[\s]+[\w]+)[\s]+from)?(?:[\s]*)("([^"\\]|\\.)+"|'([^'\\]|\\.)+')(?:[\s]*);?/
          , y = (t,e)=>{
            const s = [];
            let n = t.replace(/^[\s]+/, "")
              , i = n.match(v);
            for (; null !== i; ) {
                const t = i[1].slice(1, -1)
                  , o = i[0].replace(/([\s]+)?;?$/, "").replace(t, new URL(t,e).toString());
                s.push(o),
                n = n.slice(i[0].length).replace(/^[\s]+/, ""),
                i = n.match(v)
            }
            return [s.join(";"), n]
        }
          , x = t=>{
            if (void 0 !== t && !Array.isArray(t))
                throw new TypeError("The parameterDescriptors property of given value for processorCtor is not an array.")
        }
          , w = t=>{
            if (!(t=>{
                try {
                    new new Proxy(t,g)
                } catch {
                    return !1
                }
                return !0
            }
            )(t))
                throw new TypeError("The given value for processorCtor should be a constructor.");
            if (null === t.prototype || "object" != typeof t.prototype)
                throw new TypeError("The given value for processorCtor should have a prototype.")
        }
          , b = (t,e)=>{
            const s = t.get(e);
            if (void 0 === s)
                throw new Error("A value with the given key could not be found.");
            return s
        }
          , T = (t,e)=>{
            const s = Array.from(t).filter(e);
            if (s.length > 1)
                throw Error("More than one element was found.");
            if (0 === s.length)
                throw Error("No element was found.");
            const [n] = s;
            return t.delete(n),
            n
        }
          , S = (t,e,s,n)=>{
            const i = b(t, e)
              , o = T(i, t=>t[0] === s && t[1] === n);
            return 0 === i.size && t.delete(e),
            o
        }
          , k = t=>b(d, t)
          , C = t=>{
            if (a.has(t))
                throw new Error("The AudioNode is already stored.");
            a.add(t),
            k(t).forEach(t=>t(!0))
        }
          , A = t=>"port"in t
          , D = t=>{
            if (!a.has(t))
                throw new Error("The AudioNode is not stored.");
            a.delete(t),
            k(t).forEach(t=>t(!1))
        }
          , O = (t,e)=>{
            !A(t) && e.every(t=>0 === t.size) && D(t)
        }
          , M = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            fftSize: 2048,
            maxDecibels: -30,
            minDecibels: -100,
            smoothingTimeConstant: .8
        }
          , E = (t,e)=>t.context === e
          , R = t=>{
            try {
                t.copyToChannel(new Float32Array(1), 0, -1)
            } catch {
                return !1
            }
            return !0
        }
          , q = ()=>new DOMException("","IndexSizeError")
          , F = t=>{
            var e;
            t.getChannelData = (e = t.getChannelData,
            s=>{
                try {
                    return e.call(t, s)
                } catch (t) {
                    if (12 === t.code)
                        throw q();
                    throw t
                }
            }
            )
        }
          , I = {
            numberOfChannels: 1
        }
          , V = -34028234663852886e22
          , N = -V
          , P = t=>a.has(t)
          , j = {
            buffer: null,
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            loop: !1,
            loopEnd: 0,
            loopStart: 0,
            playbackRate: 1
        }
          , L = t=>b(c, t)
          , z = t=>b(u, t)
          , B = (t,e)=>{
            const {activeInputs: s} = L(t);
            s.forEach(s=>s.forEach(([s])=>{
                e.includes(t) || B(s, [...e, t])
            }
            ));
            const n = (t=>"playbackRate"in t)(t) ? [t.playbackRate] : A(t) ? Array.from(t.parameters.values()) : (t=>"frequency"in t && "gain"in t)(t) ? [t.Q, t.detune, t.frequency, t.gain] : (t=>"offset"in t)(t) ? [t.offset] : (t=>!("frequency"in t) && "gain"in t)(t) ? [t.gain] : (t=>"detune"in t && "frequency"in t)(t) ? [t.detune, t.frequency] : (t=>"pan"in t)(t) ? [t.pan] : [];
            for (const t of n) {
                const s = z(t);
                void 0 !== s && s.activeInputs.forEach(([t])=>B(t, e))
            }
            P(t) && D(t)
        }
          , W = t=>{
            B(t.destination, [])
        }
          , G = t=>void 0 === t || "number" == typeof t || "string" == typeof t && ("balanced" === t || "interactive" === t || "playback" === t)
          , U = t=>"context"in t
          , Q = t=>U(t[0])
          , Z = (t,e,s,n)=>{
            for (const e of t)
                if (s(e)) {
                    if (n)
                        return !1;
                    throw Error("The set contains at least one similar element.")
                }
            return t.add(e),
            !0
        }
          , X = (t,e,[s,n],i)=>{
            Z(t, [e, s, n], t=>t[0] === e && t[1] === s, i)
        }
          , Y = (t,[e,s,n],i)=>{
            const o = t.get(e);
            void 0 === o ? t.set(e, new Set([[s, n]])) : Z(o, [s, n], t=>t[0] === s, i)
        }
          , H = t=>"inputs"in t
          , $ = (t,e,s,n)=>{
            if (H(e)) {
                const i = e.inputs[n];
                return t.connect(i, s, 0),
                [i, s, 0]
            }
            return t.connect(e, s, n),
            [e, s, n]
        }
          , J = (t,e,s)=>{
            for (const n of t)
                if (n[0] === e && n[1] === s)
                    return t.delete(n),
                    n;
            return null
        }
          , K = (t,e)=>{
            if (!k(t).delete(e))
                throw new Error("Missing the expected event listener.")
        }
          , tt = (t,e,s)=>{
            const n = b(t, e)
              , i = T(n, t=>t[0] === s);
            return 0 === n.size && t.delete(e),
            i
        }
          , et = (t,e,s,n)=>{
            H(e) ? t.disconnect(e.inputs[n], s, 0) : t.disconnect(e, s, n)
        }
          , st = t=>b(h, t)
          , nt = t=>b(l, t)
          , it = t=>f.has(t)
          , ot = t=>!a.has(t)
          , rt = t=>new Promise(e=>{
            const s = t.createScriptProcessor(256, 1, 1)
              , n = t.createGain()
              , i = t.createBuffer(1, 2, 44100)
              , o = i.getChannelData(0);
            o[0] = 1,
            o[1] = 1;
            const r = t.createBufferSource();
            r.buffer = i,
            r.loop = !0,
            r.connect(s).connect(t.destination),
            r.connect(n),
            r.disconnect(n),
            s.onaudioprocess = n=>{
                const i = n.inputBuffer.getChannelData(0);
                Array.prototype.some.call(i, t=>1 === t) ? e(!0) : e(!1),
                r.stop(),
                s.onaudioprocess = null,
                r.disconnect(s),
                s.disconnect(t.destination)
            }
            ,
            r.start()
        }
        )
          , at = (t,e)=>{
            const s = new Map;
            for (const e of t)
                for (const t of e) {
                    const e = s.get(t);
                    s.set(t, void 0 === e ? 1 : e + 1)
                }
            s.forEach((t,s)=>e(s, t))
        }
          , ct = t=>"context"in t
          , ht = (t,e,s,n)=>{
            const {activeInputs: i, passiveInputs: o} = z(e)
              , {outputs: r} = L(t)
              , a = k(t)
              , c = r=>{
                const a = st(t)
                  , c = nt(e);
                if (r) {
                    const e = tt(o, t, s);
                    X(i, t, e, !1),
                    n || it(t) || a.connect(c, s)
                } else {
                    const e = ((t,e,s)=>T(t, t=>t[0] === e && t[1] === s))(i, t, s);
                    Y(o, e, !1),
                    n || it(t) || a.disconnect(c, s)
                }
            }
            ;
            return !!Z(r, [e, s], t=>t[0] === e && t[1] === s, !0) && (a.add(c),
            P(t) ? X(i, t, [s, c], !0) : Y(o, [t, s, c], !0),
            !0)
        }
          , ut = (t,e,s,n,i)=>{
            const [o,r] = ((t,e,s,n)=>{
                const {activeInputs: i, passiveInputs: o} = L(e)
                  , r = J(i[n], t, s);
                if (null === r) {
                    return [S(o, t, s, n)[2], !1]
                }
                return [r[2], !0]
            }
            )(t, s, n, i);
            if (null !== o && (K(t, o),
            !r || e || it(t) || et(st(t), st(s), n, i)),
            P(s)) {
                const {activeInputs: t} = L(s);
                O(s, t)
            }
        }
          , lt = (t,e,s,n)=>{
            const [i,o] = ((t,e,s)=>{
                const {activeInputs: n, passiveInputs: i} = z(e)
                  , o = J(n, t, s);
                if (null === o) {
                    return [tt(i, t, s)[1], !1]
                }
                return [o[2], !0]
            }
            )(t, s, n);
            null !== i && (K(t, i),
            !o || e || it(t) || st(t).disconnect(nt(s), n))
        }
        ;
        class pt {
            constructor(t) {
                this._map = new Map(t)
            }
            get size() {
                return this._map.size
            }
            entries() {
                return this._map.entries()
            }
            forEach(t, e=null) {
                return this._map.forEach((s,n)=>t.call(e, s, n, this))
            }
            get(t) {
                return this._map.get(t)
            }
            has(t) {
                return this._map.has(t)
            }
            keys() {
                return this._map.keys()
            }
            values() {
                return this._map.values()
            }
        }
        const dt = {
            channelCount: 2,
            channelCountMode: "explicit",
            channelInterpretation: "speakers",
            numberOfInputs: 1,
            numberOfOutputs: 1,
            parameterData: {},
            processorOptions: {}
        };
        function ft(t, e, s, n, i) {
            if ("function" == typeof t.copyFromChannel)
                0 === e[s].byteLength && (e[s] = new Float32Array(128)),
                t.copyFromChannel(e[s], n, i);
            else {
                const o = t.getChannelData(n);
                if (0 === e[s].byteLength)
                    e[s] = o.slice(i, i + 128);
                else {
                    const t = new Float32Array(o.buffer,i * Float32Array.BYTES_PER_ELEMENT,128);
                    e[s].set(t)
                }
            }
        }
        const _t = (t,e,s,n,i)=>{
            "function" == typeof t.copyToChannel ? 0 !== e[s].byteLength && t.copyToChannel(e[s], n, i) : 0 !== e[s].byteLength && t.getChannelData(n).set(e[s], i)
        }
          , mt = (t,e)=>{
            const s = [];
            for (let n = 0; n < t; n += 1) {
                const t = []
                  , i = "number" == typeof e ? e : e[n];
                for (let e = 0; e < i; e += 1)
                    t.push(new Float32Array(128));
                s.push(t)
            }
            return s
        }
          , gt = async(t,e,s,n,i,o,r)=>{
            const a = null === e ? 128 * Math.ceil(t.context.length / 128) : e.length
              , c = n.channelCount * n.numberOfInputs
              , h = i.reduce((t,e)=>t + e, 0)
              , u = 0 === h ? null : s.createBuffer(h, a, s.sampleRate);
            if (void 0 === o)
                throw new Error("Missing the processor constructor.");
            const l = L(t)
              , p = await ((t,e)=>{
                const s = b(m, t)
                  , n = st(e);
                return b(s, n)
            }
            )(s, t)
              , d = mt(n.numberOfInputs, n.channelCount)
              , f = mt(n.numberOfOutputs, i)
              , _ = Array.from(t.parameters.keys()).reduce((t,e)=>({
                ...t,
                [e]: new Float32Array(128)
            }), {});
            for (let h = 0; h < a; h += 128) {
                if (n.numberOfInputs > 0 && null !== e)
                    for (let t = 0; t < n.numberOfInputs; t += 1)
                        for (let s = 0; s < n.channelCount; s += 1)
                            ft(e, d[t], s, s, h);
                void 0 !== o.parameterDescriptors && null !== e && o.parameterDescriptors.forEach(({name: t},s)=>{
                    ft(e, _, t, c + s, h)
                }
                );
                for (let t = 0; t < n.numberOfInputs; t += 1)
                    for (let e = 0; e < i[t]; e += 1)
                        0 === f[t][e].byteLength && (f[t][e] = new Float32Array(128));
                try {
                    const t = d.map((t,e)=>0 === l.activeInputs[e].size ? [] : t)
                      , e = r(h / s.sampleRate, s.sampleRate, ()=>p.process(t, f, _));
                    if (null !== u)
                        for (let t = 0, e = 0; t < n.numberOfOutputs; t += 1) {
                            for (let s = 0; s < i[t]; s += 1)
                                _t(u, f[t], s, e + s, h);
                            e += i[t]
                        }
                    if (!e)
                        break
                } catch (e) {
                    t.dispatchEvent(new ErrorEvent("processorerror",{
                        colno: e.colno,
                        filename: e.filename,
                        lineno: e.lineno,
                        message: e.message
                    }));
                    break
                }
            }
            return u
        }
          , vt = {
            Q: 1,
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            detune: 0,
            frequency: 350,
            gain: 0,
            type: "lowpass"
        }
          , yt = {
            channelCount: 1,
            channelCountMode: "explicit",
            channelInterpretation: "speakers",
            numberOfInputs: 6
        }
          , xt = {
            channelCount: 6,
            channelCountMode: "explicit",
            channelInterpretation: "discrete",
            numberOfOutputs: 6
        }
          , wt = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            offset: 1
        }
          , bt = {
            buffer: null,
            channelCount: 2,
            channelCountMode: "clamped-max",
            channelInterpretation: "speakers",
            disableNormalization: !1
        }
          , Tt = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            delayTime: 0,
            maxDelayTime: 1
        }
          , St = (t,e,s)=>{
            const n = e[s];
            if (void 0 === n)
                throw t();
            return n
        }
          , kt = {
            attack: .003,
            channelCount: 2,
            channelCountMode: "clamped-max",
            channelInterpretation: "speakers",
            knee: 30,
            ratio: 12,
            release: .25,
            threshold: -24
        }
          , Ct = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            gain: 1
        }
          , At = ()=>new DOMException("","InvalidStateError")
          , Dt = ()=>new DOMException("","InvalidAccessError")
          , Ot = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers"
        }
          , Mt = (t,e,s,n,i,o,r,a,c,h,u)=>{
            const l = h.length;
            let p = a;
            for (let a = 0; a < l; a += 1) {
                let l = s[0] * h[a];
                for (let e = 1; e < i; e += 1) {
                    const n = p - e & c - 1;
                    l += s[e] * o[n],
                    l -= t[e] * r[n]
                }
                for (let t = i; t < n; t += 1)
                    l += s[t] * o[p - t & c - 1];
                for (let s = i; s < e; s += 1)
                    l -= t[s] * r[p - s & c - 1];
                o[p] = h[a],
                r[p] = l,
                p = p + 1 & c - 1,
                u[a] = l
            }
            return p
        }
          , Et = {
            channelCount: 2,
            channelCountMode: "explicit",
            channelInterpretation: "speakers"
        }
          , Rt = t=>{
            const e = new Uint32Array([1179011410, 40, 1163280727, 544501094, 16, 131073, 44100, 176400, 1048580, 1635017060, 4, 0]);
            try {
                const s = t.decodeAudioData(e.buffer, ()=>{}
                );
                return void 0 !== s && (s.catch(()=>{}
                ),
                !0)
            } catch {}
            return !1
        }
          , qt = {
            numberOfChannels: 1
        }
          , Ft = (t,e,s)=>{
            const n = e[s];
            void 0 !== n && n !== t[s] && (t[s] = n)
        }
          , It = (t,e)=>{
            Ft(t, e, "channelCount"),
            Ft(t, e, "channelCountMode"),
            Ft(t, e, "channelInterpretation")
        }
          , Vt = t=>"function" == typeof t.getFloatTimeDomainData
          , Nt = (t,e,s)=>{
            const n = e[s];
            void 0 !== n && n !== t[s].value && (t[s].value = n)
        }
          , Pt = t=>{
            var e;
            t.start = (e = t.start,
            (s=0,n=0,i)=>{
                if ("number" == typeof i && i < 0 || n < 0 || s < 0)
                    throw new RangeError("The parameters can't be negative.");
                e.call(t, s, n, i)
            }
            )
        }
          , jt = t=>{
            var e;
            t.stop = (e = t.stop,
            (s=0)=>{
                if (s < 0)
                    throw new RangeError("The parameter can't be negative.");
                e.call(t, s)
            }
            )
        }
          , Lt = (t,e)=>null === t ? 512 : Math.max(512, Math.min(16384, Math.pow(2, Math.round(Math.log2(t * e)))))
          , zt = async(t,e)=>new t(await (t=>new Promise((e,s)=>{
            const {port1: n, port2: i} = new MessageChannel;
            n.onmessage = ({data: t})=>{
                n.close(),
                i.close(),
                e(t)
            }
            ,
            n.onmessageerror = ({data: t})=>{
                n.close(),
                i.close(),
                s(t)
            }
            ,
            i.postMessage(t)
        }
        ))(e))
          , Bt = (t,e)=>{
            const s = t.createBiquadFilter();
            return It(s, e),
            Nt(s, e, "Q"),
            Nt(s, e, "detune"),
            Nt(s, e, "frequency"),
            Nt(s, e, "gain"),
            Ft(s, e, "type"),
            s
        }
          , Wt = (t,e)=>{
            const s = t.createChannelSplitter(e.numberOfOutputs);
            return It(s, e),
            (t=>{
                const e = t.numberOfOutputs;
                Object.defineProperty(t, "channelCount", {
                    get: ()=>e,
                    set: t=>{
                        if (t !== e)
                            throw At()
                    }
                }),
                Object.defineProperty(t, "channelCountMode", {
                    get: ()=>"explicit",
                    set: t=>{
                        if ("explicit" !== t)
                            throw At()
                    }
                }),
                Object.defineProperty(t, "channelInterpretation", {
                    get: ()=>"discrete",
                    set: t=>{
                        if ("discrete" !== t)
                            throw At()
                    }
                })
            }
            )(s),
            s
        }
          , Gt = (t,e)=>(t.connect = e.connect.bind(e),
        t.disconnect = e.disconnect.bind(e),
        t)
          , Ut = (t,e)=>{
            const s = t.createDelay(e.maxDelayTime);
            return It(s, e),
            Nt(s, e, "delayTime"),
            s
        }
          , Qt = (t,e)=>{
            const s = t.createGain();
            return It(s, e),
            Nt(s, e, "gain"),
            s
        }
        ;
        function Zt(t, e) {
            const s = e[0] * e[0] + e[1] * e[1];
            return [(t[0] * e[0] + t[1] * e[1]) / s, (t[1] * e[0] - t[0] * e[1]) / s]
        }
        function Xt(t, e) {
            let s = [0, 0];
            for (let o = t.length - 1; o >= 0; o -= 1)
                i = e,
                s = [(n = s)[0] * i[0] - n[1] * i[1], n[0] * i[1] + n[1] * i[0]],
                s[0] += t[o];
            var n, i;
            return s
        }
        const Yt = (t,e,s,n)=>t.createScriptProcessor(e, s, n)
          , Ht = ()=>new DOMException("","NotSupportedError")
          , $t = {
            numberOfChannels: 1
        }
          , Jt = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            detune: 0,
            frequency: 440,
            periodicWave: void 0,
            type: "sine"
        }
          , Kt = {
            channelCount: 2,
            channelCountMode: "clamped-max",
            channelInterpretation: "speakers",
            coneInnerAngle: 360,
            coneOuterAngle: 360,
            coneOuterGain: 0,
            distanceModel: "inverse",
            maxDistance: 1e4,
            orientationX: 1,
            orientationY: 0,
            orientationZ: 0,
            panningModel: "equalpower",
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            refDistance: 1,
            rolloffFactor: 1
        }
          , te = {
            disableNormalization: !1
        }
          , ee = {
            channelCount: 2,
            channelCountMode: "explicit",
            channelInterpretation: "speakers",
            pan: 0
        }
          , se = ()=>new DOMException("","UnknownError")
          , ne = {
            channelCount: 2,
            channelCountMode: "max",
            channelInterpretation: "speakers",
            curve: null,
            oversample: "none"
        }
          , ie = t=>{
            if (null === t)
                return !1;
            const e = t.length;
            return e % 2 != 0 ? 0 !== t[Math.floor(e / 2)] : t[e / 2 - 1] + t[e / 2] !== 0
        }
          , oe = (t,e,s,n)=>{
            let i = Object.getPrototypeOf(t);
            for (; !i.hasOwnProperty(e); )
                i = Object.getPrototypeOf(i);
            const {get: o, set: r} = Object.getOwnPropertyDescriptor(i, e);
            Object.defineProperty(t, e, {
                get: s(o),
                set: n(r)
            })
        }
          , re = (t,e,s)=>{
            try {
                t.setValueAtTime(e, s)
            } catch (n) {
                if (9 !== n.code)
                    throw n;
                re(t, e, s + 1e-7)
            }
        }
          , ae = t=>{
            const e = t.createOscillator();
            try {
                e.start(-1)
            } catch (t) {
                return t instanceof RangeError
            }
            return !1
        }
          , ce = t=>{
            const e = t.createBuffer(1, 1, 44100)
              , s = t.createBufferSource();
            s.buffer = e,
            s.start(),
            s.stop();
            try {
                return s.stop(),
                !0
            } catch {
                return !1
            }
        }
          , he = t=>{
            const e = t.createOscillator();
            try {
                e.stop(-1)
            } catch (t) {
                return t instanceof RangeError
            }
            return !1
        }
          , ue = ()=>{
            try {
                new DOMException
            } catch {
                return !1
            }
            return !0
        }
          , le = ()=>new Promise(t=>{
            const e = new ArrayBuffer(0)
              , {port1: s, port2: n} = new MessageChannel;
            s.onmessage = ({data: e})=>t(null !== e),
            n.postMessage(e, [e])
        }
        )
          , pe = (t,e)=>{
            const s = e.createGain();
            t.connect(s);
            const n = (i = t.disconnect,
            ()=>{
                i.call(t, s),
                t.removeEventListener("ended", n)
            }
            );
            var i;
            t.addEventListener("ended", n),
            Gt(t, s),
            t.stop = (e=>{
                let n = !1;
                return (i=0)=>{
                    if (n)
                        try {
                            e.call(t, i)
                        } catch {
                            s.gain.setValueAtTime(0, i)
                        }
                    else
                        e.call(t, i),
                        n = !0
                }
            }
            )(t.stop)
        }
          , de = (t,e)=>s=>{
            const n = {
                value: t
            };
            return Object.defineProperties(s, {
                currentTarget: n,
                target: n
            }),
            "function" == typeof e ? e.call(t, s) : e.handleEvent.call(t, s)
        }
          , fe = (_e = Z,
        (t,e,[s,n,i],o)=>{
            _e(t[n], [e, s, i], t=>t[0] === e && t[1] === s, o)
        }
        );
        var _e;
        const me = (t=>(e,s,[n,i,o],r)=>{
            const a = e.get(n);
            void 0 === a ? e.set(n, new Set([[i, s, o]])) : t(a, [i, s, o], t=>t[0] === i && t[1] === s, r)
        }
        )(Z)
          , ge = (t=>(e,s,n,i)=>t(e[i], t=>t[0] === s && t[1] === n))(T)
          , ve = new WeakMap
          , ye = (t=>e=>{
            var s;
            return null !== (s = t.get(e)) && void 0 !== s ? s : 0
        }
        )(ve)
          , xe = (we = new Map,
        be = new WeakMap,
        (t,e)=>{
            const s = be.get(t);
            if (void 0 !== s)
                return s;
            const n = we.get(t);
            if (void 0 !== n)
                return n;
            try {
                const s = e();
                return s instanceof Promise ? (we.set(t, s),
                s.catch(()=>!1).then(e=>(we.delete(t),
                be.set(t, e),
                e))) : (be.set(t, s),
                s)
            } catch {
                return be.set(t, !1),
                !1
            }
        }
        );
        var we, be;
        const Te = "undefined" == typeof window ? null : window
          , Se = (ke = xe,
        Ce = q,
        (t,e)=>{
            const s = t.createAnalyser();
            if (It(s, e),
            !(e.maxDecibels > e.minDecibels))
                throw Ce();
            return Ft(s, e, "fftSize"),
            Ft(s, e, "maxDecibels"),
            Ft(s, e, "minDecibels"),
            Ft(s, e, "smoothingTimeConstant"),
            ke(Vt, ()=>Vt(s)) || (t=>{
                t.getFloatTimeDomainData = e=>{
                    const s = new Uint8Array(e.length);
                    t.getByteTimeDomainData(s);
                    const n = Math.max(s.length, t.fftSize);
                    for (let t = 0; t < n; t += 1)
                        e[t] = .0078125 * (s[t] - 128);
                    return e
                }
            }
            )(s),
            s
        }
        );
        var ke, Ce;
        const Ae = (De = L,
        t=>{
            const e = De(t);
            if (null === e.renderer)
                throw new Error("Missing the renderer of the given AudioNode in the audio graph.");
            return e.renderer
        }
        );
        var De;
        const Oe = ((t,e,s)=>async(n,i,o,r)=>{
            const a = t(n)
              , c = [...r, n];
            await Promise.all(a.activeInputs.map((t,r)=>Array.from(t).filter(([t])=>!c.includes(t)).map(async([t,a])=>{
                const h = e(t)
                  , u = await h.render(t, i, c)
                  , l = n.context.destination;
                s(t) || n === l && s(n) || u.connect(o, a, r)
            }
            )).reduce((t,e)=>[...t, ...e], []))
        }
        )(L, Ae, it)
          , Me = (Ee = Se,
        Re = st,
        qe = Oe,
        ()=>{
            const t = new WeakMap;
            return {
                render(e, s, n) {
                    const i = t.get(s);
                    return void 0 !== i ? Promise.resolve(i) : (async(e,s,n)=>{
                        let i = Re(e);
                        if (!E(i, s)) {
                            const t = {
                                channelCount: i.channelCount,
                                channelCountMode: i.channelCountMode,
                                channelInterpretation: i.channelInterpretation,
                                fftSize: i.fftSize,
                                maxDecibels: i.maxDecibels,
                                minDecibels: i.minDecibels,
                                smoothingTimeConstant: i.smoothingTimeConstant
                            };
                            i = Ee(s, t)
                        }
                        return t.set(s, i),
                        await qe(e, s, i, n),
                        i
                    }
                    )(e, s, n)
                }
            }
        }
        );
        var Ee, Re, qe;
        const Fe = (Ie = p,
        t=>{
            const e = Ie.get(t);
            if (void 0 === e)
                throw At();
            return e
        }
        );
        var Ie;
        const Ve = (t=>null === t ? null : t.hasOwnProperty("OfflineAudioContext") ? t.OfflineAudioContext : t.hasOwnProperty("webkitOfflineAudioContext") ? t.webkitOfflineAudioContext : null)(Te)
          , Ne = (Pe = Ve,
        t=>null !== Pe && t instanceof Pe);
        var Pe;
        const je = new WeakMap
          , Le = (ze = de,
        class {
            constructor(t) {
                this._nativeEventTarget = t,
                this._listeners = new WeakMap
            }
            addEventListener(t, e, s) {
                if (null !== e) {
                    let n = this._listeners.get(e);
                    void 0 === n && (n = ze(this, e),
                    "function" == typeof e && this._listeners.set(e, n)),
                    this._nativeEventTarget.addEventListener(t, n, s)
                }
            }
            dispatchEvent(t) {
                return this._nativeEventTarget.dispatchEvent(t)
            }
            removeEventListener(t, e, s) {
                const n = null === e ? void 0 : this._listeners.get(e);
                this._nativeEventTarget.removeEventListener(t, void 0 === n ? null : n, s)
            }
        }
        );
        var ze;
        const Be = (t=>null === t ? null : t.hasOwnProperty("AudioContext") ? t.AudioContext : t.hasOwnProperty("webkitAudioContext") ? t.webkitAudioContext : null)(Te)
          , We = (Ge = Be,
        t=>null !== Ge && t instanceof Ge);
        var Ge;
        const Ue = (t=>e=>null !== t && "function" == typeof t.AudioNode && e instanceof t.AudioNode)(Te)
          , Qe = (t=>e=>null !== t && "function" == typeof t.AudioParam && e instanceof t.AudioParam)(Te)
          , Ze = ((t,e,s,n,i,o,r,a,c,u,l,p,f,_,m)=>class extends u {
            constructor(e, n, i, o) {
                super(i),
                this._context = e,
                this._nativeAudioNode = i;
                const r = l(e);
                p(r) && !0 !== s(rt, ()=>rt(r)) && (t=>{
                    const e = new Map;
                    var s, n;
                    t.connect = (s = t.connect.bind(t),
                    (t,n=0,i=0)=>{
                        const o = ct(t) ? s(t, n, i) : s(t, n)
                          , r = e.get(t);
                        return void 0 === r ? e.set(t, [{
                            input: i,
                            output: n
                        }]) : r.every(t=>t.input !== i || t.output !== n) && r.push({
                            input: i,
                            output: n
                        }),
                        o
                    }
                    ),
                    t.disconnect = (n = t.disconnect,
                    (s,i,o)=>{
                        if (n.apply(t),
                        void 0 === s)
                            e.clear();
                        else if ("number" == typeof s)
                            for (const [t,n] of e) {
                                const i = n.filter(t=>t.output !== s);
                                0 === i.length ? e.delete(t) : e.set(t, i)
                            }
                        else if (e.has(s))
                            if (void 0 === i)
                                e.delete(s);
                            else {
                                const t = e.get(s);
                                if (void 0 !== t) {
                                    const n = t.filter(t=>t.output !== i && (t.input !== o || void 0 === o));
                                    0 === n.length ? e.delete(s) : e.set(s, n)
                                }
                            }
                        for (const [s,n] of e)
                            n.forEach(e=>{
                                ct(s) ? t.connect(s, e.output, e.input) : t.connect(s, e.output)
                            }
                            )
                    }
                    )
                }
                )(i),
                h.set(this, i),
                d.set(this, new Set),
                "closed" !== e.state && n && C(this),
                t(this, o, i)
            }
            get channelCount() {
                return this._nativeAudioNode.channelCount
            }
            set channelCount(t) {
                this._nativeAudioNode.channelCount = t
            }
            get channelCountMode() {
                return this._nativeAudioNode.channelCountMode
            }
            set channelCountMode(t) {
                this._nativeAudioNode.channelCountMode = t
            }
            get channelInterpretation() {
                return this._nativeAudioNode.channelInterpretation
            }
            set channelInterpretation(t) {
                this._nativeAudioNode.channelInterpretation = t
            }
            get context() {
                return this._context
            }
            get numberOfInputs() {
                return this._nativeAudioNode.numberOfInputs
            }
            get numberOfOutputs() {
                return this._nativeAudioNode.numberOfOutputs
            }
            connect(t, s=0, a=0) {
                if (s < 0 || s >= this._nativeAudioNode.numberOfOutputs)
                    throw i();
                const h = l(this._context)
                  , u = m(h);
                if (f(t) || _(t))
                    throw o();
                if (U(t)) {
                    const i = st(t);
                    try {
                        const e = $(this._nativeAudioNode, i, s, a)
                          , n = ot(this);
                        (u || n) && this._nativeAudioNode.disconnect(...e),
                        "closed" !== this.context.state && !n && ot(t) && C(t)
                    } catch (t) {
                        if (12 === t.code)
                            throw o();
                        throw t
                    }
                    if (e(this, t, s, a, u)) {
                        const e = c([this], t);
                        at(e, n(u))
                    }
                    return t
                }
                const p = nt(t);
                if ("playbackRate" === p.name)
                    throw r();
                try {
                    this._nativeAudioNode.connect(p, s),
                    (u || ot(this)) && this._nativeAudioNode.disconnect(p, s)
                } catch (t) {
                    if (12 === t.code)
                        throw o();
                    throw t
                }
                if (ht(this, t, s, u)) {
                    const e = c([this], t);
                    at(e, n(u))
                }
            }
            disconnect(t, e, s) {
                let n;
                const r = l(this._context)
                  , h = m(r);
                if (void 0 === t)
                    n = ((t,e)=>{
                        const s = L(t)
                          , n = [];
                        for (const i of s.outputs)
                            Q(i) ? ut(t, e, ...i) : lt(t, e, ...i),
                            n.push(i[0]);
                        return s.outputs.clear(),
                        n
                    }
                    )(this, h);
                else if ("number" == typeof t) {
                    if (t < 0 || t >= this.numberOfOutputs)
                        throw i();
                    n = ((t,e,s)=>{
                        const n = L(t)
                          , i = [];
                        for (const o of n.outputs)
                            o[1] === s && (Q(o) ? ut(t, e, ...o) : lt(t, e, ...o),
                            i.push(o[0]),
                            n.outputs.delete(o));
                        return i
                    }
                    )(this, h, t)
                } else {
                    if (void 0 !== e && (e < 0 || e >= this.numberOfOutputs))
                        throw i();
                    if (U(t) && void 0 !== s && (s < 0 || s >= t.numberOfInputs))
                        throw i();
                    if (n = ((t,e,s,n,i)=>{
                        const o = L(t);
                        return Array.from(o.outputs).filter(t=>!(t[0] !== s || void 0 !== n && t[1] !== n || void 0 !== i && t[2] !== i)).map(s=>(Q(s) ? ut(t, e, ...s) : lt(t, e, ...s),
                        o.outputs.delete(s),
                        s[0]))
                    }
                    )(this, h, t, e, s),
                    0 === n.length)
                        throw o()
                }
                for (const t of n) {
                    const e = c([this], t);
                    at(e, a)
                }
            }
        }
        )((Xe = c,
        (t,e,s)=>{
            const n = [];
            for (let t = 0; t < s.numberOfInputs; t += 1)
                n.push(new Set);
            Xe.set(t, {
                activeInputs: n,
                outputs: new Set,
                passiveInputs: new WeakMap,
                renderer: e
            })
        }
        ), ((t,e,s,n,i,o,r,a,c,h,u,l,p)=>(d,f,_,m,g)=>{
            const {activeInputs: v, passiveInputs: y} = o(f)
              , {outputs: x} = o(d)
              , w = a(d)
              , b = o=>{
                const a = c(f)
                  , h = c(d);
                if (o) {
                    const e = S(y, d, _, m);
                    t(v, d, e, !1),
                    g || l(d) || s(h, a, _, m),
                    p(f) && C(f)
                } else {
                    const t = n(v, d, _, m);
                    e(y, m, t, !1),
                    g || l(d) || i(h, a, _, m);
                    const s = r(f);
                    0 === s ? u(f) && O(f, v) : setTimeout(()=>{
                        u(f) && O(f, v)
                    }
                    , 1e3 * s)
                }
            }
            ;
            return !!h(x, [f, _, m], t=>t[0] === f && t[1] === _ && t[2] === m, !0) && (w.add(b),
            u(d) ? t(v, d, [_, m, b], !0) : e(y, m, [d, _, b], !0),
            !0)
        }
        )(fe, me, $, ge, et, L, ye, k, st, Z, P, it, ot), xe, ((t,e,s,n,i,o)=>r=>(a,c)=>{
            const h = t.get(a);
            if (void 0 === h) {
                if (!r && o(a)) {
                    const t = n(a)
                      , {outputs: o} = s(a);
                    for (const s of o)
                        if (Q(s)) {
                            const i = n(s[0]);
                            e(t, i, s[1], s[2])
                        } else {
                            const e = i(s[0]);
                            t.disconnect(e, s[1])
                        }
                }
                t.set(a, c)
            } else
                t.set(a, h + c)
        }
        )(f, et, L, st, nt, P), q, Dt, Ht, ((t,e,s,n,i,o,r,a)=>(c,h)=>{
            const u = e.get(c);
            if (void 0 === u)
                throw new Error("Missing the expected cycle count.");
            const l = o(c.context)
              , p = a(l);
            if (u === h) {
                if (e.delete(c),
                !p && r(c)) {
                    const e = n(c)
                      , {outputs: o} = s(c);
                    for (const s of o)
                        if (Q(s)) {
                            const i = n(s[0]);
                            t(e, i, s[1], s[2])
                        } else {
                            const t = i(s[0]);
                            e.connect(t, s[1])
                        }
                }
            } else
                e.set(c, u - h)
        }
        )($, f, L, st, nt, Fe, P, Ne), ((t,e,s)=>function n(i, o) {
            const r = U(o) ? o : s(t, o);
            if ((t=>"delayTime"in t)(r))
                return [];
            if (i[0] === r)
                return [i];
            if (i.includes(r))
                return [];
            const {outputs: a} = e(r);
            return Array.from(a).map(t=>n([...i, r], t[0])).reduce((t,e)=>t.concat(e), [])
        }
        )(je, L, b), Le, Fe, We, Ue, Qe, Ne);
        var Xe;
        const Ye = ((t,e,s,n,i,o)=>class extends t {
            constructor(t, s) {
                const r = i(t)
                  , a = {
                    ...M,
                    ...s
                }
                  , c = n(r, a);
                super(t, !1, c, o(r) ? e() : null),
                this._nativeAnalyserNode = c
            }
            get fftSize() {
                return this._nativeAnalyserNode.fftSize
            }
            set fftSize(t) {
                this._nativeAnalyserNode.fftSize = t
            }
            get frequencyBinCount() {
                return this._nativeAnalyserNode.frequencyBinCount
            }
            get maxDecibels() {
                return this._nativeAnalyserNode.maxDecibels
            }
            set maxDecibels(t) {
                const e = this._nativeAnalyserNode.maxDecibels;
                if (this._nativeAnalyserNode.maxDecibels = t,
                !(t > this._nativeAnalyserNode.minDecibels))
                    throw this._nativeAnalyserNode.maxDecibels = e,
                    s()
            }
            get minDecibels() {
                return this._nativeAnalyserNode.minDecibels
            }
            set minDecibels(t) {
                const e = this._nativeAnalyserNode.minDecibels;
                if (this._nativeAnalyserNode.minDecibels = t,
                !(this._nativeAnalyserNode.maxDecibels > t))
                    throw this._nativeAnalyserNode.minDecibels = e,
                    s()
            }
            get smoothingTimeConstant() {
                return this._nativeAnalyserNode.smoothingTimeConstant
            }
            set smoothingTimeConstant(t) {
                this._nativeAnalyserNode.smoothingTimeConstant = t
            }
            getByteFrequencyData(t) {
                this._nativeAnalyserNode.getByteFrequencyData(t)
            }
            getByteTimeDomainData(t) {
                this._nativeAnalyserNode.getByteTimeDomainData(t)
            }
            getFloatFrequencyData(t) {
                this._nativeAnalyserNode.getFloatFrequencyData(t)
            }
            getFloatTimeDomainData(t) {
                this._nativeAnalyserNode.getFloatTimeDomainData(t)
            }
        }
        )(Ze, Me, q, Se, Fe, Ne)
          , He = new WeakSet
          , $e = (t=>null === t ? null : t.hasOwnProperty("AudioBuffer") ? t.AudioBuffer : null)(Te)
          , Je = (Ke = new Uint32Array(1),
        t=>(Ke[0] = t,
        Ke[0]));
        var Ke;
        const ts = ((t,e)=>s=>{
            s.copyFromChannel = (n,i,o=0)=>{
                const r = t(o)
                  , a = t(i);
                if (a >= s.numberOfChannels)
                    throw e();
                const c = s.length
                  , h = s.getChannelData(a)
                  , u = n.length;
                for (let t = r < 0 ? -r : 0; t + r < c && t < u; t += 1)
                    n[t] = h[t + r]
            }
            ,
            s.copyToChannel = (n,i,o=0)=>{
                const r = t(o)
                  , a = t(i);
                if (a >= s.numberOfChannels)
                    throw e();
                const c = s.length
                  , h = s.getChannelData(a)
                  , u = n.length;
                for (let t = r < 0 ? -r : 0; t + r < c && t < u; t += 1)
                    h[t + r] = n[t]
            }
        }
        )(Je, q)
          , es = (t=>e=>{
            e.copyFromChannel = (s=>(n,i,o=0)=>{
                const r = t(o)
                  , a = t(i);
                if (r < e.length)
                    return s.call(e, n, a, r)
            }
            )(e.copyFromChannel),
            e.copyToChannel = (s=>(n,i,o=0)=>{
                const r = t(o)
                  , a = t(i);
                if (r < e.length)
                    return s.call(e, n, a, r)
            }
            )(e.copyToChannel)
        }
        )(Je)
          , ss = ((t,e,s,n,i,o,r,a)=>{
            let c = null;
            return class h {
                constructor(h) {
                    if (null === i)
                        throw new Error("Missing the native OfflineAudioContext constructor.");
                    const {length: u, numberOfChannels: l, sampleRate: p} = {
                        ...I,
                        ...h
                    };
                    null === c && (c = new i(1,1,44100));
                    const d = null !== n && e(o, o) ? new n({
                        length: u,
                        numberOfChannels: l,
                        sampleRate: p
                    }) : c.createBuffer(l, u, p);
                    if (0 === d.numberOfChannels)
                        throw s();
                    return "function" != typeof d.copyFromChannel ? (r(d),
                    F(d)) : e(R, ()=>R(d)) || a(d),
                    t.add(d),
                    d
                }
                static[Symbol.hasInstance](e) {
                    return null !== e && "object" == typeof e && Object.getPrototypeOf(e) === h.prototype || t.has(e)
                }
            }
        }
        )(He, xe, Ht, $e, Ve, (ns = $e,
        ()=>{
            if (null === ns)
                return !1;
            try {
                new ns({
                    length: 1,
                    sampleRate: 44100
                })
            } catch {
                return !1
            }
            return !0
        }
        ), ts, es);
        var ns;
        const is = (os = Qt,
        (t,e)=>{
            const s = os(t, {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "discrete",
                gain: 0
            });
            e.connect(s).connect(t.destination);
            const n = ()=>{
                e.removeEventListener("ended", n),
                e.disconnect(s),
                s.disconnect()
            }
            ;
            e.addEventListener("ended", n)
        }
        );
        var os;
        const rs = ((t,e,s)=>async(n,i,o,r)=>{
            const a = e(n);
            await Promise.all(Array.from(a.activeInputs).map(async([e,n])=>{
                const a = t(e)
                  , c = await a.render(e, i, r);
                s(e) || c.connect(o, n)
            }
            ))
        }
        )(Ae, z, it)
          , as = (t=>(e,s,n,i)=>t(s, e, n, i))(rs)
          , cs = ((t,e,s,n,i,o,r,a,c,h,u)=>(l,p)=>{
            const d = l.createBufferSource();
            return It(d, p),
            Nt(d, p, "playbackRate"),
            Ft(d, p, "buffer"),
            Ft(d, p, "loop"),
            Ft(d, p, "loopEnd"),
            Ft(d, p, "loopStart"),
            e(s, ()=>s(l)) || (t=>{
                t.start = (e=>{
                    let s = !1;
                    return (n=0,i=0,o)=>{
                        if (s)
                            throw At();
                        e.call(t, n, i, o),
                        s = !0
                    }
                }
                )(t.start)
            }
            )(d),
            e(n, ()=>n(l)) || c(d),
            e(i, ()=>i(l)) || h(d, l),
            e(o, ()=>o(l)) || Pt(d),
            e(r, ()=>r(l)) || u(d, l),
            e(a, ()=>a(l)) || jt(d),
            t(l, d),
            d
        }
        )(is, xe, t=>{
            const e = t.createBufferSource();
            e.start();
            try {
                e.start()
            } catch {
                return !0
            }
            return !1
        }
        , t=>{
            const e = t.createBufferSource()
              , s = t.createBuffer(1, 1, 44100);
            e.buffer = s;
            try {
                e.start(0, 1)
            } catch {
                return !1
            }
            return !0
        }
        , t=>{
            const e = t.createBufferSource();
            e.start();
            try {
                e.stop()
            } catch {
                return !1
            }
            return !0
        }
        , ae, ce, he, t=>{
            var e;
            t.start = (e = t.start,
            (s=0,n=0,i)=>{
                const o = t.buffer
                  , r = null === o ? n : Math.min(o.duration, n);
                null !== o && r > o.duration - .5 / t.context.sampleRate ? e.call(t, s, 0, 0) : e.call(t, s, r, i)
            }
            )
        }
        , (hs = oe,
        (t,e)=>{
            const s = e.createBuffer(1, 1, 44100);
            null === t.buffer && (t.buffer = s),
            hs(t, "buffer", e=>()=>{
                const n = e.call(t);
                return n === s ? null : n
            }
            , e=>n=>e.call(t, null === n ? s : n))
        }
        ), pe);
        var hs;
        const us = ((t,e)=>(s,n,i,o)=>(t(n).replay(i),
        e(n, s, i, o)))((t=>e=>{
            const s = t(e);
            if (null === s.renderer)
                throw new Error("Missing the renderer of the given AudioParam in the audio graph.");
            return s.renderer
        }
        )(z), rs)
          , ls = ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            let r = null
              , a = null;
            return {
                set start(t) {
                    r = t
                },
                set stop(t) {
                    a = t
                },
                render(c, h, u) {
                    const l = o.get(h);
                    return void 0 !== l ? Promise.resolve(l) : (async(c,h,u)=>{
                        let l = s(c);
                        const p = E(l, h);
                        if (!p) {
                            const t = {
                                buffer: l.buffer,
                                channelCount: l.channelCount,
                                channelCountMode: l.channelCountMode,
                                channelInterpretation: l.channelInterpretation,
                                loop: l.loop,
                                loopEnd: l.loopEnd,
                                loopStart: l.loopStart,
                                playbackRate: l.playbackRate.value
                            };
                            l = e(h, t),
                            null !== r && l.start(...r),
                            null !== a && l.stop(a)
                        }
                        return o.set(h, l),
                        p ? await t(h, c.playbackRate, l.playbackRate, u) : await n(h, c.playbackRate, l.playbackRate, u),
                        await i(c, h, l, u),
                        l
                    }
                    )(c, h, u)
                }
            }
        }
        )(as, cs, st, us, Oe)
          , ps = ((t,e,s,n,i,o,a,c,h,u,l,p,d)=>(f,_,m,g=null,v=null)=>{
            const y = new r.AutomationEventList(m.defaultValue)
              , x = _ ? n(y) : null
              , w = {
                get defaultValue() {
                    return m.defaultValue
                },
                get maxValue() {
                    return null === g ? m.maxValue : g
                },
                get minValue() {
                    return null === v ? m.minValue : v
                },
                get value() {
                    return m.value
                },
                set value(t) {
                    m.value = t,
                    w.setValueAtTime(t, f.context.currentTime)
                },
                cancelAndHoldAtTime(t) {
                    if ("function" == typeof m.cancelAndHoldAtTime)
                        null === x && y.flush(f.context.currentTime),
                        y.add(i(t)),
                        m.cancelAndHoldAtTime(t);
                    else {
                        const e = Array.from(y).pop();
                        null === x && y.flush(f.context.currentTime),
                        y.add(i(t));
                        const s = Array.from(y).pop();
                        m.cancelScheduledValues(t),
                        e !== s && void 0 !== s && ("exponentialRampToValue" === s.type ? m.exponentialRampToValueAtTime(s.value, s.endTime) : "linearRampToValue" === s.type ? m.linearRampToValueAtTime(s.value, s.endTime) : "setValue" === s.type ? m.setValueAtTime(s.value, s.startTime) : "setValueCurve" === s.type && m.setValueCurveAtTime(s.values, s.startTime, s.duration))
                    }
                    return w
                },
                cancelScheduledValues: t=>(null === x && y.flush(f.context.currentTime),
                y.add(o(t)),
                m.cancelScheduledValues(t),
                w),
                exponentialRampToValueAtTime(t, e) {
                    if (0 === t)
                        throw new RangeError;
                    if (!Number.isFinite(e) || e < 0)
                        throw new RangeError;
                    return null === x && y.flush(f.context.currentTime),
                    y.add(a(t, e)),
                    m.exponentialRampToValueAtTime(t, e),
                    w
                },
                linearRampToValueAtTime: (t,e)=>(null === x && y.flush(f.context.currentTime),
                y.add(c(t, e)),
                m.linearRampToValueAtTime(t, e),
                w),
                setTargetAtTime: (t,e,s)=>(null === x && y.flush(f.context.currentTime),
                y.add(h(t, e, s)),
                m.setTargetAtTime(t, e, s),
                w),
                setValueAtTime: (t,e)=>(null === x && y.flush(f.context.currentTime),
                y.add(u(t, e)),
                m.setValueAtTime(t, e),
                w),
                setValueCurveAtTime(t, e, s) {
                    const n = t instanceof Float32Array ? t : new Float32Array(t);
                    if (null !== p && "webkitAudioContext" === p.name) {
                        const t = e + s
                          , i = f.context.sampleRate
                          , o = Math.ceil(e * i)
                          , r = Math.floor(t * i)
                          , a = r - o
                          , c = new Float32Array(a);
                        for (let t = 0; t < a; t += 1) {
                            const r = (n.length - 1) / s * ((o + t) / i - e)
                              , a = Math.floor(r)
                              , h = Math.ceil(r);
                            c[t] = a === h ? n[a] : (1 - (r - a)) * n[a] + (1 - (h - r)) * n[h]
                        }
                        null === x && y.flush(f.context.currentTime),
                        y.add(l(c, e, s)),
                        m.setValueCurveAtTime(c, e, s);
                        const h = r / i;
                        h < t && d(w, c[c.length - 1], h),
                        d(w, n[n.length - 1], t)
                    } else
                        null === x && y.flush(f.context.currentTime),
                        y.add(l(n, e, s)),
                        m.setValueCurveAtTime(n, e, s);
                    return w
                }
            };
            return s.set(w, m),
            e.set(w, f),
            t(w, x),
            w
        }
        )((ds = u,
        (t,e)=>{
            ds.set(t, {
                activeInputs: new Set,
                passiveInputs: new WeakMap,
                renderer: e
            })
        }
        ), je, l, t=>({
            replay(e) {
                for (const s of t)
                    if ("exponentialRampToValue" === s.type) {
                        const {endTime: t, value: n} = s;
                        e.exponentialRampToValueAtTime(n, t)
                    } else if ("linearRampToValue" === s.type) {
                        const {endTime: t, value: n} = s;
                        e.linearRampToValueAtTime(n, t)
                    } else if ("setTarget" === s.type) {
                        const {startTime: t, target: n, timeConstant: i} = s;
                        e.setTargetAtTime(n, t, i)
                    } else if ("setValue" === s.type) {
                        const {startTime: t, value: n} = s;
                        e.setValueAtTime(n, t)
                    } else {
                        if ("setValueCurve" !== s.type)
                            throw new Error("Can't apply an unknown automation.");
                        {
                            const {duration: t, startTime: n, values: i} = s;
                            e.setValueCurveAtTime(i, n, t)
                        }
                    }
            }
        }), r.createCancelAndHoldAutomationEvent, r.createCancelScheduledValuesAutomationEvent, r.createExponentialRampToValueAutomationEvent, r.createLinearRampToValueAutomationEvent, r.createSetTargetAutomationEvent, r.createSetValueAutomationEvent, r.createSetValueCurveAutomationEvent, Be, re);
        var ds;
        const fs = ((t,e,s,n,i,o,r,a)=>class extends t {
            constructor(t, n) {
                const a = o(t)
                  , c = {
                    ...j,
                    ...n
                }
                  , h = i(a, c)
                  , u = r(a)
                  , l = u ? e() : null;
                super(t, !1, h, l),
                this._audioBufferSourceNodeRenderer = l,
                this._isBufferNullified = !1,
                this._isBufferSet = null !== c.buffer,
                this._nativeAudioBufferSourceNode = h,
                this._onended = null,
                this._playbackRate = s(this, u, h.playbackRate, N, V)
            }
            get buffer() {
                return this._isBufferNullified ? null : this._nativeAudioBufferSourceNode.buffer
            }
            set buffer(t) {
                if (this._nativeAudioBufferSourceNode.buffer = t,
                null !== t) {
                    if (this._isBufferSet)
                        throw n();
                    this._isBufferSet = !0
                }
            }
            get loop() {
                return this._nativeAudioBufferSourceNode.loop
            }
            set loop(t) {
                this._nativeAudioBufferSourceNode.loop = t
            }
            get loopEnd() {
                return this._nativeAudioBufferSourceNode.loopEnd
            }
            set loopEnd(t) {
                this._nativeAudioBufferSourceNode.loopEnd = t
            }
            get loopStart() {
                return this._nativeAudioBufferSourceNode.loopStart
            }
            set loopStart(t) {
                this._nativeAudioBufferSourceNode.loopStart = t
            }
            get onended() {
                return this._onended
            }
            set onended(t) {
                const e = "function" == typeof t ? a(this, t) : null;
                this._nativeAudioBufferSourceNode.onended = e;
                const s = this._nativeAudioBufferSourceNode.onended;
                this._onended = null !== s && s === e ? t : s
            }
            get playbackRate() {
                return this._playbackRate
            }
            start(t=0, e=0, s) {
                if (this._nativeAudioBufferSourceNode.start(t, e, s),
                null !== this._audioBufferSourceNodeRenderer && (this._audioBufferSourceNodeRenderer.start = void 0 === s ? [t, e] : [t, e, s]),
                "closed" !== this.context.state) {
                    C(this);
                    const t = ()=>{
                        this._nativeAudioBufferSourceNode.removeEventListener("ended", t),
                        P(this) && D(this)
                    }
                    ;
                    this._nativeAudioBufferSourceNode.addEventListener("ended", t)
                }
            }
            stop(t=0) {
                this._nativeAudioBufferSourceNode.stop(t),
                null !== this._audioBufferSourceNodeRenderer && (this._audioBufferSourceNodeRenderer.stop = t)
            }
        }
        )(Ze, ls, ps, At, cs, Fe, Ne, de)
          , _s = ((t,e,s,n,i,o,r,a)=>class extends t {
            constructor(t, s) {
                const n = o(t)
                  , c = r(n)
                  , h = i(n, s, c);
                super(t, !1, h, c ? e(a) : null),
                this._isNodeOfNativeOfflineAudioContext = c,
                this._nativeAudioDestinationNode = h
            }
            get channelCount() {
                return this._nativeAudioDestinationNode.channelCount
            }
            set channelCount(t) {
                if (this._isNodeOfNativeOfflineAudioContext)
                    throw n();
                if (t > this._nativeAudioDestinationNode.maxChannelCount)
                    throw s();
                this._nativeAudioDestinationNode.channelCount = t
            }
            get channelCountMode() {
                return this._nativeAudioDestinationNode.channelCountMode
            }
            set channelCountMode(t) {
                if (this._isNodeOfNativeOfflineAudioContext)
                    throw n();
                this._nativeAudioDestinationNode.channelCountMode = t
            }
            get maxChannelCount() {
                return this._nativeAudioDestinationNode.maxChannelCount
            }
        }
        )(Ze, t=>{
            let e = null;
            return {
                render: (s,n,i)=>(null === e && (e = (async(e,s,n)=>{
                    const i = s.destination;
                    return await t(e, s, i, n),
                    i
                }
                )(s, n, i)),
                e)
            }
        }
        , q, At, ((t,e)=>(s,n,i)=>{
            const o = s.destination;
            if (o.channelCount !== n)
                try {
                    o.channelCount = n
                } catch {}
            i && "explicit" !== o.channelCountMode && (o.channelCountMode = "explicit"),
            0 === o.maxChannelCount && Object.defineProperty(o, "maxChannelCount", {
                value: n
            });
            const r = t(s, {
                channelCount: n,
                channelCountMode: o.channelCountMode,
                channelInterpretation: o.channelInterpretation,
                gain: 1
            });
            return e(r, "channelCount", t=>()=>t.call(r), t=>e=>{
                t.call(r, e);
                try {
                    o.channelCount = e
                } catch (t) {
                    if (e > o.maxChannelCount)
                        throw t
                }
            }
            ),
            e(r, "channelCountMode", t=>()=>t.call(r), t=>e=>{
                t.call(r, e),
                o.channelCountMode = e
            }
            ),
            e(r, "channelInterpretation", t=>()=>t.call(r), t=>e=>{
                t.call(r, e),
                o.channelInterpretation = e
            }
            ),
            Object.defineProperty(r, "maxChannelCount", {
                get: ()=>o.maxChannelCount
            }),
            r.connect(o),
            r
        }
        )(Qt, oe), Fe, Ne, Oe)
          , ms = ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            return {
                render(r, a, c) {
                    const h = o.get(a);
                    return void 0 !== h ? Promise.resolve(h) : (async(r,a,c)=>{
                        let h = s(r);
                        const u = E(h, a);
                        if (!u) {
                            const t = {
                                Q: h.Q.value,
                                channelCount: h.channelCount,
                                channelCountMode: h.channelCountMode,
                                channelInterpretation: h.channelInterpretation,
                                detune: h.detune.value,
                                frequency: h.frequency.value,
                                gain: h.gain.value,
                                type: h.type
                            };
                            h = e(a, t)
                        }
                        return o.set(a, h),
                        u ? (await t(a, r.Q, h.Q, c),
                        await t(a, r.detune, h.detune, c),
                        await t(a, r.frequency, h.frequency, c),
                        await t(a, r.gain, h.gain, c)) : (await n(a, r.Q, h.Q, c),
                        await n(a, r.detune, h.detune, c),
                        await n(a, r.frequency, h.frequency, c),
                        await n(a, r.gain, h.gain, c)),
                        await i(r, a, h, c),
                        h
                    }
                    )(r, a, c)
                }
            }
        }
        )(as, Bt, st, us, Oe)
          , gs = (t=>(e,s)=>t.set(e, s))(ve)
          , vs = (ys = Ze,
        xs = ps,
        ws = ms,
        bs = Dt,
        Ts = Bt,
        Ss = Fe,
        ks = Ne,
        Cs = gs,
        class extends ys {
            constructor(t, e) {
                const s = Ss(t)
                  , n = {
                    ...vt,
                    ...e
                }
                  , i = Ts(s, n)
                  , o = ks(s);
                super(t, !1, i, o ? ws() : null),
                this._Q = xs(this, o, i.Q, N, V),
                this._detune = xs(this, o, i.detune, 1200 * Math.log2(N), -1200 * Math.log2(N)),
                this._frequency = xs(this, o, i.frequency, t.sampleRate / 2, 0),
                this._gain = xs(this, o, i.gain, 40 * Math.log10(N), V),
                this._nativeBiquadFilterNode = i,
                Cs(this, 1)
            }
            get detune() {
                return this._detune
            }
            get frequency() {
                return this._frequency
            }
            get gain() {
                return this._gain
            }
            get Q() {
                return this._Q
            }
            get type() {
                return this._nativeBiquadFilterNode.type
            }
            set type(t) {
                this._nativeBiquadFilterNode.type = t
            }
            getFrequencyResponse(t, e, s) {
                try {
                    this._nativeBiquadFilterNode.getFrequencyResponse(t, e, s)
                } catch (t) {
                    if (11 === t.code)
                        throw bs();
                    throw t
                }
                if (t.length !== e.length || e.length !== s.length)
                    throw bs()
            }
        }
        );
        var ys, xs, ws, bs, Ts, Ss, ks, Cs;
        const As = ((t,e)=>(s,n,i)=>{
            const o = new Set;
            var r, a;
            return s.connect = (r = s.connect,
            (i,a=0,c=0)=>{
                const h = 0 === o.size;
                if (e(i))
                    return r.call(s, i, a, c),
                    t(o, [i, a, c], t=>t[0] === i && t[1] === a && t[2] === c, !0),
                    h && n(),
                    i;
                r.call(s, i, a),
                t(o, [i, a], t=>t[0] === i && t[1] === a, !0),
                h && n()
            }
            ),
            s.disconnect = (a = s.disconnect,
            (t,n,r)=>{
                const c = o.size > 0;
                if (void 0 === t)
                    a.apply(s),
                    o.clear();
                else if ("number" == typeof t) {
                    a.call(s, t);
                    for (const e of o)
                        e[1] === t && o.delete(e)
                } else {
                    e(t) ? a.call(s, t, n, r) : a.call(s, t, n);
                    for (const e of o)
                        e[0] !== t || void 0 !== n && e[1] !== n || void 0 !== r && e[2] !== r || o.delete(e)
                }
                const h = 0 === o.size;
                c && h && i()
            }
            ),
            s
        }
        )(Z, Ue)
          , Ds = (Os = At,
        Ms = As,
        (t,e)=>{
            e.channelCount = 1,
            e.channelCountMode = "explicit",
            Object.defineProperty(e, "channelCount", {
                get: ()=>1,
                set: ()=>{
                    throw Os()
                }
            }),
            Object.defineProperty(e, "channelCountMode", {
                get: ()=>"explicit",
                set: ()=>{
                    throw Os()
                }
            });
            const s = t.createBufferSource();
            Ms(e, ()=>{
                const t = e.numberOfInputs;
                for (let n = 0; n < t; n += 1)
                    s.connect(e, 0, n)
            }
            , ()=>s.disconnect(e))
        }
        );
        var Os, Ms;
        const Es = ((t,e)=>(s,n)=>{
            const i = s.createChannelMerger(n.numberOfInputs);
            return null !== t && "webkitAudioContext" === t.name && e(s, i),
            It(i, n),
            i
        }
        )(Be, Ds)
          , Rs = ((t,e,s,n,i)=>class extends t {
            constructor(t, o) {
                const r = n(t)
                  , a = {
                    ...yt,
                    ...o
                };
                super(t, !1, s(r, a), i(r) ? e() : null)
            }
        }
        )(Ze, ((t,e,s)=>()=>{
            const n = new WeakMap;
            return {
                render(i, o, r) {
                    const a = n.get(o);
                    return void 0 !== a ? Promise.resolve(a) : (async(i,o,r)=>{
                        let a = e(i);
                        if (!E(a, o)) {
                            const e = {
                                channelCount: a.channelCount,
                                channelCountMode: a.channelCountMode,
                                channelInterpretation: a.channelInterpretation,
                                numberOfInputs: a.numberOfInputs
                            };
                            a = t(o, e)
                        }
                        return n.set(o, a),
                        await s(i, o, a, r),
                        a
                    }
                    )(i, o, r)
                }
            }
        }
        )(Es, st, Oe), Es, Fe, Ne)
          , qs = ((t,e,s,n,i,o)=>class extends t {
            constructor(t, r) {
                const a = n(t)
                  , c = o({
                    ...xt,
                    ...r
                });
                super(t, !1, s(a, c), i(a) ? e() : null)
            }
        }
        )(Ze, ((t,e,s)=>()=>{
            const n = new WeakMap;
            return {
                render(i, o, r) {
                    const a = n.get(o);
                    return void 0 !== a ? Promise.resolve(a) : (async(i,o,r)=>{
                        let a = e(i);
                        if (!E(a, o)) {
                            const e = {
                                channelCount: a.channelCount,
                                channelCountMode: a.channelCountMode,
                                channelInterpretation: a.channelInterpretation,
                                numberOfOutputs: a.numberOfOutputs
                            };
                            a = t(o, e)
                        }
                        return n.set(o, a),
                        await s(i, o, a, r),
                        a
                    }
                    )(i, o, r)
                }
            }
        }
        )(Wt, st, Oe), Wt, Fe, Ne, t=>({
            ...t,
            channelCount: t.numberOfOutputs
        }))
          , Fs = ((t,e,s,n)=>(i,{offset: o, ...r})=>{
            const a = i.createBuffer(1, 2, 44100)
              , c = e(i, {
                buffer: null,
                channelCount: 2,
                channelCountMode: "max",
                channelInterpretation: "speakers",
                loop: !1,
                loopEnd: 0,
                loopStart: 0,
                playbackRate: 1
            })
              , h = s(i, {
                ...r,
                gain: o
            })
              , u = a.getChannelData(0);
            u[0] = 1,
            u[1] = 1,
            c.buffer = a,
            c.loop = !0;
            const l = {
                get bufferSize() {},
                get channelCount() {
                    return h.channelCount
                },
                set channelCount(t) {
                    h.channelCount = t
                },
                get channelCountMode() {
                    return h.channelCountMode
                },
                set channelCountMode(t) {
                    h.channelCountMode = t
                },
                get channelInterpretation() {
                    return h.channelInterpretation
                },
                set channelInterpretation(t) {
                    h.channelInterpretation = t
                },
                get context() {
                    return h.context
                },
                get inputs() {
                    return []
                },
                get numberOfInputs() {
                    return c.numberOfInputs
                },
                get numberOfOutputs() {
                    return h.numberOfOutputs
                },
                get offset() {
                    return h.gain
                },
                get onended() {
                    return c.onended
                },
                set onended(t) {
                    c.onended = t
                },
                addEventListener: (...t)=>c.addEventListener(t[0], t[1], t[2]),
                dispatchEvent: (...t)=>c.dispatchEvent(t[0]),
                removeEventListener: (...t)=>c.removeEventListener(t[0], t[1], t[2]),
                start(t=0) {
                    c.start.call(c, t)
                },
                stop(t=0) {
                    c.stop.call(c, t)
                }
            };
            return t(i, c),
            n(Gt(l, h), ()=>c.connect(h), ()=>c.disconnect(h))
        }
        )(is, cs, Qt, As)
          , Is = ((t,e,s,n,i)=>(o,r)=>{
            if (void 0 === o.createConstantSource)
                return s(o, r);
            const a = o.createConstantSource();
            return It(a, r),
            Nt(a, r, "offset"),
            e(n, ()=>n(o)) || Pt(a),
            e(i, ()=>i(o)) || jt(a),
            t(o, a),
            a
        }
        )(is, xe, Fs, ae, he)
          , Vs = ((t,e,s,n,i,o,r)=>class extends t {
            constructor(t, r) {
                const a = i(t)
                  , c = {
                    ...wt,
                    ...r
                }
                  , h = n(a, c)
                  , u = o(a)
                  , l = u ? s() : null;
                super(t, !1, h, l),
                this._constantSourceNodeRenderer = l,
                this._nativeConstantSourceNode = h,
                this._offset = e(this, u, h.offset, N, V),
                this._onended = null
            }
            get offset() {
                return this._offset
            }
            get onended() {
                return this._onended
            }
            set onended(t) {
                const e = "function" == typeof t ? r(this, t) : null;
                this._nativeConstantSourceNode.onended = e;
                const s = this._nativeConstantSourceNode.onended;
                this._onended = null !== s && s === e ? t : s
            }
            start(t=0) {
                if (this._nativeConstantSourceNode.start(t),
                null !== this._constantSourceNodeRenderer && (this._constantSourceNodeRenderer.start = t),
                "closed" !== this.context.state) {
                    C(this);
                    const t = ()=>{
                        this._nativeConstantSourceNode.removeEventListener("ended", t),
                        P(this) && D(this)
                    }
                    ;
                    this._nativeConstantSourceNode.addEventListener("ended", t)
                }
            }
            stop(t=0) {
                this._nativeConstantSourceNode.stop(t),
                null !== this._constantSourceNodeRenderer && (this._constantSourceNodeRenderer.stop = t)
            }
        }
        )(Ze, ps, ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            let r = null
              , a = null;
            return {
                set start(t) {
                    r = t
                },
                set stop(t) {
                    a = t
                },
                render(c, h, u) {
                    const l = o.get(h);
                    return void 0 !== l ? Promise.resolve(l) : (async(c,h,u)=>{
                        let l = s(c);
                        const p = E(l, h);
                        if (!p) {
                            const t = {
                                channelCount: l.channelCount,
                                channelCountMode: l.channelCountMode,
                                channelInterpretation: l.channelInterpretation,
                                offset: l.offset.value
                            };
                            l = e(h, t),
                            null !== r && l.start(r),
                            null !== a && l.stop(a)
                        }
                        return o.set(h, l),
                        p ? await t(h, c.offset, l.offset, u) : await n(h, c.offset, l.offset, u),
                        await i(c, h, l, u),
                        l
                    }
                    )(c, h, u)
                }
            }
        }
        )(as, Is, st, us, Oe), Is, Fe, Ne, de)
          , Ns = ((t,e)=>(s,n)=>{
            const i = s.createConvolver();
            if (It(i, n),
            n.disableNormalization === i.normalize && (i.normalize = !n.disableNormalization),
            Ft(i, n, "buffer"),
            n.channelCount > 2)
                throw t();
            if (e(i, "channelCount", t=>()=>t.call(i), e=>s=>{
                if (s > 2)
                    throw t();
                return e.call(i, s)
            }
            ),
            "max" === n.channelCountMode)
                throw t();
            return e(i, "channelCountMode", t=>()=>t.call(i), e=>s=>{
                if ("max" === s)
                    throw t();
                return e.call(i, s)
            }
            ),
            i
        }
        )(Ht, oe)
          , Ps = ((t,e,s,n,i,o)=>class extends t {
            constructor(t, r) {
                const a = n(t)
                  , c = {
                    ...bt,
                    ...r
                }
                  , h = s(a, c);
                super(t, !1, h, i(a) ? e() : null),
                this._isBufferNullified = !1,
                this._nativeConvolverNode = h,
                null !== c.buffer && o(this, c.buffer.duration)
            }
            get buffer() {
                return this._isBufferNullified ? null : this._nativeConvolverNode.buffer
            }
            set buffer(t) {
                if (this._nativeConvolverNode.buffer = t,
                null === t && null !== this._nativeConvolverNode.buffer) {
                    const t = this._nativeConvolverNode.context;
                    this._nativeConvolverNode.buffer = t.createBuffer(1, 1, 44100),
                    this._isBufferNullified = !0,
                    o(this, 0)
                } else
                    this._isBufferNullified = !1,
                    o(this, null === this._nativeConvolverNode.buffer ? 0 : this._nativeConvolverNode.buffer.duration)
            }
            get normalize() {
                return this._nativeConvolverNode.normalize
            }
            set normalize(t) {
                this._nativeConvolverNode.normalize = t
            }
        }
        )(Ze, ((t,e,s)=>()=>{
            const n = new WeakMap;
            return {
                render(i, o, r) {
                    const a = n.get(o);
                    return void 0 !== a ? Promise.resolve(a) : (async(i,o,r)=>{
                        let a = e(i);
                        if (!E(a, o)) {
                            const e = {
                                buffer: a.buffer,
                                channelCount: a.channelCount,
                                channelCountMode: a.channelCountMode,
                                channelInterpretation: a.channelInterpretation,
                                disableNormalization: !a.normalize
                            };
                            a = t(o, e)
                        }
                        return n.set(o, a),
                        H(a) ? await s(i, o, a.inputs[0], r) : await s(i, o, a, r),
                        a
                    }
                    )(i, o, r)
                }
            }
        }
        )(Ns, st, Oe), Ns, Fe, Ne, gs)
          , js = ((t,e,s,n,i,o,r)=>class extends t {
            constructor(t, a) {
                const c = i(t)
                  , h = {
                    ...Tt,
                    ...a
                }
                  , u = n(c, h)
                  , l = o(c);
                super(t, !1, u, l ? s(h.maxDelayTime) : null),
                this._delayTime = e(this, l, u.delayTime),
                r(this, h.maxDelayTime)
            }
            get delayTime() {
                return this._delayTime
            }
        }
        )(Ze, ps, ((t,e,s,n,i)=>o=>{
            const r = new WeakMap;
            return {
                render(a, c, h) {
                    const u = r.get(c);
                    return void 0 !== u ? Promise.resolve(u) : (async(a,c,h)=>{
                        let u = s(a);
                        const l = E(u, c);
                        if (!l) {
                            const t = {
                                channelCount: u.channelCount,
                                channelCountMode: u.channelCountMode,
                                channelInterpretation: u.channelInterpretation,
                                delayTime: u.delayTime.value,
                                maxDelayTime: o
                            };
                            u = e(c, t)
                        }
                        return r.set(c, u),
                        l ? await t(c, a.delayTime, u.delayTime, h) : await n(c, a.delayTime, u.delayTime, h),
                        await i(a, c, u, h),
                        u
                    }
                    )(a, c, h)
                }
            }
        }
        )(as, Ut, st, us, Oe), Ut, Fe, Ne, gs)
          , Ls = (zs = Ht,
        (t,e)=>{
            const s = t.createDynamicsCompressor();
            if (It(s, e),
            e.channelCount > 2)
                throw zs();
            if ("max" === e.channelCountMode)
                throw zs();
            return Nt(s, e, "attack"),
            Nt(s, e, "knee"),
            Nt(s, e, "ratio"),
            Nt(s, e, "release"),
            Nt(s, e, "threshold"),
            s
        }
        );
        var zs;
        const Bs = ((t,e,s,n,i,o,r,a)=>class extends t {
            constructor(t, i) {
                const c = o(t)
                  , h = {
                    ...kt,
                    ...i
                }
                  , u = n(c, h)
                  , l = r(c);
                super(t, !1, u, l ? s() : null),
                this._attack = e(this, l, u.attack),
                this._knee = e(this, l, u.knee),
                this._nativeDynamicsCompressorNode = u,
                this._ratio = e(this, l, u.ratio),
                this._release = e(this, l, u.release),
                this._threshold = e(this, l, u.threshold),
                a(this, .006)
            }
            get attack() {
                return this._attack
            }
            get channelCount() {
                return this._nativeDynamicsCompressorNode.channelCount
            }
            set channelCount(t) {
                const e = this._nativeDynamicsCompressorNode.channelCount;
                if (this._nativeDynamicsCompressorNode.channelCount = t,
                t > 2)
                    throw this._nativeDynamicsCompressorNode.channelCount = e,
                    i()
            }
            get channelCountMode() {
                return this._nativeDynamicsCompressorNode.channelCountMode
            }
            set channelCountMode(t) {
                const e = this._nativeDynamicsCompressorNode.channelCountMode;
                if (this._nativeDynamicsCompressorNode.channelCountMode = t,
                "max" === t)
                    throw this._nativeDynamicsCompressorNode.channelCountMode = e,
                    i()
            }
            get knee() {
                return this._knee
            }
            get ratio() {
                return this._ratio
            }
            get reduction() {
                return "number" == typeof this._nativeDynamicsCompressorNode.reduction.value ? this._nativeDynamicsCompressorNode.reduction.value : this._nativeDynamicsCompressorNode.reduction
            }
            get release() {
                return this._release
            }
            get threshold() {
                return this._threshold
            }
        }
        )(Ze, ps, ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            return {
                render(r, a, c) {
                    const h = o.get(a);
                    return void 0 !== h ? Promise.resolve(h) : (async(r,a,c)=>{
                        let h = s(r);
                        const u = E(h, a);
                        if (!u) {
                            const t = {
                                attack: h.attack.value,
                                channelCount: h.channelCount,
                                channelCountMode: h.channelCountMode,
                                channelInterpretation: h.channelInterpretation,
                                knee: h.knee.value,
                                ratio: h.ratio.value,
                                release: h.release.value,
                                threshold: h.threshold.value
                            };
                            h = e(a, t)
                        }
                        return o.set(a, h),
                        u ? (await t(a, r.attack, h.attack, c),
                        await t(a, r.knee, h.knee, c),
                        await t(a, r.ratio, h.ratio, c),
                        await t(a, r.release, h.release, c),
                        await t(a, r.threshold, h.threshold, c)) : (await n(a, r.attack, h.attack, c),
                        await n(a, r.knee, h.knee, c),
                        await n(a, r.ratio, h.ratio, c),
                        await n(a, r.release, h.release, c),
                        await n(a, r.threshold, h.threshold, c)),
                        await i(r, a, h, c),
                        h
                    }
                    )(r, a, c)
                }
            }
        }
        )(as, Ls, st, us, Oe), Ls, Ht, Fe, Ne, gs)
          , Ws = ((t,e,s,n,i,o)=>class extends t {
            constructor(t, r) {
                const a = i(t)
                  , c = {
                    ...Ct,
                    ...r
                }
                  , h = n(a, c)
                  , u = o(a);
                super(t, !1, h, u ? s() : null),
                this._gain = e(this, u, h.gain, N, V)
            }
            get gain() {
                return this._gain
            }
        }
        )(Ze, ps, ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            return {
                render(r, a, c) {
                    const h = o.get(a);
                    return void 0 !== h ? Promise.resolve(h) : (async(r,a,c)=>{
                        let h = s(r);
                        const u = E(h, a);
                        if (!u) {
                            const t = {
                                channelCount: h.channelCount,
                                channelCountMode: h.channelCountMode,
                                channelInterpretation: h.channelInterpretation,
                                gain: h.gain.value
                            };
                            h = e(a, t)
                        }
                        return o.set(a, h),
                        u ? await t(a, r.gain, h.gain, c) : await n(a, r.gain, h.gain, c),
                        await i(r, a, h, c),
                        h
                    }
                    )(r, a, c)
                }
            }
        }
        )(as, Qt, st, us, Oe), Qt, Fe, Ne)
          , Gs = ((t,e,s,n)=>(i,o,{channelCount: r, channelCountMode: a, channelInterpretation: c, feedback: h, feedforward: u})=>{
            const l = Lt(o, i.sampleRate)
              , p = h instanceof Float64Array ? h : new Float64Array(h)
              , d = u instanceof Float64Array ? u : new Float64Array(u)
              , f = p.length
              , _ = d.length
              , m = Math.min(f, _);
            if (0 === f || f > 20)
                throw n();
            if (0 === p[0])
                throw e();
            if (0 === _ || _ > 20)
                throw n();
            if (0 === d[0])
                throw e();
            if (1 !== p[0]) {
                for (let t = 0; t < _; t += 1)
                    d[t] /= p[0];
                for (let t = 1; t < f; t += 1)
                    p[t] /= p[0]
            }
            const g = s(i, l, r, r);
            g.channelCount = r,
            g.channelCountMode = a,
            g.channelInterpretation = c;
            const v = []
              , y = []
              , x = [];
            for (let t = 0; t < r; t += 1) {
                v.push(0);
                const t = new Float32Array(32)
                  , e = new Float32Array(32);
                t.fill(0),
                e.fill(0),
                y.push(t),
                x.push(e)
            }
            g.onaudioprocess = t=>{
                const e = t.inputBuffer
                  , s = t.outputBuffer
                  , n = e.numberOfChannels;
                for (let t = 0; t < n; t += 1) {
                    const n = e.getChannelData(t)
                      , i = s.getChannelData(t);
                    v[t] = Mt(p, f, d, _, m, y[t], x[t], v[t], 32, n, i)
                }
            }
            ;
            const w = i.sampleRate / 2;
            return Gt({
                get bufferSize() {
                    return l
                },
                get channelCount() {
                    return g.channelCount
                },
                set channelCount(t) {
                    g.channelCount = t
                },
                get channelCountMode() {
                    return g.channelCountMode
                },
                set channelCountMode(t) {
                    g.channelCountMode = t
                },
                get channelInterpretation() {
                    return g.channelInterpretation
                },
                set channelInterpretation(t) {
                    g.channelInterpretation = t
                },
                get context() {
                    return g.context
                },
                get inputs() {
                    return [g]
                },
                get numberOfInputs() {
                    return g.numberOfInputs
                },
                get numberOfOutputs() {
                    return g.numberOfOutputs
                },
                addEventListener: (...t)=>g.addEventListener(t[0], t[1], t[2]),
                dispatchEvent: (...t)=>g.dispatchEvent(t[0]),
                getFrequencyResponse(e, s, n) {
                    if (e.length !== s.length || s.length !== n.length)
                        throw t();
                    const i = e.length;
                    for (let t = 0; t < i; t += 1) {
                        const i = -Math.PI * (e[t] / w)
                          , o = [Math.cos(i), Math.sin(i)]
                          , r = Zt(Xt(d, o), Xt(p, o));
                        s[t] = Math.sqrt(r[0] * r[0] + r[1] * r[1]),
                        n[t] = Math.atan2(r[1], r[0])
                    }
                },
                removeEventListener: (...t)=>g.removeEventListener(t[0], t[1], t[2])
            }, g)
        }
        )(Dt, At, Yt, Ht)
          , Us = ((t,e,s,n)=>i=>t(Rt, ()=>Rt(i)) ? Promise.resolve(t(n, n)).then(t=>{
            if (!t) {
                const t = s(i, 512, 0, 1);
                i.oncomplete = ()=>{
                    t.onaudioprocess = null,
                    t.disconnect()
                }
                ,
                t.onaudioprocess = ()=>i.currentTime,
                t.connect(i.destination)
            }
            return i.startRendering()
        }
        ) : new Promise(t=>{
            const s = e(i, {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "discrete",
                gain: 0
            });
            i.oncomplete = e=>{
                s.disconnect(),
                t(e.renderedBuffer)
            }
            ,
            s.connect(i.destination),
            i.startRendering()
        }
        ))(xe, Qt, Yt, ((t,e)=>()=>{
            if (null === e)
                return Promise.resolve(!1);
            const s = new e(1,1,44100)
              , n = t(s, {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "discrete",
                gain: 0
            });
            return new Promise(t=>{
                s.oncomplete = ()=>{
                    n.disconnect(),
                    t(0 !== s.currentTime)
                }
                ,
                s.startRendering()
            }
            )
        }
        )(Qt, Ve))
          , Qs = ((t,e,s,n,i)=>(o,r)=>{
            const a = new WeakMap;
            let c = null;
            const h = async(h,u,l)=>{
                let p = null
                  , d = e(h);
                const f = E(d, u);
                if (void 0 === u.createIIRFilter ? p = t(u, {
                    buffer: null,
                    channelCount: 2,
                    channelCountMode: "max",
                    channelInterpretation: "speakers",
                    loop: !1,
                    loopEnd: 0,
                    loopStart: 0,
                    playbackRate: 1
                }) : f || (d = u.createIIRFilter(r, o)),
                a.set(u, null === p ? d : p),
                null !== p) {
                    if (null === c) {
                        if (null === s)
                            throw new Error("Missing the native OfflineAudioContext constructor.");
                        const t = new s(h.context.destination.channelCount,h.context.length,u.sampleRate);
                        c = (async()=>{
                            await n(h, t, t.destination, l);
                            return ((t,e,s,n)=>{
                                const i = s instanceof Float64Array ? s : new Float64Array(s)
                                  , o = n instanceof Float64Array ? n : new Float64Array(n)
                                  , r = i.length
                                  , a = o.length
                                  , c = Math.min(r, a);
                                if (1 !== i[0]) {
                                    for (let t = 0; t < r; t += 1)
                                        o[t] /= i[0];
                                    for (let t = 1; t < a; t += 1)
                                        i[t] /= i[0]
                                }
                                const h = new Float32Array(32)
                                  , u = new Float32Array(32)
                                  , l = e.createBuffer(t.numberOfChannels, t.length, t.sampleRate)
                                  , p = t.numberOfChannels;
                                for (let e = 0; e < p; e += 1) {
                                    const s = t.getChannelData(e)
                                      , n = l.getChannelData(e);
                                    h.fill(0),
                                    u.fill(0),
                                    Mt(i, r, o, a, c, h, u, 0, 32, s, n)
                                }
                                return l
                            }
                            )(await i(t), u, o, r)
                        }
                        )()
                    }
                    const t = await c;
                    return p.buffer = t,
                    p.start(0),
                    p
                }
                return await n(h, u, d, l),
                d
            }
            ;
            return {
                render(t, e, s) {
                    const n = a.get(e);
                    return void 0 !== n ? Promise.resolve(n) : h(t, e, s)
                }
            }
        }
        )(cs, st, Ve, Oe, Us);
        var Zs;
        const Xs = ((t,e,s,n,i,o)=>class extends t {
            constructor(t, r) {
                const a = n(t)
                  , c = i(a)
                  , h = {
                    ...Ot,
                    ...r
                }
                  , u = e(a, c ? null : t.baseLatency, h);
                super(t, !1, u, c ? s(h.feedback, h.feedforward) : null),
                (t=>{
                    var e;
                    t.getFrequencyResponse = (e = t.getFrequencyResponse,
                    (s,n,i)=>{
                        if (s.length !== n.length || n.length !== i.length)
                            throw Dt();
                        return e.call(t, s, n, i)
                    }
                    )
                }
                )(u),
                this._nativeIIRFilterNode = u,
                o(this, 1)
            }
            getFrequencyResponse(t, e, s) {
                return this._nativeIIRFilterNode.getFrequencyResponse(t, e, s)
            }
        }
        )(Ze, (Zs = Gs,
        (t,e,s)=>{
            if (void 0 === t.createIIRFilter)
                return Zs(t, e, s);
            const n = t.createIIRFilter(s.feedforward, s.feedback);
            return It(n, s),
            n
        }
        ), Qs, Fe, Ne, gs)
          , Ys = ((t,e,s,n,i)=>(o,r)=>{
            const a = r.listener
              , {forwardX: c, forwardY: h, forwardZ: u, positionX: l, positionY: p, positionZ: d, upX: f, upY: _, upZ: m} = void 0 === a.forwardX ? (()=>{
                const c = e(r, {
                    channelCount: 1,
                    channelCountMode: "explicit",
                    channelInterpretation: "speakers",
                    numberOfInputs: 9
                })
                  , h = i(r)
                  , u = n(r, 256, 9, 0)
                  , l = (e,n)=>{
                    const i = s(r, {
                        channelCount: 1,
                        channelCountMode: "explicit",
                        channelInterpretation: "discrete",
                        offset: n
                    });
                    return i.connect(c, 0, e),
                    i.start(),
                    Object.defineProperty(i.offset, "defaultValue", {
                        get: ()=>n
                    }),
                    t({
                        context: o
                    }, h, i.offset, N, V)
                }
                ;
                let p = [0, 0, -1, 0, 1, 0]
                  , d = [0, 0, 0];
                return u.onaudioprocess = ({inputBuffer: t})=>{
                    const e = [t.getChannelData(0)[0], t.getChannelData(1)[0], t.getChannelData(2)[0], t.getChannelData(3)[0], t.getChannelData(4)[0], t.getChannelData(5)[0]];
                    e.some((t,e)=>t !== p[e]) && (a.setOrientation(...e),
                    p = e);
                    const s = [t.getChannelData(6)[0], t.getChannelData(7)[0], t.getChannelData(8)[0]];
                    s.some((t,e)=>t !== d[e]) && (a.setPosition(...s),
                    d = s)
                }
                ,
                c.connect(u),
                {
                    forwardX: l(0, 0),
                    forwardY: l(1, 0),
                    forwardZ: l(2, -1),
                    positionX: l(6, 0),
                    positionY: l(7, 0),
                    positionZ: l(8, 0),
                    upX: l(3, 0),
                    upY: l(4, 1),
                    upZ: l(5, 0)
                }
            }
            )() : a;
            return {
                get forwardX() {
                    return c
                },
                get forwardY() {
                    return h
                },
                get forwardZ() {
                    return u
                },
                get positionX() {
                    return l
                },
                get positionY() {
                    return p
                },
                get positionZ() {
                    return d
                },
                get upX() {
                    return f
                },
                get upY() {
                    return _
                },
                get upZ() {
                    return m
                }
            }
        }
        )(ps, Es, Is, Yt, Ne)
          , Hs = new WeakMap
          , $s = ((t,e,s,n,i,o)=>class extends s {
            constructor(s, o) {
                super(s),
                this._nativeContext = s,
                p.set(this, s),
                n(s) && i.set(s, new Set),
                this._destination = new t(this,o),
                this._listener = e(this, s),
                this._onstatechange = null
            }
            get currentTime() {
                return this._nativeContext.currentTime
            }
            get destination() {
                return this._destination
            }
            get listener() {
                return this._listener
            }
            get onstatechange() {
                return this._onstatechange
            }
            set onstatechange(t) {
                const e = "function" == typeof t ? o(this, t) : null;
                this._nativeContext.onstatechange = e;
                const s = this._nativeContext.onstatechange;
                this._onstatechange = null !== s && s === e ? t : s
            }
            get sampleRate() {
                return this._nativeContext.sampleRate
            }
            get state() {
                return this._nativeContext.state
            }
        }
        )(_s, Ys, Le, Ne, Hs, de)
          , Js = ((t,e,s,n,i,o)=>(r,a)=>{
            const c = r.createOscillator();
            return It(c, a),
            Nt(c, a, "detune"),
            Nt(c, a, "frequency"),
            void 0 !== a.periodicWave ? c.setPeriodicWave(a.periodicWave) : Ft(c, a, "type"),
            e(s, ()=>s(r)) || Pt(c),
            e(n, ()=>n(r)) || o(c, r),
            e(i, ()=>i(r)) || jt(c),
            t(r, c),
            c
        }
        )(is, xe, ae, ce, he, pe)
          , Ks = ((t,e,s,n,i,o,r)=>class extends t {
            constructor(t, r) {
                const a = i(t)
                  , c = {
                    ...Jt,
                    ...r
                }
                  , h = s(a, c)
                  , u = o(a)
                  , l = u ? n() : null
                  , p = t.sampleRate / 2;
                super(t, !1, h, l),
                this._detune = e(this, u, h.detune, 153600, -153600),
                this._frequency = e(this, u, h.frequency, p, -p),
                this._nativeOscillatorNode = h,
                this._onended = null,
                this._oscillatorNodeRenderer = l,
                null !== this._oscillatorNodeRenderer && void 0 !== c.periodicWave && (this._oscillatorNodeRenderer.periodicWave = c.periodicWave)
            }
            get detune() {
                return this._detune
            }
            get frequency() {
                return this._frequency
            }
            get onended() {
                return this._onended
            }
            set onended(t) {
                const e = "function" == typeof t ? r(this, t) : null;
                this._nativeOscillatorNode.onended = e;
                const s = this._nativeOscillatorNode.onended;
                this._onended = null !== s && s === e ? t : s
            }
            get type() {
                return this._nativeOscillatorNode.type
            }
            set type(t) {
                this._nativeOscillatorNode.type = t,
                null !== this._oscillatorNodeRenderer && (this._oscillatorNodeRenderer.periodicWave = null)
            }
            setPeriodicWave(t) {
                this._nativeOscillatorNode.setPeriodicWave(t),
                null !== this._oscillatorNodeRenderer && (this._oscillatorNodeRenderer.periodicWave = t)
            }
            start(t=0) {
                if (this._nativeOscillatorNode.start(t),
                null !== this._oscillatorNodeRenderer && (this._oscillatorNodeRenderer.start = t),
                "closed" !== this.context.state) {
                    C(this);
                    const t = ()=>{
                        this._nativeOscillatorNode.removeEventListener("ended", t),
                        P(this) && D(this)
                    }
                    ;
                    this._nativeOscillatorNode.addEventListener("ended", t)
                }
            }
            stop(t=0) {
                this._nativeOscillatorNode.stop(t),
                null !== this._oscillatorNodeRenderer && (this._oscillatorNodeRenderer.stop = t)
            }
        }
        )(Ze, ps, Js, ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            let r = null
              , a = null
              , c = null;
            return {
                set periodicWave(t) {
                    r = t
                },
                set start(t) {
                    a = t
                },
                set stop(t) {
                    c = t
                },
                render(h, u, l) {
                    const p = o.get(u);
                    return void 0 !== p ? Promise.resolve(p) : (async(h,u,l)=>{
                        let p = s(h);
                        const d = E(p, u);
                        if (!d) {
                            const t = {
                                channelCount: p.channelCount,
                                channelCountMode: p.channelCountMode,
                                channelInterpretation: p.channelInterpretation,
                                detune: p.detune.value,
                                frequency: p.frequency.value,
                                periodicWave: null === r ? void 0 : r,
                                type: p.type
                            };
                            p = e(u, t),
                            null !== a && p.start(a),
                            null !== c && p.stop(c)
                        }
                        return o.set(u, p),
                        d ? (await t(u, h.detune, p.detune, l),
                        await t(u, h.frequency, p.frequency, l)) : (await n(u, h.detune, p.detune, l),
                        await n(u, h.frequency, p.frequency, l)),
                        await i(h, u, p, l),
                        p
                    }
                    )(h, u, l)
                }
            }
        }
        )(as, Js, st, us, Oe), Fe, Ne, de)
          , tn = (en = cs,
        (t,e)=>{
            const s = en(t, {
                buffer: null,
                channelCount: 2,
                channelCountMode: "max",
                channelInterpretation: "speakers",
                loop: !1,
                loopEnd: 0,
                loopStart: 0,
                playbackRate: 1
            })
              , n = t.createBuffer(1, 2, 44100);
            return s.buffer = n,
            s.loop = !0,
            s.connect(e),
            s.start(),
            ()=>{
                s.stop(),
                s.disconnect(e)
            }
        }
        );
        var en;
        const sn = ((t,e,s,n,i)=>(o,{curve: r, oversample: a, ...c})=>{
            const h = o.createWaveShaper()
              , u = o.createWaveShaper();
            It(h, c),
            It(u, c);
            const l = s(o, {
                ...c,
                gain: 1
            })
              , p = s(o, {
                ...c,
                gain: -1
            })
              , d = s(o, {
                ...c,
                gain: 1
            })
              , f = s(o, {
                ...c,
                gain: -1
            });
            let _ = null
              , m = !1
              , g = null;
            const v = {
                get bufferSize() {},
                get channelCount() {
                    return h.channelCount
                },
                set channelCount(t) {
                    l.channelCount = t,
                    p.channelCount = t,
                    h.channelCount = t,
                    d.channelCount = t,
                    u.channelCount = t,
                    f.channelCount = t
                },
                get channelCountMode() {
                    return h.channelCountMode
                },
                set channelCountMode(t) {
                    l.channelCountMode = t,
                    p.channelCountMode = t,
                    h.channelCountMode = t,
                    d.channelCountMode = t,
                    u.channelCountMode = t,
                    f.channelCountMode = t
                },
                get channelInterpretation() {
                    return h.channelInterpretation
                },
                set channelInterpretation(t) {
                    l.channelInterpretation = t,
                    p.channelInterpretation = t,
                    h.channelInterpretation = t,
                    d.channelInterpretation = t,
                    u.channelInterpretation = t,
                    f.channelInterpretation = t
                },
                get context() {
                    return h.context
                },
                get curve() {
                    return g
                },
                set curve(s) {
                    if (null !== s && s.length < 2)
                        throw e();
                    if (null === s)
                        h.curve = s,
                        u.curve = s;
                    else {
                        const t = s.length
                          , e = new Float32Array(t + 2 - t % 2)
                          , n = new Float32Array(t + 2 - t % 2);
                        e[0] = s[0],
                        n[0] = -s[t - 1];
                        const i = Math.ceil((t + 1) / 2)
                          , o = (t + 1) / 2 - 1;
                        for (let r = 1; r < i; r += 1) {
                            const a = r / i * o
                              , c = Math.floor(a)
                              , h = Math.ceil(a);
                            e[r] = c === h ? s[c] : (1 - (a - c)) * s[c] + (1 - (h - a)) * s[h],
                            n[r] = c === h ? -s[t - 1 - c] : -(1 - (a - c)) * s[t - 1 - c] - (1 - (h - a)) * s[t - 1 - h]
                        }
                        e[i] = t % 2 == 1 ? s[i - 1] : (s[i - 2] + s[i - 1]) / 2,
                        h.curve = e,
                        u.curve = n
                    }
                    g = s,
                    m && (n(g) && null === _ ? _ = t(o, l) : null !== _ && (_(),
                    _ = null))
                },
                get inputs() {
                    return [l]
                },
                get numberOfInputs() {
                    return h.numberOfInputs
                },
                get numberOfOutputs() {
                    return h.numberOfOutputs
                },
                get oversample() {
                    return h.oversample
                },
                set oversample(t) {
                    h.oversample = t,
                    u.oversample = t
                },
                addEventListener: (...t)=>l.addEventListener(t[0], t[1], t[2]),
                dispatchEvent: (...t)=>l.dispatchEvent(t[0]),
                removeEventListener: (...t)=>l.removeEventListener(t[0], t[1], t[2])
            };
            null !== r && (v.curve = r instanceof Float32Array ? r : new Float32Array(r)),
            a !== v.oversample && (v.oversample = a);
            return i(Gt(v, d), ()=>{
                l.connect(h).connect(d),
                l.connect(p).connect(u).connect(f).connect(d),
                m = !0,
                n(g) && (_ = t(o, l))
            }
            , ()=>{
                l.disconnect(h),
                h.disconnect(d),
                l.disconnect(p),
                p.disconnect(u),
                u.disconnect(f),
                f.disconnect(d),
                m = !1,
                null !== _ && (_(),
                _ = null)
            }
            )
        }
        )(tn, At, Qt, ie, As)
          , nn = ((t,e,s,n,i,o,r)=>(a,c)=>{
            const h = a.createWaveShaper();
            if (null !== o && "webkitAudioContext" === o.name && void 0 === a.createGain().gain.automationRate)
                return s(a, c);
            It(h, c);
            const u = null === c.curve || c.curve instanceof Float32Array ? c.curve : new Float32Array(c.curve);
            if (null !== u && u.length < 2)
                throw e();
            Ft(h, {
                curve: u
            }, "curve"),
            Ft(h, c, "oversample");
            let l = null
              , p = !1;
            r(h, "curve", t=>()=>t.call(h), e=>s=>(e.call(h, s),
            p && (n(s) && null === l ? l = t(a, h) : n(s) || null === l || (l(),
            l = null)),
            s));
            return i(h, ()=>{
                p = !0,
                n(h.curve) && (l = t(a, h))
            }
            , ()=>{
                p = !1,
                null !== l && (l(),
                l = null)
            }
            )
        }
        )(tn, At, sn, ie, As, Be, oe)
          , on = ((t,e,s,n,i,o,r,a,c)=>(h,{coneInnerAngle: u, coneOuterAngle: l, coneOuterGain: p, distanceModel: d, maxDistance: f, orientationX: _, orientationY: m, orientationZ: g, panningModel: v, positionX: y, positionY: x, positionZ: w, refDistance: b, rolloffFactor: T, ...S})=>{
            const k = h.createPanner();
            if (S.channelCount > 2)
                throw r();
            if ("max" === S.channelCountMode)
                throw r();
            It(k, S);
            const C = {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "discrete"
            }
              , A = s(h, {
                ...C,
                channelInterpretation: "speakers",
                numberOfInputs: 6
            })
              , D = n(h, {
                ...S,
                gain: 1
            })
              , O = n(h, {
                ...C,
                gain: 1
            })
              , M = n(h, {
                ...C,
                gain: 0
            })
              , E = n(h, {
                ...C,
                gain: 0
            })
              , R = n(h, {
                ...C,
                gain: 0
            })
              , q = n(h, {
                ...C,
                gain: 0
            })
              , F = n(h, {
                ...C,
                gain: 0
            })
              , I = i(h, 256, 6, 1)
              , V = o(h, {
                ...C,
                curve: new Float32Array([1, 1]),
                oversample: "none"
            });
            let N = [_, m, g]
              , P = [y, x, w];
            I.onaudioprocess = ({inputBuffer: t})=>{
                const e = [t.getChannelData(0)[0], t.getChannelData(1)[0], t.getChannelData(2)[0]];
                e.some((t,e)=>t !== N[e]) && (k.setOrientation(...e),
                N = e);
                const s = [t.getChannelData(3)[0], t.getChannelData(4)[0], t.getChannelData(5)[0]];
                s.some((t,e)=>t !== P[e]) && (k.setPosition(...s),
                P = s)
            }
            ,
            Object.defineProperty(M.gain, "defaultValue", {
                get: ()=>0
            }),
            Object.defineProperty(E.gain, "defaultValue", {
                get: ()=>0
            }),
            Object.defineProperty(R.gain, "defaultValue", {
                get: ()=>0
            }),
            Object.defineProperty(q.gain, "defaultValue", {
                get: ()=>0
            }),
            Object.defineProperty(F.gain, "defaultValue", {
                get: ()=>0
            });
            const j = {
                get bufferSize() {},
                get channelCount() {
                    return k.channelCount
                },
                set channelCount(t) {
                    if (t > 2)
                        throw r();
                    D.channelCount = t,
                    k.channelCount = t
                },
                get channelCountMode() {
                    return k.channelCountMode
                },
                set channelCountMode(t) {
                    if ("max" === t)
                        throw r();
                    D.channelCountMode = t,
                    k.channelCountMode = t
                },
                get channelInterpretation() {
                    return k.channelInterpretation
                },
                set channelInterpretation(t) {
                    D.channelInterpretation = t,
                    k.channelInterpretation = t
                },
                get coneInnerAngle() {
                    return k.coneInnerAngle
                },
                set coneInnerAngle(t) {
                    k.coneInnerAngle = t
                },
                get coneOuterAngle() {
                    return k.coneOuterAngle
                },
                set coneOuterAngle(t) {
                    k.coneOuterAngle = t
                },
                get coneOuterGain() {
                    return k.coneOuterGain
                },
                set coneOuterGain(t) {
                    if (t < 0 || t > 1)
                        throw e();
                    k.coneOuterGain = t
                },
                get context() {
                    return k.context
                },
                get distanceModel() {
                    return k.distanceModel
                },
                set distanceModel(t) {
                    k.distanceModel = t
                },
                get inputs() {
                    return [D]
                },
                get maxDistance() {
                    return k.maxDistance
                },
                set maxDistance(t) {
                    if (t < 0)
                        throw new RangeError;
                    k.maxDistance = t
                },
                get numberOfInputs() {
                    return k.numberOfInputs
                },
                get numberOfOutputs() {
                    return k.numberOfOutputs
                },
                get orientationX() {
                    return O.gain
                },
                get orientationY() {
                    return M.gain
                },
                get orientationZ() {
                    return E.gain
                },
                get panningModel() {
                    return k.panningModel
                },
                set panningModel(t) {
                    k.panningModel = t
                },
                get positionX() {
                    return R.gain
                },
                get positionY() {
                    return q.gain
                },
                get positionZ() {
                    return F.gain
                },
                get refDistance() {
                    return k.refDistance
                },
                set refDistance(t) {
                    if (t < 0)
                        throw new RangeError;
                    k.refDistance = t
                },
                get rolloffFactor() {
                    return k.rolloffFactor
                },
                set rolloffFactor(t) {
                    if (t < 0)
                        throw new RangeError;
                    k.rolloffFactor = t
                },
                addEventListener: (...t)=>D.addEventListener(t[0], t[1], t[2]),
                dispatchEvent: (...t)=>D.dispatchEvent(t[0]),
                removeEventListener: (...t)=>D.removeEventListener(t[0], t[1], t[2])
            };
            u !== j.coneInnerAngle && (j.coneInnerAngle = u),
            l !== j.coneOuterAngle && (j.coneOuterAngle = l),
            p !== j.coneOuterGain && (j.coneOuterGain = p),
            d !== j.distanceModel && (j.distanceModel = d),
            f !== j.maxDistance && (j.maxDistance = f),
            _ !== j.orientationX.value && (j.orientationX.value = _),
            m !== j.orientationY.value && (j.orientationY.value = m),
            g !== j.orientationZ.value && (j.orientationZ.value = g),
            v !== j.panningModel && (j.panningModel = v),
            y !== j.positionX.value && (j.positionX.value = y),
            x !== j.positionY.value && (j.positionY.value = x),
            w !== j.positionZ.value && (j.positionZ.value = w),
            b !== j.refDistance && (j.refDistance = b),
            T !== j.rolloffFactor && (j.rolloffFactor = T),
            1 === N[0] && 0 === N[1] && 0 === N[2] || k.setOrientation(...N),
            0 === P[0] && 0 === P[1] && 0 === P[2] || k.setPosition(...P);
            return c(Gt(j, k), ()=>{
                D.connect(k),
                t(D, V, 0, 0),
                V.connect(O).connect(A, 0, 0),
                V.connect(M).connect(A, 0, 1),
                V.connect(E).connect(A, 0, 2),
                V.connect(R).connect(A, 0, 3),
                V.connect(q).connect(A, 0, 4),
                V.connect(F).connect(A, 0, 5),
                A.connect(I).connect(h.destination)
            }
            , ()=>{
                D.disconnect(k),
                a(D, V, 0, 0),
                V.disconnect(O),
                O.disconnect(A),
                V.disconnect(M),
                M.disconnect(A),
                V.disconnect(E),
                E.disconnect(A),
                V.disconnect(R),
                R.disconnect(A),
                V.disconnect(q),
                q.disconnect(A),
                V.disconnect(F),
                F.disconnect(A),
                A.disconnect(I),
                I.disconnect(h.destination)
            }
            )
        }
        )($, At, Es, Qt, Yt, nn, Ht, et, As)
          , rn = (an = on,
        (t,e)=>{
            const s = t.createPanner();
            return void 0 === s.orientationX ? an(t, e) : (It(s, e),
            Nt(s, e, "orientationX"),
            Nt(s, e, "orientationY"),
            Nt(s, e, "orientationZ"),
            Nt(s, e, "positionX"),
            Nt(s, e, "positionY"),
            Nt(s, e, "positionZ"),
            Ft(s, e, "coneInnerAngle"),
            Ft(s, e, "coneOuterAngle"),
            Ft(s, e, "coneOuterGain"),
            Ft(s, e, "distanceModel"),
            Ft(s, e, "maxDistance"),
            Ft(s, e, "panningModel"),
            Ft(s, e, "refDistance"),
            Ft(s, e, "rolloffFactor"),
            s)
        }
        );
        var an;
        const cn = ((t,e,s,n,i,o,r)=>class extends t {
            constructor(t, a) {
                const c = i(t)
                  , h = {
                    ...Kt,
                    ...a
                }
                  , u = s(c, h)
                  , l = o(c);
                super(t, !1, u, l ? n() : null),
                this._nativePannerNode = u,
                this._orientationX = e(this, l, u.orientationX, N, V),
                this._orientationY = e(this, l, u.orientationY, N, V),
                this._orientationZ = e(this, l, u.orientationZ, N, V),
                this._positionX = e(this, l, u.positionX, N, V),
                this._positionY = e(this, l, u.positionY, N, V),
                this._positionZ = e(this, l, u.positionZ, N, V),
                r(this, 1)
            }
            get coneInnerAngle() {
                return this._nativePannerNode.coneInnerAngle
            }
            set coneInnerAngle(t) {
                this._nativePannerNode.coneInnerAngle = t
            }
            get coneOuterAngle() {
                return this._nativePannerNode.coneOuterAngle
            }
            set coneOuterAngle(t) {
                this._nativePannerNode.coneOuterAngle = t
            }
            get coneOuterGain() {
                return this._nativePannerNode.coneOuterGain
            }
            set coneOuterGain(t) {
                this._nativePannerNode.coneOuterGain = t
            }
            get distanceModel() {
                return this._nativePannerNode.distanceModel
            }
            set distanceModel(t) {
                this._nativePannerNode.distanceModel = t
            }
            get maxDistance() {
                return this._nativePannerNode.maxDistance
            }
            set maxDistance(t) {
                this._nativePannerNode.maxDistance = t
            }
            get orientationX() {
                return this._orientationX
            }
            get orientationY() {
                return this._orientationY
            }
            get orientationZ() {
                return this._orientationZ
            }
            get panningModel() {
                return this._nativePannerNode.panningModel
            }
            set panningModel(t) {
                this._nativePannerNode.panningModel = t
            }
            get positionX() {
                return this._positionX
            }
            get positionY() {
                return this._positionY
            }
            get positionZ() {
                return this._positionZ
            }
            get refDistance() {
                return this._nativePannerNode.refDistance
            }
            set refDistance(t) {
                this._nativePannerNode.refDistance = t
            }
            get rolloffFactor() {
                return this._nativePannerNode.rolloffFactor
            }
            set rolloffFactor(t) {
                this._nativePannerNode.rolloffFactor = t
            }
        }
        )(Ze, ps, rn, ((t,e,s,n,i,o,r,a,c,h)=>()=>{
            const u = new WeakMap;
            let l = null;
            return {
                render(p, d, f) {
                    const _ = u.get(d);
                    return void 0 !== _ ? Promise.resolve(_) : (async(p,d,f)=>{
                        let _ = null
                          , m = o(p);
                        const g = {
                            channelCount: m.channelCount,
                            channelCountMode: m.channelCountMode,
                            channelInterpretation: m.channelInterpretation
                        }
                          , v = {
                            ...g,
                            coneInnerAngle: m.coneInnerAngle,
                            coneOuterAngle: m.coneOuterAngle,
                            coneOuterGain: m.coneOuterGain,
                            distanceModel: m.distanceModel,
                            maxDistance: m.maxDistance,
                            panningModel: m.panningModel,
                            refDistance: m.refDistance,
                            rolloffFactor: m.rolloffFactor
                        }
                          , y = E(m, d);
                        if ("bufferSize"in m)
                            _ = n(d, {
                                ...g,
                                gain: 1
                            });
                        else if (!y) {
                            const t = {
                                ...v,
                                orientationX: m.orientationX.value,
                                orientationY: m.orientationY.value,
                                orientationZ: m.orientationZ.value,
                                positionX: m.positionX.value,
                                positionY: m.positionY.value,
                                positionZ: m.positionZ.value
                            };
                            m = i(d, t)
                        }
                        if (u.set(d, null === _ ? m : _),
                        null !== _) {
                            if (null === l) {
                                if (null === r)
                                    throw new Error("Missing the native OfflineAudioContext constructor.");
                                const t = new r(6,p.context.length,d.sampleRate)
                                  , n = e(t, {
                                    channelCount: 1,
                                    channelCountMode: "explicit",
                                    channelInterpretation: "speakers",
                                    numberOfInputs: 6
                                });
                                n.connect(t.destination),
                                l = (async()=>{
                                    const e = await Promise.all([p.orientationX, p.orientationY, p.orientationZ, p.positionX, p.positionY, p.positionZ].map(async(e,n)=>{
                                        const i = s(t, {
                                            channelCount: 1,
                                            channelCountMode: "explicit",
                                            channelInterpretation: "discrete",
                                            offset: 0 === n ? 1 : 0
                                        });
                                        return await a(t, e, i.offset, f),
                                        i
                                    }
                                    ));
                                    for (let t = 0; t < 6; t += 1)
                                        e[t].connect(n, 0, t),
                                        e[t].start(0);
                                    return h(t)
                                }
                                )()
                            }
                            const t = await l
                              , o = n(d, {
                                ...g,
                                gain: 1
                            });
                            await c(p, d, o, f);
                            const u = [];
                            for (let e = 0; e < t.numberOfChannels; e += 1)
                                u.push(t.getChannelData(e));
                            let m = [u[0][0], u[1][0], u[2][0]]
                              , y = [u[3][0], u[4][0], u[5][0]]
                              , x = n(d, {
                                ...g,
                                gain: 1
                            })
                              , w = i(d, {
                                ...v,
                                orientationX: m[0],
                                orientationY: m[1],
                                orientationZ: m[2],
                                positionX: y[0],
                                positionY: y[1],
                                positionZ: y[2]
                            });
                            o.connect(x).connect(w.inputs[0]),
                            w.connect(_);
                            for (let e = 128; e < t.length; e += 128) {
                                const t = [u[0][e], u[1][e], u[2][e]]
                                  , s = [u[3][e], u[4][e], u[5][e]];
                                if (t.some((t,e)=>t !== m[e]) || s.some((t,e)=>t !== y[e])) {
                                    m = t,
                                    y = s;
                                    const r = e / d.sampleRate;
                                    x.gain.setValueAtTime(0, r),
                                    x = n(d, {
                                        ...g,
                                        gain: 0
                                    }),
                                    w = i(d, {
                                        ...v,
                                        orientationX: m[0],
                                        orientationY: m[1],
                                        orientationZ: m[2],
                                        positionX: y[0],
                                        positionY: y[1],
                                        positionZ: y[2]
                                    }),
                                    x.gain.setValueAtTime(1, r),
                                    o.connect(x).connect(w.inputs[0]),
                                    w.connect(_)
                                }
                            }
                            return _
                        }
                        return y ? (await t(d, p.orientationX, m.orientationX, f),
                        await t(d, p.orientationY, m.orientationY, f),
                        await t(d, p.orientationZ, m.orientationZ, f),
                        await t(d, p.positionX, m.positionX, f),
                        await t(d, p.positionY, m.positionY, f),
                        await t(d, p.positionZ, m.positionZ, f)) : (await a(d, p.orientationX, m.orientationX, f),
                        await a(d, p.orientationY, m.orientationY, f),
                        await a(d, p.orientationZ, m.orientationZ, f),
                        await a(d, p.positionX, m.positionX, f),
                        await a(d, p.positionY, m.positionY, f),
                        await a(d, p.positionZ, m.positionZ, f)),
                        H(m) ? await c(p, d, m.inputs[0], f) : await c(p, d, m, f),
                        m
                    }
                    )(p, d, f)
                }
            }
        }
        )(as, Es, Is, Qt, rn, st, Ve, us, Oe, Us), Fe, Ne, gs)
          , hn = ((t,e,s,n)=>class i {
            constructor(i, o) {
                const r = e(i)
                  , a = n({
                    ...te,
                    ...o
                })
                  , c = t(r, a);
                return s.add(c),
                c
            }
            static[Symbol.hasInstance](t) {
                return null !== t && "object" == typeof t && Object.getPrototypeOf(t) === i.prototype || s.has(t)
            }
        }
        )((t=>(e,{disableNormalization: s, imag: n, real: i})=>{
            const o = n instanceof Float32Array ? n : new Float32Array(n)
              , r = i instanceof Float32Array ? i : new Float32Array(i)
              , a = e.createPeriodicWave(r, o, {
                disableNormalization: s
            });
            if (Array.from(n).length < 2)
                throw t();
            return a
        }
        )(q), Fe, new WeakSet, t=>{
            const {imag: e, real: s} = t;
            return void 0 === e ? void 0 === s ? {
                ...t,
                imag: [0, 0],
                real: [0, 0]
            } : {
                ...t,
                imag: Array.from(s, ()=>0),
                real: s
            } : void 0 === s ? {
                ...t,
                imag: e,
                real: Array.from(e, ()=>0)
            } : {
                ...t,
                imag: e,
                real: s
            }
        }
        )
          , un = ((t,e)=>(s,n)=>{
            const i = n.channelCountMode;
            if ("clamped-max" === i)
                throw e();
            if (void 0 === s.createStereoPanner)
                return t(s, n);
            const o = s.createStereoPanner();
            return It(o, n),
            Nt(o, n, "pan"),
            Object.defineProperty(o, "channelCountMode", {
                get: ()=>i,
                set: t=>{
                    if (t !== i)
                        throw e()
                }
            }),
            o
        }
        )(((t,e,s,n,i,o)=>{
            const r = new Float32Array([1, 1])
              , a = Math.PI / 2
              , c = {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "discrete"
            }
              , h = {
                ...c,
                oversample: "none"
            }
              , u = (t,o,u,l,p)=>{
                if (1 === o)
                    return ((t,e,i,o)=>{
                        const u = new Float32Array(16385)
                          , l = new Float32Array(16385);
                        for (let t = 0; t < 16385; t += 1) {
                            const e = t / 16384 * a;
                            u[t] = Math.cos(e),
                            l[t] = Math.sin(e)
                        }
                        const p = s(t, {
                            ...c,
                            gain: 0
                        })
                          , d = n(t, {
                            ...h,
                            curve: u
                        })
                          , f = n(t, {
                            ...h,
                            curve: r
                        })
                          , _ = s(t, {
                            ...c,
                            gain: 0
                        })
                          , m = n(t, {
                            ...h,
                            curve: l
                        });
                        return {
                            connectGraph() {
                                e.connect(p),
                                e.connect(void 0 === f.inputs ? f : f.inputs[0]),
                                e.connect(_),
                                f.connect(i),
                                i.connect(void 0 === d.inputs ? d : d.inputs[0]),
                                i.connect(void 0 === m.inputs ? m : m.inputs[0]),
                                d.connect(p.gain),
                                m.connect(_.gain),
                                p.connect(o, 0, 0),
                                _.connect(o, 0, 1)
                            },
                            disconnectGraph() {
                                e.disconnect(p),
                                e.disconnect(void 0 === f.inputs ? f : f.inputs[0]),
                                e.disconnect(_),
                                f.disconnect(i),
                                i.disconnect(void 0 === d.inputs ? d : d.inputs[0]),
                                i.disconnect(void 0 === m.inputs ? m : m.inputs[0]),
                                d.disconnect(p.gain),
                                m.disconnect(_.gain),
                                p.disconnect(o, 0, 0),
                                _.disconnect(o, 0, 1)
                            }
                        }
                    }
                    )(t, u, l, p);
                if (2 === o)
                    return ((t,i,o,u)=>{
                        const l = new Float32Array(16385)
                          , p = new Float32Array(16385)
                          , d = new Float32Array(16385)
                          , f = new Float32Array(16385)
                          , _ = Math.floor(8192.5);
                        for (let t = 0; t < 16385; t += 1)
                            if (t > _) {
                                const e = (t - _) / (16384 - _) * a;
                                l[t] = Math.cos(e),
                                p[t] = Math.sin(e),
                                d[t] = 0,
                                f[t] = 1
                            } else {
                                const e = t / (16384 - _) * a;
                                l[t] = 1,
                                p[t] = 0,
                                d[t] = Math.cos(e),
                                f[t] = Math.sin(e)
                            }
                        const m = e(t, {
                            channelCount: 2,
                            channelCountMode: "explicit",
                            channelInterpretation: "discrete",
                            numberOfOutputs: 2
                        })
                          , g = s(t, {
                            ...c,
                            gain: 0
                        })
                          , v = n(t, {
                            ...h,
                            curve: l
                        })
                          , y = s(t, {
                            ...c,
                            gain: 0
                        })
                          , x = n(t, {
                            ...h,
                            curve: p
                        })
                          , w = n(t, {
                            ...h,
                            curve: r
                        })
                          , b = s(t, {
                            ...c,
                            gain: 0
                        })
                          , T = n(t, {
                            ...h,
                            curve: d
                        })
                          , S = s(t, {
                            ...c,
                            gain: 0
                        })
                          , k = n(t, {
                            ...h,
                            curve: f
                        });
                        return {
                            connectGraph() {
                                i.connect(m),
                                i.connect(void 0 === w.inputs ? w : w.inputs[0]),
                                m.connect(g, 0),
                                m.connect(y, 0),
                                m.connect(b, 1),
                                m.connect(S, 1),
                                w.connect(o),
                                o.connect(void 0 === v.inputs ? v : v.inputs[0]),
                                o.connect(void 0 === x.inputs ? x : x.inputs[0]),
                                o.connect(void 0 === T.inputs ? T : T.inputs[0]),
                                o.connect(void 0 === k.inputs ? k : k.inputs[0]),
                                v.connect(g.gain),
                                x.connect(y.gain),
                                T.connect(b.gain),
                                k.connect(S.gain),
                                g.connect(u, 0, 0),
                                b.connect(u, 0, 0),
                                y.connect(u, 0, 1),
                                S.connect(u, 0, 1)
                            },
                            disconnectGraph() {
                                i.disconnect(m),
                                i.disconnect(void 0 === w.inputs ? w : w.inputs[0]),
                                m.disconnect(g, 0),
                                m.disconnect(y, 0),
                                m.disconnect(b, 1),
                                m.disconnect(S, 1),
                                w.disconnect(o),
                                o.disconnect(void 0 === v.inputs ? v : v.inputs[0]),
                                o.disconnect(void 0 === x.inputs ? x : x.inputs[0]),
                                o.disconnect(void 0 === T.inputs ? T : T.inputs[0]),
                                o.disconnect(void 0 === k.inputs ? k : k.inputs[0]),
                                v.disconnect(g.gain),
                                x.disconnect(y.gain),
                                T.disconnect(b.gain),
                                k.disconnect(S.gain),
                                g.disconnect(u, 0, 0),
                                b.disconnect(u, 0, 0),
                                y.disconnect(u, 0, 1),
                                S.disconnect(u, 0, 1)
                            }
                        }
                    }
                    )(t, u, l, p);
                throw i()
            }
            ;
            return (e,{channelCount: n, channelCountMode: r, pan: a, ...c})=>{
                if ("max" === r)
                    throw i();
                const h = t(e, {
                    ...c,
                    channelCount: 1,
                    channelCountMode: r,
                    numberOfInputs: 2
                })
                  , l = s(e, {
                    ...c,
                    channelCount: n,
                    channelCountMode: r,
                    gain: 1
                })
                  , p = s(e, {
                    channelCount: 1,
                    channelCountMode: "explicit",
                    channelInterpretation: "discrete",
                    gain: a
                });
                let {connectGraph: d, disconnectGraph: f} = u(e, n, l, p, h);
                Object.defineProperty(p.gain, "defaultValue", {
                    get: ()=>0
                }),
                Object.defineProperty(p.gain, "maxValue", {
                    get: ()=>1
                }),
                Object.defineProperty(p.gain, "minValue", {
                    get: ()=>-1
                });
                const _ = {
                    get bufferSize() {},
                    get channelCount() {
                        return l.channelCount
                    },
                    set channelCount(t) {
                        l.channelCount !== t && (m && f(),
                        ({connectGraph: d, disconnectGraph: f} = u(e, t, l, p, h)),
                        m && d()),
                        l.channelCount = t
                    },
                    get channelCountMode() {
                        return l.channelCountMode
                    },
                    set channelCountMode(t) {
                        if ("clamped-max" === t || "max" === t)
                            throw i();
                        l.channelCountMode = t
                    },
                    get channelInterpretation() {
                        return l.channelInterpretation
                    },
                    set channelInterpretation(t) {
                        l.channelInterpretation = t
                    },
                    get context() {
                        return l.context
                    },
                    get inputs() {
                        return [l]
                    },
                    get numberOfInputs() {
                        return l.numberOfInputs
                    },
                    get numberOfOutputs() {
                        return l.numberOfOutputs
                    },
                    get pan() {
                        return p.gain
                    },
                    addEventListener: (...t)=>l.addEventListener(t[0], t[1], t[2]),
                    dispatchEvent: (...t)=>l.dispatchEvent(t[0]),
                    removeEventListener: (...t)=>l.removeEventListener(t[0], t[1], t[2])
                };
                let m = !1;
                return o(Gt(_, h), ()=>{
                    d(),
                    m = !0
                }
                , ()=>{
                    f(),
                    m = !1
                }
                )
            }
        }
        )(Es, Wt, Qt, nn, Ht, As), Ht)
          , ln = ((t,e,s,n,i,o)=>class extends t {
            constructor(t, r) {
                const a = i(t)
                  , c = {
                    ...ee,
                    ...r
                }
                  , h = s(a, c)
                  , u = o(a);
                super(t, !1, h, u ? n() : null),
                this._pan = e(this, u, h.pan)
            }
            get pan() {
                return this._pan
            }
        }
        )(Ze, ps, un, ((t,e,s,n,i)=>()=>{
            const o = new WeakMap;
            return {
                render(r, a, c) {
                    const h = o.get(a);
                    return void 0 !== h ? Promise.resolve(h) : (async(r,a,c)=>{
                        let h = s(r);
                        const u = E(h, a);
                        if (!u) {
                            const t = {
                                channelCount: h.channelCount,
                                channelCountMode: h.channelCountMode,
                                channelInterpretation: h.channelInterpretation,
                                pan: h.pan.value
                            };
                            h = e(a, t)
                        }
                        return o.set(a, h),
                        u ? await t(a, r.pan, h.pan, c) : await n(a, r.pan, h.pan, c),
                        H(h) ? await i(r, a, h.inputs[0], c) : await i(r, a, h, c),
                        h
                    }
                    )(r, a, c)
                }
            }
        }
        )(as, un, st, us, Oe), Fe, Ne)
          , pn = ((t,e,s)=>()=>{
            const n = new WeakMap;
            return {
                render(i, o, r) {
                    const a = n.get(o);
                    return void 0 !== a ? Promise.resolve(a) : (async(i,o,r)=>{
                        let a = e(i);
                        if (!E(a, o)) {
                            const e = {
                                channelCount: a.channelCount,
                                channelCountMode: a.channelCountMode,
                                channelInterpretation: a.channelInterpretation,
                                curve: a.curve,
                                oversample: a.oversample
                            };
                            a = t(o, e)
                        }
                        return n.set(o, a),
                        H(a) ? await s(i, o, a.inputs[0], r) : await s(i, o, a, r),
                        a
                    }
                    )(i, o, r)
                }
            }
        }
        )(nn, st, Oe)
          , dn = ((t,e,s,n,i,o,r)=>class extends t {
            constructor(t, e) {
                const a = i(t)
                  , c = {
                    ...ne,
                    ...e
                }
                  , h = s(a, c);
                super(t, !0, h, o(a) ? n() : null),
                this._isCurveNullified = !1,
                this._nativeWaveShaperNode = h,
                r(this, 1)
            }
            get curve() {
                return this._isCurveNullified ? null : this._nativeWaveShaperNode.curve
            }
            set curve(t) {
                if (null === t)
                    this._isCurveNullified = !0,
                    this._nativeWaveShaperNode.curve = new Float32Array([0, 0]);
                else {
                    if (t.length < 2)
                        throw e();
                    this._isCurveNullified = !1,
                    this._nativeWaveShaperNode.curve = t
                }
            }
            get oversample() {
                return this._nativeWaveShaperNode.oversample
            }
            set oversample(t) {
                this._nativeWaveShaperNode.oversample = t
            }
        }
        )(Ze, At, nn, pn, Fe, Ne, gs)
          , fn = (t=>null !== t && t.isSecureContext)(Te)
          , _n = (t=>(e,s,n)=>{
            Object.defineProperties(t, {
                currentFrame: {
                    configurable: !0,
                    get: ()=>Math.round(e * s)
                },
                currentTime: {
                    configurable: !0,
                    get: ()=>e
                }
            });
            try {
                return n()
            } finally {
                null !== t && (delete t.currentFrame,
                delete t.currentTime)
            }
        }
        )(Te)
          , mn = new WeakMap
          , gn = ((t,e)=>s=>{
            let n = t.get(s);
            if (void 0 !== n)
                return n;
            if (null === e)
                throw new Error("Missing the native OfflineAudioContext constructor.");
            return n = new e(1,1,8e3),
            t.set(s, n),
            n
        }
        )(mn, Ve)
          , vn = (t=>null === t ? null : t.hasOwnProperty("AudioWorkletNode") ? t.AudioWorkletNode : null)(Te)
          , yn = fn ? ((t,e,s,n,i,o,r,a,c,h,u,l)=>(p,d,f={
            credentials: "omit"
        })=>{
            const m = o(p);
            if (void 0 !== m.audioWorklet)
                return Promise.all([i(d), Promise.resolve(t(u, u))]).then(([[t,e],s])=>{
                    const [n,i] = y(t, e)
                      , o = s ? i : i.replace(/\s+extends\s+AudioWorkletProcessor\s*{/, " extends (class extends AudioWorkletProcessor {__b=new WeakSet();constructor(){super();(p=>p.postMessage=(q=>(m,t)=>q.call(p,m,t?t.filter(u=>!this.__b.has(u)):t))(p.postMessage))(this.port)}}){")
                      , c = new Blob([`${n};(registerProcessor=>{${o}\n})((n,p)=>registerProcessor(n,class extends p{${s ? "" : "__c = (a) => a.forEach(e=>this.__b.add(e.buffer));"}process(i,o,p){${s ? "" : "i.forEach(this.__c);o.forEach(this.__c);this.__c(Object.values(p));"}return super.process(i.map(j=>j.some(k=>k.length===0)?[]:j),o,p)}}))`],{
                        type: "application/javascript; charset=utf-8"
                    })
                      , h = URL.createObjectURL(c);
                    return m.audioWorklet.addModule(h, f).then(()=>{
                        if (a(m))
                            return;
                        return r(m).audioWorklet.addModule(h, f)
                    }
                    ).finally(()=>URL.revokeObjectURL(h))
                }
                );
            const g = h.get(p);
            if (void 0 !== g && g.has(d))
                return Promise.resolve();
            const v = c.get(p);
            if (void 0 !== v) {
                const t = v.get(d);
                if (void 0 !== t)
                    return t
            }
            const b = i(d).then(([t,e])=>{
                const [n,i] = y(t, e);
                return s(`${n};((a,b)=>{(a[b]=a[b]||[]).push((AudioWorkletProcessor,global,registerProcessor,sampleRate,self,window)=>{${i}\n})})(window,'_AWGS')`)
            }
            ).then(()=>{
                const t = l._AWGS.pop();
                if (void 0 === t)
                    throw new SyntaxError;
                n(m.currentTime, m.sampleRate, ()=>t(class {
                }
                , void 0, (t,s)=>{
                    if ("" === t.trim())
                        throw e();
                    const n = _.get(m);
                    if (void 0 !== n) {
                        if (n.has(t))
                            throw e();
                        w(s),
                        x(s.parameterDescriptors),
                        n.set(t, s)
                    } else
                        w(s),
                        x(s.parameterDescriptors),
                        _.set(m, new Map([[t, s]]))
                }
                , m.sampleRate, void 0, void 0))
            }
            );
            return void 0 === v ? c.set(p, new Map([[d, b]])) : v.set(d, b),
            b.then(()=>{
                const t = h.get(p);
                void 0 === t ? h.set(p, new Set([d])) : t.add(d)
            }
            ).finally(()=>{
                const t = c.get(p);
                void 0 !== t && t.delete(d)
            }
            ),
            b
        }
        )(xe, Ht, (t=>e=>new Promise((s,n)=>{
            if (null === t)
                return void n(new SyntaxError);
            const i = t.document.head;
            if (null === i)
                n(new SyntaxError);
            else {
                const o = t.document.createElement("script")
                  , r = new Blob([e],{
                    type: "application/javascript"
                })
                  , a = URL.createObjectURL(r)
                  , c = t.onerror
                  , h = ()=>{
                    t.onerror = c,
                    URL.revokeObjectURL(a)
                }
                ;
                t.onerror = (e,s,i,o,r)=>s === a || s === t.location.href && 1 === i && 1 === o ? (h(),
                n(r),
                !1) : null !== c ? c(e, s, i, o, r) : void 0,
                o.onerror = ()=>{
                    h(),
                    n(new SyntaxError)
                }
                ,
                o.onload = ()=>{
                    h(),
                    s()
                }
                ,
                o.src = a,
                o.type = "module",
                i.appendChild(o)
            }
        }
        ))(Te), _n, (t=>async e=>{
            try {
                const t = await fetch(e);
                if (t.ok)
                    return [await t.text(), t.url]
            } catch {}
            throw t()
        }
        )(()=>new DOMException("","AbortError")), Fe, gn, Ne, new WeakMap, new WeakMap, ((t,e)=>async()=>{
            if (null === t)
                return !0;
            if (null === e)
                return !1;
            const s = new Blob(['class A extends AudioWorkletProcessor{process(i){this.port.postMessage(i,[i[0][0].buffer])}}registerProcessor("a",A)'],{
                type: "application/javascript; charset=utf-8"
            })
              , n = new e(1,128,8e3)
              , i = URL.createObjectURL(s);
            let o = !1
              , r = !1;
            try {
                await n.audioWorklet.addModule(i);
                const e = new t(n,"a",{
                    numberOfOutputs: 0
                })
                  , s = n.createOscillator();
                e.port.onmessage = ()=>o = !0,
                e.onprocessorerror = ()=>r = !0,
                s.connect(e),
                await n.startRendering()
            } catch {} finally {
                URL.revokeObjectURL(i)
            }
            return o && !r
        }
        )(vn, Ve), Te) : void 0
          , xn = ((t,e)=>s=>t(s) || e(s))(We, Ne)
          , wn = ((t,e,s,n,i,o,r,a,c,h,u,l,p,d,f,_,m,g,v,y)=>class extends f {
            constructor(e, s) {
                super(e, s),
                this._nativeContext = e,
                this._audioWorklet = void 0 === t ? void 0 : {
                    addModule: (e,s)=>t(this, e, s)
                }
            }
            get audioWorklet() {
                return this._audioWorklet
            }
            createAnalyser() {
                return new e(this)
            }
            createBiquadFilter() {
                return new i(this)
            }
            createBuffer(t, e, n) {
                return new s({
                    length: e,
                    numberOfChannels: t,
                    sampleRate: n
                })
            }
            createBufferSource() {
                return new n(this)
            }
            createChannelMerger(t=6) {
                return new o(this,{
                    numberOfInputs: t
                })
            }
            createChannelSplitter(t=6) {
                return new r(this,{
                    numberOfOutputs: t
                })
            }
            createConstantSource() {
                return new a(this)
            }
            createConvolver() {
                return new c(this)
            }
            createDelay(t=1) {
                return new u(this,{
                    maxDelayTime: t
                })
            }
            createDynamicsCompressor() {
                return new l(this)
            }
            createGain() {
                return new p(this)
            }
            createIIRFilter(t, e) {
                return new d(this,{
                    feedback: e,
                    feedforward: t
                })
            }
            createOscillator() {
                return new _(this)
            }
            createPanner() {
                return new m(this)
            }
            createPeriodicWave(t, e, s={
                disableNormalization: !1
            }) {
                return new g(this,{
                    ...s,
                    imag: e,
                    real: t
                })
            }
            createStereoPanner() {
                return new v(this)
            }
            createWaveShaper() {
                return new y(this)
            }
            decodeAudioData(t, e, s) {
                return h(this._nativeContext, t).then(t=>("function" == typeof e && e(t),
                t)).catch(t=>{
                    throw "function" == typeof s && s(t),
                    t
                }
                )
            }
        }
        )(yn, Ye, ss, fs, vs, Rs, qs, Vs, Ps, ((t,e,s,n,i,o,r,a,c,h,u)=>(l,p)=>{
            const d = r(l) ? l : o(l);
            if (i.has(p)) {
                const t = s();
                return Promise.reject(t)
            }
            try {
                i.add(p)
            } catch {}
            return e(c, ()=>c(d)) ? d.decodeAudioData(p).then(s=>(e(a, ()=>a(s)) || u(s),
            t.add(s),
            s)) : new Promise((e,s)=>{
                const i = ()=>{
                    try {
                        (t=>{
                            const {port1: e} = new MessageChannel;
                            e.postMessage(t, [t])
                        }
                        )(p)
                    } catch {}
                }
                  , o = t=>{
                    s(t),
                    i()
                }
                ;
                try {
                    d.decodeAudioData(p, s=>{
                        "function" != typeof s.copyFromChannel && (h(s),
                        F(s)),
                        t.add(s),
                        i(),
                        e(s)
                    }
                    , t=>{
                        o(null === t ? n() : t)
                    }
                    )
                } catch (t) {
                    o(t)
                }
            }
            )
        }
        )(He, xe, ()=>new DOMException("","DataCloneError"), ()=>new DOMException("","EncodingError"), new WeakSet, Fe, xn, R, Rt, ts, es), js, Bs, Ws, Xs, $s, Ks, cn, hn, ln, dn)
          , bn = ((t,e,s,n)=>class extends t {
            constructor(t, i) {
                const o = s(t)
                  , r = e(o, i);
                if (n(o))
                    throw TypeError();
                super(t, !0, r, null),
                this._nativeMediaElementAudioSourceNode = r
            }
            get mediaElement() {
                return this._nativeMediaElementAudioSourceNode.mediaElement
            }
        }
        )(Ze, (t,e)=>t.createMediaElementSource(e.mediaElement), Fe, Ne)
          , Tn = ((t,e,s,n)=>class extends t {
            constructor(t, i) {
                const o = s(t);
                if (n(o))
                    throw new TypeError;
                const r = {
                    ...Et,
                    ...i
                }
                  , a = e(o, r);
                super(t, !1, a, null),
                this._nativeMediaStreamAudioDestinationNode = a
            }
            get stream() {
                return this._nativeMediaStreamAudioDestinationNode.stream
            }
        }
        )(Ze, (t,e)=>{
            const s = t.createMediaStreamDestination();
            return It(s, e),
            1 === s.numberOfOutputs && Object.defineProperty(s, "numberOfOutputs", {
                get: ()=>0
            }),
            s
        }
        , Fe, Ne)
          , Sn = ((t,e,s,n)=>class extends t {
            constructor(t, i) {
                const o = s(t)
                  , r = e(o, i);
                if (n(o))
                    throw new TypeError;
                super(t, !0, r, null),
                this._nativeMediaStreamAudioSourceNode = r
            }
            get mediaStream() {
                return this._nativeMediaStreamAudioSourceNode.mediaStream
            }
        }
        )(Ze, (t,{mediaStream: e})=>{
            const s = e.getAudioTracks();
            s.sort((t,e)=>t.id < e.id ? -1 : t.id > e.id ? 1 : 0);
            const n = s.slice(0, 1)
              , i = t.createMediaStreamSource(new MediaStream(n));
            return Object.defineProperty(i, "mediaStream", {
                value: e
            }),
            i
        }
        , Fe, Ne)
          , kn = ((t,e,s)=>class extends t {
            constructor(t, n) {
                const i = s(t);
                super(t, !0, e(i, n), null)
            }
        }
        )(Ze, ((t,e)=>(s,{mediaStreamTrack: n})=>{
            if ("function" == typeof s.createMediaStreamTrackSource)
                return s.createMediaStreamTrackSource(n);
            const i = new MediaStream([n])
              , o = s.createMediaStreamSource(i);
            if ("audio" !== n.kind)
                throw t();
            if (e(s))
                throw new TypeError;
            return o
        }
        )(At, Ne), Fe)
          , Cn = ((t,e,s,n,i,o,r,a,c)=>class extends t {
            constructor(t={}) {
                if (null === c)
                    throw new Error("Missing the native AudioContext constructor.");
                const e = new c(t);
                if (null === e)
                    throw n();
                if (!G(t.latencyHint))
                    throw new TypeError(`The provided value '${t.latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`);
                if (void 0 !== t.sampleRate && e.sampleRate !== t.sampleRate)
                    throw s();
                super(e, 2);
                const {latencyHint: i} = t
                  , {sampleRate: o} = e;
                if (this._baseLatency = "number" == typeof e.baseLatency ? e.baseLatency : "balanced" === i ? 512 / o : "interactive" === i || void 0 === i ? 256 / o : "playback" === i ? 1024 / o : 128 * Math.max(2, Math.min(128, Math.round(i * o / 128))) / o,
                this._nativeAudioContext = e,
                "webkitAudioContext" === c.name ? (this._nativeGainNode = e.createGain(),
                this._nativeOscillatorNode = e.createOscillator(),
                this._nativeGainNode.gain.value = 1e-37,
                this._nativeOscillatorNode.connect(this._nativeGainNode).connect(e.destination),
                this._nativeOscillatorNode.start()) : (this._nativeGainNode = null,
                this._nativeOscillatorNode = null),
                this._state = null,
                "running" === e.state) {
                    this._state = "suspended";
                    const t = ()=>{
                        "suspended" === this._state && (this._state = null),
                        e.removeEventListener("statechange", t)
                    }
                    ;
                    e.addEventListener("statechange", t)
                }
            }
            get baseLatency() {
                return this._baseLatency
            }
            get state() {
                return null !== this._state ? this._state : this._nativeAudioContext.state
            }
            close() {
                return "closed" === this.state ? this._nativeAudioContext.close().then(()=>{
                    throw e()
                }
                ) : ("suspended" === this._state && (this._state = null),
                this._nativeAudioContext.close().then(()=>{
                    null !== this._nativeGainNode && null !== this._nativeOscillatorNode && (this._nativeOscillatorNode.stop(),
                    this._nativeGainNode.disconnect(),
                    this._nativeOscillatorNode.disconnect()),
                    W(this)
                }
                ))
            }
            createMediaElementSource(t) {
                return new i(this,{
                    mediaElement: t
                })
            }
            createMediaStreamDestination() {
                return new o(this)
            }
            createMediaStreamSource(t) {
                return new r(this,{
                    mediaStream: t
                })
            }
            createMediaStreamTrackSource(t) {
                return new a(this,{
                    mediaStreamTrack: t
                })
            }
            resume() {
                return "suspended" === this._state ? new Promise((t,e)=>{
                    const s = ()=>{
                        this._nativeAudioContext.removeEventListener("statechange", s),
                        "running" === this._nativeAudioContext.state ? t() : this.resume().then(t, e)
                    }
                    ;
                    this._nativeAudioContext.addEventListener("statechange", s)
                }
                ) : this._nativeAudioContext.resume().catch(t=>{
                    if (void 0 === t || 15 === t.code)
                        throw e();
                    throw t
                }
                )
            }
            suspend() {
                return this._nativeAudioContext.suspend().catch(t=>{
                    if (void 0 === t)
                        throw e();
                    throw t
                }
                )
            }
        }
        )(wn, At, Ht, se, bn, Tn, Sn, kn, Be)
          , An = (Dn = Hs,
        t=>{
            const e = Dn.get(t);
            if (void 0 === e)
                throw new Error("The context has no set of AudioWorkletNodes.");
            return e
        }
        );
        var Dn;
        const On = (Mn = An,
        (t,e)=>{
            Mn(t).add(e)
        }
        );
        var Mn;
        const En = (t=>(e,s,n=0,i=0)=>{
            const o = e[n];
            if (void 0 === o)
                throw t();
            return ct(s) ? o.connect(s, 0, i) : o.connect(s, 0)
        }
        )(q)
          , Rn = (t=>(e,s)=>{
            t(e).delete(s)
        }
        )(An)
          , qn = (t=>(e,s,n,i=0)=>void 0 === s ? e.forEach(t=>t.disconnect()) : "number" == typeof s ? St(t, e, s).disconnect() : ct(s) ? void 0 === n ? e.forEach(t=>t.disconnect(s)) : void 0 === i ? St(t, e, n).disconnect(s, 0) : St(t, e, n).disconnect(s, 0, i) : void 0 === n ? e.forEach(t=>t.disconnect(s)) : St(t, e, n).disconnect(s, 0))(q)
          , Fn = new WeakMap
          , In = ((t,e)=>s=>e(t, s))(Fn, b)
          , Vn = ((t,e,s,n,i,o,r,a,c,h,u,l,p)=>(d,f,_,g)=>{
            if (0 === g.numberOfInputs && 0 === g.numberOfOutputs)
                throw c();
            const v = Array.isArray(g.outputChannelCount) ? g.outputChannelCount : Array.from(g.outputChannelCount);
            if (v.some(t=>t < 1))
                throw c();
            if (v.length !== g.numberOfOutputs)
                throw e();
            if ("explicit" !== g.channelCountMode)
                throw c();
            const y = g.channelCount * g.numberOfInputs
              , x = v.reduce((t,e)=>t + e, 0)
              , w = void 0 === _.parameterDescriptors ? 0 : _.parameterDescriptors.length;
            if (y + w > 6 || x > 6)
                throw c();
            const b = new MessageChannel
              , T = []
              , S = [];
            for (let t = 0; t < g.numberOfInputs; t += 1)
                T.push(r(d, {
                    channelCount: g.channelCount,
                    channelCountMode: g.channelCountMode,
                    channelInterpretation: g.channelInterpretation,
                    gain: 1
                })),
                S.push(i(d, {
                    channelCount: g.channelCount,
                    channelCountMode: "explicit",
                    channelInterpretation: "discrete",
                    numberOfOutputs: g.channelCount
                }));
            const k = [];
            if (void 0 !== _.parameterDescriptors)
                for (const {defaultValue: t, maxValue: e, minValue: s, name: n} of _.parameterDescriptors) {
                    const i = o(d, {
                        channelCount: 1,
                        channelCountMode: "explicit",
                        channelInterpretation: "discrete",
                        offset: void 0 !== g.parameterData[n] ? g.parameterData[n] : void 0 === t ? 0 : t
                    });
                    Object.defineProperties(i.offset, {
                        defaultValue: {
                            get: ()=>void 0 === t ? 0 : t
                        },
                        maxValue: {
                            get: ()=>void 0 === e ? N : e
                        },
                        minValue: {
                            get: ()=>void 0 === s ? V : s
                        }
                    }),
                    k.push(i)
                }
            const C = n(d, {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "speakers",
                numberOfInputs: Math.max(1, y + w)
            })
              , A = Lt(f, d.sampleRate)
              , D = a(d, A, y + w, Math.max(1, x))
              , O = i(d, {
                channelCount: Math.max(1, x),
                channelCountMode: "explicit",
                channelInterpretation: "discrete",
                numberOfOutputs: Math.max(1, x)
            })
              , M = [];
            for (let t = 0; t < g.numberOfOutputs; t += 1)
                M.push(n(d, {
                    channelCount: 1,
                    channelCountMode: "explicit",
                    channelInterpretation: "speakers",
                    numberOfInputs: v[t]
                }));
            for (let t = 0; t < g.numberOfInputs; t += 1) {
                T[t].connect(S[t]);
                for (let e = 0; e < g.channelCount; e += 1)
                    S[t].connect(C, e, t * g.channelCount + e)
            }
            const E = new pt(void 0 === _.parameterDescriptors ? [] : _.parameterDescriptors.map(({name: t},e)=>{
                const s = k[e];
                return s.connect(C, 0, y + e),
                s.start(0),
                [t, s.offset]
            }
            ));
            C.connect(D);
            let R = g.channelInterpretation
              , q = null;
            const F = 0 === g.numberOfOutputs ? [D] : M
              , I = {
                get bufferSize() {
                    return A
                },
                get channelCount() {
                    return g.channelCount
                },
                set channelCount(t) {
                    throw s()
                },
                get channelCountMode() {
                    return g.channelCountMode
                },
                set channelCountMode(t) {
                    throw s()
                },
                get channelInterpretation() {
                    return R
                },
                set channelInterpretation(t) {
                    for (const e of T)
                        e.channelInterpretation = t;
                    R = t
                },
                get context() {
                    return D.context
                },
                get inputs() {
                    return T
                },
                get numberOfInputs() {
                    return g.numberOfInputs
                },
                get numberOfOutputs() {
                    return g.numberOfOutputs
                },
                get onprocessorerror() {
                    return q
                },
                set onprocessorerror(t) {
                    "function" == typeof q && I.removeEventListener("processorerror", q),
                    q = "function" == typeof t ? t : null,
                    "function" == typeof q && I.addEventListener("processorerror", q)
                },
                get parameters() {
                    return E
                },
                get port() {
                    return b.port2
                },
                addEventListener: (...t)=>D.addEventListener(t[0], t[1], t[2]),
                connect: t.bind(null, F),
                disconnect: h.bind(null, F),
                dispatchEvent: (...t)=>D.dispatchEvent(t[0]),
                removeEventListener: (...t)=>D.removeEventListener(t[0], t[1], t[2])
            }
              , P = new Map;
            var j, L;
            b.port1.addEventListener = (j = b.port1.addEventListener,
            (...t)=>{
                if ("message" === t[0]) {
                    const e = "function" == typeof t[1] ? t[1] : "object" == typeof t[1] && null !== t[1] && "function" == typeof t[1].handleEvent ? t[1].handleEvent : null;
                    if (null !== e) {
                        const s = P.get(t[1]);
                        void 0 !== s ? t[1] = s : (t[1] = t=>{
                            u(d.currentTime, d.sampleRate, ()=>e(t))
                        }
                        ,
                        P.set(e, t[1]))
                    }
                }
                return j.call(b.port1, t[0], t[1], t[2])
            }
            ),
            b.port1.removeEventListener = (L = b.port1.removeEventListener,
            (...t)=>{
                if ("message" === t[0]) {
                    const e = P.get(t[1]);
                    void 0 !== e && (P.delete(t[1]),
                    t[1] = e)
                }
                return L.call(b.port1, t[0], t[1], t[2])
            }
            );
            let z = null;
            Object.defineProperty(b.port1, "onmessage", {
                get: ()=>z,
                set: t=>{
                    "function" == typeof z && b.port1.removeEventListener("message", z),
                    z = "function" == typeof t ? t : null,
                    "function" == typeof z && (b.port1.addEventListener("message", z),
                    b.port1.start())
                }
            }),
            _.prototype.port = b.port1;
            let B = null;
            ((t,e,s,n)=>{
                let i = m.get(t);
                void 0 === i && (i = new WeakMap,
                m.set(t, i));
                const o = zt(s, n);
                return i.set(e, o),
                o
            }
            )(d, I, _, g).then(t=>B = t);
            const W = mt(g.numberOfInputs, g.channelCount)
              , G = mt(g.numberOfOutputs, v)
              , U = void 0 === _.parameterDescriptors ? [] : _.parameterDescriptors.reduce((t,{name: e})=>({
                ...t,
                [e]: new Float32Array(128)
            }), {});
            let Q = !0;
            const Z = ()=>{
                g.numberOfOutputs > 0 && D.disconnect(O);
                for (let t = 0, e = 0; t < g.numberOfOutputs; t += 1) {
                    const s = M[t];
                    for (let n = 0; n < v[t]; n += 1)
                        O.disconnect(s, e + n, n);
                    e += v[t]
                }
            }
              , X = new Map;
            D.onaudioprocess = ({inputBuffer: t, outputBuffer: e})=>{
                if (null !== B) {
                    const s = l(I);
                    for (let n = 0; n < A; n += 128) {
                        for (let e = 0; e < g.numberOfInputs; e += 1)
                            for (let s = 0; s < g.channelCount; s += 1)
                                ft(t, W[e], s, s, n);
                        void 0 !== _.parameterDescriptors && _.parameterDescriptors.forEach(({name: e},s)=>{
                            ft(t, U, e, y + s, n)
                        }
                        );
                        for (let t = 0; t < g.numberOfInputs; t += 1)
                            for (let e = 0; e < v[t]; e += 1)
                                0 === G[t][e].byteLength && (G[t][e] = new Float32Array(128));
                        try {
                            const t = W.map((t,e)=>{
                                if (s[e].size > 0)
                                    return X.set(e, A / 128),
                                    t;
                                const n = X.get(e);
                                return void 0 === n ? [] : (t.every(t=>t.every(t=>0 === t)) && (1 === n ? X.delete(e) : X.set(e, n - 1)),
                                t)
                            }
                            )
                              , i = u(d.currentTime + n / d.sampleRate, d.sampleRate, ()=>B.process(t, G, U));
                            Q = i;
                            for (let t = 0, s = 0; t < g.numberOfOutputs; t += 1) {
                                for (let i = 0; i < v[t]; i += 1)
                                    _t(e, G[t], i, s + i, n);
                                s += v[t]
                            }
                        } catch (t) {
                            Q = !1,
                            I.dispatchEvent(new ErrorEvent("processorerror",{
                                colno: t.colno,
                                filename: t.filename,
                                lineno: t.lineno,
                                message: t.message
                            }))
                        }
                        if (!Q) {
                            for (let t = 0; t < g.numberOfInputs; t += 1) {
                                T[t].disconnect(S[t]);
                                for (let e = 0; e < g.channelCount; e += 1)
                                    S[n].disconnect(C, e, t * g.channelCount + e)
                            }
                            if (void 0 !== _.parameterDescriptors) {
                                const t = _.parameterDescriptors.length;
                                for (let e = 0; e < t; e += 1) {
                                    const t = k[e];
                                    t.disconnect(C, 0, y + e),
                                    t.stop()
                                }
                            }
                            C.disconnect(D),
                            D.onaudioprocess = null,
                            Y ? Z() : J();
                            break
                        }
                    }
                }
            }
            ;
            let Y = !1;
            const H = r(d, {
                channelCount: 1,
                channelCountMode: "explicit",
                channelInterpretation: "discrete",
                gain: 0
            })
              , $ = ()=>D.connect(H).connect(d.destination)
              , J = ()=>{
                D.disconnect(H),
                H.disconnect()
            }
            ;
            return $(),
            p(I, ()=>{
                if (Q) {
                    J(),
                    g.numberOfOutputs > 0 && D.connect(O);
                    for (let t = 0, e = 0; t < g.numberOfOutputs; t += 1) {
                        const s = M[t];
                        for (let n = 0; n < v[t]; n += 1)
                            O.connect(s, e + n, n);
                        e += v[t]
                    }
                }
                Y = !0
            }
            , ()=>{
                Q && ($(),
                Z()),
                Y = !1
            }
            )
        }
        )(En, q, At, Es, Wt, Is, Qt, Yt, Ht, qn, _n, In, As)
          , Nn = ((t,e,s,n,i)=>(o,r,a,c,h,u)=>{
            if (null !== a)
                try {
                    const e = new a(o,c,u)
                      , n = new Map;
                    let r = null;
                    if (Object.defineProperties(e, {
                        channelCount: {
                            get: ()=>u.channelCount,
                            set: ()=>{
                                throw t()
                            }
                        },
                        channelCountMode: {
                            get: ()=>"explicit",
                            set: ()=>{
                                throw t()
                            }
                        },
                        onprocessorerror: {
                            get: ()=>r,
                            set: t=>{
                                "function" == typeof r && e.removeEventListener("processorerror", r),
                                r = "function" == typeof t ? t : null,
                                "function" == typeof r && e.addEventListener("processorerror", r)
                            }
                        }
                    }),
                    e.addEventListener = (p = e.addEventListener,
                    (...t)=>{
                        if ("processorerror" === t[0]) {
                            const e = "function" == typeof t[1] ? t[1] : "object" == typeof t[1] && null !== t[1] && "function" == typeof t[1].handleEvent ? t[1].handleEvent : null;
                            if (null !== e) {
                                const s = n.get(t[1]);
                                void 0 !== s ? t[1] = s : (t[1] = s=>{
                                    "error" === s.type ? (Object.defineProperties(s, {
                                        type: {
                                            value: "processorerror"
                                        }
                                    }),
                                    e(s)) : e(new ErrorEvent(t[0],{
                                        ...s
                                    }))
                                }
                                ,
                                n.set(e, t[1]))
                            }
                        }
                        return p.call(e, "error", t[1], t[2]),
                        p.call(e, ...t)
                    }
                    ),
                    e.removeEventListener = (l = e.removeEventListener,
                    (...t)=>{
                        if ("processorerror" === t[0]) {
                            const e = n.get(t[1]);
                            void 0 !== e && (n.delete(t[1]),
                            t[1] = e)
                        }
                        return l.call(e, "error", t[1], t[2]),
                        l.call(e, t[0], t[1], t[2])
                    }
                    ),
                    0 !== u.numberOfOutputs) {
                        const t = s(o, {
                            channelCount: 1,
                            channelCountMode: "explicit",
                            channelInterpretation: "discrete",
                            gain: 0
                        });
                        e.connect(t).connect(o.destination);
                        return i(e, ()=>t.disconnect(), ()=>t.connect(o.destination))
                    }
                    return e
                } catch (t) {
                    if (11 === t.code)
                        throw n();
                    throw t
                }
            var l, p;
            if (void 0 === h)
                throw n();
            return (t=>{
                const {port1: e} = new MessageChannel;
                try {
                    e.postMessage(t)
                } finally {
                    e.close()
                }
            }
            )(u),
            e(o, r, h, u)
        }
        )(At, Vn, Qt, Ht, As)
          , Pn = ((t,e,s,n,i,o,r,a,c,h,u,l,p,d,f,_)=>(m,g,v)=>{
            const y = new WeakMap;
            let x = null;
            return {
                render(w, b, T) {
                    a(b, w);
                    const S = y.get(b);
                    return void 0 !== S ? Promise.resolve(S) : (async(a,w,b)=>{
                        let T = u(a)
                          , S = null;
                        const k = E(T, w)
                          , C = Array.isArray(g.outputChannelCount) ? g.outputChannelCount : Array.from(g.outputChannelCount);
                        if (null === l) {
                            const t = C.reduce((t,e)=>t + e, 0)
                              , s = i(w, {
                                channelCount: Math.max(1, t),
                                channelCountMode: "explicit",
                                channelInterpretation: "discrete",
                                numberOfOutputs: Math.max(1, t)
                            })
                              , o = [];
                            for (let t = 0; t < a.numberOfOutputs; t += 1)
                                o.push(n(w, {
                                    channelCount: 1,
                                    channelCountMode: "explicit",
                                    channelInterpretation: "speakers",
                                    numberOfInputs: C[t]
                                }));
                            const h = r(w, {
                                channelCount: g.channelCount,
                                channelCountMode: g.channelCountMode,
                                channelInterpretation: g.channelInterpretation,
                                gain: 1
                            });
                            h.connect = e.bind(null, o),
                            h.disconnect = c.bind(null, o),
                            S = [s, o, h]
                        } else
                            k || (T = new l(w,m));
                        if (y.set(w, null === S ? T : S[2]),
                        null !== S) {
                            if (null === x) {
                                if (void 0 === v)
                                    throw new Error("Missing the processor constructor.");
                                if (null === p)
                                    throw new Error("Missing the native OfflineAudioContext constructor.");
                                const t = a.channelCount * a.numberOfInputs
                                  , e = void 0 === v.parameterDescriptors ? 0 : v.parameterDescriptors.length
                                  , s = t + e
                                  , c = async()=>{
                                    const c = new p(s,128 * Math.ceil(a.context.length / 128),w.sampleRate)
                                      , h = []
                                      , u = [];
                                    for (let t = 0; t < g.numberOfInputs; t += 1)
                                        h.push(r(c, {
                                            channelCount: g.channelCount,
                                            channelCountMode: g.channelCountMode,
                                            channelInterpretation: g.channelInterpretation,
                                            gain: 1
                                        })),
                                        u.push(i(c, {
                                            channelCount: g.channelCount,
                                            channelCountMode: "explicit",
                                            channelInterpretation: "discrete",
                                            numberOfOutputs: g.channelCount
                                        }));
                                    const l = await Promise.all(Array.from(a.parameters.values()).map(async t=>{
                                        const e = o(c, {
                                            channelCount: 1,
                                            channelCountMode: "explicit",
                                            channelInterpretation: "discrete",
                                            offset: t.value
                                        });
                                        return await d(c, t, e.offset, b),
                                        e
                                    }
                                    ))
                                      , m = n(c, {
                                        channelCount: 1,
                                        channelCountMode: "explicit",
                                        channelInterpretation: "speakers",
                                        numberOfInputs: Math.max(1, t + e)
                                    });
                                    for (let t = 0; t < g.numberOfInputs; t += 1) {
                                        h[t].connect(u[t]);
                                        for (let e = 0; e < g.channelCount; e += 1)
                                            u[t].connect(m, e, t * g.channelCount + e)
                                    }
                                    for (const [e,s] of l.entries())
                                        s.connect(m, 0, t + e),
                                        s.start(0);
                                    return m.connect(c.destination),
                                    await Promise.all(h.map(t=>f(a, c, t, b))),
                                    _(c)
                                }
                                ;
                                x = gt(a, 0 === s ? null : await c(), w, g, C, v, h)
                            }
                            const t = await x
                              , e = s(w, {
                                buffer: null,
                                channelCount: 2,
                                channelCountMode: "max",
                                channelInterpretation: "speakers",
                                loop: !1,
                                loopEnd: 0,
                                loopStart: 0,
                                playbackRate: 1
                            })
                              , [c,u,l] = S;
                            null !== t && (e.buffer = t,
                            e.start(0)),
                            e.connect(c);
                            for (let t = 0, e = 0; t < a.numberOfOutputs; t += 1) {
                                const s = u[t];
                                for (let n = 0; n < C[t]; n += 1)
                                    c.connect(s, e + n, n);
                                e += C[t]
                            }
                            return l
                        }
                        if (k)
                            for (const [e,s] of a.parameters.entries())
                                await t(w, s, T.parameters.get(e), b);
                        else
                            for (const [t,e] of a.parameters.entries())
                                await d(w, e, T.parameters.get(t), b);
                        return await f(a, w, T, b),
                        T
                    }
                    )(w, b, T)
                }
            }
        }
        )(as, En, cs, Es, Wt, Is, Qt, Rn, qn, _n, st, vn, Ve, us, Oe, Us)
          , jn = (t=>e=>t.get(e))(mn)
          , Ln = (t=>(e,s)=>{
            t.set(e, s)
        }
        )(Fn)
          , zn = fn ? ((t,e,s,n,i,o,r,a,c,h,u,l,p)=>class extends e {
            constructor(e, p, d) {
                var f;
                const m = a(e)
                  , g = c(m)
                  , v = u({
                    ...dt,
                    ...d
                })
                  , y = _.get(m)
                  , x = null == y ? void 0 : y.get(p)
                  , w = g || "closed" !== m.state ? m : null !== (f = r(m)) && void 0 !== f ? f : m
                  , b = i(w, g ? null : e.baseLatency, h, p, x, v);
                super(e, !0, b, g ? n(p, v, x) : null);
                const T = [];
                b.parameters.forEach((t,e)=>{
                    const n = s(this, g, t);
                    T.push([e, n])
                }
                ),
                this._nativeAudioWorkletNode = b,
                this._onprocessorerror = null,
                this._parameters = new pt(T),
                g && t(m, this);
                const {activeInputs: S} = o(this);
                l(b, S)
            }
            get onprocessorerror() {
                return this._onprocessorerror
            }
            set onprocessorerror(t) {
                const e = "function" == typeof t ? p(this, t) : null;
                this._nativeAudioWorkletNode.onprocessorerror = e;
                const s = this._nativeAudioWorkletNode.onprocessorerror;
                this._onprocessorerror = null !== s && s === e ? t : s
            }
            get parameters() {
                return null === this._parameters ? this._nativeAudioWorkletNode.parameters : this._parameters
            }
            get port() {
                return this._nativeAudioWorkletNode.port
            }
        }
        )(On, Ze, ps, Pn, Nn, L, jn, Fe, Ne, vn, t=>({
            ...t,
            outputChannelCount: void 0 !== t.outputChannelCount ? t.outputChannelCount : 1 === t.numberOfInputs && 1 === t.numberOfOutputs ? [t.channelCount] : Array.from({
                length: t.numberOfOutputs
            }, ()=>1)
        }), Ln, de) : void 0
          , Bn = (((t,e,s,n,i)=>{}
        )(At, Ht, se, $s, Be),
        ((t,e)=>(s,n,i)=>{
            if (null === e)
                throw new Error("Missing the native OfflineAudioContext constructor.");
            try {
                return new e(s,n,i)
            } catch (e) {
                if ("SyntaxError" === e.name)
                    throw t();
                throw e
            }
        }
        )(Ht, Ve))
          , Wn = ((t,e,s,n,i,o,r,a)=>{
            const c = [];
            return (h,u)=>s(h).render(h, u, c).then(()=>Promise.all(Array.from(n(u)).map(t=>s(t).render(t, u, c)))).then(()=>i(u)).then(s=>("function" != typeof s.copyFromChannel ? (r(s),
            F(s)) : e(o, ()=>o(s)) || a(s),
            t.add(s),
            s))
        }
        )(He, xe, Ae, An, Us, R, ts, es)
          , Gn = (((t,e,s,n,i)=>{}
        )(xe, At, Bn, $s, Wn),
        ((t,e,s,n,i)=>class extends t {
            constructor(t, s, i) {
                let o;
                if ("number" == typeof t && void 0 !== s && void 0 !== i)
                    o = {
                        length: s,
                        numberOfChannels: t,
                        sampleRate: i
                    };
                else {
                    if ("object" != typeof t)
                        throw new Error("The given parameters are not valid.");
                    o = t
                }
                const {length: r, numberOfChannels: a, sampleRate: c} = {
                    ...$t,
                    ...o
                }
                  , h = n(a, r, c);
                e(Rt, ()=>Rt(h)) || h.addEventListener("statechange", (()=>{
                    let t = 0;
                    const e = s=>{
                        "running" === this._state && (t > 0 ? (h.removeEventListener("statechange", e),
                        s.stopImmediatePropagation(),
                        this._waitForThePromiseToSettle(s)) : t += 1)
                    }
                    ;
                    return e
                }
                )()),
                super(h, a),
                this._length = r,
                this._nativeOfflineAudioContext = h,
                this._state = null
            }
            get length() {
                return void 0 === this._nativeOfflineAudioContext.length ? this._length : this._nativeOfflineAudioContext.length
            }
            get state() {
                return null === this._state ? this._nativeOfflineAudioContext.state : this._state
            }
            startRendering() {
                return "running" === this._state ? Promise.reject(s()) : (this._state = "running",
                i(this.destination, this._nativeOfflineAudioContext).finally(()=>{
                    this._state = null,
                    W(this)
                }
                ))
            }
            _waitForThePromiseToSettle(t) {
                null === this._state ? this._nativeOfflineAudioContext.dispatchEvent(t) : setTimeout(()=>this._waitForThePromiseToSettle(t))
            }
        }
        )(wn, xe, At, Bn, Wn))
          , Un = ((t,e)=>s=>{
            const n = t.get(s);
            return e(n) || e(s)
        }
        )(p, We)
          , Qn = (Zn = h,
        Xn = Ue,
        t=>Zn.has(t) || Xn(t));
        var Zn, Xn;
        const Yn = (Hn = l,
        $n = Qe,
        t=>Hn.has(t) || $n(t));
        var Hn, $n;
        const Jn = ((t,e)=>s=>{
            const n = t.get(s);
            return e(n) || e(s)
        }
        )(p, Ne)
          , Kn = ()=>(async(t,e,s,n,i,o,r,a,c,h,u,l,p,d,f,_)=>{
            if (t(e, e) && t(s, s) && t(i, i) && t(o, o) && t(a, a) && t(c, c) && t(h, h) && t(u, u) && t(l, l) && t(p, p) && t(d, d)) {
                return (await Promise.all([t(n, n), t(r, r), t(f, f), t(_, _)])).every(t=>t)
            }
            return !1
        }
        )(xe, (t=>()=>{
            if (null === t)
                return !1;
            const e = new t(1,1,44100).createBuffer(1, 1, 44100);
            if (void 0 === e.copyToChannel)
                return !0;
            const s = new Float32Array(2);
            try {
                e.copyFromChannel(s, 0, 0)
            } catch {
                return !1
            }
            return !0
        }
        )(Ve), (t=>()=>{
            if (null === t)
                return !1;
            if (void 0 !== t.prototype && void 0 !== t.prototype.close)
                return !0;
            const e = new t
              , s = void 0 !== e.close;
            try {
                e.close()
            } catch {}
            return s
        }
        )(Be), (t=>()=>{
            if (null === t)
                return Promise.resolve(!1);
            const e = new t(1,1,44100);
            return new Promise(t=>{
                let s = !0;
                const n = n=>{
                    s && (s = !1,
                    e.startRendering(),
                    t(n instanceof TypeError))
                }
                ;
                let i;
                try {
                    i = e.decodeAudioData(null, ()=>{}
                    , n)
                } catch (t) {
                    n(t)
                }
                void 0 !== i && i.catch(n)
            }
            )
        }
        )(Ve), (t=>()=>{
            if (null === t)
                return !1;
            let e;
            try {
                e = new t({
                    latencyHint: "balanced"
                })
            } catch {
                return !1
            }
            return e.close(),
            !0
        }
        )(Be), (t=>()=>{
            if (null === t)
                return !1;
            const e = new t(1,1,44100).createGain()
              , s = e.connect(e) === e;
            return e.disconnect(e),
            s
        }
        )(Ve), ((t,e)=>async()=>{
            if (null === t)
                return !0;
            if (null === e)
                return !1;
            const s = new Blob(['class A extends AudioWorkletProcessor{process(){this.port.postMessage(0)}}registerProcessor("a",A)'],{
                type: "application/javascript; charset=utf-8"
            })
              , n = new e(1,128,8e3)
              , i = URL.createObjectURL(s);
            let o = !1;
            try {
                await n.audioWorklet.addModule(i);
                const e = new t(n,"a",{
                    numberOfOutputs: 0
                })
                  , s = n.createOscillator();
                e.port.onmessage = ()=>o = !0,
                s.connect(e),
                s.start(0),
                await n.startRendering(),
                o || await new Promise(t=>setTimeout(t, 5))
            } catch {} finally {
                URL.revokeObjectURL(i)
            }
            return o
        }
        )(vn, Ve), (t=>()=>{
            if (null === t)
                return !1;
            const e = new t(1,1,44100).createChannelMerger();
            if ("max" === e.channelCountMode)
                return !0;
            try {
                e.channelCount = 2
            } catch {
                return !0
            }
            return !1
        }
        )(Ve), (t=>()=>{
            if (null === t)
                return !1;
            const e = new t(1,1,44100);
            if (void 0 === e.createConstantSource)
                return !0;
            return e.createConstantSource().offset.maxValue !== Number.POSITIVE_INFINITY
        }
        )(Ve), (t=>()=>{
            if (null === t)
                return !1;
            const e = new t(1,1,44100)
              , s = e.createConvolver();
            s.buffer = e.createBuffer(1, 1, e.sampleRate);
            try {
                s.buffer = e.createBuffer(1, 1, e.sampleRate)
            } catch {
                return !1
            }
            return !0
        }
        )(Ve), (t=>()=>{
            if (null === t)
                return !1;
            const e = new t(1,1,44100).createConvolver();
            try {
                e.channelCount = 1
            } catch {
                return !1
            }
            return !0
        }
        )(Ve), ue, (t=>()=>null !== t && t.hasOwnProperty("isSecureContext"))(Te), (t=>()=>{
            if (null === t)
                return !1;
            const e = new t;
            try {
                return e.createMediaStreamSource(new MediaStream),
                !1
            } catch (t) {
                return !0
            }
        }
        )(Be), (t=>()=>{
            if (null === t)
                return Promise.resolve(!1);
            const e = new t(1,1,44100);
            if (void 0 === e.createStereoPanner)
                return Promise.resolve(!0);
            if (void 0 === e.createConstantSource)
                return Promise.resolve(!0);
            const s = e.createConstantSource()
              , n = e.createStereoPanner();
            return s.channelCount = 1,
            s.offset.value = 1,
            n.channelCount = 1,
            s.start(),
            s.connect(n).connect(e.destination),
            e.startRendering().then(t=>1 !== t.getChannelData(0)[0])
        }
        )(Ve), le);
        function ti(t, e) {
            if (!t)
                throw new Error(e)
        }
        function ei(t, e, s=1 / 0) {
            if (!(e <= t && t <= s))
                throw new RangeError(`Value must be within [${e}, ${s}], got: ${t}`)
        }
        function si(t) {
            t.isOffline || "running" === t.state || ri('The AudioContext is "suspended". Invoke Tone.start() from a user action to start the audio.')
        }
        let ni = console;
        function ii(t) {
            ni = t
        }
        function oi(...t) {
            ni.log(...t)
        }
        function ri(...t) {
            ni.warn(...t)
        }
        function ai(t) {
            return void 0 === t
        }
        function ci(t) {
            return !ai(t)
        }
        function hi(t) {
            return "function" == typeof t
        }
        function ui(t) {
            return "number" == typeof t
        }
        function li(t) {
            return "[object Object]" === Object.prototype.toString.call(t) && t.constructor === Object
        }
        function pi(t) {
            return "boolean" == typeof t
        }
        function di(t) {
            return Array.isArray(t)
        }
        function fi(t) {
            return "string" == typeof t
        }
        function _i(t) {
            return fi(t) && /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i.test(t)
        }
        const mi = "object" == typeof self ? self : null
          , gi = mi && (mi.hasOwnProperty("AudioContext") || mi.hasOwnProperty("webkitAudioContext"));
        function vi(t, e, s, n) {
            var i, o = arguments.length, r = o < 3 ? e : null === n ? n = Object.getOwnPropertyDescriptor(e, s) : n;
            if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                r = Reflect.decorate(t, e, s, n);
            else
                for (var a = t.length - 1; a >= 0; a--)
                    (i = t[a]) && (r = (o < 3 ? i(r) : o > 3 ? i(e, s, r) : i(e, s)) || r);
            return o > 3 && r && Object.defineProperty(e, s, r),
            r
        }
        function yi(t, e, s, n) {
            return new (s || (s = Promise))((function(i, o) {
                function r(t) {
                    try {
                        c(n.next(t))
                    } catch (t) {
                        o(t)
                    }
                }
                function a(t) {
                    try {
                        c(n.throw(t))
                    } catch (t) {
                        o(t)
                    }
                }
                function c(t) {
                    var e;
                    t.done ? i(t.value) : (e = t.value,
                    e instanceof s ? e : new s((function(t) {
                        t(e)
                    }
                    ))).then(r, a)
                }
                c((n = n.apply(t, e || [])).next())
            }
            ))
        }
        Object.create;
        Object.create;
        class xi {
            constructor(t, e, s) {
                this._callback = t,
                this._type = e,
                this._updateInterval = s,
                this._createClock()
            }
            _createWorker() {
                const t = new Blob([`\n\t\t\t// the initial timeout time\n\t\t\tlet timeoutTime =  ${(1e3 * this._updateInterval).toFixed(1)};\n\t\t\t// onmessage callback\n\t\t\tself.onmessage = function(msg){\n\t\t\t\ttimeoutTime = parseInt(msg.data);\n\t\t\t};\n\t\t\t// the tick function which posts a message\n\t\t\t// and schedules a new tick\n\t\t\tfunction tick(){\n\t\t\t\tsetTimeout(tick, timeoutTime);\n\t\t\t\tself.postMessage('tick');\n\t\t\t}\n\t\t\t// call tick initially\n\t\t\ttick();\n\t\t\t`],{
                    type: "text/javascript"
                })
                  , e = URL.createObjectURL(t)
                  , s = new Worker(e);
                s.onmessage = this._callback.bind(this),
                this._worker = s
            }
            _createTimeout() {
                this._timeout = setTimeout(()=>{
                    this._createTimeout(),
                    this._callback()
                }
                , 1e3 * this._updateInterval)
            }
            _createClock() {
                if ("worker" === this._type)
                    try {
                        this._createWorker()
                    } catch (t) {
                        this._type = "timeout",
                        this._createClock()
                    }
                else
                    "timeout" === this._type && this._createTimeout()
            }
            _disposeClock() {
                this._timeout && (clearTimeout(this._timeout),
                this._timeout = 0),
                this._worker && (this._worker.terminate(),
                this._worker.onmessage = null)
            }
            get updateInterval() {
                return this._updateInterval
            }
            set updateInterval(t) {
                this._updateInterval = Math.max(t, 128 / 44100),
                "worker" === this._type && this._worker.postMessage(Math.max(1e3 * t, 1))
            }
            get type() {
                return this._type
            }
            set type(t) {
                this._disposeClock(),
                this._type = t,
                this._createClock()
            }
            dispose() {
                this._disposeClock()
            }
        }
        function wi(t) {
            return Yn(t)
        }
        function bi(t) {
            return Qn(t)
        }
        function Ti(t) {
            return Jn(t)
        }
        function Si(t) {
            return Un(t)
        }
        function ki(t) {
            return t instanceof AudioBuffer
        }
        function Ci(t, e) {
            return "value" === t || wi(e) || bi(e) || ki(e)
        }
        function Ai(t, ...e) {
            if (!e.length)
                return t;
            const s = e.shift();
            if (li(t) && li(s))
                for (const e in s)
                    Ci(e, s[e]) ? t[e] = s[e] : li(s[e]) ? (t[e] || Object.assign(t, {
                        [e]: {}
                    }),
                    Ai(t[e], s[e])) : Object.assign(t, {
                        [e]: s[e]
                    });
            return Ai(t, ...e)
        }
        function Di(t, e, s=[], n) {
            const i = {}
              , o = Array.from(e);
            if (li(o[0]) && n && !Reflect.has(o[0], n)) {
                Object.keys(o[0]).some(e=>Reflect.has(t, e)) || (Ai(i, {
                    [n]: o[0]
                }),
                s.splice(s.indexOf(n), 1),
                o.shift())
            }
            if (1 === o.length && li(o[0]))
                Ai(i, o[0]);
            else
                for (let t = 0; t < s.length; t++)
                    ci(o[t]) && (i[s[t]] = o[t]);
            return Ai(t, i)
        }
        function Oi(t, e) {
            return ai(t) ? e : t
        }
        function Mi(t, e) {
            return e.forEach(e=>{
                Reflect.has(t, e) && delete t[e]
            }
            ),
            t
        }
        /**
 * Tone.js
 * @author Yotam Mann
 * @license http://opensource.org/licenses/MIT MIT License
 * @copyright 2014-2019 Yotam Mann
 */
        class Ei {
            constructor() {
                this.debug = !1,
                this._wasDisposed = !1
            }
            static getDefaults() {
                return {}
            }
            log(...t) {
                (this.debug || mi && this.toString() === mi.TONE_DEBUG_CLASS) && oi(this, ...t)
            }
            dispose() {
                return this._wasDisposed = !0,
                this
            }
            get disposed() {
                return this._wasDisposed
            }
            toString() {
                return this.name
            }
        }
        Ei.version = o;
        function Ri(t, e) {
            return t > e + 1e-6
        }
        function qi(t, e) {
            return Ri(t, e) || Ii(t, e)
        }
        function Fi(t, e) {
            return t + 1e-6 < e
        }
        function Ii(t, e) {
            return Math.abs(t - e) < 1e-6
        }
        function Vi(t, e, s) {
            return Math.max(Math.min(t, s), e)
        }
        class Ni extends Ei {
            constructor() {
                super(),
                this.name = "Timeline",
                this._timeline = [];
                const t = Di(Ni.getDefaults(), arguments, ["memory"]);
                this.memory = t.memory,
                this.increasing = t.increasing
            }
            static getDefaults() {
                return {
                    memory: 1 / 0,
                    increasing: !1
                }
            }
            get length() {
                return this._timeline.length
            }
            add(t) {
                if (ti(Reflect.has(t, "time"), "Timeline: events must have a time attribute"),
                t.time = t.time.valueOf(),
                this.increasing && this.length) {
                    const e = this._timeline[this.length - 1];
                    ti(qi(t.time, e.time), "The time must be greater than or equal to the last scheduled time"),
                    this._timeline.push(t)
                } else {
                    const e = this._search(t.time);
                    this._timeline.splice(e + 1, 0, t)
                }
                if (this.length > this.memory) {
                    const t = this.length - this.memory;
                    this._timeline.splice(0, t)
                }
                return this
            }
            remove(t) {
                const e = this._timeline.indexOf(t);
                return -1 !== e && this._timeline.splice(e, 1),
                this
            }
            get(t, e="time") {
                const s = this._search(t, e);
                return -1 !== s ? this._timeline[s] : null
            }
            peek() {
                return this._timeline[0]
            }
            shift() {
                return this._timeline.shift()
            }
            getAfter(t, e="time") {
                const s = this._search(t, e);
                return s + 1 < this._timeline.length ? this._timeline[s + 1] : null
            }
            getBefore(t) {
                const e = this._timeline.length;
                if (e > 0 && this._timeline[e - 1].time < t)
                    return this._timeline[e - 1];
                const s = this._search(t);
                return s - 1 >= 0 ? this._timeline[s - 1] : null
            }
            cancel(t) {
                if (this._timeline.length > 1) {
                    let e = this._search(t);
                    if (e >= 0)
                        if (Ii(this._timeline[e].time, t)) {
                            for (let s = e; s >= 0 && Ii(this._timeline[s].time, t); s--)
                                e = s;
                            this._timeline = this._timeline.slice(0, e)
                        } else
                            this._timeline = this._timeline.slice(0, e + 1);
                    else
                        this._timeline = []
                } else
                    1 === this._timeline.length && qi(this._timeline[0].time, t) && (this._timeline = []);
                return this
            }
            cancelBefore(t) {
                const e = this._search(t);
                return e >= 0 && (this._timeline = this._timeline.slice(e + 1)),
                this
            }
            previousEvent(t) {
                const e = this._timeline.indexOf(t);
                return e > 0 ? this._timeline[e - 1] : null
            }
            _search(t, e="time") {
                if (0 === this._timeline.length)
                    return -1;
                let s = 0;
                const n = this._timeline.length;
                let i = n;
                if (n > 0 && this._timeline[n - 1][e] <= t)
                    return n - 1;
                for (; s < i; ) {
                    let n = Math.floor(s + (i - s) / 2);
                    const o = this._timeline[n]
                      , r = this._timeline[n + 1];
                    if (Ii(o[e], t)) {
                        for (let s = n; s < this._timeline.length; s++) {
                            if (!Ii(this._timeline[s][e], t))
                                break;
                            n = s
                        }
                        return n
                    }
                    if (Fi(o[e], t) && Ri(r[e], t))
                        return n;
                    Ri(o[e], t) ? i = n : s = n + 1
                }
                return -1
            }
            _iterate(t, e=0, s=this._timeline.length - 1) {
                this._timeline.slice(e, s + 1).forEach(t)
            }
            forEach(t) {
                return this._iterate(t),
                this
            }
            forEachBefore(t, e) {
                const s = this._search(t);
                return -1 !== s && this._iterate(e, 0, s),
                this
            }
            forEachAfter(t, e) {
                const s = this._search(t);
                return this._iterate(e, s + 1),
                this
            }
            forEachBetween(t, e, s) {
                let n = this._search(t)
                  , i = this._search(e);
                return -1 !== n && -1 !== i ? (this._timeline[n].time !== t && (n += 1),
                this._timeline[i].time === e && (i -= 1),
                this._iterate(s, n, i)) : -1 === n && this._iterate(s, 0, i),
                this
            }
            forEachFrom(t, e) {
                let s = this._search(t);
                for (; s >= 0 && this._timeline[s].time >= t; )
                    s--;
                return this._iterate(e, s + 1),
                this
            }
            forEachAtTime(t, e) {
                const s = this._search(t);
                if (-1 !== s && Ii(this._timeline[s].time, t)) {
                    let n = s;
                    for (let e = s; e >= 0 && Ii(this._timeline[e].time, t); e--)
                        n = e;
                    this._iterate(t=>{
                        e(t)
                    }
                    , n, s)
                }
                return this
            }
            dispose() {
                return super.dispose(),
                this._timeline = [],
                this
            }
        }
        const Pi = [];
        function ji(t) {
            Pi.push(t)
        }
        const Li = [];
        function zi(t) {
            Li.push(t)
        }
        class Bi extends Ei {
            constructor() {
                super(...arguments),
                this.name = "Emitter"
            }
            on(t, e) {
                return t.split(/\W+/).forEach(t=>{
                    ai(this._events) && (this._events = {}),
                    this._events.hasOwnProperty(t) || (this._events[t] = []),
                    this._events[t].push(e)
                }
                ),
                this
            }
            once(t, e) {
                const s = (...n)=>{
                    e(...n),
                    this.off(t, s)
                }
                ;
                return this.on(t, s),
                this
            }
            off(t, e) {
                return t.split(/\W+/).forEach(s=>{
                    if (ai(this._events) && (this._events = {}),
                    this._events.hasOwnProperty(t))
                        if (ai(e))
                            this._events[t] = [];
                        else {
                            const s = this._events[t];
                            for (let t = s.length - 1; t >= 0; t--)
                                s[t] === e && s.splice(t, 1)
                        }
                }
                ),
                this
            }
            emit(t, ...e) {
                if (this._events && this._events.hasOwnProperty(t)) {
                    const s = this._events[t].slice(0);
                    for (let t = 0, n = s.length; t < n; t++)
                        s[t].apply(this, e)
                }
                return this
            }
            static mixin(t) {
                ["on", "once", "off", "emit"].forEach(e=>{
                    const s = Object.getOwnPropertyDescriptor(Bi.prototype, e);
                    Object.defineProperty(t.prototype, e, s)
                }
                )
            }
            dispose() {
                return super.dispose(),
                this._events = void 0,
                this
            }
        }
        class Wi extends Bi {
            constructor() {
                super(...arguments),
                this.isOffline = !1
            }
            toJSON() {
                return {}
            }
        }
        class Gi extends Wi {
            constructor() {
                super(),
                this.name = "Context",
                this._constants = new Map,
                this._timeouts = new Ni,
                this._timeoutIds = 0,
                this._initialized = !1,
                this.isOffline = !1,
                this._workletModules = new Map;
                const t = Di(Gi.getDefaults(), arguments, ["context"]);
                t.context ? this._context = t.context : this._context = function(t) {
                    return new Cn(t)
                }({
                    latencyHint: t.latencyHint
                }),
                this._ticker = new xi(this.emit.bind(this, "tick"),t.clockSource,t.updateInterval),
                this.on("tick", this._timeoutLoop.bind(this)),
                this._context.onstatechange = ()=>{
                    this.emit("statechange", this.state)
                }
                ,
                this._setLatencyHint(t.latencyHint),
                this.lookAhead = t.lookAhead
            }
            static getDefaults() {
                return {
                    clockSource: "worker",
                    latencyHint: "interactive",
                    lookAhead: .1,
                    updateInterval: .05
                }
            }
            initialize() {
                var t;
                return this._initialized || (t = this,
                Pi.forEach(e=>e(t)),
                this._initialized = !0),
                this
            }
            createAnalyser() {
                return this._context.createAnalyser()
            }
            createOscillator() {
                return this._context.createOscillator()
            }
            createBufferSource() {
                return this._context.createBufferSource()
            }
            createBiquadFilter() {
                return this._context.createBiquadFilter()
            }
            createBuffer(t, e, s) {
                return this._context.createBuffer(t, e, s)
            }
            createChannelMerger(t) {
                return this._context.createChannelMerger(t)
            }
            createChannelSplitter(t) {
                return this._context.createChannelSplitter(t)
            }
            createConstantSource() {
                return this._context.createConstantSource()
            }
            createConvolver() {
                return this._context.createConvolver()
            }
            createDelay(t) {
                return this._context.createDelay(t)
            }
            createDynamicsCompressor() {
                return this._context.createDynamicsCompressor()
            }
            createGain() {
                return this._context.createGain()
            }
            createIIRFilter(t, e) {
                return this._context.createIIRFilter(t, e)
            }
            createPanner() {
                return this._context.createPanner()
            }
            createPeriodicWave(t, e, s) {
                return this._context.createPeriodicWave(t, e, s)
            }
            createStereoPanner() {
                return this._context.createStereoPanner()
            }
            createWaveShaper() {
                return this._context.createWaveShaper()
            }
            createMediaStreamSource(t) {
                ti(Si(this._context), "Not available if OfflineAudioContext");
                return this._context.createMediaStreamSource(t)
            }
            createMediaElementSource(t) {
                ti(Si(this._context), "Not available if OfflineAudioContext");
                return this._context.createMediaElementSource(t)
            }
            createMediaStreamDestination() {
                ti(Si(this._context), "Not available if OfflineAudioContext");
                return this._context.createMediaStreamDestination()
            }
            decodeAudioData(t) {
                return this._context.decodeAudioData(t)
            }
            get currentTime() {
                return this._context.currentTime
            }
            get state() {
                return this._context.state
            }
            get sampleRate() {
                return this._context.sampleRate
            }
            get listener() {
                return this.initialize(),
                this._listener
            }
            set listener(t) {
                ti(!this._initialized, "The listener cannot be set after initialization."),
                this._listener = t
            }
            get transport() {
                return this.initialize(),
                this._transport
            }
            set transport(t) {
                ti(!this._initialized, "The transport cannot be set after initialization."),
                this._transport = t
            }
            get draw() {
                return this.initialize(),
                this._draw
            }
            set draw(t) {
                ti(!this._initialized, "Draw cannot be set after initialization."),
                this._draw = t
            }
            get destination() {
                return this.initialize(),
                this._destination
            }
            set destination(t) {
                ti(!this._initialized, "The destination cannot be set after initialization."),
                this._destination = t
            }
            createAudioWorkletNode(t, e) {
                return function(t, e, s) {
                    return ti(ci(zn), "This node only works in a secure context (https or localhost)"),
                    new zn(t,e,s)
                }/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
                (this.rawContext, t, e)
            }
            addAudioWorkletModule(t, e) {
                return yi(this, void 0, void 0, (function*() {
                    ti(ci(this.rawContext.audioWorklet), "AudioWorkletNode is only available in a secure context (https or localhost)"),
                    this._workletModules.has(e) || this._workletModules.set(e, this.rawContext.audioWorklet.addModule(t)),
                    yield this._workletModules.get(e)
                }
                ))
            }
            workletsAreReady() {
                return yi(this, void 0, void 0, (function*() {
                    const t = [];
                    this._workletModules.forEach(e=>t.push(e)),
                    yield Promise.all(t)
                }
                ))
            }
            get updateInterval() {
                return this._ticker.updateInterval
            }
            set updateInterval(t) {
                this._ticker.updateInterval = t
            }
            get clockSource() {
                return this._ticker.type
            }
            set clockSource(t) {
                this._ticker.type = t
            }
            get latencyHint() {
                return this._latencyHint
            }
            _setLatencyHint(t) {
                let e = 0;
                if (this._latencyHint = t,
                fi(t))
                    switch (t) {
                    case "interactive":
                        e = .1;
                        break;
                    case "playback":
                        e = .5;
                        break;
                    case "balanced":
                        e = .25
                    }
                this.lookAhead = e,
                this.updateInterval = e / 2
            }
            get rawContext() {
                return this._context
            }
            now() {
                return this._context.currentTime + this.lookAhead
            }
            immediate() {
                return this._context.currentTime
            }
            resume() {
                return Si(this._context) ? this._context.resume() : Promise.resolve()
            }
            close() {
                return yi(this, void 0, void 0, (function*() {
                    var t;
                    Si(this._context) && (yield this._context.close()),
                    this._initialized && (t = this,
                    Li.forEach(e=>e(t)))
                }
                ))
            }
            getConstant(t) {
                if (this._constants.has(t))
                    return this._constants.get(t);
                {
                    const e = this._context.createBuffer(1, 128, this._context.sampleRate)
                      , s = e.getChannelData(0);
                    for (let e = 0; e < s.length; e++)
                        s[e] = t;
                    const n = this._context.createBufferSource();
                    return n.channelCount = 1,
                    n.channelCountMode = "explicit",
                    n.buffer = e,
                    n.loop = !0,
                    n.start(0),
                    this._constants.set(t, n),
                    n
                }
            }
            dispose() {
                return super.dispose(),
                this._ticker.dispose(),
                this._timeouts.dispose(),
                Object.keys(this._constants).map(t=>this._constants[t].disconnect()),
                this
            }
            _timeoutLoop() {
                const t = this.now();
                let e = this._timeouts.peek();
                for (; this._timeouts.length && e && e.time <= t; )
                    e.callback(),
                    this._timeouts.shift(),
                    e = this._timeouts.peek()
            }
            setTimeout(t, e) {
                this._timeoutIds++;
                const s = this.now();
                return this._timeouts.add({
                    callback: t,
                    id: this._timeoutIds,
                    time: s + e
                }),
                this._timeoutIds
            }
            clearTimeout(t) {
                return this._timeouts.forEach(e=>{
                    e.id === t && this._timeouts.remove(e)
                }
                ),
                this
            }
            clearInterval(t) {
                return this.clearTimeout(t)
            }
            setInterval(t, e) {
                const s = ++this._timeoutIds
                  , n = ()=>{
                    const i = this.now();
                    this._timeouts.add({
                        callback: ()=>{
                            t(),
                            n()
                        }
                        ,
                        id: s,
                        time: i + e
                    })
                }
                ;
                return n(),
                s
            }
        }
        function Ui(t, e) {
            di(e) ? e.forEach(e=>Ui(t, e)) : Object.defineProperty(t, e, {
                enumerable: !0,
                writable: !1
            })
        }
        function Qi(t, e) {
            di(e) ? e.forEach(e=>Qi(t, e)) : Object.defineProperty(t, e, {
                writable: !0
            })
        }
        const Zi = ()=>{}
        ;
        class Xi extends Ei {
            constructor() {
                super(),
                this.name = "ToneAudioBuffer",
                this.onload = Zi;
                const t = Di(Xi.getDefaults(), arguments, ["url", "onload", "onerror"]);
                this.reverse = t.reverse,
                this.onload = t.onload,
                t.url && ki(t.url) || t.url instanceof Xi ? this.set(t.url) : fi(t.url) && this.load(t.url).catch(t.onerror)
            }
            static getDefaults() {
                return {
                    onerror: Zi,
                    onload: Zi,
                    reverse: !1
                }
            }
            get sampleRate() {
                return this._buffer ? this._buffer.sampleRate : Ji().sampleRate
            }
            set(t) {
                return t instanceof Xi ? t.loaded ? this._buffer = t.get() : t.onload = ()=>{
                    this.set(t),
                    this.onload(this)
                }
                : this._buffer = t,
                this._reversed && this._reverse(),
                this
            }
            get() {
                return this._buffer
            }
            load(t) {
                return yi(this, void 0, void 0, (function*() {
                    const e = Xi.load(t).then(t=>{
                        this.set(t),
                        this.onload(this)
                    }
                    );
                    Xi.downloads.push(e);
                    try {
                        yield e
                    } finally {
                        const t = Xi.downloads.indexOf(e);
                        Xi.downloads.splice(t, 1)
                    }
                    return this
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this._buffer = void 0,
                this
            }
            fromArray(t) {
                const e = di(t) && t[0].length > 0
                  , s = e ? t.length : 1
                  , n = e ? t[0].length : t.length
                  , i = Ji()
                  , o = i.createBuffer(s, n, i.sampleRate)
                  , r = e || 1 !== s ? t : [t];
                for (let t = 0; t < s; t++)
                    o.copyToChannel(r[t], t);
                return this._buffer = o,
                this
            }
            toMono(t) {
                if (ui(t))
                    this.fromArray(this.toArray(t));
                else {
                    let t = new Float32Array(this.length);
                    const e = this.numberOfChannels;
                    for (let s = 0; s < e; s++) {
                        const e = this.toArray(s);
                        for (let s = 0; s < e.length; s++)
                            t[s] += e[s]
                    }
                    t = t.map(t=>t / e),
                    this.fromArray(t)
                }
                return this
            }
            toArray(t) {
                if (ui(t))
                    return this.getChannelData(t);
                if (1 === this.numberOfChannels)
                    return this.toArray(0);
                {
                    const t = [];
                    for (let e = 0; e < this.numberOfChannels; e++)
                        t[e] = this.getChannelData(e);
                    return t
                }
            }
            getChannelData(t) {
                return this._buffer ? this._buffer.getChannelData(t) : new Float32Array(0)
            }
            slice(t, e=this.duration) {
                const s = Math.floor(t * this.sampleRate)
                  , n = Math.floor(e * this.sampleRate);
                ti(s < n, "The start time must be less than the end time");
                const i = n - s
                  , o = Ji().createBuffer(this.numberOfChannels, i, this.sampleRate);
                for (let t = 0; t < this.numberOfChannels; t++)
                    o.copyToChannel(this.getChannelData(t).subarray(s, n), t);
                return new Xi(o)
            }
            _reverse() {
                if (this.loaded)
                    for (let t = 0; t < this.numberOfChannels; t++)
                        this.getChannelData(t).reverse();
                return this
            }
            get loaded() {
                return this.length > 0
            }
            get duration() {
                return this._buffer ? this._buffer.duration : 0
            }
            get length() {
                return this._buffer ? this._buffer.length : 0
            }
            get numberOfChannels() {
                return this._buffer ? this._buffer.numberOfChannels : 0
            }
            get reverse() {
                return this._reversed
            }
            set reverse(t) {
                this._reversed !== t && (this._reversed = t,
                this._reverse())
            }
            static fromArray(t) {
                return (new Xi).fromArray(t)
            }
            static fromUrl(t) {
                return yi(this, void 0, void 0, (function*() {
                    const e = new Xi;
                    return yield e.load(t)
                }
                ))
            }
            static load(t) {
                return yi(this, void 0, void 0, (function*() {
                    const e = t.match(/\[([^\]\[]+\|.+)\]$/);
                    if (e) {
                        const s = e[1].split("|");
                        let n = s[0];
                        for (const t of s)
                            if (Xi.supportsType(t)) {
                                n = t;
                                break
                            }
                        t = t.replace(e[0], n)
                    }
                    const s = "" === Xi.baseUrl || Xi.baseUrl.endsWith("/") ? Xi.baseUrl : Xi.baseUrl + "/"
                      , n = yield fetch(s + t);
                    if (!n.ok)
                        throw new Error("could not load url: " + t);
                    const i = yield n.arrayBuffer();
                    return yield Ji().decodeAudioData(i)
                }
                ))
            }
            static supportsType(t) {
                const e = t.split(".")
                  , s = e[e.length - 1];
                return "" !== document.createElement("audio").canPlayType("audio/" + s)
            }
            static loaded() {
                return yi(this, void 0, void 0, (function*() {
                    for (yield Promise.resolve(); Xi.downloads.length; )
                        yield Xi.downloads[0]
                }
                ))
            }
        }
        Xi.baseUrl = "",
        Xi.downloads = [];
        class Yi extends Gi {
            constructor() {
                var t, e, s;
                super({
                    clockSource: "offline",
                    context: Ti(arguments[0]) ? arguments[0] : (t = arguments[0],
                    e = arguments[1] * arguments[2],
                    s = arguments[2],
                    new Gn(t,e,s)),
                    lookAhead: 0,
                    updateInterval: Ti(arguments[0]) ? 128 / arguments[0].sampleRate : 128 / arguments[2]
                }),
                this.name = "OfflineContext",
                this._currentTime = 0,
                this.isOffline = !0,
                this._duration = Ti(arguments[0]) ? arguments[0].length / arguments[0].sampleRate : arguments[1]
            }
            now() {
                return this._currentTime
            }
            get currentTime() {
                return this._currentTime
            }
            _renderClock(t) {
                return yi(this, void 0, void 0, (function*() {
                    let e = 0;
                    for (; this._duration - this._currentTime >= 0; ) {
                        this.emit("tick"),
                        this._currentTime += 128 / this.sampleRate,
                        e++;
                        const s = Math.floor(this.sampleRate / 128);
                        t && e % s == 0 && (yield new Promise(t=>setTimeout(t, 1)))
                    }
                }
                ))
            }
            render(t=!0) {
                return yi(this, void 0, void 0, (function*() {
                    yield this.workletsAreReady(),
                    yield this._renderClock(t);
                    const e = yield this._context.startRendering();
                    return new Xi(e)
                }
                ))
            }
            close() {
                return Promise.resolve()
            }
        }
        const Hi = new class extends Wi {
            constructor() {
                super(...arguments),
                this.lookAhead = 0,
                this.latencyHint = 0,
                this.isOffline = !1
            }
            createAnalyser() {
                return {}
            }
            createOscillator() {
                return {}
            }
            createBufferSource() {
                return {}
            }
            createBiquadFilter() {
                return {}
            }
            createBuffer(t, e, s) {
                return {}
            }
            createChannelMerger(t) {
                return {}
            }
            createChannelSplitter(t) {
                return {}
            }
            createConstantSource() {
                return {}
            }
            createConvolver() {
                return {}
            }
            createDelay(t) {
                return {}
            }
            createDynamicsCompressor() {
                return {}
            }
            createGain() {
                return {}
            }
            createIIRFilter(t, e) {
                return {}
            }
            createPanner() {
                return {}
            }
            createPeriodicWave(t, e, s) {
                return {}
            }
            createStereoPanner() {
                return {}
            }
            createWaveShaper() {
                return {}
            }
            createMediaStreamSource(t) {
                return {}
            }
            createMediaElementSource(t) {
                return {}
            }
            createMediaStreamDestination() {
                return {}
            }
            decodeAudioData(t) {
                return Promise.resolve({})
            }
            createAudioWorkletNode(t, e) {
                return {}
            }
            get rawContext() {
                return {}
            }
            addAudioWorkletModule(t, e) {
                return yi(this, void 0, void 0, (function*() {
                    return Promise.resolve()
                }
                ))
            }
            resume() {
                return Promise.resolve()
            }
            setTimeout(t, e) {
                return 0
            }
            clearTimeout(t) {
                return this
            }
            setInterval(t, e) {
                return 0
            }
            clearInterval(t) {
                return this
            }
            getConstant(t) {
                return {}
            }
            get currentTime() {
                return 0
            }
            get state() {
                return {}
            }
            get sampleRate() {
                return 0
            }
            get listener() {
                return {}
            }
            get transport() {
                return {}
            }
            get draw() {
                return {}
            }
            set draw(t) {}
            get destination() {
                return {}
            }
            set destination(t) {}
            now() {
                return 0
            }
            immediate() {
                return 0
            }
        }
        ;
        let $i = Hi;
        function Ji() {
            return $i === Hi && gi && Ki(new Gi),
            $i
        }
        function Ki(t) {
            $i = Si(t) ? new Gi(t) : Ti(t) ? new Yi(t) : t
        }
        function to() {
            return $i.resume()
        }
        if (mi && !mi.TONE_SILENCE_LOGGING) {
            let t = "v";
            "dev" === o && (t = "");
            const e = ` * Tone.js ${t}${o} * `;
            console.log("%c" + e, "background: #000; color: #fff")
        }
        function eo(t) {
            return Math.pow(10, t / 20)
        }
        function so(t) {
            return Math.log(t) / Math.LN10 * 20
        }
        function no(t) {
            return Math.pow(2, t / 12)
        }
        let io = 440;
        function oo(t) {
            return Math.round(ro(t))
        }
        function ro(t) {
            return 69 + 12 * Math.log2(t / io)
        }
        function ao(t) {
            return io * Math.pow(2, (t - 69) / 12)
        }
        class co extends Ei {
            constructor(t, e, s) {
                super(),
                this.defaultUnits = "s",
                this._val = e,
                this._units = s,
                this.context = t,
                this._expressions = this._getExpressions()
            }
            _getExpressions() {
                return {
                    hz: {
                        method: t=>this._frequencyToUnits(parseFloat(t)),
                        regexp: /^(\d+(?:\.\d+)?)hz$/i
                    },
                    i: {
                        method: t=>this._ticksToUnits(parseInt(t, 10)),
                        regexp: /^(\d+)i$/i
                    },
                    m: {
                        method: t=>this._beatsToUnits(parseInt(t, 10) * this._getTimeSignature()),
                        regexp: /^(\d+)m$/i
                    },
                    n: {
                        method: (t,e)=>{
                            const s = parseInt(t, 10)
                              , n = "." === e ? 1.5 : 1;
                            return 1 === s ? this._beatsToUnits(this._getTimeSignature()) * n : this._beatsToUnits(4 / s) * n
                        }
                        ,
                        regexp: /^(\d+)n(\.?)$/i
                    },
                    number: {
                        method: t=>this._expressions[this.defaultUnits].method.call(this, t),
                        regexp: /^(\d+(?:\.\d+)?)$/
                    },
                    s: {
                        method: t=>this._secondsToUnits(parseFloat(t)),
                        regexp: /^(\d+(?:\.\d+)?)s$/
                    },
                    samples: {
                        method: t=>parseInt(t, 10) / this.context.sampleRate,
                        regexp: /^(\d+)samples$/
                    },
                    t: {
                        method: t=>{
                            const e = parseInt(t, 10);
                            return this._beatsToUnits(8 / (3 * Math.floor(e)))
                        }
                        ,
                        regexp: /^(\d+)t$/i
                    },
                    tr: {
                        method: (t,e,s)=>{
                            let n = 0;
                            return t && "0" !== t && (n += this._beatsToUnits(this._getTimeSignature() * parseFloat(t))),
                            e && "0" !== e && (n += this._beatsToUnits(parseFloat(e))),
                            s && "0" !== s && (n += this._beatsToUnits(parseFloat(s) / 4)),
                            n
                        }
                        ,
                        regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?$/
                    }
                }
            }
            valueOf() {
                if (this._val instanceof co && this.fromType(this._val),
                ai(this._val))
                    return this._noArg();
                if (fi(this._val) && ai(this._units)) {
                    for (const t in this._expressions)
                        if (this._expressions[t].regexp.test(this._val.trim())) {
                            this._units = t;
                            break
                        }
                } else if (li(this._val)) {
                    let t = 0;
                    for (const e in this._val)
                        if (ci(this._val[e])) {
                            const s = this._val[e];
                            t += new this.constructor(this.context,e).valueOf() * s
                        }
                    return t
                }
                if (ci(this._units)) {
                    const t = this._expressions[this._units]
                      , e = this._val.toString().trim().match(t.regexp);
                    return e ? t.method.apply(this, e.slice(1)) : t.method.call(this, this._val)
                }
                return fi(this._val) ? parseFloat(this._val) : this._val
            }
            _frequencyToUnits(t) {
                return 1 / t
            }
            _beatsToUnits(t) {
                return 60 / this._getBpm() * t
            }
            _secondsToUnits(t) {
                return t
            }
            _ticksToUnits(t) {
                return t * this._beatsToUnits(1) / this._getPPQ()
            }
            _noArg() {
                return this._now()
            }
            _getBpm() {
                return this.context.transport.bpm.value
            }
            _getTimeSignature() {
                return this.context.transport.timeSignature
            }
            _getPPQ() {
                return this.context.transport.PPQ
            }
            fromType(t) {
                switch (this._units = void 0,
                this.defaultUnits) {
                case "s":
                    this._val = t.toSeconds();
                    break;
                case "i":
                    this._val = t.toTicks();
                    break;
                case "hz":
                    this._val = t.toFrequency();
                    break;
                case "midi":
                    this._val = t.toMidi()
                }
                return this
            }
            toFrequency() {
                return 1 / this.toSeconds()
            }
            toSamples() {
                return this.toSeconds() * this.context.sampleRate
            }
            toMilliseconds() {
                return 1e3 * this.toSeconds()
            }
        }
        class ho extends co {
            constructor() {
                super(...arguments),
                this.name = "TimeClass"
            }
            _getExpressions() {
                return Object.assign(super._getExpressions(), {
                    now: {
                        method: t=>this._now() + new this.constructor(this.context,t).valueOf(),
                        regexp: /^\+(.+)/
                    },
                    quantize: {
                        method: t=>{
                            const e = new ho(this.context,t).valueOf();
                            return this._secondsToUnits(this.context.transport.nextSubdivision(e))
                        }
                        ,
                        regexp: /^@(.+)/
                    }
                })
            }
            quantize(t, e=1) {
                const s = new this.constructor(this.context,t).valueOf()
                  , n = this.valueOf();
                return n + (Math.round(n / s) * s - n) * e
            }
            toNotation() {
                const t = this.toSeconds()
                  , e = ["1m"];
                for (let t = 1; t < 9; t++) {
                    const s = Math.pow(2, t);
                    e.push(s + "n."),
                    e.push(s + "n"),
                    e.push(s + "t")
                }
                e.push("0");
                let s = e[0]
                  , n = new ho(this.context,e[0]).toSeconds();
                return e.forEach(e=>{
                    const i = new ho(this.context,e).toSeconds();
                    Math.abs(i - t) < Math.abs(n - t) && (s = e,
                    n = i)
                }
                ),
                s
            }
            toBarsBeatsSixteenths() {
                const t = this._beatsToUnits(1);
                let e = this.valueOf() / t;
                e = parseFloat(e.toFixed(4));
                const s = Math.floor(e / this._getTimeSignature());
                let n = e % 1 * 4;
                e = Math.floor(e) % this._getTimeSignature();
                const i = n.toString();
                i.length > 3 && (n = parseFloat(parseFloat(i).toFixed(3)));
                return [s, e, n].join(":")
            }
            toTicks() {
                const t = this._beatsToUnits(1)
                  , e = this.valueOf() / t;
                return Math.round(e * this._getPPQ())
            }
            toSeconds() {
                return this.valueOf()
            }
            toMidi() {
                return oo(this.toFrequency())
            }
            _now() {
                return this.context.now()
            }
        }
        function uo(t, e) {
            return new ho(Ji(),t,e)
        }
        class lo extends ho {
            constructor() {
                super(...arguments),
                this.name = "Frequency",
                this.defaultUnits = "hz"
            }
            static get A4() {
                return io
            }
            static set A4(t) {
                !function(t) {
                    io = t
                }(t)
            }
            _getExpressions() {
                return Object.assign({}, super._getExpressions(), {
                    midi: {
                        regexp: /^(\d+(?:\.\d+)?midi)/,
                        method(t) {
                            return "midi" === this.defaultUnits ? t : lo.mtof(t)
                        }
                    },
                    note: {
                        regexp: /^([a-g]{1}(?:b|#|x|bb)?)(-?[0-9]+)/i,
                        method(t, e) {
                            const s = po[t.toLowerCase()] + 12 * (parseInt(e, 10) + 1);
                            return "midi" === this.defaultUnits ? s : lo.mtof(s)
                        }
                    },
                    tr: {
                        regexp: /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?):?(\d+(?:\.\d+)?)?/,
                        method(t, e, s) {
                            let n = 1;
                            return t && "0" !== t && (n *= this._beatsToUnits(this._getTimeSignature() * parseFloat(t))),
                            e && "0" !== e && (n *= this._beatsToUnits(parseFloat(e))),
                            s && "0" !== s && (n *= this._beatsToUnits(parseFloat(s) / 4)),
                            n
                        }
                    }
                })
            }
            transpose(t) {
                return new lo(this.context,this.valueOf() * no(t))
            }
            harmonize(t) {
                return t.map(t=>this.transpose(t))
            }
            toMidi() {
                return oo(this.valueOf())
            }
            toNote() {
                const t = this.toFrequency()
                  , e = Math.log2(t / lo.A4);
                let s = Math.round(12 * e) + 57;
                const n = Math.floor(s / 12);
                n < 0 && (s += -12 * n);
                return fo[s % 12] + n.toString()
            }
            toSeconds() {
                return 1 / super.toSeconds()
            }
            toTicks() {
                const t = this._beatsToUnits(1)
                  , e = this.valueOf() / t;
                return Math.floor(e * this._getPPQ())
            }
            _noArg() {
                return 0
            }
            _frequencyToUnits(t) {
                return t
            }
            _ticksToUnits(t) {
                return 1 / (60 * t / (this._getBpm() * this._getPPQ()))
            }
            _beatsToUnits(t) {
                return 1 / super._beatsToUnits(t)
            }
            _secondsToUnits(t) {
                return 1 / t
            }
            static mtof(t) {
                return ao(t)
            }
            static ftom(t) {
                return oo(t)
            }
        }
        const po = {
            cbb: -2,
            cb: -1,
            c: 0,
            "c#": 1,
            cx: 2,
            dbb: 0,
            db: 1,
            d: 2,
            "d#": 3,
            dx: 4,
            ebb: 2,
            eb: 3,
            e: 4,
            "e#": 5,
            ex: 6,
            fbb: 3,
            fb: 4,
            f: 5,
            "f#": 6,
            fx: 7,
            gbb: 5,
            gb: 6,
            g: 7,
            "g#": 8,
            gx: 9,
            abb: 7,
            ab: 8,
            a: 9,
            "a#": 10,
            ax: 11,
            bbb: 9,
            bb: 10,
            b: 11,
            "b#": 12,
            bx: 13
        }
          , fo = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        function _o(t, e) {
            return new lo(Ji(),t,e)
        }
        class mo extends ho {
            constructor() {
                super(...arguments),
                this.name = "TransportTime"
            }
            _now() {
                return this.context.transport.seconds
            }
        }
        function go(t, e) {
            return new mo(Ji(),t,e)
        }
        class vo extends Ei {
            constructor() {
                super();
                const t = Di(vo.getDefaults(), arguments, ["context"]);
                this.defaultContext ? this.context = this.defaultContext : this.context = t.context
            }
            static getDefaults() {
                return {
                    context: Ji()
                }
            }
            now() {
                return this.context.currentTime + this.context.lookAhead
            }
            immediate() {
                return this.context.currentTime
            }
            get sampleTime() {
                return 1 / this.context.sampleRate
            }
            get blockTime() {
                return 128 / this.context.sampleRate
            }
            toSeconds(t) {
                return new ho(this.context,t).toSeconds()
            }
            toFrequency(t) {
                return new lo(this.context,t).toFrequency()
            }
            toTicks(t) {
                return new mo(this.context,t).toTicks()
            }
            _getPartialProperties(t) {
                const e = this.get();
                return Object.keys(e).forEach(s=>{
                    ai(t[s]) && delete e[s]
                }
                ),
                e
            }
            get() {
                const t = this.constructor.getDefaults();
                return Object.keys(t).forEach(e=>{
                    if (Reflect.has(this, e)) {
                        const s = this[e];
                        ci(s) && ci(s.value) && ci(s.setValueAtTime) ? t[e] = s.value : s instanceof vo ? t[e] = s._getPartialProperties(t[e]) : di(s) || ui(s) || fi(s) || pi(s) ? t[e] = s : delete t[e]
                    }
                }
                ),
                t
            }
            set(t) {
                return Object.keys(t).forEach(e=>{
                    Reflect.has(this, e) && ci(this[e]) && (this[e] && ci(this[e].value) && ci(this[e].setValueAtTime) ? this[e].value !== t[e] && (this[e].value = t[e]) : this[e]instanceof vo ? this[e].set(t[e]) : this[e] = t[e])
                }
                ),
                this
            }
        }
        class yo extends Ni {
            constructor(t="stopped") {
                super(),
                this.name = "StateTimeline",
                this._initial = t,
                this.setStateAtTime(this._initial, 0)
            }
            getValueAtTime(t) {
                const e = this.get(t);
                return null !== e ? e.state : this._initial
            }
            setStateAtTime(t, e, s) {
                return ei(e, 0),
                this.add(Object.assign({}, s, {
                    state: t,
                    time: e
                })),
                this
            }
            getLastState(t, e) {
                for (let s = this._search(e); s >= 0; s--) {
                    const e = this._timeline[s];
                    if (e.state === t)
                        return e
                }
            }
            getNextState(t, e) {
                const s = this._search(e);
                if (-1 !== s)
                    for (let e = s; e < this._timeline.length; e++) {
                        const s = this._timeline[e];
                        if (s.state === t)
                            return s
                    }
            }
        }
        class xo extends vo {
            constructor() {
                super(Di(xo.getDefaults(), arguments, ["param", "units", "convert"])),
                this.name = "Param",
                this.overridden = !1,
                this._minOutput = 1e-7;
                const t = Di(xo.getDefaults(), arguments, ["param", "units", "convert"]);
                for (ti(ci(t.param) && (wi(t.param) || t.param instanceof xo), "param must be an AudioParam"); !wi(t.param); )
                    t.param = t.param._param;
                this._swappable = !!ci(t.swappable) && t.swappable,
                this._swappable ? (this.input = this.context.createGain(),
                this._param = t.param,
                this.input.connect(this._param)) : this._param = this.input = t.param,
                this._events = new Ni(1e3),
                this._initialValue = this._param.defaultValue,
                this.units = t.units,
                this.convert = t.convert,
                this._minValue = t.minValue,
                this._maxValue = t.maxValue,
                ci(t.value) && t.value !== this._toType(this._initialValue) && this.setValueAtTime(t.value, 0)
            }
            static getDefaults() {
                return Object.assign(vo.getDefaults(), {
                    convert: !0,
                    units: "number"
                })
            }
            get value() {
                const t = this.now();
                return this.getValueAtTime(t)
            }
            set value(t) {
                this.cancelScheduledValues(this.now()),
                this.setValueAtTime(t, this.now())
            }
            get minValue() {
                return ci(this._minValue) ? this._minValue : "time" === this.units || "frequency" === this.units || "normalRange" === this.units || "positive" === this.units || "transportTime" === this.units || "ticks" === this.units || "bpm" === this.units || "hertz" === this.units || "samples" === this.units ? 0 : "audioRange" === this.units ? -1 : "decibels" === this.units ? -1 / 0 : this._param.minValue
            }
            get maxValue() {
                return ci(this._maxValue) ? this._maxValue : "normalRange" === this.units || "audioRange" === this.units ? 1 : this._param.maxValue
            }
            _is(t, e) {
                return this.units === e
            }
            _assertRange(t) {
                return ci(this.maxValue) && ci(this.minValue) && ei(t, this._fromType(this.minValue), this._fromType(this.maxValue)),
                t
            }
            _fromType(t) {
                return this.convert && !this.overridden ? this._is(t, "time") ? this.toSeconds(t) : this._is(t, "decibels") ? eo(t) : this._is(t, "frequency") ? this.toFrequency(t) : t : this.overridden ? 0 : t
            }
            _toType(t) {
                return this.convert && "decibels" === this.units ? so(t) : t
            }
            setValueAtTime(t, e) {
                const s = this.toSeconds(e)
                  , n = this._fromType(t);
                return ti(isFinite(n) && isFinite(s), `Invalid argument(s) to setValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),
                this._assertRange(n),
                this.log(this.units, "setValueAtTime", t, s),
                this._events.add({
                    time: s,
                    type: "setValueAtTime",
                    value: n
                }),
                this._param.setValueAtTime(n, s),
                this
            }
            getValueAtTime(t) {
                const e = Math.max(this.toSeconds(t), 0)
                  , s = this._events.getAfter(e)
                  , n = this._events.get(e);
                let i = this._initialValue;
                if (null === n)
                    i = this._initialValue;
                else if ("setTargetAtTime" !== n.type || null !== s && "setValueAtTime" !== s.type)
                    if (null === s)
                        i = n.value;
                    else if ("linearRampToValueAtTime" === s.type || "exponentialRampToValueAtTime" === s.type) {
                        let t = n.value;
                        if ("setTargetAtTime" === n.type) {
                            const e = this._events.getBefore(n.time);
                            t = null === e ? this._initialValue : e.value
                        }
                        i = "linearRampToValueAtTime" === s.type ? this._linearInterpolate(n.time, t, s.time, s.value, e) : this._exponentialInterpolate(n.time, t, s.time, s.value, e)
                    } else
                        i = n.value;
                else {
                    const t = this._events.getBefore(n.time);
                    let s;
                    s = null === t ? this._initialValue : t.value,
                    "setTargetAtTime" === n.type && (i = this._exponentialApproach(n.time, s, n.value, n.constant, e))
                }
                return this._toType(i)
            }
            setRampPoint(t) {
                t = this.toSeconds(t);
                let e = this.getValueAtTime(t);
                return this.cancelAndHoldAtTime(t),
                0 === this._fromType(e) && (e = this._toType(this._minOutput)),
                this.setValueAtTime(e, t),
                this
            }
            linearRampToValueAtTime(t, e) {
                const s = this._fromType(t)
                  , n = this.toSeconds(e);
                return ti(isFinite(s) && isFinite(n), `Invalid argument(s) to linearRampToValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),
                this._assertRange(s),
                this._events.add({
                    time: n,
                    type: "linearRampToValueAtTime",
                    value: s
                }),
                this.log(this.units, "linearRampToValueAtTime", t, n),
                this._param.linearRampToValueAtTime(s, n),
                this
            }
            exponentialRampToValueAtTime(t, e) {
                let s = this._fromType(t);
                s = Ii(s, 0) ? this._minOutput : s,
                this._assertRange(s);
                const n = this.toSeconds(e);
                return ti(isFinite(s) && isFinite(n), `Invalid argument(s) to exponentialRampToValueAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),
                this._events.add({
                    time: n,
                    type: "exponentialRampToValueAtTime",
                    value: s
                }),
                this.log(this.units, "exponentialRampToValueAtTime", t, n),
                this._param.exponentialRampToValueAtTime(s, n),
                this
            }
            exponentialRampTo(t, e, s) {
                return s = this.toSeconds(s),
                this.setRampPoint(s),
                this.exponentialRampToValueAtTime(t, s + this.toSeconds(e)),
                this
            }
            linearRampTo(t, e, s) {
                return s = this.toSeconds(s),
                this.setRampPoint(s),
                this.linearRampToValueAtTime(t, s + this.toSeconds(e)),
                this
            }
            targetRampTo(t, e, s) {
                return s = this.toSeconds(s),
                this.setRampPoint(s),
                this.exponentialApproachValueAtTime(t, s, e),
                this
            }
            exponentialApproachValueAtTime(t, e, s) {
                e = this.toSeconds(e),
                s = this.toSeconds(s);
                const n = Math.log(s + 1) / Math.log(200);
                return this.setTargetAtTime(t, e, n),
                this.cancelAndHoldAtTime(e + .9 * s),
                this.linearRampToValueAtTime(t, e + s),
                this
            }
            setTargetAtTime(t, e, s) {
                const n = this._fromType(t);
                ti(isFinite(s) && s > 0, "timeConstant must be a number greater than 0");
                const i = this.toSeconds(e);
                return this._assertRange(n),
                ti(isFinite(n) && isFinite(i), `Invalid argument(s) to setTargetAtTime: ${JSON.stringify(t)}, ${JSON.stringify(e)}`),
                this._events.add({
                    constant: s,
                    time: i,
                    type: "setTargetAtTime",
                    value: n
                }),
                this.log(this.units, "setTargetAtTime", t, i, s),
                this._param.setTargetAtTime(n, i, s),
                this
            }
            setValueCurveAtTime(t, e, s, n=1) {
                s = this.toSeconds(s),
                e = this.toSeconds(e);
                const i = this._fromType(t[0]) * n;
                this.setValueAtTime(this._toType(i), e);
                const o = s / (t.length - 1);
                for (let s = 1; s < t.length; s++) {
                    const i = this._fromType(t[s]) * n;
                    this.linearRampToValueAtTime(this._toType(i), e + s * o)
                }
                return this
            }
            cancelScheduledValues(t) {
                const e = this.toSeconds(t);
                return ti(isFinite(e), "Invalid argument to cancelScheduledValues: " + JSON.stringify(t)),
                this._events.cancel(e),
                this._param.cancelScheduledValues(e),
                this.log(this.units, "cancelScheduledValues", e),
                this
            }
            cancelAndHoldAtTime(t) {
                const e = this.toSeconds(t)
                  , s = this._fromType(this.getValueAtTime(e));
                ti(isFinite(e), "Invalid argument to cancelAndHoldAtTime: " + JSON.stringify(t)),
                this.log(this.units, "cancelAndHoldAtTime", e, "value=" + s);
                const n = this._events.get(e)
                  , i = this._events.getAfter(e);
                return n && Ii(n.time, e) ? i ? (this._param.cancelScheduledValues(i.time),
                this._events.cancel(i.time)) : (this._param.cancelAndHoldAtTime(e),
                this._events.cancel(e + this.sampleTime)) : i && (this._param.cancelScheduledValues(i.time),
                this._events.cancel(i.time),
                "linearRampToValueAtTime" === i.type ? this.linearRampToValueAtTime(this._toType(s), e) : "exponentialRampToValueAtTime" === i.type && this.exponentialRampToValueAtTime(this._toType(s), e)),
                this._events.add({
                    time: e,
                    type: "setValueAtTime",
                    value: s
                }),
                this._param.setValueAtTime(s, e),
                this
            }
            rampTo(t, e=.1, s) {
                return "frequency" === this.units || "bpm" === this.units || "decibels" === this.units ? this.exponentialRampTo(t, e, s) : this.linearRampTo(t, e, s),
                this
            }
            apply(t) {
                const e = this.context.currentTime;
                t.setValueAtTime(this.getValueAtTime(e), e);
                const s = this._events.get(e);
                if (s && "setTargetAtTime" === s.type) {
                    const n = this._events.getAfter(s.time)
                      , i = n ? n.time : e + 2
                      , o = (i - e) / 10;
                    for (let s = e; s < i; s += o)
                        t.linearRampToValueAtTime(this.getValueAtTime(s), s)
                }
                return this._events.forEachAfter(this.context.currentTime, e=>{
                    "cancelScheduledValues" === e.type ? t.cancelScheduledValues(e.time) : "setTargetAtTime" === e.type ? t.setTargetAtTime(e.value, e.time, e.constant) : t[e.type](e.value, e.time)
                }
                ),
                this
            }
            setParam(t) {
                ti(this._swappable, "The Param must be assigned as 'swappable' in the constructor");
                const e = this.input;
                return e.disconnect(this._param),
                this.apply(t),
                this._param = t,
                e.connect(this._param),
                this
            }
            dispose() {
                return super.dispose(),
                this._events.dispose(),
                this
            }
            get defaultValue() {
                return this._toType(this._param.defaultValue)
            }
            _exponentialApproach(t, e, s, n, i) {
                return s + (e - s) * Math.exp(-(i - t) / n)
            }
            _linearInterpolate(t, e, s, n, i) {
                return e + (i - t) / (s - t) * (n - e)
            }
            _exponentialInterpolate(t, e, s, n, i) {
                return e * Math.pow(n / e, (i - t) / (s - t))
            }
        }
        class wo extends vo {
            constructor() {
                super(...arguments),
                this.name = "ToneAudioNode",
                this._internalChannels = []
            }
            get numberOfInputs() {
                return ci(this.input) ? wi(this.input) || this.input instanceof xo ? 1 : this.input.numberOfInputs : 0
            }
            get numberOfOutputs() {
                return ci(this.output) ? this.output.numberOfOutputs : 0
            }
            _isAudioNode(t) {
                return ci(t) && (t instanceof wo || bi(t))
            }
            _getInternalNodes() {
                const t = this._internalChannels.slice(0);
                return this._isAudioNode(this.input) && t.push(this.input),
                this._isAudioNode(this.output) && this.input !== this.output && t.push(this.output),
                t
            }
            _setChannelProperties(t) {
                this._getInternalNodes().forEach(e=>{
                    e.channelCount = t.channelCount,
                    e.channelCountMode = t.channelCountMode,
                    e.channelInterpretation = t.channelInterpretation
                }
                )
            }
            _getChannelProperties() {
                const t = this._getInternalNodes();
                ti(t.length > 0, "ToneAudioNode does not have any internal nodes");
                const e = t[0];
                return {
                    channelCount: e.channelCount,
                    channelCountMode: e.channelCountMode,
                    channelInterpretation: e.channelInterpretation
                }
            }
            get channelCount() {
                return this._getChannelProperties().channelCount
            }
            set channelCount(t) {
                const e = this._getChannelProperties();
                this._setChannelProperties(Object.assign(e, {
                    channelCount: t
                }))
            }
            get channelCountMode() {
                return this._getChannelProperties().channelCountMode
            }
            set channelCountMode(t) {
                const e = this._getChannelProperties();
                this._setChannelProperties(Object.assign(e, {
                    channelCountMode: t
                }))
            }
            get channelInterpretation() {
                return this._getChannelProperties().channelInterpretation
            }
            set channelInterpretation(t) {
                const e = this._getChannelProperties();
                this._setChannelProperties(Object.assign(e, {
                    channelInterpretation: t
                }))
            }
            connect(t, e=0, s=0) {
                return To(this, t, e, s),
                this
            }
            toDestination() {
                return this.connect(this.context.destination),
                this
            }
            toMaster() {
                return ri("toMaster() has been renamed toDestination()"),
                this.toDestination()
            }
            disconnect(t, e=0, s=0) {
                return So(this, t, e, s),
                this
            }
            chain(...t) {
                return bo(this, ...t),
                this
            }
            fan(...t) {
                return t.forEach(t=>this.connect(t)),
                this
            }
            dispose() {
                return super.dispose(),
                ci(this.input) && (this.input instanceof wo ? this.input.dispose() : bi(this.input) && this.input.disconnect()),
                ci(this.output) && (this.output instanceof wo ? this.output.dispose() : bi(this.output) && this.output.disconnect()),
                this._internalChannels = [],
                this
            }
        }
        function bo(...t) {
            const e = t.shift();
            t.reduce((t,e)=>(t instanceof wo ? t.connect(e) : bi(t) && To(t, e),
            e), e)
        }
        function To(t, e, s=0, n=0) {
            for (ti(ci(t), "Cannot connect from undefined node"),
            ti(ci(e), "Cannot connect to undefined node"),
            (e instanceof wo || bi(e)) && ti(e.numberOfInputs > 0, "Cannot connect to node with no inputs"),
            ti(t.numberOfOutputs > 0, "Cannot connect from node with no outputs"); e instanceof wo || e instanceof xo; )
                ci(e.input) && (e = e.input);
            for (; t instanceof wo; )
                ci(t.output) && (t = t.output);
            wi(e) ? t.connect(e, s) : t.connect(e, s, n)
        }
        function So(t, e, s=0, n=0) {
            if (ci(e))
                for (; e instanceof wo; )
                    e = e.input;
            for (; !bi(t); )
                ci(t.output) && (t = t.output);
            wi(e) ? t.disconnect(e, s) : bi(e) ? t.disconnect(e, s, n) : t.disconnect()
        }
        class ko extends wo {
            constructor() {
                super(Di(ko.getDefaults(), arguments, ["gain", "units"])),
                this.name = "Gain",
                this._gainNode = this.context.createGain(),
                this.input = this._gainNode,
                this.output = this._gainNode;
                const t = Di(ko.getDefaults(), arguments, ["gain", "units"]);
                this.gain = new xo({
                    context: this.context,
                    convert: t.convert,
                    param: this._gainNode.gain,
                    units: t.units,
                    value: t.gain,
                    minValue: t.minValue,
                    maxValue: t.maxValue
                }),
                Ui(this, "gain")
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    convert: !0,
                    gain: 1,
                    units: "gain"
                })
            }
            dispose() {
                return super.dispose(),
                this._gainNode.disconnect(),
                this.gain.dispose(),
                this
            }
        }
        class Co extends wo {
            constructor(t) {
                super(t),
                this.onended = Zi,
                this._startTime = -1,
                this._stopTime = -1,
                this._timeout = -1,
                this.output = new ko({
                    context: this.context,
                    gain: 0
                }),
                this._gainNode = this.output,
                this.getStateAtTime = function(t) {
                    const e = this.toSeconds(t);
                    return -1 !== this._startTime && e >= this._startTime && (-1 === this._stopTime || e <= this._stopTime) ? "started" : "stopped"
                }
                ,
                this._fadeIn = t.fadeIn,
                this._fadeOut = t.fadeOut,
                this._curve = t.curve,
                this.onended = t.onended
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    curve: "linear",
                    fadeIn: 0,
                    fadeOut: 0,
                    onended: Zi
                })
            }
            _startGain(t, e=1) {
                ti(-1 === this._startTime, "Source cannot be started more than once");
                const s = this.toSeconds(this._fadeIn);
                return this._startTime = t + s,
                this._startTime = Math.max(this._startTime, this.context.currentTime),
                s > 0 ? (this._gainNode.gain.setValueAtTime(0, t),
                "linear" === this._curve ? this._gainNode.gain.linearRampToValueAtTime(e, t + s) : this._gainNode.gain.exponentialApproachValueAtTime(e, t, s)) : this._gainNode.gain.setValueAtTime(e, t),
                this
            }
            stop(t) {
                return this.log("stop", t),
                this._stopGain(this.toSeconds(t)),
                this
            }
            _stopGain(t) {
                ti(-1 !== this._startTime, "'start' must be called before 'stop'"),
                this.cancelStop();
                const e = this.toSeconds(this._fadeOut);
                return this._stopTime = this.toSeconds(t) + e,
                this._stopTime = Math.max(this._stopTime, this.context.currentTime),
                e > 0 ? "linear" === this._curve ? this._gainNode.gain.linearRampTo(0, e, t) : this._gainNode.gain.targetRampTo(0, e, t) : (this._gainNode.gain.cancelAndHoldAtTime(t),
                this._gainNode.gain.setValueAtTime(0, t)),
                this.context.clearTimeout(this._timeout),
                this._timeout = this.context.setTimeout(()=>{
                    const t = "exponential" === this._curve ? 2 * e : 0;
                    this._stopSource(this.now() + t),
                    this._onended()
                }
                , this._stopTime - this.context.currentTime),
                this
            }
            _onended() {
                if (this.onended !== Zi && (this.onended(this),
                this.onended = Zi,
                !this.context.isOffline)) {
                    const t = ()=>this.dispose();
                    void 0 !== window.requestIdleCallback ? window.requestIdleCallback(t) : setTimeout(t, 1e3)
                }
            }
            get state() {
                return this.getStateAtTime(this.now())
            }
            cancelStop() {
                return this.log("cancelStop"),
                ti(-1 !== this._startTime, "Source is not started"),
                this._gainNode.gain.cancelScheduledValues(this._startTime + this.sampleTime),
                this.context.clearTimeout(this._timeout),
                this._stopTime = -1,
                this
            }
            dispose() {
                return super.dispose(),
                this._gainNode.disconnect(),
                this
            }
        }
        class Ao extends Co {
            constructor() {
                super(Di(Ao.getDefaults(), arguments, ["offset"])),
                this.name = "ToneConstantSource",
                this._source = this.context.createConstantSource();
                const t = Di(Ao.getDefaults(), arguments, ["offset"]);
                To(this._source, this._gainNode),
                this.offset = new xo({
                    context: this.context,
                    convert: t.convert,
                    param: this._source.offset,
                    units: t.units,
                    value: t.offset,
                    minValue: t.minValue,
                    maxValue: t.maxValue
                })
            }
            static getDefaults() {
                return Object.assign(Co.getDefaults(), {
                    convert: !0,
                    offset: 1,
                    units: "number"
                })
            }
            start(t) {
                const e = this.toSeconds(t);
                return this.log("start", e),
                this._startGain(e),
                this._source.start(e),
                this
            }
            _stopSource(t) {
                this._source.stop(t)
            }
            dispose() {
                return super.dispose(),
                "started" === this.state && this.stop(),
                this._source.disconnect(),
                this.offset.dispose(),
                this
            }
        }
        class Do extends wo {
            constructor() {
                super(Di(Do.getDefaults(), arguments, ["value", "units"])),
                this.name = "Signal",
                this.override = !0;
                const t = Di(Do.getDefaults(), arguments, ["value", "units"]);
                this.output = this._constantSource = new Ao({
                    context: this.context,
                    convert: t.convert,
                    offset: t.value,
                    units: t.units,
                    minValue: t.minValue,
                    maxValue: t.maxValue
                }),
                this._constantSource.start(0),
                this.input = this._param = this._constantSource.offset
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    convert: !0,
                    units: "number",
                    value: 0
                })
            }
            connect(t, e=0, s=0) {
                return Oo(this, t, e, s),
                this
            }
            dispose() {
                return super.dispose(),
                this._param.dispose(),
                this._constantSource.dispose(),
                this
            }
            setValueAtTime(t, e) {
                return this._param.setValueAtTime(t, e),
                this
            }
            getValueAtTime(t) {
                return this._param.getValueAtTime(t)
            }
            setRampPoint(t) {
                return this._param.setRampPoint(t),
                this
            }
            linearRampToValueAtTime(t, e) {
                return this._param.linearRampToValueAtTime(t, e),
                this
            }
            exponentialRampToValueAtTime(t, e) {
                return this._param.exponentialRampToValueAtTime(t, e),
                this
            }
            exponentialRampTo(t, e, s) {
                return this._param.exponentialRampTo(t, e, s),
                this
            }
            linearRampTo(t, e, s) {
                return this._param.linearRampTo(t, e, s),
                this
            }
            targetRampTo(t, e, s) {
                return this._param.targetRampTo(t, e, s),
                this
            }
            exponentialApproachValueAtTime(t, e, s) {
                return this._param.exponentialApproachValueAtTime(t, e, s),
                this
            }
            setTargetAtTime(t, e, s) {
                return this._param.setTargetAtTime(t, e, s),
                this
            }
            setValueCurveAtTime(t, e, s, n) {
                return this._param.setValueCurveAtTime(t, e, s, n),
                this
            }
            cancelScheduledValues(t) {
                return this._param.cancelScheduledValues(t),
                this
            }
            cancelAndHoldAtTime(t) {
                return this._param.cancelAndHoldAtTime(t),
                this
            }
            rampTo(t, e, s) {
                return this._param.rampTo(t, e, s),
                this
            }
            get value() {
                return this._param.value
            }
            set value(t) {
                this._param.value = t
            }
            get convert() {
                return this._param.convert
            }
            set convert(t) {
                this._param.convert = t
            }
            get units() {
                return this._param.units
            }
            get overridden() {
                return this._param.overridden
            }
            set overridden(t) {
                this._param.overridden = t
            }
            get maxValue() {
                return this._param.maxValue
            }
            get minValue() {
                return this._param.minValue
            }
            apply(t) {
                return this._param.apply(t),
                this
            }
        }
        function Oo(t, e, s, n) {
            (e instanceof xo || wi(e) || e instanceof Do && e.override) && (e.cancelScheduledValues(0),
            e.setValueAtTime(0, 0),
            e instanceof Do && (e.overridden = !0)),
            To(t, e, s, n)
        }
        class Mo extends xo {
            constructor() {
                super(Di(Mo.getDefaults(), arguments, ["value"])),
                this.name = "TickParam",
                this._events = new Ni(1 / 0),
                this._multiplier = 1;
                const t = Di(Mo.getDefaults(), arguments, ["value"]);
                this._multiplier = t.multiplier,
                this._events.cancel(0),
                this._events.add({
                    ticks: 0,
                    time: 0,
                    type: "setValueAtTime",
                    value: this._fromType(t.value)
                }),
                this.setValueAtTime(t.value, 0)
            }
            static getDefaults() {
                return Object.assign(xo.getDefaults(), {
                    multiplier: 1,
                    units: "hertz",
                    value: 1
                })
            }
            setTargetAtTime(t, e, s) {
                e = this.toSeconds(e),
                this.setRampPoint(e);
                const n = this._fromType(t)
                  , i = this._events.get(e)
                  , o = Math.round(Math.max(1 / s, 1));
                for (let t = 0; t <= o; t++) {
                    const o = s * t + e
                      , r = this._exponentialApproach(i.time, i.value, n, s, o);
                    this.linearRampToValueAtTime(this._toType(r), o)
                }
                return this
            }
            setValueAtTime(t, e) {
                const s = this.toSeconds(e);
                super.setValueAtTime(t, e);
                const n = this._events.get(s)
                  , i = this._events.previousEvent(n)
                  , o = this._getTicksUntilEvent(i, s);
                return n.ticks = Math.max(o, 0),
                this
            }
            linearRampToValueAtTime(t, e) {
                const s = this.toSeconds(e);
                super.linearRampToValueAtTime(t, e);
                const n = this._events.get(s)
                  , i = this._events.previousEvent(n)
                  , o = this._getTicksUntilEvent(i, s);
                return n.ticks = Math.max(o, 0),
                this
            }
            exponentialRampToValueAtTime(t, e) {
                e = this.toSeconds(e);
                const s = this._fromType(t)
                  , n = this._events.get(e)
                  , i = Math.round(Math.max(10 * (e - n.time), 1))
                  , o = (e - n.time) / i;
                for (let t = 0; t <= i; t++) {
                    const i = o * t + n.time
                      , r = this._exponentialInterpolate(n.time, n.value, e, s, i);
                    this.linearRampToValueAtTime(this._toType(r), i)
                }
                return this
            }
            _getTicksUntilEvent(t, e) {
                if (null === t)
                    t = {
                        ticks: 0,
                        time: 0,
                        type: "setValueAtTime",
                        value: 0
                    };
                else if (ai(t.ticks)) {
                    const e = this._events.previousEvent(t);
                    t.ticks = this._getTicksUntilEvent(e, t.time)
                }
                const s = this._fromType(this.getValueAtTime(t.time));
                let n = this._fromType(this.getValueAtTime(e));
                const i = this._events.get(e);
                return i && i.time === e && "setValueAtTime" === i.type && (n = this._fromType(this.getValueAtTime(e - this.sampleTime))),
                .5 * (e - t.time) * (s + n) + t.ticks
            }
            getTicksAtTime(t) {
                const e = this.toSeconds(t)
                  , s = this._events.get(e);
                return Math.max(this._getTicksUntilEvent(s, e), 0)
            }
            getDurationOfTicks(t, e) {
                const s = this.toSeconds(e)
                  , n = this.getTicksAtTime(e);
                return this.getTimeOfTick(n + t) - s
            }
            getTimeOfTick(t) {
                const e = this._events.get(t, "ticks")
                  , s = this._events.getAfter(t, "ticks");
                if (e && e.ticks === t)
                    return e.time;
                if (e && s && "linearRampToValueAtTime" === s.type && e.value !== s.value) {
                    const n = this._fromType(this.getValueAtTime(e.time))
                      , i = (this._fromType(this.getValueAtTime(s.time)) - n) / (s.time - e.time)
                      , o = Math.sqrt(Math.pow(n, 2) - 2 * i * (e.ticks - t))
                      , r = (-n + o) / i
                      , a = (-n - o) / i;
                    return (r > 0 ? r : a) + e.time
                }
                return e ? 0 === e.value ? 1 / 0 : e.time + (t - e.ticks) / e.value : t / this._initialValue
            }
            ticksToTime(t, e) {
                return this.getDurationOfTicks(t, e)
            }
            timeToTicks(t, e) {
                const s = this.toSeconds(e)
                  , n = this.toSeconds(t)
                  , i = this.getTicksAtTime(s);
                return this.getTicksAtTime(s + n) - i
            }
            _fromType(t) {
                return "bpm" === this.units && this.multiplier ? 1 / (60 / t / this.multiplier) : super._fromType(t)
            }
            _toType(t) {
                return "bpm" === this.units && this.multiplier ? t / this.multiplier * 60 : super._toType(t)
            }
            get multiplier() {
                return this._multiplier
            }
            set multiplier(t) {
                const e = this.value;
                this._multiplier = t,
                this.cancelScheduledValues(0),
                this.setValueAtTime(e, 0)
            }
        }
        class Eo extends Do {
            constructor() {
                super(Di(Eo.getDefaults(), arguments, ["value"])),
                this.name = "TickSignal";
                const t = Di(Eo.getDefaults(), arguments, ["value"]);
                this.input = this._param = new Mo({
                    context: this.context,
                    convert: t.convert,
                    multiplier: t.multiplier,
                    param: this._constantSource.offset,
                    units: t.units,
                    value: t.value
                })
            }
            static getDefaults() {
                return Object.assign(Do.getDefaults(), {
                    multiplier: 1,
                    units: "hertz",
                    value: 1
                })
            }
            ticksToTime(t, e) {
                return this._param.ticksToTime(t, e)
            }
            timeToTicks(t, e) {
                return this._param.timeToTicks(t, e)
            }
            getTimeOfTick(t) {
                return this._param.getTimeOfTick(t)
            }
            getDurationOfTicks(t, e) {
                return this._param.getDurationOfTicks(t, e)
            }
            getTicksAtTime(t) {
                return this._param.getTicksAtTime(t)
            }
            get multiplier() {
                return this._param.multiplier
            }
            set multiplier(t) {
                this._param.multiplier = t
            }
            dispose() {
                return super.dispose(),
                this._param.dispose(),
                this
            }
        }
        class Ro extends vo {
            constructor() {
                super(Di(Ro.getDefaults(), arguments, ["frequency"])),
                this.name = "TickSource",
                this._state = new yo,
                this._tickOffset = new Ni;
                const t = Di(Ro.getDefaults(), arguments, ["frequency"]);
                this.frequency = new Eo({
                    context: this.context,
                    units: t.units,
                    value: t.frequency
                }),
                Ui(this, "frequency"),
                this._state.setStateAtTime("stopped", 0),
                this.setTicksAtTime(0, 0)
            }
            static getDefaults() {
                return Object.assign({
                    frequency: 1,
                    units: "hertz"
                }, vo.getDefaults())
            }
            get state() {
                return this.getStateAtTime(this.now())
            }
            start(t, e) {
                const s = this.toSeconds(t);
                return "started" !== this._state.getValueAtTime(s) && (this._state.setStateAtTime("started", s),
                ci(e) && this.setTicksAtTime(e, s)),
                this
            }
            stop(t) {
                const e = this.toSeconds(t);
                if ("stopped" === this._state.getValueAtTime(e)) {
                    const t = this._state.get(e);
                    t && t.time > 0 && (this._tickOffset.cancel(t.time),
                    this._state.cancel(t.time))
                }
                return this._state.cancel(e),
                this._state.setStateAtTime("stopped", e),
                this.setTicksAtTime(0, e),
                this
            }
            pause(t) {
                const e = this.toSeconds(t);
                return "started" === this._state.getValueAtTime(e) && this._state.setStateAtTime("paused", e),
                this
            }
            cancel(t) {
                return t = this.toSeconds(t),
                this._state.cancel(t),
                this._tickOffset.cancel(t),
                this
            }
            getTicksAtTime(t) {
                const e = this.toSeconds(t)
                  , s = this._state.getLastState("stopped", e)
                  , n = {
                    state: "paused",
                    time: e
                };
                this._state.add(n);
                let i = s
                  , o = 0;
                return this._state.forEachBetween(s.time, e + this.sampleTime, t=>{
                    let e = i.time;
                    const s = this._tickOffset.get(t.time);
                    s && s.time >= i.time && (o = s.ticks,
                    e = s.time),
                    "started" === i.state && "started" !== t.state && (o += this.frequency.getTicksAtTime(t.time) - this.frequency.getTicksAtTime(e)),
                    i = t
                }
                ),
                this._state.remove(n),
                o
            }
            get ticks() {
                return this.getTicksAtTime(this.now())
            }
            set ticks(t) {
                this.setTicksAtTime(t, this.now())
            }
            get seconds() {
                return this.getSecondsAtTime(this.now())
            }
            set seconds(t) {
                const e = this.now()
                  , s = this.frequency.timeToTicks(t, e);
                this.setTicksAtTime(s, e)
            }
            getSecondsAtTime(t) {
                t = this.toSeconds(t);
                const e = this._state.getLastState("stopped", t)
                  , s = {
                    state: "paused",
                    time: t
                };
                this._state.add(s);
                let n = e
                  , i = 0;
                return this._state.forEachBetween(e.time, t + this.sampleTime, t=>{
                    let e = n.time;
                    const s = this._tickOffset.get(t.time);
                    s && s.time >= n.time && (i = s.seconds,
                    e = s.time),
                    "started" === n.state && "started" !== t.state && (i += t.time - e),
                    n = t
                }
                ),
                this._state.remove(s),
                i
            }
            setTicksAtTime(t, e) {
                return e = this.toSeconds(e),
                this._tickOffset.cancel(e),
                this._tickOffset.add({
                    seconds: this.frequency.getDurationOfTicks(t, e),
                    ticks: t,
                    time: e
                }),
                this
            }
            getStateAtTime(t) {
                return t = this.toSeconds(t),
                this._state.getValueAtTime(t)
            }
            getTimeOfTick(t, e=this.now()) {
                const s = this._tickOffset.get(e)
                  , n = this._state.get(e)
                  , i = Math.max(s.time, n.time)
                  , o = this.frequency.getTicksAtTime(i) + t - s.ticks;
                return this.frequency.getTimeOfTick(o)
            }
            forEachTickBetween(t, e, s) {
                let n = this._state.get(t);
                this._state.forEachBetween(t, e, e=>{
                    n && "started" === n.state && "started" !== e.state && this.forEachTickBetween(Math.max(n.time, t), e.time - this.sampleTime, s),
                    n = e
                }
                );
                let i = null;
                if (n && "started" === n.state) {
                    const o = Math.max(n.time, t)
                      , r = this.frequency.getTicksAtTime(o)
                      , a = r - this.frequency.getTicksAtTime(n.time);
                    let c = Math.ceil(a) - a;
                    c = Ii(c, 1) ? 0 : c;
                    let h = this.frequency.getTimeOfTick(r + c);
                    for (; h < e; ) {
                        try {
                            s(h, Math.round(this.getTicksAtTime(h)))
                        } catch (t) {
                            i = t;
                            break
                        }
                        h += this.frequency.getDurationOfTicks(1, h)
                    }
                }
                if (i)
                    throw i;
                return this
            }
            dispose() {
                return super.dispose(),
                this._state.dispose(),
                this._tickOffset.dispose(),
                this.frequency.dispose(),
                this
            }
        }
        class qo extends vo {
            constructor() {
                super(Di(qo.getDefaults(), arguments, ["callback", "frequency"])),
                this.name = "Clock",
                this.callback = Zi,
                this._lastUpdate = 0,
                this._state = new yo("stopped"),
                this._boundLoop = this._loop.bind(this);
                const t = Di(qo.getDefaults(), arguments, ["callback", "frequency"]);
                this.callback = t.callback,
                this._tickSource = new Ro({
                    context: this.context,
                    frequency: t.frequency,
                    units: t.units
                }),
                this._lastUpdate = 0,
                this.frequency = this._tickSource.frequency,
                Ui(this, "frequency"),
                this._state.setStateAtTime("stopped", 0),
                this.context.on("tick", this._boundLoop)
            }
            static getDefaults() {
                return Object.assign(vo.getDefaults(), {
                    callback: Zi,
                    frequency: 1,
                    units: "hertz"
                })
            }
            get state() {
                return this._state.getValueAtTime(this.now())
            }
            start(t, e) {
                si(this.context);
                const s = this.toSeconds(t);
                return this.log("start", s),
                "started" !== this._state.getValueAtTime(s) && (this._state.setStateAtTime("started", s),
                this._tickSource.start(s, e),
                s < this._lastUpdate && this.emit("start", s, e)),
                this
            }
            stop(t) {
                const e = this.toSeconds(t);
                return this.log("stop", e),
                this._state.cancel(e),
                this._state.setStateAtTime("stopped", e),
                this._tickSource.stop(e),
                e < this._lastUpdate && this.emit("stop", e),
                this
            }
            pause(t) {
                const e = this.toSeconds(t);
                return "started" === this._state.getValueAtTime(e) && (this._state.setStateAtTime("paused", e),
                this._tickSource.pause(e),
                e < this._lastUpdate && this.emit("pause", e)),
                this
            }
            get ticks() {
                return Math.ceil(this.getTicksAtTime(this.now()))
            }
            set ticks(t) {
                this._tickSource.ticks = t
            }
            get seconds() {
                return this._tickSource.seconds
            }
            set seconds(t) {
                this._tickSource.seconds = t
            }
            getSecondsAtTime(t) {
                return this._tickSource.getSecondsAtTime(t)
            }
            setTicksAtTime(t, e) {
                return this._tickSource.setTicksAtTime(t, e),
                this
            }
            getTimeOfTick(t, e=this.now()) {
                return this._tickSource.getTimeOfTick(t, e)
            }
            getTicksAtTime(t) {
                return this._tickSource.getTicksAtTime(t)
            }
            nextTickTime(t, e) {
                const s = this.toSeconds(e)
                  , n = this.getTicksAtTime(s);
                return this._tickSource.getTimeOfTick(n + t, s)
            }
            _loop() {
                const t = this._lastUpdate
                  , e = this.now();
                this._lastUpdate = e,
                this.log("loop", t, e),
                t !== e && (this._state.forEachBetween(t, e, t=>{
                    switch (t.state) {
                    case "started":
                        const e = this._tickSource.getTicksAtTime(t.time);
                        this.emit("start", t.time, e);
                        break;
                    case "stopped":
                        0 !== t.time && this.emit("stop", t.time);
                        break;
                    case "paused":
                        this.emit("pause", t.time)
                    }
                }
                ),
                this._tickSource.forEachTickBetween(t, e, (t,e)=>{
                    this.callback(t, e)
                }
                ))
            }
            getStateAtTime(t) {
                const e = this.toSeconds(t);
                return this._state.getValueAtTime(e)
            }
            dispose() {
                return super.dispose(),
                this.context.off("tick", this._boundLoop),
                this._tickSource.dispose(),
                this._state.dispose(),
                this
            }
        }
        Bi.mixin(qo);
        class Fo extends wo {
            constructor() {
                super(Di(Fo.getDefaults(), arguments, ["delayTime", "maxDelay"])),
                this.name = "Delay";
                const t = Di(Fo.getDefaults(), arguments, ["delayTime", "maxDelay"])
                  , e = this.toSeconds(t.maxDelay);
                this._maxDelay = Math.max(e, this.toSeconds(t.delayTime)),
                this._delayNode = this.input = this.output = this.context.createDelay(e),
                this.delayTime = new xo({
                    context: this.context,
                    param: this._delayNode.delayTime,
                    units: "time",
                    value: t.delayTime,
                    minValue: 0,
                    maxValue: this.maxDelay
                }),
                Ui(this, "delayTime")
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    delayTime: 0,
                    maxDelay: 1
                })
            }
            get maxDelay() {
                return this._maxDelay
            }
            dispose() {
                return super.dispose(),
                this._delayNode.disconnect(),
                this.delayTime.dispose(),
                this
            }
        }
        function Io(t, e, s=2, n=Ji().sampleRate) {
            return yi(this, void 0, void 0, (function*() {
                const i = Ji()
                  , o = new Yi(s,e,n);
                Ki(o),
                yield t(o);
                const r = o.render();
                Ki(i);
                const a = yield r;
                return new Xi(a)
            }
            ))
        }
        class Vo extends Ei {
            constructor() {
                super(),
                this.name = "ToneAudioBuffers",
                this._buffers = new Map,
                this._loadingCount = 0;
                const t = Di(Vo.getDefaults(), arguments, ["urls", "onload", "baseUrl"], "urls");
                this.baseUrl = t.baseUrl,
                Object.keys(t.urls).forEach(e=>{
                    this._loadingCount++;
                    const s = t.urls[e];
                    this.add(e, s, this._bufferLoaded.bind(this, t.onload), t.onerror)
                }
                )
            }
            static getDefaults() {
                return {
                    baseUrl: "",
                    onerror: Zi,
                    onload: Zi,
                    urls: {}
                }
            }
            has(t) {
                return this._buffers.has(t.toString())
            }
            get(t) {
                return ti(this.has(t), "ToneAudioBuffers has no buffer named: " + t),
                this._buffers.get(t.toString())
            }
            _bufferLoaded(t) {
                this._loadingCount--,
                0 === this._loadingCount && t && t()
            }
            get loaded() {
                return Array.from(this._buffers).every(([t,e])=>e.loaded)
            }
            add(t, e, s=Zi, n=Zi) {
                return fi(e) ? this._buffers.set(t.toString(), new Xi(this.baseUrl + e,s,n)) : this._buffers.set(t.toString(), new Xi(e,s,n)),
                this
            }
            dispose() {
                return super.dispose(),
                this._buffers.forEach(t=>t.dispose()),
                this._buffers.clear(),
                this
            }
        }
        class No extends lo {
            constructor() {
                super(...arguments),
                this.name = "MidiClass",
                this.defaultUnits = "midi"
            }
            _frequencyToUnits(t) {
                return oo(super._frequencyToUnits(t))
            }
            _ticksToUnits(t) {
                return oo(super._ticksToUnits(t))
            }
            _beatsToUnits(t) {
                return oo(super._beatsToUnits(t))
            }
            _secondsToUnits(t) {
                return oo(super._secondsToUnits(t))
            }
            toMidi() {
                return this.valueOf()
            }
            toFrequency() {
                return ao(this.toMidi())
            }
            transpose(t) {
                return new No(this.context,this.toMidi() + t)
            }
        }
        function Po(t, e) {
            return new No(Ji(),t,e)
        }
        class jo extends mo {
            constructor() {
                super(...arguments),
                this.name = "Ticks",
                this.defaultUnits = "i"
            }
            _now() {
                return this.context.transport.ticks
            }
            _beatsToUnits(t) {
                return this._getPPQ() * t
            }
            _secondsToUnits(t) {
                return Math.floor(t / (60 / this._getBpm()) * this._getPPQ())
            }
            _ticksToUnits(t) {
                return t
            }
            toTicks() {
                return this.valueOf()
            }
            toSeconds() {
                return this.valueOf() / this._getPPQ() * (60 / this._getBpm())
            }
        }
        function Lo(t, e) {
            return new jo(Ji(),t,e)
        }
        class zo extends vo {
            constructor() {
                super(...arguments),
                this.name = "Draw",
                this.expiration = .25,
                this.anticipation = .008,
                this._events = new Ni,
                this._boundDrawLoop = this._drawLoop.bind(this),
                this._animationFrame = -1
            }
            schedule(t, e) {
                return this._events.add({
                    callback: t,
                    time: this.toSeconds(e)
                }),
                1 === this._events.length && (this._animationFrame = requestAnimationFrame(this._boundDrawLoop)),
                this
            }
            cancel(t) {
                return this._events.cancel(this.toSeconds(t)),
                this
            }
            _drawLoop() {
                const t = this.context.currentTime;
                for (; this._events.length && this._events.peek().time - this.anticipation <= t; ) {
                    const e = this._events.shift();
                    e && t - e.time <= this.expiration && e.callback()
                }
                this._events.length > 0 && (this._animationFrame = requestAnimationFrame(this._boundDrawLoop))
            }
            dispose() {
                return super.dispose(),
                this._events.dispose(),
                cancelAnimationFrame(this._animationFrame),
                this
            }
        }
        ji(t=>{
            t.draw = new zo({
                context: t
            })
        }
        ),
        zi(t=>{
            t.draw.dispose()
        }
        );
        class Bo extends Ei {
            constructor() {
                super(...arguments),
                this.name = "IntervalTimeline",
                this._root = null,
                this._length = 0
            }
            add(t) {
                ti(ci(t.time), "Events must have a time property"),
                ti(ci(t.duration), "Events must have a duration parameter"),
                t.time = t.time.valueOf();
                let e = new Wo(t.time,t.time + t.duration,t);
                for (null === this._root ? this._root = e : this._root.insert(e),
                this._length++; null !== e; )
                    e.updateHeight(),
                    e.updateMax(),
                    this._rebalance(e),
                    e = e.parent;
                return this
            }
            remove(t) {
                if (null !== this._root) {
                    const e = [];
                    this._root.search(t.time, e);
                    for (const s of e)
                        if (s.event === t) {
                            this._removeNode(s),
                            this._length--;
                            break
                        }
                }
                return this
            }
            get length() {
                return this._length
            }
            cancel(t) {
                return this.forEachFrom(t, t=>this.remove(t)),
                this
            }
            _setRoot(t) {
                this._root = t,
                null !== this._root && (this._root.parent = null)
            }
            _replaceNodeInParent(t, e) {
                null !== t.parent ? (t.isLeftChild() ? t.parent.left = e : t.parent.right = e,
                this._rebalance(t.parent)) : this._setRoot(e)
            }
            _removeNode(t) {
                if (null === t.left && null === t.right)
                    this._replaceNodeInParent(t, null);
                else if (null === t.right)
                    this._replaceNodeInParent(t, t.left);
                else if (null === t.left)
                    this._replaceNodeInParent(t, t.right);
                else {
                    let e, s = null;
                    if (t.getBalance() > 0)
                        if (null === t.left.right)
                            e = t.left,
                            e.right = t.right,
                            s = e;
                        else {
                            for (e = t.left.right; null !== e.right; )
                                e = e.right;
                            e.parent && (e.parent.right = e.left,
                            s = e.parent,
                            e.left = t.left,
                            e.right = t.right)
                        }
                    else if (null === t.right.left)
                        e = t.right,
                        e.left = t.left,
                        s = e;
                    else {
                        for (e = t.right.left; null !== e.left; )
                            e = e.left;
                        e.parent && (e.parent.left = e.right,
                        s = e.parent,
                        e.left = t.left,
                        e.right = t.right)
                    }
                    null !== t.parent ? t.isLeftChild() ? t.parent.left = e : t.parent.right = e : this._setRoot(e),
                    s && this._rebalance(s)
                }
                t.dispose()
            }
            _rotateLeft(t) {
                const e = t.parent
                  , s = t.isLeftChild()
                  , n = t.right;
                n && (t.right = n.left,
                n.left = t),
                null !== e ? s ? e.left = n : e.right = n : this._setRoot(n)
            }
            _rotateRight(t) {
                const e = t.parent
                  , s = t.isLeftChild()
                  , n = t.left;
                n && (t.left = n.right,
                n.right = t),
                null !== e ? s ? e.left = n : e.right = n : this._setRoot(n)
            }
            _rebalance(t) {
                const e = t.getBalance();
                e > 1 && t.left ? t.left.getBalance() < 0 ? this._rotateLeft(t.left) : this._rotateRight(t) : e < -1 && t.right && (t.right.getBalance() > 0 ? this._rotateRight(t.right) : this._rotateLeft(t))
            }
            get(t) {
                if (null !== this._root) {
                    const e = [];
                    if (this._root.search(t, e),
                    e.length > 0) {
                        let t = e[0];
                        for (let s = 1; s < e.length; s++)
                            e[s].low > t.low && (t = e[s]);
                        return t.event
                    }
                }
                return null
            }
            forEach(t) {
                if (null !== this._root) {
                    const e = [];
                    this._root.traverse(t=>e.push(t)),
                    e.forEach(e=>{
                        e.event && t(e.event)
                    }
                    )
                }
                return this
            }
            forEachAtTime(t, e) {
                if (null !== this._root) {
                    const s = [];
                    this._root.search(t, s),
                    s.forEach(t=>{
                        t.event && e(t.event)
                    }
                    )
                }
                return this
            }
            forEachFrom(t, e) {
                if (null !== this._root) {
                    const s = [];
                    this._root.searchAfter(t, s),
                    s.forEach(t=>{
                        t.event && e(t.event)
                    }
                    )
                }
                return this
            }
            dispose() {
                return super.dispose(),
                null !== this._root && this._root.traverse(t=>t.dispose()),
                this._root = null,
                this
            }
        }
        class Wo {
            constructor(t, e, s) {
                this._left = null,
                this._right = null,
                this.parent = null,
                this.height = 0,
                this.event = s,
                this.low = t,
                this.high = e,
                this.max = this.high
            }
            insert(t) {
                t.low <= this.low ? null === this.left ? this.left = t : this.left.insert(t) : null === this.right ? this.right = t : this.right.insert(t)
            }
            search(t, e) {
                t > this.max || (null !== this.left && this.left.search(t, e),
                this.low <= t && this.high > t && e.push(this),
                this.low > t || null !== this.right && this.right.search(t, e))
            }
            searchAfter(t, e) {
                this.low >= t && (e.push(this),
                null !== this.left && this.left.searchAfter(t, e)),
                null !== this.right && this.right.searchAfter(t, e)
            }
            traverse(t) {
                t(this),
                null !== this.left && this.left.traverse(t),
                null !== this.right && this.right.traverse(t)
            }
            updateHeight() {
                null !== this.left && null !== this.right ? this.height = Math.max(this.left.height, this.right.height) + 1 : null !== this.right ? this.height = this.right.height + 1 : null !== this.left ? this.height = this.left.height + 1 : this.height = 0
            }
            updateMax() {
                this.max = this.high,
                null !== this.left && (this.max = Math.max(this.max, this.left.max)),
                null !== this.right && (this.max = Math.max(this.max, this.right.max))
            }
            getBalance() {
                let t = 0;
                return null !== this.left && null !== this.right ? t = this.left.height - this.right.height : null !== this.left ? t = this.left.height + 1 : null !== this.right && (t = -(this.right.height + 1)),
                t
            }
            isLeftChild() {
                return null !== this.parent && this.parent.left === this
            }
            get left() {
                return this._left
            }
            set left(t) {
                this._left = t,
                null !== t && (t.parent = this),
                this.updateHeight(),
                this.updateMax()
            }
            get right() {
                return this._right
            }
            set right(t) {
                this._right = t,
                null !== t && (t.parent = this),
                this.updateHeight(),
                this.updateMax()
            }
            dispose() {
                this.parent = null,
                this._left = null,
                this._right = null,
                this.event = null
            }
        }
        class Go extends wo {
            constructor() {
                super(Di(Go.getDefaults(), arguments, ["volume"])),
                this.name = "Volume";
                const t = Di(Go.getDefaults(), arguments, ["volume"]);
                this.input = this.output = new ko({
                    context: this.context,
                    gain: t.volume,
                    units: "decibels"
                }),
                this.volume = this.output.gain,
                Ui(this, "volume"),
                this._unmutedVolume = t.volume,
                this.mute = t.mute
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    mute: !1,
                    volume: 0
                })
            }
            get mute() {
                return this.volume.value === -1 / 0
            }
            set mute(t) {
                !this.mute && t ? (this._unmutedVolume = this.volume.value,
                this.volume.value = -1 / 0) : this.mute && !t && (this.volume.value = this._unmutedVolume)
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this.volume.dispose(),
                this
            }
        }
        class Uo extends wo {
            constructor() {
                super(Di(Uo.getDefaults(), arguments)),
                this.name = "Destination",
                this.input = new Go({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this.volume = this.input.volume;
                const t = Di(Uo.getDefaults(), arguments);
                bo(this.input, this.output, this.context.rawContext.destination),
                this.mute = t.mute,
                this._internalChannels = [this.input, this.context.rawContext.destination, this.output]
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    mute: !1,
                    volume: 0
                })
            }
            get mute() {
                return this.input.mute
            }
            set mute(t) {
                this.input.mute = t
            }
            chain(...t) {
                return this.input.disconnect(),
                t.unshift(this.input),
                t.push(this.output),
                bo(...t),
                this
            }
            get maxChannelCount() {
                return this.context.rawContext.destination.maxChannelCount
            }
            dispose() {
                return super.dispose(),
                this.volume.dispose(),
                this
            }
        }
        ji(t=>{
            t.destination = new Uo({
                context: t
            })
        }
        ),
        zi(t=>{
            t.destination.dispose()
        }
        );
        class Qo extends Ei {
            constructor(t) {
                super(),
                this.name = "TimelineValue",
                this._timeline = new Ni({
                    memory: 10
                }),
                this._initialValue = t
            }
            set(t, e) {
                return this._timeline.add({
                    value: t,
                    time: e
                }),
                this
            }
            get(t) {
                const e = this._timeline.get(t);
                return e ? e.value : this._initialValue
            }
        }
        class Zo {
            constructor(t, e) {
                this.id = Zo._eventId++;
                const s = Object.assign(Zo.getDefaults(), e);
                this.transport = t,
                this.callback = s.callback,
                this._once = s.once,
                this.time = s.time
            }
            static getDefaults() {
                return {
                    callback: Zi,
                    once: !1,
                    time: 0
                }
            }
            invoke(t) {
                this.callback && (this.callback(t),
                this._once && this.transport.clear(this.id))
            }
            dispose() {
                return this.callback = void 0,
                this
            }
        }
        Zo._eventId = 0;
        class Xo extends Zo {
            constructor(t, e) {
                super(t, e),
                this._currentId = -1,
                this._nextId = -1,
                this._nextTick = this.time,
                this._boundRestart = this._restart.bind(this);
                const s = Object.assign(Xo.getDefaults(), e);
                this.duration = new jo(t.context,s.duration).valueOf(),
                this._interval = new jo(t.context,s.interval).valueOf(),
                this._nextTick = s.time,
                this.transport.on("start", this._boundRestart),
                this.transport.on("loopStart", this._boundRestart),
                this.context = this.transport.context,
                this._restart()
            }
            static getDefaults() {
                return Object.assign({}, Zo.getDefaults(), {
                    duration: 1 / 0,
                    interval: 1,
                    once: !1
                })
            }
            invoke(t) {
                this._createEvents(t),
                super.invoke(t)
            }
            _createEvents(t) {
                const e = this.transport.getTicksAtTime(t);
                e >= this.time && e >= this._nextTick && this._nextTick + this._interval < this.time + this.duration && (this._nextTick += this._interval,
                this._currentId = this._nextId,
                this._nextId = this.transport.scheduleOnce(this.invoke.bind(this), new jo(this.context,this._nextTick).toSeconds()))
            }
            _restart(t) {
                this.transport.clear(this._currentId),
                this.transport.clear(this._nextId),
                this._nextTick = this.time;
                const e = this.transport.getTicksAtTime(t);
                e > this.time && (this._nextTick = this.time + Math.ceil((e - this.time) / this._interval) * this._interval),
                this._currentId = this.transport.scheduleOnce(this.invoke.bind(this), new jo(this.context,this._nextTick).toSeconds()),
                this._nextTick += this._interval,
                this._nextId = this.transport.scheduleOnce(this.invoke.bind(this), new jo(this.context,this._nextTick).toSeconds())
            }
            dispose() {
                return super.dispose(),
                this.transport.clear(this._currentId),
                this.transport.clear(this._nextId),
                this.transport.off("start", this._boundRestart),
                this.transport.off("loopStart", this._boundRestart),
                this
            }
        }
        class Yo extends vo {
            constructor() {
                super(Di(Yo.getDefaults(), arguments)),
                this.name = "Transport",
                this._loop = new Qo(!1),
                this._loopStart = 0,
                this._loopEnd = 0,
                this._scheduledEvents = {},
                this._timeline = new Ni,
                this._repeatedEvents = new Bo,
                this._syncedSignals = [],
                this._swingAmount = 0;
                const t = Di(Yo.getDefaults(), arguments);
                this._ppq = t.ppq,
                this._clock = new qo({
                    callback: this._processTick.bind(this),
                    context: this.context,
                    frequency: 0,
                    units: "bpm"
                }),
                this._bindClockEvents(),
                this.bpm = this._clock.frequency,
                this._clock.frequency.multiplier = t.ppq,
                this.bpm.setValueAtTime(t.bpm, 0),
                Ui(this, "bpm"),
                this._timeSignature = t.timeSignature,
                this._swingTicks = t.ppq / 2
            }
            static getDefaults() {
                return Object.assign(vo.getDefaults(), {
                    bpm: 120,
                    loopEnd: "4m",
                    loopStart: 0,
                    ppq: 192,
                    swing: 0,
                    swingSubdivision: "8n",
                    timeSignature: 4
                })
            }
            _processTick(t, e) {
                if (this._loop.get(t) && e >= this._loopEnd && (this.emit("loopEnd", t),
                this._clock.setTicksAtTime(this._loopStart, t),
                e = this._loopStart,
                this.emit("loopStart", t, this._clock.getSecondsAtTime(t)),
                this.emit("loop", t)),
                this._swingAmount > 0 && e % this._ppq != 0 && e % (2 * this._swingTicks) != 0) {
                    const s = e % (2 * this._swingTicks) / (2 * this._swingTicks)
                      , n = Math.sin(s * Math.PI) * this._swingAmount;
                    t += new jo(this.context,2 * this._swingTicks / 3).toSeconds() * n
                }
                this._timeline.forEachAtTime(e, e=>e.invoke(t))
            }
            schedule(t, e) {
                const s = new Zo(this,{
                    callback: t,
                    time: new mo(this.context,e).toTicks()
                });
                return this._addEvent(s, this._timeline)
            }
            scheduleRepeat(t, e, s, n=1 / 0) {
                const i = new Xo(this,{
                    callback: t,
                    duration: new ho(this.context,n).toTicks(),
                    interval: new ho(this.context,e).toTicks(),
                    time: new mo(this.context,s).toTicks()
                });
                return this._addEvent(i, this._repeatedEvents)
            }
            scheduleOnce(t, e) {
                const s = new Zo(this,{
                    callback: t,
                    once: !0,
                    time: new mo(this.context,e).toTicks()
                });
                return this._addEvent(s, this._timeline)
            }
            clear(t) {
                if (this._scheduledEvents.hasOwnProperty(t)) {
                    const e = this._scheduledEvents[t.toString()];
                    e.timeline.remove(e.event),
                    e.event.dispose(),
                    delete this._scheduledEvents[t.toString()]
                }
                return this
            }
            _addEvent(t, e) {
                return this._scheduledEvents[t.id.toString()] = {
                    event: t,
                    timeline: e
                },
                e.add(t),
                t.id
            }
            cancel(t=0) {
                const e = this.toTicks(t);
                return this._timeline.forEachFrom(e, t=>this.clear(t.id)),
                this._repeatedEvents.forEachFrom(e, t=>this.clear(t.id)),
                this
            }
            _bindClockEvents() {
                this._clock.on("start", (t,e)=>{
                    e = new jo(this.context,e).toSeconds(),
                    this.emit("start", t, e)
                }
                ),
                this._clock.on("stop", t=>{
                    this.emit("stop", t)
                }
                ),
                this._clock.on("pause", t=>{
                    this.emit("pause", t)
                }
                )
            }
            get state() {
                return this._clock.getStateAtTime(this.now())
            }
            start(t, e) {
                let s;
                return ci(e) && (s = this.toTicks(e)),
                this._clock.start(t, s),
                this
            }
            stop(t) {
                return this._clock.stop(t),
                this
            }
            pause(t) {
                return this._clock.pause(t),
                this
            }
            toggle(t) {
                return t = this.toSeconds(t),
                "started" !== this._clock.getStateAtTime(t) ? this.start(t) : this.stop(t),
                this
            }
            get timeSignature() {
                return this._timeSignature
            }
            set timeSignature(t) {
                di(t) && (t = t[0] / t[1] * 4),
                this._timeSignature = t
            }
            get loopStart() {
                return new ho(this.context,this._loopStart,"i").toSeconds()
            }
            set loopStart(t) {
                this._loopStart = this.toTicks(t)
            }
            get loopEnd() {
                return new ho(this.context,this._loopEnd,"i").toSeconds()
            }
            set loopEnd(t) {
                this._loopEnd = this.toTicks(t)
            }
            get loop() {
                return this._loop.get(this.now())
            }
            set loop(t) {
                this._loop.set(t, this.now())
            }
            setLoopPoints(t, e) {
                return this.loopStart = t,
                this.loopEnd = e,
                this
            }
            get swing() {
                return this._swingAmount
            }
            set swing(t) {
                this._swingAmount = t
            }
            get swingSubdivision() {
                return new jo(this.context,this._swingTicks).toNotation()
            }
            set swingSubdivision(t) {
                this._swingTicks = this.toTicks(t)
            }
            get position() {
                const t = this.now()
                  , e = this._clock.getTicksAtTime(t);
                return new jo(this.context,e).toBarsBeatsSixteenths()
            }
            set position(t) {
                const e = this.toTicks(t);
                this.ticks = e
            }
            get seconds() {
                return this._clock.seconds
            }
            set seconds(t) {
                const e = this.now()
                  , s = this._clock.frequency.timeToTicks(t, e);
                this.ticks = s
            }
            get progress() {
                if (this.loop) {
                    const t = this.now();
                    return (this._clock.getTicksAtTime(t) - this._loopStart) / (this._loopEnd - this._loopStart)
                }
                return 0
            }
            get ticks() {
                return this._clock.ticks
            }
            set ticks(t) {
                if (this._clock.ticks !== t) {
                    const e = this.now();
                    if ("started" === this.state) {
                        const s = this._clock.getTicksAtTime(e)
                          , n = e + this._clock.frequency.getDurationOfTicks(Math.ceil(s) - s, e);
                        this.emit("stop", n),
                        this._clock.setTicksAtTime(t, n),
                        this.emit("start", n, this._clock.getSecondsAtTime(n))
                    } else
                        this._clock.setTicksAtTime(t, e)
                }
            }
            getTicksAtTime(t) {
                return Math.round(this._clock.getTicksAtTime(t))
            }
            getSecondsAtTime(t) {
                return this._clock.getSecondsAtTime(t)
            }
            get PPQ() {
                return this._clock.frequency.multiplier
            }
            set PPQ(t) {
                this._clock.frequency.multiplier = t
            }
            nextSubdivision(t) {
                if (t = this.toTicks(t),
                "started" !== this.state)
                    return 0;
                {
                    const e = this.now()
                      , s = t - this.getTicksAtTime(e) % t;
                    return this._clock.nextTickTime(s, e)
                }
            }
            syncSignal(t, e) {
                if (!e) {
                    const s = this.now();
                    if (0 !== t.getValueAtTime(s)) {
                        const n = 1 / (60 / this.bpm.getValueAtTime(s) / this.PPQ);
                        e = t.getValueAtTime(s) / n
                    } else
                        e = 0
                }
                const s = new ko(e);
                return this.bpm.connect(s),
                s.connect(t._param),
                this._syncedSignals.push({
                    initial: t.value,
                    ratio: s,
                    signal: t
                }),
                t.value = 0,
                this
            }
            unsyncSignal(t) {
                for (let e = this._syncedSignals.length - 1; e >= 0; e--) {
                    const s = this._syncedSignals[e];
                    s.signal === t && (s.ratio.dispose(),
                    s.signal.value = s.initial,
                    this._syncedSignals.splice(e, 1))
                }
                return this
            }
            dispose() {
                return super.dispose(),
                this._clock.dispose(),
                Qi(this, "bpm"),
                this._timeline.dispose(),
                this._repeatedEvents.dispose(),
                this
            }
        }
        Bi.mixin(Yo),
        ji(t=>{
            t.transport = new Yo({
                context: t
            })
        }
        ),
        zi(t=>{
            t.transport.dispose()
        }
        );
        class Ho extends wo {
            constructor(t) {
                super(t),
                this.input = void 0,
                this._state = new yo("stopped"),
                this._synced = !1,
                this._scheduled = [],
                this._syncedStart = Zi,
                this._syncedStop = Zi,
                this._state.memory = 100,
                this._state.increasing = !0,
                this._volume = this.output = new Go({
                    context: this.context,
                    mute: t.mute,
                    volume: t.volume
                }),
                this.volume = this._volume.volume,
                Ui(this, "volume"),
                this.onstop = t.onstop
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    mute: !1,
                    onstop: Zi,
                    volume: 0
                })
            }
            get state() {
                return this._synced ? "started" === this.context.transport.state ? this._state.getValueAtTime(this.context.transport.seconds) : "stopped" : this._state.getValueAtTime(this.now())
            }
            get mute() {
                return this._volume.mute
            }
            set mute(t) {
                this._volume.mute = t
            }
            _clampToCurrentTime(t) {
                return this._synced ? t : Math.max(t, this.context.currentTime)
            }
            start(t, e, s) {
                let n = ai(t) && this._synced ? this.context.transport.seconds : this.toSeconds(t);
                if (n = this._clampToCurrentTime(n),
                this._synced || "started" !== this._state.getValueAtTime(n))
                    if (this.log("start", n),
                    this._state.setStateAtTime("started", n),
                    this._synced) {
                        const t = this._state.get(n);
                        t && (t.offset = this.toSeconds(Oi(e, 0)),
                        t.duration = s ? this.toSeconds(s) : void 0);
                        const i = this.context.transport.schedule(t=>{
                            this._start(t, e, s)
                        }
                        , n);
                        this._scheduled.push(i),
                        "started" === this.context.transport.state && this.context.transport.getSecondsAtTime(this.immediate()) > n && this._syncedStart(this.now(), this.context.transport.seconds)
                    } else
                        si(this.context),
                        this._start(n, e, s);
                else
                    ti(Ri(n, this._state.get(n).time), "Start time must be strictly greater than previous start time"),
                    this._state.cancel(n),
                    this._state.setStateAtTime("started", n),
                    this.log("restart", n),
                    this.restart(n, e, s);
                return this
            }
            stop(t) {
                let e = ai(t) && this._synced ? this.context.transport.seconds : this.toSeconds(t);
                if (e = this._clampToCurrentTime(e),
                "started" === this._state.getValueAtTime(e) || ci(this._state.getNextState("started", e))) {
                    if (this.log("stop", e),
                    this._synced) {
                        const t = this.context.transport.schedule(this._stop.bind(this), e);
                        this._scheduled.push(t)
                    } else
                        this._stop(e);
                    this._state.cancel(e),
                    this._state.setStateAtTime("stopped", e)
                }
                return this
            }
            restart(t, e, s) {
                return t = this.toSeconds(t),
                "started" === this._state.getValueAtTime(t) && (this._state.cancel(t),
                this._restart(t, e, s)),
                this
            }
            sync() {
                return this._synced || (this._synced = !0,
                this._syncedStart = (t,e)=>{
                    if (e > 0) {
                        const s = this._state.get(e);
                        if (s && "started" === s.state && s.time !== e) {
                            const n = e - this.toSeconds(s.time);
                            let i;
                            s.duration && (i = this.toSeconds(s.duration) - n),
                            this._start(t, this.toSeconds(s.offset) + n, i)
                        }
                    }
                }
                ,
                this._syncedStop = t=>{
                    const e = this.context.transport.getSecondsAtTime(Math.max(t - this.sampleTime, 0));
                    "started" === this._state.getValueAtTime(e) && this._stop(t)
                }
                ,
                this.context.transport.on("start", this._syncedStart),
                this.context.transport.on("loopStart", this._syncedStart),
                this.context.transport.on("stop", this._syncedStop),
                this.context.transport.on("pause", this._syncedStop),
                this.context.transport.on("loopEnd", this._syncedStop)),
                this
            }
            unsync() {
                return this._synced && (this.context.transport.off("stop", this._syncedStop),
                this.context.transport.off("pause", this._syncedStop),
                this.context.transport.off("loopEnd", this._syncedStop),
                this.context.transport.off("start", this._syncedStart),
                this.context.transport.off("loopStart", this._syncedStart)),
                this._synced = !1,
                this._scheduled.forEach(t=>this.context.transport.clear(t)),
                this._scheduled = [],
                this._state.cancel(0),
                this._stop(0),
                this
            }
            dispose() {
                return super.dispose(),
                this.onstop = Zi,
                this.unsync(),
                this._volume.dispose(),
                this._state.dispose(),
                this
            }
        }
        class $o extends Co {
            constructor() {
                super(Di($o.getDefaults(), arguments, ["url", "onload"])),
                this.name = "ToneBufferSource",
                this._source = this.context.createBufferSource(),
                this._internalChannels = [this._source],
                this._sourceStarted = !1,
                this._sourceStopped = !1;
                const t = Di($o.getDefaults(), arguments, ["url", "onload"]);
                To(this._source, this._gainNode),
                this._source.onended = ()=>this._stopSource(),
                this.playbackRate = new xo({
                    context: this.context,
                    param: this._source.playbackRate,
                    units: "positive",
                    value: t.playbackRate
                }),
                this.loop = t.loop,
                this.loopStart = t.loopStart,
                this.loopEnd = t.loopEnd,
                this._buffer = new Xi(t.url,t.onload,t.onerror),
                this._internalChannels.push(this._source)
            }
            static getDefaults() {
                return Object.assign(Co.getDefaults(), {
                    url: new Xi,
                    loop: !1,
                    loopEnd: 0,
                    loopStart: 0,
                    onload: Zi,
                    onerror: Zi,
                    playbackRate: 1
                })
            }
            get fadeIn() {
                return this._fadeIn
            }
            set fadeIn(t) {
                this._fadeIn = t
            }
            get fadeOut() {
                return this._fadeOut
            }
            set fadeOut(t) {
                this._fadeOut = t
            }
            get curve() {
                return this._curve
            }
            set curve(t) {
                this._curve = t
            }
            start(t, e, s, n=1) {
                ti(this.buffer.loaded, "buffer is either not set or not loaded");
                const i = this.toSeconds(t);
                this._startGain(i, n),
                e = this.loop ? Oi(e, this.loopStart) : Oi(e, 0);
                let o = Math.max(this.toSeconds(e), 0);
                if (this.loop) {
                    const t = this.toSeconds(this.loopEnd) || this.buffer.duration
                      , e = this.toSeconds(this.loopStart)
                      , s = t - e;
                    qi(o, t) && (o = (o - e) % s + e),
                    Ii(o, this.buffer.duration) && (o = 0)
                }
                if (this._source.buffer = this.buffer.get(),
                this._source.loopEnd = this.toSeconds(this.loopEnd) || this.buffer.duration,
                Fi(o, this.buffer.duration) && (this._sourceStarted = !0,
                this._source.start(i, o)),
                ci(s)) {
                    let t = this.toSeconds(s);
                    t = Math.max(t, 0),
                    this.stop(i + t)
                }
                return this
            }
            _stopSource(t) {
                !this._sourceStopped && this._sourceStarted && (this._sourceStopped = !0,
                this._source.stop(this.toSeconds(t)),
                this._onended())
            }
            get loopStart() {
                return this._source.loopStart
            }
            set loopStart(t) {
                this._source.loopStart = this.toSeconds(t)
            }
            get loopEnd() {
                return this._source.loopEnd
            }
            set loopEnd(t) {
                this._source.loopEnd = this.toSeconds(t)
            }
            get buffer() {
                return this._buffer
            }
            set buffer(t) {
                this._buffer.set(t)
            }
            get loop() {
                return this._source.loop
            }
            set loop(t) {
                this._source.loop = t,
                this._sourceStarted && this.cancelStop()
            }
            dispose() {
                return super.dispose(),
                this._source.onended = null,
                this._source.disconnect(),
                this._buffer.dispose(),
                this.playbackRate.dispose(),
                this
            }
        }
        class Jo extends Ho {
            constructor() {
                super(Di(Jo.getDefaults(), arguments, ["type"])),
                this.name = "Noise",
                this._source = null;
                const t = Di(Jo.getDefaults(), arguments, ["type"]);
                this._playbackRate = t.playbackRate,
                this.type = t.type,
                this._fadeIn = t.fadeIn,
                this._fadeOut = t.fadeOut
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    fadeIn: 0,
                    fadeOut: 0,
                    playbackRate: 1,
                    type: "white"
                })
            }
            get type() {
                return this._type
            }
            set type(t) {
                if (ti(t in tr, "Noise: invalid type: " + t),
                this._type !== t && (this._type = t,
                "started" === this.state)) {
                    const t = this.now();
                    this._stop(t),
                    this._start(t)
                }
            }
            get playbackRate() {
                return this._playbackRate
            }
            set playbackRate(t) {
                this._playbackRate = t,
                this._source && (this._source.playbackRate.value = t)
            }
            _start(t) {
                const e = tr[this._type];
                this._source = new $o({
                    url: e,
                    context: this.context,
                    fadeIn: this._fadeIn,
                    fadeOut: this._fadeOut,
                    loop: !0,
                    onended: ()=>this.onstop(this),
                    playbackRate: this._playbackRate
                }).connect(this.output),
                this._source.start(this.toSeconds(t), Math.random() * (e.duration - .001))
            }
            _stop(t) {
                this._source && (this._source.stop(this.toSeconds(t)),
                this._source = null)
            }
            get fadeIn() {
                return this._fadeIn
            }
            set fadeIn(t) {
                this._fadeIn = t,
                this._source && (this._source.fadeIn = this._fadeIn)
            }
            get fadeOut() {
                return this._fadeOut
            }
            set fadeOut(t) {
                this._fadeOut = t,
                this._source && (this._source.fadeOut = this._fadeOut)
            }
            _restart(t) {
                this._stop(t),
                this._start(t)
            }
            dispose() {
                return super.dispose(),
                this._source && this._source.disconnect(),
                this
            }
        }
        const Ko = {
            brown: null,
            pink: null,
            white: null
        }
          , tr = {
            get brown() {
                if (!Ko.brown) {
                    const t = [];
                    for (let e = 0; e < 2; e++) {
                        const s = new Float32Array(220500);
                        t[e] = s;
                        let n = 0;
                        for (let t = 0; t < 220500; t++) {
                            const e = 2 * Math.random() - 1;
                            s[t] = (n + .02 * e) / 1.02,
                            n = s[t],
                            s[t] *= 3.5
                        }
                    }
                    Ko.brown = (new Xi).fromArray(t)
                }
                return Ko.brown
            },
            get pink() {
                if (!Ko.pink) {
                    const t = [];
                    for (let e = 0; e < 2; e++) {
                        const s = new Float32Array(220500);
                        let n, i, o, r, a, c, h;
                        t[e] = s,
                        n = i = o = r = a = c = h = 0;
                        for (let t = 0; t < 220500; t++) {
                            const e = 2 * Math.random() - 1;
                            n = .99886 * n + .0555179 * e,
                            i = .99332 * i + .0750759 * e,
                            o = .969 * o + .153852 * e,
                            r = .8665 * r + .3104856 * e,
                            a = .55 * a + .5329522 * e,
                            c = -.7616 * c - .016898 * e,
                            s[t] = n + i + o + r + a + c + h + .5362 * e,
                            s[t] *= .11,
                            h = .115926 * e
                        }
                    }
                    Ko.pink = (new Xi).fromArray(t)
                }
                return Ko.pink
            },
            get white() {
                if (!Ko.white) {
                    const t = [];
                    for (let e = 0; e < 2; e++) {
                        const s = new Float32Array(220500);
                        t[e] = s;
                        for (let t = 0; t < 220500; t++)
                            s[t] = 2 * Math.random() - 1
                    }
                    Ko.white = (new Xi).fromArray(t)
                }
                return Ko.white
            }
        };
        class er extends wo {
            constructor() {
                super(Di(er.getDefaults(), arguments, ["volume"])),
                this.name = "UserMedia";
                const t = Di(er.getDefaults(), arguments, ["volume"]);
                this._volume = this.output = new Go({
                    context: this.context,
                    volume: t.volume
                }),
                this.volume = this._volume.volume,
                Ui(this, "volume"),
                this.mute = t.mute
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    mute: !1,
                    volume: 0
                })
            }
            open(t) {
                return yi(this, void 0, void 0, (function*() {
                    ti(er.supported, "UserMedia is not supported"),
                    "started" === this.state && this.close();
                    const e = yield er.enumerateDevices();
                    ui(t) ? this._device = e[t] : (this._device = e.find(e=>e.label === t || e.deviceId === t),
                    !this._device && e.length > 0 && (this._device = e[0]),
                    ti(ci(this._device), "No matching device " + t));
                    const s = {
                        audio: {
                            echoCancellation: !1,
                            sampleRate: this.context.sampleRate,
                            noiseSuppression: !1,
                            mozNoiseSuppression: !1
                        }
                    };
                    this._device && (s.audio.deviceId = this._device.deviceId);
                    const n = yield navigator.mediaDevices.getUserMedia(s);
                    if (!this._stream) {
                        this._stream = n;
                        const t = this.context.createMediaStreamSource(n);
                        To(t, this.output),
                        this._mediaStream = t
                    }
                    return this
                }
                ))
            }
            close() {
                return this._stream && this._mediaStream && (this._stream.getAudioTracks().forEach(t=>{
                    t.stop()
                }
                ),
                this._stream = void 0,
                this._mediaStream.disconnect(),
                this._mediaStream = void 0),
                this._device = void 0,
                this
            }
            static enumerateDevices() {
                return yi(this, void 0, void 0, (function*() {
                    return (yield navigator.mediaDevices.enumerateDevices()).filter(t=>"audioinput" === t.kind)
                }
                ))
            }
            get state() {
                return this._stream && this._stream.active ? "started" : "stopped"
            }
            get deviceId() {
                return this._device ? this._device.deviceId : void 0
            }
            get groupId() {
                return this._device ? this._device.groupId : void 0
            }
            get label() {
                return this._device ? this._device.label : void 0
            }
            get mute() {
                return this._volume.mute
            }
            set mute(t) {
                this._volume.mute = t
            }
            dispose() {
                return super.dispose(),
                this.close(),
                this._volume.dispose(),
                this.volume.dispose(),
                this
            }
            static get supported() {
                return ci(navigator.mediaDevices) && ci(navigator.mediaDevices.getUserMedia)
            }
        }
        function sr(t, e) {
            return yi(this, void 0, void 0, (function*() {
                const s = e / t.context.sampleRate
                  , n = new Yi(1,s,t.context.sampleRate);
                new t.constructor(Object.assign(t.get(), {
                    frequency: 2 / s,
                    detune: 0,
                    context: n
                })).toDestination().start(0);
                return (yield n.render()).getChannelData(0)
            }
            ))
        }
        class nr extends Co {
            constructor() {
                super(Di(nr.getDefaults(), arguments, ["frequency", "type"])),
                this.name = "ToneOscillatorNode",
                this._oscillator = this.context.createOscillator(),
                this._internalChannels = [this._oscillator];
                const t = Di(nr.getDefaults(), arguments, ["frequency", "type"]);
                To(this._oscillator, this._gainNode),
                this.type = t.type,
                this.frequency = new xo({
                    context: this.context,
                    param: this._oscillator.frequency,
                    units: "frequency",
                    value: t.frequency
                }),
                this.detune = new xo({
                    context: this.context,
                    param: this._oscillator.detune,
                    units: "cents",
                    value: t.detune
                }),
                Ui(this, ["frequency", "detune"])
            }
            static getDefaults() {
                return Object.assign(Co.getDefaults(), {
                    detune: 0,
                    frequency: 440,
                    type: "sine"
                })
            }
            start(t) {
                const e = this.toSeconds(t);
                return this.log("start", e),
                this._startGain(e),
                this._oscillator.start(e),
                this
            }
            _stopSource(t) {
                this._oscillator.stop(t)
            }
            setPeriodicWave(t) {
                return this._oscillator.setPeriodicWave(t),
                this
            }
            get type() {
                return this._oscillator.type
            }
            set type(t) {
                this._oscillator.type = t
            }
            dispose() {
                return super.dispose(),
                "started" === this.state && this.stop(),
                this._oscillator.disconnect(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this
            }
        }
        class ir extends Ho {
            constructor() {
                super(Di(ir.getDefaults(), arguments, ["frequency", "type"])),
                this.name = "Oscillator",
                this._oscillator = null;
                const t = Di(ir.getDefaults(), arguments, ["frequency", "type"]);
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency
                }),
                Ui(this, "frequency"),
                this.detune = new Do({
                    context: this.context,
                    units: "cents",
                    value: t.detune
                }),
                Ui(this, "detune"),
                this._partials = t.partials,
                this._partialCount = t.partialCount,
                this._type = t.type,
                t.partialCount && "custom" !== t.type && (this._type = this.baseType + t.partialCount.toString()),
                this.phase = t.phase
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    detune: 0,
                    frequency: 440,
                    partialCount: 0,
                    partials: [],
                    phase: 0,
                    type: "sine"
                })
            }
            _start(t) {
                const e = this.toSeconds(t)
                  , s = new nr({
                    context: this.context,
                    onended: ()=>this.onstop(this)
                });
                this._oscillator = s,
                this._wave ? this._oscillator.setPeriodicWave(this._wave) : this._oscillator.type = this._type,
                this._oscillator.connect(this.output),
                this.frequency.connect(this._oscillator.frequency),
                this.detune.connect(this._oscillator.detune),
                this._oscillator.start(e)
            }
            _stop(t) {
                const e = this.toSeconds(t);
                this._oscillator && this._oscillator.stop(e)
            }
            _restart(t) {
                const e = this.toSeconds(t);
                return this.log("restart", e),
                this._oscillator && this._oscillator.cancelStop(),
                this._state.cancel(e),
                this
            }
            syncFrequency() {
                return this.context.transport.syncSignal(this.frequency),
                this
            }
            unsyncFrequency() {
                return this.context.transport.unsyncSignal(this.frequency),
                this
            }
            _getCachedPeriodicWave() {
                if ("custom" === this._type) {
                    return ir._periodicWaveCache.find(t=>{
                        return t.phase === this._phase && (e = t.partials,
                        s = this._partials,
                        e.length === s.length && e.every((t,e)=>s[e] === t));
                        var e, s
                    }
                    )
                }
                {
                    const t = ir._periodicWaveCache.find(t=>t.type === this._type && t.phase === this._phase);
                    return this._partialCount = t ? t.partialCount : this._partialCount,
                    t
                }
            }
            get type() {
                return this._type
            }
            set type(t) {
                this._type = t;
                const e = -1 !== ["sine", "square", "sawtooth", "triangle"].indexOf(t);
                if (0 === this._phase && e)
                    this._wave = void 0,
                    this._partialCount = 0,
                    null !== this._oscillator && (this._oscillator.type = t);
                else {
                    const e = this._getCachedPeriodicWave();
                    if (ci(e)) {
                        const {partials: t, wave: s} = e;
                        this._wave = s,
                        this._partials = t,
                        null !== this._oscillator && this._oscillator.setPeriodicWave(this._wave)
                    } else {
                        const [e,s] = this._getRealImaginary(t, this._phase)
                          , n = this.context.createPeriodicWave(e, s);
                        this._wave = n,
                        null !== this._oscillator && this._oscillator.setPeriodicWave(this._wave),
                        ir._periodicWaveCache.push({
                            imag: s,
                            partialCount: this._partialCount,
                            partials: this._partials,
                            phase: this._phase,
                            real: e,
                            type: this._type,
                            wave: this._wave
                        }),
                        ir._periodicWaveCache.length > 100 && ir._periodicWaveCache.shift()
                    }
                }
            }
            get baseType() {
                return this._type.replace(this.partialCount.toString(), "")
            }
            set baseType(t) {
                this.partialCount && "custom" !== this._type && "custom" !== t ? this.type = t + this.partialCount : this.type = t
            }
            get partialCount() {
                return this._partialCount
            }
            set partialCount(t) {
                ei(t, 0);
                let e = this._type;
                const s = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(this._type);
                if (s && (e = s[1]),
                "custom" !== this._type)
                    this.type = 0 === t ? e : e + t.toString();
                else {
                    const e = new Float32Array(t);
                    this._partials.forEach((t,s)=>e[s] = t),
                    this._partials = Array.from(e),
                    this.type = this._type
                }
            }
            _getRealImaginary(t, e) {
                let s = 2048;
                const n = new Float32Array(s)
                  , i = new Float32Array(s);
                let o = 1;
                if ("custom" === t) {
                    if (o = this._partials.length + 1,
                    this._partialCount = this._partials.length,
                    s = o,
                    0 === this._partials.length)
                        return [n, i]
                } else {
                    const e = /^(sine|triangle|square|sawtooth)(\d+)$/.exec(t);
                    e ? (o = parseInt(e[2], 10) + 1,
                    this._partialCount = parseInt(e[2], 10),
                    t = e[1],
                    o = Math.max(o, 2),
                    s = o) : this._partialCount = 0,
                    this._partials = []
                }
                for (let r = 1; r < s; ++r) {
                    const s = 2 / (r * Math.PI);
                    let a;
                    switch (t) {
                    case "sine":
                        a = r <= o ? 1 : 0,
                        this._partials[r - 1] = a;
                        break;
                    case "square":
                        a = 1 & r ? 2 * s : 0,
                        this._partials[r - 1] = a;
                        break;
                    case "sawtooth":
                        a = s * (1 & r ? 1 : -1),
                        this._partials[r - 1] = a;
                        break;
                    case "triangle":
                        a = 1 & r ? s * s * 2 * (r - 1 >> 1 & 1 ? -1 : 1) : 0,
                        this._partials[r - 1] = a;
                        break;
                    case "custom":
                        a = this._partials[r - 1];
                        break;
                    default:
                        throw new TypeError("Oscillator: invalid type: " + t)
                    }
                    0 !== a ? (n[r] = -a * Math.sin(e * r),
                    i[r] = a * Math.cos(e * r)) : (n[r] = 0,
                    i[r] = 0)
                }
                return [n, i]
            }
            _inverseFFT(t, e, s) {
                let n = 0;
                const i = t.length;
                for (let o = 0; o < i; o++)
                    n += t[o] * Math.cos(o * s) + e[o] * Math.sin(o * s);
                return n
            }
            getInitialValue() {
                const [t,e] = this._getRealImaginary(this._type, 0);
                let s = 0;
                const n = 2 * Math.PI;
                for (let i = 0; i < 32; i++)
                    s = Math.max(this._inverseFFT(t, e, i / 32 * n), s);
                return Vi(-this._inverseFFT(t, e, this._phase) / s, -1, 1)
            }
            get partials() {
                return this._partials.slice(0, this.partialCount)
            }
            set partials(t) {
                this._partials = t,
                this._partialCount = this._partials.length,
                t.length && (this.type = "custom")
            }
            get phase() {
                return this._phase * (180 / Math.PI)
            }
            set phase(t) {
                this._phase = t * Math.PI / 180,
                this.type = this._type
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                null !== this._oscillator && this._oscillator.dispose(),
                this._wave = void 0,
                this.frequency.dispose(),
                this.detune.dispose(),
                this
            }
        }
        ir._periodicWaveCache = [];
        class or extends wo {
            constructor() {
                super(Object.assign(Di(or.getDefaults(), arguments, ["context"])))
            }
            connect(t, e=0, s=0) {
                return Oo(this, t, e, s),
                this
            }
        }
        class rr extends or {
            constructor() {
                super(Object.assign(Di(rr.getDefaults(), arguments, ["mapping", "length"]))),
                this.name = "WaveShaper",
                this._shaper = this.context.createWaveShaper(),
                this.input = this._shaper,
                this.output = this._shaper;
                const t = Di(rr.getDefaults(), arguments, ["mapping", "length"]);
                di(t.mapping) || t.mapping instanceof Float32Array ? this.curve = Float32Array.from(t.mapping) : hi(t.mapping) && this.setMap(t.mapping, t.length)
            }
            static getDefaults() {
                return Object.assign(Do.getDefaults(), {
                    length: 1024
                })
            }
            setMap(t, e=1024) {
                const s = new Float32Array(e);
                for (let n = 0, i = e; n < i; n++) {
                    const e = n / (i - 1) * 2 - 1;
                    s[n] = t(e, n)
                }
                return this.curve = s,
                this
            }
            get curve() {
                return this._shaper.curve
            }
            set curve(t) {
                this._shaper.curve = t
            }
            get oversample() {
                return this._shaper.oversample
            }
            set oversample(t) {
                ti(["none", "2x", "4x"].some(e=>e.includes(t)), "oversampling must be either 'none', '2x', or '4x'"),
                this._shaper.oversample = t
            }
            dispose() {
                return super.dispose(),
                this._shaper.disconnect(),
                this
            }
        }
        class ar extends or {
            constructor() {
                super(...arguments),
                this.name = "AudioToGain",
                this._norm = new rr({
                    context: this.context,
                    mapping: t=>(t + 1) / 2
                }),
                this.input = this._norm,
                this.output = this._norm
            }
            dispose() {
                return super.dispose(),
                this._norm.dispose(),
                this
            }
        }
        class cr extends Do {
            constructor() {
                super(Object.assign(Di(cr.getDefaults(), arguments, ["value"]))),
                this.name = "Multiply",
                this.override = !1;
                const t = Di(cr.getDefaults(), arguments, ["value"]);
                this._mult = this.input = this.output = new ko({
                    context: this.context,
                    minValue: t.minValue,
                    maxValue: t.maxValue
                }),
                this.factor = this._param = this._mult.gain,
                this.factor.setValueAtTime(t.value, 0)
            }
            static getDefaults() {
                return Object.assign(Do.getDefaults(), {
                    value: 0
                })
            }
            dispose() {
                return super.dispose(),
                this._mult.dispose(),
                this
            }
        }
        class hr extends Ho {
            constructor() {
                super(Di(hr.getDefaults(), arguments, ["frequency", "type", "modulationType"])),
                this.name = "AMOscillator",
                this._modulationScale = new ar({
                    context: this.context
                }),
                this._modulationNode = new ko({
                    context: this.context
                });
                const t = Di(hr.getDefaults(), arguments, ["frequency", "type", "modulationType"]);
                this._carrier = new ir({
                    context: this.context,
                    detune: t.detune,
                    frequency: t.frequency,
                    onstop: ()=>this.onstop(this),
                    phase: t.phase,
                    type: t.type
                }),
                this.frequency = this._carrier.frequency,
                this.detune = this._carrier.detune,
                this._modulator = new ir({
                    context: this.context,
                    phase: t.phase,
                    type: t.modulationType
                }),
                this.harmonicity = new cr({
                    context: this.context,
                    units: "positive",
                    value: t.harmonicity
                }),
                this.frequency.chain(this.harmonicity, this._modulator.frequency),
                this._modulator.chain(this._modulationScale, this._modulationNode.gain),
                this._carrier.chain(this._modulationNode, this.output),
                Ui(this, ["frequency", "detune", "harmonicity"])
            }
            static getDefaults() {
                return Object.assign(ir.getDefaults(), {
                    harmonicity: 1,
                    modulationType: "square"
                })
            }
            _start(t) {
                this._modulator.start(t),
                this._carrier.start(t)
            }
            _stop(t) {
                this._modulator.stop(t),
                this._carrier.stop(t)
            }
            _restart(t) {
                this._modulator.restart(t),
                this._carrier.restart(t)
            }
            get type() {
                return this._carrier.type
            }
            set type(t) {
                this._carrier.type = t
            }
            get baseType() {
                return this._carrier.baseType
            }
            set baseType(t) {
                this._carrier.baseType = t
            }
            get partialCount() {
                return this._carrier.partialCount
            }
            set partialCount(t) {
                this._carrier.partialCount = t
            }
            get modulationType() {
                return this._modulator.type
            }
            set modulationType(t) {
                this._modulator.type = t
            }
            get phase() {
                return this._carrier.phase
            }
            set phase(t) {
                this._carrier.phase = t,
                this._modulator.phase = t
            }
            get partials() {
                return this._carrier.partials
            }
            set partials(t) {
                this._carrier.partials = t
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this.harmonicity.dispose(),
                this._carrier.dispose(),
                this._modulator.dispose(),
                this._modulationNode.dispose(),
                this._modulationScale.dispose(),
                this
            }
        }
        class ur extends Ho {
            constructor() {
                super(Di(ur.getDefaults(), arguments, ["frequency", "type", "modulationType"])),
                this.name = "FMOscillator",
                this._modulationNode = new ko({
                    context: this.context,
                    gain: 0
                });
                const t = Di(ur.getDefaults(), arguments, ["frequency", "type", "modulationType"]);
                this._carrier = new ir({
                    context: this.context,
                    detune: t.detune,
                    frequency: 0,
                    onstop: ()=>this.onstop(this),
                    phase: t.phase,
                    type: t.type
                }),
                this.detune = this._carrier.detune,
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency
                }),
                this._modulator = new ir({
                    context: this.context,
                    phase: t.phase,
                    type: t.modulationType
                }),
                this.harmonicity = new cr({
                    context: this.context,
                    units: "positive",
                    value: t.harmonicity
                }),
                this.modulationIndex = new cr({
                    context: this.context,
                    units: "positive",
                    value: t.modulationIndex
                }),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(this.harmonicity, this._modulator.frequency),
                this.frequency.chain(this.modulationIndex, this._modulationNode),
                this._modulator.connect(this._modulationNode.gain),
                this._modulationNode.connect(this._carrier.frequency),
                this._carrier.connect(this.output),
                this.detune.connect(this._modulator.detune),
                Ui(this, ["modulationIndex", "frequency", "detune", "harmonicity"])
            }
            static getDefaults() {
                return Object.assign(ir.getDefaults(), {
                    harmonicity: 1,
                    modulationIndex: 2,
                    modulationType: "square"
                })
            }
            _start(t) {
                this._modulator.start(t),
                this._carrier.start(t)
            }
            _stop(t) {
                this._modulator.stop(t),
                this._carrier.stop(t)
            }
            _restart(t) {
                return this._modulator.restart(t),
                this._carrier.restart(t),
                this
            }
            get type() {
                return this._carrier.type
            }
            set type(t) {
                this._carrier.type = t
            }
            get baseType() {
                return this._carrier.baseType
            }
            set baseType(t) {
                this._carrier.baseType = t
            }
            get partialCount() {
                return this._carrier.partialCount
            }
            set partialCount(t) {
                this._carrier.partialCount = t
            }
            get modulationType() {
                return this._modulator.type
            }
            set modulationType(t) {
                this._modulator.type = t
            }
            get phase() {
                return this._carrier.phase
            }
            set phase(t) {
                this._carrier.phase = t,
                this._modulator.phase = t
            }
            get partials() {
                return this._carrier.partials
            }
            set partials(t) {
                this._carrier.partials = t
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this.frequency.dispose(),
                this.harmonicity.dispose(),
                this._carrier.dispose(),
                this._modulator.dispose(),
                this._modulationNode.dispose(),
                this.modulationIndex.dispose(),
                this
            }
        }
        class lr extends Ho {
            constructor() {
                super(Di(lr.getDefaults(), arguments, ["frequency", "width"])),
                this.name = "PulseOscillator",
                this._widthGate = new ko({
                    context: this.context,
                    gain: 0
                }),
                this._thresh = new rr({
                    context: this.context,
                    mapping: t=>t <= 0 ? -1 : 1
                });
                const t = Di(lr.getDefaults(), arguments, ["frequency", "width"]);
                this.width = new Do({
                    context: this.context,
                    units: "audioRange",
                    value: t.width
                }),
                this._triangle = new ir({
                    context: this.context,
                    detune: t.detune,
                    frequency: t.frequency,
                    onstop: ()=>this.onstop(this),
                    phase: t.phase,
                    type: "triangle"
                }),
                this.frequency = this._triangle.frequency,
                this.detune = this._triangle.detune,
                this._triangle.chain(this._thresh, this.output),
                this.width.chain(this._widthGate, this._thresh),
                Ui(this, ["width", "frequency", "detune"])
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    detune: 0,
                    frequency: 440,
                    phase: 0,
                    type: "pulse",
                    width: .2
                })
            }
            _start(t) {
                t = this.toSeconds(t),
                this._triangle.start(t),
                this._widthGate.gain.setValueAtTime(1, t)
            }
            _stop(t) {
                t = this.toSeconds(t),
                this._triangle.stop(t),
                this._widthGate.gain.cancelScheduledValues(t),
                this._widthGate.gain.setValueAtTime(0, t)
            }
            _restart(t) {
                this._triangle.restart(t),
                this._widthGate.gain.cancelScheduledValues(t),
                this._widthGate.gain.setValueAtTime(1, t)
            }
            get phase() {
                return this._triangle.phase
            }
            set phase(t) {
                this._triangle.phase = t
            }
            get type() {
                return "pulse"
            }
            get baseType() {
                return "pulse"
            }
            get partials() {
                return []
            }
            get partialCount() {
                return 0
            }
            set carrierType(t) {
                this._triangle.type = t
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this._triangle.dispose(),
                this.width.dispose(),
                this._widthGate.dispose(),
                this._thresh.dispose(),
                this
            }
        }
        class pr extends Ho {
            constructor() {
                super(Di(pr.getDefaults(), arguments, ["frequency", "type", "spread"])),
                this.name = "FatOscillator",
                this._oscillators = [];
                const t = Di(pr.getDefaults(), arguments, ["frequency", "type", "spread"]);
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency
                }),
                this.detune = new Do({
                    context: this.context,
                    units: "cents",
                    value: t.detune
                }),
                this._spread = t.spread,
                this._type = t.type,
                this._phase = t.phase,
                this._partials = t.partials,
                this._partialCount = t.partialCount,
                this.count = t.count,
                Ui(this, ["frequency", "detune"])
            }
            static getDefaults() {
                return Object.assign(ir.getDefaults(), {
                    count: 3,
                    spread: 20,
                    type: "sawtooth"
                })
            }
            _start(t) {
                t = this.toSeconds(t),
                this._forEach(e=>e.start(t))
            }
            _stop(t) {
                t = this.toSeconds(t),
                this._forEach(e=>e.stop(t))
            }
            _restart(t) {
                this._forEach(e=>e.restart(t))
            }
            _forEach(t) {
                for (let e = 0; e < this._oscillators.length; e++)
                    t(this._oscillators[e], e)
            }
            get type() {
                return this._type
            }
            set type(t) {
                this._type = t,
                this._forEach(e=>e.type = t)
            }
            get spread() {
                return this._spread
            }
            set spread(t) {
                if (this._spread = t,
                this._oscillators.length > 1) {
                    const e = -t / 2
                      , s = t / (this._oscillators.length - 1);
                    this._forEach((t,n)=>t.detune.value = e + s * n)
                }
            }
            get count() {
                return this._oscillators.length
            }
            set count(t) {
                if (ei(t, 1),
                this._oscillators.length !== t) {
                    this._forEach(t=>t.dispose()),
                    this._oscillators = [];
                    for (let e = 0; e < t; e++) {
                        const s = new ir({
                            context: this.context,
                            volume: -6 - 1.1 * t,
                            type: this._type,
                            phase: this._phase + e / t * 360,
                            partialCount: this._partialCount,
                            onstop: 0 === e ? ()=>this.onstop(this) : Zi
                        });
                        "custom" === this.type && (s.partials = this._partials),
                        this.frequency.connect(s.frequency),
                        this.detune.connect(s.detune),
                        s.detune.overridden = !1,
                        s.connect(this.output),
                        this._oscillators[e] = s
                    }
                    this.spread = this._spread,
                    "started" === this.state && this._forEach(t=>t.start())
                }
            }
            get phase() {
                return this._phase
            }
            set phase(t) {
                this._phase = t,
                this._forEach((t,e)=>t.phase = this._phase + e / this.count * 360)
            }
            get baseType() {
                return this._oscillators[0].baseType
            }
            set baseType(t) {
                this._forEach(e=>e.baseType = t),
                this._type = this._oscillators[0].type
            }
            get partials() {
                return this._oscillators[0].partials
            }
            set partials(t) {
                this._partials = t,
                this._partialCount = this._partials.length,
                t.length && (this._type = "custom",
                this._forEach(e=>e.partials = t))
            }
            get partialCount() {
                return this._oscillators[0].partialCount
            }
            set partialCount(t) {
                this._partialCount = t,
                this._forEach(e=>e.partialCount = t),
                this._type = this._oscillators[0].type
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this._forEach(t=>t.dispose()),
                this
            }
        }
        class dr extends Ho {
            constructor() {
                super(Di(dr.getDefaults(), arguments, ["frequency", "modulationFrequency"])),
                this.name = "PWMOscillator",
                this.sourceType = "pwm",
                this._scale = new cr({
                    context: this.context,
                    value: 2
                });
                const t = Di(dr.getDefaults(), arguments, ["frequency", "modulationFrequency"]);
                this._pulse = new lr({
                    context: this.context,
                    frequency: t.modulationFrequency
                }),
                this._pulse.carrierType = "sine",
                this.modulationFrequency = this._pulse.frequency,
                this._modulator = new ir({
                    context: this.context,
                    detune: t.detune,
                    frequency: t.frequency,
                    onstop: ()=>this.onstop(this),
                    phase: t.phase
                }),
                this.frequency = this._modulator.frequency,
                this.detune = this._modulator.detune,
                this._modulator.chain(this._scale, this._pulse.width),
                this._pulse.connect(this.output),
                Ui(this, ["modulationFrequency", "frequency", "detune"])
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    detune: 0,
                    frequency: 440,
                    modulationFrequency: .4,
                    phase: 0,
                    type: "pwm"
                })
            }
            _start(t) {
                t = this.toSeconds(t),
                this._modulator.start(t),
                this._pulse.start(t)
            }
            _stop(t) {
                t = this.toSeconds(t),
                this._modulator.stop(t),
                this._pulse.stop(t)
            }
            _restart(t) {
                this._modulator.restart(t),
                this._pulse.restart(t)
            }
            get type() {
                return "pwm"
            }
            get baseType() {
                return "pwm"
            }
            get partials() {
                return []
            }
            get partialCount() {
                return 0
            }
            get phase() {
                return this._modulator.phase
            }
            set phase(t) {
                this._modulator.phase = t
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this._pulse.dispose(),
                this._scale.dispose(),
                this._modulator.dispose(),
                this
            }
        }
        const fr = {
            am: hr,
            fat: pr,
            fm: ur,
            oscillator: ir,
            pulse: lr,
            pwm: dr
        };
        class _r extends Ho {
            constructor() {
                super(Di(_r.getDefaults(), arguments, ["frequency", "type"])),
                this.name = "OmniOscillator";
                const t = Di(_r.getDefaults(), arguments, ["frequency", "type"]);
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency
                }),
                this.detune = new Do({
                    context: this.context,
                    units: "cents",
                    value: t.detune
                }),
                Ui(this, ["frequency", "detune"]),
                this.set(t)
            }
            static getDefaults() {
                return Object.assign(ir.getDefaults(), ur.getDefaults(), hr.getDefaults(), pr.getDefaults(), lr.getDefaults(), dr.getDefaults())
            }
            _start(t) {
                this._oscillator.start(t)
            }
            _stop(t) {
                this._oscillator.stop(t)
            }
            _restart(t) {
                return this._oscillator.restart(t),
                this
            }
            get type() {
                let t = "";
                return ["am", "fm", "fat"].some(t=>this._sourceType === t) && (t = this._sourceType),
                t + this._oscillator.type
            }
            set type(t) {
                "fm" === t.substr(0, 2) ? (this._createNewOscillator("fm"),
                this._oscillator = this._oscillator,
                this._oscillator.type = t.substr(2)) : "am" === t.substr(0, 2) ? (this._createNewOscillator("am"),
                this._oscillator = this._oscillator,
                this._oscillator.type = t.substr(2)) : "fat" === t.substr(0, 3) ? (this._createNewOscillator("fat"),
                this._oscillator = this._oscillator,
                this._oscillator.type = t.substr(3)) : "pwm" === t ? (this._createNewOscillator("pwm"),
                this._oscillator = this._oscillator) : "pulse" === t ? this._createNewOscillator("pulse") : (this._createNewOscillator("oscillator"),
                this._oscillator = this._oscillator,
                this._oscillator.type = t)
            }
            get partials() {
                return this._oscillator.partials
            }
            set partials(t) {
                this._getOscType(this._oscillator, "pulse") || this._getOscType(this._oscillator, "pwm") || (this._oscillator.partials = t)
            }
            get partialCount() {
                return this._oscillator.partialCount
            }
            set partialCount(t) {
                this._getOscType(this._oscillator, "pulse") || this._getOscType(this._oscillator, "pwm") || (this._oscillator.partialCount = t)
            }
            set(t) {
                return Reflect.has(t, "type") && t.type && (this.type = t.type),
                super.set(t),
                this
            }
            _createNewOscillator(t) {
                if (t !== this._sourceType) {
                    this._sourceType = t;
                    const e = fr[t]
                      , s = this.now();
                    if (this._oscillator) {
                        const t = this._oscillator;
                        t.stop(s),
                        this.context.setTimeout(()=>t.dispose(), this.blockTime)
                    }
                    this._oscillator = new e({
                        context: this.context
                    }),
                    this.frequency.connect(this._oscillator.frequency),
                    this.detune.connect(this._oscillator.detune),
                    this._oscillator.connect(this.output),
                    this._oscillator.onstop = ()=>this.onstop(this),
                    "started" === this.state && this._oscillator.start(s)
                }
            }
            get phase() {
                return this._oscillator.phase
            }
            set phase(t) {
                this._oscillator.phase = t
            }
            get sourceType() {
                return this._sourceType
            }
            set sourceType(t) {
                let e = "sine";
                "pwm" !== this._oscillator.type && "pulse" !== this._oscillator.type && (e = this._oscillator.type),
                "fm" === t ? this.type = "fm" + e : "am" === t ? this.type = "am" + e : "fat" === t ? this.type = "fat" + e : "oscillator" === t ? this.type = e : "pulse" === t ? this.type = "pulse" : "pwm" === t && (this.type = "pwm")
            }
            _getOscType(t, e) {
                return t instanceof fr[e]
            }
            get baseType() {
                return this._oscillator.baseType
            }
            set baseType(t) {
                this._getOscType(this._oscillator, "pulse") || this._getOscType(this._oscillator, "pwm") || "pulse" === t || "pwm" === t || (this._oscillator.baseType = t)
            }
            get width() {
                return this._getOscType(this._oscillator, "pulse") ? this._oscillator.width : void 0
            }
            get count() {
                return this._getOscType(this._oscillator, "fat") ? this._oscillator.count : void 0
            }
            set count(t) {
                this._getOscType(this._oscillator, "fat") && ui(t) && (this._oscillator.count = t)
            }
            get spread() {
                return this._getOscType(this._oscillator, "fat") ? this._oscillator.spread : void 0
            }
            set spread(t) {
                this._getOscType(this._oscillator, "fat") && ui(t) && (this._oscillator.spread = t)
            }
            get modulationType() {
                return this._getOscType(this._oscillator, "fm") || this._getOscType(this._oscillator, "am") ? this._oscillator.modulationType : void 0
            }
            set modulationType(t) {
                (this._getOscType(this._oscillator, "fm") || this._getOscType(this._oscillator, "am")) && fi(t) && (this._oscillator.modulationType = t)
            }
            get modulationIndex() {
                return this._getOscType(this._oscillator, "fm") ? this._oscillator.modulationIndex : void 0
            }
            get harmonicity() {
                return this._getOscType(this._oscillator, "fm") || this._getOscType(this._oscillator, "am") ? this._oscillator.harmonicity : void 0
            }
            get modulationFrequency() {
                return this._getOscType(this._oscillator, "pwm") ? this._oscillator.modulationFrequency : void 0
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    return sr(this, t)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this.detune.dispose(),
                this.frequency.dispose(),
                this._oscillator.dispose(),
                this
            }
        }
        class mr extends Do {
            constructor() {
                super(Object.assign(Di(mr.getDefaults(), arguments, ["value"]))),
                this.override = !1,
                this.name = "Add",
                this._sum = new ko({
                    context: this.context
                }),
                this.input = this._sum,
                this.output = this._sum,
                this.addend = this._param,
                bo(this._constantSource, this._sum)
            }
            static getDefaults() {
                return Object.assign(Do.getDefaults(), {
                    value: 0
                })
            }
            dispose() {
                return super.dispose(),
                this._sum.dispose(),
                this
            }
        }
        class gr extends or {
            constructor() {
                super(Object.assign(Di(gr.getDefaults(), arguments, ["min", "max"]))),
                this.name = "Scale";
                const t = Di(gr.getDefaults(), arguments, ["min", "max"]);
                this._mult = this.input = new cr({
                    context: this.context,
                    value: t.max - t.min
                }),
                this._add = this.output = new mr({
                    context: this.context,
                    value: t.min
                }),
                this._min = t.min,
                this._max = t.max,
                this.input.connect(this.output)
            }
            static getDefaults() {
                return Object.assign(or.getDefaults(), {
                    max: 1,
                    min: 0
                })
            }
            get min() {
                return this._min
            }
            set min(t) {
                this._min = t,
                this._setRange()
            }
            get max() {
                return this._max
            }
            set max(t) {
                this._max = t,
                this._setRange()
            }
            _setRange() {
                this._add.value = this._min,
                this._mult.value = this._max - this._min
            }
            dispose() {
                return super.dispose(),
                this._add.dispose(),
                this._mult.dispose(),
                this
            }
        }
        class vr extends or {
            constructor() {
                super(Object.assign(Di(vr.getDefaults(), arguments))),
                this.name = "Zero",
                this._gain = new ko({
                    context: this.context
                }),
                this.output = this._gain,
                this.input = void 0,
                To(this.context.getConstant(0), this._gain)
            }
            dispose() {
                return super.dispose(),
                So(this.context.getConstant(0), this._gain),
                this
            }
        }
        class yr extends wo {
            constructor() {
                super(Di(yr.getDefaults(), arguments, ["frequency", "min", "max"])),
                this.name = "LFO",
                this._stoppedValue = 0,
                this._units = "number",
                this.convert = !0,
                this._fromType = xo.prototype._fromType,
                this._toType = xo.prototype._toType,
                this._is = xo.prototype._is,
                this._clampValue = xo.prototype._clampValue;
                const t = Di(yr.getDefaults(), arguments, ["frequency", "min", "max"]);
                this._oscillator = new ir(t),
                this.frequency = this._oscillator.frequency,
                this._amplitudeGain = new ko({
                    context: this.context,
                    gain: t.amplitude,
                    units: "normalRange"
                }),
                this.amplitude = this._amplitudeGain.gain,
                this._stoppedSignal = new Do({
                    context: this.context,
                    units: "audioRange",
                    value: 0
                }),
                this._zeros = new vr({
                    context: this.context
                }),
                this._a2g = new ar({
                    context: this.context
                }),
                this._scaler = this.output = new gr({
                    context: this.context,
                    max: t.max,
                    min: t.min
                }),
                this.units = t.units,
                this.min = t.min,
                this.max = t.max,
                this._oscillator.chain(this._amplitudeGain, this._a2g, this._scaler),
                this._zeros.connect(this._a2g),
                this._stoppedSignal.connect(this._a2g),
                Ui(this, ["amplitude", "frequency"]),
                this.phase = t.phase
            }
            static getDefaults() {
                return Object.assign(ir.getDefaults(), {
                    amplitude: 1,
                    frequency: "4n",
                    max: 1,
                    min: 0,
                    type: "sine",
                    units: "number"
                })
            }
            start(t) {
                return t = this.toSeconds(t),
                this._stoppedSignal.setValueAtTime(0, t),
                this._oscillator.start(t),
                this
            }
            stop(t) {
                return t = this.toSeconds(t),
                this._stoppedSignal.setValueAtTime(this._stoppedValue, t),
                this._oscillator.stop(t),
                this
            }
            sync() {
                return this._oscillator.sync(),
                this._oscillator.syncFrequency(),
                this
            }
            unsync() {
                return this._oscillator.unsync(),
                this._oscillator.unsyncFrequency(),
                this
            }
            _setStoppedValue() {
                this._stoppedValue = this._oscillator.getInitialValue(),
                this._stoppedSignal.value = this._stoppedValue
            }
            get min() {
                return this._toType(this._scaler.min)
            }
            set min(t) {
                t = this._fromType(t),
                this._scaler.min = t
            }
            get max() {
                return this._toType(this._scaler.max)
            }
            set max(t) {
                t = this._fromType(t),
                this._scaler.max = t
            }
            get type() {
                return this._oscillator.type
            }
            set type(t) {
                this._oscillator.type = t,
                this._setStoppedValue()
            }
            get partials() {
                return this._oscillator.partials
            }
            set partials(t) {
                this._oscillator.partials = t,
                this._setStoppedValue()
            }
            get phase() {
                return this._oscillator.phase
            }
            set phase(t) {
                this._oscillator.phase = t,
                this._setStoppedValue()
            }
            get units() {
                return this._units
            }
            set units(t) {
                const e = this.min
                  , s = this.max;
                this._units = t,
                this.min = e,
                this.max = s
            }
            get state() {
                return this._oscillator.state
            }
            connect(t, e, s) {
                return (t instanceof xo || t instanceof Do) && (this.convert = t.convert,
                this.units = t.units),
                Oo(this, t, e, s),
                this
            }
            dispose() {
                return super.dispose(),
                this._oscillator.dispose(),
                this._stoppedSignal.dispose(),
                this._zeros.dispose(),
                this._scaler.dispose(),
                this._a2g.dispose(),
                this._amplitudeGain.dispose(),
                this.amplitude.dispose(),
                this
            }
        }
        function xr(t, e=1 / 0) {
            const s = new WeakMap;
            return function(n, i) {
                Reflect.defineProperty(n, i, {
                    configurable: !0,
                    enumerable: !0,
                    get: function() {
                        return s.get(this)
                    },
                    set: function(n) {
                        ei(n, t, e),
                        s.set(this, n)
                    }
                })
            }
        }
        function wr(t, e=1 / 0) {
            const s = new WeakMap;
            return function(n, i) {
                Reflect.defineProperty(n, i, {
                    configurable: !0,
                    enumerable: !0,
                    get: function() {
                        return s.get(this)
                    },
                    set: function(n) {
                        ei(this.toSeconds(n), t, e),
                        s.set(this, n)
                    }
                })
            }
        }
        class br extends Ho {
            constructor() {
                super(Di(br.getDefaults(), arguments, ["url", "onload"])),
                this.name = "Player",
                this._activeSources = new Set;
                const t = Di(br.getDefaults(), arguments, ["url", "onload"]);
                this._buffer = new Xi({
                    onload: this._onload.bind(this, t.onload),
                    onerror: t.onerror,
                    reverse: t.reverse,
                    url: t.url
                }),
                this.autostart = t.autostart,
                this._loop = t.loop,
                this._loopStart = t.loopStart,
                this._loopEnd = t.loopEnd,
                this._playbackRate = t.playbackRate,
                this.fadeIn = t.fadeIn,
                this.fadeOut = t.fadeOut
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    autostart: !1,
                    fadeIn: 0,
                    fadeOut: 0,
                    loop: !1,
                    loopEnd: 0,
                    loopStart: 0,
                    onload: Zi,
                    onerror: Zi,
                    playbackRate: 1,
                    reverse: !1
                })
            }
            load(t) {
                return yi(this, void 0, void 0, (function*() {
                    return yield this._buffer.load(t),
                    this._onload(),
                    this
                }
                ))
            }
            _onload(t=Zi) {
                t(),
                this.autostart && this.start()
            }
            _onSourceEnd(t) {
                this.onstop(this),
                this._activeSources.delete(t),
                0 !== this._activeSources.size || this._synced || "started" !== this._state.getValueAtTime(this.now()) || (this._state.cancel(this.now()),
                this._state.setStateAtTime("stopped", this.now()))
            }
            start(t, e, s) {
                return super.start(t, e, s),
                this
            }
            _start(t, e, s) {
                e = this._loop ? Oi(e, this._loopStart) : Oi(e, 0);
                const n = this.toSeconds(e)
                  , i = s;
                s = Oi(s, Math.max(this._buffer.duration - n, 0));
                let o = this.toSeconds(s);
                o /= this._playbackRate,
                t = this.toSeconds(t);
                const r = new $o({
                    url: this._buffer,
                    context: this.context,
                    fadeIn: this.fadeIn,
                    fadeOut: this.fadeOut,
                    loop: this._loop,
                    loopEnd: this._loopEnd,
                    loopStart: this._loopStart,
                    onended: this._onSourceEnd.bind(this),
                    playbackRate: this._playbackRate
                }).connect(this.output);
                this._loop || this._synced || (this._state.cancel(t + o),
                this._state.setStateAtTime("stopped", t + o, {
                    implicitEnd: !0
                })),
                this._activeSources.add(r),
                this._loop && ai(i) ? r.start(t, n) : r.start(t, n, o - this.toSeconds(this.fadeOut))
            }
            _stop(t) {
                const e = this.toSeconds(t);
                this._activeSources.forEach(t=>t.stop(e))
            }
            restart(t, e, s) {
                return super.restart(t, e, s),
                this
            }
            _restart(t, e, s) {
                this._stop(t),
                this._start(t, e, s)
            }
            seek(t, e) {
                const s = this.toSeconds(e);
                if ("started" === this._state.getValueAtTime(s)) {
                    const e = this.toSeconds(t);
                    this._stop(s),
                    this._start(s, e)
                }
                return this
            }
            setLoopPoints(t, e) {
                return this.loopStart = t,
                this.loopEnd = e,
                this
            }
            get loopStart() {
                return this._loopStart
            }
            set loopStart(t) {
                this._loopStart = t,
                this.buffer.loaded && ei(this.toSeconds(t), 0, this.buffer.duration),
                this._activeSources.forEach(e=>{
                    e.loopStart = t
                }
                )
            }
            get loopEnd() {
                return this._loopEnd
            }
            set loopEnd(t) {
                this._loopEnd = t,
                this.buffer.loaded && ei(this.toSeconds(t), 0, this.buffer.duration),
                this._activeSources.forEach(e=>{
                    e.loopEnd = t
                }
                )
            }
            get buffer() {
                return this._buffer
            }
            set buffer(t) {
                this._buffer.set(t)
            }
            get loop() {
                return this._loop
            }
            set loop(t) {
                if (this._loop !== t && (this._loop = t,
                this._activeSources.forEach(e=>{
                    e.loop = t
                }
                ),
                t)) {
                    const t = this._state.getNextState("stopped", this.now());
                    t && this._state.cancel(t.time)
                }
            }
            get playbackRate() {
                return this._playbackRate
            }
            set playbackRate(t) {
                this._playbackRate = t;
                const e = this.now()
                  , s = this._state.getNextState("stopped", e);
                s && s.implicitEnd && (this._state.cancel(s.time),
                this._activeSources.forEach(t=>t.cancelStop())),
                this._activeSources.forEach(s=>{
                    s.playbackRate.setValueAtTime(t, e)
                }
                )
            }
            get reverse() {
                return this._buffer.reverse
            }
            set reverse(t) {
                this._buffer.reverse = t
            }
            get loaded() {
                return this._buffer.loaded
            }
            dispose() {
                return super.dispose(),
                this._activeSources.forEach(t=>t.dispose()),
                this._activeSources.clear(),
                this._buffer.dispose(),
                this
            }
        }
        vi([wr(0)], br.prototype, "fadeIn", void 0),
        vi([wr(0)], br.prototype, "fadeOut", void 0);
        class Tr extends wo {
            constructor() {
                super(Di(Tr.getDefaults(), arguments, ["urls", "onload"], "urls")),
                this.name = "Players",
                this.input = void 0,
                this._players = new Map;
                const t = Di(Tr.getDefaults(), arguments, ["urls", "onload"], "urls");
                this._volume = this.output = new Go({
                    context: this.context,
                    volume: t.volume
                }),
                this.volume = this._volume.volume,
                Ui(this, "volume"),
                this._buffers = new Vo({
                    urls: t.urls,
                    onload: t.onload,
                    baseUrl: t.baseUrl,
                    onerror: t.onerror
                }),
                this.mute = t.mute,
                this._fadeIn = t.fadeIn,
                this._fadeOut = t.fadeOut
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    baseUrl: "",
                    fadeIn: 0,
                    fadeOut: 0,
                    mute: !1,
                    onload: Zi,
                    onerror: Zi,
                    urls: {},
                    volume: 0
                })
            }
            get mute() {
                return this._volume.mute
            }
            set mute(t) {
                this._volume.mute = t
            }
            get fadeIn() {
                return this._fadeIn
            }
            set fadeIn(t) {
                this._fadeIn = t,
                this._players.forEach(e=>{
                    e.fadeIn = t
                }
                )
            }
            get fadeOut() {
                return this._fadeOut
            }
            set fadeOut(t) {
                this._fadeOut = t,
                this._players.forEach(e=>{
                    e.fadeOut = t
                }
                )
            }
            get state() {
                return Array.from(this._players).some(([t,e])=>"started" === e.state) ? "started" : "stopped"
            }
            has(t) {
                return this._buffers.has(t)
            }
            player(t) {
                if (ti(this.has(t), `No Player with the name ${t} exists on this object`),
                !this._players.has(t)) {
                    const e = new br({
                        context: this.context,
                        fadeIn: this._fadeIn,
                        fadeOut: this._fadeOut,
                        url: this._buffers.get(t)
                    }).connect(this.output);
                    this._players.set(t, e)
                }
                return this._players.get(t)
            }
            get loaded() {
                return this._buffers.loaded
            }
            add(t, e, s) {
                return ti(!this._buffers.has(t), "A buffer with that name already exists on this object"),
                this._buffers.add(t, e, s),
                this
            }
            stopAll(t) {
                return this._players.forEach(e=>e.stop(t)),
                this
            }
            dispose() {
                return super.dispose(),
                this._volume.dispose(),
                this.volume.dispose(),
                this._players.forEach(t=>t.dispose()),
                this._buffers.dispose(),
                this
            }
        }
        class Sr extends Ho {
            constructor() {
                super(Di(Sr.getDefaults(), arguments, ["url", "onload"])),
                this.name = "GrainPlayer",
                this._loopStart = 0,
                this._loopEnd = 0,
                this._activeSources = [];
                const t = Di(Sr.getDefaults(), arguments, ["url", "onload"]);
                this.buffer = new Xi({
                    onload: t.onload,
                    onerror: t.onerror,
                    reverse: t.reverse,
                    url: t.url
                }),
                this._clock = new qo({
                    context: this.context,
                    callback: this._tick.bind(this),
                    frequency: 1 / t.grainSize
                }),
                this._playbackRate = t.playbackRate,
                this._grainSize = t.grainSize,
                this._overlap = t.overlap,
                this.detune = t.detune,
                this.overlap = t.overlap,
                this.loop = t.loop,
                this.playbackRate = t.playbackRate,
                this.grainSize = t.grainSize,
                this.loopStart = t.loopStart,
                this.loopEnd = t.loopEnd,
                this.reverse = t.reverse,
                this._clock.on("stop", this._onstop.bind(this))
            }
            static getDefaults() {
                return Object.assign(Ho.getDefaults(), {
                    onload: Zi,
                    onerror: Zi,
                    overlap: .1,
                    grainSize: .2,
                    playbackRate: 1,
                    detune: 0,
                    loop: !1,
                    loopStart: 0,
                    loopEnd: 0,
                    reverse: !1
                })
            }
            _start(t, e, s) {
                e = Oi(e, 0),
                e = this.toSeconds(e),
                t = this.toSeconds(t);
                const n = 1 / this._clock.frequency.getValueAtTime(t);
                this._clock.start(t, e / n),
                s && this.stop(t + this.toSeconds(s))
            }
            restart(t, e, s) {
                return super.restart(t, e, s),
                this
            }
            _restart(t, e, s) {
                this._stop(t),
                this._start(t, e, s)
            }
            _stop(t) {
                this._clock.stop(t)
            }
            _onstop(t) {
                this._activeSources.forEach(e=>{
                    e.fadeOut = 0,
                    e.stop(t)
                }
                ),
                this.onstop(this)
            }
            _tick(t) {
                const e = this._clock.getTicksAtTime(t)
                  , s = e * this._grainSize;
                if (this.log("offset", s),
                !this.loop && s > this.buffer.duration)
                    return void this.stop(t);
                const n = s < this._overlap ? 0 : this._overlap
                  , i = new $o({
                    context: this.context,
                    url: this.buffer,
                    fadeIn: n,
                    fadeOut: this._overlap,
                    loop: this.loop,
                    loopStart: this._loopStart,
                    loopEnd: this._loopEnd,
                    playbackRate: no(this.detune / 100)
                }).connect(this.output);
                i.start(t, this._grainSize * e),
                i.stop(t + this._grainSize / this.playbackRate),
                this._activeSources.push(i),
                i.onended = ()=>{
                    const t = this._activeSources.indexOf(i);
                    -1 !== t && this._activeSources.splice(t, 1)
                }
            }
            get playbackRate() {
                return this._playbackRate
            }
            set playbackRate(t) {
                ei(t, .001),
                this._playbackRate = t,
                this.grainSize = this._grainSize
            }
            get loopStart() {
                return this._loopStart
            }
            set loopStart(t) {
                this.buffer.loaded && ei(this.toSeconds(t), 0, this.buffer.duration),
                this._loopStart = this.toSeconds(t)
            }
            get loopEnd() {
                return this._loopEnd
            }
            set loopEnd(t) {
                this.buffer.loaded && ei(this.toSeconds(t), 0, this.buffer.duration),
                this._loopEnd = this.toSeconds(t)
            }
            get reverse() {
                return this.buffer.reverse
            }
            set reverse(t) {
                this.buffer.reverse = t
            }
            get grainSize() {
                return this._grainSize
            }
            set grainSize(t) {
                this._grainSize = this.toSeconds(t),
                this._clock.frequency.setValueAtTime(this._playbackRate / this._grainSize, this.now())
            }
            get overlap() {
                return this._overlap
            }
            set overlap(t) {
                const e = this.toSeconds(t);
                ei(e, 0),
                this._overlap = e
            }
            get loaded() {
                return this.buffer.loaded
            }
            dispose() {
                return super.dispose(),
                this.buffer.dispose(),
                this._clock.dispose(),
                this._activeSources.forEach(t=>t.dispose()),
                this
            }
        }
        class kr extends or {
            constructor() {
                super(...arguments),
                this.name = "Abs",
                this._abs = new rr({
                    context: this.context,
                    mapping: t=>Math.abs(t) < .001 ? 0 : Math.abs(t)
                }),
                this.input = this._abs,
                this.output = this._abs
            }
            dispose() {
                return super.dispose(),
                this._abs.dispose(),
                this
            }
        }
        class Cr extends or {
            constructor() {
                super(...arguments),
                this.name = "GainToAudio",
                this._norm = new rr({
                    context: this.context,
                    mapping: t=>2 * Math.abs(t) - 1
                }),
                this.input = this._norm,
                this.output = this._norm
            }
            dispose() {
                return super.dispose(),
                this._norm.dispose(),
                this
            }
        }
        class Ar extends or {
            constructor() {
                super(...arguments),
                this.name = "Negate",
                this._multiply = new cr({
                    context: this.context,
                    value: -1
                }),
                this.input = this._multiply,
                this.output = this._multiply
            }
            dispose() {
                return super.dispose(),
                this._multiply.dispose(),
                this
            }
        }
        class Dr extends Do {
            constructor() {
                super(Object.assign(Di(Dr.getDefaults(), arguments, ["value"]))),
                this.override = !1,
                this.name = "Subtract",
                this._sum = new ko({
                    context: this.context
                }),
                this.input = this._sum,
                this.output = this._sum,
                this._neg = new Ar({
                    context: this.context
                }),
                this.subtrahend = this._param,
                bo(this._constantSource, this._neg, this._sum)
            }
            static getDefaults() {
                return Object.assign(Do.getDefaults(), {
                    value: 0
                })
            }
            dispose() {
                return super.dispose(),
                this._neg.dispose(),
                this._sum.dispose(),
                this
            }
        }
        class Or extends or {
            constructor() {
                super(Object.assign(Di(Or.getDefaults(), arguments))),
                this.name = "GreaterThanZero",
                this._thresh = this.output = new rr({
                    context: this.context,
                    length: 127,
                    mapping: t=>t <= 0 ? 0 : 1
                }),
                this._scale = this.input = new cr({
                    context: this.context,
                    value: 1e4
                }),
                this._scale.connect(this._thresh)
            }
            dispose() {
                return super.dispose(),
                this._scale.dispose(),
                this._thresh.dispose(),
                this
            }
        }
        class Mr extends Do {
            constructor() {
                super(Object.assign(Di(Mr.getDefaults(), arguments, ["value"]))),
                this.name = "GreaterThan",
                this.override = !1;
                const t = Di(Mr.getDefaults(), arguments, ["value"]);
                this._subtract = this.input = new Dr({
                    context: this.context,
                    value: t.value
                }),
                this._gtz = this.output = new Or({
                    context: this.context
                }),
                this.comparator = this._param = this._subtract.subtrahend,
                Ui(this, "comparator"),
                this._subtract.connect(this._gtz)
            }
            static getDefaults() {
                return Object.assign(Do.getDefaults(), {
                    value: 0
                })
            }
            dispose() {
                return super.dispose(),
                this._gtz.dispose(),
                this._subtract.dispose(),
                this.comparator.dispose(),
                this
            }
        }
        class Er extends or {
            constructor() {
                super(Object.assign(Di(Er.getDefaults(), arguments, ["value"]))),
                this.name = "Pow";
                const t = Di(Er.getDefaults(), arguments, ["value"]);
                this._exponentScaler = this.input = this.output = new rr({
                    context: this.context,
                    mapping: this._expFunc(t.value),
                    length: 8192
                }),
                this._exponent = t.value
            }
            static getDefaults() {
                return Object.assign(or.getDefaults(), {
                    value: 1
                })
            }
            _expFunc(t) {
                return e=>Math.pow(Math.abs(e), t)
            }
            get value() {
                return this._exponent
            }
            set value(t) {
                this._exponent = t,
                this._exponentScaler.setMap(this._expFunc(this._exponent))
            }
            dispose() {
                return super.dispose(),
                this._exponentScaler.dispose(),
                this
            }
        }
        class Rr extends gr {
            constructor() {
                super(Object.assign(Di(Rr.getDefaults(), arguments, ["min", "max", "exponent"]))),
                this.name = "ScaleExp";
                const t = Di(Rr.getDefaults(), arguments, ["min", "max", "exponent"]);
                this.input = this._exp = new Er({
                    context: this.context,
                    value: t.exponent
                }),
                this._exp.connect(this._mult)
            }
            static getDefaults() {
                return Object.assign(gr.getDefaults(), {
                    exponent: 1
                })
            }
            get exponent() {
                return this._exp.value
            }
            set exponent(t) {
                this._exp.value = t
            }
            dispose() {
                return super.dispose(),
                this._exp.dispose(),
                this
            }
        }
        class qr extends Do {
            constructor() {
                super(Di(Do.getDefaults(), arguments, ["value", "units"])),
                this.name = "SyncedSignal",
                this.override = !1;
                const t = Di(Do.getDefaults(), arguments, ["value", "units"]);
                this._lastVal = t.value,
                this._synced = this.context.transport.scheduleRepeat(this._onTick.bind(this), "1i"),
                this._syncedCallback = this._anchorValue.bind(this),
                this.context.transport.on("start", this._syncedCallback),
                this.context.transport.on("pause", this._syncedCallback),
                this.context.transport.on("stop", this._syncedCallback),
                this._constantSource.disconnect(),
                this._constantSource.stop(0),
                this._constantSource = this.output = new Ao({
                    context: this.context,
                    offset: t.value,
                    units: t.units
                }).start(0),
                this.setValueAtTime(t.value, 0)
            }
            _onTick(t) {
                const e = super.getValueAtTime(this.context.transport.seconds);
                this._lastVal !== e && (this._lastVal = e,
                this._constantSource.offset.setValueAtTime(e, t))
            }
            _anchorValue(t) {
                const e = super.getValueAtTime(this.context.transport.seconds);
                this._lastVal = e,
                this._constantSource.offset.cancelAndHoldAtTime(t),
                this._constantSource.offset.setValueAtTime(e, t)
            }
            getValueAtTime(t) {
                const e = new mo(this.context,t).toSeconds();
                return super.getValueAtTime(e)
            }
            setValueAtTime(t, e) {
                const s = new mo(this.context,e).toSeconds();
                return super.setValueAtTime(t, s),
                this
            }
            linearRampToValueAtTime(t, e) {
                const s = new mo(this.context,e).toSeconds();
                return super.linearRampToValueAtTime(t, s),
                this
            }
            exponentialRampToValueAtTime(t, e) {
                const s = new mo(this.context,e).toSeconds();
                return super.exponentialRampToValueAtTime(t, s),
                this
            }
            setTargetAtTime(t, e, s) {
                const n = new mo(this.context,e).toSeconds();
                return super.setTargetAtTime(t, n, s),
                this
            }
            cancelScheduledValues(t) {
                const e = new mo(this.context,t).toSeconds();
                return super.cancelScheduledValues(e),
                this
            }
            setValueCurveAtTime(t, e, s, n) {
                const i = new mo(this.context,e).toSeconds();
                return s = this.toSeconds(s),
                super.setValueCurveAtTime(t, i, s, n),
                this
            }
            cancelAndHoldAtTime(t) {
                const e = new mo(this.context,t).toSeconds();
                return super.cancelAndHoldAtTime(e),
                this
            }
            setRampPoint(t) {
                const e = new mo(this.context,t).toSeconds();
                return super.setRampPoint(e),
                this
            }
            exponentialRampTo(t, e, s) {
                const n = new mo(this.context,s).toSeconds();
                return super.exponentialRampTo(t, e, n),
                this
            }
            linearRampTo(t, e, s) {
                const n = new mo(this.context,s).toSeconds();
                return super.linearRampTo(t, e, n),
                this
            }
            targetRampTo(t, e, s) {
                const n = new mo(this.context,s).toSeconds();
                return super.targetRampTo(t, e, n),
                this
            }
            dispose() {
                return super.dispose(),
                this.context.transport.clear(this._synced),
                this.context.transport.off("start", this._syncedCallback),
                this.context.transport.off("pause", this._syncedCallback),
                this.context.transport.off("stop", this._syncedCallback),
                this._constantSource.dispose(),
                this
            }
        }
        class Fr extends wo {
            constructor() {
                super(Di(Fr.getDefaults(), arguments, ["attack", "decay", "sustain", "release"])),
                this.name = "Envelope",
                this._sig = new Do({
                    context: this.context,
                    value: 0
                }),
                this.output = this._sig,
                this.input = void 0;
                const t = Di(Fr.getDefaults(), arguments, ["attack", "decay", "sustain", "release"]);
                this.attack = t.attack,
                this.decay = t.decay,
                this.sustain = t.sustain,
                this.release = t.release,
                this.attackCurve = t.attackCurve,
                this.releaseCurve = t.releaseCurve,
                this.decayCurve = t.decayCurve
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    attack: .01,
                    attackCurve: "linear",
                    decay: .1,
                    decayCurve: "exponential",
                    release: 1,
                    releaseCurve: "exponential",
                    sustain: .5
                })
            }
            get value() {
                return this.getValueAtTime(this.now())
            }
            _getCurve(t, e) {
                if (fi(t))
                    return t;
                {
                    let s;
                    for (s in Ir)
                        if (Ir[s][e] === t)
                            return s;
                    return t
                }
            }
            _setCurve(t, e, s) {
                if (fi(s) && Reflect.has(Ir, s)) {
                    const n = Ir[s];
                    li(n) ? "_decayCurve" !== t && (this[t] = n[e]) : this[t] = n
                } else {
                    if (!di(s) || "_decayCurve" === t)
                        throw new Error("Envelope: invalid curve: " + s);
                    this[t] = s
                }
            }
            get attackCurve() {
                return this._getCurve(this._attackCurve, "In")
            }
            set attackCurve(t) {
                this._setCurve("_attackCurve", "In", t)
            }
            get releaseCurve() {
                return this._getCurve(this._releaseCurve, "Out")
            }
            set releaseCurve(t) {
                this._setCurve("_releaseCurve", "Out", t)
            }
            get decayCurve() {
                return this._decayCurve
            }
            set decayCurve(t) {
                ti(["linear", "exponential"].some(e=>e === t), "Invalid envelope curve: " + t),
                this._decayCurve = t
            }
            triggerAttack(t, e=1) {
                this.log("triggerAttack", t, e),
                t = this.toSeconds(t);
                let s = this.toSeconds(this.attack);
                const n = this.toSeconds(this.decay)
                  , i = this.getValueAtTime(t);
                if (i > 0) {
                    s = (1 - i) / (1 / s)
                }
                if (s < this.sampleTime)
                    this._sig.cancelScheduledValues(t),
                    this._sig.setValueAtTime(e, t);
                else if ("linear" === this._attackCurve)
                    this._sig.linearRampTo(e, s, t);
                else if ("exponential" === this._attackCurve)
                    this._sig.targetRampTo(e, s, t);
                else {
                    this._sig.cancelAndHoldAtTime(t);
                    let n = this._attackCurve;
                    for (let t = 1; t < n.length; t++)
                        if (n[t - 1] <= i && i <= n[t]) {
                            n = this._attackCurve.slice(t),
                            n[0] = i;
                            break
                        }
                    this._sig.setValueCurveAtTime(n, t, s, e)
                }
                if (n && this.sustain < 1) {
                    const i = e * this.sustain
                      , o = t + s;
                    this.log("decay", o),
                    "linear" === this._decayCurve ? this._sig.linearRampToValueAtTime(i, n + o) : this._sig.exponentialApproachValueAtTime(i, o, n)
                }
                return this
            }
            triggerRelease(t) {
                this.log("triggerRelease", t),
                t = this.toSeconds(t);
                const e = this.getValueAtTime(t);
                if (e > 0) {
                    const s = this.toSeconds(this.release);
                    s < this.sampleTime ? this._sig.setValueAtTime(0, t) : "linear" === this._releaseCurve ? this._sig.linearRampTo(0, s, t) : "exponential" === this._releaseCurve ? this._sig.targetRampTo(0, s, t) : (ti(di(this._releaseCurve), "releaseCurve must be either 'linear', 'exponential' or an array"),
                    this._sig.cancelAndHoldAtTime(t),
                    this._sig.setValueCurveAtTime(this._releaseCurve, t, s, e))
                }
                return this
            }
            getValueAtTime(t) {
                return this._sig.getValueAtTime(t)
            }
            triggerAttackRelease(t, e, s=1) {
                return e = this.toSeconds(e),
                this.triggerAttack(e, s),
                this.triggerRelease(e + this.toSeconds(t)),
                this
            }
            cancel(t) {
                return this._sig.cancelScheduledValues(this.toSeconds(t)),
                this
            }
            connect(t, e=0, s=0) {
                return Oo(this, t, e, s),
                this
            }
            asArray(t=1024) {
                return yi(this, void 0, void 0, (function*() {
                    const e = t / this.context.sampleRate
                      , s = new Yi(1,e,this.context.sampleRate)
                      , n = this.toSeconds(this.attack) + this.toSeconds(this.decay)
                      , i = n + this.toSeconds(this.release)
                      , o = .1 * i
                      , r = i + o
                      , a = new this.constructor(Object.assign(this.get(), {
                        attack: e * this.toSeconds(this.attack) / r,
                        decay: e * this.toSeconds(this.decay) / r,
                        release: e * this.toSeconds(this.release) / r,
                        context: s
                    }));
                    a._sig.toDestination(),
                    a.triggerAttackRelease(e * (n + o) / r, 0);
                    return (yield s.render()).getChannelData(0)
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this._sig.dispose(),
                this
            }
        }
        vi([wr(0)], Fr.prototype, "attack", void 0),
        vi([wr(0)], Fr.prototype, "decay", void 0),
        vi([xr(0, 1)], Fr.prototype, "sustain", void 0),
        vi([wr(0)], Fr.prototype, "release", void 0);
        const Ir = (()=>{
            let t, e;
            const s = [];
            for (t = 0; t < 128; t++)
                s[t] = Math.sin(t / 127 * (Math.PI / 2));
            const n = [];
            for (t = 0; t < 127; t++) {
                e = t / 127;
                const s = Math.sin(e * (2 * Math.PI) * 6.4 - Math.PI / 2) + 1;
                n[t] = s / 10 + .83 * e
            }
            n[127] = 1;
            const i = [];
            for (t = 0; t < 128; t++)
                i[t] = Math.ceil(t / 127 * 5) / 5;
            const o = [];
            for (t = 0; t < 128; t++)
                e = t / 127,
                o[t] = .5 * (1 - Math.cos(Math.PI * e));
            const r = [];
            for (t = 0; t < 128; t++) {
                e = t / 127;
                const s = 4 * Math.pow(e, 3) + .2
                  , n = Math.cos(s * Math.PI * 2 * e);
                r[t] = Math.abs(n * (1 - e))
            }
            function a(t) {
                const e = new Array(t.length);
                for (let s = 0; s < t.length; s++)
                    e[s] = 1 - t[s];
                return e
            }
            return {
                bounce: {
                    In: a(r),
                    Out: r
                },
                cosine: {
                    In: s,
                    Out: (c = s,
                    c.slice(0).reverse())
                },
                exponential: "exponential",
                linear: "linear",
                ripple: {
                    In: n,
                    Out: a(n)
                },
                sine: {
                    In: o,
                    Out: a(o)
                },
                step: {
                    In: i,
                    Out: a(i)
                }
            };
            var c
        }
        )();
        class Vr extends wo {
            constructor() {
                super(Di(Vr.getDefaults(), arguments)),
                this._scheduledEvents = [],
                this._synced = !1,
                this._original_triggerAttack = this.triggerAttack,
                this._original_triggerRelease = this.triggerRelease;
                const t = Di(Vr.getDefaults(), arguments);
                this._volume = this.output = new Go({
                    context: this.context,
                    volume: t.volume
                }),
                this.volume = this._volume.volume,
                Ui(this, "volume")
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    volume: 0
                })
            }
            sync() {
                return this._syncState() && (this._syncMethod("triggerAttack", 1),
                this._syncMethod("triggerRelease", 0)),
                this
            }
            _syncState() {
                let t = !1;
                return this._synced || (this._synced = !0,
                t = !0),
                t
            }
            _syncMethod(t, e) {
                const s = this["_original_" + t] = this[t];
                this[t] = (...t)=>{
                    const n = t[e]
                      , i = this.context.transport.schedule(n=>{
                        t[e] = n,
                        s.apply(this, t)
                    }
                    , n);
                    this._scheduledEvents.push(i)
                }
            }
            unsync() {
                return this._scheduledEvents.forEach(t=>this.context.transport.clear(t)),
                this._scheduledEvents = [],
                this._synced && (this._synced = !1,
                this.triggerAttack = this._original_triggerAttack,
                this.triggerRelease = this._original_triggerRelease),
                this
            }
            triggerAttackRelease(t, e, s, n) {
                const i = this.toSeconds(s)
                  , o = this.toSeconds(e);
                return this.triggerAttack(t, i, n),
                this.triggerRelease(i + o),
                this
            }
            dispose() {
                return super.dispose(),
                this._volume.dispose(),
                this.unsync(),
                this._scheduledEvents = [],
                this
            }
        }
        class Nr extends Vr {
            constructor() {
                super(Di(Nr.getDefaults(), arguments));
                const t = Di(Nr.getDefaults(), arguments);
                this.portamento = t.portamento,
                this.onsilence = t.onsilence
            }
            static getDefaults() {
                return Object.assign(Vr.getDefaults(), {
                    detune: 0,
                    onsilence: Zi,
                    portamento: 0
                })
            }
            triggerAttack(t, e, s=1) {
                this.log("triggerAttack", t, e, s);
                const n = this.toSeconds(e);
                return this._triggerEnvelopeAttack(n, s),
                this.setNote(t, n),
                this
            }
            triggerRelease(t) {
                this.log("triggerRelease", t);
                const e = this.toSeconds(t);
                return this._triggerEnvelopeRelease(e),
                this
            }
            setNote(t, e) {
                const s = this.toSeconds(e)
                  , n = t instanceof lo ? t.toFrequency() : t;
                if (this.portamento > 0 && this.getLevelAtTime(s) > .05) {
                    const t = this.toSeconds(this.portamento);
                    this.frequency.exponentialRampTo(n, t, s)
                } else
                    this.frequency.setValueAtTime(n, s);
                return this
            }
        }
        vi([wr(0)], Nr.prototype, "portamento", void 0);
        class Pr extends Fr {
            constructor() {
                super(Di(Pr.getDefaults(), arguments, ["attack", "decay", "sustain", "release"])),
                this.name = "AmplitudeEnvelope",
                this._gainNode = new ko({
                    context: this.context,
                    gain: 0
                }),
                this.output = this._gainNode,
                this.input = this._gainNode,
                this._sig.connect(this._gainNode.gain),
                this.output = this._gainNode,
                this.input = this._gainNode
            }
            dispose() {
                return super.dispose(),
                this._gainNode.dispose(),
                this
            }
        }
        class jr extends Nr {
            constructor() {
                super(Di(jr.getDefaults(), arguments)),
                this.name = "Synth";
                const t = Di(jr.getDefaults(), arguments);
                this.oscillator = new _r(Object.assign({
                    context: this.context,
                    detune: t.detune,
                    onstop: ()=>this.onsilence(this)
                }, t.oscillator)),
                this.frequency = this.oscillator.frequency,
                this.detune = this.oscillator.detune,
                this.envelope = new Pr(Object.assign({
                    context: this.context
                }, t.envelope)),
                this.oscillator.chain(this.envelope, this.output),
                Ui(this, ["oscillator", "frequency", "detune", "envelope"])
            }
            static getDefaults() {
                return Object.assign(Nr.getDefaults(), {
                    envelope: Object.assign(Mi(Fr.getDefaults(), Object.keys(wo.getDefaults())), {
                        attack: .005,
                        decay: .1,
                        release: 1,
                        sustain: .3
                    }),
                    oscillator: Object.assign(Mi(_r.getDefaults(), [...Object.keys(Ho.getDefaults()), "frequency", "detune"]), {
                        type: "triangle"
                    })
                })
            }
            _triggerEnvelopeAttack(t, e) {
                if (this.envelope.triggerAttack(t, e),
                this.oscillator.start(t),
                0 === this.envelope.sustain) {
                    const e = this.toSeconds(this.envelope.attack)
                      , s = this.toSeconds(this.envelope.decay);
                    this.oscillator.stop(t + e + s)
                }
            }
            _triggerEnvelopeRelease(t) {
                this.envelope.triggerRelease(t),
                this.oscillator.stop(t + this.toSeconds(this.envelope.release))
            }
            getLevelAtTime(t) {
                return t = this.toSeconds(t),
                this.envelope.getValueAtTime(t)
            }
            dispose() {
                return super.dispose(),
                this.oscillator.dispose(),
                this.envelope.dispose(),
                this
            }
        }
        class Lr extends Nr {
            constructor() {
                super(Di(Lr.getDefaults(), arguments)),
                this.name = "ModulationSynth";
                const t = Di(Lr.getDefaults(), arguments);
                this._carrier = new jr({
                    context: this.context,
                    oscillator: t.oscillator,
                    envelope: t.envelope,
                    onsilence: ()=>this.onsilence(this),
                    volume: -10
                }),
                this._modulator = new jr({
                    context: this.context,
                    oscillator: t.modulation,
                    envelope: t.modulationEnvelope,
                    volume: -10
                }),
                this.oscillator = this._carrier.oscillator,
                this.envelope = this._carrier.envelope,
                this.modulation = this._modulator.oscillator,
                this.modulationEnvelope = this._modulator.envelope,
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency"
                }),
                this.detune = new Do({
                    context: this.context,
                    value: t.detune,
                    units: "cents"
                }),
                this.harmonicity = new cr({
                    context: this.context,
                    value: t.harmonicity,
                    minValue: 0
                }),
                this._modulationNode = new ko({
                    context: this.context,
                    gain: 0
                }),
                Ui(this, ["frequency", "harmonicity", "oscillator", "envelope", "modulation", "modulationEnvelope", "detune"])
            }
            static getDefaults() {
                return Object.assign(Nr.getDefaults(), {
                    harmonicity: 3,
                    oscillator: Object.assign(Mi(_r.getDefaults(), [...Object.keys(Ho.getDefaults()), "frequency", "detune"]), {
                        type: "sine"
                    }),
                    envelope: Object.assign(Mi(Fr.getDefaults(), Object.keys(wo.getDefaults())), {
                        attack: .01,
                        decay: .01,
                        sustain: 1,
                        release: .5
                    }),
                    modulation: Object.assign(Mi(_r.getDefaults(), [...Object.keys(Ho.getDefaults()), "frequency", "detune"]), {
                        type: "square"
                    }),
                    modulationEnvelope: Object.assign(Mi(Fr.getDefaults(), Object.keys(wo.getDefaults())), {
                        attack: .5,
                        decay: 0,
                        sustain: 1,
                        release: .5
                    })
                })
            }
            _triggerEnvelopeAttack(t, e) {
                this._carrier._triggerEnvelopeAttack(t, e),
                this._modulator._triggerEnvelopeAttack(t, e)
            }
            _triggerEnvelopeRelease(t) {
                return this._carrier._triggerEnvelopeRelease(t),
                this._modulator._triggerEnvelopeRelease(t),
                this
            }
            getLevelAtTime(t) {
                return t = this.toSeconds(t),
                this.envelope.getValueAtTime(t)
            }
            dispose() {
                return super.dispose(),
                this._carrier.dispose(),
                this._modulator.dispose(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this.harmonicity.dispose(),
                this._modulationNode.dispose(),
                this
            }
        }
        class zr extends Lr {
            constructor() {
                super(Di(zr.getDefaults(), arguments)),
                this.name = "AMSynth",
                this._modulationScale = new ar({
                    context: this.context
                }),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(this.harmonicity, this._modulator.frequency),
                this.detune.fan(this._carrier.detune, this._modulator.detune),
                this._modulator.chain(this._modulationScale, this._modulationNode.gain),
                this._carrier.chain(this._modulationNode, this.output)
            }
            dispose() {
                return super.dispose(),
                this._modulationScale.dispose(),
                this
            }
        }
        class Br extends wo {
            constructor() {
                super(Di(Br.getDefaults(), arguments, ["frequency", "type"])),
                this.name = "BiquadFilter";
                const t = Di(Br.getDefaults(), arguments, ["frequency", "type"]);
                this._filter = this.context.createBiquadFilter(),
                this.input = this.output = this._filter,
                this.Q = new xo({
                    context: this.context,
                    units: "number",
                    value: t.Q,
                    param: this._filter.Q
                }),
                this.frequency = new xo({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency,
                    param: this._filter.frequency
                }),
                this.detune = new xo({
                    context: this.context,
                    units: "cents",
                    value: t.detune,
                    param: this._filter.detune
                }),
                this.gain = new xo({
                    context: this.context,
                    units: "decibels",
                    convert: !1,
                    value: t.gain,
                    param: this._filter.gain
                }),
                this.type = t.type
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    Q: 1,
                    type: "lowpass",
                    frequency: 350,
                    detune: 0,
                    gain: 0
                })
            }
            get type() {
                return this._filter.type
            }
            set type(t) {
                ti(-1 !== ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"].indexOf(t), "Invalid filter type: " + t),
                this._filter.type = t
            }
            getFrequencyResponse(t=128) {
                const e = new Float32Array(t);
                for (let s = 0; s < t; s++) {
                    const n = 19980 * Math.pow(s / t, 2) + 20;
                    e[s] = n
                }
                const s = new Float32Array(t)
                  , n = new Float32Array(t)
                  , i = this.context.createBiquadFilter();
                return i.type = this.type,
                i.Q.value = this.Q.value,
                i.frequency.value = this.frequency.value,
                i.gain.value = this.gain.value,
                i.getFrequencyResponse(e, s, n),
                s
            }
            dispose() {
                return super.dispose(),
                this._filter.disconnect(),
                this.Q.dispose(),
                this.frequency.dispose(),
                this.gain.dispose(),
                this.detune.dispose(),
                this
            }
        }
        class Wr extends wo {
            constructor() {
                super(Di(Wr.getDefaults(), arguments, ["frequency", "type", "rolloff"])),
                this.name = "Filter",
                this.input = new ko({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this._filters = [];
                const t = Di(Wr.getDefaults(), arguments, ["frequency", "type", "rolloff"]);
                this._filters = [],
                this.Q = new Do({
                    context: this.context,
                    units: "positive",
                    value: t.Q
                }),
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency
                }),
                this.detune = new Do({
                    context: this.context,
                    units: "cents",
                    value: t.detune
                }),
                this.gain = new Do({
                    context: this.context,
                    units: "decibels",
                    convert: !1,
                    value: t.gain
                }),
                this._type = t.type,
                this.rolloff = t.rolloff,
                Ui(this, ["detune", "frequency", "gain", "Q"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    Q: 1,
                    detune: 0,
                    frequency: 350,
                    gain: 0,
                    rolloff: -12,
                    type: "lowpass"
                })
            }
            get type() {
                return this._type
            }
            set type(t) {
                ti(-1 !== ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"].indexOf(t), "Invalid filter type: " + t),
                this._type = t,
                this._filters.forEach(e=>e.type = t)
            }
            get rolloff() {
                return this._rolloff
            }
            set rolloff(t) {
                const e = ui(t) ? t : parseInt(t, 10)
                  , s = [-12, -24, -48, -96];
                let n = s.indexOf(e);
                ti(-1 !== n, "rolloff can only be " + s.join(", ")),
                n += 1,
                this._rolloff = e,
                this.input.disconnect(),
                this._filters.forEach(t=>t.disconnect()),
                this._filters = new Array(n);
                for (let t = 0; t < n; t++) {
                    const e = new Br({
                        context: this.context
                    });
                    e.type = this._type,
                    this.frequency.connect(e.frequency),
                    this.detune.connect(e.detune),
                    this.Q.connect(e.Q),
                    this.gain.connect(e.gain),
                    this._filters[t] = e
                }
                this._internalChannels = this._filters,
                bo(this.input, ...this._internalChannels, this.output)
            }
            getFrequencyResponse(t=128) {
                const e = new Br({
                    frequency: this.frequency.value,
                    gain: this.gain.value,
                    Q: this.Q.value,
                    type: this._type,
                    detune: this.detune.value
                })
                  , s = new Float32Array(t).map(()=>1);
                return this._filters.forEach(()=>{
                    e.getFrequencyResponse(t).forEach((t,e)=>s[e] *= t)
                }
                ),
                e.dispose(),
                s
            }
            dispose() {
                return super.dispose(),
                this._filters.forEach(t=>{
                    t.dispose()
                }
                ),
                Qi(this, ["detune", "frequency", "gain", "Q"]),
                this.frequency.dispose(),
                this.Q.dispose(),
                this.detune.dispose(),
                this.gain.dispose(),
                this
            }
        }
        class Gr extends Fr {
            constructor() {
                super(Di(Gr.getDefaults(), arguments, ["attack", "decay", "sustain", "release"])),
                this.name = "FrequencyEnvelope";
                const t = Di(Gr.getDefaults(), arguments, ["attack", "decay", "sustain", "release"]);
                this._octaves = t.octaves,
                this._baseFrequency = this.toFrequency(t.baseFrequency),
                this._exponent = this.input = new Er({
                    context: this.context,
                    value: t.exponent
                }),
                this._scale = this.output = new gr({
                    context: this.context,
                    min: this._baseFrequency,
                    max: this._baseFrequency * Math.pow(2, this._octaves)
                }),
                this._sig.chain(this._exponent, this._scale)
            }
            static getDefaults() {
                return Object.assign(Fr.getDefaults(), {
                    baseFrequency: 200,
                    exponent: 1,
                    octaves: 4
                })
            }
            get baseFrequency() {
                return this._baseFrequency
            }
            set baseFrequency(t) {
                const e = this.toFrequency(t);
                ei(e, 0),
                this._baseFrequency = e,
                this._scale.min = this._baseFrequency,
                this.octaves = this._octaves
            }
            get octaves() {
                return this._octaves
            }
            set octaves(t) {
                this._octaves = t,
                this._scale.max = this._baseFrequency * Math.pow(2, t)
            }
            get exponent() {
                return this._exponent.value
            }
            set exponent(t) {
                this._exponent.value = t
            }
            dispose() {
                return super.dispose(),
                this._exponent.dispose(),
                this._scale.dispose(),
                this
            }
        }
        class Ur extends Nr {
            constructor() {
                super(Di(Ur.getDefaults(), arguments)),
                this.name = "MonoSynth";
                const t = Di(Ur.getDefaults(), arguments);
                this.oscillator = new _r(Object.assign(t.oscillator, {
                    context: this.context,
                    detune: t.detune,
                    onstop: ()=>this.onsilence(this)
                })),
                this.frequency = this.oscillator.frequency,
                this.detune = this.oscillator.detune,
                this.filter = new Wr(Object.assign(t.filter, {
                    context: this.context
                })),
                this.filterEnvelope = new Gr(Object.assign(t.filterEnvelope, {
                    context: this.context
                })),
                this.envelope = new Pr(Object.assign(t.envelope, {
                    context: this.context
                })),
                this.oscillator.chain(this.filter, this.envelope, this.output),
                this.filterEnvelope.connect(this.filter.frequency),
                Ui(this, ["oscillator", "frequency", "detune", "filter", "filterEnvelope", "envelope"])
            }
            static getDefaults() {
                return Object.assign(Nr.getDefaults(), {
                    envelope: Object.assign(Mi(Fr.getDefaults(), Object.keys(wo.getDefaults())), {
                        attack: .005,
                        decay: .1,
                        release: 1,
                        sustain: .9
                    }),
                    filter: Object.assign(Mi(Wr.getDefaults(), Object.keys(wo.getDefaults())), {
                        Q: 1,
                        rolloff: -12,
                        type: "lowpass"
                    }),
                    filterEnvelope: Object.assign(Mi(Gr.getDefaults(), Object.keys(wo.getDefaults())), {
                        attack: .6,
                        baseFrequency: 200,
                        decay: .2,
                        exponent: 2,
                        octaves: 3,
                        release: 2,
                        sustain: .5
                    }),
                    oscillator: Object.assign(Mi(_r.getDefaults(), Object.keys(Ho.getDefaults())), {
                        type: "sawtooth"
                    })
                })
            }
            _triggerEnvelopeAttack(t, e=1) {
                if (this.envelope.triggerAttack(t, e),
                this.filterEnvelope.triggerAttack(t),
                this.oscillator.start(t),
                0 === this.envelope.sustain) {
                    const e = this.toSeconds(this.envelope.attack)
                      , s = this.toSeconds(this.envelope.decay);
                    this.oscillator.stop(t + e + s)
                }
            }
            _triggerEnvelopeRelease(t) {
                this.envelope.triggerRelease(t),
                this.filterEnvelope.triggerRelease(t),
                this.oscillator.stop(t + this.toSeconds(this.envelope.release))
            }
            getLevelAtTime(t) {
                return t = this.toSeconds(t),
                this.envelope.getValueAtTime(t)
            }
            dispose() {
                return super.dispose(),
                this.oscillator.dispose(),
                this.envelope.dispose(),
                this.filterEnvelope.dispose(),
                this.filter.dispose(),
                this
            }
        }
        class Qr extends Nr {
            constructor() {
                super(Di(Qr.getDefaults(), arguments)),
                this.name = "DuoSynth";
                const t = Di(Qr.getDefaults(), arguments);
                this.voice0 = new Ur(Object.assign(t.voice0, {
                    context: this.context,
                    onsilence: ()=>this.onsilence(this)
                })),
                this.voice1 = new Ur(Object.assign(t.voice1, {
                    context: this.context
                })),
                this.harmonicity = new cr({
                    context: this.context,
                    units: "positive",
                    value: t.harmonicity
                }),
                this._vibrato = new yr({
                    frequency: t.vibratoRate,
                    context: this.context,
                    min: -50,
                    max: 50
                }),
                this._vibrato.start(),
                this.vibratoRate = this._vibrato.frequency,
                this._vibratoGain = new ko({
                    context: this.context,
                    units: "normalRange",
                    gain: t.vibratoAmount
                }),
                this.vibratoAmount = this._vibratoGain.gain,
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: 440
                }),
                this.detune = new Do({
                    context: this.context,
                    units: "cents",
                    value: t.detune
                }),
                this.frequency.connect(this.voice0.frequency),
                this.frequency.chain(this.harmonicity, this.voice1.frequency),
                this._vibrato.connect(this._vibratoGain),
                this._vibratoGain.fan(this.voice0.detune, this.voice1.detune),
                this.detune.fan(this.voice0.detune, this.voice1.detune),
                this.voice0.connect(this.output),
                this.voice1.connect(this.output),
                Ui(this, ["voice0", "voice1", "frequency", "vibratoAmount", "vibratoRate"])
            }
            getLevelAtTime(t) {
                return t = this.toSeconds(t),
                this.voice0.envelope.getValueAtTime(t) + this.voice1.envelope.getValueAtTime(t)
            }
            static getDefaults() {
                return Ai(Nr.getDefaults(), {
                    vibratoAmount: .5,
                    vibratoRate: 5,
                    harmonicity: 1.5,
                    voice0: Ai(Mi(Ur.getDefaults(), Object.keys(Nr.getDefaults())), {
                        filterEnvelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        },
                        envelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        }
                    }),
                    voice1: Ai(Mi(Ur.getDefaults(), Object.keys(Nr.getDefaults())), {
                        filterEnvelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        },
                        envelope: {
                            attack: .01,
                            decay: 0,
                            sustain: 1,
                            release: .5
                        }
                    })
                })
            }
            _triggerEnvelopeAttack(t, e) {
                this.voice0._triggerEnvelopeAttack(t, e),
                this.voice1._triggerEnvelopeAttack(t, e)
            }
            _triggerEnvelopeRelease(t) {
                return this.voice0._triggerEnvelopeRelease(t),
                this.voice1._triggerEnvelopeRelease(t),
                this
            }
            dispose() {
                return super.dispose(),
                this.voice0.dispose(),
                this.voice1.dispose(),
                this.frequency.dispose(),
                this.detune.dispose(),
                this._vibrato.dispose(),
                this.vibratoRate.dispose(),
                this._vibratoGain.dispose(),
                this.harmonicity.dispose(),
                this
            }
        }
        class Zr extends Lr {
            constructor() {
                super(Di(Zr.getDefaults(), arguments)),
                this.name = "FMSynth";
                const t = Di(Zr.getDefaults(), arguments);
                this.modulationIndex = new cr({
                    context: this.context,
                    value: t.modulationIndex
                }),
                this.frequency.connect(this._carrier.frequency),
                this.frequency.chain(this.harmonicity, this._modulator.frequency),
                this.frequency.chain(this.modulationIndex, this._modulationNode),
                this.detune.fan(this._carrier.detune, this._modulator.detune),
                this._modulator.connect(this._modulationNode.gain),
                this._modulationNode.connect(this._carrier.frequency),
                this._carrier.connect(this.output)
            }
            static getDefaults() {
                return Object.assign(Lr.getDefaults(), {
                    modulationIndex: 10
                })
            }
            dispose() {
                return super.dispose(),
                this.modulationIndex.dispose(),
                this
            }
        }
        const Xr = [1, 1.483, 1.932, 2.546, 2.63, 3.897];
        class Yr extends Nr {
            constructor() {
                super(Di(Yr.getDefaults(), arguments)),
                this.name = "MetalSynth",
                this._oscillators = [],
                this._freqMultipliers = [];
                const t = Di(Yr.getDefaults(), arguments);
                this.detune = new Do({
                    context: this.context,
                    units: "cents",
                    value: t.detune
                }),
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency"
                }),
                this._amplitude = new ko({
                    context: this.context,
                    gain: 0
                }).connect(this.output),
                this._highpass = new Wr({
                    Q: 0,
                    context: this.context,
                    type: "highpass"
                }).connect(this._amplitude);
                for (let e = 0; e < Xr.length; e++) {
                    const s = new ur({
                        context: this.context,
                        harmonicity: t.harmonicity,
                        modulationIndex: t.modulationIndex,
                        modulationType: "square",
                        onstop: 0 === e ? ()=>this.onsilence(this) : Zi,
                        type: "square"
                    });
                    s.connect(this._highpass),
                    this._oscillators[e] = s;
                    const n = new cr({
                        context: this.context,
                        value: Xr[e]
                    });
                    this._freqMultipliers[e] = n,
                    this.frequency.chain(n, s.frequency),
                    this.detune.connect(s.detune)
                }
                this._filterFreqScaler = new gr({
                    context: this.context,
                    max: 7e3,
                    min: this.toFrequency(t.resonance)
                }),
                this.envelope = new Fr({
                    attack: t.envelope.attack,
                    attackCurve: "linear",
                    context: this.context,
                    decay: t.envelope.decay,
                    release: t.envelope.release,
                    sustain: 0
                }),
                this.envelope.chain(this._filterFreqScaler, this._highpass.frequency),
                this.envelope.connect(this._amplitude.gain),
                this._octaves = t.octaves,
                this.octaves = t.octaves
            }
            static getDefaults() {
                return Ai(Nr.getDefaults(), {
                    envelope: Object.assign(Mi(Fr.getDefaults(), Object.keys(wo.getDefaults())), {
                        attack: .001,
                        decay: 1.4,
                        release: .2
                    }),
                    harmonicity: 5.1,
                    modulationIndex: 32,
                    octaves: 1.5,
                    resonance: 4e3
                })
            }
            _triggerEnvelopeAttack(t, e=1) {
                return this.envelope.triggerAttack(t, e),
                this._oscillators.forEach(e=>e.start(t)),
                0 === this.envelope.sustain && this._oscillators.forEach(e=>{
                    e.stop(t + this.toSeconds(this.envelope.attack) + this.toSeconds(this.envelope.decay))
                }
                ),
                this
            }
            _triggerEnvelopeRelease(t) {
                return this.envelope.triggerRelease(t),
                this._oscillators.forEach(e=>e.stop(t + this.toSeconds(this.envelope.release))),
                this
            }
            getLevelAtTime(t) {
                return t = this.toSeconds(t),
                this.envelope.getValueAtTime(t)
            }
            get modulationIndex() {
                return this._oscillators[0].modulationIndex.value
            }
            set modulationIndex(t) {
                this._oscillators.forEach(e=>e.modulationIndex.value = t)
            }
            get harmonicity() {
                return this._oscillators[0].harmonicity.value
            }
            set harmonicity(t) {
                this._oscillators.forEach(e=>e.harmonicity.value = t)
            }
            get resonance() {
                return this._filterFreqScaler.min
            }
            set resonance(t) {
                this._filterFreqScaler.min = this.toFrequency(t),
                this.octaves = this._octaves
            }
            get octaves() {
                return this._octaves
            }
            set octaves(t) {
                this._octaves = t,
                this._filterFreqScaler.max = this._filterFreqScaler.min * Math.pow(2, t)
            }
            dispose() {
                return super.dispose(),
                this._oscillators.forEach(t=>t.dispose()),
                this._freqMultipliers.forEach(t=>t.dispose()),
                this.frequency.dispose(),
                this.detune.dispose(),
                this._filterFreqScaler.dispose(),
                this._amplitude.dispose(),
                this.envelope.dispose(),
                this._highpass.dispose(),
                this
            }
        }
        class Hr extends jr {
            constructor() {
                super(Di(Hr.getDefaults(), arguments)),
                this.name = "MembraneSynth",
                this.portamento = 0;
                const t = Di(Hr.getDefaults(), arguments);
                this.pitchDecay = t.pitchDecay,
                this.octaves = t.octaves,
                Ui(this, ["oscillator", "envelope"])
            }
            static getDefaults() {
                return Ai(Nr.getDefaults(), jr.getDefaults(), {
                    envelope: {
                        attack: .001,
                        attackCurve: "exponential",
                        decay: .4,
                        release: 1.4,
                        sustain: .01
                    },
                    octaves: 10,
                    oscillator: {
                        type: "sine"
                    },
                    pitchDecay: .05
                })
            }
            setNote(t, e) {
                const s = this.toSeconds(e)
                  , n = this.toFrequency(t instanceof lo ? t.toFrequency() : t)
                  , i = n * this.octaves;
                return this.oscillator.frequency.setValueAtTime(i, s),
                this.oscillator.frequency.exponentialRampToValueAtTime(n, s + this.toSeconds(this.pitchDecay)),
                this
            }
            dispose() {
                return super.dispose(),
                this
            }
        }
        vi([xr(0)], Hr.prototype, "octaves", void 0),
        vi([wr(0)], Hr.prototype, "pitchDecay", void 0);
        class $r extends Vr {
            constructor() {
                super(Di($r.getDefaults(), arguments)),
                this.name = "NoiseSynth";
                const t = Di($r.getDefaults(), arguments);
                this.noise = new Jo(Object.assign({
                    context: this.context
                }, t.noise)),
                this.envelope = new Pr(Object.assign({
                    context: this.context
                }, t.envelope)),
                this.noise.chain(this.envelope, this.output)
            }
            static getDefaults() {
                return Object.assign(Vr.getDefaults(), {
                    envelope: Object.assign(Mi(Fr.getDefaults(), Object.keys(wo.getDefaults())), {
                        decay: .1,
                        sustain: 0
                    }),
                    noise: Object.assign(Mi(Jo.getDefaults(), Object.keys(Ho.getDefaults())), {
                        type: "white"
                    })
                })
            }
            triggerAttack(t, e=1) {
                return t = this.toSeconds(t),
                this.envelope.triggerAttack(t, e),
                this.noise.start(t),
                0 === this.envelope.sustain && this.noise.stop(t + this.toSeconds(this.envelope.attack) + this.toSeconds(this.envelope.decay)),
                this
            }
            triggerRelease(t) {
                return t = this.toSeconds(t),
                this.envelope.triggerRelease(t),
                this.noise.stop(t + this.toSeconds(this.envelope.release)),
                this
            }
            sync() {
                return this._syncState() && (this._syncMethod("triggerAttack", 0),
                this._syncMethod("triggerRelease", 0)),
                this
            }
            triggerAttackRelease(t, e, s=1) {
                return e = this.toSeconds(e),
                t = this.toSeconds(t),
                this.triggerAttack(e, s),
                this.triggerRelease(e + t),
                this
            }
            dispose() {
                return super.dispose(),
                this.noise.dispose(),
                this.envelope.dispose(),
                this
            }
        }
        const Jr = new Set;
        function Kr(t) {
            Jr.add(t)
        }
        function ta(t, e) {
            const s = `registerProcessor("${t}", ${e})`;
            Jr.add(s)
        }
        class ea extends wo {
            constructor(t) {
                super(t),
                this.name = "ToneAudioWorklet",
                this.workletOptions = {},
                this.onprocessorerror = Zi;
                const e = URL.createObjectURL(new Blob([Array.from(Jr).join("\n")],{
                    type: "text/javascript"
                }))
                  , s = this._audioWorkletName();
                this._dummyGain = this.context.createGain(),
                this._dummyParam = this._dummyGain.gain,
                this.context.addAudioWorkletModule(e, s).then(()=>{
                    this.disposed || (this._worklet = this.context.createAudioWorkletNode(s, this.workletOptions),
                    this._worklet.onprocessorerror = this.onprocessorerror.bind(this),
                    this.onReady(this._worklet))
                }
                )
            }
            dispose() {
                return super.dispose(),
                this._dummyGain.disconnect(),
                this._worklet && (this._worklet.port.postMessage("dispose"),
                this._worklet.disconnect()),
                this
            }
        }
        Kr('\n\t/**\n\t * The base AudioWorkletProcessor for use in Tone.js. Works with the [[ToneAudioWorklet]]. \n\t */\n\tclass ToneAudioWorkletProcessor extends AudioWorkletProcessor {\n\n\t\tconstructor(options) {\n\t\t\t\n\t\t\tsuper(options);\n\t\t\t/**\n\t\t\t * If the processor was disposed or not. Keep alive until it\'s disposed.\n\t\t\t */\n\t\t\tthis.disposed = false;\n\t\t   \t/** \n\t\t\t * The number of samples in the processing block\n\t\t\t */\n\t\t\tthis.blockSize = 128;\n\t\t\t/**\n\t\t\t * the sample rate\n\t\t\t */\n\t\t\tthis.sampleRate = sampleRate;\n\n\t\t\tthis.port.onmessage = (event) => {\n\t\t\t\t// when it receives a dispose \n\t\t\t\tif (event.data === "dispose") {\n\t\t\t\t\tthis.disposed = true;\n\t\t\t\t}\n\t\t\t};\n\t\t}\n\t}\n');
        Kr("\n\t/**\n\t * Abstract class for a single input/output processor. \n\t * has a 'generate' function which processes one sample at a time\n\t */\n\tclass SingleIOProcessor extends ToneAudioWorkletProcessor {\n\n\t\tconstructor(options) {\n\t\t\tsuper(Object.assign(options, {\n\t\t\t\tnumberOfInputs: 1,\n\t\t\t\tnumberOfOutputs: 1\n\t\t\t}));\n\t\t\t/**\n\t\t\t * Holds the name of the parameter and a single value of that\n\t\t\t * parameter at the current sample\n\t\t\t * @type { [name: string]: number }\n\t\t\t */\n\t\t\tthis.params = {}\n\t\t}\n\n\t\t/**\n\t\t * Generate an output sample from the input sample and parameters\n\t\t * @abstract\n\t\t * @param input number\n\t\t * @param channel number\n\t\t * @param parameters { [name: string]: number }\n\t\t * @returns number\n\t\t */\n\t\tgenerate(){}\n\n\t\t/**\n\t\t * Update the private params object with the \n\t\t * values of the parameters at the given index\n\t\t * @param parameters { [name: string]: Float32Array },\n\t\t * @param index number\n\t\t */\n\t\tupdateParams(parameters, index) {\n\t\t\tfor (const paramName in parameters) {\n\t\t\t\tconst param = parameters[paramName];\n\t\t\t\tif (param.length > 1) {\n\t\t\t\t\tthis.params[paramName] = parameters[paramName][index];\n\t\t\t\t} else {\n\t\t\t\t\tthis.params[paramName] = parameters[paramName][0];\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Process a single frame of the audio\n\t\t * @param inputs Float32Array[][]\n\t\t * @param outputs Float32Array[][]\n\t\t */\n\t\tprocess(inputs, outputs, parameters) {\n\t\t\tconst input = inputs[0];\n\t\t\tconst output = outputs[0];\n\t\t\t// get the parameter values\n\t\t\tconst channelCount = Math.max(input && input.length || 0, output.length);\n\t\t\tfor (let sample = 0; sample < this.blockSize; sample++) {\n\t\t\t\tthis.updateParams(parameters, sample);\n\t\t\t\tfor (let channel = 0; channel < channelCount; channel++) {\n\t\t\t\t\tconst inputSample = input && input.length ? input[channel][sample] : 0;\n\t\t\t\t\toutput[channel][sample] = this.generate(inputSample, channel, this.params);\n\t\t\t\t}\n\t\t\t}\n\t\t\treturn !this.disposed;\n\t\t}\n\t};\n");
        Kr("\n\t/**\n\t * A multichannel buffer for use within an AudioWorkletProcessor as a delay line\n\t */\n\tclass DelayLine {\n\t\t\n\t\tconstructor(size, channels) {\n\t\t\tthis.buffer = [];\n\t\t\tthis.writeHead = []\n\t\t\tthis.size = size;\n\n\t\t\t// create the empty channels\n\t\t\tfor (let i = 0; i < channels; i++) {\n\t\t\t\tthis.buffer[i] = new Float32Array(this.size);\n\t\t\t\tthis.writeHead[i] = 0;\n\t\t\t}\n\t\t}\n\n\t\t/**\n\t\t * Push a value onto the end\n\t\t * @param channel number\n\t\t * @param value number\n\t\t */\n\t\tpush(channel, value) {\n\t\t\tthis.writeHead[channel] += 1;\n\t\t\tif (this.writeHead[channel] > this.size) {\n\t\t\t\tthis.writeHead[channel] = 0;\n\t\t\t}\n\t\t\tthis.buffer[channel][this.writeHead[channel]] = value;\n\t\t}\n\n\t\t/**\n\t\t * Get the recorded value of the channel given the delay\n\t\t * @param channel number\n\t\t * @param delay number delay samples\n\t\t */\n\t\tget(channel, delay) {\n\t\t\tlet readHead = this.writeHead[channel] - Math.floor(delay);\n\t\t\tif (readHead < 0) {\n\t\t\t\treadHead += this.size;\n\t\t\t}\n\t\t\treturn this.buffer[channel][readHead];\n\t\t}\n\t}\n");
        ta("feedback-comb-filter", '\n\tclass FeedbackCombFilterWorklet extends SingleIOProcessor {\n\n\t\tconstructor(options) {\n\t\t\tsuper(options);\n\t\t\tthis.delayLine = new DelayLine(this.sampleRate, options.channelCount || 2);\n\t\t}\n\n\t\tstatic get parameterDescriptors() {\n\t\t\treturn [{\n\t\t\t\tname: "delayTime",\n\t\t\t\tdefaultValue: 0.1,\n\t\t\t\tminValue: 0,\n\t\t\t\tmaxValue: 1,\n\t\t\t\tautomationRate: "k-rate"\n\t\t\t}, {\n\t\t\t\tname: "feedback",\n\t\t\t\tdefaultValue: 0.5,\n\t\t\t\tminValue: 0,\n\t\t\t\tmaxValue: 0.9999,\n\t\t\t\tautomationRate: "k-rate"\n\t\t\t}];\n\t\t}\n\n\t\tgenerate(input, channel, parameters) {\n\t\t\tconst delayedSample = this.delayLine.get(channel, parameters.delayTime * this.sampleRate);\n\t\t\tthis.delayLine.push(channel, input + delayedSample * parameters.feedback);\n\t\t\treturn delayedSample;\n\t\t}\n\t}\n');
        class sa extends ea {
            constructor() {
                super(Di(sa.getDefaults(), arguments, ["delayTime", "resonance"])),
                this.name = "FeedbackCombFilter";
                const t = Di(sa.getDefaults(), arguments, ["delayTime", "resonance"]);
                this.input = new ko({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this.delayTime = new xo({
                    context: this.context,
                    value: t.delayTime,
                    units: "time",
                    minValue: 0,
                    maxValue: 1,
                    param: this._dummyParam,
                    swappable: !0
                }),
                this.resonance = new xo({
                    context: this.context,
                    value: t.resonance,
                    units: "normalRange",
                    param: this._dummyParam,
                    swappable: !0
                }),
                Ui(this, ["resonance", "delayTime"])
            }
            _audioWorkletName() {
                return "feedback-comb-filter"
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    delayTime: .1,
                    resonance: .5
                })
            }
            onReady(t) {
                bo(this.input, t, this.output);
                const e = t.parameters.get("delayTime");
                this.delayTime.setParam(e);
                const s = t.parameters.get("feedback");
                this.resonance.setParam(s)
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this.output.dispose(),
                this.delayTime.dispose(),
                this.resonance.dispose(),
                this
            }
        }
        class na extends wo {
            constructor() {
                super(Di(na.getDefaults(), arguments, ["frequency", "type"])),
                this.name = "OnePoleFilter";
                const t = Di(na.getDefaults(), arguments, ["frequency", "type"]);
                this._frequency = t.frequency,
                this._type = t.type,
                this.input = new ko({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this._createFilter()
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    frequency: 880,
                    type: "lowpass"
                })
            }
            _createFilter() {
                const t = this._filter
                  , e = this.toFrequency(this._frequency)
                  , s = 1 / (2 * Math.PI * e);
                if ("lowpass" === this._type) {
                    const t = 1 / (s * this.context.sampleRate)
                      , e = t - 1;
                    this._filter = this.context.createIIRFilter([t, 0], [1, e])
                } else {
                    const t = 1 / (s * this.context.sampleRate) - 1;
                    this._filter = this.context.createIIRFilter([1, -1], [1, t])
                }
                this.input.chain(this._filter, this.output),
                t && this.context.setTimeout(()=>{
                    this.disposed || (this.input.disconnect(t),
                    t.disconnect())
                }
                , this.blockTime)
            }
            get frequency() {
                return this._frequency
            }
            set frequency(t) {
                this._frequency = t,
                this._createFilter()
            }
            get type() {
                return this._type
            }
            set type(t) {
                this._type = t,
                this._createFilter()
            }
            getFrequencyResponse(t=128) {
                const e = new Float32Array(t);
                for (let s = 0; s < t; s++) {
                    const n = 19980 * Math.pow(s / t, 2) + 20;
                    e[s] = n
                }
                const s = new Float32Array(t)
                  , n = new Float32Array(t);
                return this._filter.getFrequencyResponse(e, s, n),
                s
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this.output.dispose(),
                this._filter.disconnect(),
                this
            }
        }
        class ia extends wo {
            constructor() {
                super(Di(ia.getDefaults(), arguments, ["delayTime", "resonance", "dampening"])),
                this.name = "LowpassCombFilter";
                const t = Di(ia.getDefaults(), arguments, ["delayTime", "resonance", "dampening"]);
                this._combFilter = this.output = new sa({
                    context: this.context,
                    delayTime: t.delayTime,
                    resonance: t.resonance
                }),
                this.delayTime = this._combFilter.delayTime,
                this.resonance = this._combFilter.resonance,
                this._lowpass = this.input = new na({
                    context: this.context,
                    frequency: t.dampening,
                    type: "lowpass"
                }),
                this._lowpass.connect(this._combFilter)
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    dampening: 3e3,
                    delayTime: .1,
                    resonance: .5
                })
            }
            get dampening() {
                return this._lowpass.frequency
            }
            set dampening(t) {
                this._lowpass.frequency = t
            }
            dispose() {
                return super.dispose(),
                this._combFilter.dispose(),
                this._lowpass.dispose(),
                this
            }
        }
        class oa extends Vr {
            constructor() {
                super(Di(oa.getDefaults(), arguments)),
                this.name = "PluckSynth";
                const t = Di(oa.getDefaults(), arguments);
                this._noise = new Jo({
                    context: this.context,
                    type: "pink"
                }),
                this.attackNoise = t.attackNoise,
                this._lfcf = new ia({
                    context: this.context,
                    dampening: t.dampening,
                    resonance: t.resonance
                }),
                this.resonance = t.resonance,
                this.release = t.release,
                this._noise.connect(this._lfcf),
                this._lfcf.connect(this.output)
            }
            static getDefaults() {
                return Ai(Vr.getDefaults(), {
                    attackNoise: 1,
                    dampening: 4e3,
                    resonance: .7,
                    release: 1
                })
            }
            get dampening() {
                return this._lfcf.dampening
            }
            set dampening(t) {
                this._lfcf.dampening = t
            }
            triggerAttack(t, e) {
                const s = this.toFrequency(t);
                e = this.toSeconds(e);
                const n = 1 / s;
                return this._lfcf.delayTime.setValueAtTime(n, e),
                this._noise.start(e),
                this._noise.stop(e + n * this.attackNoise),
                this._lfcf.resonance.cancelScheduledValues(e),
                this._lfcf.resonance.setValueAtTime(this.resonance, e),
                this
            }
            triggerRelease(t) {
                return this._lfcf.resonance.linearRampTo(0, this.release, t),
                this
            }
            dispose() {
                return super.dispose(),
                this._noise.dispose(),
                this._lfcf.dispose(),
                this
            }
        }
        class ra extends Vr {
            constructor() {
                super(Di(ra.getDefaults(), arguments, ["voice", "options"])),
                this.name = "PolySynth",
                this._availableVoices = [],
                this._activeVoices = [],
                this._voices = [],
                this._gcTimeout = -1,
                this._averageActiveVoices = 0;
                const t = Di(ra.getDefaults(), arguments, ["voice", "options"]);
                ti(!ui(t.voice), "DEPRECATED: The polyphony count is no longer the first argument.");
                const e = t.voice.getDefaults();
                this.options = Object.assign(e, t.options),
                this.voice = t.voice,
                this.maxPolyphony = t.maxPolyphony,
                this._dummyVoice = this._getNextAvailableVoice();
                const s = this._voices.indexOf(this._dummyVoice);
                this._voices.splice(s, 1),
                this._gcTimeout = this.context.setInterval(this._collectGarbage.bind(this), 1)
            }
            static getDefaults() {
                return Object.assign(Vr.getDefaults(), {
                    maxPolyphony: 32,
                    options: {},
                    voice: jr
                })
            }
            get activeVoices() {
                return this._activeVoices.length
            }
            _makeVoiceAvailable(t) {
                this._availableVoices.push(t);
                const e = this._activeVoices.findIndex(e=>e.voice === t);
                this._activeVoices.splice(e, 1)
            }
            _getNextAvailableVoice() {
                if (this._availableVoices.length)
                    return this._availableVoices.shift();
                if (this._voices.length < this.maxPolyphony) {
                    const t = new this.voice(Object.assign(this.options, {
                        context: this.context,
                        onsilence: this._makeVoiceAvailable.bind(this)
                    }));
                    return t.connect(this.output),
                    this._voices.push(t),
                    t
                }
                ri("Max polyphony exceeded. Note dropped.")
            }
            _collectGarbage() {
                if (this._averageActiveVoices = Math.max(.95 * this._averageActiveVoices, this.activeVoices),
                this._availableVoices.length && this._voices.length > Math.ceil(this._averageActiveVoices + 1)) {
                    const t = this._availableVoices.shift()
                      , e = this._voices.indexOf(t);
                    this._voices.splice(e, 1),
                    this.context.isOffline || t.dispose()
                }
            }
            _triggerAttack(t, e, s) {
                t.forEach(t=>{
                    const n = new No(this.context,t).toMidi()
                      , i = this._getNextAvailableVoice();
                    i && (i.triggerAttack(t, e, s),
                    this._activeVoices.push({
                        midi: n,
                        voice: i,
                        released: !1
                    }),
                    this.log("triggerAttack", t, e))
                }
                )
            }
            _triggerRelease(t, e) {
                t.forEach(t=>{
                    const s = new No(this.context,t).toMidi()
                      , n = this._activeVoices.find(({midi: t, released: e})=>t === s && !e);
                    n && (n.voice.triggerRelease(e),
                    n.released = !0,
                    this.log("triggerRelease", t, e))
                }
                )
            }
            _scheduleEvent(t, e, s, n) {
                ti(!this.disposed, "Synth was already disposed"),
                s <= this.now() ? "attack" === t ? this._triggerAttack(e, s, n) : this._triggerRelease(e, s) : this.context.setTimeout(()=>{
                    this._scheduleEvent(t, e, s, n)
                }
                , s - this.now())
            }
            triggerAttack(t, e, s) {
                Array.isArray(t) || (t = [t]);
                const n = this.toSeconds(e);
                return this._scheduleEvent("attack", t, n, s),
                this
            }
            triggerRelease(t, e) {
                Array.isArray(t) || (t = [t]);
                const s = this.toSeconds(e);
                return this._scheduleEvent("release", t, s),
                this
            }
            triggerAttackRelease(t, e, s, n) {
                const i = this.toSeconds(s);
                if (this.triggerAttack(t, i, n),
                di(e)) {
                    ti(di(t), "If the duration is an array, the notes must also be an array"),
                    t = t;
                    for (let s = 0; s < t.length; s++) {
                        const n = e[Math.min(s, e.length - 1)]
                          , o = this.toSeconds(n);
                        ti(o > 0, "The duration must be greater than 0"),
                        this.triggerRelease(t[s], i + o)
                    }
                } else {
                    const s = this.toSeconds(e);
                    ti(s > 0, "The duration must be greater than 0"),
                    this.triggerRelease(t, i + s)
                }
                return this
            }
            sync() {
                return this._syncState() && (this._syncMethod("triggerAttack", 1),
                this._syncMethod("triggerRelease", 1)),
                this
            }
            set(t) {
                const e = Mi(t, ["onsilence", "context"]);
                return this.options = Ai(this.options, e),
                this._voices.forEach(t=>t.set(e)),
                this._dummyVoice.set(e),
                this
            }
            get() {
                return this._dummyVoice.get()
            }
            releaseAll(t) {
                const e = this.toSeconds(t);
                return this._activeVoices.forEach(({voice: t})=>{
                    t.triggerRelease(e)
                }
                ),
                this
            }
            dispose() {
                return super.dispose(),
                this._dummyVoice.dispose(),
                this._voices.forEach(t=>t.dispose()),
                this._activeVoices = [],
                this._availableVoices = [],
                this.context.clearInterval(this._gcTimeout),
                this
            }
        }
        class aa extends Vr {
            constructor() {
                super(Di(aa.getDefaults(), arguments, ["urls", "onload", "baseUrl"], "urls")),
                this.name = "Sampler",
                this._activeSources = new Map;
                const t = Di(aa.getDefaults(), arguments, ["urls", "onload", "baseUrl"], "urls")
                  , e = {};
                Object.keys(t.urls).forEach(s=>{
                    const n = parseInt(s, 10);
                    if (ti(_i(s) || ui(n) && isFinite(n), "url key is neither a note or midi pitch: " + s),
                    _i(s)) {
                        const n = new lo(this.context,s).toMidi();
                        e[n] = t.urls[s]
                    } else
                        ui(n) && isFinite(n) && (e[n] = t.urls[n])
                }
                ),
                this._buffers = new Vo({
                    urls: e,
                    onload: t.onload,
                    baseUrl: t.baseUrl,
                    onerror: t.onerror
                }),
                this.attack = t.attack,
                this.release = t.release,
                this.curve = t.curve,
                this._buffers.loaded && Promise.resolve().then(t.onload)
            }
            static getDefaults() {
                return Object.assign(Vr.getDefaults(), {
                    attack: 0,
                    baseUrl: "",
                    curve: "exponential",
                    onload: Zi,
                    onerror: Zi,
                    release: .1,
                    urls: {}
                })
            }
            _findClosest(t) {
                let e = 0;
                for (; e < 96; ) {
                    if (this._buffers.has(t + e))
                        return -e;
                    if (this._buffers.has(t - e))
                        return e;
                    e++
                }
                throw new Error("No available buffers for note: " + t)
            }
            triggerAttack(t, e, s=1) {
                return this.log("triggerAttack", t, e, s),
                Array.isArray(t) || (t = [t]),
                t.forEach(t=>{
                    const n = ro(new lo(this.context,t).toFrequency())
                      , i = Math.round(n)
                      , o = n - i
                      , r = this._findClosest(i)
                      , a = i - r
                      , c = this._buffers.get(a)
                      , h = no(r + o)
                      , u = new $o({
                        url: c,
                        context: this.context,
                        curve: this.curve,
                        fadeIn: this.attack,
                        fadeOut: this.release,
                        playbackRate: h
                    }).connect(this.output);
                    u.start(e, 0, c.duration / h, s),
                    di(this._activeSources.get(i)) || this._activeSources.set(i, []),
                    this._activeSources.get(i).push(u),
                    u.onended = ()=>{
                        if (this._activeSources && this._activeSources.has(i)) {
                            const t = this._activeSources.get(i)
                              , e = t.indexOf(u);
                            -1 !== e && t.splice(e, 1)
                        }
                    }
                }
                ),
                this
            }
            triggerRelease(t, e) {
                return this.log("triggerRelease", t, e),
                Array.isArray(t) || (t = [t]),
                t.forEach(t=>{
                    const s = new lo(this.context,t).toMidi();
                    if (this._activeSources.has(s) && this._activeSources.get(s).length) {
                        const t = this._activeSources.get(s);
                        e = this.toSeconds(e),
                        t.forEach(t=>{
                            t.stop(e)
                        }
                        ),
                        this._activeSources.set(s, [])
                    }
                }
                ),
                this
            }
            releaseAll(t) {
                const e = this.toSeconds(t);
                return this._activeSources.forEach(t=>{
                    for (; t.length; ) {
                        t.shift().stop(e)
                    }
                }
                ),
                this
            }
            sync() {
                return this._syncState() && (this._syncMethod("triggerAttack", 1),
                this._syncMethod("triggerRelease", 1)),
                this
            }
            triggerAttackRelease(t, e, s, n=1) {
                const i = this.toSeconds(s);
                return this.triggerAttack(t, i, n),
                di(e) ? (ti(di(t), "notes must be an array when duration is array"),
                t.forEach((t,s)=>{
                    const n = e[Math.min(s, e.length - 1)];
                    this.triggerRelease(t, i + this.toSeconds(n))
                }
                )) : this.triggerRelease(t, i + this.toSeconds(e)),
                this
            }
            add(t, e, s) {
                if (ti(_i(t) || isFinite(t), "note must be a pitch or midi: " + t),
                _i(t)) {
                    const n = new lo(this.context,t).toMidi();
                    this._buffers.add(n, e, s)
                } else
                    this._buffers.add(t, e, s);
                return this
            }
            get loaded() {
                return this._buffers.loaded
            }
            dispose() {
                return super.dispose(),
                this._buffers.dispose(),
                this._activeSources.forEach(t=>{
                    t.forEach(t=>t.dispose())
                }
                ),
                this._activeSources.clear(),
                this
            }
        }
        vi([wr(0)], aa.prototype, "attack", void 0),
        vi([wr(0)], aa.prototype, "release", void 0);
        class ca extends vo {
            constructor() {
                super(Di(ca.getDefaults(), arguments, ["callback", "value"])),
                this.name = "ToneEvent",
                this._state = new yo("stopped"),
                this._startOffset = 0;
                const t = Di(ca.getDefaults(), arguments, ["callback", "value"]);
                this._loop = t.loop,
                this.callback = t.callback,
                this.value = t.value,
                this._loopStart = this.toTicks(t.loopStart),
                this._loopEnd = this.toTicks(t.loopEnd),
                this._playbackRate = t.playbackRate,
                this._probability = t.probability,
                this._humanize = t.humanize,
                this.mute = t.mute,
                this._playbackRate = t.playbackRate,
                this._state.increasing = !0,
                this._rescheduleEvents()
            }
            static getDefaults() {
                return Object.assign(vo.getDefaults(), {
                    callback: Zi,
                    humanize: !1,
                    loop: !1,
                    loopEnd: "1m",
                    loopStart: 0,
                    mute: !1,
                    playbackRate: 1,
                    probability: 1,
                    value: null
                })
            }
            _rescheduleEvents(t=-1) {
                this._state.forEachFrom(t, t=>{
                    let e;
                    if ("started" === t.state) {
                        -1 !== t.id && this.context.transport.clear(t.id);
                        const s = t.time + Math.round(this.startOffset / this._playbackRate);
                        if (!0 === this._loop || ui(this._loop) && this._loop > 1) {
                            e = 1 / 0,
                            ui(this._loop) && (e = this._loop * this._getLoopDuration());
                            const n = this._state.getAfter(s);
                            null !== n && (e = Math.min(e, n.time - s)),
                            e !== 1 / 0 && (this._state.setStateAtTime("stopped", s + e + 1, {
                                id: -1
                            }),
                            e = new jo(this.context,e));
                            const i = new jo(this.context,this._getLoopDuration());
                            t.id = this.context.transport.scheduleRepeat(this._tick.bind(this), i, new jo(this.context,s), e)
                        } else
                            t.id = this.context.transport.schedule(this._tick.bind(this), new jo(this.context,s))
                    }
                }
                )
            }
            get state() {
                return this._state.getValueAtTime(this.context.transport.ticks)
            }
            get startOffset() {
                return this._startOffset
            }
            set startOffset(t) {
                this._startOffset = t
            }
            get probability() {
                return this._probability
            }
            set probability(t) {
                this._probability = t
            }
            get humanize() {
                return this._humanize
            }
            set humanize(t) {
                this._humanize = t
            }
            start(t) {
                const e = this.toTicks(t);
                return "stopped" === this._state.getValueAtTime(e) && (this._state.add({
                    id: -1,
                    state: "started",
                    time: e
                }),
                this._rescheduleEvents(e)),
                this
            }
            stop(t) {
                this.cancel(t);
                const e = this.toTicks(t);
                if ("started" === this._state.getValueAtTime(e)) {
                    this._state.setStateAtTime("stopped", e, {
                        id: -1
                    });
                    const t = this._state.getBefore(e);
                    let s = e;
                    null !== t && (s = t.time),
                    this._rescheduleEvents(s)
                }
                return this
            }
            cancel(t) {
                t = Oi(t, -1 / 0);
                const e = this.toTicks(t);
                return this._state.forEachFrom(e, t=>{
                    this.context.transport.clear(t.id)
                }
                ),
                this._state.cancel(e),
                this
            }
            _tick(t) {
                const e = this.context.transport.getTicksAtTime(t);
                if (!this.mute && "started" === this._state.getValueAtTime(e)) {
                    if (this.probability < 1 && Math.random() > this.probability)
                        return;
                    if (this.humanize) {
                        let e = .02;
                        pi(this.humanize) || (e = this.toSeconds(this.humanize)),
                        t += (2 * Math.random() - 1) * e
                    }
                    this.callback(t, this.value)
                }
            }
            _getLoopDuration() {
                return Math.round((this._loopEnd - this._loopStart) / this._playbackRate)
            }
            get loop() {
                return this._loop
            }
            set loop(t) {
                this._loop = t,
                this._rescheduleEvents()
            }
            get playbackRate() {
                return this._playbackRate
            }
            set playbackRate(t) {
                this._playbackRate = t,
                this._rescheduleEvents()
            }
            get loopEnd() {
                return new jo(this.context,this._loopEnd).toSeconds()
            }
            set loopEnd(t) {
                this._loopEnd = this.toTicks(t),
                this._loop && this._rescheduleEvents()
            }
            get loopStart() {
                return new jo(this.context,this._loopStart).toSeconds()
            }
            set loopStart(t) {
                this._loopStart = this.toTicks(t),
                this._loop && this._rescheduleEvents()
            }
            get progress() {
                if (this._loop) {
                    const t = this.context.transport.ticks
                      , e = this._state.get(t);
                    if (null !== e && "started" === e.state) {
                        const s = this._getLoopDuration();
                        return (t - e.time) % s / s
                    }
                    return 0
                }
                return 0
            }
            dispose() {
                return super.dispose(),
                this.cancel(),
                this._state.dispose(),
                this
            }
        }
        class ha extends vo {
            constructor() {
                super(Di(ha.getDefaults(), arguments, ["callback", "interval"])),
                this.name = "Loop";
                const t = Di(ha.getDefaults(), arguments, ["callback", "interval"]);
                this._event = new ca({
                    context: this.context,
                    callback: this._tick.bind(this),
                    loop: !0,
                    loopEnd: t.interval,
                    playbackRate: t.playbackRate,
                    probability: t.probability
                }),
                this.callback = t.callback,
                this.iterations = t.iterations
            }
            static getDefaults() {
                return Object.assign(vo.getDefaults(), {
                    interval: "4n",
                    callback: Zi,
                    playbackRate: 1,
                    iterations: 1 / 0,
                    probability: 1,
                    mute: !1,
                    humanize: !1
                })
            }
            start(t) {
                return this._event.start(t),
                this
            }
            stop(t) {
                return this._event.stop(t),
                this
            }
            cancel(t) {
                return this._event.cancel(t),
                this
            }
            _tick(t) {
                this.callback(t)
            }
            get state() {
                return this._event.state
            }
            get progress() {
                return this._event.progress
            }
            get interval() {
                return this._event.loopEnd
            }
            set interval(t) {
                this._event.loopEnd = t
            }
            get playbackRate() {
                return this._event.playbackRate
            }
            set playbackRate(t) {
                this._event.playbackRate = t
            }
            get humanize() {
                return this._event.humanize
            }
            set humanize(t) {
                this._event.humanize = t
            }
            get probability() {
                return this._event.probability
            }
            set probability(t) {
                this._event.probability = t
            }
            get mute() {
                return this._event.mute
            }
            set mute(t) {
                this._event.mute = t
            }
            get iterations() {
                return !0 === this._event.loop ? 1 / 0 : this._event.loop
            }
            set iterations(t) {
                this._event.loop = t === 1 / 0 || t
            }
            dispose() {
                return super.dispose(),
                this._event.dispose(),
                this
            }
        }
        class ua extends ca {
            constructor() {
                super(Di(ua.getDefaults(), arguments, ["callback", "events"])),
                this.name = "Part",
                this._state = new yo("stopped"),
                this._events = new Set;
                const t = Di(ua.getDefaults(), arguments, ["callback", "events"]);
                this._state.increasing = !0,
                t.events.forEach(t=>{
                    di(t) ? this.add(t[0], t[1]) : this.add(t)
                }
                )
            }
            static getDefaults() {
                return Object.assign(ca.getDefaults(), {
                    events: []
                })
            }
            start(t, e) {
                const s = this.toTicks(t);
                if ("started" !== this._state.getValueAtTime(s)) {
                    e = Oi(e, this._loop ? this._loopStart : 0),
                    e = this._loop ? Oi(e, this._loopStart) : Oi(e, 0);
                    const t = this.toTicks(e);
                    this._state.add({
                        id: -1,
                        offset: t,
                        state: "started",
                        time: s
                    }),
                    this._forEach(e=>{
                        this._startNote(e, s, t)
                    }
                    )
                }
                return this
            }
            _startNote(t, e, s) {
                e -= s,
                this._loop ? t.startOffset >= this._loopStart && t.startOffset < this._loopEnd ? (t.startOffset < s && (e += this._getLoopDuration()),
                t.start(new jo(this.context,e))) : t.startOffset < this._loopStart && t.startOffset >= s && (t.loop = !1,
                t.start(new jo(this.context,e))) : t.startOffset >= s && t.start(new jo(this.context,e))
            }
            get startOffset() {
                return this._startOffset
            }
            set startOffset(t) {
                this._startOffset = t,
                this._forEach(t=>{
                    t.startOffset += this._startOffset
                }
                )
            }
            stop(t) {
                const e = this.toTicks(t);
                return this._state.cancel(e),
                this._state.setStateAtTime("stopped", e),
                this._forEach(e=>{
                    e.stop(t)
                }
                ),
                this
            }
            at(t, e) {
                const s = new mo(this.context,t).toTicks()
                  , n = new jo(this.context,1).toSeconds()
                  , i = this._events.values();
                let o = i.next();
                for (; !o.done; ) {
                    const t = o.value;
                    if (Math.abs(s - t.startOffset) < n)
                        return ci(e) && (t.value = e),
                        t;
                    o = i.next()
                }
                return ci(e) ? (this.add(t, e),
                this.at(t)) : null
            }
            add(t, e) {
                t instanceof Object && Reflect.has(t, "time") && (t = (e = t).time);
                const s = this.toTicks(t);
                let n;
                return e instanceof ca ? (n = e,
                n.callback = this._tick.bind(this)) : n = new ca({
                    callback: this._tick.bind(this),
                    context: this.context,
                    value: e
                }),
                n.startOffset = s,
                n.set({
                    humanize: this.humanize,
                    loop: this.loop,
                    loopEnd: this.loopEnd,
                    loopStart: this.loopStart,
                    playbackRate: this.playbackRate,
                    probability: this.probability
                }),
                this._events.add(n),
                this._restartEvent(n),
                this
            }
            _restartEvent(t) {
                this._state.forEach(e=>{
                    "started" === e.state ? this._startNote(t, e.time, e.offset) : t.stop(new jo(this.context,e.time))
                }
                )
            }
            remove(t, e) {
                return li(t) && t.hasOwnProperty("time") && (t = (e = t).time),
                t = this.toTicks(t),
                this._events.forEach(s=>{
                    s.startOffset === t && (ai(e) || ci(e) && s.value === e) && (this._events.delete(s),
                    s.dispose())
                }
                ),
                this
            }
            clear() {
                return this._forEach(t=>t.dispose()),
                this._events.clear(),
                this
            }
            cancel(t) {
                return this._forEach(e=>e.cancel(t)),
                this._state.cancel(this.toTicks(t)),
                this
            }
            _forEach(t) {
                return this._events && this._events.forEach(e=>{
                    e instanceof ua ? e._forEach(t) : t(e)
                }
                ),
                this
            }
            _setAll(t, e) {
                this._forEach(s=>{
                    s[t] = e
                }
                )
            }
            _tick(t, e) {
                this.mute || this.callback(t, e)
            }
            _testLoopBoundries(t) {
                this._loop && (t.startOffset < this._loopStart || t.startOffset >= this._loopEnd) ? t.cancel(0) : "stopped" === t.state && this._restartEvent(t)
            }
            get probability() {
                return this._probability
            }
            set probability(t) {
                this._probability = t,
                this._setAll("probability", t)
            }
            get humanize() {
                return this._humanize
            }
            set humanize(t) {
                this._humanize = t,
                this._setAll("humanize", t)
            }
            get loop() {
                return this._loop
            }
            set loop(t) {
                this._loop = t,
                this._forEach(e=>{
                    e.loopStart = this.loopStart,
                    e.loopEnd = this.loopEnd,
                    e.loop = t,
                    this._testLoopBoundries(e)
                }
                )
            }
            get loopEnd() {
                return new jo(this.context,this._loopEnd).toSeconds()
            }
            set loopEnd(t) {
                this._loopEnd = this.toTicks(t),
                this._loop && this._forEach(e=>{
                    e.loopEnd = t,
                    this._testLoopBoundries(e)
                }
                )
            }
            get loopStart() {
                return new jo(this.context,this._loopStart).toSeconds()
            }
            set loopStart(t) {
                this._loopStart = this.toTicks(t),
                this._loop && this._forEach(t=>{
                    t.loopStart = this.loopStart,
                    this._testLoopBoundries(t)
                }
                )
            }
            get playbackRate() {
                return this._playbackRate
            }
            set playbackRate(t) {
                this._playbackRate = t,
                this._setAll("playbackRate", t)
            }
            get length() {
                return this._events.size
            }
            dispose() {
                return super.dispose(),
                this.clear(),
                this
            }
        }
        function *la(t) {
            let e = 0;
            for (; e < t.length; )
                e = fa(e, t),
                yield t[e],
                e++
        }
        function *pa(t) {
            let e = t.length - 1;
            for (; e >= 0; )
                e = fa(e, t),
                yield t[e],
                e--
        }
        function *da(t, e) {
            for (; ; )
                yield*e(t)
        }
        function fa(t, e) {
            return Vi(t, 0, e.length - 1)
        }
        function *_a(t, e) {
            let s = e ? 0 : t.length - 1;
            for (; ; )
                s = fa(s, t),
                yield t[s],
                e ? (s++,
                s >= t.length - 1 && (e = !1)) : (s--,
                s <= 0 && (e = !0))
        }
        function *ma(t) {
            let e = 0
              , s = 0;
            for (; e < t.length; )
                e = fa(e, t),
                yield t[e],
                s++,
                e += s % 2 ? 2 : -1
        }
        function *ga(t) {
            let e = t.length - 1
              , s = 0;
            for (; e >= 0; )
                e = fa(e, t),
                yield t[e],
                s++,
                e += s % 2 ? -2 : 1
        }
        function *va(t) {
            const e = [];
            for (let s = 0; s < t.length; s++)
                e.push(s);
            for (; e.length > 0; ) {
                const s = fa(e.splice(Math.floor(e.length * Math.random()), 1)[0], t);
                yield t[s]
            }
        }
        function *ya(t, e="up", s=0) {
            switch (ti(t.length > 0, "The array must have more than one value in it"),
            e) {
            case "up":
                yield*da(t, la);
            case "down":
                yield*da(t, pa);
            case "upDown":
                yield*_a(t, !0);
            case "downUp":
                yield*_a(t, !1);
            case "alternateUp":
                yield*da(t, ma);
            case "alternateDown":
                yield*da(t, ga);
            case "random":
                yield*function*(t) {
                    for (; ; ) {
                        const e = Math.floor(Math.random() * t.length);
                        yield t[e]
                    }
                }(t);
            case "randomOnce":
                yield*da(t, va);
            case "randomWalk":
                yield*function*(t) {
                    let e = Math.floor(Math.random() * t.length);
                    for (; ; )
                        0 === e ? e++ : e === t.length - 1 || Math.random() < .5 ? e-- : e++,
                        yield t[e]
                }(t)
            }
        }
        class xa extends ha {
            constructor() {
                super(Di(xa.getDefaults(), arguments, ["callback", "values", "pattern"])),
                this.name = "Pattern";
                const t = Di(xa.getDefaults(), arguments, ["callback", "values", "pattern"]);
                this.callback = t.callback,
                this._values = t.values,
                this._pattern = ya(t.values, t.pattern),
                this._type = t.pattern
            }
            static getDefaults() {
                return Object.assign(ha.getDefaults(), {
                    pattern: "up",
                    values: [],
                    callback: Zi
                })
            }
            _tick(t) {
                const e = this._pattern.next();
                this._value = e.value,
                this.callback(t, this._value)
            }
            get values() {
                return this._values
            }
            set values(t) {
                this._values = t,
                this.pattern = this._type
            }
            get value() {
                return this._value
            }
            get pattern() {
                return this._type
            }
            set pattern(t) {
                this._type = t,
                this._pattern = ya(this._values, this._type)
            }
        }
        class wa extends ca {
            constructor() {
                super(Di(wa.getDefaults(), arguments, ["callback", "events", "subdivision"])),
                this.name = "Sequence",
                this._part = new ua({
                    callback: this._seqCallback.bind(this),
                    context: this.context
                }),
                this._events = [],
                this._eventsArray = [];
                const t = Di(wa.getDefaults(), arguments, ["callback", "events", "subdivision"]);
                this._subdivision = this.toTicks(t.subdivision),
                this.events = t.events,
                this.loop = t.loop,
                this.loopStart = t.loopStart,
                this.loopEnd = t.loopEnd,
                this.playbackRate = t.playbackRate,
                this.probability = t.probability,
                this.humanize = t.humanize,
                this.mute = t.mute,
                this.playbackRate = t.playbackRate
            }
            static getDefaults() {
                return Object.assign(Mi(ca.getDefaults(), ["value"]), {
                    events: [],
                    loop: !0,
                    loopEnd: 0,
                    loopStart: 0,
                    subdivision: "8n"
                })
            }
            _seqCallback(t, e) {
                null !== e && this.callback(t, e)
            }
            get events() {
                return this._events
            }
            set events(t) {
                this.clear(),
                this._eventsArray = t,
                this._events = this._createSequence(this._eventsArray),
                this._eventsUpdated()
            }
            start(t, e) {
                return this._part.start(t, e ? this._indexTime(e) : e),
                this
            }
            stop(t) {
                return this._part.stop(t),
                this
            }
            get subdivision() {
                return new jo(this.context,this._subdivision).toSeconds()
            }
            _createSequence(t) {
                return new Proxy(t,{
                    get: (t,e)=>t[e],
                    set: (t,e,s)=>(fi(e) && isFinite(parseInt(e, 10)) && di(s) ? t[e] = this._createSequence(s) : t[e] = s,
                    this._eventsUpdated(),
                    !0)
                })
            }
            _eventsUpdated() {
                this._part.clear(),
                this._rescheduleSequence(this._eventsArray, this._subdivision, this.startOffset),
                this.loopEnd = this.loopEnd
            }
            _rescheduleSequence(t, e, s) {
                t.forEach((t,n)=>{
                    const i = n * e + s;
                    if (di(t))
                        this._rescheduleSequence(t, e / t.length, i);
                    else {
                        const e = new jo(this.context,i,"i").toSeconds();
                        this._part.add(e, t)
                    }
                }
                )
            }
            _indexTime(t) {
                return new jo(this.context,t * this._subdivision + this.startOffset).toSeconds()
            }
            clear() {
                return this._part.clear(),
                this
            }
            dispose() {
                return super.dispose(),
                this._part.dispose(),
                this
            }
            get loop() {
                return this._part.loop
            }
            set loop(t) {
                this._part.loop = t
            }
            get loopStart() {
                return this._loopStart
            }
            set loopStart(t) {
                this._loopStart = t,
                this._part.loopStart = this._indexTime(t)
            }
            get loopEnd() {
                return this._loopEnd
            }
            set loopEnd(t) {
                this._loopEnd = t,
                this._part.loopEnd = 0 === t ? this._indexTime(this._eventsArray.length) : this._indexTime(t)
            }
            get startOffset() {
                return this._part.startOffset
            }
            set startOffset(t) {
                this._part.startOffset = t
            }
            get playbackRate() {
                return this._part.playbackRate
            }
            set playbackRate(t) {
                this._part.playbackRate = t
            }
            get probability() {
                return this._part.probability
            }
            set probability(t) {
                this._part.probability = t
            }
            get progress() {
                return this._part.progress
            }
            get humanize() {
                return this._part.humanize
            }
            set humanize(t) {
                this._part.humanize = t
            }
            get length() {
                return this._part.length
            }
        }
        class ba extends wo {
            constructor() {
                super(Object.assign(Di(ba.getDefaults(), arguments, ["fade"]))),
                this.name = "CrossFade",
                this._panner = this.context.createStereoPanner(),
                this._split = this.context.createChannelSplitter(2),
                this._g2a = new Cr({
                    context: this.context
                }),
                this.a = new ko({
                    context: this.context,
                    gain: 0
                }),
                this.b = new ko({
                    context: this.context,
                    gain: 0
                }),
                this.output = new ko({
                    context: this.context
                }),
                this._internalChannels = [this.a, this.b];
                const t = Di(ba.getDefaults(), arguments, ["fade"]);
                this.fade = new Do({
                    context: this.context,
                    units: "normalRange",
                    value: t.fade
                }),
                Ui(this, "fade"),
                this.context.getConstant(1).connect(this._panner),
                this._panner.connect(this._split),
                this._panner.channelCount = 1,
                this._panner.channelCountMode = "explicit",
                To(this._split, this.a.gain, 0),
                To(this._split, this.b.gain, 1),
                this.fade.chain(this._g2a, this._panner.pan),
                this.a.connect(this.output),
                this.b.connect(this.output)
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    fade: .5
                })
            }
            dispose() {
                return super.dispose(),
                this.a.dispose(),
                this.b.dispose(),
                this.output.dispose(),
                this.fade.dispose(),
                this._g2a.dispose(),
                this._panner.disconnect(),
                this._split.disconnect(),
                this
            }
        }
        class Ta extends wo {
            constructor(t) {
                super(t),
                this.name = "Effect",
                this._dryWet = new ba({
                    context: this.context
                }),
                this.wet = this._dryWet.fade,
                this.effectSend = new ko({
                    context: this.context
                }),
                this.effectReturn = new ko({
                    context: this.context
                }),
                this.input = new ko({
                    context: this.context
                }),
                this.output = this._dryWet,
                this.input.fan(this._dryWet.a, this.effectSend),
                this.effectReturn.connect(this._dryWet.b),
                this.wet.setValueAtTime(t.wet, 0),
                this._internalChannels = [this.effectReturn, this.effectSend],
                Ui(this, "wet")
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    wet: 1
                })
            }
            connectEffect(t) {
                return this._internalChannels.push(t),
                this.effectSend.chain(t, this.effectReturn),
                this
            }
            dispose() {
                return super.dispose(),
                this._dryWet.dispose(),
                this.effectSend.dispose(),
                this.effectReturn.dispose(),
                this.wet.dispose(),
                this
            }
        }
        class Sa extends Ta {
            constructor(t) {
                super(t),
                this.name = "LFOEffect",
                this._lfo = new yr({
                    context: this.context,
                    frequency: t.frequency,
                    amplitude: t.depth
                }),
                this.depth = this._lfo.amplitude,
                this.frequency = this._lfo.frequency,
                this.type = t.type,
                Ui(this, ["frequency", "depth"])
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    frequency: 1,
                    type: "sine",
                    depth: 1
                })
            }
            start(t) {
                return this._lfo.start(t),
                this
            }
            stop(t) {
                return this._lfo.stop(t),
                this
            }
            sync() {
                return this._lfo.sync(),
                this
            }
            unsync() {
                return this._lfo.unsync(),
                this
            }
            get type() {
                return this._lfo.type
            }
            set type(t) {
                this._lfo.type = t
            }
            dispose() {
                return super.dispose(),
                this._lfo.dispose(),
                this.frequency.dispose(),
                this.depth.dispose(),
                this
            }
        }
        class ka extends Sa {
            constructor() {
                super(Di(ka.getDefaults(), arguments, ["frequency", "baseFrequency", "octaves"])),
                this.name = "AutoFilter";
                const t = Di(ka.getDefaults(), arguments, ["frequency", "baseFrequency", "octaves"]);
                this.filter = new Wr(Object.assign(t.filter, {
                    context: this.context
                })),
                this.connectEffect(this.filter),
                this._lfo.connect(this.filter.frequency),
                this.octaves = t.octaves,
                this.baseFrequency = t.baseFrequency
            }
            static getDefaults() {
                return Object.assign(Sa.getDefaults(), {
                    baseFrequency: 200,
                    octaves: 2.6,
                    filter: {
                        type: "lowpass",
                        rolloff: -12,
                        Q: 1
                    }
                })
            }
            get baseFrequency() {
                return this._lfo.min
            }
            set baseFrequency(t) {
                this._lfo.min = this.toFrequency(t),
                this.octaves = this._octaves
            }
            get octaves() {
                return this._octaves
            }
            set octaves(t) {
                this._octaves = t,
                this._lfo.max = this._lfo.min * Math.pow(2, t)
            }
            dispose() {
                return super.dispose(),
                this.filter.dispose(),
                this
            }
        }
        class Ca extends wo {
            constructor() {
                super(Object.assign(Di(Ca.getDefaults(), arguments, ["pan"]))),
                this.name = "Panner",
                this._panner = this.context.createStereoPanner(),
                this.input = this._panner,
                this.output = this._panner;
                const t = Di(Ca.getDefaults(), arguments, ["pan"]);
                this.pan = new xo({
                    context: this.context,
                    param: this._panner.pan,
                    value: t.pan,
                    minValue: -1,
                    maxValue: 1
                }),
                this._panner.channelCount = t.channelCount,
                this._panner.channelCountMode = "explicit",
                Ui(this, "pan")
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    pan: 0,
                    channelCount: 1
                })
            }
            dispose() {
                return super.dispose(),
                this._panner.disconnect(),
                this.pan.dispose(),
                this
            }
        }
        class Aa extends Sa {
            constructor() {
                super(Di(Aa.getDefaults(), arguments, ["frequency"])),
                this.name = "AutoPanner";
                const t = Di(Aa.getDefaults(), arguments, ["frequency"]);
                this._panner = new Ca({
                    context: this.context,
                    channelCount: t.channelCount
                }),
                this.connectEffect(this._panner),
                this._lfo.connect(this._panner.pan),
                this._lfo.min = -1,
                this._lfo.max = 1
            }
            static getDefaults() {
                return Object.assign(Sa.getDefaults(), {
                    channelCount: 1
                })
            }
            dispose() {
                return super.dispose(),
                this._panner.dispose(),
                this
            }
        }
        class Da extends wo {
            constructor() {
                super(Di(Da.getDefaults(), arguments, ["smoothing"])),
                this.name = "Follower";
                const t = Di(Da.getDefaults(), arguments, ["smoothing"]);
                this._abs = this.input = new kr({
                    context: this.context
                }),
                this._lowpass = this.output = new na({
                    context: this.context,
                    frequency: 1 / this.toSeconds(t.smoothing),
                    type: "lowpass"
                }),
                this._abs.connect(this._lowpass),
                this._smoothing = t.smoothing
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    smoothing: .05
                })
            }
            get smoothing() {
                return this._smoothing
            }
            set smoothing(t) {
                this._smoothing = t,
                this._lowpass.frequency = 1 / this.toSeconds(this.smoothing)
            }
            dispose() {
                return super.dispose(),
                this._abs.dispose(),
                this._lowpass.dispose(),
                this
            }
        }
        class Oa extends Ta {
            constructor() {
                super(Di(Oa.getDefaults(), arguments, ["baseFrequency", "octaves", "sensitivity"])),
                this.name = "AutoWah";
                const t = Di(Oa.getDefaults(), arguments, ["baseFrequency", "octaves", "sensitivity"]);
                this._follower = new Da({
                    context: this.context,
                    smoothing: t.follower
                }),
                this._sweepRange = new Rr({
                    context: this.context,
                    min: 0,
                    max: 1,
                    exponent: .5
                }),
                this._baseFrequency = this.toFrequency(t.baseFrequency),
                this._octaves = t.octaves,
                this._inputBoost = new ko({
                    context: this.context
                }),
                this._bandpass = new Wr({
                    context: this.context,
                    rolloff: -48,
                    frequency: 0,
                    Q: t.Q
                }),
                this._peaking = new Wr({
                    context: this.context,
                    type: "peaking"
                }),
                this._peaking.gain.value = t.gain,
                this.gain = this._peaking.gain,
                this.Q = this._bandpass.Q,
                this.effectSend.chain(this._inputBoost, this._follower, this._sweepRange),
                this._sweepRange.connect(this._bandpass.frequency),
                this._sweepRange.connect(this._peaking.frequency),
                this.effectSend.chain(this._bandpass, this._peaking, this.effectReturn),
                this._setSweepRange(),
                this.sensitivity = t.sensitivity,
                Ui(this, ["gain", "Q"])
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    baseFrequency: 100,
                    octaves: 6,
                    sensitivity: 0,
                    Q: 2,
                    gain: 2,
                    follower: .2
                })
            }
            get octaves() {
                return this._octaves
            }
            set octaves(t) {
                this._octaves = t,
                this._setSweepRange()
            }
            get follower() {
                return this._follower.smoothing
            }
            set follower(t) {
                this._follower.smoothing = t
            }
            get baseFrequency() {
                return this._baseFrequency
            }
            set baseFrequency(t) {
                this._baseFrequency = this.toFrequency(t),
                this._setSweepRange()
            }
            get sensitivity() {
                return so(1 / this._inputBoost.gain.value)
            }
            set sensitivity(t) {
                this._inputBoost.gain.value = 1 / eo(t)
            }
            _setSweepRange() {
                this._sweepRange.min = this._baseFrequency,
                this._sweepRange.max = Math.min(this._baseFrequency * Math.pow(2, this._octaves), this.context.sampleRate / 2)
            }
            dispose() {
                return super.dispose(),
                this._follower.dispose(),
                this._sweepRange.dispose(),
                this._bandpass.dispose(),
                this._peaking.dispose(),
                this._inputBoost.dispose(),
                this
            }
        }
        ta("bit-crusher", "\n\tclass BitCrusherWorklet extends SingleIOProcessor {\n\n\t\tstatic get parameterDescriptors() {\n\t\t\treturn [{\n\t\t\t\tname: \"bits\",\n\t\t\t\tdefaultValue: 12,\n\t\t\t\tminValue: 1,\n\t\t\t\tmaxValue: 16,\n\t\t\t\tautomationRate: 'k-rate'\n\t\t\t}];\n\t\t}\n\n\t\tgenerate(input, _channel, parameters) {\n\t\t\tconst step = Math.pow(0.5, parameters.bits - 1);\n\t\t\tconst val = step * Math.floor(input / step + 0.5);\n\t\t\treturn val;\n\t\t}\n\t}\n");
        class Ma extends Ta {
            constructor() {
                super(Di(Ma.getDefaults(), arguments, ["bits"])),
                this.name = "BitCrusher";
                const t = Di(Ma.getDefaults(), arguments, ["bits"]);
                this._bitCrusherWorklet = new Ea({
                    context: this.context,
                    bits: t.bits
                }),
                this.connectEffect(this._bitCrusherWorklet),
                this.bits = this._bitCrusherWorklet.bits
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    bits: 4
                })
            }
            dispose() {
                return super.dispose(),
                this._bitCrusherWorklet.dispose(),
                this
            }
        }
        class Ea extends ea {
            constructor() {
                super(Di(Ea.getDefaults(), arguments)),
                this.name = "BitCrusherWorklet";
                const t = Di(Ea.getDefaults(), arguments);
                this.input = new ko({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this.bits = new xo({
                    context: this.context,
                    value: t.bits,
                    units: "positive",
                    minValue: 1,
                    maxValue: 16,
                    param: this._dummyParam,
                    swappable: !0
                })
            }
            static getDefaults() {
                return Object.assign(ea.getDefaults(), {
                    bits: 12
                })
            }
            _audioWorkletName() {
                return "bit-crusher"
            }
            onReady(t) {
                bo(this.input, t, this.output);
                const e = t.parameters.get("bits");
                this.bits.setParam(e)
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this.output.dispose(),
                this.bits.dispose(),
                this
            }
        }
        class Ra extends Ta {
            constructor() {
                super(Di(Ra.getDefaults(), arguments, ["order"])),
                this.name = "Chebyshev";
                const t = Di(Ra.getDefaults(), arguments, ["order"]);
                this._shaper = new rr({
                    context: this.context,
                    length: 4096
                }),
                this._order = t.order,
                this.connectEffect(this._shaper),
                this.order = t.order,
                this.oversample = t.oversample
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    order: 1,
                    oversample: "none"
                })
            }
            _getCoefficient(t, e, s) {
                return s.has(e) || (0 === e ? s.set(e, 0) : 1 === e ? s.set(e, t) : s.set(e, 2 * t * this._getCoefficient(t, e - 1, s) - this._getCoefficient(t, e - 2, s))),
                s.get(e)
            }
            get order() {
                return this._order
            }
            set order(t) {
                this._order = t,
                this._shaper.setMap(e=>this._getCoefficient(e, t, new Map))
            }
            get oversample() {
                return this._shaper.oversample
            }
            set oversample(t) {
                this._shaper.oversample = t
            }
            dispose() {
                return super.dispose(),
                this._shaper.dispose(),
                this
            }
        }
        class qa extends wo {
            constructor() {
                super(Di(qa.getDefaults(), arguments, ["channels"])),
                this.name = "Split";
                const t = Di(qa.getDefaults(), arguments, ["channels"]);
                this._splitter = this.input = this.output = this.context.createChannelSplitter(t.channels),
                this._internalChannels = [this._splitter]
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    channels: 2
                })
            }
            dispose() {
                return super.dispose(),
                this._splitter.disconnect(),
                this
            }
        }
        class Fa extends wo {
            constructor() {
                super(Di(Fa.getDefaults(), arguments, ["channels"])),
                this.name = "Merge";
                const t = Di(Fa.getDefaults(), arguments, ["channels"]);
                this._merger = this.output = this.input = this.context.createChannelMerger(t.channels)
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    channels: 2
                })
            }
            dispose() {
                return super.dispose(),
                this._merger.disconnect(),
                this
            }
        }
        class Ia extends wo {
            constructor(t) {
                super(t),
                this.name = "StereoEffect",
                this.input = new ko({
                    context: this.context
                }),
                this.input.channelCount = 2,
                this.input.channelCountMode = "explicit",
                this._dryWet = this.output = new ba({
                    context: this.context,
                    fade: t.wet
                }),
                this.wet = this._dryWet.fade,
                this._split = new qa({
                    context: this.context,
                    channels: 2
                }),
                this._merge = new Fa({
                    context: this.context,
                    channels: 2
                }),
                this.input.connect(this._split),
                this.input.connect(this._dryWet.a),
                this._merge.connect(this._dryWet.b),
                Ui(this, ["wet"])
            }
            connectEffectLeft(...t) {
                this._split.connect(t[0], 0, 0),
                bo(...t),
                To(t[t.length - 1], this._merge, 0, 0)
            }
            connectEffectRight(...t) {
                this._split.connect(t[0], 1, 0),
                bo(...t),
                To(t[t.length - 1], this._merge, 0, 1)
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    wet: 1
                })
            }
            dispose() {
                return super.dispose(),
                this._dryWet.dispose(),
                this._split.dispose(),
                this._merge.dispose(),
                this
            }
        }
        class Va extends Ia {
            constructor(t) {
                super(t),
                this.feedback = new Do({
                    context: this.context,
                    value: t.feedback,
                    units: "normalRange"
                }),
                this._feedbackL = new ko({
                    context: this.context
                }),
                this._feedbackR = new ko({
                    context: this.context
                }),
                this._feedbackSplit = new qa({
                    context: this.context,
                    channels: 2
                }),
                this._feedbackMerge = new Fa({
                    context: this.context,
                    channels: 2
                }),
                this._merge.connect(this._feedbackSplit),
                this._feedbackMerge.connect(this._split),
                this._feedbackSplit.connect(this._feedbackL, 0, 0),
                this._feedbackL.connect(this._feedbackMerge, 0, 0),
                this._feedbackSplit.connect(this._feedbackR, 1, 0),
                this._feedbackR.connect(this._feedbackMerge, 0, 1),
                this.feedback.fan(this._feedbackL.gain, this._feedbackR.gain),
                Ui(this, ["feedback"])
            }
            static getDefaults() {
                return Object.assign(Ia.getDefaults(), {
                    feedback: .5
                })
            }
            dispose() {
                return super.dispose(),
                this.feedback.dispose(),
                this._feedbackL.dispose(),
                this._feedbackR.dispose(),
                this._feedbackSplit.dispose(),
                this._feedbackMerge.dispose(),
                this
            }
        }
        class Na extends Va {
            constructor() {
                super(Di(Na.getDefaults(), arguments, ["frequency", "delayTime", "depth"])),
                this.name = "Chorus";
                const t = Di(Na.getDefaults(), arguments, ["frequency", "delayTime", "depth"]);
                this._depth = t.depth,
                this._delayTime = t.delayTime / 1e3,
                this._lfoL = new yr({
                    context: this.context,
                    frequency: t.frequency,
                    min: 0,
                    max: 1
                }),
                this._lfoR = new yr({
                    context: this.context,
                    frequency: t.frequency,
                    min: 0,
                    max: 1,
                    phase: 180
                }),
                this._delayNodeL = new Fo({
                    context: this.context
                }),
                this._delayNodeR = new Fo({
                    context: this.context
                }),
                this.frequency = this._lfoL.frequency,
                Ui(this, ["frequency"]),
                this._lfoL.frequency.connect(this._lfoR.frequency),
                this.connectEffectLeft(this._delayNodeL),
                this.connectEffectRight(this._delayNodeR),
                this._lfoL.connect(this._delayNodeL.delayTime),
                this._lfoR.connect(this._delayNodeR.delayTime),
                this.depth = this._depth,
                this.type = t.type,
                this.spread = t.spread
            }
            static getDefaults() {
                return Object.assign(Va.getDefaults(), {
                    frequency: 1.5,
                    delayTime: 3.5,
                    depth: .7,
                    type: "sine",
                    spread: 180,
                    feedback: 0,
                    wet: .5
                })
            }
            get depth() {
                return this._depth
            }
            set depth(t) {
                this._depth = t;
                const e = this._delayTime * t;
                this._lfoL.min = Math.max(this._delayTime - e, 0),
                this._lfoL.max = this._delayTime + e,
                this._lfoR.min = Math.max(this._delayTime - e, 0),
                this._lfoR.max = this._delayTime + e
            }
            get delayTime() {
                return 1e3 * this._delayTime
            }
            set delayTime(t) {
                this._delayTime = t / 1e3,
                this.depth = this._depth
            }
            get type() {
                return this._lfoL.type
            }
            set type(t) {
                this._lfoL.type = t,
                this._lfoR.type = t
            }
            get spread() {
                return this._lfoR.phase - this._lfoL.phase
            }
            set spread(t) {
                this._lfoL.phase = 90 - t / 2,
                this._lfoR.phase = t / 2 + 90
            }
            start(t) {
                return this._lfoL.start(t),
                this._lfoR.start(t),
                this
            }
            stop(t) {
                return this._lfoL.stop(t),
                this._lfoR.stop(t),
                this
            }
            sync() {
                return this._lfoL.sync(),
                this._lfoR.sync(),
                this
            }
            unsync() {
                return this._lfoL.unsync(),
                this._lfoR.unsync(),
                this
            }
            dispose() {
                return super.dispose(),
                this._lfoL.dispose(),
                this._lfoR.dispose(),
                this._delayNodeL.dispose(),
                this._delayNodeR.dispose(),
                this.frequency.dispose(),
                this
            }
        }
        class Pa extends Ta {
            constructor() {
                super(Di(Pa.getDefaults(), arguments, ["distortion"])),
                this.name = "Distortion";
                const t = Di(Pa.getDefaults(), arguments, ["distortion"]);
                this._shaper = new rr({
                    context: this.context,
                    length: 4096
                }),
                this._distortion = t.distortion,
                this.connectEffect(this._shaper),
                this.distortion = t.distortion,
                this.oversample = t.oversample
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    distortion: .4,
                    oversample: "none"
                })
            }
            get distortion() {
                return this._distortion
            }
            set distortion(t) {
                this._distortion = t;
                const e = 100 * t
                  , s = Math.PI / 180;
                this._shaper.setMap(t=>Math.abs(t) < .001 ? 0 : (3 + e) * t * 20 * s / (Math.PI + e * Math.abs(t)))
            }
            get oversample() {
                return this._shaper.oversample
            }
            set oversample(t) {
                this._shaper.oversample = t
            }
            dispose() {
                return super.dispose(),
                this._shaper.dispose(),
                this
            }
        }
        class ja extends Ta {
            constructor(t) {
                super(t),
                this.name = "FeedbackEffect",
                this._feedbackGain = new ko({
                    context: this.context,
                    gain: t.feedback,
                    units: "normalRange"
                }),
                this.feedback = this._feedbackGain.gain,
                Ui(this, "feedback"),
                this.effectReturn.chain(this._feedbackGain, this.effectSend)
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    feedback: .125
                })
            }
            dispose() {
                return super.dispose(),
                this._feedbackGain.dispose(),
                this.feedback.dispose(),
                this
            }
        }
        class La extends ja {
            constructor() {
                super(Di(La.getDefaults(), arguments, ["delayTime", "feedback"])),
                this.name = "FeedbackDelay";
                const t = Di(La.getDefaults(), arguments, ["delayTime", "feedback"]);
                this._delayNode = new Fo({
                    context: this.context,
                    delayTime: t.delayTime,
                    maxDelay: t.maxDelay
                }),
                this.delayTime = this._delayNode.delayTime,
                this.connectEffect(this._delayNode),
                Ui(this, "delayTime")
            }
            static getDefaults() {
                return Object.assign(ja.getDefaults(), {
                    delayTime: .25,
                    maxDelay: 1
                })
            }
            dispose() {
                return super.dispose(),
                this._delayNode.dispose(),
                this.delayTime.dispose(),
                this
            }
        }
        class za extends wo {
            constructor(t) {
                super(t),
                this.name = "PhaseShiftAllpass",
                this.input = new ko({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this.offset90 = new ko({
                    context: this.context
                });
                this._bank0 = this._createAllPassFilterBank([.6923878, .9360654322959, .988229522686, .9987488452737]),
                this._bank1 = this._createAllPassFilterBank([.4021921162426, .856171088242, .9722909545651, .9952884791278]),
                this._oneSampleDelay = this.context.createIIRFilter([0, 1], [1, 0]),
                bo(this.input, ...this._bank0, this._oneSampleDelay, this.output),
                bo(this.input, ...this._bank1, this.offset90)
            }
            _createAllPassFilterBank(t) {
                return t.map(t=>{
                    const e = [[t * t, 0, -1], [1, 0, -t * t]];
                    return this.context.createIIRFilter(e[0], e[1])
                }
                )
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this.output.dispose(),
                this.offset90.dispose(),
                this._bank0.forEach(t=>t.disconnect()),
                this._bank1.forEach(t=>t.disconnect()),
                this._oneSampleDelay.disconnect(),
                this
            }
        }
        class Ba extends Ta {
            constructor() {
                super(Di(Ba.getDefaults(), arguments, ["frequency"])),
                this.name = "FrequencyShifter";
                const t = Di(Ba.getDefaults(), arguments, ["frequency"]);
                this.frequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.frequency,
                    minValue: -this.context.sampleRate / 2,
                    maxValue: this.context.sampleRate / 2
                }),
                this._sine = new nr({
                    context: this.context,
                    type: "sine"
                }),
                this._cosine = new ir({
                    context: this.context,
                    phase: -90,
                    type: "sine"
                }),
                this._sineMultiply = new cr({
                    context: this.context
                }),
                this._cosineMultiply = new cr({
                    context: this.context
                }),
                this._negate = new Ar({
                    context: this.context
                }),
                this._add = new mr({
                    context: this.context
                }),
                this._phaseShifter = new za({
                    context: this.context
                }),
                this.effectSend.connect(this._phaseShifter),
                this.frequency.fan(this._sine.frequency, this._cosine.frequency),
                this._phaseShifter.offset90.connect(this._cosineMultiply),
                this._cosine.connect(this._cosineMultiply.factor),
                this._phaseShifter.connect(this._sineMultiply),
                this._sine.connect(this._sineMultiply.factor),
                this._sineMultiply.connect(this._negate),
                this._cosineMultiply.connect(this._add),
                this._negate.connect(this._add.addend),
                this._add.connect(this.effectReturn);
                const e = this.immediate();
                this._sine.start(e),
                this._cosine.start(e)
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    frequency: 0
                })
            }
            dispose() {
                return super.dispose(),
                this.frequency.dispose(),
                this._add.dispose(),
                this._cosine.dispose(),
                this._cosineMultiply.dispose(),
                this._negate.dispose(),
                this._phaseShifter.dispose(),
                this._sine.dispose(),
                this._sineMultiply.dispose(),
                this
            }
        }
        const Wa = [1557 / 44100, 1617 / 44100, 1491 / 44100, 1422 / 44100, 1277 / 44100, 1356 / 44100, 1188 / 44100, 1116 / 44100]
          , Ga = [225, 556, 441, 341];
        class Ua extends Ia {
            constructor() {
                super(Di(Ua.getDefaults(), arguments, ["roomSize", "dampening"])),
                this.name = "Freeverb",
                this._combFilters = [],
                this._allpassFiltersL = [],
                this._allpassFiltersR = [];
                const t = Di(Ua.getDefaults(), arguments, ["roomSize", "dampening"]);
                this.roomSize = new Do({
                    context: this.context,
                    value: t.roomSize,
                    units: "normalRange"
                }),
                this._allpassFiltersL = Ga.map(t=>{
                    const e = this.context.createBiquadFilter();
                    return e.type = "allpass",
                    e.frequency.value = t,
                    e
                }
                ),
                this._allpassFiltersR = Ga.map(t=>{
                    const e = this.context.createBiquadFilter();
                    return e.type = "allpass",
                    e.frequency.value = t,
                    e
                }
                ),
                this._combFilters = Wa.map((e,s)=>{
                    const n = new ia({
                        context: this.context,
                        dampening: t.dampening,
                        delayTime: e
                    });
                    return s < Wa.length / 2 ? this.connectEffectLeft(n, ...this._allpassFiltersL) : this.connectEffectRight(n, ...this._allpassFiltersR),
                    this.roomSize.connect(n.resonance),
                    n
                }
                ),
                Ui(this, ["roomSize"])
            }
            static getDefaults() {
                return Object.assign(Ia.getDefaults(), {
                    roomSize: .7,
                    dampening: 3e3
                })
            }
            get dampening() {
                return this._combFilters[0].dampening
            }
            set dampening(t) {
                this._combFilters.forEach(e=>e.dampening = t)
            }
            dispose() {
                return super.dispose(),
                this._allpassFiltersL.forEach(t=>t.disconnect()),
                this._allpassFiltersR.forEach(t=>t.disconnect()),
                this._combFilters.forEach(t=>t.dispose()),
                this.roomSize.dispose(),
                this
            }
        }
        const Qa = [.06748, .06404, .08212, .09004]
          , Za = [.773, .802, .753, .733]
          , Xa = [347, 113, 37];
        class Ya extends Ia {
            constructor() {
                super(Di(Ya.getDefaults(), arguments, ["roomSize"])),
                this.name = "JCReverb",
                this._allpassFilters = [],
                this._feedbackCombFilters = [];
                const t = Di(Ya.getDefaults(), arguments, ["roomSize"]);
                this.roomSize = new Do({
                    context: this.context,
                    value: t.roomSize,
                    units: "normalRange"
                }),
                this._scaleRoomSize = new gr({
                    context: this.context,
                    min: -.733,
                    max: .197
                }),
                this._allpassFilters = Xa.map(t=>{
                    const e = this.context.createBiquadFilter();
                    return e.type = "allpass",
                    e.frequency.value = t,
                    e
                }
                ),
                this._feedbackCombFilters = Qa.map((t,e)=>{
                    const s = new sa({
                        context: this.context,
                        delayTime: t
                    });
                    return this._scaleRoomSize.connect(s.resonance),
                    s.resonance.value = Za[e],
                    e < Qa.length / 2 ? this.connectEffectLeft(...this._allpassFilters, s) : this.connectEffectRight(...this._allpassFilters, s),
                    s
                }
                ),
                this.roomSize.connect(this._scaleRoomSize),
                Ui(this, ["roomSize"])
            }
            static getDefaults() {
                return Object.assign(Ia.getDefaults(), {
                    roomSize: .5
                })
            }
            dispose() {
                return super.dispose(),
                this._allpassFilters.forEach(t=>t.disconnect()),
                this._feedbackCombFilters.forEach(t=>t.dispose()),
                this.roomSize.dispose(),
                this._scaleRoomSize.dispose(),
                this
            }
        }
        class Ha extends Va {
            constructor(t) {
                super(t),
                this._feedbackL.disconnect(),
                this._feedbackL.connect(this._feedbackMerge, 0, 1),
                this._feedbackR.disconnect(),
                this._feedbackR.connect(this._feedbackMerge, 0, 0),
                Ui(this, ["feedback"])
            }
        }
        class $a extends Ha {
            constructor() {
                super(Di($a.getDefaults(), arguments, ["delayTime", "feedback"])),
                this.name = "PingPongDelay";
                const t = Di($a.getDefaults(), arguments, ["delayTime", "feedback"]);
                this._leftDelay = new Fo({
                    context: this.context,
                    maxDelay: t.maxDelay
                }),
                this._rightDelay = new Fo({
                    context: this.context,
                    maxDelay: t.maxDelay
                }),
                this._rightPreDelay = new Fo({
                    context: this.context,
                    maxDelay: t.maxDelay
                }),
                this.delayTime = new Do({
                    context: this.context,
                    units: "time",
                    value: t.delayTime
                }),
                this.connectEffectLeft(this._leftDelay),
                this.connectEffectRight(this._rightPreDelay, this._rightDelay),
                this.delayTime.fan(this._leftDelay.delayTime, this._rightDelay.delayTime, this._rightPreDelay.delayTime),
                this._feedbackL.disconnect(),
                this._feedbackL.connect(this._rightDelay),
                Ui(this, ["delayTime"])
            }
            static getDefaults() {
                return Object.assign(Ha.getDefaults(), {
                    delayTime: .25,
                    maxDelay: 1
                })
            }
            dispose() {
                return super.dispose(),
                this._leftDelay.dispose(),
                this._rightDelay.dispose(),
                this._rightPreDelay.dispose(),
                this.delayTime.dispose(),
                this
            }
        }
        class Ja extends ja {
            constructor() {
                super(Di(Ja.getDefaults(), arguments, ["pitch"])),
                this.name = "PitchShift";
                const t = Di(Ja.getDefaults(), arguments, ["pitch"]);
                this._frequency = new Do({
                    context: this.context
                }),
                this._delayA = new Fo({
                    maxDelay: 1,
                    context: this.context
                }),
                this._lfoA = new yr({
                    context: this.context,
                    min: 0,
                    max: .1,
                    type: "sawtooth"
                }).connect(this._delayA.delayTime),
                this._delayB = new Fo({
                    maxDelay: 1,
                    context: this.context
                }),
                this._lfoB = new yr({
                    context: this.context,
                    min: 0,
                    max: .1,
                    type: "sawtooth",
                    phase: 180
                }).connect(this._delayB.delayTime),
                this._crossFade = new ba({
                    context: this.context
                }),
                this._crossFadeLFO = new yr({
                    context: this.context,
                    min: 0,
                    max: 1,
                    type: "triangle",
                    phase: 90
                }).connect(this._crossFade.fade),
                this._feedbackDelay = new Fo({
                    delayTime: t.delayTime,
                    context: this.context
                }),
                this.delayTime = this._feedbackDelay.delayTime,
                Ui(this, "delayTime"),
                this._pitch = t.pitch,
                this._windowSize = t.windowSize,
                this._delayA.connect(this._crossFade.a),
                this._delayB.connect(this._crossFade.b),
                this._frequency.fan(this._lfoA.frequency, this._lfoB.frequency, this._crossFadeLFO.frequency),
                this.effectSend.fan(this._delayA, this._delayB),
                this._crossFade.chain(this._feedbackDelay, this.effectReturn);
                const e = this.now();
                this._lfoA.start(e),
                this._lfoB.start(e),
                this._crossFadeLFO.start(e),
                this.windowSize = this._windowSize
            }
            static getDefaults() {
                return Object.assign(ja.getDefaults(), {
                    pitch: 0,
                    windowSize: .1,
                    delayTime: 0,
                    feedback: 0
                })
            }
            get pitch() {
                return this._pitch
            }
            set pitch(t) {
                this._pitch = t;
                let e = 0;
                t < 0 ? (this._lfoA.min = 0,
                this._lfoA.max = this._windowSize,
                this._lfoB.min = 0,
                this._lfoB.max = this._windowSize,
                e = no(t - 1) + 1) : (this._lfoA.min = this._windowSize,
                this._lfoA.max = 0,
                this._lfoB.min = this._windowSize,
                this._lfoB.max = 0,
                e = no(t) - 1),
                this._frequency.value = e * (1.2 / this._windowSize)
            }
            get windowSize() {
                return this._windowSize
            }
            set windowSize(t) {
                this._windowSize = this.toSeconds(t),
                this.pitch = this._pitch
            }
            dispose() {
                return super.dispose(),
                this._frequency.dispose(),
                this._delayA.dispose(),
                this._delayB.dispose(),
                this._lfoA.dispose(),
                this._lfoB.dispose(),
                this._crossFade.dispose(),
                this._crossFadeLFO.dispose(),
                this._feedbackDelay.dispose(),
                this
            }
        }
        class Ka extends Ia {
            constructor() {
                super(Di(Ka.getDefaults(), arguments, ["frequency", "octaves", "baseFrequency"])),
                this.name = "Phaser";
                const t = Di(Ka.getDefaults(), arguments, ["frequency", "octaves", "baseFrequency"]);
                this._lfoL = new yr({
                    context: this.context,
                    frequency: t.frequency,
                    min: 0,
                    max: 1
                }),
                this._lfoR = new yr({
                    context: this.context,
                    frequency: t.frequency,
                    min: 0,
                    max: 1,
                    phase: 180
                }),
                this._baseFrequency = this.toFrequency(t.baseFrequency),
                this._octaves = t.octaves,
                this.Q = new Do({
                    context: this.context,
                    value: t.Q,
                    units: "positive"
                }),
                this._filtersL = this._makeFilters(t.stages, this._lfoL),
                this._filtersR = this._makeFilters(t.stages, this._lfoR),
                this.frequency = this._lfoL.frequency,
                this.frequency.value = t.frequency,
                this.connectEffectLeft(...this._filtersL),
                this.connectEffectRight(...this._filtersR),
                this._lfoL.frequency.connect(this._lfoR.frequency),
                this.baseFrequency = t.baseFrequency,
                this.octaves = t.octaves,
                this._lfoL.start(),
                this._lfoR.start(),
                Ui(this, ["frequency", "Q"])
            }
            static getDefaults() {
                return Object.assign(Ia.getDefaults(), {
                    frequency: .5,
                    octaves: 3,
                    stages: 10,
                    Q: 10,
                    baseFrequency: 350
                })
            }
            _makeFilters(t, e) {
                const s = [];
                for (let n = 0; n < t; n++) {
                    const t = this.context.createBiquadFilter();
                    t.type = "allpass",
                    this.Q.connect(t.Q),
                    e.connect(t.frequency),
                    s.push(t)
                }
                return s
            }
            get octaves() {
                return this._octaves
            }
            set octaves(t) {
                this._octaves = t;
                const e = this._baseFrequency * Math.pow(2, t);
                this._lfoL.max = e,
                this._lfoR.max = e
            }
            get baseFrequency() {
                return this._baseFrequency
            }
            set baseFrequency(t) {
                this._baseFrequency = this.toFrequency(t),
                this._lfoL.min = this._baseFrequency,
                this._lfoR.min = this._baseFrequency,
                this.octaves = this._octaves
            }
            dispose() {
                return super.dispose(),
                this.Q.dispose(),
                this._lfoL.dispose(),
                this._lfoR.dispose(),
                this._filtersL.forEach(t=>t.disconnect()),
                this._filtersR.forEach(t=>t.disconnect()),
                this.frequency.dispose(),
                this
            }
        }
        class tc extends Ta {
            constructor() {
                super(Di(tc.getDefaults(), arguments, ["decay"])),
                this.name = "Reverb",
                this._convolver = this.context.createConvolver(),
                this.ready = Promise.resolve();
                const t = Di(tc.getDefaults(), arguments, ["decay"]);
                this._decay = t.decay,
                this._preDelay = t.preDelay,
                this.generate(),
                this.connectEffect(this._convolver)
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    decay: 1.5,
                    preDelay: .01
                })
            }
            get decay() {
                return this._decay
            }
            set decay(t) {
                ei(t = this.toSeconds(t), .001),
                this._decay = t,
                this.generate()
            }
            get preDelay() {
                return this._preDelay
            }
            set preDelay(t) {
                ei(t = this.toSeconds(t), 0),
                this._preDelay = t,
                this.generate()
            }
            generate() {
                return yi(this, void 0, void 0, (function*() {
                    const t = this.ready
                      , e = new Yi(2,this._decay + this._preDelay,this.context.sampleRate)
                      , s = new Jo({
                        context: e
                    })
                      , n = new Jo({
                        context: e
                    })
                      , i = new Fa({
                        context: e
                    });
                    s.connect(i, 0, 0),
                    n.connect(i, 0, 1);
                    const o = new ko({
                        context: e
                    }).toDestination();
                    i.connect(o),
                    s.start(0),
                    n.start(0),
                    o.gain.setValueAtTime(0, 0),
                    o.gain.setValueAtTime(1, this._preDelay),
                    o.gain.exponentialApproachValueAtTime(0, this._preDelay, this.decay);
                    const r = e.render();
                    return this.ready = r.then(Zi),
                    yield t,
                    this._convolver.buffer = (yield r).get(),
                    this
                }
                ))
            }
            dispose() {
                return super.dispose(),
                this._convolver.disconnect(),
                this
            }
        }
        class ec extends wo {
            constructor() {
                super(Di(ec.getDefaults(), arguments)),
                this.name = "MidSideSplit",
                this._split = this.input = new qa({
                    channels: 2,
                    context: this.context
                }),
                this._midAdd = new mr({
                    context: this.context
                }),
                this.mid = new cr({
                    context: this.context,
                    value: Math.SQRT1_2
                }),
                this._sideSubtract = new Dr({
                    context: this.context
                }),
                this.side = new cr({
                    context: this.context,
                    value: Math.SQRT1_2
                }),
                this._split.connect(this._midAdd, 0),
                this._split.connect(this._midAdd.addend, 1),
                this._split.connect(this._sideSubtract, 0),
                this._split.connect(this._sideSubtract.subtrahend, 1),
                this._midAdd.connect(this.mid),
                this._sideSubtract.connect(this.side)
            }
            dispose() {
                return super.dispose(),
                this.mid.dispose(),
                this.side.dispose(),
                this._midAdd.dispose(),
                this._sideSubtract.dispose(),
                this._split.dispose(),
                this
            }
        }
        class sc extends wo {
            constructor() {
                super(Di(sc.getDefaults(), arguments)),
                this.name = "MidSideMerge",
                this.mid = new ko({
                    context: this.context
                }),
                this.side = new ko({
                    context: this.context
                }),
                this._left = new mr({
                    context: this.context
                }),
                this._leftMult = new cr({
                    context: this.context,
                    value: Math.SQRT1_2
                }),
                this._right = new Dr({
                    context: this.context
                }),
                this._rightMult = new cr({
                    context: this.context,
                    value: Math.SQRT1_2
                }),
                this._merge = this.output = new Fa({
                    context: this.context
                }),
                this.mid.fan(this._left),
                this.side.connect(this._left.addend),
                this.mid.connect(this._right),
                this.side.connect(this._right.subtrahend),
                this._left.connect(this._leftMult),
                this._right.connect(this._rightMult),
                this._leftMult.connect(this._merge, 0, 0),
                this._rightMult.connect(this._merge, 0, 1)
            }
            dispose() {
                return super.dispose(),
                this.mid.dispose(),
                this.side.dispose(),
                this._leftMult.dispose(),
                this._rightMult.dispose(),
                this._left.dispose(),
                this._right.dispose(),
                this
            }
        }
        class nc extends Ta {
            constructor(t) {
                super(t),
                this.name = "MidSideEffect",
                this._midSideMerge = new sc({
                    context: this.context
                }),
                this._midSideSplit = new ec({
                    context: this.context
                }),
                this._midSend = this._midSideSplit.mid,
                this._sideSend = this._midSideSplit.side,
                this._midReturn = this._midSideMerge.mid,
                this._sideReturn = this._midSideMerge.side,
                this.effectSend.connect(this._midSideSplit),
                this._midSideMerge.connect(this.effectReturn)
            }
            connectEffectMid(...t) {
                this._midSend.chain(...t, this._midReturn)
            }
            connectEffectSide(...t) {
                this._sideSend.chain(...t, this._sideReturn)
            }
            dispose() {
                return super.dispose(),
                this._midSideSplit.dispose(),
                this._midSideMerge.dispose(),
                this._midSend.dispose(),
                this._sideSend.dispose(),
                this._midReturn.dispose(),
                this._sideReturn.dispose(),
                this
            }
        }
        class ic extends nc {
            constructor() {
                super(Di(ic.getDefaults(), arguments, ["width"])),
                this.name = "StereoWidener";
                const t = Di(ic.getDefaults(), arguments, ["width"]);
                this.width = new Do({
                    context: this.context,
                    value: t.width,
                    units: "normalRange"
                }),
                Ui(this, ["width"]),
                this._twoTimesWidthMid = new cr({
                    context: this.context,
                    value: 2
                }),
                this._twoTimesWidthSide = new cr({
                    context: this.context,
                    value: 2
                }),
                this._midMult = new cr({
                    context: this.context
                }),
                this._twoTimesWidthMid.connect(this._midMult.factor),
                this.connectEffectMid(this._midMult),
                this._oneMinusWidth = new Dr({
                    context: this.context
                }),
                this._oneMinusWidth.connect(this._twoTimesWidthMid),
                To(this.context.getConstant(1), this._oneMinusWidth),
                this.width.connect(this._oneMinusWidth.subtrahend),
                this._sideMult = new cr({
                    context: this.context
                }),
                this.width.connect(this._twoTimesWidthSide),
                this._twoTimesWidthSide.connect(this._sideMult.factor),
                this.connectEffectSide(this._sideMult)
            }
            static getDefaults() {
                return Object.assign(nc.getDefaults(), {
                    width: .5
                })
            }
            dispose() {
                return super.dispose(),
                this.width.dispose(),
                this._midMult.dispose(),
                this._sideMult.dispose(),
                this._twoTimesWidthMid.dispose(),
                this._twoTimesWidthSide.dispose(),
                this._oneMinusWidth.dispose(),
                this
            }
        }
        class oc extends Ia {
            constructor() {
                super(Di(oc.getDefaults(), arguments, ["frequency", "depth"])),
                this.name = "Tremolo";
                const t = Di(oc.getDefaults(), arguments, ["frequency", "depth"]);
                this._lfoL = new yr({
                    context: this.context,
                    type: t.type,
                    min: 1,
                    max: 0
                }),
                this._lfoR = new yr({
                    context: this.context,
                    type: t.type,
                    min: 1,
                    max: 0
                }),
                this._amplitudeL = new ko({
                    context: this.context
                }),
                this._amplitudeR = new ko({
                    context: this.context
                }),
                this.frequency = new Do({
                    context: this.context,
                    value: t.frequency,
                    units: "frequency"
                }),
                this.depth = new Do({
                    context: this.context,
                    value: t.depth,
                    units: "normalRange"
                }),
                Ui(this, ["frequency", "depth"]),
                this.connectEffectLeft(this._amplitudeL),
                this.connectEffectRight(this._amplitudeR),
                this._lfoL.connect(this._amplitudeL.gain),
                this._lfoR.connect(this._amplitudeR.gain),
                this.frequency.fan(this._lfoL.frequency, this._lfoR.frequency),
                this.depth.fan(this._lfoR.amplitude, this._lfoL.amplitude),
                this.spread = t.spread
            }
            static getDefaults() {
                return Object.assign(Ia.getDefaults(), {
                    frequency: 10,
                    type: "sine",
                    depth: .5,
                    spread: 180
                })
            }
            start(t) {
                return this._lfoL.start(t),
                this._lfoR.start(t),
                this
            }
            stop(t) {
                return this._lfoL.stop(t),
                this._lfoR.stop(t),
                this
            }
            sync() {
                return this._lfoL.sync(),
                this._lfoR.sync(),
                this.context.transport.syncSignal(this.frequency),
                this
            }
            unsync() {
                return this._lfoL.unsync(),
                this._lfoR.unsync(),
                this.context.transport.unsyncSignal(this.frequency),
                this
            }
            get type() {
                return this._lfoL.type
            }
            set type(t) {
                this._lfoL.type = t,
                this._lfoR.type = t
            }
            get spread() {
                return this._lfoR.phase - this._lfoL.phase
            }
            set spread(t) {
                this._lfoL.phase = 90 - t / 2,
                this._lfoR.phase = t / 2 + 90
            }
            dispose() {
                return super.dispose(),
                this._lfoL.dispose(),
                this._lfoR.dispose(),
                this._amplitudeL.dispose(),
                this._amplitudeR.dispose(),
                this.frequency.dispose(),
                this.depth.dispose(),
                this
            }
        }
        class rc extends Ta {
            constructor() {
                super(Di(rc.getDefaults(), arguments, ["frequency", "depth"])),
                this.name = "Vibrato";
                const t = Di(rc.getDefaults(), arguments, ["frequency", "depth"]);
                this._delayNode = new Fo({
                    context: this.context,
                    delayTime: 0,
                    maxDelay: t.maxDelay
                }),
                this._lfo = new yr({
                    context: this.context,
                    type: t.type,
                    min: 0,
                    max: t.maxDelay,
                    frequency: t.frequency,
                    phase: -90
                }).start().connect(this._delayNode.delayTime),
                this.frequency = this._lfo.frequency,
                this.depth = this._lfo.amplitude,
                this.depth.value = t.depth,
                Ui(this, ["frequency", "depth"]),
                this.effectSend.chain(this._delayNode, this.effectReturn)
            }
            static getDefaults() {
                return Object.assign(Ta.getDefaults(), {
                    maxDelay: .005,
                    frequency: 5,
                    depth: .1,
                    type: "sine"
                })
            }
            get type() {
                return this._lfo.type
            }
            set type(t) {
                this._lfo.type = t
            }
            dispose() {
                return super.dispose(),
                this._delayNode.dispose(),
                this._lfo.dispose(),
                this.frequency.dispose(),
                this.depth.dispose(),
                this
            }
        }
        class ac extends wo {
            constructor() {
                super(Di(ac.getDefaults(), arguments, ["type", "size"])),
                this.name = "Analyser",
                this._analysers = [],
                this._buffers = [];
                const t = Di(ac.getDefaults(), arguments, ["type", "size"]);
                this.input = this.output = this._gain = new ko({
                    context: this.context
                }),
                this._split = new qa({
                    context: this.context,
                    channels: t.channels
                }),
                this.input.connect(this._split),
                ei(t.channels, 1);
                for (let e = 0; e < t.channels; e++)
                    this._analysers[e] = this.context.createAnalyser(),
                    this._split.connect(this._analysers[e], e, 0);
                this.size = t.size,
                this.type = t.type
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    size: 1024,
                    smoothing: .8,
                    type: "fft",
                    channels: 1
                })
            }
            getValue() {
                return this._analysers.forEach((t,e)=>{
                    const s = this._buffers[e];
                    "fft" === this._type ? t.getFloatFrequencyData(s) : "waveform" === this._type && t.getFloatTimeDomainData(s)
                }
                ),
                1 === this.channels ? this._buffers[0] : this._buffers
            }
            get size() {
                return this._analysers[0].frequencyBinCount
            }
            set size(t) {
                this._analysers.forEach((e,s)=>{
                    e.fftSize = 2 * t,
                    this._buffers[s] = new Float32Array(t)
                }
                )
            }
            get channels() {
                return this._analysers.length
            }
            get type() {
                return this._type
            }
            set type(t) {
                ti("waveform" === t || "fft" === t, "Analyser: invalid type: " + t),
                this._type = t
            }
            get smoothing() {
                return this._analysers[0].smoothingTimeConstant
            }
            set smoothing(t) {
                this._analysers.forEach(e=>e.smoothingTimeConstant = t)
            }
            dispose() {
                return super.dispose(),
                this._analysers.forEach(t=>t.disconnect()),
                this._split.dispose(),
                this._gain.dispose(),
                this
            }
        }
        class cc extends wo {
            constructor() {
                super(Di(cc.getDefaults(), arguments)),
                this.name = "MeterBase",
                this.input = this.output = this._analyser = new ac({
                    context: this.context,
                    size: 256,
                    type: "waveform"
                })
            }
            dispose() {
                return super.dispose(),
                this._analyser.dispose(),
                this
            }
        }
        class hc extends cc {
            constructor() {
                super(Di(hc.getDefaults(), arguments, ["smoothing"])),
                this.name = "Meter",
                this._rms = 0;
                const t = Di(hc.getDefaults(), arguments, ["smoothing"]);
                this.input = this.output = this._analyser = new ac({
                    context: this.context,
                    size: 256,
                    type: "waveform",
                    channels: t.channels
                }),
                this.smoothing = t.smoothing,
                this.normalRange = t.normalRange
            }
            static getDefaults() {
                return Object.assign(cc.getDefaults(), {
                    smoothing: .8,
                    normalRange: !1,
                    channels: 1
                })
            }
            getLevel() {
                return ri("'getLevel' has been changed to 'getValue'"),
                this.getValue()
            }
            getValue() {
                const t = this._analyser.getValue()
                  , e = (1 === this.channels ? [t] : t).map(t=>{
                    const e = t.reduce((t,e)=>t + e * e, 0)
                      , s = Math.sqrt(e / t.length);
                    return this._rms = Math.max(s, this._rms * this.smoothing),
                    this.normalRange ? this._rms : so(this._rms)
                }
                );
                return 1 === this.channels ? e[0] : e
            }
            get channels() {
                return this._analyser.channels
            }
            dispose() {
                return super.dispose(),
                this._analyser.dispose(),
                this
            }
        }
        class uc extends cc {
            constructor() {
                super(Di(uc.getDefaults(), arguments, ["size"])),
                this.name = "FFT";
                const t = Di(uc.getDefaults(), arguments, ["size"]);
                this.normalRange = t.normalRange,
                this._analyser.type = "fft",
                this.size = t.size
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    normalRange: !1,
                    size: 1024,
                    smoothing: .8
                })
            }
            getValue() {
                return this._analyser.getValue().map(t=>this.normalRange ? eo(t) : t)
            }
            get size() {
                return this._analyser.size
            }
            set size(t) {
                this._analyser.size = t
            }
            get smoothing() {
                return this._analyser.smoothing
            }
            set smoothing(t) {
                this._analyser.smoothing = t
            }
            getFrequencyOfIndex(t) {
                return ti(0 <= t && t < this.size, "index must be greater than or equal to 0 and less than " + this.size),
                t * this.context.sampleRate / (2 * this.size)
            }
        }
        class lc extends cc {
            constructor() {
                super(Di(lc.getDefaults(), arguments)),
                this.name = "DCMeter",
                this._analyser.type = "waveform",
                this._analyser.size = 256
            }
            getValue() {
                return this._analyser.getValue()[0]
            }
        }
        class pc extends cc {
            constructor() {
                super(Di(pc.getDefaults(), arguments, ["size"])),
                this.name = "Waveform";
                const t = Di(pc.getDefaults(), arguments, ["size"]);
                this._analyser.type = "waveform",
                this.size = t.size
            }
            static getDefaults() {
                return Object.assign(cc.getDefaults(), {
                    size: 1024
                })
            }
            getValue() {
                return this._analyser.getValue()
            }
            get size() {
                return this._analyser.size
            }
            set size(t) {
                this._analyser.size = t
            }
        }
        class dc extends wo {
            constructor() {
                super(Di(dc.getDefaults(), arguments, ["solo"])),
                this.name = "Solo";
                const t = Di(dc.getDefaults(), arguments, ["solo"]);
                this.input = this.output = new ko({
                    context: this.context
                }),
                dc._allSolos.has(this.context) || dc._allSolos.set(this.context, new Set),
                dc._allSolos.get(this.context).add(this),
                this.solo = t.solo
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    solo: !1
                })
            }
            get solo() {
                return this._isSoloed()
            }
            set solo(t) {
                t ? this._addSolo() : this._removeSolo(),
                dc._allSolos.get(this.context).forEach(t=>t._updateSolo())
            }
            get muted() {
                return 0 === this.input.gain.value
            }
            _addSolo() {
                dc._soloed.has(this.context) || dc._soloed.set(this.context, new Set),
                dc._soloed.get(this.context).add(this)
            }
            _removeSolo() {
                dc._soloed.has(this.context) && dc._soloed.get(this.context).delete(this)
            }
            _isSoloed() {
                return dc._soloed.has(this.context) && dc._soloed.get(this.context).has(this)
            }
            _noSolos() {
                return !dc._soloed.has(this.context) || dc._soloed.has(this.context) && 0 === dc._soloed.get(this.context).size
            }
            _updateSolo() {
                this._isSoloed() || this._noSolos() ? this.input.gain.value = 1 : this.input.gain.value = 0
            }
            dispose() {
                return super.dispose(),
                dc._allSolos.get(this.context).delete(this),
                this._removeSolo(),
                this
            }
        }
        dc._allSolos = new Map,
        dc._soloed = new Map;
        class fc extends wo {
            constructor() {
                super(Di(fc.getDefaults(), arguments, ["pan", "volume"])),
                this.name = "PanVol";
                const t = Di(fc.getDefaults(), arguments, ["pan", "volume"]);
                this._panner = this.input = new Ca({
                    context: this.context,
                    pan: t.pan,
                    channelCount: t.channelCount
                }),
                this.pan = this._panner.pan,
                this._volume = this.output = new Go({
                    context: this.context,
                    volume: t.volume
                }),
                this.volume = this._volume.volume,
                this._panner.connect(this._volume),
                this.mute = t.mute,
                Ui(this, ["pan", "volume"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    mute: !1,
                    pan: 0,
                    volume: 0,
                    channelCount: 1
                })
            }
            get mute() {
                return this._volume.mute
            }
            set mute(t) {
                this._volume.mute = t
            }
            dispose() {
                return super.dispose(),
                this._panner.dispose(),
                this.pan.dispose(),
                this._volume.dispose(),
                this.volume.dispose(),
                this
            }
        }
        class _c extends wo {
            constructor() {
                super(Di(_c.getDefaults(), arguments, ["volume", "pan"])),
                this.name = "Channel";
                const t = Di(_c.getDefaults(), arguments, ["volume", "pan"]);
                this._solo = this.input = new dc({
                    solo: t.solo,
                    context: this.context
                }),
                this._panVol = this.output = new fc({
                    context: this.context,
                    pan: t.pan,
                    volume: t.volume,
                    mute: t.mute,
                    channelCount: t.channelCount
                }),
                this.pan = this._panVol.pan,
                this.volume = this._panVol.volume,
                this._solo.connect(this._panVol),
                Ui(this, ["pan", "volume"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    pan: 0,
                    volume: 0,
                    mute: !1,
                    solo: !1,
                    channelCount: 1
                })
            }
            get solo() {
                return this._solo.solo
            }
            set solo(t) {
                this._solo.solo = t
            }
            get muted() {
                return this._solo.muted || this.mute
            }
            get mute() {
                return this._panVol.mute
            }
            set mute(t) {
                this._panVol.mute = t
            }
            _getBus(t) {
                return _c.buses.has(t) || _c.buses.set(t, new ko({
                    context: this.context
                })),
                _c.buses.get(t)
            }
            send(t, e=0) {
                const s = this._getBus(t)
                  , n = new ko({
                    context: this.context,
                    units: "decibels",
                    gain: e
                });
                return this.connect(n),
                n.connect(s),
                n
            }
            receive(t) {
                return this._getBus(t).connect(this),
                this
            }
            dispose() {
                return super.dispose(),
                this._panVol.dispose(),
                this.pan.dispose(),
                this.volume.dispose(),
                this._solo.dispose(),
                this
            }
        }
        _c.buses = new Map;
        class mc extends wo {
            constructor() {
                super(Di(mc.getDefaults(), arguments)),
                this.name = "Mono",
                this.input = new ko({
                    context: this.context
                }),
                this._merge = this.output = new Fa({
                    channels: 2,
                    context: this.context
                }),
                this.input.connect(this._merge, 0, 0),
                this.input.connect(this._merge, 0, 1)
            }
            dispose() {
                return super.dispose(),
                this._merge.dispose(),
                this.input.dispose(),
                this
            }
        }
        class gc extends wo {
            constructor() {
                super(Di(gc.getDefaults(), arguments, ["lowFrequency", "highFrequency"])),
                this.name = "MultibandSplit",
                this.input = new ko({
                    context: this.context
                }),
                this.output = void 0,
                this.low = new Wr({
                    context: this.context,
                    frequency: 0,
                    type: "lowpass"
                }),
                this._lowMidFilter = new Wr({
                    context: this.context,
                    frequency: 0,
                    type: "highpass"
                }),
                this.mid = new Wr({
                    context: this.context,
                    frequency: 0,
                    type: "lowpass"
                }),
                this.high = new Wr({
                    context: this.context,
                    frequency: 0,
                    type: "highpass"
                }),
                this._internalChannels = [this.low, this.mid, this.high];
                const t = Di(gc.getDefaults(), arguments, ["lowFrequency", "highFrequency"]);
                this.lowFrequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.lowFrequency
                }),
                this.highFrequency = new Do({
                    context: this.context,
                    units: "frequency",
                    value: t.highFrequency
                }),
                this.Q = new Do({
                    context: this.context,
                    units: "positive",
                    value: t.Q
                }),
                this.input.fan(this.low, this.high),
                this.input.chain(this._lowMidFilter, this.mid),
                this.lowFrequency.fan(this.low.frequency, this._lowMidFilter.frequency),
                this.highFrequency.fan(this.mid.frequency, this.high.frequency),
                this.Q.connect(this.low.Q),
                this.Q.connect(this._lowMidFilter.Q),
                this.Q.connect(this.mid.Q),
                this.Q.connect(this.high.Q),
                Ui(this, ["high", "mid", "low", "highFrequency", "lowFrequency"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    Q: 1,
                    highFrequency: 2500,
                    lowFrequency: 400
                })
            }
            dispose() {
                return super.dispose(),
                Qi(this, ["high", "mid", "low", "highFrequency", "lowFrequency"]),
                this.low.dispose(),
                this._lowMidFilter.dispose(),
                this.mid.dispose(),
                this.high.dispose(),
                this.lowFrequency.dispose(),
                this.highFrequency.dispose(),
                this.Q.dispose(),
                this
            }
        }
        class vc extends wo {
            constructor() {
                super(...arguments),
                this.name = "Listener",
                this.positionX = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.positionX
                }),
                this.positionY = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.positionY
                }),
                this.positionZ = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.positionZ
                }),
                this.forwardX = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.forwardX
                }),
                this.forwardY = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.forwardY
                }),
                this.forwardZ = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.forwardZ
                }),
                this.upX = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.upX
                }),
                this.upY = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.upY
                }),
                this.upZ = new xo({
                    context: this.context,
                    param: this.context.rawContext.listener.upZ
                })
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    positionX: 0,
                    positionY: 0,
                    positionZ: 0,
                    forwardX: 0,
                    forwardY: 0,
                    forwardZ: -1,
                    upX: 0,
                    upY: 1,
                    upZ: 0
                })
            }
            dispose() {
                return super.dispose(),
                this.positionX.dispose(),
                this.positionY.dispose(),
                this.positionZ.dispose(),
                this.forwardX.dispose(),
                this.forwardY.dispose(),
                this.forwardZ.dispose(),
                this.upX.dispose(),
                this.upY.dispose(),
                this.upZ.dispose(),
                this
            }
        }
        ji(t=>{
            t.listener = new vc({
                context: t
            })
        }
        ),
        zi(t=>{
            t.listener.dispose()
        }
        );
        class yc extends wo {
            constructor() {
                super(Di(yc.getDefaults(), arguments, ["positionX", "positionY", "positionZ"])),
                this.name = "Panner3D";
                const t = Di(yc.getDefaults(), arguments, ["positionX", "positionY", "positionZ"]);
                this._panner = this.input = this.output = this.context.createPanner(),
                this.panningModel = t.panningModel,
                this.maxDistance = t.maxDistance,
                this.distanceModel = t.distanceModel,
                this.coneOuterGain = t.coneOuterGain,
                this.coneOuterAngle = t.coneOuterAngle,
                this.coneInnerAngle = t.coneInnerAngle,
                this.refDistance = t.refDistance,
                this.rolloffFactor = t.rolloffFactor,
                this.positionX = new xo({
                    context: this.context,
                    param: this._panner.positionX,
                    value: t.positionX
                }),
                this.positionY = new xo({
                    context: this.context,
                    param: this._panner.positionY,
                    value: t.positionY
                }),
                this.positionZ = new xo({
                    context: this.context,
                    param: this._panner.positionZ,
                    value: t.positionZ
                }),
                this.orientationX = new xo({
                    context: this.context,
                    param: this._panner.orientationX,
                    value: t.orientationX
                }),
                this.orientationY = new xo({
                    context: this.context,
                    param: this._panner.orientationY,
                    value: t.orientationY
                }),
                this.orientationZ = new xo({
                    context: this.context,
                    param: this._panner.orientationZ,
                    value: t.orientationZ
                })
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    coneInnerAngle: 360,
                    coneOuterAngle: 360,
                    coneOuterGain: 0,
                    distanceModel: "inverse",
                    maxDistance: 1e4,
                    orientationX: 0,
                    orientationY: 0,
                    orientationZ: 0,
                    panningModel: "equalpower",
                    positionX: 0,
                    positionY: 0,
                    positionZ: 0,
                    refDistance: 1,
                    rolloffFactor: 1
                })
            }
            setPosition(t, e, s) {
                return this.positionX.value = t,
                this.positionY.value = e,
                this.positionZ.value = s,
                this
            }
            setOrientation(t, e, s) {
                return this.orientationX.value = t,
                this.orientationY.value = e,
                this.orientationZ.value = s,
                this
            }
            get panningModel() {
                return this._panner.panningModel
            }
            set panningModel(t) {
                this._panner.panningModel = t
            }
            get refDistance() {
                return this._panner.refDistance
            }
            set refDistance(t) {
                this._panner.refDistance = t
            }
            get rolloffFactor() {
                return this._panner.rolloffFactor
            }
            set rolloffFactor(t) {
                this._panner.rolloffFactor = t
            }
            get distanceModel() {
                return this._panner.distanceModel
            }
            set distanceModel(t) {
                this._panner.distanceModel = t
            }
            get coneInnerAngle() {
                return this._panner.coneInnerAngle
            }
            set coneInnerAngle(t) {
                this._panner.coneInnerAngle = t
            }
            get coneOuterAngle() {
                return this._panner.coneOuterAngle
            }
            set coneOuterAngle(t) {
                this._panner.coneOuterAngle = t
            }
            get coneOuterGain() {
                return this._panner.coneOuterGain
            }
            set coneOuterGain(t) {
                this._panner.coneOuterGain = t
            }
            get maxDistance() {
                return this._panner.maxDistance
            }
            set maxDistance(t) {
                this._panner.maxDistance = t
            }
            dispose() {
                return super.dispose(),
                this._panner.disconnect(),
                this.orientationX.dispose(),
                this.orientationY.dispose(),
                this.orientationZ.dispose(),
                this.positionX.dispose(),
                this.positionY.dispose(),
                this.positionZ.dispose(),
                this
            }
        }
        class xc extends wo {
            constructor() {
                super(Di(xc.getDefaults(), arguments)),
                this.name = "Recorder";
                const t = Di(xc.getDefaults(), arguments);
                this.input = new ko({
                    context: this.context
                }),
                ti(xc.supported, "Media Recorder API is not available"),
                this._stream = this.context.createMediaStreamDestination(),
                this.input.connect(this._stream),
                this._recorder = new MediaRecorder(this._stream.stream,{
                    mimeType: t.mimeType
                })
            }
            static getDefaults() {
                return wo.getDefaults()
            }
            get mimeType() {
                return this._recorder.mimeType
            }
            static get supported() {
                return null !== mi && Reflect.has(mi, "MediaRecorder")
            }
            get state() {
                return "inactive" === this._recorder.state ? "stopped" : "paused" === this._recorder.state ? "paused" : "started"
            }
            start() {
                return yi(this, void 0, void 0, (function*() {
                    ti("started" !== this.state, "Recorder is already started");
                    const t = new Promise(t=>{
                        const e = ()=>{
                            this._recorder.removeEventListener("start", e, !1),
                            t()
                        }
                        ;
                        this._recorder.addEventListener("start", e, !1)
                    }
                    );
                    return this._recorder.start(),
                    yield t
                }
                ))
            }
            stop() {
                return yi(this, void 0, void 0, (function*() {
                    ti("stopped" !== this.state, "Recorder is not started");
                    const t = new Promise(t=>{
                        const e = s=>{
                            this._recorder.removeEventListener("dataavailable", e, !1),
                            t(s.data)
                        }
                        ;
                        this._recorder.addEventListener("dataavailable", e, !1)
                    }
                    );
                    return this._recorder.stop(),
                    yield t
                }
                ))
            }
            pause() {
                return ti("started" === this.state, "Recorder must be started"),
                this._recorder.pause(),
                this
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this._stream.disconnect(),
                this
            }
        }
        class wc extends wo {
            constructor() {
                super(Di(wc.getDefaults(), arguments, ["threshold", "ratio"])),
                this.name = "Compressor",
                this._compressor = this.context.createDynamicsCompressor(),
                this.input = this._compressor,
                this.output = this._compressor;
                const t = Di(wc.getDefaults(), arguments, ["threshold", "ratio"]);
                this.threshold = new xo({
                    minValue: this._compressor.threshold.minValue,
                    maxValue: this._compressor.threshold.maxValue,
                    context: this.context,
                    convert: !1,
                    param: this._compressor.threshold,
                    units: "decibels",
                    value: t.threshold
                }),
                this.attack = new xo({
                    minValue: this._compressor.attack.minValue,
                    maxValue: this._compressor.attack.maxValue,
                    context: this.context,
                    param: this._compressor.attack,
                    units: "time",
                    value: t.attack
                }),
                this.release = new xo({
                    minValue: this._compressor.release.minValue,
                    maxValue: this._compressor.release.maxValue,
                    context: this.context,
                    param: this._compressor.release,
                    units: "time",
                    value: t.release
                }),
                this.knee = new xo({
                    minValue: this._compressor.knee.minValue,
                    maxValue: this._compressor.knee.maxValue,
                    context: this.context,
                    convert: !1,
                    param: this._compressor.knee,
                    units: "decibels",
                    value: t.knee
                }),
                this.ratio = new xo({
                    minValue: this._compressor.ratio.minValue,
                    maxValue: this._compressor.ratio.maxValue,
                    context: this.context,
                    convert: !1,
                    param: this._compressor.ratio,
                    units: "positive",
                    value: t.ratio
                }),
                Ui(this, ["knee", "release", "attack", "ratio", "threshold"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    attack: .003,
                    knee: 30,
                    ratio: 12,
                    release: .25,
                    threshold: -24
                })
            }
            get reduction() {
                return this._compressor.reduction
            }
            dispose() {
                return super.dispose(),
                this._compressor.disconnect(),
                this.attack.dispose(),
                this.release.dispose(),
                this.threshold.dispose(),
                this.ratio.dispose(),
                this.knee.dispose(),
                this
            }
        }
        class bc extends wo {
            constructor() {
                super(Object.assign(Di(bc.getDefaults(), arguments, ["threshold", "smoothing"]))),
                this.name = "Gate";
                const t = Di(bc.getDefaults(), arguments, ["threshold", "smoothing"]);
                this._follower = new Da({
                    context: this.context,
                    smoothing: t.smoothing
                }),
                this._gt = new Mr({
                    context: this.context,
                    value: eo(t.threshold)
                }),
                this.input = new ko({
                    context: this.context
                }),
                this._gate = this.output = new ko({
                    context: this.context
                }),
                this.input.connect(this._gate),
                this.input.chain(this._follower, this._gt, this._gate.gain)
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    smoothing: .1,
                    threshold: -40
                })
            }
            get threshold() {
                return so(this._gt.value)
            }
            set threshold(t) {
                this._gt.value = eo(t)
            }
            get smoothing() {
                return this._follower.smoothing
            }
            set smoothing(t) {
                this._follower.smoothing = t
            }
            dispose() {
                return super.dispose(),
                this.input.dispose(),
                this._follower.dispose(),
                this._gt.dispose(),
                this._gate.dispose(),
                this
            }
        }
        class Tc extends wo {
            constructor() {
                super(Object.assign(Di(Tc.getDefaults(), arguments, ["threshold"]))),
                this.name = "Limiter";
                const t = Di(Tc.getDefaults(), arguments, ["threshold"]);
                this._compressor = this.input = this.output = new wc({
                    context: this.context,
                    ratio: 20,
                    attack: .003,
                    release: .01,
                    threshold: t.threshold
                }),
                this.threshold = this._compressor.threshold,
                Ui(this, "threshold")
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    threshold: -12
                })
            }
            get reduction() {
                return this._compressor.reduction
            }
            dispose() {
                return super.dispose(),
                this._compressor.dispose(),
                this.threshold.dispose(),
                this
            }
        }
        class Sc extends wo {
            constructor() {
                super(Object.assign(Di(Sc.getDefaults(), arguments))),
                this.name = "MidSideCompressor";
                const t = Di(Sc.getDefaults(), arguments);
                this._midSideSplit = this.input = new ec({
                    context: this.context
                }),
                this._midSideMerge = this.output = new sc({
                    context: this.context
                }),
                this.mid = new wc(Object.assign(t.mid, {
                    context: this.context
                })),
                this.side = new wc(Object.assign(t.side, {
                    context: this.context
                })),
                this._midSideSplit.mid.chain(this.mid, this._midSideMerge.mid),
                this._midSideSplit.side.chain(this.side, this._midSideMerge.side),
                Ui(this, ["mid", "side"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    mid: {
                        ratio: 3,
                        threshold: -24,
                        release: .03,
                        attack: .02,
                        knee: 16
                    },
                    side: {
                        ratio: 6,
                        threshold: -30,
                        release: .25,
                        attack: .03,
                        knee: 10
                    }
                })
            }
            dispose() {
                return super.dispose(),
                this.mid.dispose(),
                this.side.dispose(),
                this._midSideSplit.dispose(),
                this._midSideMerge.dispose(),
                this
            }
        }
        class kc extends wo {
            constructor() {
                super(Object.assign(Di(kc.getDefaults(), arguments))),
                this.name = "MultibandCompressor";
                const t = Di(kc.getDefaults(), arguments);
                this._splitter = this.input = new gc({
                    context: this.context,
                    lowFrequency: t.lowFrequency,
                    highFrequency: t.highFrequency
                }),
                this.lowFrequency = this._splitter.lowFrequency,
                this.highFrequency = this._splitter.highFrequency,
                this.output = new ko({
                    context: this.context
                }),
                this.low = new wc(Object.assign(t.low, {
                    context: this.context
                })),
                this.mid = new wc(Object.assign(t.mid, {
                    context: this.context
                })),
                this.high = new wc(Object.assign(t.high, {
                    context: this.context
                })),
                this._splitter.low.chain(this.low, this.output),
                this._splitter.mid.chain(this.mid, this.output),
                this._splitter.high.chain(this.high, this.output),
                Ui(this, ["high", "mid", "low", "highFrequency", "lowFrequency"])
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    lowFrequency: 250,
                    highFrequency: 2e3,
                    low: {
                        ratio: 6,
                        threshold: -30,
                        release: .25,
                        attack: .03,
                        knee: 10
                    },
                    mid: {
                        ratio: 3,
                        threshold: -24,
                        release: .03,
                        attack: .02,
                        knee: 16
                    },
                    high: {
                        ratio: 3,
                        threshold: -24,
                        release: .03,
                        attack: .02,
                        knee: 16
                    }
                })
            }
            dispose() {
                return super.dispose(),
                this._splitter.dispose(),
                this.low.dispose(),
                this.mid.dispose(),
                this.high.dispose(),
                this.output.dispose(),
                this
            }
        }
        class Cc extends wo {
            constructor() {
                super(Di(Cc.getDefaults(), arguments, ["low", "mid", "high"])),
                this.name = "EQ3",
                this.output = new ko({
                    context: this.context
                }),
                this._internalChannels = [];
                const t = Di(Cc.getDefaults(), arguments, ["low", "mid", "high"]);
                this.input = this._multibandSplit = new gc({
                    context: this.context,
                    highFrequency: t.highFrequency,
                    lowFrequency: t.lowFrequency
                }),
                this._lowGain = new ko({
                    context: this.context,
                    gain: t.low,
                    units: "decibels"
                }),
                this._midGain = new ko({
                    context: this.context,
                    gain: t.mid,
                    units: "decibels"
                }),
                this._highGain = new ko({
                    context: this.context,
                    gain: t.high,
                    units: "decibels"
                }),
                this.low = this._lowGain.gain,
                this.mid = this._midGain.gain,
                this.high = this._highGain.gain,
                this.Q = this._multibandSplit.Q,
                this.lowFrequency = this._multibandSplit.lowFrequency,
                this.highFrequency = this._multibandSplit.highFrequency,
                this._multibandSplit.low.chain(this._lowGain, this.output),
                this._multibandSplit.mid.chain(this._midGain, this.output),
                this._multibandSplit.high.chain(this._highGain, this.output),
                Ui(this, ["low", "mid", "high", "lowFrequency", "highFrequency"]),
                this._internalChannels = [this._multibandSplit]
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    high: 0,
                    highFrequency: 2500,
                    low: 0,
                    lowFrequency: 400,
                    mid: 0
                })
            }
            dispose() {
                return super.dispose(),
                Qi(this, ["low", "mid", "high", "lowFrequency", "highFrequency"]),
                this._multibandSplit.dispose(),
                this.lowFrequency.dispose(),
                this.highFrequency.dispose(),
                this._lowGain.dispose(),
                this._midGain.dispose(),
                this._highGain.dispose(),
                this.low.dispose(),
                this.mid.dispose(),
                this.high.dispose(),
                this.Q.dispose(),
                this
            }
        }
        class Ac extends wo {
            constructor() {
                super(Di(Ac.getDefaults(), arguments, ["url", "onload"])),
                this.name = "Convolver",
                this._convolver = this.context.createConvolver();
                const t = Di(Ac.getDefaults(), arguments, ["url", "onload"]);
                this._buffer = new Xi(t.url,e=>{
                    this.buffer = e,
                    t.onload()
                }
                ),
                this.input = new ko({
                    context: this.context
                }),
                this.output = new ko({
                    context: this.context
                }),
                this._buffer.loaded && (this.buffer = this._buffer),
                this.normalize = t.normalize,
                this.input.chain(this._convolver, this.output)
            }
            static getDefaults() {
                return Object.assign(wo.getDefaults(), {
                    normalize: !0,
                    onload: Zi
                })
            }
            load(t) {
                return yi(this, void 0, void 0, (function*() {
                    this.buffer = yield this._buffer.load(t)
                }
                ))
            }
            get buffer() {
                return this._buffer.length ? this._buffer : null
            }
            set buffer(t) {
                t && this._buffer.set(t),
                this._convolver.buffer && (this.input.disconnect(),
                this._convolver.disconnect(),
                this._convolver = this.context.createConvolver(),
                this.input.chain(this._convolver, this.output));
                const e = this._buffer.get();
                this._convolver.buffer = e || null
            }
            get normalize() {
                return this._convolver.normalize
            }
            set normalize(t) {
                this._convolver.normalize = t
            }
            dispose() {
                return super.dispose(),
                this._buffer.dispose(),
                this._convolver.disconnect(),
                this
            }
        }
        function Dc() {
            return Ji().now()
        }
        function Oc() {
            return Ji().immediate()
        }
        const Mc = Ji().transport;
        function Ec() {
            return Ji().transport
        }
        const Rc = Ji().destination
          , qc = Ji().destination;
        function Fc() {
            return Ji().destination
        }
        const Ic = Ji().listener;
        function Vc() {
            return Ji().listener
        }
        const Nc = Ji().draw;
        function Pc() {
            return Ji().draw
        }
        const jc = Ji();
        function Lc() {
            return Xi.loaded()
        }
        const zc = Xi
          , Bc = Vo
          , Wc = $o
    }
    ])
}
));
//# sourceMappingURL=Tone.js.map

