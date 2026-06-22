from typing import Literal

from ..schemas import ChatResponse, SourceCitation
from ..utils.safety import is_private_request, normalize_text


GENERAL_RESPONSE = (
  "A dental claim may be denied for several general reasons, such as missing information, "
  "inactive coverage, waiting periods, frequency limits, or missing required documentation. "
  "Please review your Explanation of Benefits or contact your dental office or insurance "
  "carrier for exact claim details."
)

SAFE_HANDOFF_RESPONSE = (
  "I'm sorry, but I can't check personal claim status or access private insurance records. "
  "For exact claim details, please contact your dental office, billing team, or insurance "
  "carrier. I can still explain general reasons why a dental claim may be delayed, rejected, "
  "or denied."
)

SOURCES = {
  "claims_faq": SourceCitation(
    title="Dental Claims FAQ",
    category="claims_faq",
    description="Answers about claim processing, timelines, and common next steps.",
  ),
  "failure_reasons": SourceCitation(
    title="Common Claim Failure Reasons",
    category="claim_failure",
    description="Examples of missing information, coverage limits, and claim issues.",
  ),
  "glossary": SourceCitation(
    title="Dental Insurance Glossary",
    category="insurance_terms",
    description="Plain-language explanations of common dental insurance terms.",
  ),
  "code_guide": SourceCitation(
    title="Dental Code Guide",
    category="dental_code_guide",
    description="Overview of procedure codes, tooth numbers, and documentation needs.",
  ),
  "documents": SourceCitation(
    title="Required Documents Guide",
    category="required_documents",
    description="Examples of attachments that may help support a claim.",
  ),
}


def _response(
  *,
  answer: str,
  sources: list[SourceCitation],
  handoff_required: bool = False,
  response_type: Literal["general_guidance", "safe_handoff", "error"] = "general_guidance",
) -> ChatResponse:
  return ChatResponse(
    answer=answer,
    sources=sources,
    handoff_required=handoff_required,
    response_type=response_type,
  )


def generate_dummy_response(message: str) -> ChatResponse:
  normalized = normalize_text(message)

  if is_private_request(message):
    return _response(
      answer=SAFE_HANDOFF_RESPONSE,
      sources=[],
      handoff_required=True,
      response_type="safe_handoff",
    )

  if any(
    phrase in normalized
    for phrase in (
      "rejected vs denied",
      "difference between rejected and denied",
      "rejected and denied",
    )
  ):
    return _response(
      answer=(
        "A rejected claim is usually not accepted for processing because information was missing "
        "or formatted incorrectly. A denied claim is usually processed but not paid because the "
        "plan rules did not allow payment.\n\n"
        "In practical terms:\n"
        "- Rejected claims often need correction and resubmission.\n"
        "- Denied claims may need review of the Explanation of Benefits or an appeal, if applicable."
      ),
      sources=[SOURCES["failure_reasons"], SOURCES["claims_faq"], SOURCES["glossary"]],
    )

  if any(
    phrase in normalized
    for phrase in (
      "pre-authorization",
      "pre authorization",
      "prior authorization",
      "prior auth",
      "preauth",
    )
  ):
    return _response(
      answer=(
        "Pre-authorization means the plan reviews a proposed treatment before care begins. It can "
        "help confirm whether a service is likely to be covered, but it is not a guarantee of "
        "payment.\n\n"
        "In general:\n"
        "- The dental office or provider usually requests it.\n"
        "- It may help reduce surprises later.\n"
        "- The final outcome still depends on the actual claim and plan rules."
      ),
      sources=[SOURCES["claims_faq"], SOURCES["glossary"], SOURCES["code_guide"]],
    )

  if any(
    phrase in normalized
    for phrase in (
      "procedure code",
      "dental procedure code",
      "dental code",
      "cdt",
      "cdt code",
    )
  ):
    return _response(
      answer=(
        "A dental procedure code identifies the service performed. It helps the plan process the "
        "claim and apply the correct benefits.\n\n"
        "In general:\n"
        "- The dental office usually selects the code based on the treatment provided.\n"
        "- An outdated or incorrect code can delay processing.\n"
        "- Some services may require supporting documents or attachments."
      ),
      sources=[SOURCES["code_guide"], SOURCES["glossary"], SOURCES["claims_faq"]],
    )

  if any(phrase in normalized for phrase in ("tooth number", "tooth numbers", "why is tooth number required")):
    return _response(
      answer=(
        "Tooth numbers help identify exactly which tooth was treated. They are often required when "
        "a procedure applies to one specific tooth or a specific area of the mouth.\n\n"
        "Why they matter:\n"
        "- They reduce claim confusion.\n"
        "- They help validate the service location.\n"
        "- They can prevent delays when the plan needs more detail."
      ),
      sources=[SOURCES["code_guide"], SOURCES["claims_faq"], SOURCES["glossary"]],
    )

  if any(
    phrase in normalized
    for phrase in ("tooth surface", "tooth surfaces", "why is tooth surface required")
  ):
    return _response(
      answer=(
        "Tooth surfaces identify the area of the tooth that was treated, such as the chewing surface "
        "or a side surface. They are often required for restorative services and similar procedures.\n\n"
        "Why they matter:\n"
        "- They help specify the exact treatment.\n"
        "- They support accurate claim review.\n"
        "- They can prevent delays or resubmission requests."
      ),
      sources=[SOURCES["code_guide"], SOURCES["claims_faq"], SOURCES["glossary"]],
    )

  if any(
    phrase in normalized
    for phrase in (
      "document",
      "attachment",
      "attachments",
      "x-ray",
      "xray",
      "supporting document",
    )
  ):
    return _response(
      answer=(
        "Common documents may include X-rays, narratives, periodontal charting, clinical notes, or "
        "other attachments that support the service.\n\n"
        "Helpful reminders:\n"
        "- Attachments can help explain why a service was needed.\n"
        "- The exact document requirements depend on the plan and procedure.\n"
        "- The dental office usually knows which supporting items are best to submit."
      ),
      sources=[SOURCES["documents"], SOURCES["claims_faq"], SOURCES["failure_reasons"]],
    )

  if any(
    phrase in normalized
    for phrase in (
      "full amount",
      "not pay",
      "coinsurance",
      "deductible",
      "annual maximum",
      "maximum",
      "copay",
      "frequency limit",
      "waiting period",
    )
  ):
    return _response(
      answer=(
        "If insurance did not pay the full amount, common general reasons include deductibles, "
        "coinsurance, annual maximums, waiting periods, frequency limits, network differences, or "
        "services that are not covered.\n\n"
        "Helpful next steps:\n"
        "- Review the Explanation of Benefits.\n"
        "- Check whether the plan used its annual maximum.\n"
        "- Confirm whether the service was covered under the plan.\n"
        "- Contact your dental office or insurance carrier for the exact explanation."
      ),
      sources=[SOURCES["glossary"], SOURCES["failure_reasons"], SOURCES["claims_faq"]],
    )

  if any(phrase in normalized for phrase in ("denied", "denial", "rejected", "rejection", "claim fail")):
    return _response(
      answer=GENERAL_RESPONSE,
      sources=[SOURCES["failure_reasons"], SOURCES["claims_faq"], SOURCES["glossary"]],
    )

  return _response(
    answer=GENERAL_RESPONSE,
    sources=[SOURCES["failure_reasons"], SOURCES["claims_faq"], SOURCES["glossary"]],
  )
