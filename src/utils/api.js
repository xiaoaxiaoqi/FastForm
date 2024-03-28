import service from "@/utils/request.js";

export function apiGetObjectInfo() {
    return service.get('object_info')
}

export function apiPrompt(data = {}) {
    return service.post('prompt', data)
}

export function apiHistory(prompt_id) {
    return service.get('history/' + prompt_id)
}