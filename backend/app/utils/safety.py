PRIVATE_REQUEST_KEYWORDS = [
  "claim status",
  "check my claim",
  "claim id",
  "subscriber id",
  "insurance id",
  "policy number",
  "patient record",
  "my record",
  "date of birth",
  "dob",
  "ssn",
  "social security",
  "personal insurance",
  "my insurance",
  "my claim",
]


def normalize_text(value: str) -> str:
  return " ".join(value.split()).strip().lower()


def is_private_request(message: str) -> bool:
  normalized = normalize_text(message)
  return any(keyword in normalized for keyword in PRIVATE_REQUEST_KEYWORDS)
