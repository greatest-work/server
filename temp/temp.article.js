
module.exports = TEMP_ARTICLE = async (data) => {
    return new Promise((resolve, reject) => {
        const tags = data.tags?.split(',') ?? []
        let tagStr = ``
        tags.forEach(tag => {
            tagStr += `\n  - ${tag}`
        })
        resolve(`---
title: "${data.title}"
date: ${data.createTime}
description: xxxx
tags: ${tagStr}
head:
  - - meta
    - name: headline
      content: ${data.title}
  - - meta
    - name: keywords
      content: ${data.tags}
  - - meta
    - name: datePublished
      content: ${data.createTime}
---

${data.content}
        `)
    })
}