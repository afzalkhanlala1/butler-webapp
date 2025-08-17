from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext
from datetime import datetime, timedelta
import re
from typing import List, Dict, Any, Optional


def read_emails(platform: str, tool_context: ToolContext, filter_type: str = "all") -> dict:
    """
    Read emails from Gmail or Outlook with specified filtering.
    
    Args:
        platform: "gmail" or "outlook"
        filter_type: "all", "unread", "read", "urgent", "promotional"
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing email data and metadata
    """
    print(f"--- Tool: read_emails called for {platform} with filter: {filter_type} ---")
    
    # Simulate email reading - in real implementation, this would connect to Gmail/Outlook APIs
    sample_emails = [
        {
            "id": "email_001",
            "sender": "john.doe@company.com",
            "sender_name": "John Doe",
            "subject": "Q4 Project Update - Urgent Review Required",
            "date": "2024-01-15 09:30:00",
            "content": "Hi team, I need your review of the Q4 project deliverables by EOD today. The client meeting is scheduled for tomorrow morning and we need to ensure all materials are ready. Please prioritize this as it's critical for our quarterly review.",
            "priority": "high",
            "category": "urgent",
            "has_attachments": True,
            "attachments": ["Q4_Report.pdf", "Project_Timeline.xlsx"],
            "requires_response": True,
            "deadline": "2024-01-15 17:00:00"
        },
        {
            "id": "email_002", 
            "sender": "newsletter@techcompany.com",
            "sender_name": "Tech Weekly Newsletter",
            "subject": "This Week in AI: Latest Developments",
            "date": "2024-01-15 08:15:00",
            "content": "This week's top AI news: New developments in machine learning, breakthrough in natural language processing, and upcoming AI conferences. Read more about the latest trends and innovations in artificial intelligence.",
            "priority": "low",
            "category": "promotional",
            "has_attachments": False,
            "attachments": [],
            "requires_response": False,
            "deadline": None
        },
        {
            "id": "email_003",
            "sender": "sarah.wilson@client.com", 
            "sender_name": "Sarah Wilson",
            "subject": "Follow-up: Contract Discussion",
            "date": "2024-01-14 16:45:00",
            "content": "Hi, I wanted to follow up on our contract discussion from last week. I'm still interested in moving forward with the project and would like to schedule a call to discuss the next steps. When would be a good time for you?",
            "priority": "medium",
            "category": "follow-up",
            "has_attachments": False,
            "attachments": [],
            "requires_response": True,
            "deadline": "2024-01-17 17:00:00"
        }
    ]
    
    # Filter emails based on type
    if filter_type == "unread":
        filtered_emails = [email for email in sample_emails if email.get("unread", True)]
    elif filter_type == "urgent":
        filtered_emails = [email for email in sample_emails if email.get("priority") == "high"]
    elif filter_type == "promotional":
        filtered_emails = [email for email in sample_emails if email.get("category") == "promotional"]
    else:
        filtered_emails = sample_emails
    
    # Update state with email reading history
    reading_history = tool_context.state.get("email_reading_history", [])
    reading_history.append({
        "timestamp": datetime.now().isoformat(),
        "platform": platform,
        "filter": filter_type,
        "count": len(filtered_emails)
    })
    tool_context.state["email_reading_history"] = reading_history
    
    return {
        "status": "success",
        "platform": platform,
        "filter_type": filter_type,
        "emails": filtered_emails,
        "count": len(filtered_emails),
        "message": f"Successfully read {len(filtered_emails)} emails from {platform}"
    }


def summarize_emails(email_ids: List[str], tool_context: ToolContext) -> dict:
    """
    Provide detailed summaries of specified emails with key information extraction.
    
    Args:
        email_ids: List of email IDs to summarize
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing email summaries with extracted information
    """
    print(f"--- Tool: summarize_emails called for emails: {email_ids} ---")
    
    # In real implementation, this would fetch actual emails by ID
    # For now, using sample data
    sample_emails = {
        "email_001": {
            "sender": "john.doe@company.com",
            "sender_name": "John Doe",
            "subject": "Q4 Project Update - Urgent Review Required",
            "date": "2024-01-15 09:30:00",
            "content": "Hi team, I need your review of the Q4 project deliverables by EOD today. The client meeting is scheduled for tomorrow morning and we need to ensure all materials are ready. Please prioritize this as it's critical for our quarterly review.",
            "priority": "high",
            "category": "urgent",
            "has_attachments": True,
            "attachments": ["Q4_Report.pdf", "Project_Timeline.xlsx"],
            "requires_response": True,
            "deadline": "2024-01-15 17:00:00"
        }
    }
    
    summaries = []
    for email_id in email_ids:
        if email_id in sample_emails:
            email = sample_emails[email_id]
            
            # Extract key information
            keywords = extract_keywords(email["content"])
            actions = extract_actions(email["content"])
            deadlines = extract_deadlines(email["content"])
            
            summary = {
                "email_id": email_id,
                "sender": email["sender_name"],
                "sender_email": email["sender"],
                "date": email["date"],
                "subject": email["subject"],
                "priority": email["priority"],
                "category": email["category"],
                "main_content": email["content"][:200] + "..." if len(email["content"]) > 200 else email["content"],
                "keywords": keywords,
                "actions_required": actions,
                "deadlines": deadlines,
                "has_attachments": email["has_attachments"],
                "attachments": email["attachments"],
                "requires_response": email["requires_response"]
            }
            summaries.append(summary)
    
    # Update state with summary history
    summary_history = tool_context.state.get("email_summary_history", [])
    summary_history.append({
        "timestamp": datetime.now().isoformat(),
        "email_ids": email_ids,
        "count": len(summaries)
    })
    tool_context.state["email_summary_history"] = summary_history
    
    return {
        "status": "success",
        "summaries": summaries,
        "count": len(summaries),
        "message": f"Successfully summarized {len(summaries)} emails"
    }


def draft_email(recipient: str, subject: str, content: str, tool_context: ToolContext, 
                tone: str = "professional") -> dict:
    """
    Draft a new email with specified tone and content.
    
    Args:
        recipient: Email address of recipient
        subject: Email subject line
        content: Main content/context for the email
        tone: "professional", "casual", "persuasive", "empathetic"
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing the drafted email
    """
    print(f"--- Tool: draft_email called for {recipient} with tone: {tone} ---")
    
    # Generate email based on tone
    if tone == "professional":
        draft = f"""Dear {recipient.split('@')[0].replace('.', ' ').title()},

{content}

Best regards,
[Your Name]"""
    elif tone == "casual":
        draft = f"""Hi {recipient.split('@')[0].replace('.', ' ').title()}!

{content}

Cheers,
[Your Name]"""
    elif tone == "persuasive":
        draft = f"""Dear {recipient.split('@')[0].replace('.', ' ').title()},

I hope this email finds you well. I'm reaching out because {content}

I believe this opportunity would be mutually beneficial, and I'd love to discuss it further with you.

Looking forward to hearing from you.

Best regards,
[Your Name]"""
    elif tone == "empathetic":
        draft = f"""Dear {recipient.split('@')[0].replace('.', ' ').title()},

I understand that {content}

Please know that I'm here to support you through this process, and I'm committed to finding the best solution for everyone involved.

Warm regards,
[Your Name]"""
    else:
        draft = f"""Dear {recipient.split('@')[0].replace('.', ' ').title()},

{content}

Best regards,
[Your Name]"""
    
    # Update state with draft history
    draft_history = tool_context.state.get("email_draft_history", [])
    draft_history.append({
        "timestamp": datetime.now().isoformat(),
        "recipient": recipient,
        "subject": subject,
        "tone": tone,
        "draft": draft
    })
    tool_context.state["email_draft_history"] = draft_history
    
    return {
        "status": "success",
        "recipient": recipient,
        "subject": subject,
        "tone": tone,
        "draft": draft,
        "message": f"Successfully drafted email to {recipient} in {tone} tone"
    }


def categorize_emails(email_ids: List[str], categories: List[str], tool_context: ToolContext) -> dict:
    """
    Organize emails into specified categories.
    
    Args:
        email_ids: List of email IDs to categorize
        categories: List of categories to assign
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing categorization results
    """
    print(f"--- Tool: categorize_emails called for emails: {email_ids} with categories: {categories} ---")
    
    # Update state with categorization
    email_categories = tool_context.state.get("email_categories", {})
    for email_id, category in zip(email_ids, categories):
        email_categories[email_id] = category
    
    tool_context.state["email_categories"] = email_categories
    
    return {
        "status": "success",
        "categorized_emails": dict(zip(email_ids, categories)),
        "message": f"Successfully categorized {len(email_ids)} emails"
    }


def extract_calendar_events(email_ids: List[str], tool_context: ToolContext) -> dict:
    """
    Extract calendar events from emails and offer to add them to calendar.
    
    Args:
        email_ids: List of email IDs to extract events from
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing extracted events
    """
    print(f"--- Tool: extract_calendar_events called for emails: {email_ids} ---")
    
    # Sample event extraction - in real implementation, this would use NLP to extract events
    extracted_events = [
        {
            "email_id": "email_001",
            "event_title": "Q4 Project Review Meeting",
            "date": "2024-01-16",
            "time": "10:00 AM",
            "duration": "1 hour",
            "attendees": ["john.doe@company.com", "team@company.com"],
            "location": "Conference Room A",
            "description": "Quarterly project review meeting with client"
        }
    ]
    
    # Update state with extracted events
    calendar_events = tool_context.state.get("extracted_calendar_events", [])
    calendar_events.extend(extracted_events)
    tool_context.state["extracted_calendar_events"] = calendar_events
    
    return {
        "status": "success",
        "events": extracted_events,
        "count": len(extracted_events),
        "message": f"Successfully extracted {len(extracted_events)} calendar events"
    }


def detect_spam(email_ids: List[str], tool_context: ToolContext) -> dict:
    """
    Detect and flag suspicious emails as spam.
    
    Args:
        email_ids: List of email IDs to check for spam
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing spam detection results
    """
    print(f"--- Tool: detect_spam called for emails: {email_ids} ---")
    
    # Sample spam detection - in real implementation, this would use ML models
    spam_results = []
    for email_id in email_ids:
        # Simulate spam detection logic
        is_spam = email_id == "email_002"  # Newsletter marked as promotional
        spam_results.append({
            "email_id": email_id,
            "is_spam": is_spam,
            "confidence": 0.85 if is_spam else 0.15,
            "reason": "Promotional content" if is_spam else "Legitimate email"
        })
    
    # Update state with spam detection history
    spam_history = tool_context.state.get("spam_detection_history", [])
    spam_history.extend(spam_results)
    tool_context.state["spam_detection_history"] = spam_history
    
    return {
        "status": "success",
        "spam_results": spam_results,
        "spam_count": sum(1 for result in spam_results if result["is_spam"]),
        "message": f"Spam detection completed for {len(email_ids)} emails"
    }


def manage_attachments(email_id: str, action: str, tool_context: ToolContext, 
                      new_name: str = None, folder: str = None) -> dict:
    """
    Manage email attachments by describing, renaming, or organizing them.
    
    Args:
        email_id: Email ID containing attachments
        action: "describe", "rename", "organize"
        new_name: New name for attachment (for rename action)
        folder: Folder to organize into (for organize action)
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing attachment management results
    """
    print(f"--- Tool: manage_attachments called for email {email_id} with action: {action} ---")
    
    # Sample attachment data
    attachments = [
        {"name": "Q4_Report.pdf", "size": "2.5MB", "type": "PDF"},
        {"name": "Project_Timeline.xlsx", "size": "1.2MB", "type": "Excel"}
    ]
    
    if action == "describe":
        result = {
            "email_id": email_id,
            "action": action,
            "attachments": attachments,
            "description": f"Email contains {len(attachments)} attachments: {', '.join([att['name'] for att in attachments])}"
        }
    elif action == "rename" and new_name:
        result = {
            "email_id": email_id,
            "action": action,
            "old_name": attachments[0]["name"],
            "new_name": new_name,
            "message": f"Attachment renamed from {attachments[0]['name']} to {new_name}"
        }
    elif action == "organize" and folder:
        result = {
            "email_id": email_id,
            "action": action,
            "folder": folder,
            "attachments": [att["name"] for att in attachments],
            "message": f"Attachments organized into folder: {folder}"
        }
    else:
        result = {
            "email_id": email_id,
            "action": action,
            "error": "Invalid action or missing parameters"
        }
    
    # Update state with attachment management history
    attachment_history = tool_context.state.get("attachment_management_history", [])
    attachment_history.append({
        "timestamp": datetime.now().isoformat(),
        "email_id": email_id,
        "action": action,
        "result": result
    })
    tool_context.state["attachment_management_history"] = attachment_history
    
    return {
        "status": "success",
        "result": result,
        "message": f"Successfully managed attachments for email {email_id}"
    }


def track_unanswered_emails(tool_context: ToolContext) -> dict:
    """
    Track emails that require responses and remind user to respond.
    
    Args:
        tool_context: Context for accessing session state
    
    Returns:
        Dictionary containing unanswered emails
    """
    print("--- Tool: track_unanswered_emails called ---")
    
    # Sample unanswered emails
    unanswered_emails = [
        {
            "email_id": "email_001",
            "sender": "john.doe@company.com",
            "subject": "Q4 Project Update - Urgent Review Required",
            "date": "2024-01-15 09:30:00",
            "days_since_received": 1,
            "priority": "high",
            "deadline": "2024-01-15 17:00:00"
        },
        {
            "email_id": "email_003",
            "sender": "sarah.wilson@client.com",
            "subject": "Follow-up: Contract Discussion",
            "date": "2024-01-14 16:45:00",
            "days_since_received": 2,
            "priority": "medium",
            "deadline": "2024-01-17 17:00:00"
        }
    ]
    
    # Update state with unanswered email tracking
    tool_context.state["unanswered_emails"] = unanswered_emails
    
    return {
        "status": "success",
        "unanswered_emails": unanswered_emails,
        "count": len(unanswered_emails),
        "urgent_count": sum(1 for email in unanswered_emails if email["priority"] == "high"),
        "message": f"Found {len(unanswered_emails)} emails requiring responses"
    }


# Helper functions for text analysis
def extract_keywords(text: str) -> List[str]:
    """Extract important keywords from email content."""
    # Simple keyword extraction - in real implementation, use NLP
    keywords = ["urgent", "deadline", "meeting", "review", "project", "client", "important"]
    found_keywords = [word for word in keywords if word.lower() in text.lower()]
    return found_keywords


def extract_actions(text: str) -> List[str]:
    """Extract required actions from email content."""
    # Simple action extraction - in real implementation, use NLP
    action_patterns = [
        r"need your (review|approval|feedback)",
        r"please (respond|reply|confirm)",
        r"schedule a (call|meeting)",
        r"send (the|your) (report|document)"
    ]
    actions = []
    for pattern in action_patterns:
        matches = re.findall(pattern, text.lower())
        actions.extend(matches)
    return actions


def extract_deadlines(text: str) -> List[str]:
    """Extract deadlines from email content."""
    # Simple deadline extraction - in real implementation, use NLP
    deadline_patterns = [
        r"by (EOD|end of day)",
        r"by (\d{1,2}:\d{2} (AM|PM))",
        r"by (\w+ \d{1,2},? \d{4})",
        r"(\d{1,2}:\d{2} (AM|PM))"
    ]
    deadlines = []
    for pattern in deadline_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        deadlines.extend([match[0] if isinstance(match, tuple) else match for match in matches])
    return deadlines


# Create the Elite AI Email Agent
root_agent = Agent(
    name="elite_email_agent",
    model="gemini-2.0-flash",
    description="Elite AI Email Agent focused on reading and sending emails only",
    instruction="""
    You are the Elite AI Email Agent for two tasks only:
    1) READ emails
    2) SEND emails

    Do not list generic capabilities. Keep responses short and action-oriented. Maintain memory of fields during the compose flow.

    READING
    - If asked to read, clarify platform if missing (gmail/outlook). If the host has already authenticated, assume gmail.
    - For "most recent", fetch the latest message. For "unread"/"all", provide up to 5 with sender, date, subject, preview.
    - When you want the host app to fetch emails, emit only:
      {"action":"READ_EMAILS","platform":"gmail","filter":"most_recent|unread|all"}

    COMPOSE & SEND (MANDATORY)
    - On "send" or "draft": collect recipient → subject → body → tone (default professional).
    - Present the draft clearly:
      To: <recipient>\nSubject: <subject>\nTone: <tone>\n---\n<body>
    - Ask for changes; apply edits and show the revised draft.
    - Only after explicit approval, emit exactly:
      {"action":"SEND_EMAIL","recipient":"<email>","subject":"<subject>","content":"<final body>","tone":"<tone>"}
    - Do not add commentary when emitting that JSON. Never send without approval.

    OUTPUT RULES
    - Be brief and precise. Ask only what’s needed. Avoid capability lists.
    """,
    tools=[
        read_emails,
        summarize_emails,
        draft_email,
    ],
)
