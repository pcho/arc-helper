"use strict";
var ge = Object.create;
var F = Object.defineProperty;
var be = Object.getOwnPropertyDescriptor;
var $e = Object.getOwnPropertyNames;
var ye = Object.getPrototypeOf,
	we = Object.prototype.hasOwnProperty;
var ke = (e, n) => {
		for (var t in n) F(e, t, { get: n[t], enumerable: !0 });
	},
	X = (e, n, t, r) => {
		if ((n && typeof n == "object") || typeof n == "function")
			for (let i of $e(n))
				!we.call(e, i) &&
					i !== t &&
					F(e, i, {
						get: () => n[i],
						enumerable: !(r = be(n, i)) || r.enumerable,
					});
		return e;
	};
var j = (e, n, t) => (
		(t = e != null ? ge(ye(e)) : {}),
		X(
			n || !e || !e.__esModule
				? F(t, "default", { value: e, enumerable: !0 })
				: t,
			e
		)
	),
	xe = (e) => X(F({}, "__esModule", { value: !0 }), e);
var Fe = {};
ke(Fe, { default: () => he });
module.exports = xe(Fe);
var s = require("@raycast/api");
var f = j(require("react")),
	m = require("@raycast/api");
var ee = Object.prototype.hasOwnProperty;
function B(e, n) {
	var t, r;
	if (e === n) return !0;
	if (e && n && (t = e.constructor) === n.constructor) {
		if (t === Date) return e.getTime() === n.getTime();
		if (t === RegExp) return e.toString() === n.toString();
		if (t === Array) {
			if ((r = e.length) === n.length) for (; r-- && B(e[r], n[r]); );
			return r === -1;
		}
		if (!t || typeof e == "object") {
			r = 0;
			for (t in e)
				if (
					(ee.call(e, t) && ++r && !ee.call(n, t)) ||
					!(t in n) ||
					!B(e[t], n[t])
				)
					return !1;
			return Object.keys(n).length === r;
		}
	}
	return e !== e && n !== n;
}
var D = j(require("node:fs")),
	K = j(require("node:path")),
	ae = j(require("node:crypto"));
var se = require("react/jsx-runtime");
function ve(e) {
	let n = (0, f.useRef)(e),
		t = (0, f.useRef)(0);
	return (
		B(e, n.current) || ((n.current = e), (t.current += 1)),
		(0, f.useMemo)(() => n.current, [t.current])
	);
}
function E(e) {
	let n = (0, f.useRef)(e);
	return ((n.current = e), n);
}
function Se(e, n) {
	let t = e instanceof Error ? e.message : String(e);
	return (0, m.showToast)({
		style: m.Toast.Style.Failure,
		title: n?.title ?? "Something went wrong",
		message: n?.message ?? t,
		primaryAction: n?.primaryAction ?? te(e),
		secondaryAction: n?.primaryAction ? te(e) : void 0,
	});
}
var te = (e) => {
	let n = !0,
		t = "[Extension Name]...",
		r = "";
	try {
		let o = JSON.parse(
			(0, D.readFileSync)(
				(0, K.join)(m.environment.assetsPath, "..", "package.json"),
				"utf8"
			)
		);
		((t = `[${o.title}]...`),
			(r = `https://raycast.com/${o.owner || o.author}/${o.name}`),
			(!o.owner || o.access === "public") && (n = !1));
	} catch {}
	let i = m.environment.isDevelopment || n,
		c = e instanceof Error ? e?.stack || e?.message || "" : String(e);
	return {
		title: i ? "Copy Logs" : "Report Error",
		onAction(o) {
			(o.hide(),
				i
					? m.Clipboard.copy(c)
					: (0, m.open)(
							`https://github.com/raycast/extensions/issues/new?&labels=extension%2Cbug&template=extension_bug_report.yml&title=${encodeURIComponent(t)}&extension-url=${encodeURI(r)}&description=${encodeURIComponent(`#### Error:
\`\`\`
${c}
\`\`\`
`)}`
						));
		},
	};
};
function Ee(e, n, t) {
	let r = (0, f.useRef)(0),
		[i, c] = (0, f.useState)({ isLoading: !0 }),
		o = E(e),
		u = E(t?.abortable),
		l = E(n || []),
		$ = E(t?.onError),
		g = E(t?.onData),
		y = E(t?.onWillExecute),
		x = E(t?.failureToastOptions),
		v = E(i.data),
		w = (0, f.useRef)(null),
		a = (0, f.useRef)({ page: 0 }),
		p = (0, f.useRef)(!1),
		S = (0, f.useRef)(!0),
		T = (0, f.useRef)(50),
		k = (0, f.useCallback)(
			() => (
				u.current &&
					(u.current.current?.abort(),
					(u.current.current = new AbortController())),
				++r.current
			),
			[u]
		),
		b = (0, f.useCallback)(
			(...U) => {
				let A = k();
				(y.current?.(U), c((h) => ({ ...h, isLoading: !0 })));
				let O = Te(o.current)(...U);
				function L(h) {
					return (
						h.name == "AbortError" ||
							(A === r.current &&
								($.current
									? $.current(h)
									: m.environment.launchType !== m.LaunchType.Background &&
										Se(h, {
											title: "Failed to fetch latest data",
											primaryAction: {
												title: "Retry",
												onAction(I) {
													(I.hide(), w.current?.(...(l.current || [])));
												},
											},
											...x.current,
										}),
								c({ error: h, isLoading: !1 }))),
						h
					);
				}
				return typeof O == "function"
					? ((p.current = !0),
						O(a.current).then(
							({ data: h, hasMore: I, cursor: pe }) => (
								A === r.current &&
									(a.current &&
										((a.current.cursor = pe),
										(a.current.lastItem = h?.[h.length - 1])),
									g.current && g.current(h, a.current),
									I && (T.current = h.length),
									(S.current = I),
									c((me) =>
										a.current.page === 0
											? { data: h, isLoading: !1 }
											: { data: (me.data || [])?.concat(h), isLoading: !1 }
									)),
								h
							),
							(h) => ((S.current = !1), L(h))
						))
					: ((p.current = !1),
						O.then(
							(h) => (
								A === r.current &&
									(g.current && g.current(h), c({ data: h, isLoading: !1 })),
								h
							),
							L
						));
			},
			[g, $, l, o, c, w, y, a, x, k]
		);
	w.current = b;
	let R = (0, f.useCallback)(() => {
			a.current = { page: 0 };
			let U = l.current || [];
			return b(...U);
		}, [b, l]),
		_ = (0, f.useCallback)(
			async (U, A) => {
				let O;
				try {
					if (A?.optimisticUpdate) {
						(k(),
							typeof A?.rollbackOnError != "function" &&
								A?.rollbackOnError !== !1 &&
								(O = structuredClone(v.current?.value)));
						let L = A.optimisticUpdate;
						c((h) => ({ ...h, data: L(h.data) }));
					}
					return await U;
				} catch (L) {
					if (typeof A?.rollbackOnError == "function") {
						let h = A.rollbackOnError;
						c((I) => ({ ...I, data: h(I.data) }));
					} else
						A?.optimisticUpdate &&
							A?.rollbackOnError !== !1 &&
							c((h) => ({ ...h, data: O }));
					throw L;
				} finally {
					A?.shouldRevalidateAfter !== !1 &&
						(m.environment.launchType === m.LaunchType.Background ||
						m.environment.commandMode === "menu-bar"
							? await R()
							: R());
				}
			},
			[R, v, c, k]
		),
		P = (0, f.useCallback)(() => {
			a.current.page += 1;
			let U = l.current || [];
			b(...U);
		}, [a, l, b]);
	((0, f.useEffect)(() => {
		((a.current = { page: 0 }), t?.execute !== !1 ? b(...(n || [])) : k());
	}, [ve([n, t?.execute, b]), u, a]),
		(0, f.useEffect)(
			() => () => {
				k();
			},
			[k]
		));
	let W = t?.execute !== !1 ? i.isLoading : !1,
		V = { ...i, isLoading: W },
		N = p.current
			? { pageSize: T.current, hasMore: S.current, onLoadMore: P }
			: void 0;
	return { ...V, revalidate: R, mutate: _, pagination: N };
}
function Te(e) {
	return e === Promise.all ||
		e === Promise.race ||
		e === Promise.resolve ||
		e === Promise.reject
		? e.bind(Promise)
		: e;
}
function re(e) {
	return typeof e != "function"
		? !1
		: /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(
				Function.prototype.toString.call(e)
			) !== null;
}
function Ae(e) {
	return e instanceof URLSearchParams ? e.toString() : e;
}
function ie(e, n = []) {
	function t(r) {
		return "update" in e ? e.update(r, "utf8") : e.write(r);
	}
	return {
		dispatch: function (r) {
			((r = Ae(r)), r === null ? this._null() : this["_" + typeof r](r));
		},
		_object: function (r) {
			let i = /\[object (.*)\]/i,
				c = Object.prototype.toString.call(r),
				o = i.exec(c)?.[1] ?? "unknown:[" + c + "]";
			o = o.toLowerCase();
			let u = null;
			if ((u = n.indexOf(r)) >= 0) {
				this.dispatch("[CIRCULAR:" + u + "]");
				return;
			} else n.push(r);
			if (Buffer.isBuffer(r)) return (t("buffer:"), t(r.toString("utf8")));
			if (o !== "object" && o !== "function" && o !== "asyncfunction")
				if (this["_" + o]) this["_" + o](r);
				else throw new Error('Unknown object type "' + o + '"');
			else {
				let l = Object.keys(r);
				((l = l.sort()),
					re(r) || l.splice(0, 0, "prototype", "__proto__", "constructor"),
					t("object:" + l.length + ":"));
				let $ = this;
				return l.forEach(function (g) {
					($.dispatch(g), t(":"), $.dispatch(r[g]), t(","));
				});
			}
		},
		_array: function (r, i) {
			i = typeof i < "u" ? i : !1;
			let c = this;
			if ((t("array:" + r.length + ":"), !i || r.length <= 1)) {
				r.forEach(function (l) {
					c.dispatch(l);
				});
				return;
			}
			let o = [],
				u = r.map(function (l) {
					let $ = Re(),
						g = n.slice();
					return (
						ie($, g).dispatch(l),
						(o = o.concat(g.slice(n.length))),
						$.read().toString()
					);
				});
			((n = n.concat(o)), u.sort(), this._array(u, !1));
		},
		_date: function (r) {
			t("date:" + r.toJSON());
		},
		_symbol: function (r) {
			t("symbol:" + r.toString());
		},
		_error: function (r) {
			t("error:" + r.toString());
		},
		_boolean: function (r) {
			t("bool:" + r.toString());
		},
		_string: function (r) {
			(t("string:" + r.length + ":"), t(r.toString()));
		},
		_function: function (r) {
			(t("fn:"),
				re(r) ? this.dispatch("[native]") : this.dispatch(r.toString()),
				this.dispatch("function-name:" + String(r.name)),
				this._object(r));
		},
		_number: function (r) {
			t("number:" + r.toString());
		},
		_xml: function (r) {
			t("xml:" + r.toString());
		},
		_null: function () {
			t("Null");
		},
		_undefined: function () {
			t("Undefined");
		},
		_regexp: function (r) {
			t("regex:" + r.toString());
		},
		_uint8array: function (r) {
			(t("uint8array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_uint8clampedarray: function (r) {
			(t("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_int8array: function (r) {
			(t("int8array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_uint16array: function (r) {
			(t("uint16array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_int16array: function (r) {
			(t("int16array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_uint32array: function (r) {
			(t("uint32array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_int32array: function (r) {
			(t("int32array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_float32array: function (r) {
			(t("float32array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_float64array: function (r) {
			(t("float64array:"), this.dispatch(Array.prototype.slice.call(r)));
		},
		_arraybuffer: function (r) {
			(t("arraybuffer:"), this.dispatch(new Uint8Array(r)));
		},
		_url: function (r) {
			t("url:" + r.toString());
		},
		_map: function (r) {
			t("map:");
			let i = Array.from(r);
			this._array(i, !0);
		},
		_set: function (r) {
			t("set:");
			let i = Array.from(r);
			this._array(i, !0);
		},
		_file: function (r) {
			(t("file:"), this.dispatch([r.name, r.size, r.type, r.lastModified]));
		},
		_blob: function () {
			throw Error(`Hashing Blob objects is currently not supported
(see https://github.com/puleos/object-hash/issues/26)
Use "options.replacer" or "options.ignoreUnknown"
`);
		},
		_domwindow: function () {
			t("domwindow");
		},
		_bigint: function (r) {
			t("bigint:" + r.toString());
		},
		_process: function () {
			t("process");
		},
		_timer: function () {
			t("timer");
		},
		_pipe: function () {
			t("pipe");
		},
		_tcp: function () {
			t("tcp");
		},
		_udp: function () {
			t("udp");
		},
		_tty: function () {
			t("tty");
		},
		_statwatcher: function () {
			t("statwatcher");
		},
		_securecontext: function () {
			t("securecontext");
		},
		_connection: function () {
			t("connection");
		},
		_zlib: function () {
			t("zlib");
		},
		_context: function () {
			t("context");
		},
		_nodescript: function () {
			t("nodescript");
		},
		_httpparser: function () {
			t("httpparser");
		},
		_dataview: function () {
			t("dataview");
		},
		_signal: function () {
			t("signal");
		},
		_fsevent: function () {
			t("fsevent");
		},
		_tlswrap: function () {
			t("tlswrap");
		},
	};
}
function Re() {
	return {
		buf: "",
		write: function (e) {
			this.buf += e;
		},
		end: function (e) {
			this.buf += e;
		},
		read: function () {
			return this.buf;
		},
	};
}
function _e(e, n) {
	let t = this[e];
	return t instanceof Date
		? `__raycast_cached_date__${t.toISOString()}`
		: Buffer.isBuffer(t)
			? `__raycast_cached_buffer__${t.toString("base64")}`
			: n;
}
function Ce(e, n) {
	return typeof n == "string" && n.startsWith("__raycast_cached_date__")
		? new Date(n.replace("__raycast_cached_date__", ""))
		: typeof n == "string" && n.startsWith("__raycast_cached_buffer__")
			? Buffer.from(n.replace("__raycast_cached_buffer__", ""), "base64")
			: n;
}
function G(e) {
	let n = ae.default.createHash("sha1");
	return (ie(n).dispatch(e), n.digest("hex"));
}
var Pe = Symbol("cache without namespace"),
	ne = new Map();
function Ue(e, n, t) {
	let r = t?.cacheNamespace || Pe,
		i =
			ne.get(r) ||
			ne.set(r, new m.Cache({ namespace: t?.cacheNamespace })).get(r);
	if (!i) throw new Error("Missing cache");
	let c = E(e),
		o = E(n),
		u = (0, f.useSyncExternalStore)(i.subscribe, () => {
			try {
				return i.get(c.current);
			} catch (y) {
				console.error("Could not get Cache data:", y);
				return;
			}
		}),
		l = (0, f.useMemo)(() => {
			if (typeof u < "u") {
				if (u === "undefined") return;
				try {
					return JSON.parse(u, Ce);
				} catch (y) {
					return (console.warn("The cached data is corrupted", y), o.current);
				}
			} else return o.current;
		}, [u, o]),
		$ = E(l),
		g = (0, f.useCallback)(
			(y) => {
				let x = typeof y == "function" ? y($.current) : y;
				if (typeof x > "u") i.set(c.current, "undefined");
				else {
					let v = JSON.stringify(x, _e);
					i.set(c.current, v);
				}
				return x;
			},
			[i, c, $]
		);
	return [l, g];
}
var M = Symbol();
function Ie(e, n, t) {
	let {
			initialData: r,
			keepPreviousData: i,
			internal_cacheKeySuffix: c,
			...o
		} = t || {},
		u = (0, f.useRef)(null),
		[l, $] = Ue(G(n || []) + c, M, { cacheNamespace: G(e) }),
		g = (0, f.useRef)(l !== M ? l : r),
		y = (0, f.useRef)(void 0),
		{
			mutate: x,
			revalidate: v,
			...w
		} = Ee(e, n || [], {
			...o,
			onData(k, b) {
				((y.current = b),
					o.onData && o.onData(k, b),
					!(b && b.page > 0) &&
						((u.current = "promise"), (g.current = k), $(k)));
			},
		}),
		a,
		p = w.pagination;
	y.current && y.current.page > 0 && w.data
		? (a = w.data)
		: u.current === "promise"
			? (a = g.current)
			: i && l !== M
				? ((a = l), p && ((p.hasMore = !0), (p.pageSize = l.length)))
				: i && l === M
					? (a = g.current)
					: l !== M
						? ((a = l), p && ((p.hasMore = !0), (p.pageSize = l.length)))
						: (a = r);
	let S = E(a),
		T = (0, f.useCallback)(
			async (k, b) => {
				let R;
				try {
					if (b?.optimisticUpdate) {
						typeof b?.rollbackOnError != "function" &&
							b?.rollbackOnError !== !1 &&
							(R = structuredClone(S.current));
						let _ = b.optimisticUpdate(S.current);
						((u.current = "cache"), (g.current = _), $(_));
					}
					return await x(k, {
						shouldRevalidateAfter: b?.shouldRevalidateAfter,
					});
				} catch (_) {
					if (typeof b?.rollbackOnError == "function") {
						let P = b.rollbackOnError(S.current);
						((u.current = "cache"), (g.current = P), $(P));
					} else
						b?.optimisticUpdate &&
							b?.rollbackOnError !== !1 &&
							((u.current = "cache"), (g.current = R), $(R));
					throw _;
				}
			},
			[$, x, S, g, u]
		);
	return (
		(0, f.useEffect)(() => {
			l !== M && ((u.current = "cache"), (g.current = l));
		}, [l]),
		{
			data: a,
			isLoading: w.isLoading,
			error: w.error,
			mutate: y.current && y.current.page > 0 ? x : T,
			pagination: p,
			revalidate: v,
		}
	);
}
function De(e) {
	if (e) {
		let n = Le(e);
		if (!n) return !1;
		if (
			n.subtype === "json" ||
			n.suffix === "json" ||
			(n.suffix && /\bjson\b/i.test(n.suffix)) ||
			(n.subtype && /\bjson\b/i.test(n.subtype))
		)
			return !0;
	}
	return !1;
}
var Oe =
	/^([A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126})\/([A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126});?$/;
function Le(e) {
	let n = e.indexOf(";"),
		t = n !== -1 ? e.slice(0, n).trim() : e.trim(),
		r = Oe.exec(t.toLowerCase().toLowerCase());
	if (!r) return;
	let i = r[1],
		c = r[2],
		o,
		u = c.lastIndexOf("+");
	return (
		u !== -1 && ((o = c.substring(u + 1)), (c = c.substring(0, u))),
		{ type: i, subtype: c, suffix: o }
	);
}
async function Me(e) {
	if (!e.ok) throw new Error(e.statusText);
	let n = e.headers.get("content-type");
	return n && De(n) ? await e.json() : await e.text();
}
function We(e) {
	return { data: e, hasMore: !1 };
}
function oe(e, n) {
	let {
			parseResponse: t,
			mapResult: r,
			initialData: i,
			execute: c,
			keepPreviousData: o,
			onError: u,
			onData: l,
			onWillExecute: $,
			failureToastOptions: g,
			...y
		} = n || {},
		x = {
			initialData: i,
			execute: c,
			keepPreviousData: o,
			onError: u,
			onData: l,
			onWillExecute: $,
			failureToastOptions: g,
		},
		v = E(t || Me),
		w = E(r || We),
		a = (0, f.useRef)(null),
		p = (0, f.useRef)(null),
		S = typeof e == "function" ? e({ page: 0 }) : void 0;
	((!a.current || typeof p.current > "u" || p.current !== S) && (a.current = e),
		(p.current = S));
	let T = (0, f.useRef)(null),
		k = (0, f.useCallback)(
			(_, P) => async (W) => {
				let V = await fetch(_(W), { signal: T.current?.signal, ...P }),
					N = await v.current(V);
				return w.current?.(N);
			},
			[v, w]
		),
		b = (0, f.useCallback)(
			async (_, P) => {
				let W = await fetch(_, { signal: T.current?.signal, ...P }),
					V = await v.current(W);
				return w.current(V)?.data;
			},
			[v, w]
		),
		R = (0, f.useMemo)(() => (p.current ? k : b), [p, b, k]);
	return Ie(R, [a.current, y], {
		...x,
		internal_cacheKeySuffix: p.current + G(w.current) + G(v.current),
		abortable: T,
	});
}
var C = require("react");
var z = "https://metaforge.app/api/arc-raiders",
	ce = {
		items: `${z}/items`,
		arcs: `${z}/arcs`,
		quests: `${z}/quests`,
		eventTimers: `${z}/events-schedule`,
		traders: `${z}/traders`,
	};
var le = require("@raycast/api"),
	H = new le.Cache(),
	Ve = 3600 * 1e3;
function ue(e) {
	let n = H.get(e);
	if (!n) return null;
	try {
		let t = JSON.parse(n);
		return Date.now() - t.timestamp > Ve ? (H.remove(e), null) : t.data;
	} catch {
		return (H.remove(e), null);
	}
}
function fe(e, n) {
	let t = { data: n, timestamp: Date.now() };
	H.set(e, JSON.stringify(t));
}
var Y = {
	items: (e, n, t) => {
		let r = ["items", `page:${e}`];
		return (
			n && r.push(`search:${n}`),
			t && t !== "all" && r.push(`type:${t}`),
			r.join(":")
		);
	},
	arcs: "arcs",
	quests: (e) => `quests:page:${e}`,
	traders: "traders",
	eventTimers: "events-schedule",
};
var d = require("react/jsx-runtime");
function Ne(e) {
	let n = Date.now(),
		t = new Date(e.startTime),
		r = new Date(e.endTime),
		i,
		c;
	if (n >= e.startTime && n < e.endTime) ((i = "active"), (c = 0));
	else if (n < e.startTime) {
		let o = Math.floor((e.startTime - n) / 6e4);
		((c = o), (i = o <= 60 ? "upcoming" : "later"));
	} else ((i = "later"), (c = 9999));
	return { ...e, status: i, startDate: t, endDate: r, minutesUntil: c };
}
function q(e) {
	if (e === null) return "Unknown";
	if (e === 0) return "Active now!";
	if (e < 60) return `${e}m`;
	let n = Math.floor(e / 60),
		t = e % 60;
	return t > 0 ? `${n}h ${t}m` : `${n}h`;
}
function de(e) {
	return e.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
		hour12: !1,
	});
}
function Z(e) {
	return e.toLocaleString([], {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hour12: !1,
	});
}
function Q({ event: e }) {
	let n = `
# ${e.name}

![Icon](${e.icon})

**Map:** ${e.map}

---

## Event Time

| Start | End |
|-------|-----|
| ${Z(e.startDate)} | ${Z(e.endDate)} |

---

**Status:** ${e.status === "active" ? "ACTIVE NOW" : e.status === "upcoming" ? "Starting soon" : "Later"}

${e.minutesUntil > 0 ? `**Starts in:** ${q(e.minutesUntil)}` : ""}
`;
	return (0, d.jsx)(s.Detail, {
		markdown: n,
		metadata: (0, d.jsxs)(s.Detail.Metadata, {
			children: [
				(0, d.jsx)(s.Detail.Metadata.Label, { title: "Map", text: e.map }),
				(0, d.jsx)(s.Detail.Metadata.TagList, {
					title: "Status",
					children: (0, d.jsx)(s.Detail.Metadata.TagList.Item, {
						text:
							e.status === "active"
								? "Active"
								: e.status === "upcoming"
									? "Soon"
									: "Later",
						color:
							e.status === "active"
								? s.Color.Green
								: e.status === "upcoming"
									? s.Color.Yellow
									: s.Color.SecondaryText,
					}),
				}),
				(0, d.jsx)(s.Detail.Metadata.Label, {
					title: "Starts In",
					text: q(e.minutesUntil),
				}),
				(0, d.jsx)(s.Detail.Metadata.Separator, {}),
				(0, d.jsx)(s.Detail.Metadata.Label, {
					title: "Start",
					text: Z(e.startDate),
				}),
				(0, d.jsx)(s.Detail.Metadata.Label, {
					title: "End",
					text: Z(e.endDate),
				}),
			],
		}),
		actions: (0, d.jsx)(s.ActionPanel, {
			children: (0, d.jsx)(s.Action.CopyToClipboard, {
				title: "Copy Event Name",
				content: e.name,
			}),
		}),
	});
}
function he() {
	let [e, n] = (0, C.useState)("all"),
		[t, r] = (0, C.useState)(0),
		i = ue(Y.eventTimers),
		{
			isLoading: c,
			data: o,
			revalidate: u,
		} = oe(ce.eventTimers, {
			keepPreviousData: !0,
			onError() {
				(0, s.showToast)({
					style: s.Toast.Style.Failure,
					title: "Failed to load events",
					message: "Server temporarily unavailable. Please try again.",
				});
			},
		});
	((0, C.useEffect)(() => {
		o?.data && o.data.length > 0 && fe(Y.eventTimers, o.data);
	}, [o]),
		(0, C.useEffect)(() => {
			let a = setInterval(() => r((p) => p + 1), 6e4);
			return () => clearInterval(a);
		}, []));
	let l = o?.data || i || [],
		$ = l,
		g = [...new Set(l.map((a) => a.map))].sort(),
		y = (0, C.useMemo)(() => {
			let a = Date.now();
			return $.filter((p) => p.endTime > a)
				.map(Ne)
				.filter((p) => e === "all" || p.map === e)
				.sort((p, S) => {
					let T = { active: 0, upcoming: 1, later: 2 };
					return T[p.status] !== T[S.status]
						? T[p.status] - T[S.status]
						: p.startTime - S.startTime;
				});
		}, [$, e, t]),
		x = y.filter((a) => a.status === "active"),
		v = y.filter((a) => a.status === "upcoming"),
		w = y.filter((a) => a.status === "later");
	return (0, d.jsxs)(s.List, {
		isLoading: c,
		searchBarPlaceholder: "Search events...",
		searchBarAccessory: (0, d.jsxs)(s.List.Dropdown, {
			tooltip: "Filter by Map",
			value: e,
			onChange: n,
			children: [
				(0, d.jsx)(s.List.Dropdown.Item, { title: "All Maps", value: "all" }),
				(0, d.jsx)(s.List.Dropdown.Section, {
					title: "Maps",
					children: g.map((a) =>
						(0, d.jsx)(s.List.Dropdown.Item, { title: a, value: a }, a)
					),
				}),
			],
		}),
		actions: (0, d.jsx)(s.ActionPanel, {
			children: (0, d.jsx)(s.Action, {
				title: "Refresh",
				icon: s.Icon.ArrowClockwise,
				onAction: () => u(),
				shortcut: {
					macOS: { modifiers: ["cmd"], key: "r" },
					Windows: { modifiers: ["ctrl"], key: "r" },
				},
			}),
		}),
		children: [
			x.length > 0 &&
				(0, d.jsx)(s.List.Section, {
					title: "Active Now",
					children: x.map((a) =>
						(0, d.jsx)(
							s.List.Item,
							{
								icon: { source: a.icon, fallback: s.Icon.Clock },
								title: a.name,
								subtitle: a.map,
								accessories: [
									{ tag: { value: "ACTIVE", color: s.Color.Green } },
								],
								actions: (0, d.jsxs)(s.ActionPanel, {
									children: [
										(0, d.jsx)(s.Action.Push, {
											title: "View Details",
											icon: s.Icon.Eye,
											target: (0, d.jsx)(Q, { event: a }),
										}),
										(0, d.jsx)(s.Action, {
											title: "Refresh",
											icon: s.Icon.ArrowClockwise,
											onAction: () => u(),
											shortcut: {
												macOS: { modifiers: ["cmd"], key: "r" },
												Windows: { modifiers: ["ctrl"], key: "r" },
											},
										}),
									],
								}),
							},
							`${a.name}-${a.map}-${a.startTime}`
						)
					),
				}),
			v.length > 0 &&
				(0, d.jsx)(s.List.Section, {
					title: "Starting Soon",
					children: v.map((a) =>
						(0, d.jsx)(
							s.List.Item,
							{
								icon: { source: a.icon, fallback: s.Icon.Clock },
								title: a.name,
								subtitle: a.map,
								accessories: [
									{ text: de(a.startDate) },
									{ tag: { value: q(a.minutesUntil), color: s.Color.Yellow } },
								],
								actions: (0, d.jsxs)(s.ActionPanel, {
									children: [
										(0, d.jsx)(s.Action.Push, {
											title: "View Details",
											icon: s.Icon.Eye,
											target: (0, d.jsx)(Q, { event: a }),
										}),
										(0, d.jsx)(s.Action, {
											title: "Refresh",
											icon: s.Icon.ArrowClockwise,
											onAction: () => u(),
											shortcut: {
												macOS: { modifiers: ["cmd"], key: "r" },
												Windows: { modifiers: ["ctrl"], key: "r" },
											},
										}),
									],
								}),
							},
							`${a.name}-${a.map}-${a.startTime}`
						)
					),
				}),
			w.length > 0 &&
				(0, d.jsx)(s.List.Section, {
					title: "Later",
					children: w.map((a) =>
						(0, d.jsx)(
							s.List.Item,
							{
								icon: { source: a.icon, fallback: s.Icon.Clock },
								title: a.name,
								subtitle: a.map,
								accessories: [
									{ text: de(a.startDate) },
									{ text: q(a.minutesUntil) },
								],
								actions: (0, d.jsxs)(s.ActionPanel, {
									children: [
										(0, d.jsx)(s.Action.Push, {
											title: "View Details",
											icon: s.Icon.Eye,
											target: (0, d.jsx)(Q, { event: a }),
										}),
										(0, d.jsx)(s.Action, {
											title: "Refresh",
											icon: s.Icon.ArrowClockwise,
											onAction: () => u(),
											shortcut: {
												macOS: { modifiers: ["cmd"], key: "r" },
												Windows: { modifiers: ["ctrl"], key: "r" },
											},
										}),
									],
								}),
							},
							`${a.name}-${a.map}-${a.startTime}`
						)
					),
				}),
		],
	});
}
