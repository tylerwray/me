function rangeParser(string) {
  const numbers = [];
  for (const [, beginStr, endStr] of string.matchAll(/(\d+)(?:-(\d+))?/g)) {
    const [begin, end] = [beginStr, endStr].map(Number);
    numbers.push(begin);
    if (endStr !== undefined) {
      for (let num = begin + 1; num <= end; num++) {
        numbers.push(num);
      }
    }
  }
  return numbers;
}

export function calculateLinesToHighlight(meta) {
  const RE = /{([\d,-]+)}/;
  if (RE.test(meta)) {
    const strlineNumbers = RE.exec(meta)[1];
    const lineNumbers = rangeParser(strlineNumbers);
    return (index) => lineNumbers.includes(index + 1);
  } else {
    return () => false;
  }
}

export function copyToClipboard(str) {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}
