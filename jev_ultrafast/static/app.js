const $ = (id) => document.getElementById(id);
const token = document.querySelector('meta[name="demo-token"]').content;
let state = null,
  busy = false,
  automatic = false,
  activeStatusKey = null;
const translations = {
  en: {
    homepage: "Homepage",
    language: "Language",
    "intro.eyebrow": "A BROWSER THAT CHOOSES",
    "intro.title": "Every page is a set of possibilities.",
    "intro.description": "Jev picks the next action. A small language model handles the words.",
    "intro.watch": "Watch the real Google Flights run ↗",
    "intro.helper": "+ text helper",
    "task.label": "Give it a task",
    "task.scenario": "Demo scenario",
    "task.website": "Website address",
    "task.websitePlaceholder": "https://example.com",
    "task.start": "Start demo",
    "scenario.flights": "Google Flights · real web",
    "scenario.12306": "铁路 12306 · real web",
    "scenario.travel": "Travel planner · fixture",
    "scenario.research": "Reading room · fixture",
    "scenario.custom": "Custom website · real web",
    "controls.slowMotion": "Slow motion",
    "controls.targets": "Targets",
    "controls.choose": "Choose next",
    "controls.execute": "Execute choice",
    "controls.auto": "Run automatically",
    "controls.pause": "Pause",
    "status.idle": "Ready to explore",
    "status.ready": "Page observed · ready for a decision",
    "status.predicted": "Choice ready · inspect or execute",
    "status.done": "Jev reports complete · inspect the page",
    "status.blocked": "Stopped · no supported next action",
    "status.opening": "Opening a fresh browser…",
    "status.comparing": "Jev is comparing the actions…",
    "status.executing": "Executing the choice…",
    "status.runningBrowser": "Running the browser…",
    "status.running": "Running…",
    "status.pausing": "Pausing after the current request…",
    "status.pausedAttention": "Paused · needs attention",
    "status.cannotReach": "Cannot reach local demo server",
    "browser.local": "Local demo browser",
    "browser.live": "LIVE",
    "browser.screenshotAlt": "Live screenshot of the controlled browser",
    "browser.isolatedTab": "Isolated demo tab",
    "browser.pipeline": "AX tree → typed actions → CDP",
    "empty.title": "Watch the decision happen.",
    "empty.description": "Start a task to see a real browser, its available actions, and the model's choice.",
    "decision.eyebrow": "NEXT ACTION",
    "decision.waiting": "Waiting for a page",
    "decision.zeroOptions": "0 options",
    "decision.elements": "{count} elements",
    "decision.chooseAction": "Choose an action",
    "decision.indexedElements": "Indexed elements",
    "decision.chooseToRank": "Choose next to rank",
    "decision.ranked": "Ranked by Jev",
    "decision.unranked": "Unranked",
    "decision.availableActions": "Available actions will appear here.",
    "decision.note": "Operation and target are separate choices in one request. Text is generated only for TYPE_TEXT.",
    "decision.checked": "checked",
    "metrics.decisionTime": "Decision time",
    "metrics.targetConfidence": "Target confidence",
    "metrics.operation": "Operation",
    "trace.title": "Decision trail",
    "trace.zeroActions": "0 actions",
    "trace.actions": "{count} actions · {seconds} s",
    "trace.export": "Export trace ↓",
    "trace.empty": "Each executed action leaves an observed result.",
    "trace.pageChanged": "Page changed",
    "trace.noChange": "No change observed",
    "modelState.summary": "What the model sees",
    "modelState.empty": "Start a demo to inspect its structured state.",
    "footer.baseline": "Browser Use × TypeSafe · Experimental baseline",
    "footer.helperLoading": "Text helper loading",
    "footer.helper": "Text helper · {model}",
    "error.requestFailed": "Request failed",
    "error.unknownScenario": "Unknown demo scenario",
    "error.goalLength": "Enter 1–2,000 characters",
    "error.websiteAddress": "Enter a valid website address",
    "error.httpWebsiteAddress": "Enter a valid HTTP(S) website address",
    "error.websiteCredentials": "Website addresses cannot include credentials",
    "error.startFirst": "Start a demo first",
    "error.stepRunning": "A browser step is already running",
    "error.requestSize": "Invalid request size",
    "error.demoFailed": "Local demo failed; no automatic retry. Reset to recover.",
  },
  zh: {
    homepage: "首页",
    language: "语言",
    "intro.eyebrow": "自主选择操作的浏览器",
    "intro.title": "每个页面，都是一组可选操作。",
    "intro.description": "Jev 负责选择下一步操作，小型语言模型只负责生成文字。",
    "intro.watch": "观看真实的 Google Flights 演示 ↗",
    "intro.helper": "+ 文本助手",
    "task.label": "输入任务",
    "task.scenario": "演示场景",
    "task.website": "网站地址",
    "task.websitePlaceholder": "https://example.com 或 example.com",
    "task.start": "开始演示",
    "scenario.flights": "Google Flights · 真实网页",
    "scenario.12306": "铁路 12306 · 真实网页",
    "scenario.travel": "旅行规划 · 本地样例",
    "scenario.research": "阅读室 · 本地样例",
    "scenario.custom": "自定义网页 · 真实网页",
    "controls.slowMotion": "慢速演示",
    "controls.targets": "显示目标",
    "controls.choose": "选择下一步",
    "controls.execute": "执行选择",
    "controls.auto": "自动运行",
    "controls.pause": "暂停",
    "status.idle": "准备探索",
    "status.ready": "已观察页面 · 可以开始决策",
    "status.predicted": "选择已就绪 · 可检查或执行",
    "status.done": "Jev 报告任务完成 · 请检查页面",
    "status.blocked": "已停止 · 没有支持的下一步操作",
    "status.opening": "正在打开新的浏览器页面…",
    "status.comparing": "Jev 正在比较可选操作…",
    "status.executing": "正在执行选择…",
    "status.runningBrowser": "正在运行浏览器…",
    "status.running": "正在运行…",
    "status.pausing": "当前请求结束后暂停…",
    "status.pausedAttention": "已暂停 · 需要处理",
    "status.cannotReach": "无法连接本地演示服务器",
    "browser.local": "本地演示浏览器",
    "browser.live": "实时",
    "browser.screenshotAlt": "受控浏览器的实时截图",
    "browser.isolatedTab": "独立演示标签页",
    "browser.pipeline": "AX 树 → 类型化操作 → CDP",
    "empty.title": "观察决策如何发生。",
    "empty.description": "启动任务后，可查看真实浏览器、当前可用操作以及模型的选择。",
    "decision.eyebrow": "下一步操作",
    "decision.waiting": "等待页面",
    "decision.zeroOptions": "0 个选项",
    "decision.elements": "{count} 个元素",
    "decision.chooseAction": "选择一个操作",
    "decision.indexedElements": "已索引元素",
    "decision.chooseToRank": "选择下一步后排序",
    "decision.ranked": "Jev 排序结果",
    "decision.unranked": "未排序",
    "decision.availableActions": "可用操作将显示在这里。",
    "decision.note": "一次请求分别选择操作和目标；仅 TYPE_TEXT 操作会生成文本。",
    "decision.checked": "选中",
    "metrics.decisionTime": "决策耗时",
    "metrics.targetConfidence": "目标置信度",
    "metrics.operation": "操作",
    "trace.title": "决策轨迹",
    "trace.zeroActions": "0 个操作",
    "trace.actions": "{count} 个操作 · {seconds} 秒",
    "trace.export": "导出轨迹 ↓",
    "trace.empty": "每个已执行操作都会留下观察结果。",
    "trace.pageChanged": "页面已变化",
    "trace.noChange": "未观察到变化",
    "modelState.summary": "模型看到的内容",
    "modelState.empty": "启动演示以查看结构化状态。",
    "footer.baseline": "Browser Use × TypeSafe · 实验基线",
    "footer.helperLoading": "正在加载文本助手",
    "footer.helper": "文本助手 · {model}",
    "error.requestFailed": "请求失败",
    "error.unknownScenario": "未知的演示场景",
    "error.goalLength": "请输入 1–2,000 个字符",
    "error.websiteAddress": "请输入有效的网站地址",
    "error.httpWebsiteAddress": "请输入有效的 HTTP(S) 网站地址",
    "error.websiteCredentials": "网站地址不能包含账号或密码",
    "error.startFirst": "请先启动演示",
    "error.stepRunning": "浏览器操作正在运行",
    "error.requestSize": "请求大小无效",
    "error.demoFailed": "本地演示失败；不会自动重试，请重置后恢复。",
  },
};
const errorKeys = {
  "Request failed": "error.requestFailed",
  "Unknown demo scenario": "error.unknownScenario",
  "Enter 1–2,000 characters": "error.goalLength",
  "Enter a valid website address": "error.websiteAddress",
  "Enter a valid HTTP(S) website address": "error.httpWebsiteAddress",
  "Website addresses cannot include credentials": "error.websiteCredentials",
  "Start a demo first": "error.startFirst",
  "A browser step is already running": "error.stepRunning",
  "Invalid request size": "error.requestSize",
  "Local demo failed; no automatic retry. Reset to recover.": "error.demoFailed",
};
let language = (() => {
  try {
    return localStorage.getItem("jev-language") === "zh" ? "zh" : "en";
  } catch {
    return "en";
  }
})();
const t = (key, values = {}) => {
  const text = translations[language][key] ?? translations.en[key] ?? key;
  return text.replace(/\{(\w+)\}/g, (_match, name) => values[name] ?? "");
};
const translatedError = (message) => (errorKeys[message] ? t(errorKeys[message]) : message);
function applyTranslations() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    element.alt = t(element.dataset.i18nAlt);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });
  document.querySelectorAll(".language-option").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
}
function setLanguage(nextLanguage) {
  const scenario = $("scenario").value;
  const hasDefaultGoal = $("goal").value === goals[language][scenario];
  language = nextLanguage === "zh" ? "zh" : "en";
  try {
    localStorage.setItem("jev-language", language);
  } catch {
    /* Language still applies when storage is unavailable. */
  }
  if (hasDefaultGoal) $("goal").value = goals[language][scenario];
  applyTranslations();
  render();
  if (busy && activeStatusKey) $("status").textContent = t(activeStatusKey);
}
const departureDate = new Date();
departureDate.setDate(departureDate.getDate() + 3);
const departureDates = {
  en: departureDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }),
  zh: departureDate.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
};
const goals = {
  en: {
    "12306": "Find high-speed trains from Beijing South to Shanghai Hongqiao tomorrow. Stop when matching trains are visible. Do not book or pay.",
    flights: `Find one-way flights from Zurich to London on ${departureDates.en}, for one adult in economy. Stop when matching flight options are visible. Do not select or book a flight.`,
    travel: "Find a Design stay in Lisbon with Free cancellation and open Casa Flora.",
    research: "Open the article about using finite choices to control browser agents.",
    custom: "",
  },
  zh: {
    "12306": "查询明天从北京南到上海虹桥的高铁车次。显示符合条件的车次列表后停止，不要预订或支付。",
    flights: `查询从苏黎世到伦敦、于 ${departureDates.zh} 出发的单程航班，乘客为一名成人，经济舱。显示符合条件的航班选项后停止，不要选择或预订航班。`,
    travel: "在里斯本查找提供免费取消的设计酒店，并打开 Casa Flora。",
    research: "打开关于使用有限选项控制浏览器智能体的文章。",
    custom: "",
  },
};
$("goal").value = goals[language][$("scenario").value];
const escape = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const percent = (value) => `${(value * 100).toFixed(value < 0.01 ? 1 : 0)}%`;
async function call(name, body = {}) {
  const response = await fetch(`/api/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Demo-Token": token },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw Error(data.error || t("error.requestFailed"));
  state = data;
  render();
  return data;
}
function controls() {
  const live = state?.page && !["done", "blocked"].includes(state.status);
  $("start").disabled = busy;
  $("scenario").disabled = busy;
  $("custom-url").disabled = busy;
  $("goal").disabled = busy;
  $("choose").disabled = busy || !live;
  $("execute").disabled = busy || !state?.decision || !live;
  $("auto").disabled = busy || !live;
  $("auto").hidden = automatic;
  $("stop").hidden = !automatic;
  $("download").disabled = !state?.history?.length;
}
async function perform(fn, statusKey) {
  if (busy) return;
  busy = true;
  activeStatusKey = statusKey;
  $("error").hidden = true;
  controls();
  $("status").textContent = t(statusKey);
  try {
    await fn();
  } catch (error) {
    automatic = false;
    try {
      state = await fetch("/api/state").then((r) => r.json());
      render();
    } catch {
      /* Preserve the original failure if the server disconnected. */
    }
    $("error").textContent = translatedError(error.message);
    $("error").hidden = false;
    $("status").textContent = t("status.pausedAttention");
  } finally {
    busy = false;
    activeStatusKey = null;
    controls();
  }
}
function render() {
  if (!state) return;
  $("helper").textContent = t("footer.helper", { model: state.text_model });
  $("plan").innerHTML = (state.plan || [])
    .map(
      (goal, i) =>
        `<div class="plan-step ${i === state.plan_index ? "current" : ""}"><span>${i < state.plan_index ? "✓" : i + 1}</span>${escape(goal)}</div>`,
    )
    .join("");
  const page = state.page,
    d =
      state.decision ||
      (state.status === "done" ? state.decisions?.at(-1) : null);
  $("status").textContent = translations.en[`status.${state.status}`]
    ? t(`status.${state.status}`)
    : state.status;
  if (!page) {
    controls();
    return;
  }
  $("empty").hidden = true;
  $("screenshot").hidden = false;
  $("screenshot").src = `data:image/jpeg;base64,${page.screenshot}`;
  $("url").textContent = page.url;
  $("page-title").textContent = page.title;
  $("action-count").textContent = t("decision.elements", { count: state.elements.length });
  const chosen = page.actions.find((a) => a.id === d?.choice);
  $("choice-title").textContent = d
    ? chosen?.label || d.choice
    : t("decision.chooseAction");
  $("latency").textContent = d ? `${d.latency_ms} ms` : "—";
  $("confidence").textContent = d?.target_confidence != null ? percent(d.target_confidence) : "—";
  $("completion").textContent = d ? d.operation : "—";
  $("ranking-note").textContent = d ? t("decision.ranked") : t("decision.unranked");
  const op = Object.entries(d?.operation_probabilities || {}).sort((a,b)=>b[1]-a[1]);
  $("operation-choices").innerHTML = op.map(([name,p]) =>
    `<span class="operation-choice ${name === d.operation ? 'best' : ''}">${escape(name)} <b>${percent(p)}</b></span>`).join('');
  const probability = e => d?.target_probabilities[e.index] ??
    Math.max(-1, ...(e.options || []).map(o=>d?.target_probabilities[o.index] ?? -1));
  const selectedIndex = d?.target?.split(':')[0];
  const elements = [...state.elements];
  if (d) elements.sort((a,b)=>probability(b)-probability(a));
  $("choices").innerHTML = elements.map(e => {
    const p = probability(e);
    return `<div class="choice ${selectedIndex === e.index ? 'best' : ''}" data-action="${escape(e.index)}"><span class="choice-id">[${escape(e.index)}]</span><div class="choice-label">${escape(e.label)}<small>${escape(e.role)} · ${escape(e.operations.join(' / '))}${e.value ? ' · '+escape(e.value) : ''}${e.checked !== undefined ? ` · ${t("decision.checked")} `+escape(e.checked) : ''}</small>${p >= 0 ? `<div class="bar" style="--probability:${p*100}%"></div>` : ''}</div><span class="probability">${p >= 0 ? percent(p) : '—'}</span></div>`;
  }).join('');
  const targets = new Map();
  for (const a of page.actions) if (a.rect && !targets.has(a.node)) targets.set(a.node, a);
  $("targets").innerHTML = [...targets.values()].map((a,i) => {
    const index=String(i+1);
    return `<div class="target ${index === selectedIndex ? 'selected' : ''}" data-action="${index}" style="left:${100*a.rect.x/page.w}%;top:${100*a.rect.y/page.h}%;width:${100*a.rect.w/page.w}%;height:${100*a.rect.h/page.h}%"><span>${index}</span></div>`;
  }).join('');
  $("targets").hidden = !$("overlays").checked;
  $("history").innerHTML = state.history.length
    ? state.history
        .map(
          (h) =>
            `<div class="trace-row"><span class="number">${String(h.step).padStart(2, "0")}</span><div>${escape(h.action)}${h.text ? ` <b>“${escape(h.text)}”</b><small>${escape(h.text_helper)}</small>` : ""}</div><span class="time">${h.latency_ms} ms · ${percent(h.probability)}</span><span class="effect">${h.page_changed ? t("trace.pageChanged") : t("trace.noChange")}</span></div>`,
        )
        .join("")
    : `<p class="muted">${t("trace.empty")}</p>`;
  $("step-count").textContent = t("trace.actions", {
    count: state.history.length,
    seconds: (state.elapsed_ms / 1000).toFixed(2),
  });
  $("model-state").textContent = JSON.stringify(
    d?.request || {
      goal: state.goal,
      url: page.url,
      text: page.text,
      actions: page.actions.map(({ rect, node, ...rest }) => rest),
    },
    null,
    2,
  );
  controls();
}
$("task-form").addEventListener("submit", (event) => {
  event.preventDefault();
  automatic = false;
  perform(
    () =>
      call("reset", {
        scenario: $("scenario").value,
        custom_url: $("custom-url").value,
        goal: $("goal").value,
      }),
    "status.opening",
  );
});
$("scenario").addEventListener("change", () => {
  $("goal").value = goals[language][$("scenario").value];
  const isCustom = $("scenario").value === "custom";
  $("custom-url-field").hidden = !isCustom;
  $("custom-url").required = isCustom;
  if (isCustom) $("custom-url").focus();
});
$("choose").addEventListener("click", () =>
  perform(() => call("predict"), "status.comparing"),
);
$("execute").addEventListener("click", () =>
  perform(
    () => call("act", { fingerprint: state.page.fingerprint }),
    "status.executing",
  ),
);
$("auto").addEventListener("click", () =>
  perform(async () => {
    automatic = true;
    controls();
    for (let i = 0; i < state.max_steps * 2 && automatic; i++) {
      $("status").textContent = t("status.running");
      if ($("pace").checked) {
        await call("predict");
        await new Promise(resolve => setTimeout(resolve, 450));
        if (!automatic) break;
        await call("act", {fingerprint: state.page.fingerprint});
      } else {
        await call("tick");
      }
      if (["done", "blocked"].includes(state.status)) break;
    }
    automatic = false;
  }, "status.runningBrowser"),
);
$("stop").addEventListener("click", () => {
  automatic = false;
  $("status").textContent = t("status.pausing");
  controls();
});
$("overlays").addEventListener("change", () => {
  $("targets").hidden = !$("overlays").checked;
});
$("choices").addEventListener("pointerover", (event) => {
  const id = event.target.closest("[data-action]")?.dataset.action;
  document
    .querySelectorAll(".target")
    .forEach((t) =>
      t.classList.toggle(
        "selected",
        t.dataset.action === id || t.dataset.action === state?.decision?.target?.split(':')[0],
      ),
    );
});
$("choices").addEventListener("pointerleave", () =>
  document
    .querySelectorAll(".target")
    .forEach((t) =>
      t.classList.toggle(
        "selected",
        t.dataset.action === state?.decision?.target?.split(':')[0],
      ),
    ),
);
$("download").addEventListener("click", () => {
  const { page, ...rest } = state;
  const blob = new Blob(
    [
      JSON.stringify(
        { ...rest, page: { ...page, screenshot: undefined } },
        null,
        2,
      ),
    ],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "typesafe-browser-trace.json";
  a.click();
  URL.revokeObjectURL(url);
});
document.querySelectorAll(".language-option").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
applyTranslations();
fetch("/api/state")
  .then((r) => r.json())
  .then((s) => {
    state = s;
    render();
  })
  .catch(() => {
    $("status").textContent = t("status.cannotReach");
  });
