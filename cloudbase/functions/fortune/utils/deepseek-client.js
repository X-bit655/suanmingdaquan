var https = require('https')
var DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''

function chatCompletion(systemPrompt, userPrompt) {
  var body = JSON.stringify({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  // 使用 retry 循环，不用 async/await，改用回调 Promise 包装
  function attempt(count) {
    return new Promise(function (resolve, reject) {
      var url = new URL('https://api.deepseek.com/v1/chat/completions')
      var options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 20000,
      }

      var req = https.request(options, function (res) {
        var chunks = []
        res.on('data', function (chunk) { chunks.push(chunk) })
        res.on('end', function () {
          var text = Buffer.concat(chunks).toString('utf8')
          if (res.statusCode === 429 && count < 3) {
            setTimeout(function () { resolve(attempt(count + 1)) }, 2000 * count)
            return
          }
          if (!res.statusCode || res.statusCode >= 400) {
            reject(new Error('DeepSeek error ' + res.statusCode + ': ' + text))
            return
          }
          var data = JSON.parse(text)
          resolve(data.choices[0].message.content)
        })
      })

      req.on('error', function (e) {
        if (count < 3) {
          setTimeout(function () { resolve(attempt(count + 1)) }, 2000 * count)
        } else {
          reject(e)
        }
      })
      req.on('timeout', function () {
        req.destroy()
        if (count < 3) {
          setTimeout(function () { resolve(attempt(count + 1)) }, 2000 * count)
        } else {
          reject(new Error('DeepSeek API timeout'))
        }
      })
      req.write(body)
      req.end()
    })
  }

  return attempt(1)
}

exports.chatCompletion = chatCompletion
