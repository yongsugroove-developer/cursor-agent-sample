const messageEl = document.getElementById("message");
const form = document.getElementById("settings-form");
const runNowButton = document.getElementById("runNow");

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? "#fca5a5" : "#7dd3fc";
}

function parseRecipients(value) {
  return value
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
}

function fillForm(data) {
  document.getElementById("xEnabled").checked = data.source.xEnabled;
  document.getElementById("threadsEnabled").checked = data.source.threadsEnabled;
  document.getElementById("summaryModel").value = data.summaryModel;
  document.getElementById("scheduleTime").value = data.schedule.time;
  document.getElementById("timezone").value = data.schedule.timezone;
  document.getElementById("recipients").value = (data.recipients || []).join("\n");
  document.getElementById("smtpHost").value = data.smtp.host || "";
  document.getElementById("smtpPort").value = String(data.smtp.port || 587);
  document.getElementById("smtpSecure").checked = data.smtp.secure;
  document.getElementById("smtpUser").value = data.smtp.user || "";
  document.getElementById("smtpPass").value = data.smtp.pass || "";
  document.getElementById("smtpFrom").value = data.smtp.from || "";
}

function readForm() {
  return {
    source: {
      xEnabled: document.getElementById("xEnabled").checked,
      threadsEnabled: document.getElementById("threadsEnabled").checked
    },
    summaryModel: document.getElementById("summaryModel").value,
    schedule: {
      time: document.getElementById("scheduleTime").value,
      timezone: document.getElementById("timezone").value.trim()
    },
    recipients: parseRecipients(document.getElementById("recipients").value),
    smtp: {
      host: document.getElementById("smtpHost").value.trim(),
      port: Number(document.getElementById("smtpPort").value),
      secure: document.getElementById("smtpSecure").checked,
      user: document.getElementById("smtpUser").value.trim(),
      pass: document.getElementById("smtpPass").value,
      from: document.getElementById("smtpFrom").value.trim()
    }
  };
}

async function loadSettings() {
  const response = await fetch("/api/settings");
  const data = await response.json();
  fillForm(data);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    setMessage("저장 중...");
    const payload = readForm();
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "설정 저장 실패");
    }
    fillForm(result);
    setMessage("설정 저장 완료");
  } catch (error) {
    setMessage(error.message || "오류가 발생했습니다.", true);
  }
});

runNowButton.addEventListener("click", async () => {
  try {
    setMessage("발송 테스트 실행 중...");
    const response = await fetch("/api/run-now", { method: "POST" });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "발송 실패");
    }
    setMessage(`발송 완료 (수집 ${result.collectedCount}건)`);
  } catch (error) {
    setMessage(error.message || "오류가 발생했습니다.", true);
  }
});

loadSettings().catch(() => {
  setMessage("초기 설정 로드 실패", true);
});
