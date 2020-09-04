/** @format */

import {stringify} from 'qs'
export interface JsonResult {
    error: number
    result?: any
    msg: string
}
export function checkStatus(response: Response): Response {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        const error = new Error(response.statusText)
        throw error
    }
}
export function checkErrorCode(code: number): void {
    if (code === 403) {
        location.href = '/login.shtml'
    }
}
export function contentType(key: 'json' | 'normal' | 'multipart'): Record<string, string> {
    switch (key) {
        case 'json':
            return {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        case 'normal':
            return {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
        case 'multipart':
            return {'Content-Type': 'multipart/form-data'}

        default:
            return {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'}
    }
}
export function qs(dic: object): string {
    return stringify(dic)
}
export function httpClient(
    url: string,
    method: 'GET' | 'POST',
    headers: Record<string, string>,
    body: string | FormData,
    fn: (value: JsonResult) => any,
): void {
    let chain: Promise<Response>
    switch (method) {
        case 'GET':
            chain = fetch(url, {
                credentials: 'same-origin',
                method: 'GET',
                headers,
            })
            break
        case 'POST':
            console.log(body)
            chain = fetch(url, {
                credentials: 'same-origin',
                method: 'POST',
                headers,
                body,
            })
            break
        default:
            throw new Error('undefined method')
    }
    chain
        .then(checkStatus)
        .then((response: Response) => {
            return response.json()
        })
        .then(fn)
}
