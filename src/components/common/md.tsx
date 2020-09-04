/** @format */

import * as cheerio from 'cheerio'
import marked from 'marked'
import Prism from 'prismjs'
String.prototype.trim = function (): string {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
}
const langSelect = (lan: string) => {
    if (lan === undefined) {
        lan = ''
    }
    switch (lan.toLowerCase()) {
        case 'css':
        case 'style':
            return Prism.languages.css
        case 'html':
            return Prism.languages.html
        case 'markup':

        case 'xml':
            return Prism.languages.xml
        case 'svg':
            return Prism.languages.svg
        case 'mathml':
            return Prism.languages.markup
        case 'js':
        case 'javascript':
        case 'json':
        case 'python':
        case 'go':
        case 'ruby':
            return Prism.languages.javascript
        case 'c':
        case 'cpp':
        case 'c/c++':
        case 'c++':
        case 'php':
            return Prism.languages.clike
        default:
            return Prism.languages.markup
    }
}
const renderer = new marked.Renderer()
renderer.code = (code: string, infostring: string, escaped: boolean) => {
    // return `${code} ${infostring} ${escaped};`
    // console.log(Prism.languages);

    const html = Prism.highlight(code, langSelect(infostring), infostring)
    return `<pre><code class="language-${infostring}">${html}</code></pre>`
}
renderer.heading = (text: string, level: number): string => {
    const b = Buffer.from(text, 'utf-8')

    const key = b.toString('base64')

    return `
            <h${level} id=${key}>
              ${text}
            </h${level}>`
}
export interface IList {
    url: string
    author: string
    date: string
    method: string
    title: string
}

export function MDparse(md: string): string {
    return marked(md, {renderer})
}
export function SndList(html: string): IList[] {
    const $ = cheerio.load(html)
    const items: IList[] = []
    $('h2').each((i, elem) => {
        // console.log(elem.children[0].data);
        let nex = elem.next
        while (nex) {
            if (nex.name === 'ul') {
                const item = {
                    url: '',
                    author: '',
                    date: '',
                    method: '', // method.lower(),
                    title: elem.children[0].data.trim(),
                }
                nex.children.map(ele => {
                    if (ele.type === 'tag' && ele.name === 'li') {
                        ele.children.map(el => {
                            if (el.type === 'text') {
                                if (el.data.indexOf('接口地址') === 0) {
                                    // console.log('接口地址',el.next.children[0].data);
                                    item.url = el.next.children[0].data.trim()
                                }
                                if (el.data.indexOf('请求方式') === 0) {
                                    // console.log('请求方式',el.next.children[0].data);
                                    item.method = el.next.children[0].data.trim().toLowerCase()
                                }
                                if (el.data.indexOf('联系人') === 0) {
                                    // console.log('联系人',el.next.children[0].data);
                                    item.author = el.next.children[0].data.trim()
                                }
                                if (el.data.indexOf('修改时') === 0) {
                                    // console.log('修改时',el.next.children[0].data);
                                    item.date = el.next.children[0].data.trim()
                                }
                            }
                        })
                    }
                })
                items.push(item)
                break
            }
            nex = nex.next
        }
    })
    return items
}
