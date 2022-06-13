import { getScriptParam } from "./util";

if ('serviceWorker' in navigator) {

  const content = getScriptParam()

  const _sw_param = JSON.parse(content);

  if (_sw_param && typeof _sw_param === "object") {
    globalThis.__swb_prefs__ = _sw_param
  }
}

