import json
from difflib import get_close_matches

with open("dialogflow.json") as f:
    dialog_flow = json.load(f)

def get_response(user_input):
    user_input = user_input.lower()

    for intent, data in dialog_flow.items():
        for trigger in data.get("triggers", []):
            if trigger in user_input:
                return data["response"]

    triggers = [trigger for intent in dialog_flow for trigger in dialog_flow[intent].get("triggers", [])]
    matches = get_close_matches(user_input, triggers, n=1, cutoff=0.6)
    if matches:
        for intent, data in dialog_flow.items():
            if matches[0] in data.get("triggers", []):
                return data["response"]

    return dialog_flow["default"]["response"]