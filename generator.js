const senderForm = document.querySelector(".sender-form");
const senderResult = document.querySelector(".sender-result");
const senderUrl = document.querySelector(".sender-url");
const senderMessage = document.querySelector(".sender-message");
const senderNote = document.querySelector(".sender-note");
const baseUrlInput = document.querySelector('input[name="baseUrl"]');
const copyMessageButton = document.querySelector("#copy-message");
const copyLinkButton = document.querySelector("#copy-link");
const previewLink = document.querySelector("#preview-link");

function defaultBaseUrl() {
  const url = new URL("index.html", window.location.href);
  return url.href;
}

function buildInviteUrl(baseUrl, guestName) {
  const url = new URL(baseUrl || defaultBaseUrl(), window.location.href);
  url.searchParams.set("to", guestName);
  url.hash = "";
  return url.toString();
}

function buildMessage(guestName, inviteUrl) {
  return `Kepada Yth.
${guestName}

Salam sejahtera bagi kita semua. Tuhan membuat segala sesuatu indah pada waktu-Nya dan mempersatukan kami dalam suatu ikatan pernikahan kudus, semoga Tuhan memberkati dalam mengiringi pernikahan kami.

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i: untuk menghadiri acara kami.

Berikut link undangan kami:

${inviteUrl}

Merupakan suatu kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

Terima kasih.
Michael Vinci & Merlin`;
}

async function copyText(value, fallbackElement) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  fallbackElement.select();
  document.execCommand("copy");
}

baseUrlInput.value = defaultBaseUrl();

senderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(senderForm);
  const guestName = formData.get("guestName").trim();
  const baseUrl = formData.get("baseUrl").trim();
  const inviteUrl = buildInviteUrl(baseUrl, guestName);

  senderResult.hidden = false;
  senderUrl.value = inviteUrl;
  senderMessage.value = buildMessage(guestName, inviteUrl);
  previewLink.href = inviteUrl;
  senderNote.textContent = "Pesan undangan berhasil dibuat.";
});

copyMessageButton.addEventListener("click", async () => {
  if (!senderMessage.value) return;

  try {
    await copyText(senderMessage.value, senderMessage);
    senderNote.textContent = "Pesan undangan berhasil disalin.";
  } catch {
    senderNote.textContent = "Silakan salin pesan secara manual.";
  }
});

copyLinkButton.addEventListener("click", async () => {
  if (!senderUrl.value) return;

  try {
    await copyText(senderUrl.value, senderUrl);
    senderNote.textContent = "Link undangan berhasil disalin.";
  } catch {
    senderNote.textContent = "Silakan salin link secara manual.";
  }
});
