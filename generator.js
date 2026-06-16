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
  return `Dear ${guestName},

With hearts full of joy and gratitude, we are delighted to announce that we are beginning a new and blessed chapter of our lives together.

By the grace of God and the blessings of our beloved families, we joyfully invite you to celebrate our wedding:

✦ Michael Vinci & Merlin ✦

Your presence would be the greatest gift and blessing to us on this beautiful occasion. May your journey to us be filled with ease, and may your attendance bring abundant joy, warmth, and good fortune to our celebration.

To open your personal invitation, please visit the link below:

${inviteUrl}

We humbly look forward to welcoming you with open arms and warm hearts. May this union bring happiness not only to us, but to all who gather in love and celebration.

With deepest gratitude and warmest wishes,
Michael Vinci & Merlin 💍`;
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
  senderNote.textContent = "✓ Invitation message generated successfully.";
});

copyMessageButton.addEventListener("click", async () => {
  if (!senderMessage.value) return;

  try {
    await copyText(senderMessage.value, senderMessage);
    senderNote.textContent = "✓ Message copied to clipboard.";
  } catch {
    senderNote.textContent = "Please copy the message manually.";
  }
});

copyLinkButton.addEventListener("click", async () => {
  if (!senderUrl.value) return;

  try {
    await copyText(senderUrl.value, senderUrl);
    senderNote.textContent = "✓ Invitation link copied to clipboard.";
  } catch {
    senderNote.textContent = "Please copy the link manually.";
  }
});
