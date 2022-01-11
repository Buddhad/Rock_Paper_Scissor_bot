function Bubbles(container, self, options) {
  options = typeof options !== 'undefined' ? options : {}
  animationTime = options.animationTime || 200
  typeSpeed = options.typeSpeed || 5
  widerBy = options.widerBy || 2
  sidePadding = options.sidePadding || 6
  recallInteractions = options.recallInteractions || 0
  inputCallbackFn = options.inputCallbackFn || false
  responseCallbackFn = options.responseCallbackFn || false

  var standingAnswer = 'ice'

  var _convo = {}
  var localStorageCheck = function () {
    var test = 'chat-bubble-storage-test'
    try {
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (error) {
      console.error(
        "Your server does not allow storing data locally. Most likely it's because you've opened this page from your hard-drive. For testing you can disable your browser's security or start a localhost environment.",
      )
      return false
    }
  }
  var localStorageAvailable = localStorageCheck() && recallInteractions > 0
  var interactionsLS = 'chat-bubble-interactions'
  var interactionsHistory =
    (localStorageAvailable &&
      JSON.parse(localStorage.getItem(interactionsLS))) ||
    []

  interactionsSave = function (say, reply) {
    if (!localStorageAvailable) return

    if (interactionsHistory.length > recallInteractions)
      interactionsHistory.shift()

    if (
      say.includes('bubble-button') &&
      reply !== 'reply reply-freeform' &&
      reply !== 'reply reply-pick'
    )
      return

    // save to memory
    interactionsHistory.push({ say: say, reply: reply })
  }

  // commit save to localStorage
  interactionsSaveCommit = function () {
    if (!localStorageAvailable) return
    localStorage.setItem(interactionsLS, JSON.stringify(interactionsHistory))
  }

  // set up the stage
  container.classList.add('bubble-container')
  var bubbleWrap = document.createElement('div')
  bubbleWrap.className = 'bubble-wrap'

  container.appendChild(bubbleWrap)
  this.typeInput = function (callbackFn) {
    var inputWrap = document.createElement('div')
    inputWrap.className = 'input-wrap'
    var inputText = document.createElement('textarea')
    inputText.setAttribute('placeholder', 'Ask me anything...')
    inputWrap.appendChild(inputText)

    inputText.addEventListener('keypress', function (e) {
      if (e.keyCode == 13) {
        e.preventDefault()
        typeof bubbleQueue !== false ? clearTimeout(bubbleQueue) : false // allow user to interrupt the bot
        var lastBubble = document.querySelectorAll('.bubble.say')
        lastBubble = lastBubble[lastBubble.length - 1]
        lastBubble.classList.contains('reply') &&
        !lastBubble.classList.contains('reply-freeform')
          ? lastBubble.classList.add('bubble-hidden')
          : false
        addBubble(
          '<span class="bubble-button bubble-pick">' + this.value + '</span>',
          function () {},
          'reply reply-freeform',
        )
        // callback
        typeof callbackFn === 'function'
          ? callbackFn({
              input: this.value,
              convo: _convo,
              standingAnswer: standingAnswer,
            })
          : false
        this.value = ''
      }
    })
    container.appendChild(inputWrap)
    bubbleWrap.style.paddingBottom = '100px'
    inputText.focus()
  }
  inputCallbackFn ? this.typeInput(inputCallbackFn) : false

  var bubbleTyping = document.createElement('div')
  bubbleTyping.className = 'bubble-typing imagine'
  for (dots = 0; dots < 3; dots++) {
    var dot = document.createElement('div')
    dot.className = 'dot_' + dots + ' dot'
    bubbleTyping.appendChild(dot)
  }
  bubbleWrap.appendChild(bubbleTyping)

  this.talk = function (convo, here) {
    _convo = Object.assign(_convo, convo)

    this.reply(_convo[here])
    here ? (standingAnswer = here) : false
  }

  var iceBreaker = false
  this.reply = function (turn) {
    iceBreaker = typeof turn === 'undefined'
    turn = !iceBreaker ? turn : _convo.ice
    questionsHTML = ''
    if (!turn) return
    if (turn.reply !== undefined) {
      turn.reply.reverse()
      for (var i = 0; i < turn.reply.length; i++) {
        ;(function (el, count) {
          questionsHTML +=
            '<span class="bubble-button" style="animation-delay: ' +
            (animationTime / 2) * count +
            'ms" onClick="' +
            self +
            ".answer('" +
            el.answer +
            "', '" +
            el.question +
            "');this.classList.add('bubble-pick')\">" +
            el.question +
            '</span>'
        })(turn.reply[i], i)
      }
    }
    orderBubbles(turn.says, function () {
      bubbleTyping.classList.remove('imagine')
      questionsHTML !== ''
        ? addBubble(questionsHTML, function () {}, 'reply')
        : bubbleTyping.classList.add('imagine')
    })
  }

  this.answer = function (key, content) {
    var func = function (key, content) {
      typeof window[key] === 'function' ? window[key](content) : false
    }
    _convo[key] !== undefined
      ? (this.reply(_convo[key]), (standingAnswer = key))
      : typeof responseCallbackFn === 'function'
      ? responseCallbackFn(
          { input: key, convo: _convo, standingAnswer: standingAnswer },
          key,
        )
      : func(key, content)

    if (_convo[key] !== undefined && content !== undefined) {
      interactionsSave(
        '<span class="bubble-button reply-pick">' + content + '</span>',
        'reply reply-pick',
      )
    }
  }

  this.think = function () {
    bubbleTyping.classList.remove('imagine')
    this.stop = function () {
      bubbleTyping.classList.add('imagine')
    }
  }

  var orderBubbles = function (q, callback) {
    var start = function () {
      setTimeout(function () {
        callback()
      }, animationTime)
    }
    var position = 0
    for (
      var nextCallback = position + q.length - 1;
      nextCallback >= position;
      nextCallback--
    ) {
      ;(function (callback, index) {
        start = function () {
          addBubble(q[index], callback)
        }
      })(start, nextCallback)
    }
    start()
  }

  var bubbleQueue = false
  var addBubble = function (say, posted, reply, live) {
    reply = typeof reply !== 'undefined' ? reply : ''
    live = typeof live !== 'undefined' ? live : true
    var animationTime = live ? this.animationTime : 0
    var typeSpeed = live ? this.typeSpeed : 0

    var bubble = document.createElement('div')
    var bubbleContent = document.createElement('span')
    bubble.className = 'bubble imagine ' + (!live ? ' history ' : '') + reply
    bubbleContent.className = 'bubble-content'
    bubbleContent.innerHTML = say
    bubble.appendChild(bubbleContent)
    bubbleWrap.insertBefore(bubble, bubbleTyping)

    if (reply !== '') {
      var bubbleButtons = bubbleContent.querySelectorAll('.bubble-button')
      for (var z = 0; z < bubbleButtons.length; z++) {
        ;(function (el) {
          if (!el.parentNode.parentNode.classList.contains('reply-freeform'))
            el.style.width = el.offsetWidth - sidePadding * 2 + widerBy + 'px'
        })(bubbleButtons[z])
      }
      bubble.addEventListener('click', function (e) {
        if (e.target.classList.contains('bubble-button')) {
          for (var i = 0; i < bubbleButtons.length; i++) {
            ;(function (el) {
              el.style.width = 0 + 'px'
              el.classList.contains('bubble-pick')
                ? (el.style.width = '')
                : false
              el.removeAttribute('onclick')
            })(bubbleButtons[i])
          }
          this.classList.add('bubble-picked')
        }
      })
    }

    wait = live ? animationTime * 2 : 0
    minTypingWait = live ? animationTime * 6 : 0
    if (say.length * typeSpeed > animationTime && reply == '') {
      wait += typeSpeed * say.length
      wait < minTypingWait ? (wait = minTypingWait) : false
      setTimeout(function () {
        bubbleTyping.classList.remove('imagine')
      }, animationTime)
    }
    live &&
      setTimeout(function () {
        bubbleTyping.classList.add('imagine')
      }, wait - animationTime * 2)
    bubbleQueue = setTimeout(function () {
      bubble.classList.remove('imagine')
      var bubbleWidthCalc = bubbleContent.offsetWidth + widerBy + 'px'
      bubble.style.width = reply == '' ? bubbleWidthCalc : ''
      bubble.style.width = say.includes('<img src=')
        ? '50%'
        : bubble.style.width
      bubble.classList.add('say')
      posted()

      // save the interaction
      interactionsSave(say, reply)
      !iceBreaker && interactionsSaveCommit()

      // animate scrolling
      containerHeight = container.offsetHeight
      scrollDifference = bubbleWrap.scrollHeight - bubbleWrap.scrollTop
      scrollHop = scrollDifference / 200
      var scrollBubbles = function () {
        for (var i = 1; i <= scrollDifference / scrollHop; i++) {
          ;(function () {
            setTimeout(function () {
              bubbleWrap.scrollHeight - bubbleWrap.scrollTop > containerHeight
                ? (bubbleWrap.scrollTop = bubbleWrap.scrollTop + scrollHop)
                : false
            }, i * 5)
          })()
        }
      }
      setTimeout(scrollBubbles, animationTime / 2)
    }, wait + animationTime * 2)
  }

  // recall previous interactions
  for (var i = 0; i < interactionsHistory.length; i++) {
    addBubble(
      interactionsHistory[i].say,
      function () {},
      interactionsHistory[i].reply,
      false,
    )
  }
}

function prepHTML(options) {
  var options = typeof options !== 'undefined' ? options : {}
  var container = options.container || 'chat' // id of the container HTML element
  var relative_path = options.relative_path || './node_modules/chat-bubble/'

  window[container] = document.createElement('div')
  window[container].setAttribute('id', container)
  document.body.appendChild(window[container])

  var appendCSS = function (file) {
    var link = document.createElement('link')
    link.href = file
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.media = 'screen,print'
    document.getElementsByTagName('head')[0].appendChild(link)
  }
  appendCSS(relative_path + 'component/styles/input.css')
  appendCSS(relative_path + 'component/styles/reply.css')
  appendCSS(relative_path + 'component/styles/says.css')
  appendCSS(relative_path + 'component/styles/setup.css')
  appendCSS(relative_path + 'component/styles/typing.css')
}

if (typeof exports !== 'undefined') {
  exports.Bubbles = Bubbles
  exports.prepHTML = prepHTML
}
