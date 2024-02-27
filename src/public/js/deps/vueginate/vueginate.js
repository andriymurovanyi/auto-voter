var G = Object.defineProperty;
var R = (e, i, n) => i in e ? G(e, i, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[i] = n;
var E = (e, i, n) => (R(e, typeof i != "symbol" ? i + "" : i, n), n);
import { computed as y, warn as U, openBlock as d, createElementBlock as p, createElementVNode as r, defineComponent as T, toRefs as Y, unref as s, createBlock as q, resolveDynamicComponent as H, normalizeClass as c, withCtx as b, renderSlot as S, withModifiers as P, createVNode as w, Fragment as O, renderList as J, toDisplayString as $, createCommentVNode as K } from "../vue";
var B = /* @__PURE__ */ ((e) => (e.Page = "page", e.Ellipsis = "ellipsis", e.Current = "current", e))(B || {});
class Q {
  constructor(i, n) {
    E(this, "number");
    E(this, "type");
    this.number = n === "ellipsis" ? 0 : i, this.type = n;
  }
  isCurrent() {
    return this.type === "current";
  }
  isEllipsis() {
    return this.type === "ellipsis";
  }
  isPage() {
    return this.type === "page";
  }
}
Math.trunc = Math.trunc || function(e) {
  return e < 0 ? Math.ceil(e) : Math.floor(e);
};
function W(e, i, n, g, a) {
  const t = y(() => Math.trunc(g.value)), u = y(() => {
    const l = Math.trunc(i.value), h = Math.trunc(n.value), C = Math.trunc(l / h);
    return l % h === 0 ? C : C + 1;
  }), o = y(() => {
    const l = Math.trunc(e.value);
    return l < 1 ? 1 : l > u.value ? (U("`currentPage` should not be greater than the total number of pages"), u.value) : l;
  }), _ = y(() => o.value <= 1), k = y(() => o.value >= u.value), V = y(() => k.value ? o.value : o.value + 1), N = y(
    () => _.value ? o.value : o.value - 1
  ), I = y(() => {
    if (!a.value)
      return t.value;
    const l = 1 + t.value + 2 - o.value;
    return l <= 0 ? t.value : t.value + l;
  }), f = y(() => {
    if (!a.value)
      return t.value;
    const l = o.value - (u.value - t.value - 2);
    return l <= 0 ? t.value : t.value + l;
  }), v = y(() => {
    const l = [];
    for (let h = 1; h <= u.value; h++) {
      const C = new Q(h, x(h));
      if (C.isEllipsis()) {
        const F = h < o.value ? o.value - (f.value + 1) : u.value - 1;
        h < F && (h = F);
      }
      l.push(C);
    }
    return l;
  });
  function x(l) {
    return m(l) ? B.Current : j(l) ? B.Ellipsis : B.Page;
  }
  function m(l) {
    return l === o.value;
  }
  function j(l) {
    if (t.value < 0)
      return !1;
    if (l < o.value) {
      const C = o.value - f.value;
      return l > 1 && l < C - 1;
    }
    const h = o.value + I.value;
    return l < u.value - 1 && l > h;
  }
  return {
    totalPages: u,
    currentPage: o,
    isFirstPage: _,
    previousPage: N,
    pages: v,
    isLastPage: k,
    nextPage: V
  };
}
const z = Object.freeze({
  container: ["vueginate-container"],
  item: ["vg-item"],
  page: ["vg-page"],
  arrow: ["vg-arrow"],
  active: ["vg-active"],
  disabled: ["vg-disabled"],
  readers: ["sr-only"]
});
function X(e, i) {
  function n(u) {
    const o = u;
    return i.value === !1 ? [] : typeof i.value == "object" ? i.value[o] ?? z[o] ?? [] : z[o] ?? [];
  }
  function g(u) {
    return e.value[u] ?? [];
  }
  function a(u) {
    const o = [];
    return o.push(...n(u)), o.push(...g(u)), o;
  }
  return y(() => ({
    container: a("container"),
    item: a("item"),
    page: a("page"),
    arrow: a("arrow"),
    active: a("active"),
    disabled: a("disabled"),
    readers: a("readers")
  }));
}
const D = (e, i) => {
  const n = e.__vccOpts || e;
  for (const [g, a] of i)
    n[g] = a;
  return n;
}, Z = {}, ee = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, te = /* @__PURE__ */ r("path", {
  "fill-rule": "evenodd",
  d: "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z",
  "clip-rule": "evenodd"
}, null, -1), ae = [
  te
];
function se(e, i) {
  return d(), p("svg", ee, ae);
}
const L = /* @__PURE__ */ D(Z, [["render", se]]), re = {}, ne = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, ie = /* @__PURE__ */ r("path", {
  "fill-rule": "evenodd",
  d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z",
  "clip-rule": "evenodd"
}, null, -1), le = [
  ie
];
function oe(e, i) {
  return d(), p("svg", ne, le);
}
const M = /* @__PURE__ */ D(re, [["render", oe]]), ue = {
  key: 0,
  "aria-label": "Page navigation"
}, ce = ["onClick"], A = /* @__PURE__ */ T({
  __name: "VueginateCore",
  props: {
    totalItems: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e >= 0;
      }
    },
    currentPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    itemsPerPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    pagesToShow: {
      type: Number,
      default: 2,
      validator(e) {
        return Number.isInteger(e) && e >= -1;
      }
    },
    visibleAlways: {
      type: Boolean
    },
    withDefaultStyles: {
      type: [Object, Boolean],
      default: () => !0
    },
    customStyles: {
      type: Object,
      default: () => ({})
    },
    fixedLength: {
      type: Boolean,
      default: !0
    },
    containerType: {
      type: String,
      default: "ul",
      validator(e) {
        return ["ul", "div"].includes(e);
      }
    }
  },
  emits: ["page-change"],
  setup(e, { emit: i }) {
    const n = e, g = Y(n), a = X(g.customStyles, g.withDefaultStyles), t = y(() => n.visibleAlways || u.value > 1), { totalPages: u, currentPage: o, isFirstPage: _, previousPage: k, pages: V, isLastPage: N, nextPage: I } = W(
      g.currentPage,
      g.totalItems,
      g.itemsPerPage,
      g.pagesToShow,
      g.fixedLength
    );
    function f(v) {
      v < 1 || v > u.value || v === o.value || i("page-change", v);
    }
    return (v, x) => s(t) ? (d(), p("nav", ue, [
      (d(), q(H(e.containerType), {
        class: c([s(a).container])
      }, {
        default: b(() => [
          S(v.$slots, "previous", {
            item: {
              isFirst: s(_),
              target: s(k),
              cssClass: [s(a).item, s(a).arrow, s(_) ? s(a).disabled : []]
            },
            emit: s(_) ? null : () => f(s(k))
          }, () => [
            r("li", null, [
              s(_) ? (d(), p("span", {
                key: 1,
                class: c([s(a).item, s(a).arrow, s(a).disabled])
              }, [
                r("span", {
                  class: c(s(a).readers)
                }, "Prev Page", 2),
                w(M)
              ], 2)) : (d(), p("a", {
                key: 0,
                onClick: x[0] || (x[0] = P((m) => f(s(k)), ["prevent"])),
                class: c([s(a).item, s(a).arrow]),
                href: "#"
              }, [
                r("span", {
                  class: c(s(a).readers)
                }, "Prev Page", 2),
                w(M)
              ], 2))
            ])
          ]),
          (d(!0), p(O, null, J(s(V), (m) => (d(), p(O, { key: m }, [
            m.isEllipsis() ? S(v.$slots, "ellipsis", {
              key: 0,
              item: { target: m.number, cssClass: [s(a).item, s(a).disabled] }
            }, () => [
              r("li", null, [
                r("span", {
                  class: c([s(a).item, s(a).disabled])
                }, "…", 2)
              ])
            ]) : m.isCurrent() ? S(v.$slots, "active", {
              key: 1,
              item: { target: m.number, cssClass: [s(a).item, s(a).active] }
            }, () => [
              r("li", null, [
                r("span", {
                  class: c([s(a).item, s(a).active]),
                  "aria-current": "page"
                }, $(m.number), 3)
              ])
            ]) : S(v.$slots, "item", {
              key: 2,
              item: { target: m.number, cssClass: [s(a).item, s(a).page] },
              emit: () => f(m.number)
            }, () => [
              r("li", null, [
                r("a", {
                  onClick: P((j) => f(m.number), ["prevent"]),
                  class: c([s(a).item, s(a).page]),
                  href: "#"
                }, $(m.number), 11, ce)
              ])
            ])
          ], 64))), 128)),
          S(v.$slots, "next", {
            item: {
              isLast: s(N),
              target: s(I),
              cssClass: [s(a).item, s(a).arrow, s(N) ? s(a).disabled : []]
            },
            emit: s(N) ? null : () => f(s(I))
          }, () => [
            r("li", null, [
              s(N) ? (d(), p("span", {
                key: 1,
                class: c([s(a).item, s(a).arrow, s(a).disabled])
              }, [
                r("span", {
                  class: c(s(a).readers)
                }, "Next Page", 2),
                w(L)
              ], 2)) : (d(), p("a", {
                key: 0,
                onClick: x[1] || (x[1] = P((m) => f(s(I)), ["prevent"])),
                class: c([s(a).item, s(a).arrow]),
                href: "#"
              }, [
                r("span", {
                  class: c(s(a).readers)
                }, "Next Page", 2),
                w(L)
              ], 2))
            ])
          ])
        ]),
        _: 3
      }, 8, ["class"]))
    ])) : K("", !0);
  }
}), ge = ["onClick"], de = /* @__PURE__ */ r("span", { "aria-hidden": "true" }, "«", -1), pe = [
  de
], me = {
  key: 1,
  class: "page-link",
  "aria-label": "Previous"
}, ve = /* @__PURE__ */ r("span", { "aria-hidden": "true" }, "«", -1), he = [
  ve
], ye = /* @__PURE__ */ r("span", { class: "page-link" }, "…", -1), be = [
  ye
], fe = { class: "page-link" }, Pe = ["onClick"], we = ["onClick"], _e = /* @__PURE__ */ r("span", { "aria-hidden": "true" }, "»", -1), Ce = [
  _e
], ke = {
  key: 1,
  class: "page-link",
  "aria-label": "Next"
}, Ne = /* @__PURE__ */ r("span", { "aria-hidden": "true" }, "»", -1), xe = [
  Ne
], Te = /* @__PURE__ */ T({
  __name: "VueginateBootstrap",
  props: {
    totalItems: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e >= 0;
      }
    },
    currentPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    itemsPerPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    pagesToShow: {
      type: Number,
      default: 2,
      validator(e) {
        return Number.isInteger(e) && e >= -1;
      }
    },
    visibleAlways: {
      type: Boolean
    },
    customStyles: {
      type: Object,
      default: () => ({})
    },
    fixedLength: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["page-change"],
  setup(e, { emit: i }) {
    function n(g) {
      i("page-change", g);
    }
    return (g, a) => (d(), q(A, {
      "total-items": e.totalItems,
      "current-page": e.currentPage,
      "items-per-page": e.itemsPerPage,
      "pages-to-show": e.pagesToShow,
      "with-default-styles": {
        container: ["pagination"],
        item: ["page-item"],
        page: [],
        active: ["active"],
        arrow: [],
        disabled: ["disabled"],
        readers: []
      },
      "custom-styles": e.customStyles,
      "visible-always": e.visibleAlways,
      "fixed-length": e.fixedLength,
      onPageChange: n
    }, {
      previous: b(({ item: t }) => [
        r("li", {
          class: c([t.cssClass])
        }, [
          t.isFirst ? (d(), p("span", me, he)) : (d(), p("a", {
            key: 0,
            class: "page-link",
            onClick: P((u) => n(t.target), ["prevent"]),
            href: "#",
            "aria-label": "Previous"
          }, pe, 8, ge))
        ], 2)
      ]),
      ellipsis: b(({ item: t }) => [
        r("li", {
          class: c([t.cssClass])
        }, be, 2)
      ]),
      active: b(({ item: t }) => [
        r("li", {
          class: c([t.cssClass]),
          "aria-current": "page"
        }, [
          r("span", fe, $(t.target), 1)
        ], 2)
      ]),
      item: b(({ item: t }) => [
        r("li", {
          class: c([t.cssClass])
        }, [
          r("a", {
            class: "page-link",
            onClick: P((u) => n(t.target), ["prevent"]),
            href: "#"
          }, $(t.target), 9, Pe)
        ], 2)
      ]),
      next: b(({ item: t }) => [
        r("li", {
          class: c([t.cssClass])
        }, [
          t.isLast ? (d(), p("span", ke, xe)) : (d(), p("a", {
            key: 0,
            class: "page-link",
            onClick: P((u) => n(t.target), ["prevent"]),
            href: "#",
            "aria-label": "Next"
          }, Ce, 8, we))
        ], 2)
      ]),
      _: 1
    }, 8, ["total-items", "current-page", "items-per-page", "pages-to-show", "custom-styles", "visible-always", "fixed-length"]));
  }
}), $e = ["onClick"], Ie = ["aria-label"], Se = ["onClick", "aria-label"], Be = ["onClick"], qe = /* @__PURE__ */ T({
  __name: "VueginateBulma",
  props: {
    totalItems: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e >= 0;
      }
    },
    currentPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    itemsPerPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    pagesToShow: {
      type: Number,
      default: 2,
      validator(e) {
        return Number.isInteger(e) && e >= -1;
      }
    },
    visibleAlways: {
      type: Boolean
    },
    customStyles: {
      type: Object,
      default: () => ({})
    },
    fixedLength: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["page-change"],
  setup(e, { emit: i }) {
    function n(g) {
      i("page-change", g);
    }
    return (g, a) => (d(), q(A, {
      class: "pagination",
      role: "navigation",
      "aria-label": "pagination",
      "total-items": e.totalItems,
      "current-page": e.currentPage,
      "items-per-page": e.itemsPerPage,
      "pages-to-show": e.pagesToShow,
      "with-default-styles": {
        container: ["pagination-list"],
        item: [],
        page: [],
        active: [],
        arrow: ["p-2"],
        disabled: ["is-disabled"],
        readers: ["is-sr-only"]
      },
      "custom-styles": e.customStyles,
      "visible-always": e.visibleAlways,
      "fixed-length": e.fixedLength,
      onPageChange: n
    }, {
      previous: b(({ item: t }) => [
        r("li", null, [
          t.isFirst ? (d(), p("span", {
            key: 1,
            class: c(["pagination-previous", [t.cssClass]])
          }, [
            w(M)
          ], 2)) : (d(), p("a", {
            key: 0,
            onClick: P((u) => n(t.target), ["prevent"]),
            class: c(["pagination-previous", [t.cssClass]])
          }, [
            w(M)
          ], 10, $e))
        ])
      ]),
      ellipsis: b(({ item: t }) => [
        r("li", null, [
          r("span", {
            class: c(["pagination-ellipsis", t.cssClass])
          }, "…", 2)
        ])
      ]),
      active: b(({ item: t }) => [
        r("li", null, [
          r("span", {
            class: c(["pagination-link is-current", t.cssClass]),
            "aria-label": `Page ${t.target}`,
            "aria-current": "page"
          }, $(t.target), 11, Ie)
        ])
      ]),
      item: b(({ item: t }) => [
        r("li", null, [
          r("a", {
            class: c(["pagination-link", t.cssClass]),
            onClick: P((u) => n(t.target), ["prevent"]),
            "aria-label": `Goto page ${t.target}`
          }, $(t.target), 11, Se)
        ])
      ]),
      next: b(({ item: t }) => [
        r("li", null, [
          t.isLast ? (d(), p("span", {
            key: 1,
            class: c(["pagination-next", [t.cssClass]])
          }, [
            w(L)
          ], 2)) : (d(), p("a", {
            key: 0,
            onClick: P((u) => n(t.target), ["prevent"]),
            class: c(["pagination-next", [t.cssClass]])
          }, [
            w(L)
          ], 10, Be))
        ])
      ]),
      _: 1
    }, 8, ["total-items", "current-page", "items-per-page", "pages-to-show", "custom-styles", "visible-always", "fixed-length"]));
  }
}), Ve = /* @__PURE__ */ T({
  __name: "VueginateTailwind",
  props: {
    totalItems: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e >= 0;
      }
    },
    currentPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    itemsPerPage: {
      type: Number,
      required: !0,
      validator(e) {
        return Number.isInteger(e) && e > 0;
      }
    },
    pagesToShow: {
      type: Number,
      default: 2,
      validator(e) {
        return Number.isInteger(e) && e >= -1;
      }
    },
    visibleAlways: {
      type: Boolean
    },
    customStyles: {
      type: Object,
      default: () => ({})
    },
    fixedLength: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["page-change"],
  setup(e, { emit: i }) {
    function n(g) {
      i("page-change", g);
    }
    return (g, a) => (d(), q(A, {
      "total-items": e.totalItems,
      "current-page": e.currentPage,
      "items-per-page": e.itemsPerPage,
      "pages-to-show": e.pagesToShow,
      "with-default-styles": {
        container: ["flex", "select-none", "gap-1", "text-xs", "font-medium", "text-gray-600"],
        item: [
          "block",
          "h-8",
          "w-8",
          "rounded",
          "border",
          "text-center",
          "leading-8",
          "[&:not(.active)]:border-gray-300",
          "[&:not(.active)]:[&:not(.disabled)]:hover:border-gray-400",
          "[&:not(.active)]:[&:not(.disabled)]:hover:bg-gray-50"
        ],
        page: [],
        active: ["active", "bg-blue-50", "text-blue-600", "border-blue-500"],
        arrow: ["arrow", "p-2"],
        disabled: ["disabled", "bg-gray-200", "opacity-50"],
        readers: ["sr-only"]
      },
      "custom-styles": e.customStyles,
      "visible-always": e.visibleAlways,
      "fixed-length": e.fixedLength,
      onPageChange: n
    }, null, 8, ["total-items", "current-page", "items-per-page", "pages-to-show", "with-default-styles", "custom-styles", "visible-always", "fixed-length"]));
  }
});
export {
  A as Vueginate,
  Te as VueginateBootstrap,
  qe as VueginateBulma,
  Ve as VueginateTailwind
};
